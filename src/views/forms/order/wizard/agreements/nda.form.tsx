import { Button } from "@/components/atomic/button"
import { Checkbox } from "@/components/atomic/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel, } from "@/components/atomic/field"
import { Input } from "@/components/atomic/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/atomic/select"
import { type FormEvent, useEffect, useRef, useState } from "react"

const DOCUSIGN_ENVELOPES_URL = "http://localhost:3000/api/v1/docusign/envelopes"
const getDocusignEnvelopeDocumentUrl = (envelopeId: string, documentId: string) =>
    `${DOCUSIGN_ENVELOPES_URL}/${encodeURIComponent(envelopeId)}/documents/${encodeURIComponent(documentId)}`
const DEFAULT_DOCUSIGN_DOCUMENT_ID = "1"
const DOCUSIGN_RETURN_URL = "http://localhost:5173/docusign/signed"

function getHttpErrorSummary(err: unknown): string {
    if (err instanceof Error) return err.message
    if (typeof err !== "object" || err === null) return "Something went wrong."

    const anyErr = err as {
        message?: unknown
        response?: { status?: unknown; data?: unknown }
        request?: unknown
    }

    const status = typeof anyErr.response?.status === "number" ? anyErr.response.status : undefined
    const data = anyErr.response?.data

    const messageFromData =
        typeof data === "string"
            ? data
            : typeof (data as { message?: unknown } | undefined)?.message === "string"
              ? (data as { message: string }).message
              : undefined

    const baseMessage = messageFromData ?? (typeof anyErr.message === "string" ? anyErr.message : "Request failed.")

    if (status) return `${status} - ${baseMessage}`
    // No response usually means network/CORS
    if (anyErr.request) return `Network/CORS - ${baseMessage}`
    return baseMessage
}

async function postDocusignEnvelope(params: {
    token: string
    signerEmail: string
    signerName: string
    embeddedSigning: boolean
    returnUrl: string
    documentId: string
    values: Record<string, unknown>
}) {
    const res = await fetch(DOCUSIGN_ENVELOPES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${params.token}`,
        },
        body: JSON.stringify({
            signerEmail: params.signerEmail,
            signerName: params.signerName,
            embeddedSigning: params.embeddedSigning,
            returnUrl: params.returnUrl,
            documentId: params.documentId,
            values: params.values,
        }),
    })

    const contentType = res.headers.get("content-type") ?? ""
    const payload =
        contentType.includes("application/json") ? await res.json().catch(() => null) : await res.text().catch(() => "")

    if (!res.ok) {
        const msg =
            typeof payload === "string"
                ? payload
                : typeof payload?.message === "string"
                  ? payload.message
                  : `Request failed with status ${res.status}`
        throw new Error(`${res.status} - ${msg}`)
    }

    return payload
}

async function fetchDocusignEnvelopeDocumentPdf(params: { token: string; envelopeId: string; documentId: string }) {
    const url = getDocusignEnvelopeDocumentUrl(params.envelopeId, params.documentId)
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${params.token}`,
            Accept: "application/pdf",
        },
    })

    if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`${res.status} - ${text || "Failed to fetch document PDF"}`)
    }

    const blob = await res.blob()
    return blob
}

function findAgreementPreviewHost(): HTMLElement | null {
    // For now, locate the existing preview panel by its initial label text.
    // Later you can refactor this to a proper shared state between view + form.
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("div"))
    return (
        nodes.find((n) => n.dataset.agreementPreviewHost === "true") ??
        nodes.find((n) => n.textContent?.trim() === "Agreement Preview") ??
        null
    )
}

function renderAgreementPreview(params: { status?: string; pdfObjectUrl?: string; error?: string; signUrl?: string }) {
    const host = findAgreementPreviewHost()
    if (!host) return

    host.dataset.agreementPreviewHost = "true"
    host.innerHTML = ""

    const wrapper = document.createElement("div")
    wrapper.className = "h-full w-full flex flex-col gap-3"

    const header = document.createElement("div")
    header.className = "flex items-center justify-between gap-2"

    const title = document.createElement("div")
    title.className = "font-semibold"
    title.textContent = "Agreement Preview"

    const rightSide = document.createElement("div")
    rightSide.className = "flex items-center gap-2"

    const status = document.createElement("div")
    status.className = "text-xs text-muted-foreground"
    status.textContent = params.error ? params.error : (params.status ?? "")
    rightSide.append(status)

    if (params.signUrl) {
        const btn = document.createElement("button")
        btn.type = "button"
        btn.className =
            "h-8 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50"
        btn.textContent = "Sign"
        btn.addEventListener("click", () => {
            window.open(params.signUrl as string, "_blank", "noopener,noreferrer")
        })
        rightSide.append(btn)
    }

    header.append(title, rightSide)
    wrapper.append(header)

    if (params.pdfObjectUrl) {
        const iframe = document.createElement("iframe")
        iframe.src = params.pdfObjectUrl
        iframe.title = "Agreement PDF preview"
        iframe.className = "w-full flex-1 rounded-md border border-border bg-background"
        iframe.style.minHeight = "70vh"
        wrapper.append(iframe)
    } else {
        const placeholder = document.createElement("div")
        placeholder.className = "flex-1 rounded-md border border-dashed border-border bg-background p-4 text-sm text-muted-foreground"
        placeholder.textContent = params.error ? "Unable to load preview." : "Preview will appear here after Continue."
        placeholder.style.minHeight = "70vh"
        wrapper.append(placeholder)
    }

    host.append(wrapper)
}

const NdaForm = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [country, setCountry] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const previewUrlRef = useRef<string | null>(null)

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current)
                previewUrlRef.current = null
            }
        }
    }, [])

    const onContinue = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (isSubmitting) return

        setIsSubmitting(true)
        renderAgreementPreview({ status: "Preparing agreement…" })

        try {
            const form = e.currentTarget
            const fd = new FormData(form)
            const getValue = (name: string) => (fd.get(name)?.toString() ?? "").trim()

            const signerName = `${firstName} ${lastName}`.trim() || "Authorized Signatory"
            const signerEmail = email.trim()

            const token = localStorage.getItem("token")
            if (!token) {
                renderAgreementPreview({ error: `401 - Missing token (${DOCUSIGN_ENVELOPES_URL})` })
                return
            }

            renderAgreementPreview({ status: "Creating envelope…" })

            const values = {
                effectiveDate: getValue("effectiveDate") || new Date().toISOString().slice(0, 10),
                signatoryFirstName: firstName,
                signatoryLastName: lastName,
                companyName: getValue("companyName"),
                typeOfBusiness: getValue("typeOfBusiness"),
                jobTitle: getValue("jobTitle"),
                workEmail: signerEmail,
                monthlyFee: getValue("monthlyFee"),
                confidentialityYears: getValue("confidentialityYears"),
                providerName: getValue("providerName"),
                providerAddress: getValue("providerAddress"),
                businessAddressLine1: getValue("businessAddressLine1"),
                businessAddressLine2: getValue("businessAddressLine2"),
                city: getValue("city"),
                state: getValue("state"),
                zipCode: getValue("zipCode"),
                country,
            }

            const res = await postDocusignEnvelope({
                token,
                signerEmail: signerEmail || "signer@example.com",
                signerName,
                embeddedSigning: true,
                returnUrl: DOCUSIGN_RETURN_URL,
                documentId: "msa",
                values,
            })

            const envelopeId =
                (typeof res?.envelopeId === "string" && res.envelopeId) ||
                (typeof res?.envelope?.envelopeId === "string" && res.envelope.envelopeId) ||
                (typeof res?.data?.envelopeId === "string" && res.data.envelopeId) ||
                null

            // Prefer signing URL from response (embedded signing).
            const signUrl =
                (typeof res?.signingUrl === "string" && res.signingUrl) ||
                (typeof res?.recipientViewUrl === "string" && res.recipientViewUrl) ||
                (typeof res?.signUrl === "string" && res.signUrl) ||
                (typeof res?.url === "string" && res.url) ||
                (envelopeId ? `https://appdemo.docusign.com/documents/details/${envelopeId}` : undefined)

            const documentIdForFetch =
                (typeof res?.docusignDocumentId === "string" && res.docusignDocumentId) ||
                (typeof res?.documentId === "string" && res.documentId) ||
                (typeof res?.document?.documentId === "string" && res.document.documentId) ||
                (typeof res?.documents?.[0]?.documentId === "string" && res.documents[0].documentId) ||
                DEFAULT_DOCUSIGN_DOCUMENT_ID

            if (!envelopeId) {
                renderAgreementPreview({ error: `Envelope created but no envelopeId returned (${DOCUSIGN_ENVELOPES_URL})` })
                return
            }

            renderAgreementPreview({ status: "Loading PDF…", signUrl })
            const blob = await fetchDocusignEnvelopeDocumentPdf({
                token,
                envelopeId,
                documentId: documentIdForFetch,
            })

            const docPdfUrl = URL.createObjectURL(blob)
            if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
            previewUrlRef.current = docPdfUrl

            renderAgreementPreview({
                status: `Loaded (${getDocusignEnvelopeDocumentUrl(envelopeId, documentIdForFetch)})`,
                pdfObjectUrl: docPdfUrl,
                signUrl,
            })
        } catch (err) {
            const message = getHttpErrorSummary(err)
            renderAgreementPreview({
                error: `${message} (${DOCUSIGN_ENVELOPES_URL})`,
                pdfObjectUrl: previewUrlRef.current ?? undefined,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={onContinue}>
            <FieldGroup>
                <h2>Authorized Signatory</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="first name">Full name*</FieldLabel>
                        <Input
                            id="first name"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <FieldError></FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="last name">Last name*</FieldLabel>
                        <Input
                            id="last name"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <FieldError></FieldError>
                    </Field>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">Email address*</FieldLabel>
                    <Input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FieldError></FieldError>
                </Field>
                <Field>
                    <FieldLabel htmlFor="job-title">Job title*</FieldLabel>
                    <Input
                        id="job-title"
                        type="text"
                        name="jobTitle"
                    />
                </Field>
                <h2>Company Information</h2>
                <Field>
                    <FieldLabel htmlFor="companey-name">Company name*</FieldLabel>
                    <Input
                        id="companey-name"
                        type="text"
                        name="companyName"
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="business-address">Business address*</FieldLabel>
                    <Input
                        id="business-address-line1"
                        type="text"
                        placeholder="Address line 1"
                        name="businessAddressLine1"
                    />
                    <Input
                        id="business-address-line2"
                        type="text"
                        placeholder="Address line 2"
                        name="businessAddressLine2"
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="type-of-business">Type of business*</FieldLabel>
                    <Input
                        id="type-of-business"
                        type="text"
                        name="typeOfBusiness"
                    />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="city">City*</FieldLabel>
                        <Input
                            id="city"
                            type="text"
                            name="city"
                        />
                        <FieldError></FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="state">state*</FieldLabel>
                        <Input
                            id="state"
                            type="text"
                            name="state"
                        />
                        <FieldError></FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="postel-code">Country*</FieldLabel>
                        <Select value={country} onValueChange={setCountry}>
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
                        <input type="hidden" name="country" value={country} />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="postel-code">Postal code*</FieldLabel>
                        <Input
                            id="postel-code"
                            type="text"
                            name="zipCode"
                        />
                        <FieldError></FieldError>
                    </Field>
                </div>

                <Field orientation="horizontal">
                    <Checkbox id="billing-checkbox" name="billing-checkbox" />
                    <FieldLabel htmlFor="billing-checkbox">Billing address is the same as above.</FieldLabel>
                </Field>
                
                <Button type="submit" variant="default" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Loading…" : "Continue"}
                </Button>

            </FieldGroup>
        </form>

    )
}

export default NdaForm