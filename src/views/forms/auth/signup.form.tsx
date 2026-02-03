import { Button } from '@/components/atomic/button';
import { Checkbox } from '@/components/atomic/checkbox';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, } from '@/components/atomic/field';
import { Input } from '@/components/atomic/input';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface SignupFormProps {
  onSubmit?: (email: string, password: string) => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
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
      onSubmit?.(email, password);
    }
  };

  return (
    <div className="space-y-8 max-w-md">
      <h1 className='text-xl font-semibold'>Create an account</h1>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <Input
                id="firstName"
                type="text"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Input
                id="lastName"
                type="text"
              />
            </Field>
          </div>
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
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FieldError>{errors.password}</FieldError>
            <FieldDescription className='text-text-soft-400 text-xs'>
              The password must be at least 8 characters long and have at least 1 uppercase letter and number or be a long passphrase
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FieldError>{errors.password}</FieldError>
          </Field>

          {/* Terms and conditions */}

          <Field orientation="horizontal">
            <Checkbox
              id="terms-checkbox-2"
              name="terms-checkbox-2"
              defaultChecked
            />
            <FieldContent>
              <FieldLabel htmlFor="terms-checkbox-2">
                Accept terms and conditions
              </FieldLabel>
              <FieldDescription className='-mt-2'>
                By clicking this checkbox, you agree to the terms.
              </FieldDescription>
            </FieldContent>
          </Field>

          <Button type="submit" variant="default" size="lg">Create account</Button>
        
        </FieldGroup>
      </form>
      <p>Already have an account? <Link to={'/login'}>Sign in</Link></p>
    </div>
  );
};

export default SignupForm;
