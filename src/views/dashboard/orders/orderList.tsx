import { Badge } from '@/components/atomic/badge'
import { Button } from '@/components/atomic/button'
import { Box, Calendar, Users2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const OrderList = () => {
    return (
        <div className='space-y-3'>
            <div className='flex items-center gap-3'>
                <h5 className='text-sm'>#BK-9946</h5>
                <p>Jan 18, 2026</p>
            </div>
            <div className='flex justify-between items-center p-4 bg-background-white-0 rounded-md border border-stroke-soft-200'>
                <div className='space-y-4'>
                    <h4>NOC / SOC Professionals</h4>
                    <div className='flex gap-6 items-center'>
                        <Badge variant={'success'}>Active</Badge>
                        <div className='flex gap-2 items-center'>
                            <Users2 size={14} className='opacity-50' />
                            <p>Professionals:</p>
                            <p className='text-text-strong-950 font-medium'>15</p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <Box size={14} className='opacity-50' />
                            <p>Seats occupied: </p>
                            <p className='text-text-strong-950 font-medium'>5</p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <Calendar size={14} className='opacity-50' />
                            <p>Next renewal:</p>
                            <p className='text-text-strong-950 font-medium'>Aug 18, 2026</p>
                        </div>
                    </div>
                </div>
                <Button variant={'ghost'} asChild>
                    <Link to={'/orders/details'}>
                        View details
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default OrderList