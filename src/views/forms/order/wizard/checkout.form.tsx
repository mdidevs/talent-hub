import { Button } from "@/components/atomic/button"
import { Field, FieldGroup, FieldLabel } from "@/components/atomic/field"
import { Input } from "@/components/atomic/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from "@/components/atomic/select"

const CheckoutForm = () => {
  return (
    <form>
      <FieldGroup>
        <Field>
          <FieldLabel>Card number *</FieldLabel>
          <Input type="text" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="exp">Expiration date *</FieldLabel>
            <Input type="text" id="exp" />
          </Field>
          <Field>
            <FieldLabel htmlFor="cvv">Security code *</FieldLabel>
            <Input type="text" id="cvv" />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
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
            <FieldLabel htmlFor="exp">Postal code*</FieldLabel>
            <Input type="text" id="exp" />
          </Field>
        </div>
        <div className="bg-secondary-alpha-10 p-3 pt-2 rounded-md">
            <div className="flex justify-between items-center">
              <h6 className="text-sm leading-0">Billing info</h6>
              <Button variant={'link'}>Edit</Button>
            </div>
            <p>1226 University Drive</p>
            <p>Menlo Park, California, 94025</p>
        </div>
        <Button type="submit" variant="default" size="lg">Pay $3,840.00</Button>
      </FieldGroup>
    </form>
  )
}

export default CheckoutForm