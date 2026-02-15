import { Checkbox } from "@/components/atomic/checkbox"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/atomic/field"

const PlanForm = () => {
    return (
        <form>
            <FieldGroup>
                <FieldLabel>
                    <Field orientation="horizontal">
                        <Checkbox id="toggle-checkbox-2" name="toggle-checkbox-2" />
                        <FieldContent>
                            <FieldTitle>Enable notifications</FieldTitle>
                            <FieldDescription>
                                You can enable or disable notifications at any time.
                            </FieldDescription>
                        </FieldContent>
                    </Field>
                </FieldLabel>
            </FieldGroup>
        </form>
    )
}

export default PlanForm