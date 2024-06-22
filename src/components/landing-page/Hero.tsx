import React, { useEffect, useRef, useCallback, useState } from 'react';
import { Inter } from '@next/font/google';
import Spline from '@splinetool/react-spline';
import { SignInButton, StatusAPIResponse } from '@farcaster/auth-kit';
import { useRouter } from 'next/navigation';
import { useSession, signIn, getCsrfToken } from 'next-auth/react';
import FarcasterLoginBtn from '../atoms/farcaster/FarcasterLoginBtn';
import UserAvatar from '../atoms/navbar/UserAvatar';
import { FaSpinner } from 'react-icons/fa';

const inter = Inter({ subsets: ['latin'] });

const Hero = () => {
  const [error, setError] = useState(false);
  const { data: session, status } = useSession();
  console.log('Session: ', session);
  console.log('Status: ', status);

  const handleContactClick = () => {
    window.open('https://calendly.com/arunank/point_blank_30_min', '_blank');
  };

  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error('Unable to generate nonce');
    console.log('Nonce: ', nonce);
    return nonce;
  }, []);
  const handleSuccess = useCallback(async (res: StatusAPIResponse) => {
    console.log('Inside signin', res);
    const result = await signIn('credentials', {
      message: res.message,
      signature: res.signature,
      name: res.username,
      pfp: res.pfpUrl,
      redirect: false,
    });
    if (result?.ok) {
      console.log('Sign in successful');
      console.log(JSON.stringify(result));
    }
  }, []);

  return (
    <div className="relative min-w-full min-h-screen flex flex-col items-center justify-center p-4 md:p-8 ">
      <Spline
        className="absolute w-full h-full"
        scene="https://prod.spline.design/AHdTLBTO6jQVwZVB/scene.splinecode"
      />

      <div className="top-2 right-10 absolute text-white">
        {status === 'loading' && (
          <div className="flex flex-row justify-center items-center rounded-lg bg-showcastNavbar hover:bg-gsElectricBlue w-full mt-6 px-24 py-3">
            <div>
              <span className="farcaster-login-btn-loading">
                <FaSpinner className="animate-spin" />
              </span>
            </div>
          </div>
        )}
        {status === 'unauthenticated' && (
          <FarcasterLoginBtn
            nonce={getNonce}
            onSuccess={handleSuccess}
            onError={() => setError(true)}
          />
        )}
        {status === 'authenticated' && (
          <UserAvatar
            bgColor="showcastNavbar"
            bgColorHover="showcastNavbarHover"
          />
        )}
        {status === 'authenticated'}
      </div>

      <div className="relative bottom-10 inline-flex font-urbanist text-white text-6xl sm:text-8xl md:text-9xl lg:text-[144px] xl:text-[144px] font-bold">
        farcaster labs
      </div>
      <div className="relative inline-flex font-urbanist text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold ">
        {/* <div className="z-10 text-center font-urbanist text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold"> */}
        one platform to rule them all
      </div>
      <div className="relative flex flex-col gap-4 items-center justify-center mt-32 sm:mt-32 md:mt-32 lg:mt-32">
        <div className="w-full">
          <button
            className="relative sm:text-xl md:text-xl lg:text-xl text-black font-urbanist font-bold w-full"
            onClick={handleContactClick}
          >
            {/* <button className="z-10 text-base md:text-lg lg:text-xl text-black font-bold mt-8 md:mt-16 lg:mt-32"> */}
            <div className="absolute inset-x-0 h-full -bottom-1 bg-gray-200 rounded-2xl"></div>

            <div className="relative bg-gray-100 border border-gray-100 rounded-2xl py-2 px-10 sm:py-3 sm:px-20 md:py-3 md:px-20 lg:py-3 lg:px-20 transition transform duration-200 active:translate-y-1">
              contact us
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
