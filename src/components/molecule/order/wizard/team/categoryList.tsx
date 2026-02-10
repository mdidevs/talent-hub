import { Button } from "@/components/atomic/button"
import { ButtonGroup } from "@/components/atomic/button-group"
import { Input } from "@/components/atomic/input"
import { Minus, Plus } from "lucide-react"

const CategoryList = () => {
    return (
        <div className="bg-background-white-0 p-4 flex flex-col md:flex-row justify-between md:items-center gap-4 rounded-md border border-stroke-soft-200">
            <div className="flex-1">
                <p className="text-xs font-medium">Tier 1 . CCNA</p>
                <h3>L1 Support Engineer</h3>
            </div>
            <div className="flex-1">
                <p className="text-xs font-medium">Per day</p>
                <h3> $16 </h3>
            </div>
            <div className="flex-1 flex gap-2">
                <ButtonGroup className="border border-primary-alpha-16 rounded-md overflow-hidden">
                    <Button variant="tertiary"><Plus /></Button>
                    <Input className="h-9! w-12 text-lg! text-center border-0 bg-primary-alpha-10" defaultValue="3" />
                    <Button variant="tertiary"><Minus /></Button>
                </ButtonGroup>
                <Button className="flex-1">Add to List</Button>
            </div>
        </div>
    )
}

export default CategoryList