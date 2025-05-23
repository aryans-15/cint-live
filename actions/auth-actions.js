'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { HOME_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from '@/constants';

export async function createSession(uid) {
  (await cookies()).set(SESSION_COOKIE_NAME, uid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  });

  redirect("/");
}

export async function removeSession() {
  (await cookies()).delete(SESSION_COOKIE_NAME);

  redirect(ROOT_ROUTE);
}