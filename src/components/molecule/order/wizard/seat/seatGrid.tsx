'use client'

interface Seat {
  id: string
}

// Generate 59 seats (A0-A58) based on the design
const generateSeats = (): Seat[] => {
  const seats: Seat[] = []
  for (let i = 0; i <56; i++) {
    seats.push({ id: `A-${i}` })
  }
  return seats
}

export default function SeatGrid({
  selectedRole,
  seatAssignments,
  onSeatClick,
}: {
  selectedRole: number | null
  seatAssignments: Record<string, number>
  onSeatClick: (seatId: string) => void
}) {
  const seats = generateSeats()

  // Group seats into rows (8 columns per row)
  const rows: Seat[][] = []
  for (let i = 0; i < seats.length; i += 8) {
    rows.push(seats.slice(i, i + 8))
  }

  const getSeatStyle = (seatId: string) => {
    const assignedRole = seatAssignments[seatId]
    const isAssigned = assignedRole !== undefined
    const isSelectedRole = assignedRole === selectedRole
    const hasSelectedRole = selectedRole !== null

    // All seats start as outline
    const baseStyle = 'border border-stroke-sub-300 bg-transparent text-text-strong-950 hover:bg-primary-alpha-16'

    // If a role is selected
    if (hasSelectedRole) {
      if (isAssigned && isSelectedRole) {
        // Assigned to selected role: filled blue
        return 'bg-primary-base text-text-white-0 border-blue-500 hover:bg-primary-dark'
      } else if (isAssigned) {
        // Assigned to other role: disable
        return 'bg-primary-alpha-10 text-text-sub-600 border-primary-alpha-16'
      } else {
        // Available for assignment: light blue fill
        return 'border border-stroke-sub-300 bg-transparent text-text-strong-950 hover:bg-primary-alpha-10'
      }
    }

    // No role selected: all outline
    return baseStyle
  }

  const handleSeatClick = (seatId: string) => {
    if (selectedRole === null) return
    const assignedRole = seatAssignments[seatId]
    if (assignedRole === undefined || assignedRole === selectedRole) {
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
                seatAssignments[seat.id] !== selectedRole
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
