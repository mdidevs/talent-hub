import React from 'react';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { registerResolver } from '@/hooks/auth/register.hook';

import { Button } from '@/components/atomic/button';
import { Checkbox } from '@/components/atomic/checkbox';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, } from '@/components/atomic/field';
import { Input } from '@/components/atomic/input';
import { useRegister } from '@/hooks/auth';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

export const SignupForm: React.FC = () => {
  const { register: doRegister, isLoading, error: registerError } = useRegister();

  const { register, handleSubmit, control, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: registerResolver,
    mode: 'onTouched',
    defaultValues: { terms: false },
  });

  const onSubmit = async (data: FormValues) => {
    const name = `${data.firstName} ${data.lastName}`;
    doRegister({ name, email: data.email, password: data.password });
  };

  return (
    <div className="space-y-8 max-w-md">
      <h1 className='text-xl font-semibold'>Create an account</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <Input id="firstName" type="text" {...register('firstName')} />
              <FieldError>{(errors.firstName as any)?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Input id="lastName" type="text" {...register('lastName')} />
              <FieldError>{(errors.lastName as any)?.message}</FieldError>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input id="email" type="text" {...register('email')} />
            <FieldError>{(errors.email as any)?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" type="password" {...register('password')} />
            <FieldError>{(errors.password as any)?.message}</FieldError>
            <FieldDescription className='text-text-soft-400 text-xs'>
              The password must be at least 6 characters.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
            <FieldError>{(errors.confirmPassword as any)?.message}</FieldError>
          </Field>

          <Field orientation="horizontal">
            <Controller
              name="terms"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <>
                  <Checkbox
                    id="terms-checkbox"
                    checked={!!field.value}
                    onCheckedChange={(v) => field.onChange(Boolean(v))}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor="terms-checkbox">Accept terms and conditions</FieldLabel>
                    <FieldDescription className='-mt-2'>By clicking this checkbox, you agree to the terms.</FieldDescription>
                  </FieldContent>
                </>
              )}
            />
          </Field>

          {registerError && <FieldError>{registerError}</FieldError>}
          <Button
            type="submit"
            variant="default"
            size="lg"
            disabled={isSubmitting || isLoading || !watch('terms')}
          >
            Create account
          </Button>

        </FieldGroup>
      </form>
      <p>Already have an account? <Link to={'/login'}>Sign in</Link></p>
    </div>
  );
};

export default SignupForm;
