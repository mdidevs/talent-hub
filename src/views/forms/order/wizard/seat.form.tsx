import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/atomic/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atomic/tabs"
import SeatGrid from "@/components/molecule/order/wizard/seat/seatGrid"
import SidebarRoles from "@/components/molecule/order/wizard/seat/sidebarRole"
import { useState } from "react"

const SeatForm = () => {
    const [selectedRole, setSelectedRole] = useState<number | null>(null)
    const [seatAssignments, setSeatAssignments] = useState<Record<string, number>>({})

    const handleSeatClick = (seatId: string) => {
        if (selectedRole === null) return

        setSeatAssignments(prev => {
            const newAssignments = { ...prev }

            // Find and remove any existing seat assigned to this role
            Object.entries(newAssignments).forEach(([seat, role]) => {
                if (role === selectedRole) {
                    delete newAssignments[seat]
                }
            })

            // Assign the new seat to this role
            newAssignments[seatId] = selectedRole

            return newAssignments
        })
    }
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <h3 className='text-xl font-semibold'>Configure your team</h3>
                    <p>Select the number of professionals required for your operations.</p>
                </div>
                <Select defaultValue="first-floor">
                    <SelectTrigger size="sm" className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectGroup>
                            <SelectItem value={"first-floor"} aria-selected>First floor</SelectItem>
                            <SelectItem value={"second-floor"}>Second floor</SelectItem>
                            <SelectItem value={"third-floor"}>Third floor</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <Tabs defaultValue="morning">
                <TabsList>
                    <TabsTrigger value="morning">Morning Shift</TabsTrigger>
                    <TabsTrigger value="evening">Evening Shift</TabsTrigger>
                    <TabsTrigger value="night">Night Shift</TabsTrigger>
                </TabsList>
                <TabsContent value="morning">
                    <div  className="flex flex-col md:flex-row bg-background-white-0 border border-stroke-soft-200 rounded-md">
                        <div className="md:w-3/12 p-2 md:p-4">
                            <SidebarRoles 
                                selectedRole={selectedRole} 
                                onSelectRole={setSelectedRole}
                                seatAssignments={seatAssignments}
                            />
                        </div>
                        
                        <div className="md:w-9/12 p-2 md:p-4 space-y-4 border-l border-stroke-soft-200">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex gap-4 items-center">
                                    <h3>Morning Shift </h3>
                                    <p>09:00 AM - 05:00 PM (PST)</p>
                                </div>
                                <div className="flex gap-4">
                                    <p><span className="h-3 w-3 inline-block bg-primary-base rounded-xs"></span> Selected</p>
                                    <p><span className="h-3 w-3 inline-block bg-primary-alpha-16 rounded-xs"></span> Occupied</p>
                                    <p><span className="h-3 w-3 inline-block bg-background-white-0 border border-primary-alpha-16 rounded-xs"></span> Available</p>
                                </div>
                            </div>
                            <SeatGrid 
                                selectedRole={selectedRole} 
                                seatAssignments={seatAssignments}
                                onSeatClick={handleSeatClick}
                            />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="evening"></TabsContent>
                <TabsContent value="night"></TabsContent>
            </Tabs>

        </div>
    )
}

export default SeatForm