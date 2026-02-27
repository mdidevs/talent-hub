import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/atomic/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atomic/tabs"
import SeatGrid from "@/components/molecule/order/wizard/seat/seatGrid"
import SidebarRoles from "@/components/molecule/order/wizard/seat/sidebarRole"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { selectWizardShiftAssignments, selectWizardSeatAssignments, selectWizardShifts } from '@/store/wizard/wizard.selector';
import { setSeatAssignment, removeSeatAssignment, addShiftAssignment } from '@/store/wizard/wizard.slice';
import { officeService, type OfficeDto } from '@/services/office/office.service';

type FloorOption = {
    id: string;
    officeId: number;
    mapId: number;
    floor: number;
    section: string;
    total: number;
    used: number;
    seatPrefix: string;
};

const toFloorOptionId = (officeId: number, floor: number, section: string) =>
    `office-${officeId}-floor-${floor}-${section}`.replace(/\s+/g, '-').toLowerCase();

const toSeatPrefix = (floor: number, section: string) =>
    `F${floor}${section.slice(0, 1).toUpperCase() || 'A'}`;

const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object' && 'message' in error) {
        return String((error as { message?: unknown }).message ?? fallback);
    }
    return fallback;
};

const SeatForm = () => {
    const [selectedRole, setSelectedRole] = useState<{ id: number | string; instanceId: string } | null>(null)
    const [activeShift, setActiveShift] = useState<string>('')
    const [selectedFloor, setSelectedFloor] = useState<string>('')
    const [offices, setOffices] = useState<OfficeDto[]>([])
    const [selectedOfficeId, setSelectedOfficeId] = useState<number | null>(null)
    const [floorOptions, setFloorOptions] = useState<FloorOption[]>([])
    const [isOfficeLoading, setIsOfficeLoading] = useState(false)
    const [officeError, setOfficeError] = useState<string | null>(null)
    const dispatch = useDispatch();

    const shiftRoleAssignments = useSelector(selectWizardShiftAssignments);
    const shiftSeatAssignments = useSelector(selectWizardSeatAssignments);
    const shifts = useSelector(selectWizardShifts) ?? [];

    const currentOffice = selectedOfficeId
        ? offices.find((office) => office.id === selectedOfficeId)
        : undefined;
    const currentFloor = floorOptions.find((opt) => opt.id === selectedFloor);
    const availableSeats = currentFloor ? Math.max(0, currentFloor.total - currentFloor.used) : 0;
    const officeMeta = (currentOffice?.data ?? {}) as Record<string, unknown>;
    const officeTimezone = typeof officeMeta.timezone === 'string' ? officeMeta.timezone : 'N/A';
    const officePhone = typeof officeMeta.phone === 'string' ? officeMeta.phone : '—';

    useEffect(() => {
        let mounted = true;
        const fetchOffices = async () => {
            setIsOfficeLoading(true);
            setOfficeError(null);
            try {
                const data = await officeService.listOffices({ limit: 10 });
                if (!mounted) return;
                setOffices(data);
                if (data.length > 0) {
                    setSelectedOfficeId((prev) => prev ?? data[0].id);
                } else {
                    setSelectedOfficeId(null);
                }
            } catch (error) {
                if (!mounted) return;
                setOfficeError(getErrorMessage(error, 'Failed to load offices'));
            } finally {
                if (mounted) setIsOfficeLoading(false);
            }
        };

        fetchOffices();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        if (!selectedOfficeId) {
            setFloorOptions([]);
            setSelectedFloor('');
            return;
        }

        let mounted = true;
        const fetchMaps = async () => {
            setIsOfficeLoading(true);
            setOfficeError(null);
            try {
                const maps = await officeService.listCubicalMaps({ office_id: selectedOfficeId, limit: 20 });
                if (!mounted) return;
                const nextOptions: FloorOption[] = maps.map((map) => ({
                    id: toFloorOptionId(selectedOfficeId, map.floor, map.section),
                    officeId: selectedOfficeId,
                    mapId: map.id,
                    floor: map.floor,
                    section: map.section,
                    total: map.total_cubicals,
                    used: map.used_cubicals,
                    seatPrefix: toSeatPrefix(map.floor, map.section),
                }));
                setFloorOptions(nextOptions);
                setSelectedFloor((prev) => {
                    if (prev && nextOptions.some((opt) => opt.id === prev)) return prev;
                    return nextOptions[0]?.id ?? '';
                });
            } catch (error) {
                if (!mounted) return;
                setFloorOptions([]);
                setSelectedFloor('');
                setOfficeError(getErrorMessage(error, 'Failed to load cubical maps'));
            } finally {
                if (mounted) setIsOfficeLoading(false);
            }
        };

        fetchMaps();
        return () => {
            mounted = false;
        };
    }, [selectedOfficeId]);

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

        const defaultFloorKey = selectedFloor || floorOptions[0]?.id || 'first-floor';

        // migrate any legacy seat keys (without floor prefix) to <defaultFloorKey>:<seatId>
        Object.entries(shiftSeatAssignments).forEach(([shiftKey, map]) => {
            Object.entries(map).forEach(([sId, cId]) => {
                if (!String(sId).includes(':')) {
                    const composite = `${defaultFloorKey}:${sId}`;
                    const migratedCategory = `${String(cId)}:0`;
                    dispatch(setSeatAssignment({ shift: shiftKey, seatId: composite, categoryId: migratedCategory } as any));
                    dispatch(removeSeatAssignment({ shift: shiftKey, seatId: sId }));
                }
            });
        });
    }, [shifts, shiftRoleAssignments, activeShift, floorOptions, selectedFloor]);

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
        if (selectedRole === null || !selectedFloor) return

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
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <h3 className='text-xl font-semibold'>Configure your team</h3>
                        <p>Select the number of professionals required for your operations.</p>
                        {officeError && <p className="text-sm text-destructive mt-2">{officeError}</p>}
                    </div>
                    <div className="flex flex-col md:flex-row gap-3 md:items-end">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase text-text-sub-500">Office</p>
                            <div className="text-sm font-semibold border border-stroke-soft-200 rounded px-3 py-2 bg-background-white-0 min-h-9 flex items-center">
                                {currentOffice?.name ?? (isOfficeLoading ? 'Loading…' : 'No office found')}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase text-text-sub-500">Floor section</p>
                            <Select
                                value={selectedFloor}
                                onValueChange={setSelectedFloor}
                                disabled={isOfficeLoading || floorOptions.length === 0}
                            >
                                <SelectTrigger size="sm" className="w-48">
                                    <SelectValue placeholder={isOfficeLoading ? 'Loading floors...' : 'Select floor'} />
                                </SelectTrigger>
                                <SelectContent position="popper">
                                    <SelectGroup>
                                        {floorOptions.map((option) => (
                                            <SelectItem key={option.id} value={option.id}>
                                                Floor {option.floor} · {option.section} ({Math.max(0, option.total - option.used)} open)
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                {/* {currentOffice && currentFloor && (
                    <div className="grid gap-4 md:grid-cols-3 bg-background-white-0 border border-stroke-soft-200 rounded-md p-4">
                        <div>
                            <p className="text-xs text-text-sub-500">Office</p>
                            <p className="text-sm font-semibold">{currentOffice.name}</p>
                            <p className="text-xs text-text-sub-500">{currentOffice.address}</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-sub-500">Timezone</p>
                            <p className="text-sm font-semibold">{officeTimezone}</p>
                            <p className="text-xs text-text-sub-500">{officePhone}</p>
                        </div>
                        <div>
                            <p className="text-xs text-text-sub-500">Seats available</p>
                            <p className="text-sm font-semibold">{availableSeats} / {currentFloor.total}</p>
                            <p className="text-xs text-text-sub-500">Section {currentFloor.section} · Floor {currentFloor.floor}</p>
                        </div>
                    </div>
                )} */}
            </div>

            <Tabs value={activeShift} onValueChange={handleShiftChange}>
                <TabsList>
                    {shifts.map((sh) => (
                        <TabsTrigger key={sh.key} value={sh.key}>{sh.title} Shift</TabsTrigger>
                    ))}
                </TabsList>
                {shifts.map((sh) => {
                    const seatAssignments = shiftSeatAssignments[sh.key] ?? {};
                    if (floorOptions.length === 0 || !selectedFloor) {
                        return (
                            <TabsContent key={sh.key} value={sh.key}>
                                <div className="border border-dashed border-stroke-soft-200 rounded-md p-8 text-sm text-text-sub-500">
                                    Select an office floor to load the seating layout.
                                </div>
                            </TabsContent>
                        );
                    }
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
                                        totalSeats={currentFloor?.total}
                                        seatPrefix={currentFloor?.seatPrefix}
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
