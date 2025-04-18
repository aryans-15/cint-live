import { NextRequest, NextResponse } from 'next/server';
import { HOME_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from './constants';

const protectedRoutes = ["/challenges"];

export default function middleware(request) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || '';

  if (!session && protectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL(ROOT_ROUTE, request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

}