import { Badge } from "@/components/atomic/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/atomic/table'
import File from "./files"
import { Separator } from "@/components/atomic/separator"
import RenewModal from "./renewModal"


const data = [
    {
        service: 'NOC',
        role: 'L1 Support Engineer', 
        shift:'Morning - 09:00 AM - 05:00 PM (PST)', 
        workspace: 'A- 53', 
        status: 'Active'
    },
    {
        service: 'NOC',
        role: 'L2 Support Engineer', 
        shift:'Evening - 05:00 PM - 01:00 AM (PST)', 
        workspace: 'A- 53', 
        status: 'Active'
    },
    {
        service: 'SOC',
        role: 'Network Administrator', 
        shift:'Night - 01:00 AM - 09:00 AM (PST)', 
        workspace: 'A- 53', 
        status: 'Active'
    },
    {
        service: 'SOC',
        role: 'System Analyst', 
        shift:'Night - 01:00 AM - 09:00 PM (PST)', 
        workspace: 'A- 64', 
        status: 'Active'
    },   
] 
const OrderDetailsView = () => {
    return (
        <div className="p-4">
            <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-normal">#BK-9840</h1>
                    <p>4 Professionals</p>
                </div>
                <RenewModal/>
            </div>
            
            <div className='bg-background-white-0 rounded-md overflow-hidden border border-stroke-soft-200'>
                <Table>
                    <TableHeader className="bg-transparent [&_tr]:border-b-0">
                        <TableRow className='h-12'>
                            <TableHead>Service</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Shift</TableHead>
                            <TableHead>Workspace</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((data, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{data.service}</TableCell>
                                <TableCell>{data.role}</TableCell>
                                <TableCell>{data.shift}</TableCell>
                                <TableCell className="text-info-base">{data.workspace}</TableCell>
                                <TableCell>
                                    <Badge variant={"success"}>
                                        {data.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="my-8 flex flex-col lg:flex-row gap-6 w-full">
                <div className="lg:w-4/12 space-y-3">
                    <h5 className="text-text-sub-600 font-normal">Documents</h5>
                    <div className="flex flex-wrap gap-2">
                        <File/>
                        <File/>
                        <File/>
                    </div>
                </div>

                <div className="lg:w-4/12 space-y-3">
                    <h5 className="text-text-sub-600 font-normal">Monthly Cost Breakdown</h5>
                    <div className="p-4 space-y-4 bg-background-white-0 rounded-md border border-stroke-soft-200">
                        <div className="flex items-center justify-between w-full">
                            <p>Professionals (4x) </p>
                            <h5 className="text-right font-medium">$3,840.00</h5>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p>Tax </p>
                            <h5 className="text-right font-medium">0.00</h5>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p>Shared facility fee </p>
                            <h5 className="text-right font-medium">0.00</h5>
                        </div>
                        <Separator/>
                        <div className="flex items-center justify-between w-full">
                            <h5 className="text-sm fontm">Total Monthly Recurring</h5>
                            <h5 className="text-right font-medium">$3,840.00</h5>
                        </div>
                    </div>
                </div>
            </div>            
        </div>
    )
}

export default OrderDetailsView