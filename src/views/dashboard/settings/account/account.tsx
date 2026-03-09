import { Button } from "@/components/atomic/button"
import { Field, FieldError, FieldGroup, FieldLabel, } from "@/components/atomic/field"
import { Input } from "@/components/atomic/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/atomic/select"
import { Camera } from "lucide-react"

const Account = () => {
    return (
        <div className='space-y-4 md:space-y-16'>
            <div>
                <h5>Business</h5>
                <p>View and update your business details</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <h5 className="w-5/12">Profile photo</h5>
                <div className="w-7/12">
                    <Button variant={"tertiary"} className="h-16 w-16 flex items-center justify-center rounded-full">
                        <Camera size={18} />
                    </Button>
                </div>
            </div>

            {/* Authorized Signatory */}
            <div className="flex flex-col md:flex-row gap-4">
                <h5 className="md:w-5/12">Authorized Signatory</h5>
                <div className="md:w-7/12">
                    <FieldGroup>
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
                    </FieldGroup>
                </div>
            </div>

            {/* Company Information */}
            <div className="flex flex-col md:flex-row gap-4">
                <h5 className="md:w-5/12">Company Information</h5>
                <div className="md:w-7/12">
                    <FieldGroup>
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
                    </FieldGroup>
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button type="submit" variant="secondary" size="lg">Cancel</Button>
                <Button type="submit" variant="default" size="lg">Save changes</Button>
            </div>
        </div>
    )
}

export default Account