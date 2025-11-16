import { useState, useEffect } from 'react';

interface ImageCarouselProps {
  images: string[];
  autoPlay?: boolean;
  interval?: number;
}

export default function ImageCarousel({ images, autoPlay = true, interval = 5000 }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, images.length, interval]);

  if (images.length === 0) {
    return (
      <div className="w-full h-32 bg-gray-200 rounded-xl flex items-center justify-center">
        <span className="text-gray-400">No images</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-32 bg-gray-100 rounded-xl overflow-hidden">
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Carousel ${index}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      <div className="absolute inset-0 flex items-center justify-between px-2">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
          className="bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded transition-colors"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
          className="bg-black/50 hover:bg-black/70 text-white px-3 py-1 rounded transition-colors"
        >
          ›
        </button>
      </div>

      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
