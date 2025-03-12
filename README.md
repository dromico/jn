# Jaya Nexus Sdn Bhd - Professional Cleaning Services Website

A high-performance website for Jaya Nexus Sdn Bhd cleaning services, specializing in schools and commercial buildings.

## Features

- **Optimized Images**: All images are optimized for web performance using modern compression techniques, responsive sizing, and lazy loading
- **SVG Animations**: Subtle animations for visual engagement (cleaning motions, sparkle effects)
- **Sticky Navigation**: Responsive navigation bar with sections for Login, About Us, Services, Portfolio, and Contact
- **Testimonial Carousel**: Showcasing feedback from satisfied institutional clients
- **Call-to-Action Buttons**: Prominent buttons for quote requests
- **Mobile Responsiveness**: Optimized for all device sizes with appropriate touch targets
- **Parallax Scrolling**: Subtle parallax effects for modern appeal

## Technologies Used

- **Next.js**: React framework for server-rendered applications
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Sharp**: High-performance image processing
- **Web Animations API**: For smooth, performant animations

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd website
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Optimize images (optional, as optimized images are included in the repository):
   ```bash
   npm run optimize-images
   # or
   yarn optimize-images
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Image Optimization

The website uses several techniques to ensure optimal image loading and performance:

1. **Multiple Formats**: Images are served in modern formats (WebP, AVIF) with JPEG fallback
2. **Responsive Sizes**: Different image sizes are generated for different viewport widths
3. **Lazy Loading**: Images are loaded only when they enter the viewport
4. **Blur-up Effect**: Low-resolution placeholders are shown while images load
5. **Optimized Compression**: Quality settings are balanced for file size and visual quality

## Performance Optimizations

- **Code Splitting**: Only necessary JavaScript is loaded for each page
- **Component-Based Architecture**: Reusable components for better maintainability
- **CSS Optimization**: Tailwind's JIT compiler for minimal CSS
- **SVG Animations**: Lightweight animations using SVG and the Web Animations API instead of heavy libraries
- **Responsive Design**: Mobile-first approach with optimized layouts for all screen sizes

## Browser Support

The website is optimized for modern browsers, including:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Contact

For inquiries about this website, please contact [info@jayanexus.com.my](mailto:info@jayanexus.com.my).
