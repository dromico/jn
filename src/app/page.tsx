import Image from "next/image";
import Link from "next/link";

import "./cleaning-styles.css";

// Import custom components
import StickyNavbar from "../components/StickyNavbar";
import OptimizedImage from "../components/OptimizedImage";
import ParallaxSection from "../components/ParallaxSection";
import TestimonialCarousel from "../components/TestimonialCarousel";
import CTAButton from "../components/CTAButton";
import CleaningMotion from "../components/animations/CleaningMotion";
import SparkleEffect from "../components/animations/SparkleEffect";

export default function Home() {
  // Navigation items
  const navItems = [
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Projects", href: "/Projects" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Contact", href: "#contact" },
    { label: "Login", href: "/login", isButton: true },
  ];

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      position: "Facility Manager",
      company: "Kuala Lumpur International School",
      quote: "Jaya Nexus transformed our school facilities. Their attention to detail and eco-friendly cleaning solutions have created a healthier environment for our students and staff. Highly recommended!",
    },
    {
      id: 2,
      name: "Ahmad Rizal",
      position: "Operations Director",
      company: "Menara Commerce Tower",
      quote: "We've partnered with Jaya Nexus for over 3 years now. Their professional team consistently delivers exceptional cleaning services for our 40-floor commercial building. Reliable and thorough!",
    },
    {
      id: 3,
      name: "Dr. Lim Wei Ling",
      position: "Medical Director",
      company: "Selangor Medical Center",
      quote: "In healthcare, cleanliness is critical. Jaya Nexus understands our specialized needs and provides sanitization services that meet our strict medical standards. A trusted partner in our operations.",
    },
  ];

  // Services data
  const services = [
    {
      title: "Commercial Building Maintenance",
      description: "Comprehensive cleaning solutions for office buildings, retail spaces, and commercial properties.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21H21M3 18H21M5 18V7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V18M9 8H10M9 12H10M14 8H15M14 12H15" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Educational Facilities",
      description: "Specialized cleaning for schools, universities, and educational institutions.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L22 9V11H2V9L12 3Z" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 11V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V11" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 21V17C9 15.8954 9.89543 15 11 15H13C14.1046 15 15 15.8954 15 17V21" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Healthcare Facilities",
      description: "Medical-grade cleaning and sanitization for hospitals, clinics, and healthcare centers.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 21H16M12 3V21M12 3H7.5C6.83696 3 6.20107 3.26339 5.73223 3.73223C5.26339 4.20107 5 4.83696 5 5.5C5 6.16304 5.26339 6.79893 5.73223 7.26777C6.20107 7.73661 6.83696 8 7.5 8H12M12 3H16.5C17.163 3 17.7989 3.26339 18.2678 3.73223C18.7366 4.20107 19 4.83696 19 5.5C19 6.16304 18.7366 6.79893 18.2678 7.26777C17.7989 7.73661 17.163 8 16.5 8H12" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      title: "Specialized Cleaning",
      description: "Carpet cleaning, window washing, floor maintenance, and post-construction cleanup.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 7C14 9.20914 12.2091 11 10 11C7.79086 11 6 9.20914 6 7C6 4.79086 7.79086 3 10 3C12.2091 3 14 4.79086 14 7Z" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 15C6.13401 15 3 18.134 3 22H17C17 18.134 13.866 15 10 15Z" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 8L21 10M21 8L19 10" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19 14L21 16M21 14L19 16" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)]">
      {/* Sticky Navigation Bar */}
      <StickyNavbar 
        logoSrc="/img/logo.jpeg" 
        companyName="Jaya Nexus" 
        navItems={navItems} 
      />

      {/* Hero Section with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src="/img/clean1.jpeg"
            alt="Professional cleaning service"
            width={1920}
            height={1080}
            className="object-cover w-full h-full"
            priority
          />
          <div className="absolute inset-0 bg-black/50 z-10"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-20 text-white text-center">
          <ParallaxSection speed={0.3}>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-md">
                Transform Your Space with <span className="text-[#4FB3D9]">Professional Cleaning</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-shadow-sm max-w-2xl mx-auto">
                Pristine Results Guaranteed for Schools and Commercial Buildings
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton 
                  href="#contact" 
                  variant="primary" 
                  size="lg"
                  withSparkle
                  className="bg-[#4FB3D9] hover:bg-[#3a8aa8]"
                >
                  Request a Quote
                </CTAButton>
                
                <CTAButton 
                  href="#services" 
                  variant="secondary"
                  size="lg"
                >
                  Our Services
                </CTAButton>
              </div>
            </div>
          </ParallaxSection>
        </div>
        
        {/* Animated cleaning elements */}
        <div className="absolute bottom-10 left-10 z-20 opacity-80 hidden md:block">
          <CleaningMotion />
        </div>
        <div className="absolute top-1/4 right-10 z-20 opacity-80 hidden md:block">
          <SparkleEffect />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                About Jaya Nexus <span className="text-[#4FB3D9]">Cleaning Services</span>
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Since 2015, Jaya Nexus Sdn Bhd has been providing premium cleaning services to commercial buildings and educational institutions across Malaysia. Our commitment to excellence and sustainable cleaning practices has made us a trusted partner for businesses that value cleanliness and hygiene.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-700">Eco-friendly products</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-700">Trained professionals</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-700">Customized solutions</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-700">Quality assurance</span>
                </div>
              </div>
              
              <CTAButton 
                href="#contact" 
                variant="primary"
                className="bg-[#4FB3D9] hover:bg-[#3a8aa8]"
              >
                Learn More About Us
              </CTAButton>
            </div>
            
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <OptimizedImage
                  src="/img/clean2.jpeg"
                  alt="Jaya Nexus cleaning team"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-[#4FB3D9] rounded-full p-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-bold text-gray-800">8+ Years</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-[#4FB3D9] rounded-full p-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Happy Clients</p>
                    <p className="font-bold text-gray-800">200+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Cleaning <span className="text-[#4FB3D9]">Services</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive range of professional cleaning services tailored to meet the specific needs of your facility.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div 
                key={index} 
                className="service-card bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
              >
                <div className="mb-4 text-[#4FB3D9]">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Portfolio/Gallery Section */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Our Cleaning <span className="text-[#4FB3D9]">Portfolio</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See the difference our professional cleaning services can make for your facility.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative rounded-xl overflow-hidden group">
              <OptimizedImage
                src="/img/clean3.jpeg"
                alt="Office cleaning"
                width={400}
                height={300}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="font-bold text-xl mb-2">Office Building</h3>
                  <p className="text-sm">Complete cleaning and maintenance services</p>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-xl overflow-hidden group">
              <OptimizedImage
                src="/img/clean4.jpeg"
                alt="School cleaning"
                width={400}
                height={300}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="font-bold text-xl mb-2">Educational Facility</h3>
                  <p className="text-sm">Specialized cleaning for schools and universities</p>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-xl overflow-hidden group">
              <OptimizedImage
                src="/img/clean1.jpeg"
                alt="Medical facility cleaning"
                width={400}
                height={300}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <div className="p-6 text-white">
                  <h3 className="font-bold text-xl mb-2">Healthcare Facility</h3>
                  <p className="text-sm">Medical-grade cleaning and sanitization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">What Our <span className="text-[#4FB3D9]">Clients Say</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about our services.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <TestimonialCarousel testimonials={testimonials} className="testimonial-carousel" />
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Get in <span className="text-[#4FB3D9]">Touch</span></h2>
              <p className="text-gray-600 mb-8">
                Ready to transform your space? Contact us today for a free consultation and quote.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#4FB3D9]/10 p-3 rounded-full text-[#4FB3D9]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 2:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#4FB3D9]/10 p-3 rounded-full text-[#4FB3D9]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Our Location</h3>
                    <p className="text-gray-600">123 Jalan Ampang, 50450 Kuala Lumpur, Malaysia</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#4FB3D9]/10 p-3 rounded-full text-[#4FB3D9]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Contact Us</h3>
                    <p className="text-gray-600">Phone: +60 3-2142 6789</p>
                    <p className="text-gray-600">Email: info@jayanexus.com.my</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Request a Quote</h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent" 
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent" 
                      placeholder="Your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent" 
                    placeholder="Your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">Service Needed</label>
                  <select 
                    id="service" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    <option value="commercial">Commercial Building Maintenance</option>
                    <option value="educational">Educational Facilities</option>
                    <option value="healthcare">Healthcare Facilities</option>
                    <option value="specialized">Specialized Cleaning</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent" 
                    placeholder="Tell us about your needs"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-[#4FB3D9] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#3a8aa8] transition-colors"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10 overflow-hidden rounded-full bg-white">
                  <OptimizedImage
                    src="/img/logo.jpeg"
                    alt="Jaya Nexus logo"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <span className="font-bold text-lg">Jaya Nexus</span>
              </div>
              
              <p className="text-gray-400 mb-6">
                Professional cleaning services for commercial buildings and educational institutions.
              </p>
              
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" />
                    <path d="M6 9H2V21H6V9Z" />
                    <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#portfolio" className="text-gray-400 hover:text-white transition-colors">Portfolio</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Commercial Cleaning</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Educational Facilities</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Healthcare Cleaning</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Specialized Services</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Maintenance Plans</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Info</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-400">123 Jalan Ampang, 50450 Kuala Lumpur, Malaysia</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-400">+60 3-2142 6789</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-400">info@jayanexus.com.my</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-500">© 2025 Jaya Nexus Sdn Bhd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
