import { getServerSession, type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { GOOGLE_WORKSPACE_DOMAIN, isAvantiEmail } from './avanti-email';

const TEST_ACTOR_EMAIL = 'test@avantifellows.org';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { hd: GOOGLE_WORKSPACE_DOMAIN },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'google') return false;

      const googleProfile = profile as { email_verified?: boolean } | undefined;
      return googleProfile?.email_verified === true && isAvantiEmail(user.email);
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};

export async function requireActorEmail() {
  if (process.env.APP_ENV === 'testing') return TEST_ACTOR_EMAIL;

  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!isAvantiEmail(email)) throw new Error('Unauthorized');
  return email!;
}
