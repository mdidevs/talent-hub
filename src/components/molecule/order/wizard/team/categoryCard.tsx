import { Badge } from "@/components/atomic/badge";
import { Button } from "@/components/atomic/button";
import { ButtonGroup } from "@/components/atomic/button-group";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/atomic/card";
import { Input } from "@/components/atomic/input";
import { Minus, Plus } from "lucide-react";

const CategoryCard = () => {
    return (
        <Card className="w-full gap-6">
            <CardHeader>
                <CardTitle>L1 Support Engineer</CardTitle>
                <CardDescription>Tier 1 . CCNA</CardDescription>
                <CardAction>
                    <h5 className="text-lg leading-none">
                        $16
                        <span className="text-xs"> / day</span>
                    </h5>
                </CardAction>
            </CardHeader>
            <CardContent className="space-x-1 space-y-1">
                <Badge variant="secondary">Monitoring</Badge>
                <Badge variant="secondary">Ticketing</Badge>
            </CardContent>
            <CardFooter className="flex justify-between items-center gap-4">
                <ButtonGroup className="border border-primary-alpha-16 rounded-md overflow-hidden">
                    <Button variant="tertiary" className="h-9"><Plus /></Button>
                    <Input className="md:h-9 w-10 text-lg! text-center border-0 bg-primary-alpha-10" defaultValue="3" />
                    <Button variant="tertiary" className="h-9"><Minus /></Button>
                </ButtonGroup>
                <Button className="flex-1">Add to List</Button>
            </CardFooter>
        </Card>
    )
}

export default CategoryCard