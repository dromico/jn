'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from 'react'; // Add useState import

import "./cleaning-styles.css";

// Import custom components
import StickyNavbar from "../components/StickyNavbar";
import OptimizedImage from "../components/OptimizedImage";
import ParallaxSection from "../components/ParallaxSection";
import TestimonialCarousel from "../components/TestimonialCarousel";
import CTAButton from "../components/CTAButton";
import ServiceCard from "../components/ServiceCard";
import CleaningMotion from "../components/animations/CleaningMotion";
import SparkleEffect from "../components/animations/SparkleEffect";
import { useLanguage } from "../context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Navigation items
  const navItems = [
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#services" },
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
      key: "commercialbuilding",
      title: "Commercial Building Maintenance",
      description: "Comprehensive cleaning solutions for office buildings, retail spaces, and commercial properties.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21H21M3 18H21M5 18V7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V18M9 8H10M9 12H10M14 8H15M14 12H15" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      key: "educational",
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
      key: "healthcare",
      title: "Healthcare Facilities",
      description: "Medical-grade cleaning and sanitization for hospitals, clinics, and healthcare centers.",
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 21H16M12 3V21M12 3H7.5C6.83696 3 6.20107 3.26339 5.73223 3.73223C5.26339 4.20107 5 4.83696 5 5.5C5 6.16304 5.26339 6.79893 5.73223 7.26777C6.20107 7.73661 6.83696 8 7.5 8H12M12 3H16.5C17.163 3 17.7989 3.26339 18.2678 3.73223C18.7366 4.20107 19 4.83696 19 5.5C19 6.16304 18.7366 6.79893 18.2678 7.26777C17.7989 7.73661 17.163 8 16.5 8H12" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      key: "specialized",
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/send-quote-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send quote request');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', service: '', message: '' }); // Clear form
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            alt={t('hero.title')}
            width={1920}
            height={1080}
            className="w-full h-full"
            objectFit="fill"
            priority
            style={{ zIndex: 1, position: 'relative' }}
          />
          <div className="absolute inset-0 bg-black/50 z-10"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-20 text-white text-center">
          <ParallaxSection speed={0.3}>
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-md">
                {t('hero.title')} <span className="text-[#4FB3D9]">{t('hero.titleHighlight')}</span>
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-shadow-sm max-w-2xl mx-auto">
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton 
                  href="#contact" 
                  variant="primary" 
                  size="lg"
                  withSparkle
                  className="bg-[#4FB3D9] hover:bg-[#3a8aa8]"
                >
                  {t('hero.cta.quote')}
                </CTAButton>
                
                <CTAButton 
                  href="#services" 
                  variant="secondary"
                  size="lg"
                >
                  {t('hero.cta.services')}
                </CTAButton>
              </div>
            </div>
          </ParallaxSection>
        </div>
        
        {/* Animated cleaning elements */}
        <div className="absolute bottom-10 left-10 z-[95] opacity-80 hidden md:block">
          <CleaningMotion />
        </div>
        <div className="absolute top-1/4 right-10 z-[95] opacity-80 hidden md:block">
          <SparkleEffect />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                {t('about.title')} <span className="text-[#4FB3D9]">{t('about.titleHighlight')}</span>
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {t('about.description')}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-700">{t('about.features.eco')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-700">{t('about.features.trained')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-700">{t('about.features.customized')}</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 13L9 17L19 7" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-700">{t('about.features.quality')}</span>
                </div>
              </div>
              
              <CTAButton 
                href="#contact" 
                variant="primary"
                className="bg-[#4FB3D9] hover:bg-[#3a8aa8]"
              >
                {t('about.cta')}
              </CTAButton>
            </div>
            
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                {/* Consider using a more professional team photo or an image showcasing eco-friendly practices here */}
                <OptimizedImage
                  src="/img/clean2.jpeg" 
                  alt="Jaya Nexus cleaning team working" // Improved alt text
                  width={600}
                  height={400}
                  className="w-full h-full"
                  objectFit="cover"
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
                    <p className="text-sm text-gray-500">{t('about.stats.experience')}</p>
                    <p className="font-bold text-gray-800">{t('about.stats.years')}</p>
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
                    <p className="text-sm text-gray-500">{t('about.stats.clients')}</p>
                    <p className="font-bold text-gray-800">{t('about.stats.count')}</p>
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
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{t('services.title')} <span className="text-[#4FB3D9]">{t('services.titleHighlight')}</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('services.description')}
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
                <h3 className="text-xl font-bold mb-3 text-gray-800">{t(`services.${service.key}.title`)}</h3>
                <p className="text-gray-600">{t(`services.${service.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Portfolio/Gallery Section */}
      <section id="portfolio" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{t('portfolio.title')} <span className="text-[#4FB3D9]">{t('portfolio.titleHighlight')}</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('portfolio.description')}
            </p>
          </div>
          
          {/* Updated grid layout to accommodate more cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> 
            {/* Existing Portfolio Cards */}
            <ServiceCard
              src="/img/clean3.jpg" // Office space
              alt={t('portfolio.office.title')}
              title={t('portfolio.office.title')}
              description={t('portfolio.office.description')}
              width={600} // Maintain consistent sizing if desired
              height={400} // Maintain consistent sizing if desired
            />
            
            <ServiceCard 
              src="/img/clean4.jpeg" // Educational facility
              alt={t('portfolio.educational.title')}
              title={t('portfolio.educational.title')}
              description={t('portfolio.educational.description')}
              width={600}
              height={400}
            />
            
            <ServiceCard 
              src="/img/clean7.jpeg" // Healthcare/Specialized (Using clean7 instead of clean5)
              alt={t('portfolio.healthcare.title')}
              title={t('portfolio.healthcare.title')}
              description={t('portfolio.healthcare.description')}
              width={600}
              height={400}
            />

            <ServiceCard 
              src="/img/clean8.jpg" // Classroom/Educational
              alt={t('services.classroom.title')} // Assuming translation exists
              title={t('services.classroom.title')} // Assuming translation exists
              description={t('services.classroom.description')} // Assuming translation exists
              width={600} 
              height={400}
            />
            
            <ServiceCard 
              src="/img/clean9.jpg" // Commercial space
              alt={t('services.commercial.title')} // Assuming translation exists
              title={t('services.commercial.title')} // Assuming translation exists
              description={t('services.commercial.description')} // Assuming translation exists
              width={600}
              height={400}
            />
            
            <ServiceCard 
              src="/img/clean10.jpg" // Landscape/Outdoor
              alt={t('services.landscape.title')} // Assuming translation exists
              title={t('services.landscape.title')} // Assuming translation exists
              description={t('services.landscape.description')} // Assuming translation exists
              width={600} // Adjusted width for consistency
              height={400} // Adjusted height for consistency
            />

            <ServiceCard 
              src="/img/clean5.jpg" // Eco-friendly/General
              alt={t('services.eco.title')} // Assuming translation exists
              title={t('services.eco.title')} // Assuming translation exists
              description={t('services.eco.description')} // Assuming translation exists
              width={600} // Adjusted width for consistency
              height={400} // Adjusted height for consistency
            />
            
            {/* Add more ServiceCards here if needed, ensure you have relevant images */}

          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">{t('testimonials.title')} <span className="text-[#4FB3D9]">{t('testimonials.titleHighlight')}</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('testimonials.description')}
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
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                {t('contact.title')} <span className="text-[#4FB3D9]">{t('contact.titleHighlight')}</span>
              </h2>
              <p className="text-gray-600 mb-8">
                {t('contact.description')}
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
                    <h3 className="font-bold text-gray-800 mb-1">{t('contact.businessHours.title')}</h3>
                    <p className="text-gray-600">{t('contact.businessHours.weekdays')}</p>
                    <p className="text-gray-600">{t('contact.businessHours.saturday')}</p>
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
                    <h3 className="font-bold text-gray-800 mb-1">{t('contact.location.title')}</h3>
                    <p className="text-gray-600">{t('contact.location.address')}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-[#4FB3D9]/10 p-3 rounded-full text-[#4FB3D9]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{t('contact.contactInfo.title')}</h3>
                    <p className="text-gray-600">{t('contact.contactInfo.phone')}</p>
                    <p className="text-gray-600">{t('contact.contactInfo.email')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">{t('contact.formTitle')}</h3>
              
              <form className="space-y-6" onSubmit={handleSubmit}> {/* Add onSubmit handler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.name')}</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent" 
                      placeholder={t('contact.namePlaceholder')}
                      value={formData.name} // Add value
                      onChange={handleInputChange} // Add onChange
                      required // Add required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.email')}</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent" 
                      placeholder={t('contact.emailPlaceholder')}
                      value={formData.email} // Add value
                      onChange={handleInputChange} // Add onChange
                      required // Add required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.phone')}</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent" 
                    placeholder={t('contact.phonePlaceholder')}
                    value={formData.phone} // Add value
                    onChange={handleInputChange} // Add onChange
                    // Optional: Add validation pattern if needed
                  />
                </div>
                
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.service')}</label>
                  <select 
                    id="service" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent"
                    value={formData.service} // Add value
                    onChange={handleInputChange} // Add onChange
                    required // Add required
                  >
                    <option value="">{t('contact.selectService')}</option>
                    <option value="commercial">{t('services.commercialbuilding.title')}</option>
                    <option value="educational">{t('services.educational.title')}</option>
                    <option value="healthcare">{t('services.healthcare.title')}</option>
                    <option value="specialized">{t('services.specialized.title')}</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">{t('contact.message')}</label>
                  <textarea 
                    id="message" 
                    rows={4} 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent" 
                    placeholder={t('contact.messagePlaceholder')}
                    value={formData.message} // Add value
                    onChange={handleInputChange} // Add onChange
                    required // Add required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-[#4FB3D9] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#3a8aa8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting} // Disable button while submitting
                >
                  {isSubmitting ? t('contact.submitting') : t('contact.submit')} {/* Show loading text */}
                </button>

                {/* Submission Status Messages */}
                {submitStatus === 'success' && (
                  <p className="text-green-600 text-center mt-4">{t('contact.successMessage')}</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-center mt-4">{t('contact.errorMessage')}</p>
                )}
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
                <div className="relative w-14 h-14 overflow-hidden rounded-lg bg-white shadow-lg border-2 border-[#4FB3D9] transform hover:scale-105 transition-all duration-300">
                  <OptimizedImage
                    src="/img/logo.jpeg"
                    alt="Jaya Nexus logo"
                    width={56}
                    height={56}
                    className="w-full h-full"
                    objectFit="cover"
                    style={{ objectPosition: 'center center' }}
                    priority
                  />
                </div>
                <div>
                  <span className="font-bold text-lg flex items-center">
                    <span className="text-[#4FB3D9] mr-1">✦</span> Jaya Nexus
                  </span>
                  <p className="text-sm text-gray-400">{t('footer.tagline')}</p>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6">
                {t('footer.description')}
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
              <h3 className="font-bold text-lg mb-4">{t('footer.quickLinks')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('nav.home')}</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">{t('nav.about')}</a></li>
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">{t('nav.services')}</a></li>
                <li><a href="#portfolio" className="text-gray-400 hover:text-white transition-colors">{t('nav.portfolio')}</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">{t('nav.contact')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.services')}</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('services.commercialbuilding.title')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('services.educational.title')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('services.healthcare.title')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('services.specialized.title')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('services.maintenance.title')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">{t('footer.contactInfo')}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-400">{t('footer.address')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-400">{t('contact.contactInfo.phone').replace('Phone: ', '')}</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="#4FB3D9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-400">{t('contact.contactInfo.email').replace('Email: ', '')}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-500">{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
