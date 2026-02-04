import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atomic/button';
import { Field, FieldError, FieldGroup, FieldLabel, } from '@/components/atomic/field';
import { Input } from '@/components/atomic/input';
import { useReset } from '@/hooks/auth/reset.hook';
import { resetResolver } from '@/hooks/auth/reset.hook';

type FormValues = {
  email: string;
};

export const ResetPasswordForm: React.FC = () => {
  const { reset, isLoading, error } = useReset();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: resetResolver,
    mode: 'onTouched',
  });

  const onSubmit = async (data: FormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    reset({ email: data.email });
  };

  return (
    <div className="space-y-8 max-w-md">
      <div className="space-y-2">
        <h1 className='text-xl font-semibold'>Reset your password</h1>
        <p className='text-text-sub-600'>Enter the e-mail address you signed up with, and we will send you instructions to reset your password.</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input 
                id="email" 
                type="text" 
                {...register('email')}
              />
              <FieldError>{(errors.email as any)?.message}</FieldError>
            </Field>

            {error && <FieldError>{error}</FieldError>}
            <div className='flex flex-col gap-2'>
                <Button type="submit" variant="default" size="lg" disabled={isSubmitting || isLoading}>Reset Password</Button>
                <Button type="button" variant="outline" size="lg">Cancel</Button>
            </div>
          </FieldGroup>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
