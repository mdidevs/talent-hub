import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/atomic/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atomic/tabs"
import SeatGrid from "@/components/molecule/order/wizard/seat/seatGrid"
import SidebarRoles from "@/components/molecule/order/wizard/seat/sidebarRole"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { selectWizardShiftAssignments, selectWizardSeatAssignments, selectWizardShifts } from '@/store/wizard/wizard.selector';
import { setSeatAssignment, removeSeatAssignment, addShiftAssignment } from '@/store/wizard/wizard.slice';

const SeatForm = () => {
    const [selectedRole, setSelectedRole] = useState<{ id: number | string; instanceId: string } | null>(null)
    const [activeShift, setActiveShift] = useState<string>('')
    const [selectedFloor, setSelectedFloor] = useState<string>('first-floor')
    const dispatch = useDispatch();

    const shiftRoleAssignments = useSelector(selectWizardShiftAssignments);
    const shiftSeatAssignments = useSelector(selectWizardSeatAssignments);
    const shifts = useSelector(selectWizardShifts) ?? [];

    useEffect(() => {
        if ((!activeShift || activeShift === '') && shifts && shifts.length > 0) {
            const first = shifts[0].key;
            setActiveShift(first);
            const allowed = shiftRoleAssignments?.[first] ?? [];
            if (allowed && allowed.length > 0) {
                const val = String(allowed[0]);
                if (val.includes(':')) {
                    const [id, instanceId] = val.split(':');
                    setSelectedRole({ id: isNaN(Number(id)) ? id : Number(id), instanceId: instanceId || '0' });
                } else {
                    setSelectedRole({ id: isNaN(Number(val)) ? val : Number(val), instanceId: '0' });
                }
            } else setSelectedRole(null);
        }
        // migrate any legacy seat keys (without floor prefix) to first-floor:<seatId>
        Object.entries(shiftSeatAssignments).forEach(([shiftKey, map]) => {
            Object.entries(map).forEach(([sId, cId]) => {
                if (!String(sId).includes(':')) {
                    const composite = `first-floor:${sId}`;
                    // create new prefixed assignment and remove old unprefixed
                    // legacy cId is category id (number) without instance index; migrate to first instance (idx 0)
                    const migratedCategory = `${String(cId)}:0`;
                    dispatch(setSeatAssignment({ shift: shiftKey, seatId: composite, categoryId: migratedCategory } as any));
                    dispatch(removeSeatAssignment({ shift: shiftKey, seatId: sId }));
                }
            });
        });
    }, [shifts, shiftRoleAssignments, activeShift]);

    const handleShiftChange = (v: string) => {
        setActiveShift(v)
            const allowed = shiftRoleAssignments?.[v] ?? []
                if (allowed && allowed.length > 0) {
                // try to preserve previous selection if it's allowed in the new shift
                const prev = selectedRole
                let chosen: string | undefined
                if (prev) {
                    const prevComposite = `${String(prev.id)}:${prev.instanceId}`
                    chosen = allowed.find((a: any) => String(a) === prevComposite || String(a) === String(prev.id)) as any
                }
                const val = String(chosen ?? allowed[0]);
                if (val.includes(':')) {
                    const [id, instanceId] = val.split(':');
                    setSelectedRole({ id: isNaN(Number(id)) ? id : Number(id), instanceId: instanceId || '0' });
                } else {
                    setSelectedRole({ id: isNaN(Number(val)) ? val : Number(val), instanceId: '0' });
                }
            } else setSelectedRole(null)
    }

    const handleSeatClick = (seatId: string) => {
        if (selectedRole === null) return

        const compositeId = `${selectedFloor}:${seatId}`
        const assignmentsForShift = (shiftSeatAssignments[activeShift] ?? {});

        // derive assigned seats for this role (by composite id) on the current floor
        const floorPrefix = `${selectedFloor}:`;
        const assignedSeatsForRole = Object.entries(assignmentsForShift)
            .filter(([sId, cId]) => String(sId).startsWith(floorPrefix) && String(cId).startsWith(`${String(selectedRole.id)}:`))
            .map(([sId, cId]) => ({
                shortId: String(sId).slice(floorPrefix.length),
                instanceId: String(cId).split(':')[1] || '0',
            }))
            .map((x) => x)
            .reduce<Record<string, string>>((acc, cur) => {
                acc[cur.instanceId] = cur.shortId;
                return acc;
            }, {} as Record<string, string>);

        const selectedInstanceSeat = assignedSeatsForRole[selectedRole.instanceId];

        // toggle off if clicking the same assigned seat for this instance
        if (seatId === selectedInstanceSeat) {
            dispatch(setSeatAssignment({ shift: activeShift, seatId: compositeId, categoryId: undefined }))
            return
        }

        // ensure this instance is part of the current shift assignments so UI and sidebar remain consistent
        const instanceComposite = `${String(selectedRole.id)}:${selectedRole.instanceId}`
        const allowedForShift = shiftRoleAssignments?.[activeShift] ?? []
        if (!allowedForShift.find((a: any) => String(a) === instanceComposite)) {
            dispatch(addShiftAssignment({ shift: activeShift, categoryId: instanceComposite } as any))
        }

        // assign selected instance to this seat (store composite id)
        dispatch(setSeatAssignment({ shift: activeShift, seatId: compositeId, categoryId: instanceComposite }))
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <h3 className='text-xl font-semibold'>Configure your team</h3>
                    <p>Select the number of professionals required for your operations.</p>
                </div>
                <Select value={selectedFloor} onValueChange={setSelectedFloor}>
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
                    // derive only the assignments for the selected floor
                    const floorPrefix = `${selectedFloor}:`;
                    const floorSeatAssignments: Record<string, string> = {};
                    Object.entries(seatAssignments).forEach(([sId, cId]) => {
                        if (String(sId).startsWith(floorPrefix)) {
                            const shortId = String(sId).slice(floorPrefix.length);
                            const val = String(cId);
                            floorSeatAssignments[shortId] = val.includes(':') ? val : `${val}:0`;
                        }
                    });

                    return (
                            <TabsContent key={sh.key} value={sh.key}>
                            <div className="flex flex-col md:flex-row bg-background-white-0 border border-stroke-soft-200 rounded-md">
                                <div className="md:w-3/12 p-2 md:p-4">
                                    <SidebarRoles
                                        selectedRole={selectedRole}
                                        onSelectRole={(id: number | string, instanceId: string) => setSelectedRole({ id, instanceId })}
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
                                        seatAssignments={floorSeatAssignments}
                                        selectedFloor={selectedFloor}
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
