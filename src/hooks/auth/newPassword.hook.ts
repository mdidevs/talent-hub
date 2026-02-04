import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { newPassword } from '@/store/auth/auth.slice';
import { selectAuthLoading, selectAuthError } from '@/store/auth/auth.selector';
import type { NewPasswordPayload } from '@/types/auth.type';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export const newPasswordSchema = yup.object({
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
}).required();

export const newPasswordResolver = yupResolver(newPasswordSchema as any);

export const useNewPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((s: RootState) => selectAuthLoading(s));
  const error = useSelector((s: RootState) => selectAuthError(s));

  const setNewPassword = useCallback((payload: NewPasswordPayload) => {
    return dispatch(newPassword(payload));
  }, [dispatch]);

  return { setNewPassword, isLoading, error } as const;
};

export default useNewPassword;
