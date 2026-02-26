import { Button } from "@/components/atomic/button";
import { Check } from "lucide-react";
import React from "react";

export interface ListProps {
    step: number;
    title: string;
    description?: string;
    buttonText?: string;
    status: boolean;
    onClick?: () => void;
}

const SetupList: React.FC<ListProps> = ({
    step,
    title,
    description,
    buttonText,
    status,
    onClick,
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center items-start gap-4">
                <div className="h-9 min-w-9 flex items-center justify-center bg-background-soft-200 rounded-full">{step}</div>
                <div className="space-y-1">
                    <h3 className="font-medium">{title}</h3>
                    <p>{description}</p>
                </div>
            </div>
            {status ?
                <div className="h-9 min-w-9 flex items-center justify-center bg-success-light rounded-full">
                    <Check size={20} />
                </div>
                :
                <Button onClick={onClick} variant={"secondary"} className="rounded-full">{buttonText}</Button>
            }
        </div>
    );
};

export default SetupList;