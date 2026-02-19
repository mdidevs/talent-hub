export type Signer = { fullName: string; email: string }

export async function createSigningRequest(file: Blob, signer: Signer, returnUrl = window.location.origin) {
  const apiUrl = import.meta.env.VITE_DOC2SIGN_API_URL || 'https://api.doc2sign.com'
  const apiKey = import.meta.env.VITE_DOC2SIGN_API_KEY

  const fd = new FormData()
  fd.append('file', file, 'nda.pdf')
  fd.append('signer_name', signer.fullName)
  fd.append('signer_email', signer.email)
  fd.append('return_url', returnUrl)

  const res = await fetch(`${apiUrl}/v1/signing_requests`, {
    method: 'POST',
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
    body: fd,
  })

  const payload = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(payload?.message || 'Doc2Sign request failed')

  return payload
}

export default { createSigningRequest }
