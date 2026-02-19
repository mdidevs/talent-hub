import { PDFDocument, StandardFonts } from 'pdf-lib'

export async function generateNdaPdf(data: { fullName?: string; email?: string; company?: string; body?: string }) {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595, 842])
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const lines = [] as string[]
  lines.push('Non-Disclosure Agreement')
  lines.push('')
  lines.push(data.body || 'This NDA governs the exchange of confidential information between the parties.')
  lines.push('')
  lines.push(`Signed by: ${data.fullName || ''}`)
  lines.push(`Email: ${data.email || ''}`)
  lines.push(`Company: ${data.company || ''}`)

  const fontSize = 11
  let y = 800
  for (const line of lines) {
    page.drawText(line, { x: 48, y, size: fontSize, font })
    y -= fontSize + 6
  }

  const pdfBytes = await pdfDoc.save()
  return new Blob([pdfBytes], { type: 'application/pdf' })
}

export default generateNdaPdf
