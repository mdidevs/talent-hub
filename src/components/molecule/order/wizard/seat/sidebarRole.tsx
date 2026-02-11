'use client';

import { Badge } from "@/components/atomic/badge";
import { useSelector } from 'react-redux';
import { selectWizardCategories, selectWizardSelected } from '@/store/wizard/wizard.selector';

export default function SidebarRoles({
  selectedRole,
  onSelectRole,
  seatAssignments,
  allowedRoleIds,
}: {
  selectedRole: number | null
  onSelectRole: (id: number) => void
  seatAssignments: Record<string, number>
  allowedRoleIds?: Array<number | string>
}) {
  const categories = useSelector(selectWizardCategories);
  const selected = useSelector(selectWizardSelected);

  // derive roles from selected items and categories
  let derivedRoles = selected
    .map((s) => {
      const cat = categories.find((c) => String(c.id) === String(s.categoryId));
      if (!cat) return null;
      return {
        id: s.categoryId,
        title: cat.title,
        organization: cat.description ?? 'NOC Professionals',
        qty: s.qty,
      } as { id: number | string; title: string; organization: string; qty: number } | null;
    })
    .filter(Boolean) as Array<{ id: number | string; title: string; organization: string; qty: number }>;

  if (Array.isArray(allowedRoleIds)) {
    const allowedSet = new Set(allowedRoleIds.map(String));
    derivedRoles = derivedRoles.filter((r) => allowedSet.has(String(r.id)));
  }

  // Calculate seats for each role from seatAssignments
  const getAssignedSeats = (roleId: number | string): string[] => {
    return Object.entries(seatAssignments)
      .filter(([_, assignedRole]) => String(assignedRole) === String(roleId))
      .map(([seatId]) => seatId);
  }

  const getStatus = (roleId: number | string): 'assigned' | 'unassigned' => {
    return getAssignedSeats(roleId).length > 0 ? 'assigned' : 'unassigned'
  }

  return (
    <>
      <div className="space-y-3">
        {derivedRoles.length === 0 && (
          <div className="text-sm text-text-sub-600">No professionals added yet.</div>
        )}
        {derivedRoles.map((role) => {
          const assignedSeats = getAssignedSeats(role.id)
          const seatDisplay = assignedSeats.length > 0 ? assignedSeats[0] : 'Unassigned'
          const status = getStatus(role.id)

          return (
            <div
              key={String(role.id)}
              onClick={() => onSelectRole(Number(role.id))}
              className={`cursor-pointer rounded-md px-3 py-2 transition-all ${
                selectedRole === role.id
                  ? 'border border-primary-base bg-primary-alpha-10'
                  : 'border border-stroke-soft-200 bg-background-week-50 hover:bg-primary-alpha-10'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{role.title}</h3>
                  <p className="text-xs text-text-sub-600">{role.organization}</p>
                  <p className="text-xs text-text-sub-500 mt-1">Qty: {role.qty}</p>
                </div>
                <Badge variant={status === 'assigned'? 'success' : 'warning'}>
                  {seatDisplay}
                </Badge>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 text-sm text-gray-600">
        Remaining : {/* could compute remaining seats here if needed */}
      </div>
    </>
  )
}
