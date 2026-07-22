import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => process.env.APP_ENV === 'testing' || Boolean(token),
  },
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)'],
};
