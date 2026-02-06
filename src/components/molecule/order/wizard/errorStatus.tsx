import { InfoIcon } from 'lucide-react'

const ErrorStatus = () => {
    return (
        <div className='w-full bg-error-base '>
            <div className='max-w-7xl mx-auto p-3 md:px-4 flex md:items-center gap-2 text-white'>
                <InfoIcon size={'16'} />
                <p className='text-white text-sm'>Action Required : Please assign a seat to the selected professional to proceed.</p>
            </div>
        </div>
    )
}

export default ErrorStatus