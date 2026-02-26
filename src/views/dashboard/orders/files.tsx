import pdf from '@/assets/pdf.png'
import { Download } from 'lucide-react'
import { Button } from '@/components/atomic/button'

const File = () => {
  return (
    <div className='flex items-center gap-3 w-full px-3 py-2 border border-stroke-soft-200 bg-background-white-0 rounded-md'>
        <img src={pdf} alt="pdf" className='h-8' />
        <div className='w-full space-y-1'>
            <h5 className='text-sm font-medium truncate max-w-44'>NDA-(Non-Disclosure Agreement)</h5>
            <p className='text-xs'>PDF, 32KB</p>
        </div>
        <Button variant={'ghost'} size={'icon'}>
            <Download size={24}/>
        </Button>
    </div>
  )
}

export default File