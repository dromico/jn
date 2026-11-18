"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react"; // Add useState import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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

// Import shadcn/ui components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  service: z.string().min(1, {
    message: "Please select a service.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  const { t } = useLanguage();
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null,
  );

  // Initialize form with react-hook-form and zod validation
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  // Navigation items
  const navItems = [
    { label: "about", href: "#about" },
    { label: "services", href: "#services" },
    { label: "projects", href: "/Projects" },
    { label: "portfolio", href: "#portfolio" },
    { label: "contact", href: "#contact" },
    { label: "login", href: "/login", isButton: true },
  ];

  // Testimonials data with Malaysian names
  const testimonials = [
    {
      id: 1,
      name: "Siti Nurhaliza Ahmad",
      position: "Facility Manager",
      company: "Kuala Lumpur International School",
      quote:
        "Jaya Nexus transformed our school facilities completely! Their attention to detail and eco-friendly cleaning solutions have created a healthier environment for our students and staff. The team is so professional and reliable.",
      location: "Kuala Lumpur",
    },
    {
      id: 2,
      name: "Ahmad Faizal Rahman",
      position: "Operations Director",
      company: "Menara Commerce Tower",
      quote:
        "We've partnered with Jaya Nexus for over 3 years now. Their professional team consistently delivers exceptional cleaning services for our 40-floor commercial building. Always on time and thorough!",
      location: "KLCC, KL",
    },
    {
      id: 3,
      name: "Dr. Lim Wei Ming",
      position: "Medical Director",
      company: "Selangor Medical Center",
      quote:
        "In healthcare, cleanliness is critical. Jaya Nexus understands our specialized needs perfectly and provides sanitization services that exceed our strict medical standards. A trusted partner in our operations.",
      location: "Selangor",
    },
    {
      id: 4,
      name: "Priya Devi Krishnan",
      position: "Property Manager",
      company: "Sunway Pyramid Residences",
      quote:
        "Managing multiple residential properties requires reliable cleaning services. Jaya Nexus has consistently delivered excellent results across all our units. Their post-renovation cleaning is particularly impressive.",
      location: "Subang Jaya",
    },
    {
      id: 5,
      name: "Tan Chee Keong",
      position: "Restaurant Owner",
      company: "Golden Dragon Restaurant",
      quote:
        "As a restaurant owner, cleanliness is crucial for our business success. Jaya Nexus understands this perfectly and helps us maintain the highest hygiene standards. Their commercial cleaning service is top-notch.",
      location: "Petaling Jaya",
    },
  ];

  // Services data
  const services = [
    {
      key: "commercialbuilding",
      title: "Commercial Building Maintenance",
      description:
        "Comprehensive cleaning solutions for office buildings, retail spaces, and commercial properties.",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-oid="0ehmeut"
        >
          <path
            d="M3 21H21M3 18H21M5 18V7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V18M9 8H10M9 12H10M14 8H15M14 12H15"
            stroke="#4FB3D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-oid=".f6p1-o"
          />
        </svg>
      ),
    },
    {
      key: "educational",
      title: "Educational Facilities",
      description:
        "Specialized cleaning for schools, universities, and educational institutions.",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-oid="q1w3s9z"
        >
          <path
            d="M12 3L22 9V11H2V9L12 3Z"
            stroke="#4FB3D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-oid="rhxm-.h"
          />

          <path
            d="M2 11V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V11"
            stroke="#4FB3D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-oid="xdc7ox7"
          />

          <path
            d="M9 21V17C9 15.8954 9.89543 15 11 15H13C14.1046 15 15 15.8954 15 17V21"
            stroke="#4FB3D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-oid="ho84fua"
          />
        </svg>
      ),
    },
    {
      key: "healthcare",
      title: "Healthcare Facilities",
      description:
        "Medical-grade cleaning and sanitization for hospitals, clinics, and healthcare centers.",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-oid="p7f170k"
        >
          <path
            d="M8 21H16M12 3V21M12 3H7.5C6.83696 3 6.20107 3.26339 5.73223 3.73223C5.26339 4.20107 5 4.83696 5 5.5C5 6.16304 5.26339 6.79893 5.73223 7.26777C6.20107 7.73661 6.83696 8 7.5 8H12M12 3H16.5C17.163 3 17.7989 3.26339 18.2678 3.73223C18.7366 4.20107 19 4.83696 19 5.5C19 6.16304 18.7366 6.79893 18.2678 7.26777C17.7989 7.73661 17.163 8 16.5 8H12"
            stroke="#4FB3D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-oid="bswospd"
          />
        </svg>
      ),
    },
    {
      key: "specialized",
      title: "Specialized Cleaning",
      description:
        "Carpet cleaning, window washing, floor maintenance, and post-construction cleanup.",
      icon: (
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          data-oid="ba4vwz3"
        >
          <path
            d="M14 7C14 9.20914 12.2091 11 10 11C7.79086 11 6 9.20914 6 7C6 4.79086 7.79086 3 10 3C12.2091 3 14 4.79086 14 7Z"
            stroke="#4FB3D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-oid="ch5plen"
          />

          <path
            d="M10 15C6.13401 15 3 18.134 3 22H17C17 18.134 13.866 15 10 15Z"
            stroke="#4FB3D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-oid="cpiibgn"
          />

          <path
            d="M19 8L21 10M21 8L19 10"
            stroke="#4FB3D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-oid="i1yolfq"
          />

          <path
            d="M19 14L21 16M21 14L19 16"
            stroke="#4FB3D9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-oid="80grcqn"
          />
        </svg>
      ),
    },
  ];

  // Form submission handler
  const onSubmit = async (values: FormData) => {
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/send-quote-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to send quote request");
      }

      setSubmitStatus("success");
      form.reset(); // Clear form using react-hook-form reset
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
    }
  };

  return (
    <div
      className="min-h-screen font-[family-name:var(--font-geist-sans)]"
      data-oid="idiok-o"
    >
      {/* Sticky Navigation Bar */}
      <StickyNavbar
        logoSrc="/img/logo.jpeg"
        companyName="Jaya Nexus"
        navItems={navItems}
        data-oid="2-caw.t"
      />

      {/* Hero Section with Parallax */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        data-oid=".5h1h24"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0" data-oid="vgz_nx.">
          <OptimizedImage
            src="/img/clean1.jpeg"
            alt={t("hero.title")}
            width={1920}
            height={1080}
            className="w-full h-full"
            objectFit="fill"
            priority
            style={{ zIndex: 1, position: "relative" }}
            data-oid="6cxvaq."
          />

          <div
            className="absolute inset-0 bg-black/50 z-10"
            data-oid="30bsfp0"
          ></div>
        </div>

        {/* Hero Content */}
        <div
          className="container mx-auto px-4 relative z-20 text-white text-center"
          data-oid="ib17r6v"
        >
          <ParallaxSection speed={0.3} data-oid="c:xn8vn">
            <div className="max-w-4xl mx-auto" data-oid="v08r8ad">
              <h1
                className="text-4xl md:text-6xl font-bold mb-6 text-shadow-md"
                data-oid="1mcxk4l"
              >
                {t("hero.title")}{" "}
                <span className="text-[#4FB3D9]" data-oid="wxl11_a">
                  {t("hero.titleHighlight")}
                </span>
              </h1>

              <p
                className="text-xl md:text-2xl mb-8 text-shadow-sm max-w-2xl mx-auto"
                data-oid="io9:pux"
              >
                {t("hero.subtitle")}
              </p>

              <div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                data-oid="yk8x0.u"
              >
                <CTAButton
                  href="#contact"
                  variant="primary"
                  size="lg"
                  withSparkle
                  className="bg-[#4FB3D9] hover:bg-[#3a8aa8]"
                  data-oid="t--2mjh"
                >
                  {t("hero.cta.quote")}
                </CTAButton>

                <CTAButton
                  href="#services"
                  variant="secondary"
                  size="lg"
                  data-oid="e4yyili"
                >
                  {t("hero.cta.services")}
                </CTAButton>
              </div>
            </div>
          </ParallaxSection>
        </div>

        {/* Animated cleaning elements */}
        <div
          className="absolute bottom-10 left-10 z-[95] opacity-80 hidden md:block"
          data-oid="3t1rrfi"
        >
          <CleaningMotion data-oid="w6s2mom" />
        </div>
        <div
          className="absolute top-1/4 right-10 z-[95] opacity-80 hidden md:block"
          data-oid="qrnyan:"
        >
          <SparkleEffect data-oid="v2jn1hz" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white" data-oid="dnsjd_o">
        <div className="container mx-auto px-4" data-oid="j5hh98d">
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            data-oid="i8g:6sb"
          >
            <div data-oid="3p1v.0r">
              <h2
                className="text-3xl font-bold mb-6 text-gray-800"
                data-oid=".v57wl2"
              >
                {t("about.title")}{" "}
                <span className="text-[#4FB3D9]" data-oid="bl5tus6">
                  {t("about.titleHighlight")}
                </span>
              </h2>

              <p
                className="text-gray-600 mb-6 leading-relaxed"
                data-oid="1emazvi"
              >
                {t("about.description")}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6" data-oid="9fdc.qy">
                <div className="flex items-start gap-2" data-oid="mxg4id3">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="gfbnudr"
                  >
                    <path
                      d="M5 13L9 17L19 7"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid="-ztwzvm"
                    />
                  </svg>
                  <span className="text-gray-700" data-oid="un.c.yh">
                    {t("about.features.eco")}
                  </span>
                </div>
                <div className="flex items-start gap-2" data-oid="3af2rsn">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="110.378"
                  >
                    <path
                      d="M5 13L9 17L19 7"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid="7rv0mzr"
                    />
                  </svg>
                  <span className="text-gray-700" data-oid="yevrbbf">
                    {t("about.features.trained")}
                  </span>
                </div>
                <div className="flex items-start gap-2" data-oid="-sac9r8">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="kcw7thy"
                  >
                    <path
                      d="M5 13L9 17L19 7"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid="_0wz8b4"
                    />
                  </svg>
                  <span className="text-gray-700" data-oid="t.7pno9">
                    {t("about.features.customized")}
                  </span>
                </div>
                <div className="flex items-start gap-2" data-oid="nqs9y86">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="3nx8ck8"
                  >
                    <path
                      d="M5 13L9 17L19 7"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid=".7qvl56"
                    />
                  </svg>
                  <span className="text-gray-700" data-oid="am2vvsd">
                    {t("about.features.quality")}
                  </span>
                </div>
              </div>

              <CTAButton
                href="#contact"
                variant="primary"
                className="bg-[#4FB3D9] hover:bg-[#3a8aa8]"
                data-oid="hypwbk:"
              >
                {t("about.cta")}
              </CTAButton>
            </div>

            <div className="relative" data-oid="5xiz5nx">
              <div
                className="relative rounded-lg overflow-hidden shadow-xl"
                data-oid="_7mmyr:"
              >
                {/* Consider using a more professional team photo or an image showcasing eco-friendly practices here */}
                <OptimizedImage
                  src="/img/clean2.jpeg"
                  alt="Jaya Nexus cleaning team working" // Improved alt text
                  width={600}
                  height={400}
                  className="w-full h-full"
                  objectFit="cover"
                  data-oid="uu8lpwj"
                />
              </div>

              <div
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg z-10"
                data-oid="1mgjdly"
              >
                <div className="flex items-center gap-3" data-oid="u_x5dc8">
                  <div
                    className="bg-[#4FB3D9] rounded-full p-3"
                    data-oid="4prbp4d"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="dmix30d"
                    >
                      <path
                        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="dg.-a9f"
                      />

                      <path
                        d="M12 6V12L16 14"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="lyvhz92"
                      />
                    </svg>
                  </div>
                  <div data-oid="3k:csy0">
                    <p className="text-sm text-gray-500" data-oid="4:f3rd4">
                      {t("about.stats.experience")}
                    </p>
                    <p className="font-bold text-gray-800" data-oid="-u3b.9o">
                      {t("about.stats.years")}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="absolute -top-6 -right-6 bg-white p-4 rounded-lg shadow-lg z-10"
                data-oid="l4x:pxk"
              >
                <div className="flex items-center gap-3" data-oid="rd-z_c_">
                  <div
                    className="bg-[#4FB3D9] rounded-full p-3"
                    data-oid="w:ridim"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="ua8uel_"
                    >
                      <path
                        d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="y7kom0s"
                      />

                      <path
                        d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="1mry6:h"
                      />

                      <path
                        d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="ilydv18"
                      />

                      <path
                        d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="d7ug8e4"
                      />
                    </svg>
                  </div>
                  <div data-oid="4:asc5_">
                    <p className="text-sm text-gray-500" data-oid="p4ofpam">
                      {t("about.stats.clients")}
                    </p>
                    <p className="font-bold text-gray-800" data-oid="l-5bi0w">
                      {t("about.stats.count")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50" data-oid="o2chfzu">
        <div className="container mx-auto px-4" data-oid="v4zl543">
          <div className="text-center mb-16" data-oid=".gtwby6">
            <h2
              className="text-3xl font-bold mb-4 text-gray-800"
              data-oid="qx2az0p"
            >
              {t("services.title")}{" "}
              <span className="text-[#4FB3D9]" data-oid="5o67c78">
                {t("services.titleHighlight")}
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" data-oid="ajlx2xt">
              {t("services.description")}
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            data-oid="4ldl0:b"
          >
            {services.map((service, index) => (
              <div
                key={index}
                className="service-card bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all"
                data-oid="5wqhur8"
              >
                <div className="mb-4 text-[#4FB3D9]" data-oid="6hclk9s">
                  {service.icon}
                </div>
                <h3
                  className="text-xl font-bold mb-3 text-gray-800"
                  data-oid="vr_ztty"
                >
                  {t(`services.${service.key}.title`)}
                </h3>
                <p className="text-gray-600" data-oid="acpdpxq">
                  {t(`services.${service.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio/Gallery Section */}
      <section id="portfolio" className="py-20 bg-white" data-oid="jkg9f2h">
        <div className="container mx-auto px-4" data-oid="3:2:mz1">
          <div className="text-center mb-16" data-oid="y02xhyb">
            <h2
              className="text-3xl font-bold mb-4 text-gray-800"
              data-oid="nvvmb_d"
            >
              {t("portfolio.title")}{" "}
              <span className="text-[#4FB3D9]" data-oid="flg0__s">
                {t("portfolio.titleHighlight")}
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto" data-oid=".psmv62">
              {t("portfolio.description")}
            </p>
          </div>

          {/* Updated grid layout to accommodate more cards */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data-oid="fnbva6."
          >
            {/* Existing Portfolio Cards */}
            <ServiceCard
              src="/img/clean3.jpg" // Office space
              alt={t("portfolio.office.title")}
              title={t("portfolio.office.title")}
              description={t("portfolio.office.description")}
              width={600} // Maintain consistent sizing if desired
              height={400} // Maintain consistent sizing if desired
              data-oid="-eea2w8"
            />

            <ServiceCard
              src="/img/clean4.jpeg" // Educational facility
              alt={t("portfolio.educational.title")}
              title={t("portfolio.educational.title")}
              description={t("portfolio.educational.description")}
              width={600}
              height={400}
              data-oid="ks5f8o."
            />

            <ServiceCard
              src="/img/clean11.jpg" // Healthcare/Specialized (Updated to clean11)
              alt={t("portfolio.healthcare.title")}
              title={t("portfolio.healthcare.title")}
              description={t("portfolio.healthcare.description")}
              width={600}
              height={400}
              data-oid="icdjlw2"
            />

            <ServiceCard
              src="/img/clean8.jpg" // Classroom/Educational
              alt={t("services.classroom.title")} // Assuming translation exists
              title={t("services.classroom.title")} // Assuming translation exists
              description={t("services.classroom.description")} // Assuming translation exists
              width={600}
              height={400}
              data-oid="2hs836o"
            />

            <ServiceCard
              src="/img/clean9.jpg" // Commercial space
              alt={t("services.commercial.title")} // Assuming translation exists
              title={t("services.commercial.title")} // Assuming translation exists
              description={t("services.commercial.description")} // Assuming translation exists
              width={600}
              height={400}
              data-oid="uahsnl6"
            />

            <ServiceCard
              src="/img/clean10.jpg" // Landscape/Outdoor
              alt={t("services.landscape.title")} // Assuming translation exists
              title={t("services.landscape.title")} // Assuming translation exists
              description={t("services.landscape.description")} // Assuming translation exists
              width={600} // Adjusted width for consistency
              height={400} // Adjusted height for consistency
              data-oid="m8h-uxl"
            />

            <ServiceCard
              src="/img/clean5.jpg" // Eco-friendly/General
              alt={t("services.eco.title")} // Assuming translation exists
              title={t("services.eco.title")} // Assuming translation exists
              description={t("services.eco.description")} // Assuming translation exists
              width={600} // Adjusted width for consistency
              height={400} // Adjusted height for consistency
              data-oid="nyh30_x"
            />

            {/* Add more ServiceCards here if needed, ensure you have relevant images */}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-24 bg-gradient-to-b from-white via-gray-50/30 to-white"
        data-oid="ry_vjx-"
      >
        <div className="container mx-auto px-4" data-oid="zogamwy">
          <div className="text-center mb-20" data-oid="g05qtxo">
            <h2
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
              data-oid="9r8-pvf"
            >
              {t("testimonials.title")}{" "}
              <span className="text-[#4FB3D9]" data-oid="_6yi1tg">
                {t("testimonials.titleHighlight")}
              </span>
            </h2>
            <p
              className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed"
              data-oid="neh34r8"
            >
              {t("testimonials.description")}
            </p>
          </div>

          <TestimonialCarousel
            testimonials={testimonials}
            className="seamless-testimonials"
            data-oid="3_k3jok"
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white" data-oid="r12xdfe">
        <div className="container mx-auto px-4" data-oid="7zp-cds">
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            data-oid="e.fr_p7"
          >
            <div data-oid="m.1ppug">
              <h2
                className="text-3xl font-bold mb-6 text-gray-800"
                data-oid="7kv-6jw"
              >
                {t("contact.title")}{" "}
                <span className="text-[#4FB3D9]" data-oid="mq8c4x1">
                  {t("contact.titleHighlight")}
                </span>
              </h2>
              <p className="text-gray-600 mb-8" data-oid="73jv8iq">
                {t("contact.description")}
              </p>

              <div className="space-y-6" data-oid=".felpc.">
                <div className="flex items-start gap-4" data-oid="35mxy9x">
                  <div
                    className="bg-[#4FB3D9]/10 p-3 rounded-full text-[#4FB3D9]"
                    data-oid="pz7ij9g"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="y5.z6.g"
                    >
                      <path
                        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="tec1dih"
                      />

                      <path
                        d="M12 6V12L16 14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="k.3iarb"
                      />
                    </svg>
                  </div>
                  <div data-oid="rbe:.vd">
                    <h3
                      className="font-bold text-gray-800 mb-1"
                      data-oid="g5cv.g0"
                    >
                      {t("contact.businessHours.title")}
                    </h3>
                    <p className="text-gray-600" data-oid="emzgg3o">
                      {t("contact.businessHours.weekdays")}
                    </p>
                    <p className="text-gray-600" data-oid="ghs:t:m">
                      {t("contact.businessHours.saturday")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4" data-oid="-.c.v65">
                  <div
                    className="bg-[#4FB3D9]/10 p-3 rounded-full text-[#4FB3D9]"
                    data-oid="ei_s9al"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="krulln9"
                    >
                      <path
                        d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="9n6cscl"
                      />

                      <path
                        d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="ykrkmis"
                      />
                    </svg>
                  </div>
                  <div data-oid="nsm0phy">
                    <h3
                      className="font-bold text-gray-800 mb-1"
                      data-oid="59_17v9"
                    >
                      {t("contact.location.title")}
                    </h3>
                    <p className="text-gray-600" data-oid="x7n3ifi">
                      {t("contact.location.address")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4" data-oid="ko.3fvu">
                  <div
                    className="bg-[#4FB3D9]/10 p-3 rounded-full text-[#4FB3D9]"
                    data-oid="wfx9e7-"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="34_0w08"
                    >
                      <path
                        d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="sdg831-"
                      />
                    </svg>
                  </div>
                  <div data-oid=".b99.ua">
                    <h3
                      className="font-bold text-gray-800 mb-1"
                      data-oid="m8n.7mh"
                    >
                      {t("contact.contactInfo.title")}
                    </h3>
                    <p className="text-gray-600" data-oid="hmunh33">
                      {t("contact.contactInfo.phone")}
                    </p>
                    <p className="text-gray-600" data-oid="mg4:-l9">
                      {t("contact.contactInfo.email")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl shadow-lg p-8"
              data-oid="dqxqa6o"
            >
              <h3
                className="text-2xl font-bold mb-6 text-gray-800"
                data-oid="z16z5s-"
              >
                {t("contact.formTitle")}
              </h3>

              <Form {...form} data-oid="9a6dvsh">
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  data-oid="zpmqn27"
                >
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    data-oid="qk144g9"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem data-oid="h:htq8k">
                          <FormLabel data-oid="sp5tl_l">
                            {t("contact.name")}
                          </FormLabel>
                          <FormControl data-oid="1h1.7zn">
                            <Input
                              placeholder={t("contact.namePlaceholder")}
                              className="focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent"
                              {...field}
                              data-oid="5y2j0my"
                            />
                          </FormControl>
                          <FormMessage data-oid="maje0hv" />
                        </FormItem>
                      )}
                      data-oid="gju:sls"
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem data-oid="3ha8r_0">
                          <FormLabel data-oid="ig8hh39">
                            {t("contact.email")}
                          </FormLabel>
                          <FormControl data-oid="c5l66mi">
                            <Input
                              type="email"
                              placeholder={t("contact.emailPlaceholder")}
                              className="focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent"
                              {...field}
                              data-oid="lzr8hxw"
                            />
                          </FormControl>
                          <FormMessage data-oid="31qkfmg" />
                        </FormItem>
                      )}
                      data-oid="nl:0h3u"
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem data-oid="kq8.0jm">
                        <FormLabel data-oid="twt9o0v">
                          {t("contact.phone")}
                        </FormLabel>
                        <FormControl data-oid="670ku8a">
                          <Input
                            type="tel"
                            placeholder={t("contact.phonePlaceholder")}
                            className="focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent"
                            {...field}
                            data-oid="spgp5pr"
                          />
                        </FormControl>
                        <FormMessage data-oid="2859_-t" />
                      </FormItem>
                    )}
                    data-oid="tn82f:s"
                  />

                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem data-oid="84bnyui">
                        <FormLabel data-oid="5m45-lo">
                          {t("contact.service")}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          data-oid="f.c:qet"
                        >
                          <FormControl data-oid="n0e-k4y">
                            <SelectTrigger
                              className="focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent"
                              data-oid=":swvm:a"
                            >
                              <SelectValue
                                placeholder={t("contact.selectService")}
                                data-oid="svj-t6k"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent data-oid="rcqujji">
                            <SelectItem value="commercial" data-oid=".bb-lp9">
                              {t("services.commercialbuilding.title")}
                            </SelectItem>
                            <SelectItem value="educational" data-oid="r6748gx">
                              {t("services.educational.title")}
                            </SelectItem>
                            <SelectItem value="healthcare" data-oid="oof1uke">
                              {t("services.healthcare.title")}
                            </SelectItem>
                            <SelectItem value="specialized" data-oid="zkt1-az">
                              {t("services.specialized.title")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage data-oid="jmvmdtg" />
                      </FormItem>
                    )}
                    data-oid=":a:tvmk"
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem data-oid="qjv03hj">
                        <FormLabel data-oid="w_a:ubj">
                          {t("contact.message")}
                        </FormLabel>
                        <FormControl data-oid="r3ogi4l">
                          <Textarea
                            rows={4}
                            placeholder={t("contact.messagePlaceholder")}
                            className="focus:ring-2 focus:ring-[#4FB3D9] focus:border-transparent"
                            {...field}
                            data-oid="wzpr0hy"
                          />
                        </FormControl>
                        <FormMessage data-oid="i:hems9" />
                      </FormItem>
                    )}
                    data-oid="9wrv9gj"
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#4FB3D9] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#3a8aa8] transition-colors"
                    disabled={form.formState.isSubmitting}
                    data-oid="ar.b7pe"
                  >
                    {form.formState.isSubmitting
                      ? t("contact.submitting")
                      : t("contact.submit")}
                  </Button>

                  {/* Submission Status Messages */}
                  {submitStatus === "success" && (
                    <p
                      className="text-green-600 text-center mt-4"
                      data-oid="dvsdftk"
                    >
                      {t("contact.successMessage")}
                    </p>
                  )}
                  {submitStatus === "error" && (
                    <p
                      className="text-red-600 text-center mt-4"
                      data-oid="4m:th9g"
                    >
                      {t("contact.errorMessage")}
                    </p>
                  )}
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" data-oid="vcmc.1-">
        <div className="container mx-auto px-4" data-oid="3ifjp9n">
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            data-oid="l1ukfuo"
          >
            <div data-oid="ztn1dzi">
              <div className="flex items-center gap-3 mb-6" data-oid="ob63qkl">
                <div
                  className="relative w-14 h-14 overflow-hidden rounded-lg bg-white shadow-lg border-2 border-[#4FB3D9] transform hover:scale-105 transition-all duration-300"
                  data-oid="f1_-5le"
                >
                  <OptimizedImage
                    src="/img/logo.jpeg"
                    alt="Jaya Nexus logo"
                    width={56}
                    height={56}
                    className="w-full h-full"
                    objectFit="cover"
                    style={{ objectPosition: "center center" }}
                    priority
                    data-oid="wk1kojj"
                  />
                </div>
                <div data-oid="1qea-w0">
                  <span
                    className="font-bold text-lg flex items-center"
                    data-oid="tmb0:lx"
                  >
                    <span className="text-[#4FB3D9] mr-1" data-oid="zg95ttx">
                      ✦
                    </span>{" "}
                    Jaya Nexus
                  </span>
                  <p className="text-sm text-gray-400" data-oid="t4ta:vk">
                    {t("footer.tagline")}
                  </p>
                </div>
              </div>

              <p className="text-gray-400 mb-6" data-oid="lb31v-b">
                {t("footer.description")}
              </p>

              <div className="flex gap-4" data-oid="z9d2rfx">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  data-oid="hasd_5e"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="-h-jm0a"
                  >
                    <path
                      d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                      data-oid="x9n:zo9"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  data-oid="k.r1avc"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="5fkmfj7"
                  >
                    <path
                      d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z"
                      data-oid=":u0s9e2"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  data-oid="ogqowdl"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="_6wo8ni"
                  >
                    <path
                      d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                      data-oid="_2bv7kq"
                    />

                    <path d="M6 9H2V21H6V9Z" data-oid="4h._99:" />
                    <path
                      d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                      data-oid="c8nt_5w"
                    />
                  </svg>
                </a>
              </div>
            </div>

            <div data-oid="xn:bblh">
              <h3 className="font-bold text-lg mb-4" data-oid="hhkm.0t">
                {t("footer.quickLinks")}
              </h3>
              <ul className="space-y-2" data-oid="erelu_w">
                <li data-oid="7p5ms5b">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="n3-tt6k"
                  >
                    {t("nav.home")}
                  </a>
                </li>
                <li data-oid="r.xl_eo">
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="58:p7b3"
                  >
                    {t("nav.about")}
                  </a>
                </li>
                <li data-oid="t6sh9v0">
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="qux5u-q"
                  >
                    {t("nav.services")}
                  </a>
                </li>
                <li data-oid="uukz1y2">
                  <a
                    href="#portfolio"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="8ikgeyp"
                  >
                    {t("nav.portfolio")}
                  </a>
                </li>
                <li data-oid="dc-zpuv">
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="m56vg5v"
                  >
                    {t("nav.contact")}
                  </a>
                </li>
              </ul>
            </div>

            <div data-oid="g0bz62w">
              <h3 className="font-bold text-lg mb-4" data-oid="swha3f4">
                {t("footer.services")}
              </h3>
              <ul className="space-y-2" data-oid="22wsagw">
                <li data-oid="9g4mzr:">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="nw7ib.o"
                  >
                    {t("services.commercialbuilding.title")}
                  </a>
                </li>
                <li data-oid="9dpt1ud">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="zhvzon7"
                  >
                    {t("services.educational.title")}
                  </a>
                </li>
                <li data-oid="434b-.d">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="9lv-8m5"
                  >
                    {t("services.healthcare.title")}
                  </a>
                </li>
                <li data-oid="i-sfp8s">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="xnk-wtu"
                  >
                    {t("services.specialized.title")}
                  </a>
                </li>
                <li data-oid="-1:32qm">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="derzyn_"
                  >
                    {t("services.maintenance.title")}
                  </a>
                </li>
              </ul>
            </div>

            <div data-oid="iqi.b5t">
              <h3 className="font-bold text-lg mb-4" data-oid="qpitsi_">
                {t("footer.contactInfo")}
              </h3>
              <ul className="space-y-4" data-oid="-l-9i-d">
                <li className="flex items-start gap-3" data-oid="hmx9ayp">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="24lqmcn"
                  >
                    <path
                      d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid="k8o47dc"
                    />

                    <path
                      d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid="gp:s7az"
                    />
                  </svg>
                  <span className="text-gray-400" data-oid="ib1wbms">
                    {t("footer.address")}
                  </span>
                </li>
                <li className="flex items-start gap-3" data-oid="-j0ibi2">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="8wq62fi"
                  >
                    <path
                      d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid="jr238rl"
                    />
                  </svg>
                  <span className="text-gray-400" data-oid="po.9_7k">
                    {t("contact.contactInfo.phone").replace("Phone: ", "")}
                  </span>
                </li>
                <li className="flex items-start gap-3" data-oid="c5whuhz">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="8vk6bdy"
                  >
                    <path
                      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid="6w995oe"
                    />

                    <path
                      d="M22 6L12 13L2 6"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid="0b_6zwd"
                    />
                  </svg>
                  <span className="text-gray-400" data-oid="nz_grqx">
                    {t("contact.contactInfo.email").replace("Email: ", "")}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="border-t border-gray-800 mt-12 pt-8 text-center"
            data-oid="siqj9na"
          >
            <p className="text-gray-500" data-oid="4-ndje_">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
