import { redirect } from 'next/navigation'


export function requireAuth(callback: any) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    return token ? callback() : redirect('/login');
  }
  