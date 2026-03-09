import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from '@/components/atomic/table'
import { Badge } from '@/components/atomic/badge'
import InviteModal from './inviteModal'


const data = [
    {
        name: 'Leonard krasner',
        email: 'leonardkrasner@mail.com',
        role: 'Owner',
        status: 'Active'
    },
    {
        name: 'Leonard krasner',
        email: 'leonardkrasner@mail.com',
        role: 'Owner',
        status: 'Invite sent'
    },

]
const Team = () => {
    return (
        <div className='space-y-4 md:space-y-10'>
            <div className='flex justify-between items-start'>
                <div>
                    <h5>Team</h5>
                    <p>View and update your team members</p>
                </div>
                <InviteModal/>
            </div>
            
            <div className='bg-background-white-0 rounded-md overflow-hidden border border-stroke-soft-200'>
                <Table>
                    <TableHeader className="bg-transparent [&_tr]:border-b-0">
                        <TableRow className='h-12'>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((data, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{data.name}</TableCell>
                                <TableCell>{data.email}</TableCell>
                                <TableCell>{data.role}</TableCell>
                                <TableCell>
                                    {data.status === 'Active' ?
                                        <Badge variant={"success"}>
                                            {data.status}
                                        </Badge>
                                        : <p>Invite Sent</p>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Team