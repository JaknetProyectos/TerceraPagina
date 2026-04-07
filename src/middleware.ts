import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Ignorar archivos internos y api
  matcher: ['/', '/(es|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};