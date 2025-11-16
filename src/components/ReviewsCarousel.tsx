import { useEffect, useRef } from 'react';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  review_text: string;
}

interface ReviewsCarouselProps {
  reviews: Review[];
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || reviews.length === 0) return;

    let scrollPosition = 0;
    const scrollSpeed = 1;
    const containerWidth = container.scrollWidth;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= containerWidth / 2) {
        scrollPosition = 0;
      }
      container.scrollLeft = scrollPosition;
    };

    const interval = setInterval(scroll, 30);
    return () => clearInterval(interval);
  }, [reviews.length]);

  if (reviews.length === 0) {
    return null;
  }

  const extendedReviews = [...reviews, ...reviews];

  return (
    <section className="py-8 bg-gray-50 rounded-lg">
      <h3 className="text-2xl font-bold mb-6 px-4 sm:px-6">Customer Reviews</h3>
      <div className="overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 px-4 sm:px-6 scroll-smooth"
          style={{ scrollBehavior: 'auto' }}
        >
          {extendedReviews.map((review, index) => (
            <div
              key={`${review.id}-${index}`}
              className="flex-shrink-0 w-64 bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">{review.review_text}</p>
              <div className="mt-2 text-xs font-semibold text-gray-700">
                {review.rating} out of 5 stars
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
