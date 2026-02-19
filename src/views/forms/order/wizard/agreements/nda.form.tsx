import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/atomic/button'
import { Checkbox } from '@/components/atomic/checkbox'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/atomic/field'
import { Input } from '@/components/atomic/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/atomic/select'
import { setAgreement } from '@/store/wizard/wizard.slice'
import { selectWizardAgreement } from '@/store/wizard/wizard.selector'
// import generateNdaPdf from '@/util/pdf/generateNdaPdf'
// import { createSigningRequest } from '@/services/doc2sign/doc2sign.service'

const NdaForm: React.FC = () => {
    const dispatch = useDispatch()
    const agreement = useSelector(selectWizardAgreement)

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [jobTitle, setJobTitle] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')
    const [businessType, setBusinessType] = useState('')
    const [city, setCity] = useState('')
    const [stateVal, setStateVal] = useState('')
    const [country, setCountry] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [billingSame, setBillingSame] = useState(false)
    const [agreeChecked, setAgreeChecked] = useState(false)

    useEffect(() => {
        const s = agreement?.signer
        if (!s) return
        if (s.fullName) {
            const parts = String(s.fullName).split(' ')
            setFirstName(parts.slice(0, -1).join(' ') || parts[0] || '')
            setLastName(parts.slice(-1).join(' ') || '')
        }
        setEmail(s.email || '')
        setCompanyName(s.company || '')
    }, [agreement])

    const handleSign = (e: React.FormEvent) => {
        e.preventDefault()
        if (!agreeChecked || !firstName || !lastName || !email || !companyName) return
        const fullName = `${firstName} ${lastName}`.trim()
        ;(async () => {
            const date = new Date().toISOString()
            const agreementData = {
                fullName,
                email,
                company: companyName,
                date,
                jobTitle,
                address1,
                address2,
                businessType,
                city,
                state: stateVal,
                country,
                postalCode,
                billingSame,
            }

            try {
                // generate PDF
                const pdfBlob = await generateNdaPdf({ fullName, email, company: companyName })

                // request signing session from doc2sign
                const resp = await createSigningRequest(pdfBlob, { fullName, email })

                // doc2sign should return a signing URL; store request info and redirect
                dispatch(setAgreement({ signed: false, signer: { ...agreementData, date }, }))

                if (resp?.signing_url) {
                    window.open(resp.signing_url, '_blank')
                } else if (resp?.sign_request_id) {
                    // fallback: open a generic doc2sign URL with id
                    window.open(`${import.meta.env.VITE_DOC2SIGN_APP_URL || 'https://www.doc2sign.com'}/sign/${resp.sign_request_id}`, '_blank')
                }
            } catch (err) {
                console.error('Signing request failed', err)
            }
        })()
    }

    return (
        <form onSubmit={handleSign}>
            <FieldGroup>
                <h2>Authorized Signatory</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="first-name">First name*</FieldLabel>
                        <Input id="first-name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        <FieldError>{!firstName ? 'First name is required' : ''}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="last-name">Last name*</FieldLabel>
                        <Input id="last-name" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        <FieldError>{!lastName ? 'Last name is required' : ''}</FieldError>
                    </Field>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">Email address*</FieldLabel>
                    <Input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <FieldError>{!email ? 'Email is required' : ''}</FieldError>
                </Field>
                <Field>
                    <FieldLabel htmlFor="job-title">Job title</FieldLabel>
                    <Input id="job-title" type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                </Field>

                <h2>Company Information</h2>
                <Field>
                    <FieldLabel htmlFor="company-name">Company name*</FieldLabel>
                    <Input id="company-name" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </Field>
                <Field>
                    <FieldLabel htmlFor="business-address">Business address*</FieldLabel>
                    <Input id="business-address-1" type="text" placeholder="Address line 1" value={address1} onChange={(e) => setAddress1(e.target.value)} />
                    <Input id="business-address-2" type="text" placeholder="Address line 2" value={address2} onChange={(e) => setAddress2(e.target.value)} />
                </Field>
                <Field>
                    <FieldLabel htmlFor="type-of-business">Type of business*</FieldLabel>
                    <Input id="type-of-business" type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)} />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="city">City*</FieldLabel>
                        <Input id="city" type="text" value={city} onChange={(e) => setCity(e.target.value)} />
                        <FieldError>{!city ? 'City is required' : ''}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="state">State*</FieldLabel>
                        <Input id="state" type="text" value={stateVal} onChange={(e) => setStateVal(e.target.value)} />
                        <FieldError>{!stateVal ? 'State is required' : ''}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="country">Country*</FieldLabel>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectGroup>
                                    <SelectItem value="United States">United States</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="postal-code">Postal code*</FieldLabel>
                        <Input id="postal-code" type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                        <FieldError>{!postalCode ? 'Postal code is required' : ''}</FieldError>
                    </Field>
                </div>

                <Field orientation="horizontal">
                    <Checkbox id="billing-checkbox" name="billing-checkbox" checked={billingSame} onCheckedChange={(v) => setBillingSame(Boolean(v))} />
                    <FieldLabel htmlFor="billing-checkbox">Billing address is the same as above.</FieldLabel>
                </Field>

                <Field orientation="horizontal">
                    <Checkbox id="agree" name="agree" checked={agreeChecked} onCheckedChange={(v) => setAgreeChecked(Boolean(v))} />
                    <FieldLabel htmlFor="agree">I agree to the terms of the NDA and electronically sign this document.</FieldLabel>
                </Field>

                {!agreement?.signed ? (
                    <Button type="submit" variant="default" size="lg" disabled={!agreeChecked || !firstName || !lastName || !email || !companyName}>
                        Sign & Continue
                    </Button>
                ) : (
                    <div className="p-3 bg-primary-alpha-10 rounded">Signed by {agreement.signer?.fullName} on {new Date(agreement.signer?.date || '').toLocaleString()}</div>
                )}

            </FieldGroup>
        </form>
    )
}

export default NdaForm