import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '@farcaster/auth-kit/styles.css';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { SessionProvider } from 'next-auth/react';
import { useState, createContext } from 'react';
import { signOut } from 'next-auth/react';
import { monaFont } from '@/font/fonts';
import { FARCASTER_AUTH_CONFIG } from '@/lib/services/config';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <div className={monaFont.variable}>
      <SessionProvider session={session}>
        <AuthKitProvider config={FARCASTER_AUTH_CONFIG}>
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}
            >
              Sign Out
            </button>
          )}

          <Component {...pageProps} />
        </AuthKitProvider>
      </SessionProvider>
    </div>
  );
}
