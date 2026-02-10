'use client';

import { Badge } from "@/components/atomic/badge";

interface Role {
  id: number
  title: string
  organization: string
  status: 'assigned' | 'unassigned'
}

const roles: Role[] = [
  {
    id: 0,
    title: 'L1 Support Engineer',
    organization: 'NOC Professionals',
    status: 'assigned',
  },
  {
    id: 1,
    title: 'L1 Support Engineer',
    organization: 'NOC Professionals',
    status: 'assigned',
  },
  {
    id: 2,
    title: 'L2 Network Architect',
    organization: 'NOC Professionals',
    status: 'unassigned',
  },
]

export default function SidebarRoles({
  selectedRole,
  onSelectRole,
  seatAssignments,
}: {
  selectedRole: number | null
  onSelectRole: (id: number) => void
  seatAssignments: Record<string, number>
}) {
  // Calculate seats for each role from seatAssignments
  const getAssignedSeats = (roleId: number): string[] => {
    return Object.entries(seatAssignments)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, assignedRole]) => assignedRole === roleId)
      .map(([seatId]) => seatId)
  }

  const getStatus = (roleId: number): 'assigned' | 'unassigned' => {
    return getAssignedSeats(roleId).length > 0 ? 'assigned' : 'unassigned'
  }

  return (
    <>
      <div className="space-y-3">
        {roles.map((role) => {
          const assignedSeats = getAssignedSeats(role.id)
          const seatDisplay = assignedSeats.length > 0 ? assignedSeats[0] : 'Unassigned'
          const status = getStatus(role.id)

          return (
            <div
              key={role.id}
              onClick={() => onSelectRole(role.id)}
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
        Remaining : 1
      </div>
    </>
  )
}
