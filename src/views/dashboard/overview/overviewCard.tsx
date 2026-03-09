import React from 'react'

export interface CardProps {
    title: string;
    value: number;
    caption?: string
}

const OverviewCard : React.FC<CardProps> = ({
    title,
    value,
    caption
}) => {
    return (
        <div className="bg-background-white-0 text-text-strong-950 flex flex-col gap-6 rounded-md border border-stroke-soft-200 px-6 py-4">
            <h6 className="text-base font-normal text-text-sub-600">{title}</h6>
            <h3 className="text-2xl font-medium">
                {value}
                <span className="pl-2 text-sm text-text-soft-400 tracking-normal font-normal">{caption}</span>
            </h3>
        </div>
    )
}

export default OverviewCard