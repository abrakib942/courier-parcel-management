import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import type { LoginRequest, RegisterRequest, AuthResponse } from '../../types/auth';
import type { ApiResponse } from '../../types/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: credentials => ({
        url: '/api/v1/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
      query: userData => ({
        url: '/api/v1/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    getProfile: builder.query<ApiResponse<{ user: any }>, void>({
      query: () => '/api/v1/auth/profile',
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetProfileQuery } = authApi;
