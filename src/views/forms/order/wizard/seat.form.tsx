import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/atomic/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atomic/tabs"
import SeatGrid from "@/components/molecule/order/wizard/seat/seatGrid"
import SidebarRoles from "@/components/molecule/order/wizard/seat/sidebarRole"
import { useState } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { selectWizardShiftAssignments, selectWizardSeatAssignments } from '@/store/wizard/wizard.selector';
import { setSeatAssignment } from '@/store/wizard/wizard.slice';

const SeatForm = () => {
    const [selectedRole, setSelectedRole] = useState<number | null>(null)
    const [activeShift, setActiveShift] = useState<'morning'|'evening'|'night'>('morning')
    const dispatch = useDispatch();

    const shiftRoleAssignments = useSelector(selectWizardShiftAssignments);
    const shiftSeatAssignments = useSelector(selectWizardSeatAssignments);
    const seatAssignments = shiftSeatAssignments[activeShift] ?? {};

    const handleShiftChange = (v: string) => {
        const s = v as 'morning'|'evening'|'night'
        setActiveShift(s)
        const allowed = shiftRoleAssignments?.[s] ?? []
        if (allowed && allowed.length > 0) setSelectedRole(allowed[0])
        else setSelectedRole(null)
    }

    const handleSeatClick = (seatId: string) => {
        if (selectedRole === null) return

        const current = seatAssignments[seatId]

        // toggle: if same role, remove assignment
        if (String(current) === String(selectedRole)) {
            dispatch(setSeatAssignment({ shift: activeShift, seatId, categoryId: undefined }))
            return
        }

        // assign (this reducer will remove existing seat for the role in that shift)
        dispatch(setSeatAssignment({ shift: activeShift, seatId, categoryId: selectedRole }))
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

            <Tabs defaultValue="morning" onValueChange={handleShiftChange}>
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
                                allowedRoleIds={(shiftRoleAssignments.morning) ?? []}
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
                <TabsContent value="evening">
                    <div  className="flex flex-col md:flex-row bg-background-white-0 border border-stroke-soft-200 rounded-md">
                        <div className="md:w-3/12 p-2 md:p-4">
                            <SidebarRoles 
                                selectedRole={selectedRole} 
                                onSelectRole={setSelectedRole}
                                seatAssignments={seatAssignments}
                                allowedRoleIds={(shiftRoleAssignments.evening) ?? []}
                            />
                        </div>
                        
                         <div className="md:w-9/12 p-2 md:p-4 space-y-4 border-l border-stroke-soft-200">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex gap-4 items-center">
                                    <h3>Evening Shift </h3>
                                    <p>01:00 PM - 09:00 PM (PST)</p>
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
                <TabsContent value="night">
                    <div  className="flex flex-col md:flex-row bg-background-white-0 border border-stroke-soft-200 rounded-md">
                        <div className="md:w-3/12 p-2 md:p-4">
                            <SidebarRoles 
                                selectedRole={selectedRole} 
                                onSelectRole={setSelectedRole}
                                seatAssignments={seatAssignments}
                                allowedRoleIds={(shiftRoleAssignments.night) ?? []}
                            />
                        </div>
                        
                        <div className="md:w-9/12 p-2 md:p-4 space-y-4 border-l border-stroke-soft-200">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex gap-4 items-center">
                                    <h3>Night Shift </h3>
                                    <p>09:00 PM - 05:00 AM (PST)</p>
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
            </Tabs>

        </div>
    )
}

export default SeatForm