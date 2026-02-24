"use client";

import { Badge } from "@/components/atomic/badge";
import { useSelector } from "react-redux";
import { selectWizardCategories, selectWizardSelected } from "@/store/wizard/wizard.selector";

export default function SidebarRoles({
  selectedRole,
  onSelectRole,
  seatAssignments,
  allowedRoleIds,
}: {
  selectedRole: { id: number | string; instanceId: string } | null;
  onSelectRole: (id: number | string, instanceId: string) => void;
  seatAssignments: Record<string, string>;
  allowedRoleIds?: Array<number | string>;
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
        organization: cat.description ?? "NOC Professionals",
        qty: s.qty,
        instanceId: (s as any).instanceId,
      } as { id: number | string; title: string; organization: string; qty: number; instanceId: string } | null;
    })
    .filter(Boolean) as Array<{ id: number | string; title: string; organization: string; qty: number; instanceId: string }>;

  if (Array.isArray(allowedRoleIds)) {
    const allowedSet = new Set(allowedRoleIds.map(String));
    derivedRoles = derivedRoles.filter((r) => allowedSet.has(`${r.id}:${r.instanceId}`) || allowedSet.has(String(r.id)));
  }
  const getAssignedSeatForInstance = (roleId: number | string, instanceId: string): string | undefined => {
    const found = Object.entries(seatAssignments)
      .map(([seatId, assigned]) => ({ seatId, assigned: String(assigned) }))
      .map(({ seatId, assigned }) => {
        if (assigned.includes(':')) {
          const [cid, inst] = assigned.split(':');
          return { seatId, cid, inst };
        }
        return { seatId, cid: assigned, inst: '0' };
      })
      .find(({ cid, inst }) => String(cid) === String(roleId) && String(inst) === String(instanceId));

    if (!found) return undefined;
    // seatId may be prefixed with floor like 'first-floor:A-3' -> display short 'A-3'
    if (String(found.seatId).includes(':')) return String(found.seatId).split(':')[1];
    return found.seatId;
  };

  const getStatus = (roleId: number | string, instanceId: string): "assigned" | "unassigned" => {
    const seat = getAssignedSeatForInstance(roleId, instanceId);
    return seat ? 'assigned' : 'unassigned';
  };

  return (
    <>
      <div className="space-y-3">
        {derivedRoles.length === 0 && <div className="text-sm text-text-sub-600">No professionals added yet.</div>}

        {derivedRoles.map((role) => {
          const seatDisplay = getAssignedSeatForInstance(role.id, role.instanceId) ?? 'Unassigned';
          const status = getStatus(role.id, role.instanceId);

          return (
            <div
              key={`${String(role.id)}-${role.instanceId}`}
              onClick={() => onSelectRole(role.id, role.instanceId)}
              className={`cursor-pointer rounded-md px-3 py-2 transition-all ${
                selectedRole && String(selectedRole.id) === String(role.id) && selectedRole.instanceId === role.instanceId
                  ? "border border-primary-base bg-primary-alpha-10"
                  : "border border-stroke-soft-200 bg-background-week-50 hover:bg-primary-alpha-10"
              }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{role.title}</h3>
                  <p className="text-xs text-text-sub-600">{role.organization}</p>
                  <p className="text-xs text-text-sub-500 mt-1">Qty: {role.qty}</p>
                </div>
                <Badge variant={status === "assigned" ? "success" : "warning"}>{seatDisplay}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
