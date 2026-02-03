import { Button } from '@/components/atomic/button';
import { Field, FieldError, FieldGroup, FieldLabel, } from '@/components/atomic/field';
import { Input } from '@/components/atomic/input';
import React, { useState } from 'react';

interface ResetPasswordFormProps {
  onSubmit?: (email: string) => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({ email: '' });

  const validateForm = () => {
    const newErrors = { email: ''};
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

   

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit?.(email);
    }
  };

  return (
    <div className="space-y-8 max-w-md">
      <div className="space-y-2">
        <h1 className='text-xl font-semibold'>Reset your password</h1>
        <p className='text-text-sub-600'>Enter the e-mail address you signed up with, and we will send you instructions to reset your password.</p>
      </div>
      <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email address</FieldLabel>
              <Input 
                id="email" 
                type="text" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FieldError>{errors.email}</FieldError>
            </Field>

            <div className='flex flex-col gap-2'>
                <Button type="submit" variant="default" size="lg">Reset Password</Button>
                <Button type="submit" variant="outline" size="lg">Cancel</Button>
            </div>
          </FieldGroup>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
