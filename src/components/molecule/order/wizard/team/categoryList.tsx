import { Button } from "@/components/atomic/button"
import { ButtonGroup } from "@/components/atomic/button-group"
import { Input } from "@/components/atomic/input"
import { Minus, Plus } from "lucide-react"
import React from 'react'
import useWizard from '@/hooks/wizard/wizard.hook'

type Category = {
    id?: string | number;
    title?: string;
    description?: string;
    price?: number | string;
    unit?: string;
    qty?: number | string;
}

const CategoryList: React.FC<Category & { onAdd?: (id: number | string, qty?: number) => void }> = ({ title = 'Role', description = '', price = '', qty = 0, id }) => {
    const { selected, add, remove } = useWizard();
    const totalForCategory = selected.reduce((sum, s) => String(s.categoryId) === String(id) ? sum + (s.qty || 0) : sum, 0);
    const count = Number(totalForCategory || qty || 0);

    const inc = () => {
        add(id as any, 1);
    };
    const dec = () => {
        remove(id as any);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = Number(e.target.value || 0);
        if (!Number.isFinite(v) || v <= 0) {
            // remove all occurrences
            let remaining = selected.reduce((sum, s) => String(s.categoryId) === String(id) ? sum + (s.qty || 0) : sum, 0);
            while (remaining > 0) {
                remove(id as any);
                remaining -= 1;
            }
            return;
        }

        const current = selected.reduce((sum, s) => String(s.categoryId) === String(id) ? sum + (s.qty || 0) : sum, 0);
        const diff = v - current;
        if (diff > 0) {
            for (let i = 0; i < diff; i++) add(id as any, 1);
        } else if (diff < 0) {
            for (let i = 0; i < Math.abs(diff); i++) remove(id as any);
        }
    };

    return (
        <div className="bg-background-white-0 p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 rounded-md border border-stroke-soft-200">
            <div className="flex-1">
                <p className="text-xs font-medium">{description}</p>
                <h3>{title}</h3>
            </div>
            <div className="flex-1">
                <p className="text-xs font-medium">Per day</p>
                <h3> ${price} </h3>
            </div>
            <div className="flex-1 flex gap-2">
                <ButtonGroup className="border border-primary-alpha-16 rounded-md overflow-hidden">
                    <Button variant="tertiary" onClick={inc}><Plus /></Button>
                    <Input className="h-9! w-12 text-lg! text-center border-0 bg-primary-alpha-10" value={String(count)} onChange={handleChange} />
                    <Button variant="tertiary" onClick={dec}><Minus /></Button>
                </ButtonGroup>
            </div>
        </div>
    )
}

export default CategoryList