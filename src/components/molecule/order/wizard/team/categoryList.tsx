import { Button } from "@/components/atomic/button"
import { ButtonGroup } from "@/components/atomic/button-group"
import { Input } from "@/components/atomic/input"
import { Minus, Plus } from "lucide-react"
import React from 'react'
import useCategoryItem from '@/hooks/wizard/category.hook'

type Category = {
    id?: string | number;
    title?: string;
    description?: string;
    price?: number | string;
    unit?: string;
    qty?: number | string;
}

const CategoryList: React.FC<Category & { onAdd?: (id: number | string, qty?: number) => void }> = ({ title = 'Role', description = '', price = '', unit = '/ day', qty = 0, id, onAdd }) => {
    const { count, inc, dec, onChange: handleChange, handleAdd } = useCategoryItem({ id, initialQty: qty, onAdd })

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
                <Button className="flex-1" onClick={handleAdd}>Add to List</Button>
            </div>
        </div>
    )
}

export default CategoryList