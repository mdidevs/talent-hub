import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/atomic/table'
import React from 'react'

const invoices = [
  {
    service: "NOC L1 Support Engineer ",
    seat: "A26",
    shift: "09:00 AM - 05:00 PM (PST)",
    rate: "$32",
    subtotal: "$640.00",
  },
  {
    service: "NOC L1 Support Engineer ",
    seat: "A26",
    shift: "09:00 AM - 05:00 PM (PST)",
    rate: "$32",
    subtotal: "$640.00",
  },
  {
    service: "NOC L1 Support Engineer ",
    seat: "A26",
    shift: "09:00 AM - 05:00 PM (PST)",
    rate: "$32",
    subtotal: "$640.00",
  },
  {
    service: "NOC L1 Support Engineer ",
    seat: "A26",
    shift: "09:00 AM - 05:00 PM (PST)",
    rate: "$32",
    subtotal: "$640.00",
  },
  {
    service: "NOC L1 Support Engineer ",
    seat: "A26",
    shift: "09:00 AM - 05:00 PM (PST)",
    rate: "$32",
    subtotal: "$640.00",
  },
  {
    service: "NOC L1 Support Engineer ",
    seat: "A26",
    shift: "09:00 AM - 05:00 PM (PST)",
    rate: "$32",
    subtotal: "$640.00",
  },
  {
    service: "NOC L1 Support Engineer ",
    seat: "A26",
    shift: "09:00 AM - 05:00 PM (PST)",
    rate: "$32",
    subtotal: "$640.00",
  },
  
]
const ReviewOrder: React.FC = () => {
    //   const handleSubmit = () => {
    //     // TODO: integrate auth service
    //   }

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
                        {invoices.map((invoice, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="font-medium">{invoice.service}</TableCell>
                                <TableCell>{invoice.seat}{invoice.shift}</TableCell>
                                <TableCell>{invoice.rate} / day</TableCell>
                                <TableCell className="text-right">{invoice.subtotal}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    {/* <TableFooter>
                        <TableRow className='border-0 hover:shadow-none'>
                            <TableCell colSpan={3} className="text-right py-2">Subtotal</TableCell>
                            <TableCell className="text-right py-2 ">$3,840.00</TableCell>
                        </TableRow>
                        <TableRow className='border-0 hover:shadow-none'>
                            <TableCell colSpan={3} className="text-right py-2">Tax</TableCell>
                            <TableCell className="text-right py-2 ">$0.00</TableCell>
                        </TableRow>
                        <TableRow className='hover:shadow-none'>
                            <TableCell colSpan={3} className="text-right text-lg">Total Due</TableCell>
                            <TableCell className="text-right text-lg">$3,840.00</TableCell>
                        </TableRow>
                    </TableFooter> */}
                </Table>
                <div className='flex justify-end p-4 bg-primary-alpha-10'>
                    <div className='w-full md:w-64 space-y-3'>
                        <div className='flex justify-between'>
                            <p>Subtotal</p>
                            <p className='text-text-strong-950 font-medium'>$3,840.00</p>
                        </div>
                        <div className='flex justify-between'>
                            <p>Tax</p>
                            <p className='text-text-strong-950 font-medium'>$0.00</p>
                        </div>
                        <div className='flex justify-between pt-4 border-t border-stroke-sub-300'>
                            <p className='text-text-strong-950 text-lg font-medium'>Total</p>
                            <p className='text-text-strong-950 text-lg font-medium'>$3,840.00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewOrder
