import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;
import { i18n } from "./i18n-config";

import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

 
let locales = ['en', 'de', 'ru']



function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => {(negotiatorHeaders[key] = value)
  });
    // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales;


  if (negotiatorHeaders["next-url"]!=undefined)
  {
    console.log("next-url=" +negotiatorHeaders["next-url"] );
    const lang = negotiatorHeaders["next-url"].replace("/","");
        if (  locales.includes(lang))
        {
            return lang;
        }
  }
  console.log("next-url is missing");
  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages(
    locales,
  );

  const locale = matchLocale(languages, locales, i18n.defaultLocale);
  console.log('get locale locale=' + locale);
  return locale;
}


export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
 
  if (pathnameHasLocale) return
 
  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}
 

/*
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
 // console.log('nextUrl=' +   request.nextUrl
   console.log('nextUrl=' + request.nextUrl.toString());
  //  const pathname1 = pathname.replace("/", "");
  //  console.log('pathname1=' + pathname1);
  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = i18n.locales.every(

    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale =  getLocale(request);
    console.log('pathnameIsMissingLocale locale=' + locale);
    console.log('pathnameIsMissingLocale request=' + request);
  //  console.log('pathname=' + pathname1);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`,
        request.url,
      ),
    );
  }
}
*/

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};