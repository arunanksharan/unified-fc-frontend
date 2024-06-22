import Glotsphere from '@/components/landing-page/Glotsphere';
import Hero from './Hero';
import Showcast from './Showcast';
import { GetStaticProps } from 'next';
import TestFCAuth from './TestFCAuth';
import GlotsphereGrid from './GlotsphereGrid';

export default function LandingPage() {
  return (
    <>
      {/* Render additional client-side dynamic content here */}
      {/* <TestFCAuth /> */}

      <Hero />
      <GlotsphereGrid />
      <Glotsphere />
      <Showcast />
    </>
  );
}
