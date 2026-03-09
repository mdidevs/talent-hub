import { Badge } from '@/components/atomic/badge'
import { Button } from '@/components/atomic/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/atomic/table'
import { Download } from 'lucide-react'

const data = [
    {
        due: 'January 26, 2026 ',
        description: 'Monthly invoice', 
        amount:'$3,840.00', 
        plan: 'Pro', 
        status: 'Active'
    }, 
    {
        due: 'December 26, 2025 ',
        description: 'Monthly invoice', 
        amount:'$3,840.00', 
        plan: 'Pro', 
        status: 'Active'
    }, 
    {
        due: 'November 26, 2025',
        description: 'Monthly invoice', 
        amount:'$3,840.00', 
        plan: 'Pro', 
        status: 'Active'
    },
] 
const Invoice = () => {
  return (
    <>
    <div className='bg-background-white-0 rounded-md overflow-hidden border border-stroke-soft-200'>
                <Table>
                    <TableHeader className="bg-transparent [&_tr]:border-b-0">
                        <TableRow className='h-12'>
                            <TableHead>Due date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Invoice</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((data, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{data.due}</TableCell>
                                <TableCell>{data.description}</TableCell>
                                <TableCell>{data.amount}</TableCell>
                                <TableCell>
                                    <Badge variant={"info"}>
                                        {data.plan}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={"success"}>
                                        {data.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Button size={'icon'} variant={'ghost'}>
                                        <Download/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
    </>
  )
}

export default Invoice