const publicRoutes = ['/auth/login', '/auth/callback'];

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route));
}