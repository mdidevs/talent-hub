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

const CategoryList: React.FC<Category & { onAdd?: (id: number | string, qty?: number) => void }> = ({ title = 'Role', description = '', price = '', unit = '/ day', qty = 0, id }) => {
    const { selected, add, updateQty, remove } = useWizard();
    const sel = selected.find((s) => String(s.categoryId) === String(id));
    const count = sel ? Number(sel.qty) : Number(qty || 0);

    const inc = () => {
        if (sel) updateQty(id as any, count + 1);
        else add(id as any, 1);
    };
    const dec = () => {
        if (!sel) return;
        if (count <= 1) remove(id as any);
        else updateQty(id as any, count - 1);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = Number(e.target.value);
        if (!Number.isFinite(v) || v <= 0) {
            if (sel) remove(id as any);
            return;
        }
        if (sel) updateQty(id as any, Math.max(0, v));
        else add(id as any, Math.max(0, v));
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