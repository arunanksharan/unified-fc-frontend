import Glotsphere from '@/components/landing-page/Glotsphere';
import Hero from './Hero';
import Showcast from './Showcast';
import { GetStaticProps } from 'next';
import GlotsphereGrid from './GlotsphereGrid';
import Overlay from '@/components/atoms/wip/WIP';

export default function LandingPage() {
  return (
    <>
      {/* Render additional client-side dynamic content here */}
      {/* <TestFCAuth /> */}

      <Hero />
      <GlotsphereGrid />

      <Overlay isWip={true}>
        <Showcast />
      </Overlay>
    </>
  );
}
