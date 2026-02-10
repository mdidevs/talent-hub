import { Badge } from "@/components/atomic/badge";
import { Button } from "@/components/atomic/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atomic/card";
import {  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/atomic/select";

import { X } from "lucide-react";
const ShifrShedulerCard = () => {
  return (
    <Card className="gap-5">
        <CardHeader>
                <CardTitle>Morning Shift</CardTitle>
                <CardDescription>
                    09:00 AM - 05:00 PM (PST)
                </CardDescription>
                <CardAction>
                    <Badge variant="tertiary">
                        0 Staff Assigned
                    </Badge>
                </CardAction>
        </CardHeader>
        <CardContent>
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue  placeholder="Select a fruit" />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectGroup>
                        <SelectItem value="apple">L1 Support Engineer (2 availble)</SelectItem>
                        <SelectItem value="banana">L2 Network Architect (2 availble)</SelectItem>
                        <SelectItem value="blueberry">Incident Responder (1 availble)</SelectItem>
                        <SelectItem value="grapes" disabled>Security Analyst </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </CardContent>
        <CardFooter className="-mt-2 flex-wrap gap-1">
            <Badge variant="ghost" className="p-0 pl-2 gap-x-1 bg-background-soft-200 rounded-md overflow-hidden">
                    <p className="max-w-20 text-xs font-medium truncate">L1 Support Engineer </p>
                    <Button size="sm" variant="ghost" className="h-6 w-6 rounded-none">
                        <X/>
                    </Button>
            </Badge>
            <Badge variant="ghost" className="p-0 pl-2 gap-x-1 bg-background-soft-200 rounded-md overflow-hidden">
                    <p className="max-w-20 text-xs font-medium truncate">L1 Support Engineer </p>
                    <Button size="sm" variant="ghost" className="h-6 w-6 rounded-none">
                        <X/>
                    </Button>
            </Badge>
        </CardFooter>
    </Card>
  )
}

export default ShifrShedulerCard