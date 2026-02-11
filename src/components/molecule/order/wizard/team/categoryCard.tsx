import { Badge } from "@/components/atomic/badge";
import { Button } from "@/components/atomic/button";
import { ButtonGroup } from "@/components/atomic/button-group";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atomic/card";
import { Input } from "@/components/atomic/input";
import { Minus, Plus } from "lucide-react";
import React from 'react';
import useCategoryItem from '@/hooks/wizard/category.hook';

type Category = {
    id?: string | number;
    title?: string;
    description?: string;
    price?: number | string;
    unit?: string;
    badges?: string[];
    qty?: number | string;
}

const CategoryCard: React.FC<Category & { onAdd?: (id: number | string, qty?: number) => void }> = ({ title = 'Role', description = '', price = '', unit = '/ day', badges = [], qty = 0, id, onAdd }) => {
    const { count, inc, dec, onChange: handleChange, handleAdd } = useCategoryItem({ id, initialQty: qty, onAdd });

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
                <Button className="flex-1" onClick={handleAdd}>Add to List</Button>
            </CardFooter>
        </Card>
    )
}

export default CategoryCard