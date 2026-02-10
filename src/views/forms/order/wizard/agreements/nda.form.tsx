import { Button } from "@/components/atomic/button"
import { Checkbox } from "@/components/atomic/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel, } from "@/components/atomic/field"
import { Input } from "@/components/atomic/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/atomic/select"

const NdaForm = () => {
    return (
        <form>
            <FieldGroup>
                <h2>Authorized Signatory</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="first name">Full name*</FieldLabel>
                        <Input
                            id="first name"
                            type="text"
                        />
                        <FieldError></FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="last name">Last name*</FieldLabel>
                        <Input
                            id="last name"
                            type="text"
                        />
                        <FieldError></FieldError>
                    </Field>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">Email address*</FieldLabel>
                    <Input
                        id="email"
                        type="text"
                    />
                    <FieldError></FieldError>
                </Field>
                <Field>
                    <FieldLabel htmlFor="job-title">Job title*</FieldLabel>
                    <Input
                        id="job-title"
                        type="text"
                    />
                </Field>
                <h2>Company Information</h2>
                <Field>
                    <FieldLabel htmlFor="companey-name">Company name*</FieldLabel>
                    <Input
                        id="companey-name"
                        type="text"
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="business-address">Business address*</FieldLabel>
                    <Input
                        id="business-address"
                        type="text"
                        placeholder="Address line 1"
                    />
                    <Input
                        id="business-address"
                        type="text"
                        placeholder="Address line 2"
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="type-of-business">Type of business*</FieldLabel>
                    <Input
                        id="type-of-business"
                        type="text"
                    />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field>
                        <FieldLabel htmlFor="city">City*</FieldLabel>
                        <Input
                            id="city"
                            type="text"
                        />
                        <FieldError></FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="state">state*</FieldLabel>
                        <Input
                            id="state"
                            type="text"
                        />
                        <FieldError></FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="postel-code">Country*</FieldLabel>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                                <SelectGroup>
                                    <SelectItem value="United States">United States</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="Srilanka">Srilanka</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="postel-code">Postal code*</FieldLabel>
                        <Input
                            id="postel-code"
                            type="text"
                        />
                        <FieldError></FieldError>
                    </Field>
                </div>

                <Field orientation="horizontal">
                    <Checkbox id="billing-checkbox" name="billing-checkbox" />
                    <FieldLabel htmlFor="billing-checkbox">Billing address is the same as above.</FieldLabel>
                </Field>
                
                <Button type="submit" variant="default" size="lg">Continue</Button>

            </FieldGroup>
        </form>

    )
}

export default NdaForm