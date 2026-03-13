import { Badge } from '@/components/atomic/badge'
import { Button } from '@/components/atomic/button'
import { Box, Calendar, Users2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { OrderDto } from '@/services/order/order.service'

type Props = {
    order: OrderDto
}

const formatDate = (value?: string) => {
    if (!value) return ''
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const sumQty = (order: OrderDto) =>
    (order.order_items ?? []).reduce((sum, it) => sum + Number(it.quantity ?? 0), 0)

const getStatusVariant = (status?: string) => {
    const s = (status ?? '').toLowerCase()
    if (['active', 'paid', 'completed', 'success', 'succeeded'].includes(s)) return 'success'
    if (['failed', 'cancelled', 'canceled', 'refunded'].includes(s)) return 'destructive'
    return 'secondary'
}

const OrderList = ({ order }: Props) => {
    const professionals = sumQty(order)
    const createdLabel = formatDate(order.createdAt) || formatDate(order.updatedAt)
    const orderCode = `#BK-${order.id}`
    return (
        <div className='space-y-3'>
            <div className='flex items-center gap-3'>
                <h5 className='text-sm'>{orderCode}</h5>
                {createdLabel ? <p>{createdLabel}</p> : null}
            </div>
            <div className='flex justify-between items-center p-4 bg-background-white-0 rounded-md border border-stroke-soft-200'>
                <div className='space-y-4'>
                    <h4>Order</h4>
                    <div className='flex gap-6 items-center'>
                        <Badge variant={getStatusVariant(order.status)}>
                            {order.status}
                        </Badge>
                        <div className='flex gap-2 items-center'>
                            <Users2 size={14} className='opacity-50' />
                            <p>Professionals:</p>
                            <p className='text-text-strong-950 font-medium'>{professionals}</p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <Box size={14} className='opacity-50' />
                            <p>Seats occupied: </p>
                            <p className='text-text-strong-950 font-medium'>{professionals}</p>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <Calendar size={14} className='opacity-50' />
                            <p>Total:</p>
                            <p className='text-text-strong-950 font-medium'>
                                {order.currency} {Number(order.total_amount ?? 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
                <Button variant={'ghost'} asChild>
                    <Link to={`/orders/details/${order.id}`}>
                        View details
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default OrderList