'use client';

import TestimonialCarousel from '../../components/TestimonialCarousel';

export default function TestimonialsDemo() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Testimonials Demo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Interactive Testimonial Carousel with Malaysian Customer Reviews
          </p>
        </div>

        <TestimonialCarousel />

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Features Implemented
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">🎠 Shadcn/UI Carousel</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Built with modern shadcn/ui components for smooth animations
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">🇲🇾 Malaysian Names</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Authentic Malaysian customer testimonials with local names
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">⭐ Star Ratings</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Visual star ratings for each customer review
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">📱 Responsive Design</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Optimized for mobile, tablet, and desktop viewing
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">🔄 Auto-play</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Automatic sliding with pause on hover interaction
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-2">🎯 Navigation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Arrow buttons for desktop, dots for mobile navigation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
