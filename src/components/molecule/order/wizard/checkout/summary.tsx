import { Button } from "@/components/atomic/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/atomic/card"
import { Field, FieldLabel } from "@/components/atomic/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/atomic/select"
import { useWizardPricing } from "@/hooks/wizard/wizard-pricing.hook"

const Summary = () => {
    const { lineItems, subtotal, formatAmount, totalSeats, hasSelections, currency } = useWizardPricing()

    return (
        <Card>
            <CardHeader>Service Breakdown</CardHeader>
            <CardContent className="space-y-3">
                <Field>
                    <FieldLabel>Select Duration</FieldLabel>
                    <Select defaultValue="12-Month">
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper">
                            <SelectGroup>
                                <SelectItem value="12-Month">12 Month (10% Discount applied)</SelectItem>
                                <SelectItem value="24-Month">24 Month</SelectItem>
                                <SelectItem value="48-Month">48 Month</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
                <div className="space-y-3">
                    <div className="p-3 flex justify-between bg-primary-alpha-10 border border-primary-alpha-16 rounded-md">
                        <div>
                            <p>Team &amp; Workspace</p>
                            <h5 className="text-base font-semibold">{totalSeats || 0} Professionals Selected</h5>
                        </div>
                        <Button variant={"link"} className="text-info-base">Edit</Button>
                    </div>
                    <div className="space-y-2">
                        {hasSelections ? (
                            lineItems.map((item) => (
                                <div key={item.id} className="flex items-start justify-between gap-2 rounded-md border border-border px-3 py-2">
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.qty} × {formatAmount(item.unitPrice)} {item.unitLabel ?? currency}
                                        </p>
                                    </div>
                                    <p className="font-semibold">{formatAmount(item.subtotal)}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">Select at least one service to view a live breakdown.</p>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <div className="mt-10 space-y-3 w-full">
                    <h6 className="font-medium text-sm">Monthly Cost Breakdown</h6>
                    <div className="flex justify-between gap-2">
                        <p>Services ({totalSeats || 0} seats)</p>
                        <p>{formatAmount(subtotal)}</p>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p>Tax</p>
                        <p>{formatAmount(0)}</p>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p>Shared facility fee</p>
                        <p>{formatAmount(0)}</p>
                    </div>
                    <div className="flex justify-between gap-2 py-4 border-t border-stroke-soft-200">
                        <h3 className="font-semibold">Total</h3>
                        <h3 className="font-semibold">{formatAmount(subtotal)}</h3>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default Summary

