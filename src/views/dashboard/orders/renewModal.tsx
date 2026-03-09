import { Button } from "@/components/atomic/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/atomic/dialog"
import { Label } from "@/components/atomic/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/atomic/select"
import { Separator } from "@/components/atomic/separator"
import { ArrowRight } from "lucide-react"


const RenewModal = () => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button>Renew now</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Renew Booking #BK-9880</DialogTitle>
                </DialogHeader>

                <div className="mt-6 space-y-3">
                    <Label>Select Duration</Label>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="12 Month (10% Discount applied)" />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectGroup>
                                <SelectItem value="12">12 Month (10% Discount applied)</SelectItem>
                                <SelectItem value="6">6 Month (5% Discount applied)</SelectItem>
                                <SelectItem value="1">1 Month</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    <div className="my-8 space-y-3">
                        <Label>Monthly Cost Breakdown</Label>
                        <div className="flex items-center justify-between w-full">
                            <p>Professionals (4x) </p>
                            <h5 className="text-right font-medium">$3,840.00</h5>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p>Tax </p>
                            <h5 className="text-right font-medium">0.00</h5>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p>Shared facility fee </p>
                            <h5 className="text-right font-medium">0.00</h5>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between w-full">
                            <h5 className="text-sm fontm">Total Monthly Recurring</h5>
                            <h5 className="text-right font-medium">$3,840.00</h5>
                        </div>
                    </div>
                </div>
            <DialogFooter>
                <div className="w-full space-y-4">
                    <Button className="w-full">Confirm renewal & Pay <ArrowRight/></Button>
                    <p className="text-xs text-center">
                        By confirming, you agree to the updated
                        <a href="/" className="text-xs text-info-base hover:underline underline-offset-2"> Service Level Agreement (v2.1).</a>
                    </p>
                </div>
            </DialogFooter>
            
            </DialogContent>

        </Dialog>
    )
}

export default RenewModal