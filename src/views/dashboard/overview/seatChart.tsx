import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/atomic/select"
// --- Types ---
type Status = 'active' | 'pending' | 'solid' | 'bordered' | 'empty';

interface DeskProps {
  id: string;
  status: Status;
}

// --- Status Configurations ---
// S = Solid (light grayish-blue background)
// B = Bordered (white background, gray border)
// A = Active (blue)
// P = Pending (orange)
// E = Empty (invisible spacer)

const L1: Status[] = [
  'solid', 'solid', 'solid', 'bordered', 'bordered', 'bordered', 'bordered', 'bordered',
  'solid', 'solid', 'solid', 'solid', 'bordered', 'bordered', 'bordered', 'bordered',
];

const L2: Status[] = [
  'solid', 'solid', 'active', 'active', 'active', 'active', 'active', 'active',
  'solid', 'solid', 'active', 'active', 'active', 'active', 'active', 'active',
];

const L3: Status[] = [
  'solid', 'solid', 'solid', 'bordered', 'bordered', 'bordered', 'bordered', 'bordered',
  'active', 'active', 'active', 'active', 'active', 'active', 'active', 'active',
];

const L4: Status[] = [
  'solid', 'solid', 'solid', 'bordered', 'bordered', 'bordered', 'bordered', 'bordered',
  'solid', 'solid', 'solid', 'solid', 'bordered', 'bordered', 'bordered', 'bordered',
];

const R1: Status[] = [
  'active', 'active', 'active', 'active', 'active', 'bordered', 'bordered', 'bordered',
  'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty',
];

const R2: Status[] = [
  'active', 'active', 'active', 'active', 'active', 'bordered', 'bordered', 'bordered',
  'active', 'pending', 'active', 'active', 'active', 'bordered', 'bordered', 'bordered',
];

const R3: Status[] = [
  'active', 'active', 'active', 'active', 'active', 'pending', 'active', 'active',
  'active', 'active', 'active', 'pending', 'active', 'bordered', 'bordered', 'bordered',
];

const R4: Status[] = [
  'solid', 'solid', 'solid', 'bordered', 'bordered', 'bordered', 'bordered', 'bordered',
  'solid', 'solid', 'solid', 'solid', 'bordered', 'bordered', 'bordered', 'bordered',
];

const DESK_IDS = [
  'A24', 'A25', 'A26', 'A27', 'A28', 'A29', 'A30', 'A31',
  'A32', 'A33', 'A34', 'A35', 'A36', 'A37', 'A38', 'A39',
];

// --- Components ---

const Desk: React.FC<DeskProps> = ({ id, status }) => {
  if (status === 'empty') {
    return <div className="h-12 w-full" />;
  }

  const baseClasses = "h-[50px] w-full flex items-center justify-center text-[13px] font-medium transition-colors";

  const statusClasses = {
    active: "bg-primary-base text-white",
    pending: "bg-warning-base text-white",
    solid: "bg-primary-alpha-10 ",
    bordered: "border border-soft-200 border-stroke-soft-200",
  };

  return (
    <div className={`${baseClasses} ${statusClasses[status as keyof typeof statusClasses]}`}>
      {id}
    </div>
  );
};

const DeskBlock: React.FC<{ statuses: Status[] }> = ({ statuses }) => {
  return (
    <div className="grid grid-cols-8 gap-1">
      {statuses.map((status, index) => (
        <Desk key={index} id={DESK_IDS[index]} status={status} />
      ))}
    </div>
  );
};

export default function SeatChart() {
  return (
    <div className="bg-background-white-0 border border-stroke-soft-200 rounded-md p-6 w-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-10 ">
        <div className="flex items-baseline gap-4">
          <h1 className="text-xl font-normal ">Morning Shift</h1>
          <p>09:00 AM - 05:00 PM (PST)</p>
        </div>

        <div className="flex items-center gap-8">
          {/* Legend */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-[3px] bg-primary-base"></div>
              <p>Active</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-[3px] bg-warning-base"></div>
              <p>Pending renewal</p>
            </div>
          </div>

          {/* Dropdown */}
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
      </div>

      {/* Layout Grid */}
      <div className="w-full flex gap-x-12 ">
        {/* Left Column */}
        <div className="flex flex-col gap-y-8 flex-1">
          <DeskBlock statuses={L1} />
          <DeskBlock statuses={L2} />
          <DeskBlock statuses={L3} />
          <DeskBlock statuses={L4} />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-y-8 flex-1">
          <DeskBlock statuses={R1} />
          <DeskBlock statuses={R2} />
          <DeskBlock statuses={R3} />
          <DeskBlock statuses={R4} />
        </div>
      </div>
    </div>
  );
}