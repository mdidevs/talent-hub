import { Button } from "@/components/atomic/button"
import { Field, FieldError, FieldGroup, FieldLabel, } from "@/components/atomic/field"
import { Input } from "@/components/atomic/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/atomic/select"
import { Camera } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { authService } from "@/services/auth/auth.service"
import type { User } from "@/types/auth.type"

const Account = () => {
    const [me, setMe] = useState<User | null>(null)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        jobTitle: "",
        companyName: "",
        businessAddress1: "",
        businessAddress2: "",
        businessCategory: "",
        // available but not yet placed in UI (we'll still fetch it)
        workEmail: "",
        workPhone: "",
    })

    const primaryCompany = useMemo(() => {
        return me?.customer?.companies?.[0] ?? null
    }, [me])

    useEffect(() => {
        let cancelled = false

        const run = async () => {
            setLoading(true)
            try {
                const payload = await authService.me()
                if (cancelled) return
                setMe(payload)

                const firstName = payload.first_name ?? payload.customer?.first_name ?? ""
                const lastName = payload.last_name ?? payload.customer?.last_name ?? ""
                const email = payload.email ?? ""

                const companyName = payload.customer?.companies?.[0]?.company?.name ?? ""
                const businessAddress1 = payload.customer?.companies?.[0]?.company?.address ?? ""
                const businessCategory = payload.customer?.companies?.[0]?.company?.category ?? ""

                const jobTitle = payload.customer?.companies?.[0]?.customer_job_title ?? ""
                const workEmail = payload.customer?.companies?.[0]?.customer_work_email ?? ""
                const workPhone = payload.customer?.companies?.[0]?.customer_work_phone ?? ""

                setForm((prev) => ({
                    ...prev,
                    firstName,
                    lastName,
                    email,
                    jobTitle,
                    companyName,
                    businessAddress1,
                    businessCategory,
                    workEmail,
                    workPhone,
                }))
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        run()
        return () => {
            cancelled = true
        }
    }, [])

    return (
        <div className='space-y-4 md:space-y-16'>
            <div>
                <h5>Business</h5>
                <p>View and update your business details</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <h5 className="w-5/12">Profile photo</h5>
                <div className="w-7/12">
                    <Button variant={"tertiary"} className="h-16 w-16 flex items-center justify-center rounded-full">
                        <Camera size={18} />
                    </Button>
                </div>
            </div>

            {/* Authorized Signatory */}
            <div className="flex flex-col md:flex-row gap-4">
                <h5 className="md:w-5/12">Authorized Signatory</h5>
                <div className="md:w-7/12">
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor="first name">Full name*</FieldLabel>
                                <Input
                                    id="first name"
                                    type="text"
                                    value={form.firstName}
                                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                                    disabled={loading}
                                />
                                <FieldError></FieldError>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="last name">Last name*</FieldLabel>
                                <Input
                                    id="last name"
                                    type="text"
                                    value={form.lastName}
                                    onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                                    disabled={loading}
                                />
                                <FieldError></FieldError>
                            </Field>
                        </div>
                        <Field>
                            <FieldLabel htmlFor="email">Email address*</FieldLabel>
                            <Input
                                id="email"
                                type="text"
                                value={form.email}
                                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                disabled={loading}
                            />
                            <FieldError></FieldError>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="job-title">Job title*</FieldLabel>
                            <Input
                                id="job-title"
                                type="text"
                                value={form.jobTitle}
                                onChange={(e) => setForm((p) => ({ ...p, jobTitle: e.target.value }))}
                                disabled={loading}
                            />
                        </Field>
                    </FieldGroup>
                    {!!primaryCompany?.customer_work_email || !!primaryCompany?.customer_work_phone ? (
                        <div className="mt-3 text-sm text-muted-foreground">
                            {primaryCompany?.customer_work_email ? <div>Work email: {primaryCompany.customer_work_email}</div> : null}
                            {primaryCompany?.customer_work_phone ? <div>Work phone: {primaryCompany.customer_work_phone}</div> : null}
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Company Information */}
            <div className="flex flex-col md:flex-row gap-4">
                <h5 className="md:w-5/12">Company Information</h5>
                <div className="md:w-7/12">
                    <FieldGroup>
                        <Field>
                    <FieldLabel htmlFor="companey-name">Company name*</FieldLabel>
                    <Input
                        id="companey-name"
                        type="text"
                        value={form.companyName}
                        onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                        disabled={loading}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="business-address">Business address*</FieldLabel>
                    <Input
                        id="business-address"
                        type="text"
                        placeholder="Address line 1"
                        value={form.businessAddress1}
                        onChange={(e) => setForm((p) => ({ ...p, businessAddress1: e.target.value }))}
                        disabled={loading}
                    />
                    <Input
                        id="business-address"
                        type="text"
                        placeholder="Address line 2"
                        value={form.businessAddress2}
                        onChange={(e) => setForm((p) => ({ ...p, businessAddress2: e.target.value }))}
                        disabled={loading}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="type-of-business">Type of business*</FieldLabel>
                    <Input
                        id="type-of-business"
                        type="text"
                        value={form.businessCategory}
                        onChange={(e) => setForm((p) => ({ ...p, businessCategory: e.target.value }))}
                        disabled={loading}
                    />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="city">City*</FieldLabel>
                        <Input
                            id="city"
                            type="text"
                            disabled={loading}
                        />
                        <FieldError></FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="state">state*</FieldLabel>
                        <Input
                            id="state"
                            type="text"
                            disabled={loading}
                        />
                        <FieldError></FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="postel-code">Country*</FieldLabel>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectGroup>
                                    <SelectItem value="United States">United States</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="Srilanka">Srilanka</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="postel-code">Postal code*</FieldLabel>
                        <Input
                            id="postel-code"
                            type="text"
                            disabled={loading}
                        />
                        <FieldError></FieldError>
                    </Field>
                </div>
                    </FieldGroup>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="submit" variant="secondary" size="lg">Cancel</Button>
                <Button type="submit" variant="default" size="lg">Save changes</Button>
            </div>
        </div>
    )
}

export default Account