import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { images } from '@/lib/data/glotsphere/utils';

const GlotsphereGrid = () => {
  const router = useRouter();

  const handleCastClick = () => {
    // window.open('http://localhost:3001', '_blank');
    router.push('/glotsphere');
  };
  return (
    <div className="bg-gshero bg-cover min-w-full min-h-screen">
      <div className="min-w-full min-h-screen bg-black bg-opacity-70 text-white flex flex-row items-center justify-center border-t-2 gap-20">
        <div className="w-1/2 min-h-screen flex flex-row justify-end items-center ">
          <div className="w-4/5 min-h-4/5screen  flex flex-col items-end justify-around ">
            <div className="flex flex-1 flex-col items-center justify-around ">
              <div className="flex flex-col font-urbanist justify-end items-center">
                <div className="text-9xl font-black">glotsphere</div>
                <div className="text-5xl mt-12 font-normal">
                  cast in any language
                </div>
              </div>
              <button
                className="relative w-2/3 sm:text-xl md:text-xl lg:text-xl text-white font-urbanist font-extrabold mt-8 sm:mt-8 md:mt-8 lg:mt-8"
                onClick={handleCastClick}
              >
                <div className="absolute inset-x-0 h-full -bottom-1 bg-electric-blue rounded-2xl"></div>

                <div className="relative bg-gsElectricBlue border border-gsElectricBlue rounded-2xl py-2 px-10 sm:py-3 sm:px-20 md:py-3 md:px-20 lg:py-3 lg:px-20 transition transform duration-200 active:translate-y-1">
                  cast
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/2 min-h-screen flex flex-row justify-start items-center">
          <div className="w-1/2 min-h-4/5screen grid grid-cols-2  gap-x-2 gap-y-4 ">
            {images.map((item, index) => (
              <div
                className="w-full relative flex flex-row items-center justify-center transition duration-500 transform hover:scale-110 hover:z-50 hover:cursor-pointer"
                key={index}
              >
                <Image
                  src={item}
                  alt="Descriptive Alt Text"
                  objectFit="contain"
                  width={200}
                  height={200}
                  className="rounded-lg border-2 border-gsElectricBlue hover:border-fcPurpleDark"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlotsphereGrid;
