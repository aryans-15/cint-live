import { NextRequest, NextResponse } from 'next/server';
import { HOME_ROUTE, ROOT_ROUTE, SESSION_COOKIE_NAME } from './constants';

const protectedRoutes = ["/challenges", "/myteam", "/findteam"];

export default function middleware(request) {
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value || '';

  // Not logged in 
  if (!session && protectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL(ROOT_ROUTE, request.nextUrl.origin);
    if (request.nextUrl.pathname === "/challenges") {
      absoluteURL.searchParams.set('error', 'noauthchall');
    } else if (request.nextUrl.pathname === "/myteam" || request.nextUrl.pathname === "/findteam") {
      absoluteURL.searchParams.set('error', 'noauthteam');
    } else {
      absoluteURL.searchParams.set('error', 'noauth');
    }
    return NextResponse.redirect(absoluteURL.toString());
  }
}