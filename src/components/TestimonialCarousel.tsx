'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '../../components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  position: string;
  company: string;
  image?: string;
  quote: string;
  rating?: number; // Made optional since we generate random ratings
  location: string;
}

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
  autoplaySpeed?: number;
  className?: string;
}

// Default Malaysian testimonials
const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Siti Nurhaliza Ahmad",
    position: "Homeowner",
    company: "Mont Kiara Residence",
    quote: "Jaya Nexus transformed our home completely! Their attention to detail is exceptional, and the team was so professional. Our house has never been cleaner. Highly recommend their deep cleaning service!",
    rating: 5,
    location: "Mont Kiara, KL",
    image: "/images/testimonials/siti.jpg"
  },
  {
    id: 2,
    name: "Ahmad Faizal Rahman",
    position: "Office Manager",
    company: "Tech Solutions Sdn Bhd",
    quote: "We've been using Jaya Nexus for our office cleaning for over a year now. They're reliable, thorough, and always on time. Our workspace is always spotless when we arrive in the morning.",
    rating: 5,
    location: "KLCC, KL",
    image: "/images/testimonials/ahmad.jpg"
  },
  {
    id: 3,
    name: "Lim Wei Ming",
    position: "Restaurant Owner",
    company: "Golden Dragon Restaurant",
    quote: "As a restaurant owner, cleanliness is crucial for our business. Jaya Nexus understands this perfectly. Their commercial cleaning service is top-notch and helps us maintain the highest hygiene standards.",
    rating: 5,
    location: "Petaling Jaya",
    image: "/images/testimonials/lim.jpg"
  },
  {
    id: 4,
    name: "Priya Devi Krishnan",
    position: "Working Mother",
    company: "Sunway Pyramid Area",
    quote: "Being a working mom, I barely have time for deep cleaning. Jaya Nexus has been a lifesaver! They're trustworthy, efficient, and my kids love how fresh our home smells after their visit.",
    rating: 5,
    location: "Subang Jaya",
    image: "/images/testimonials/priya.jpg"
  },
  {
    id: 5,
    name: "Tan Chee Keong",
    position: "Property Manager",
    company: "Pavilion Residences",
    quote: "Managing multiple properties requires reliable cleaning services. Jaya Nexus has consistently delivered excellent results across all our units. Their post-renovation cleaning is particularly impressive.",
    rating: 5,
    location: "Bukit Bintang, KL",
    image: "/images/testimonials/tan.jpg"
  },
  {
    id: 6,
    name: "Nurul Aina Hassan",
    position: "Event Coordinator",
    company: "Majestic Hotel KL",
    quote: "We regularly hire Jaya Nexus for post-event cleaning. They work quickly and efficiently, ensuring our venue is ready for the next event. Their team is professional and discreet.",
    rating: 5,
    location: "Kuala Lumpur City",
    image: "/images/testimonials/nurul.jpg"
  }
];

export default function TestimonialCarousel({
  testimonials = defaultTestimonials,
  autoplaySpeed = 5000,
  className = '',
}: TestimonialCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [randomRatings, setRandomRatings] = useState<{ [key: number]: number }>({});

  const plugin = useRef(
    Autoplay({ delay: autoplaySpeed, stopOnInteraction: true })
  );

  // Fix hydration mismatch by only generating random ratings on client side
  useEffect(() => {
    setIsClient(true);
    const ratings: { [key: number]: number } = {};
    testimonials.forEach((testimonial) => {
      // Generate random rating between 4.0 and 5.0
      ratings[testimonial.id] = Math.random() * 1 + 4; // 4.0 to 5.0
    });
    setRandomRatings(ratings);
  }, [testimonials]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const renderStars = (testimonialId: number) => {
    // Use default rating of 5.0 during SSR, then show actual random rating on client
    const rating = isClient ? (randomRatings[testimonialId] || 5) : 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1 mb-3">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => {
            if (i < fullStars) {
              return (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              );
            } else if (i === fullStars && hasHalfStar) {
              return (
                <div key={i} className="relative w-4 h-4">
                  <Star className="w-4 h-4 text-gray-300 absolute" />
                  <div className="overflow-hidden w-1/2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
              );
            } else {
              return (
                <Star
                  key={i}
                  className="w-4 h-4 text-gray-300"
                />
              );
            }
          })}
        </div>
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className={`w-full max-w-7xl mx-auto ${className}`}>
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full relative"
        opts={{
          align: "start",
          loop: true,
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-4 md:-ml-6">
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
              {/* Seamless testimonial design without card frames */}
              <div className="h-full p-8 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex flex-col h-full min-h-[320px] text-center">
                  {/* Quote Icon */}
                  <Quote className="w-12 h-12 text-[#4FB3D9] mb-6 opacity-40 mx-auto" />

                  {/* Rating */}
                  <div className="flex justify-center">
                    {renderStars(testimonial.id)}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-700 mb-8 flex-grow leading-relaxed text-base italic font-light">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Customer Info */}
                  <div className="flex flex-col items-center gap-4 mt-auto">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4FB3D9] to-[#3a8aa8] flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-center">
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 mb-1">
                        {testimonial.position}
                      </p>
                      <p className="text-sm text-[#4FB3D9] font-medium">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Custom navigation arrows */}
        <button
          onClick={() => api?.scrollPrev()}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white border border-gray-200 text-[#4FB3D9] hover:text-[#3a8aa8] shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => api?.scrollNext()}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/90 hover:bg-white border border-gray-200 text-[#4FB3D9] hover:text-[#3a8aa8] shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </Carousel>

      {/* Slide Counter and Mobile Navigation */}
      <div className="flex flex-col items-center gap-6 mt-8">
        {/* Navigation Dots for all screen sizes */}
        <div className="flex gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === current - 1
                  ? 'bg-[#4FB3D9] scale-125 shadow-md'
                  : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Mobile Navigation Arrows */}
        <div className="flex gap-4 md:hidden">
          <button
            onClick={() => api?.scrollPrev()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-[#4FB3D9] hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 text-[#4FB3D9] hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-200"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Counter */}
        <div className="text-sm text-gray-500 font-medium">
          {current} of {count}
        </div>
      </div>
    </div>
  );
}