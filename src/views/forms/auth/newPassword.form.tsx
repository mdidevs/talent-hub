import { Button } from '@/components/atomic/button';
import { Field, FieldError, FieldGroup, FieldLabel, } from '@/components/atomic/field';
import { Input } from '@/components/atomic/input';
import React, { useState } from 'react';

interface NewPasswordFormProps {
  onSubmit?: (email: string, password: string) => void;
}

export const NewPasswordForm: React.FC<NewPasswordFormProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState('');
  const [confirmNewPassword, setconfirmNewPassword] = useState('');
  const [errors, setErrors] = useState({  password: '', confirmNewPassword: '' });

  const validateForm = () => {
    const newErrors = {  password: '', confirmNewPassword: '' };
    let isValid = true;

    if (password !== confirmNewPassword) {
      newErrors.confirmNewPassword = 'Passwords do not match';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit?.(password, confirmNewPassword);
    }
  };

  return (
    <div className="space-y-8 max-w-md">
      <h1 className='text-xl font-semibold'>Change your password</h1>
      <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="newPassword">New password</FieldLabel>
              <Input 
                id="newPassword" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FieldError>{errors.password}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirmNewPassword">Confirm new password</FieldLabel>
              <Input 
                id="confirmNewPassword" 
                type="password" 
                value={confirmNewPassword}
                onChange={(e) => setconfirmNewPassword(e.target.value)}
              />
              <FieldError>{errors.confirmNewPassword}</FieldError>
            </Field>
            <Button type="submit" variant="default" size="lg">Change password</Button>
          </FieldGroup>
      </form>
    </div>
  );
};

export default NewPasswordForm;
