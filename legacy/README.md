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

3. Set up environment variables:
   ```bash
   # Copy the example environment file
   cp .env.example .env.local

   # Edit .env.local and add your Supabase credentials
   # NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   # NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Optimize images (optional, as optimized images are included in the repository):
   ```bash
   npm run optimize-images
   # or
   yarn optimize-images
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Image Optimization

The website uses several techniques to ensure optimal image loading and performance:

1. **Multiple Formats**: Images are served in modern formats (WebP, AVIF) with JPEG fallback
2. **Responsive Sizes**: Different image sizes are generated for different viewport widths
3. **Lazy Loading**: Images are loaded only when they enter the viewport
4. **Blur-up Effect**: Low-resolution placeholders are shown while images load
5. **Optimized Compression**: Quality settings are balanced for file size and visual quality

## Environment Variables

The application requires the following environment variables to be set:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

These variables are used to connect to your Supabase backend for authentication and data storage. You can find these values in your Supabase project dashboard under Project Settings > API.

For local development, copy `.env.example` to `.env.local` and fill in the values. For production deployment, set these environment variables in your hosting platform (Vercel, Netlify, etc.).

> **Note**: The application will still build and run without these variables, but authentication and database features will not work correctly. Mock data will be used instead.

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
