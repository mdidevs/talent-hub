import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { resetPassword } from '@/store/auth/auth.slice';
import { selectAuthLoading, selectAuthError } from '@/store/auth/auth.selector';
import type { ResetPayload } from '@/types/auth.type';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export const resetSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
}).required();

export const resetResolver = yupResolver(resetSchema);

export const useReset = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((s: RootState) => selectAuthLoading(s));
  const error = useSelector((s: RootState) => selectAuthError(s));

  const reset = useCallback((payload: ResetPayload) => {
    return dispatch(resetPassword(payload));
  }, [dispatch]);

  return { reset, isLoading, error } as const;
};

export default useReset;
