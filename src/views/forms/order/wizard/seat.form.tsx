import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/atomic/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atomic/tabs"
import SeatGrid from "@/components/molecule/order/wizard/seat/seatGrid"
import SidebarRoles from "@/components/molecule/order/wizard/seat/sidebarRole"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { selectWizardShiftAssignments, selectWizardSeatAssignments, selectWizardShifts } from '@/store/wizard/wizard.selector';
import { setSeatAssignment } from '@/store/wizard/wizard.slice';

const SeatForm = () => {
    const [selectedRole, setSelectedRole] = useState<number | null>(null)
    const [activeShift, setActiveShift] = useState<string>('')
    const dispatch = useDispatch();

    const shiftRoleAssignments = useSelector(selectWizardShiftAssignments);
    const shiftSeatAssignments = useSelector(selectWizardSeatAssignments);
    const shifts = useSelector(selectWizardShifts) ?? [];

    useEffect(() => {
        if ((!activeShift || activeShift === '') && shifts && shifts.length > 0) {
            const first = shifts[0].key;
            setActiveShift(first);
            const allowed = shiftRoleAssignments?.[first] ?? [];
            if (allowed && allowed.length > 0) setSelectedRole(allowed[0]);
            else setSelectedRole(null);
        }
    }, [shifts, shiftRoleAssignments, activeShift]);

    const handleShiftChange = (v: string) => {
        setActiveShift(v)
        const allowed = shiftRoleAssignments?.[v] ?? []
        if (allowed && allowed.length > 0) setSelectedRole(allowed[0])
        else setSelectedRole(null)
    }

    const handleSeatClick = (seatId: string) => {
        if (selectedRole === null) return

        const current = (shiftSeatAssignments[activeShift] ?? {})[seatId]

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

            <Tabs value={activeShift} onValueChange={handleShiftChange}>
                <TabsList>
                    {shifts.map((sh) => (
                        <TabsTrigger key={sh.key} value={sh.key}>{sh.title} Shift</TabsTrigger>
                    ))}
                </TabsList>
                {shifts.map((sh) => {
                    const seatAssignments = shiftSeatAssignments[sh.key] ?? {};
                    return (
                        <TabsContent key={sh.key} value={sh.key}>
                            <div className="flex flex-col md:flex-row bg-background-white-0 border border-stroke-soft-200 rounded-md">
                                <div className="md:w-3/12 p-2 md:p-4">
                                    <SidebarRoles
                                        selectedRole={selectedRole}
                                        onSelectRole={setSelectedRole}
                                        seatAssignments={seatAssignments}
                                        allowedRoleIds={(shiftRoleAssignments[sh.key]) ?? []}
                                    />
                                </div>

                                <div className="md:w-9/12 p-2 md:p-4 space-y-4 border-l border-stroke-soft-200">
                                    <div className="flex flex-col md:flex-row justify-between gap-4">
                                        <div className="flex gap-4 items-center">
                                            <h3>{sh.title} Shift </h3>
                                            <p>{sh.start} - {sh.end} (PST)</p>
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
                    );
                })}
            </Tabs>

        </div>
    )
}

export default SeatForm