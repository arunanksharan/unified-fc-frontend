import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useEffect } from 'react';
import Image from 'next/image';
import React from 'react';

interface EmblaCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<EmblaCarouselProps> = ({ images }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000 }),
  ]);

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {images.map((item, index) => (
          <div
            className="embla__slide relative flex flex-row items-center justify-center  hover:cursor-pointer"
            key={index}
          >
            <Image
              src={item}
              alt="Descriptive Alt Text"
              objectFit="contain"
              width={300}
              height={300}
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
