import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        urbanist: ['Urbanist', 'sans-serif'],
        mona: ['var(--font-mona)'],
        manrope: ['Manrope', 'sans-serif'],
      },
      lineHeight: {
        custom: '86.40px',
      },
      borderWidth: {
        '0.5': '0.5px',
      },
      backgroundColor: {
        glotsphere: {
          nearblack1: '#121212',
          nearblack2: '#1A1A1A',
          darkest: '#333333',
          dark: '#4F4F4F',
          medium: '#828282',
          light: '#BDBDBD',
          lightest: '#E0E0E0',
        },
      },
      colors: {
        indiaSaffron: '#FF9933',
        ukBlue: '#4169E1', //'#6495ED', // '#00247D',
        germanyBlack: '#000000',
        japanRed: '#BC002D',
        franceBlue: '#00BFFF', // '#0055A4',
        chinaRed: '#DE2910',
        // spainRed: '#AA151B',
        spainYellow: '#FFCC00',
        portugalGreen: '#006600',
        koreaBlue: '#87CEEB', // '#003478',
        vietnamRed: '#DA251D',
        russiaBlue: '#0033A0',
        urduGreen: '#00FF00', //'#01411C',
        fcPurple: '#855DCC',
        fcPurpleDark: '#6A41A4', //#7048C1,
        showcastNavbar: '#855DCD',
        showcastNavbarHover: '#9578da',
        gsOrange: '#E79920',
        gsYellow: '#FFAC46',
        gsElectricBlue: '#3671FF',
        gsElectricBlueHover: '#0070f3',
        'back-brown': '#2A2929',
        'start-border': '#191919',
        'start-bg': '#FFD12C',
        'hero-bg': '#855DCD',
        'signin-content-bg': '#F3F3F4',
        'electric-blue': '#0070f3',
        'neon-purple': '#6a0dad',
        'vibrant-pink': '#e535ab',
        'mint-green': '#50C878',
        'slate-gray': '#333333',
        'off-white': '#F5F5F5',
        'warning-red': '#FF6347',
        'sunshine-yellow': '#FFD700',
      },
      minHeight: {
        '4/5screen': '80vh', // Custom class for 4/5th viewport height
      },
      screens: {
        xs: '420px',
        // => @media (min-width: 340px) { ... }
      },
      backgroundImage: {
        gshero: "url('/glotsphere/bg-hero1.png')",
        lphero: "url('/landing-page/bg-hero.png')",
      },
    },
  },

  plugins: [],
};
export default config;
