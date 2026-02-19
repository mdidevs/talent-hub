import { Badge } from "@/components/atomic/badge";
import { Button } from "@/components/atomic/button";
import { ButtonGroup } from "@/components/atomic/button-group";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atomic/card";
import { Input } from "@/components/atomic/input";
import { Minus, Plus } from "lucide-react";
import React from 'react';
import useWizard from '@/hooks/wizard/wizard.hook';

type Category = {
    id?: string | number;
    title?: string;
    description?: string;
    price?: number | string;
    unit?: string;
    badges?: string[];
    qty?: number | string;
}

const CategoryCard: React.FC<Category & { onAdd?: (id: number | string, qty?: number) => void }> = ({ title = 'Role', description = '', price = '', unit = '/ day', badges = [], qty = 0, id }) => {
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
            // remove if exists
            if (sel) remove(id as any);
            return;
        }
        if (sel) updateQty(id as any, Math.max(0, v));
        else add(id as any, Math.max(0, v));
    };

    return (
        <Card className="w-full gap-6">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <CardAction>
                    <h5 className="text-lg leading-none">
                        ${price}
                        <span className="text-xs"> {unit}</span>
                    </h5>
                </CardAction>
            </CardHeader>
            <CardContent className="space-x-1 space-y-1">
                {badges.map((b) => (
                    <Badge key={b} variant="secondary">{b}</Badge>
                ))}
            </CardContent>
            <CardFooter className="flex justify-between items-center gap-4">
                <ButtonGroup className="border border-primary-alpha-16 rounded-md overflow-hidden">
                    <Button variant="tertiary" className="h-9" onClick={inc}><Plus /></Button>
                    <Input className="md:h-9 w-10 text-lg! text-center border-0 bg-primary-alpha-10" value={String(count)} onChange={handleChange} />
                    <Button variant="tertiary" className="h-9" onClick={dec}><Minus /></Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    )
}

export default CategoryCard