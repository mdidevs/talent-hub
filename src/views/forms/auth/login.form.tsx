import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/atomic/button';
import { Field, FieldError, FieldGroup, FieldLabel, } from '@/components/atomic/field';
import { Input } from '@/components/atomic/input';
import { useLogin } from '@/hooks/auth';
import { loginResolver } from '@/hooks/auth/login.hook';

type FormValues = {
  email: string;
  password: string;
};

export const LoginForm: React.FC = () => {
  const { login: doLogin, isLoading, error: loginError } = useLogin();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: loginResolver,
    mode: 'onTouched',
  });

  const onSubmit = async (data: FormValues) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    doLogin({ email: data.email, password: data.password });
  };

  return (
    <div className="space-y-8 max-w-md">
      <h1 className='text-xl font-semibold'>Sign in to Cubicles</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input id="email" type="text" {...register('email')} />
              <FieldError>{(errors.email as any)?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" {...register('password')} />
              <FieldError>{(errors.password as any)?.message}</FieldError>
            </Field>
            <Link to={'/reset-password'}>Forgot password?</Link>
            {loginError && <FieldError>{loginError}</FieldError>}
            <Button type="submit" variant="default" size="lg" disabled={isSubmitting || isLoading}>Sign in</Button>
          </FieldGroup>
      </form>
      <p>Don't have an account yet? <Link to={'/signup'}>Create account</Link></p>
    </div>
  );
};

export default LoginForm;
