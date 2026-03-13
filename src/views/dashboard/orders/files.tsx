import pdf from '@/assets/pdf.png'
import { Download } from 'lucide-react'
import { Button } from '@/components/atomic/button'
import type { DocumentDto } from '@/services/document/document.service'

type Props = {
  doc: DocumentDto
  onDownload?: (doc: DocumentDto) => void
  isDownloading?: boolean
}

const formatBytes = (value?: number | null) => {
  const bytes = Number(value ?? 0)
  if (!Number.isFinite(bytes) || bytes <= 0) return ''
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(0)}KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)}MB`
}

const File = ({ doc, onDownload, isDownloading }: Props) => {
  const title = (doc.name || doc.filename || `Document #${doc.id}`).toString()
  const sizeLabel = formatBytes(doc.size_bytes)
  return (
    <div className='flex items-center gap-3 w-full px-3 py-2 border border-stroke-soft-200 bg-background-white-0 rounded-md'>
        <img src={pdf} alt="pdf" className='h-8' />
        <div className='w-full space-y-1'>
            <h5 className='text-sm font-medium truncate max-w-44'>{title}</h5>
            <p className='text-xs'>
              {(doc.mime_type ? doc.mime_type.toUpperCase() : 'FILE')}
              {sizeLabel ? `, ${sizeLabel}` : ''}
            </p>
        </div>
        <Button
          variant={'ghost'}
          size={'icon'}
          onClick={() => onDownload?.(doc)}
          disabled={!onDownload || isDownloading}
        >
            <Download size={24}/>
        </Button>
    </div>
  )
}

export default File