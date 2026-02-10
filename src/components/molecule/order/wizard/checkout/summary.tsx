import { Button } from "@/components/atomic/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/atomic/card"
import { Field, FieldLabel } from "@/components/atomic/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/atomic/select"

const Summary = () => {
    return (
        <Card>
            <CardHeader>Service Breakdown</CardHeader>
            <CardContent className="space-y-3">
                <Field>
                    <FieldLabel>Select Duration</FieldLabel>
                    <Select defaultValue="12-Month">
                        <SelectTrigger>
                            <SelectValue  />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectGroup>
                                <SelectItem value="12-Month">12 Month(10% Discount applied)</SelectItem>
                                <SelectItem value="24-Month">24 Month</SelectItem>
                                <SelectItem value="48-Month">48 Month</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
                <div className="p-3 flex justify-between bg-primary-alpha-10 border border-primary-alpha-16 rounded-md">
                    <div>
                        <p>Team & Workspace</p>
                        <h5>Renew 4 Professionals and Seats</h5>
                    </div>
                    <Button variant={"link"} className="text-info-base">Edit</Button>
                </div>
            </CardContent>
            <CardFooter>
                <div className="mt-10 space-y-3 w-full">
                    <h6 className="font-medium text-sm">Monthly Cost Breakdown</h6>
                    <div className="flex justify-between gap-2">
                        <p>Professionals (4x) </p>
                        <p>$3,840.00</p>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p>Tax </p>
                        <p>$0.00</p>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p>Shared facility fee </p>
                        <p>$0.00</p>
                    </div>
                    <div className="flex justify-between gap-2 py-4 border-t border-stroke-soft-200">
                        <h3>Professionals (4x) </h3>
                        <h3>$3,840.00</h3>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default Summary

