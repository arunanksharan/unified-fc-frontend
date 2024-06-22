import { useRouter } from 'next/router';
import React from 'react';

export const helloTranslated = [
  {
    language: 'Korean',
    text: '안녕하세요',
    style: 'text-koreaBlue',
    link: 'https://en.wikipedia.org/wiki/Korean_language',
  },
  {
    language: 'Hindi',
    text: 'नमस्ते',
    style: 'text-indiaSaffron',
    link: 'https://en.wikipedia.org/wiki/Hindi',
  },
  {
    language: 'Japanese',
    text: 'こんにちは',
    style: 'text-white',
    link: 'https://en.wikipedia.org/wiki/Japanese_language',
  },
  {
    language: 'English',
    text: 'Hello',
    style: 'text-ukBlue',
    link: 'https://en.wikipedia.org/wiki/English_language',
  },

  {
    language: 'Mandarin',
    text: '你好',
    style: 'text-chinaRed',
    link: 'https://en.wikipedia.org/wiki/Mandarin_Chinese',
  },
  {
    language: 'Portuguese',
    text: 'Olá',
    style: 'text-portugalGreen',
    link: 'https://en.wikipedia.org/wiki/Portuguese_language',
  },
  {
    language: 'Urdu',
    text: 'ہیلو',
    style: 'text-urduGreen',
    link: 'https://en.wikipedia.org/wiki/Urdu',
  },
  {
    language: 'German',
    text: 'Hallo',
    style: 'text-yellow-400',
    link: 'https://en.wikipedia.org/wiki/German_language',
  },

  {
    language: 'Russian',
    text: 'Привет',
    style: 'text-russiaBlue',
    link: 'https://en.wikipedia.org/wiki/Russian_language',
  },
  {
    language: 'Spanish',
    text: 'Hola',
    style: 'text-spainYellow',
    link: 'https://en.wikipedia.org/wiki/Spanish_language',
  },
  {
    language: 'Vietnamese',
    text: 'Xin chào',
    style: 'text-vietnamRed',
    link: 'https://en.wikipedia.org/wiki/Vietnamese_language',
  },

  {
    language: 'French',
    text: 'Bonjour',
    style: 'text-franceBlue',
    link: 'https://en.wikipedia.org/wiki/French_language',
  },
];

const Glotsphere = () => {
  const router = useRouter();
  const boxStyle =
    'text-white text-xl font-bold border-4 border-[#9578da] rounded-xl p-2 flex flex-col items-center justify-center bg-black transition duration-500 transform hover:scale-105 hover:z-50 hover:cursor-pointer';

  const handleClickOnLanguage = (link: string) => {
    window.open(link, '_blank');
  };

  const handleGlotsphereClick = () => {
    // window.open('http://localhost:3001', '_blank');
    router.push('/glotsphere');
  };
  return (
    <div className="flex items-center justify-center font-urbanist p-12 border-t border-b bg-black min-h-screen">
      <div className="grid grid-cols-4 gap-6 auto-rows-[200px] w-4/5">
        {/* First row */}
        {helloTranslated.slice(0, 4).map((item, index) => (
          <div
            key={index}
            onClick={() => handleClickOnLanguage(item.link)}
            className={`${boxStyle}`}
          >
            <p className={`${item.style} text-4xl`}>{item.text}</p>
          </div>
        ))}
        {/* Second row: start */}
        {helloTranslated.slice(4, 5).map((item, index) => (
          <div
            key={`left-${index}`}
            onClick={() => handleClickOnLanguage(item.link)}
            className={boxStyle}
          >
            <p className={`${item.style} text-4xl`}>{item.text}</p>
          </div>
        ))}
        {/* Center larger box for "glotsphere" */}
        <div
          className={`${boxStyle} col-span-2 row-span-2 font-urbanist flex flex-col items-center justify-center hover:cursor-pointer`}
          onClick={handleGlotsphereClick}
        >
          <div className="text-8xl h-1/2 flex flex-col justify-end items-center">
            <div>glotsphere</div>
            <div className="text-4xl mt-12">cast in any language</div>
          </div>

          <div className="bg-red-30 h-1/2 flex flex-col justify-center">
            {/* <button className="px-16 py-2 bg-fcPurple rounded-2xl">cast</button> */}
            <button
              className="relative sm:text-xl md:text-xl lg:text-xl text-white font-urbanist font-bold mt-8 sm:mt-8 md:mt-8 lg:mt-8"
              onClick={() => {
                console.log('start');
              }}
            >
              <div className="absolute inset-x-0 h-full -bottom-1 bg-fcPurpleDark rounded-2xl"></div>

              <div className="relative bg-fcPurple border border-fcPurple rounded-2xl py-2 px-10 sm:py-3 sm:px-20 md:py-3 md:px-20 lg:py-3 lg:px-20 transition transform duration-200 active:translate-y-1">
                cast
              </div>
            </button>
          </div>
        </div>
        {/* Second row: end */}
        {helloTranslated.slice(5, 6).map((item, index) => (
          <div
            key={`right-${index}`}
            onClick={() => handleClickOnLanguage(item.link)}
            className={boxStyle}
          >
            <p className={`${item.style} text-4xl`}>{item.text}</p>
          </div>
        ))}
        {/* Third row: start */}
        {helloTranslated.slice(6, 7).map((item, index) => (
          <div
            key={`left-${index}`}
            onClick={() => handleClickOnLanguage(item.link)}
            className={boxStyle}
          >
            <p className={`${item.style} text-4xl`}>{item.text}</p>
          </div>
        ))}
        {/* Third row: end */}
        {helloTranslated.slice(7, 8).map((item, index) => (
          <div
            key={`left-${index}`}
            onClick={() => handleClickOnLanguage(item.link)}
            className={boxStyle}
          >
            <p className={`${item.style} text-4xl`}>{item.text}</p>
          </div>
        ))}

        {/* Bottom row */}
        {helloTranslated.slice(8).map((item, index) => (
          <div
            key={`bottom-${index}`}
            onClick={() => handleClickOnLanguage(item.link)}
            className={boxStyle}
          >
            <p className={`${item.style} text-4xl`}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Glotsphere;
