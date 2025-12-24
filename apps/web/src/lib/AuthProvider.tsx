'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '../store/api/hook';
import { loadFromStorage } from '@/store/slices/authSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}
