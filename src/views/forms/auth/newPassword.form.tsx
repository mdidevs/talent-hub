import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atomic/button';
import { Field, FieldError, FieldGroup, FieldLabel, } from '@/components/atomic/field';
import { Input } from '@/components/atomic/input';
import { useNewPassword, newPasswordResolver } from '@/hooks/auth/newPassword.hook';

type FormValues = {
  password: string;
  confirmPassword: string;
};

export const NewPasswordForm: React.FC = () => {
  const { setNewPassword, isLoading, error } = useNewPassword();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: newPasswordResolver,
    mode: 'onTouched',
  });

  const onSubmit = async (data: FormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    setNewPassword({ password: data.password });
  };

  return (
    <div className="space-y-8 max-w-md">
      <h1 className='text-xl font-semibold'>Change your password</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="newPassword">New password</FieldLabel>
              <Input 
                id="newPassword" 
                type="password" 
                {...register('password')}
              />
              <FieldError>{(errors.password as any)?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmNewPassword">Confirm new password</FieldLabel>
              <Input 
                id="confirmNewPassword" 
                type="password" 
                {...register('confirmPassword')}
              />
              <FieldError>{(errors.confirmPassword as any)?.message}</FieldError>
            </Field>
            {error && <FieldError>{error}</FieldError>}
            <Button type="submit" variant="default" size="lg" disabled={isSubmitting || isLoading}>Change password</Button>
          </FieldGroup>
      </form>
    </div>
  );
};

export default NewPasswordForm;
