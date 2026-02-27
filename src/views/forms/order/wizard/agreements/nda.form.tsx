import { Button } from "@/components/atomic/button"
import { Checkbox } from "@/components/atomic/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/atomic/field"
import { Input } from "@/components/atomic/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/atomic/select"
import { useNdaAgreement } from "@/hooks/wizard/nda-agreement.hook"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export const NdaForm = () => {
  const {
    isSubmitting,
    formRef,
    signUrl,
    runEnvelopeFlow,
  } = useNdaAgreement();

  const [isPreviewLoading, setIsPreviewLoading] = useState(true);

  // useForm for validation
  const { register, handleSubmit: rhfHandleSubmit, formState: { errors, isValid }, trigger, watch, getValues } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      jobTitle: '',
      companyName: '',
      businessAddressLine1: '',
      typeOfBusiness: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
  });

  // Watch country value for conditional validation
  const watchedCountry = watch('country');

  // Remove auto PDF preview effect

  // Combine loader states for API and PDF loading
  const isLoading = isSubmitting;


  // Only generate PDF on submit
  const onSubmit = async (data: Record<string, string>, event?: React.BaseSyntheticEvent) => {
    if (event) event.preventDefault();
    // Create a FormData object from the submitted data
    const form = document.createElement('form');
    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });
    // Call runEnvelopeFlow to generate PDF
    await runEnvelopeFlow(form, 'submit');
  };

  return (
    <form ref={formRef} onSubmit={rhfHandleSubmit(onSubmit)} className="relative">
      <FieldGroup>
        <h2>Authorized Signatory</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="first name">Full name*</FieldLabel>
            <Input
              id="first name"
              type="text"
              {...register('firstName', { required: 'First name is required' })}
            />
            <FieldError>{errors.firstName?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="last name">Last name*</FieldLabel>
            <Input
              id="last name"
              type="text"
              {...register('lastName', { required: 'Last name is required' })}
            />
            <FieldError>{errors.lastName?.message}</FieldError>
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email address*</FieldLabel>
          <Input
            id="email"
            type="email"
            {...register('email', { required: 'Email is required', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Invalid email' } })}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="job-title">Job title*</FieldLabel>
          <Input id="job-title" type="text" {...register('jobTitle', { required: 'Job title is required' })} name="jobTitle" />
          <FieldError>{errors.jobTitle?.message}</FieldError>
        </Field>
        <h2>Company Information</h2>
        <Field>
          <FieldLabel htmlFor="companey-name">Company name*</FieldLabel>
          <Input id="companey-name" type="text" {...register('companyName', { required: 'Company name is required' })} name="companyName" />
          <FieldError>{errors.companyName?.message}</FieldError>
        </Field>
        <Field>
          <FieldLabel htmlFor="business-address">Business address*</FieldLabel>
          <Input
            id="business-address-line1"
            type="text"
            placeholder="Address line 1"
            {...register('businessAddressLine1', { required: 'Address line 1 is required' })}
            name="businessAddressLine1"
          />
          <FieldError>{errors.businessAddressLine1?.message}</FieldError>
          <Input
            id="business-address-line2"
            type="text"
            placeholder="Address line 2"
            name="businessAddressLine2"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="type-of-business">Type of business*</FieldLabel>
          <Input id="type-of-business" type="text" {...register('typeOfBusiness', { required: 'Type of business is required' })} name="typeOfBusiness" />
          <FieldError>{errors.typeOfBusiness?.message}</FieldError>
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="city">City*</FieldLabel>
            <Input id="city" type="text" {...register('city', { required: 'City is required' })} name="city" />
            <FieldError>{errors.city?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="state">
              <span style={{ color: 'red' }}>*</span> State
            </FieldLabel>
            <Input id="state" type="text" {...register('state', { required: 'State is required' })} name="state" />
            <FieldError>{errors.state?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="postel-code">Country*</FieldLabel>
            <Select
              value={watchedCountry}
              onValueChange={(value) => {
                // set value in react-hook-form
                // react-hook-form's register handles value
                // No need to call setCountry
                setTimeout(() => { trigger('country'); }, 0);
              }}
            >
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
            <input
              type="hidden"
              {...register('country', {
                validate: (value) => {
                  if (value && value.trim() === '') return 'Country is required';
                  if (!value && watchedCountry) return 'Country is required';
                  return true;
                },
              })}
              value={watchedCountry}
              name="country"
            />
            <FieldError>{errors.country?.message}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="postel-code">Postal code*</FieldLabel>
            <Input id="postel-code" type="text" {...register('zipCode', { required: 'Postal code is required' })} name="zipCode" />
            <FieldError>{errors.zipCode?.message}</FieldError>
          </Field>
        </div>

        <Field orientation="horizontal">
          <Checkbox id="billing-checkbox" name="billing-checkbox" />
          <FieldLabel htmlFor="billing-checkbox">Billing address is the same as above.</FieldLabel>
        </Field>

        <Button type="submit" variant="default" size="lg" disabled={isSubmitting || !isValid}>
          {isSubmitting ? "Loading…" : "Continue"}
        </Button>

        {/* Agreement Preview Loader removed */}

        {/* API Call Loader Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50">
            <span className="loader" />
          </div>
        )}
      </FieldGroup>
    </form>
  )
}

export default NdaForm
