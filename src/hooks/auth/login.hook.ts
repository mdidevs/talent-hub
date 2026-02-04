import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store/store';
import { loginUser, logoutUser } from '@/store/auth/auth.slice';
import { selectAuthLoading, selectAuthError, selectIsAuthenticated, selectUser } from '@/store/auth/auth.selector';
import type { LoginPayload } from '@/types/auth.type';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export const loginSchema = yup.object({
	email: yup.string().email('Invalid email').required('Email is required'),
	password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

export const loginResolver = yupResolver(loginSchema);

export const useLogin = () => {
	const dispatch = useDispatch<AppDispatch>();
	const isLoading = useSelector((s: RootState) => selectAuthLoading(s));
	const error = useSelector((s: RootState) => selectAuthError(s));
	const isAuthenticated = useSelector((s: RootState) => selectIsAuthenticated(s));
	const user = useSelector((s: RootState) => selectUser(s));

	const login = useCallback((payload: LoginPayload) => {
		return dispatch(loginUser(payload));
	}, [dispatch]);

	const logout = useCallback(() => {
		return dispatch(logoutUser());
	}, [dispatch]);

	return { login, logout, isLoading, error, isAuthenticated, user } as const;
};

export default useLogin;
