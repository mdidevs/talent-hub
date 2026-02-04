import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { registerUser } from '@/store/auth/auth.slice';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated, selectUser } from '@/store/auth/auth.selector';
import type { RegisterPayload } from '@/types/auth.type';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Validation schema for registration forms
export const registerSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
  terms: yup.boolean().oneOf([true], 'You must accept the terms'),
}).required();

export const registerResolver = yupResolver(registerSchema);

export const useRegister = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((s: RootState) => selectAuthLoading(s));
  const error = useSelector((s: RootState) => selectAuthError(s));
  const isAuthenticated = useSelector((s: RootState) => selectIsAuthenticated(s));
  const user = useSelector((s: RootState) => selectUser(s));

  const register = useCallback((payload: RegisterPayload) => {
    return dispatch(registerUser(payload));
  }, [dispatch]);

  return { register, isLoading, error, isAuthenticated, user } as const;
};

export default useRegister;
