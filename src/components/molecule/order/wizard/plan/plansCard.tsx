import { Badge } from "@/components/atomic/badge"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/atomic/field"
import { RadioGroupItem } from "@/components/atomic/radio-group"

interface PlansCardProps {
    title: string
    description?: string
    price: string
    save?: string
    value: string
}

export const PlansCard = ({ title, description, price, save, value }: PlansCardProps) => {
    return (
        <FieldLabel htmlFor={`${value}-plan`}className={`${description? '' :'h-20 pt-3'} border border-stroke-soft-200`}>
            <Field orientation="horizontal" className="" >
                <FieldContent>
                    <FieldTitle>{title}</FieldTitle>
                    <FieldDescription className="pt-2">
                        {description}
                    </FieldDescription>
                </FieldContent>

                <RadioGroupItem hidden value={value} id={`${value}-plan`} />

                <div className="flex flex-col items-end gap-2">
                    <p className="text-stroke-strong-950">
                        {price} <span>/ month</span>
                    </p>

                    {save && <Badge variant="success">{save}</Badge>}
                </div>
            </Field>
        </FieldLabel>
    )
}