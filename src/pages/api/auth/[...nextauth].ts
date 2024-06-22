import { createAppClient, viemConnector } from '@farcaster/auth-client';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {
  DOMAIN_GLOBAL,
  DOMAIN_EXAMPLE,
  UNIFIED_BACKEND_API_KEY,
  UNIFIED_BACKEND_API_KEY_SECRET,
} from '@/lib/services/loadEnv';
import { generateApiKeyAuth } from '@/lib/services/apiKeyAuth';
import { sign } from 'crypto';

export const authHandler = (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, authOptions);

export default authHandler;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'Sign in with Farcaster',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
        name: {
          label: 'Name',
          type: 'text',
          placeholder: '0x0',
        },
        pfp: {
          label: 'Pfp',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials, req) {
        try {
          const csrfToken = req.body?.csrfToken;

          const appClient = createAppClient({
            ethereum: viemConnector(),
          });

          const verifyResponse = await appClient.verifySignInMessage({
            message: credentials?.message as string,
            signature: credentials?.signature as `0x${string}`,
            domain: DOMAIN_EXAMPLE,
            // domain: 'localhost:3000',
            nonce: csrfToken,
          });
          const { success, fid } = verifyResponse;
          console.log('Inside authorize', success, fid);

          if (!success) {
            console.log('Inside NOT success');
            return null;
          }

          // Todo: Below code will call nestjs backend instead of supabase directly
          // 1. Need backend url
          // 2. Need to pass the fid to backend + its signature
          // calls register user endpoint
          // 3. Need to get the response from backend

          const payload = {
            fid: fid.toString(),
            name: credentials?.name as string,
            pfp: credentials?.pfp as string,
          };

          const { nonce, signature } = generateApiKeyAuth();

          const response = await fetch('http://localhost:5001/users/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': UNIFIED_BACKEND_API_KEY,
              'x-nonce': nonce,
              'x-signature': signature,
            },
            body: JSON.stringify(payload),
          });

          console.log('After auth creating users', response);
          const data = await response.json();
          return {
            id: data?.id,
            fid: fid.toString(),
            name: credentials?.name as string, // Todo: sync name and pfp to latest on backend
            image: credentials?.pfp as string,
          };
        } catch (error) {
          console.error('Error:', error);
          return null;
        }

        // End of authorise function
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },

    async jwt({ token, user, account, profile }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          fid: user.fid,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          fid: token.fid,
        },
      };
    },
  },
};
