import { Label } from "@/components/atomic/label"
import { Button } from "@/components/atomic/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/atomic/dialog"
import { Input } from "@/components/atomic/input"
import { Plus } from "lucide-react"
const InviteModal = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus/> Invite member
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite team member</DialogTitle>
                    <DialogDescription>Share your business with other team members.</DialogDescription>
                </DialogHeader>

                <div className="my-6 space-y-3">
                    <Label>Email address *</Label>
                    <Input />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Dismiss</Button>
                    </DialogClose>
                    <Button>Send invite</Button>
                </DialogFooter>

            </DialogContent>

        </Dialog>
    )
}

export default InviteModal