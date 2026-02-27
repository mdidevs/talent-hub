'use client'

export default function SeatGrid({
  selectedRole,
  seatAssignments,
  onSeatClick,
  selectedFloor,
  totalSeats,
  seatPrefix,
}: {
  selectedRole: { id: number | string; instanceId: string } | null
  seatAssignments: Record<string, string>
  onSeatClick: (seatId: string) => void
  selectedFloor?: string
  totalSeats?: number
  seatPrefix?: string
}) {
  const seats = generateSeatsForFloor(selectedFloor, totalSeats, seatPrefix)

  // Group seats into rows (7 columns per row)
  const rows: Seat[][] = []
  const cols = 7
  for (let i = 0; i < seats.length; i += cols) {
    rows.push(seats.slice(i, i + cols))
  }

  // derive assigned seat id for the selected instance (if any)
  const selectedInstanceSeat = (() => {
    if (!selectedRole) return undefined
    const assigned = Object.entries(seatAssignments)
      .map(([seatId, assigned]) => ({ seatId, assigned: String(assigned) }))
      .filter((e) => e.assigned === `${String(selectedRole.id)}:${selectedRole.instanceId}`)
      .map((e) => e.seatId)
    return assigned[0]
  })()

  const getSeatStyle = (seatId: string) => {
    const assignedRole = seatAssignments[seatId]
    const isAssigned = assignedRole !== undefined
    const hasSelectedRole = selectedRole !== null
    const isSelectedInstance = selectedInstanceSeat === seatId

    const baseStyle = 'border border-stroke-sub-300 bg-transparent text-text-strong-950 hover:bg-primary-alpha-16'

    if (hasSelectedRole) {
      if (isAssigned && isSelectedInstance) {
        return 'bg-primary-base text-text-white-0 border-blue-500 hover:bg-primary-dark'
      } else if (isAssigned && String(assignedRole) !== `${String(selectedRole?.id)}:${selectedRole?.instanceId}`) {
        return 'bg-primary-alpha-10 text-text-sub-600 border-primary-alpha-16'
      } else {
        return 'border border-stroke-sub-300 bg-transparent text-text-strong-950 hover:bg-primary-alpha-10'
      }
    }

    return baseStyle
  }

  const handleSeatClick = (seatId: string) => {
    if (selectedRole === null) return
    const assignedRole = seatAssignments[seatId]
    if (assignedRole === undefined || String(assignedRole) === `${String(selectedRole.id)}:${selectedRole.instanceId}`) {
      onSeatClick(seatId)
    }
  }

  return (
    <div className="flex-1 overflow-auto bg-background-white-0">
      <div className="space-y-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {row.map((seat) => {
              const isAssignedToOther =
                seatAssignments[seat.id] !== undefined &&
                String(seatAssignments[seat.id]) !== `${String(selectedRole?.id)}:${selectedRole?.instanceId}`
              const isClickable =
                selectedRole !== null && !isAssignedToOther

              return (
                <button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat.id)}
                  disabled={!isClickable}
                  className={`rounded h-10 min-w-14 md:w-36 text-xs text-center font-medium transition-all ${getSeatStyle(seat.id)} ${
                    isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
                  } hover:shadow-md`}
                >
                  {seat.id}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// helpers
type Seat = { id: string }

const generateSeatsForFloor = (
  floorKey?: string,
  totalSeats = 56,
  prefix?: string,
): Seat[] => {
  const labelPrefix = prefix ?? derivePrefixFromKey(floorKey)
  return Array.from({ length: Math.max(1, totalSeats) }, (_, index) => ({
    id: `${labelPrefix}-${index}`,
  }))
}

const derivePrefixFromKey = (key?: string) => {
  if (!key) return 'A'
  if (key.includes('first')) return 'A'
  if (key.includes('second')) return 'B'
  if (key.includes('third')) return 'C'
  return key
}
