import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/atomic/table'
import React from 'react'
import { useSelector } from 'react-redux'
import { selectWizardCategories, selectWizardShiftAssignments, selectWizardSeatAssignments, selectWizardSelected, selectWizardShifts } from '@/store/wizard/wizard.selector'

const ReviewOrder: React.FC = () => {
    const categories = useSelector(selectWizardCategories)
    const selected = useSelector(selectWizardSelected)
    const shiftAssignments = useSelector(selectWizardShiftAssignments)
    const shiftSeatAssignments = useSelector(selectWizardSeatAssignments)
    const shifts = useSelector(selectWizardShifts) ?? []

    // build invoice rows from seat assignments across shifts
    const rows: Array<{ service: string; seat: string; shift: string; rate: number; subtotal: number }> = []

    Object.entries(shiftSeatAssignments).forEach(([shiftKey, seats]) => {
      const shift = shifts.find((s: any) => s.key === shiftKey)
      const label = shift ? `${shift.start} - ${shift.end} (PST)` : shiftKey
      Object.entries(seats).forEach(([seatId, categoryId]) => {
        const cat = categories.find((c) => String(c.id) === String(categoryId))
        if (!cat) return
        const rate = Number(cat.price ?? 0)
        rows.push({ service: cat.title, seat: seatId, shift: label, rate, subtotal: rate })
      })
    })

    const subtotal = rows.reduce((s, r) => s + r.subtotal, 0)

    return (
        <div className='space-y-8'>
            <div className='space-y-1'>
                <h3 className='text-xl font-semibold'>Review your booking</h3>
                <p>Review your selected professional support and cubicle assignments before finalizing payment.</p>
            </div>

            <div className='bg-background-white-0 rounded-md overflow-hidden border border-stroke-soft-200'>
                <Table>
                    <TableHeader>
                        <TableRow className='h-12'>
                            <TableHead>Service</TableHead>
                            <TableHead>Seat & Shift</TableHead>
                            <TableHead>Professional Rate</TableHead>
                            <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="font-medium">{row.service}</TableCell>
                                <TableCell>{row.seat} — {row.shift}</TableCell>
                                <TableCell>${row.rate} / day</TableCell>
                                <TableCell className="text-right">${row.subtotal.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className='flex justify-end p-4 bg-primary-alpha-10'>
                    <div className='w-full md:w-64 space-y-3'>
                        <div className='flex justify-between'>
                            <p>Subtotal</p>
                            <p className='text-text-strong-950 font-medium'>${subtotal.toFixed(2)}</p>
                        </div>
                        <div className='flex justify-between'>
                            <p>Tax</p>
                            <p className='text-text-strong-950 font-medium'>$0.00</p>
                        </div>
                        <div className='flex justify-between pt-4 border-t border-stroke-sub-300'>
                            <p className='text-text-strong-950 text-lg font-medium'>Total</p>
                            <p className='text-text-strong-950 text-lg font-medium'>${subtotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewOrder
