"use client";
import { Button } from "@/components/atomic/button";
import { ButtonGroup } from "@/components/atomic/button-group";
import CategoryCard from "@/components/molecule/order/wizard/team/categoryCard";
import CategoryList from "@/components/molecule/order/wizard/team/categoryList";
import ShifrShedulerCard from "@/components/molecule/order/wizard/team/shifrShedulerCard";
import { Grid2X2, Rows3 } from "lucide-react";
import { useState } from "react";


export const TeamForm = () => {
    const [listMode, setListMode] = useState<'grid' | 'rows'>('rows');
    
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-8/12 space-y-8">
                    {/* Title */}
                    <div className="space-y-1 flex flex-row md:justify-between gap-2">
                        <div className="flex-1">
                            <h3 className='text-xl font-semibold'>Configure your team</h3>
                            <p>Select the number of professionals required for your operations.</p>
                        </div>
                        <div className="hidden md:block">
                            <ButtonGroup className="rounded-md ">
                                <Button size={'sm'} className={`${listMode === "rows" ? "bg-primary-alpha-16" : "bg-background-white-0"} text-text-strong-950 hover:bg-primary-alpha-10`} onClick={() => setListMode("rows")}><Rows3 /></Button>
                                <Button size={'sm'} className={`${listMode === "grid" ? "bg-primary-alpha-16" : "bg-background-white-0"} text-text-strong-950 hover:bg-primary-alpha-10`} onClick={() => setListMode("grid")}><Grid2X2 /></Button>
                            </ButtonGroup>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h3 className='text-lg font-medium'>NOC Professionals</h3>
                        {listMode === 'grid' ?
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CategoryCard />
                                <CategoryCard />
                                <CategoryCard />
                                <CategoryCard />
                            </div>
                            :
                            <div className="space-y-3">
                                <CategoryList />
                                <CategoryList />
                                <CategoryList />
                                <CategoryList />
                            </div>
                        }
                    </div>
                </div>
                <div className="md:w-4/12 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className='text-lg font-medium'>Scheduler Shift</h3>
                        <p>Remaining : <span className="text-text-strong-950">0</span></p>
                    </div>

                    <div className="space-y-4">
                        <ShifrShedulerCard />
                        <ShifrShedulerCard />
                        <ShifrShedulerCard />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamForm;


