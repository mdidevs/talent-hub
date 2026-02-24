import { Badge } from "@/components/atomic/badge";
import { Button } from "@/components/atomic/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/atomic/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/atomic/select";
import { useSelector } from 'react-redux';
import { selectWizardCategories, selectWizardSelected } from '@/store/wizard/wizard.selector';
import { selectWizardShiftAssignments } from '@/store/wizard/wizard.selector';

import { X } from "lucide-react";

type ShiftKey = 'morning' | 'evening' | 'night' | string;

const ShifrShedulerCard: React.FC<{
  shiftKey?: ShiftKey;
  title?: string;
  timeRange?: string;
  assigned?: Array<number | string>;
  onAssign?: (shift: ShiftKey, roleId: number | string) => void;
  onRemove?: (shift: ShiftKey, roleId: number | string) => void;
}> = ({ shiftKey = 'morning', title = 'Morning Shift', timeRange = '09:00 AM - 05:00 PM (PST)', assigned = [], onAssign, onRemove }) => {
  const categories = useSelector(selectWizardCategories);
  const selected = useSelector(selectWizardSelected);

        const derivedRoles = selected
        .map((s) => {
            const cat = categories.find((c) => String(c.id) === String(s.categoryId));
            if (!cat) return null;
            return { id: s.categoryId, title: cat.title, qty: s.qty, instanceId: (s as any).instanceId } as const;
        })
        .filter(Boolean) as Array<{ id: number | string; title: string; qty: number; instanceId: string }>;

    const shiftAssignments = useSelector(selectWizardShiftAssignments);

  return (
    <Card className="gap-5">
        <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {timeRange}
                </CardDescription>
                <CardAction>
                    <Badge variant="tertiary">
                        {assigned.length} Staff Assigned
                    </Badge>
                </CardAction>
        </CardHeader>
        <CardContent>
            <Select onValueChange={(val) => { if (onAssign) onAssign(shiftKey, val); }}>
                <SelectTrigger className="w-full">
                    <SelectValue  placeholder="Select a professional" />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectGroup>
                                {derivedRoles.map((r) => {
                                    const composite = `${r.id}:${r.instanceId}`;
                                    // disable if this instance is already assigned in any shift
                                    const assignedAnywhere = Object.entries(shiftAssignments || {}).some(([, ids]) =>
                                        (ids || []).some((id) => String(id) === composite)
                                    );
                                    return (
                                        <SelectItem key={`${String(r.id)}-${r.instanceId}`} value={composite} disabled={assignedAnywhere}>
                                            {r.title} {`(#${r.instanceId})`}{assignedAnywhere ? ' — assigned' : ''}
                                        </SelectItem>
                                    )
                                })}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </CardContent>
        <CardFooter className="-mt-2 flex-wrap gap-1">
            {assigned.map((roleKey) => {
                const [catId, instanceId] = String(roleKey).split(':');
                const role = derivedRoles.find((r) => String(r.id) === String(catId) && r.instanceId === instanceId);
                return (
                    <Badge key={String(roleKey)} variant="ghost" className="p-0 pl-2 gap-x-1 bg-background-soft-200 rounded-md overflow-hidden">
                        <p className="max-w-20 text-xs font-medium truncate">{role?.title ?? 'Unknown'}</p>
                        <Button size="sm" variant="ghost" className="h-6 w-6 rounded-none" onClick={() => onRemove?.(shiftKey, roleKey)}>
                            <X/>
                        </Button>
                    </Badge>
                )
            })}
        </CardFooter>
    </Card>
  )
}

export default ShifrShedulerCard