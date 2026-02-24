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

    const totalForCategory = selected.reduce((sum, s) => String(s.categoryId) === String(id) ? sum + (s.qty || 0) : sum, 0);
    const count = Number(totalForCategory || qty || 0);

    const inc = () => {
        // add a new record for this category (one member)
        add(id as any, 1);
    };
    const dec = () => {
        // remove one occurrence
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