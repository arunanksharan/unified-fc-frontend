import Image from 'next/image';
import { Inter } from 'next/font/google';
import LandingPage from '@/components/landing-page/LandingPage';
import { GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export default function Home({ staticContent }: { staticContent: string }) {
  const { data: session, status } = useSession();
  console.log('Session: ', session);
  return (
    <div className="min-w-full min-h-screen text-white text-3xl">
      {/* {!session && staticContent} */}
      {/* Render additional client-side dynamic content here */}

      <LandingPage />
    </div>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const staticContent = 'This is static content that loads immediately.';

  return {
    props: {
      staticContent,
    },
  };
};
