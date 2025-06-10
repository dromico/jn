"use client";

import React from "react";
import StickyNavbar from "../../components/StickyNavbar";
import OptimizedImage from "../../components/OptimizedImage";
import CTAButton from "../../components/CTAButton";
import { useLanguage } from "../../context/LanguageContext";

export default function Projects() {
  const { t } = useLanguage();

  // Navigation items
  const navItems = [
    { label: "about", href: "/#about" },
    { label: "services", href: "/#services" },
    { label: "projects", href: "/Projects" },
    { label: "portfolio", href: "/#portfolio" },
    { label: "contact", href: "/#contact" },
    { label: "login", href: "/login", isButton: true },
  ];

  return (
    <div className="min-h-screen" data-oid="l--j5g1">
      {/* Sticky Navigation Bar */}
      <StickyNavbar
        logoSrc="/img/logo.jpeg"
        companyName="Jaya Nexus"
        navItems={navItems}
        forceVisibleBackground={true}
        data-oid="xzq15ep"
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gray-50" data-oid="0n7wko-">
        <div className="container mx-auto px-4 text-center" data-oid="-3w3ht-">
          <h1
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
            data-oid="rfes58:"
          >
            {t("projects.title")}{" "}
            <span className="text-[#4FB3D9]" data-oid="mvaakp_">
              {t("projects.titleHighlight")}
            </span>
          </h1>
          <p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            data-oid="vq2y3:l"
          >
            {t("projects.subtitle")}
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-white" data-oid="uil:si0">
        <div className="container mx-auto px-4" data-oid="c0vsnm6">
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
            data-oid="8d2lz3a"
          >
            {/* School Cleaning Project */}
            <div
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg"
              data-oid="isq-cvk"
            >
              <div className="relative h-64" data-oid="z:exn9w">
                <OptimizedImage
                  src="/img/clean1.jpeg"
                  alt="School Cleaning Project"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  data-oid=".y36tdt"
                />
              </div>
              <div className="p-6" data-oid="u9a6f35">
                <h2
                  className="text-2xl font-bold mb-3 text-gray-800"
                  data-oid="0eb.nl0"
                >
                  Sekolah Kebangsaan Bangsar
                </h2>
                <p className="text-gray-600 mb-4" data-oid="j2:a6qv">
                  Comprehensive cleaning services for this primary school with
                  25 classrooms serving 650 students. Daily sanitization of
                  high-touch surfaces, floor maintenance, and restroom cleaning
                  with Malaysian-approved disinfectants.
                </p>
                <ul className="space-y-2 mb-6" data-oid="1eym:fd">
                  <li className="flex items-start gap-2" data-oid="0g8gldl">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="antdsa."
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid=".vk0bms"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="3t9hjlg">
                      Classroom and corridor sanitization
                    </span>
                  </li>
                  <li className="flex items-start gap-2" data-oid="_._ww1q">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="i9zz9qc"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="646ev-_"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="j4in34p">
                      Kantin (cafeteria) deep cleaning
                    </span>
                  </li>
                  <li className="flex items-start gap-2" data-oid="l.dlvf1">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="vql:gtd"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="xhk3qv5"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="n:8hct:">
                      Dewan (hall) and sports facilities maintenance
                    </span>
                  </li>
                  <li className="flex items-start gap-2" data-oid="xxgzur5">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="_q40rf_"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="0nzdjo:"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid=".edtz3q">
                      Tandas (restroom) thorough disinfection
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Secondary School Project */}
            <div
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg"
              data-oid="cc0hgzr"
            >
              <div className="relative h-64" data-oid="q4:zv8v">
                <OptimizedImage
                  src="/img/clean2.jpeg"
                  alt="Secondary School Cleaning"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  data-oid="0tsfu4_"
                />
              </div>
              <div className="p-6" data-oid="lv6v8h_">
                <h2
                  className="text-2xl font-bold mb-3 text-gray-800"
                  data-oid="g3boxfw"
                >
                  SMK Subang Jaya
                </h2>
                <p className="text-gray-600 mb-4" data-oid="uvwxyi0">
                  Specialized cleaning plan for this secondary school with
                  science labs, computer rooms, and large assembly hall. Weekly
                  deep cleaning and daily maintenance to ensure hygienic
                  environment for students.
                </p>
                <ul className="space-y-2 mb-6" data-oid="f36sbxl">
                  <li className="flex items-start gap-2" data-oid="58vrjhd">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="9xs56q2"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="gb6g2.q"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="0vua4es">
                      Science lab specialized cleaning
                    </span>
                  </li>
                  <li className="flex items-start gap-2" data-oid="qoh5f10">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="uuuwgn1"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="o6mkhu-"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="h0kg:p:">
                      Computer lab dust prevention
                    </span>
                  </li>
                  <li className="flex items-start gap-2" data-oid="kc1fit9">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="7u0w:q2"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="9lf7phe"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="h51ezo-">
                      Perpustakaan (library) care and maintenance
                    </span>
                  </li>
                  <li className="flex items-start gap-2" data-oid="_df.6vq">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="0p6.whf"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="hv:-dy2"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="7ff.sm1">
                      Bilik guru (teachers' room) services
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Office Building Project */}
            <div
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg"
              data-oid="ol_5kou"
            >
              <div className="relative h-64" data-oid="xoqc4n.">
                <OptimizedImage
                  src="/img/clean3.jpeg"
                  alt="Office Building Cleaning"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  data-oid="k3tg:zw"
                />
              </div>
              <div className="p-6" data-oid="pr8a9m.">
                <h2
                  className="text-2xl font-bold mb-3 text-gray-800"
                  data-oid="nsgrl-j"
                >
                  Menara KLCC Office Complex
                </h2>
                <p className="text-gray-600 mb-4" data-oid="tsk9_m5">
                  Regular maintenance for a prestigious office tower in Kuala
                  Lumpur with over 30 floors. Evening cleaning schedule to
                  minimize disruption to business operations.
                </p>
                <ul className="space-y-2 mb-6" data-oid="4__p5z3">
                  <li className="flex items-start gap-2" data-oid="8twjfbp">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="xl_p.wu"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="-k.2m8a"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="s01qsm-">
                      Daily office space cleaning
                    </span>
                  </li>
                  <li className="flex items-start gap-2" data-oid="zvfwhtr">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="xwa8u2m"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="9bvlq63"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="qs7tl:l">
                      Weekly carpet shampooing
                    </span>
                  </li>
                  <li className="flex items-start gap-2" data-oid="4.t1jmv">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="ms:2l_y"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="5m10k5a"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="q:unhrc">
                      Glass façade cleaning service
                    </span>
                  </li>
                  <li className="flex items-start gap-2" data-oid="kb-lwtv">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="9r7fjsz"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="7zy:9t8"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="qoaw4-5">
                      Green cleaning methods using local eco-friendly products
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Special Cleaning Project */}
            <div
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:shadow-lg"
              data-oid="kl0gixh"
            >
              <div className="relative h-64" data-oid="uzxlut_">
                <OptimizedImage
                  src="/img/clean4.jpeg"
                  alt="Post-Construction Cleaning"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  data-oid="v:64o3f"
                />
              </div>
              <div className="p-6" data-oid="eacd7rw">
                <h2
                  className="text-2xl font-bold mb-3 text-gray-800"
                  data-oid="4m1j1t1"
                >
                  Sekolah Kebangsaan Putrajaya Presint 9
                </h2>
                <p className="text-gray-600 mb-4" data-oid="cb3d5ld">
                  Post-renovation cleaning after major upgrade of school
                  facilities. Removal of construction debris, dust remediation,
                  and preparation for new term.
                </p>
                <ul className="space-y-2 mb-6" data-oid="qobuxwx">
                  <li className="flex items-start gap-2" data-oid="11k9dkp">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="_6dckk3"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="5st2pp0"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="5::eq8.">
                      Construction dust removal and air quality restoration
                    </span>
                  </li>
                  <li className="flex items-start gap-2" data-oid="q7cml:2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="cf52uee"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid=":t0ysqc"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="y6yf0g1">
                      Penghawa dingin (air conditioning) duct cleaning
                    </span>
                  </li>
                  <li className="flex items-start gap-2" data-oid="imv-mal">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="f:gbycp"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="lil9glq"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid="jm4-wu3">
                      Window and glass cleaning
                    </span>
                  </li>
                  <li className="flex items-start gap-2" data-oid=":d_r5:t">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      data-oid="qt.x.s8"
                    >
                      <path
                        d="M5 13L9 17L19 7"
                        stroke="#4FB3D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        data-oid="0nosmuz"
                      />
                    </svg>
                    <span className="text-gray-700" data-oid=":jo7.ya">
                      Floor polishing and sealing with anti-bacterial coating
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50" data-oid="frkj9on">
        <div className="container mx-auto px-4" data-oid="k-i49ok">
          <div className="text-center mb-12" data-oid="5r9aldz">
            <h2
              className="text-3xl font-bold mb-4 text-gray-800"
              data-oid="km3lb4m"
            >
              {t("projects.testimonials.title")}{" "}
              <span className="text-[#4FB3D9]" data-oid="iatu2-y">
                {t("projects.testimonials.titleHighlight")}
              </span>
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
            data-oid="_2pja8q"
          >
            <div
              className="bg-white p-6 rounded-xl shadow-md"
              data-oid="2pfm66m"
            >
              <p className="text-gray-600 mb-4 italic" data-oid="9zxy0._">
                "Perkhidmatan pembersihan yang disediakan sangat memuaskan.
                Pihak sekolah dan murid-murid kini dapat belajar dalam
                persekitaran yang bersih dan selesa."
              </p>
              <p className="font-medium text-gray-800" data-oid="t6r961j">
                - Puan Nurul Huda, Pengetua SK Bangsar
              </p>
            </div>
            <div
              className="bg-white p-6 rounded-xl shadow-md"
              data-oid="kspy5hv"
            >
              <p className="text-gray-600 mb-4 italic" data-oid="44tmeoe">
                "Sejak menggunakan perkhidmatan pembersihan ini, kadar
                ketidakhadiran pekerja kerana sakit telah berkurang. Kualiti
                perkhidmatan mereka sangat konsisten."
              </p>
              <p className="font-medium text-gray-800" data-oid="yxj4pba">
                - Encik Ahmad Razali, Pengurus Fasiliti Menara KLCC
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-16 bg-white" data-oid="t6_4r2z">
        <div className="container mx-auto px-4" data-oid="6z67wl_">
          <div className="text-center mb-12" data-oid="1rb_5ge">
            <h2
              className="text-3xl font-bold mb-4 text-gray-800"
              data-oid="kxvwh4p"
            >
              {t("projects.approach.title")}{" "}
              <span className="text-[#4FB3D9]" data-oid="9lq4q5n">
                {t("projects.approach.titleHighlight")}
              </span>
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            data-oid="swhklay"
          >
            <div className="bg-gray-50 p-6 rounded-xl" data-oid="5oo.3sv">
              <h3
                className="text-xl font-bold mb-3 text-gray-800"
                data-oid="9v3067o"
              >
                {t("projects.approach.eco.title")}
              </h3>
              <p className="text-gray-600" data-oid="n.u9kau">
                {t("projects.approach.eco.description")}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl" data-oid="r2gzsyc">
              <h3
                className="text-xl font-bold mb-3 text-gray-800"
                data-oid="ly:teco"
              >
                {t("projects.approach.trained.title")}
              </h3>
              <p className="text-gray-600" data-oid="2.ema-8">
                {t("projects.approach.trained.description")}
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl" data-oid="9htyhyk">
              <h3
                className="text-xl font-bold mb-3 text-gray-800"
                data-oid="vx.43-7"
              >
                {t("projects.approach.customized.title")}
              </h3>
              <p className="text-gray-600" data-oid="n4bdgaa">
                {t("projects.approach.customized.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-16 bg-[#4FB3D9]/10" data-oid="tovtw7o">
        <div className="container mx-auto px-4 text-center" data-oid="fcc38in">
          <h2
            className="text-3xl font-bold mb-6 text-gray-800"
            data-oid="zhh2wct"
          >
            {t("projects.cta.title")}
          </h2>
          <p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            data-oid="lc968t7"
          >
            {t("projects.cta.description")}
          </p>
          <CTAButton
            href="/#contact"
            variant="primary"
            size="lg"
            className="bg-[#4FB3D9] hover:bg-[#3a8aa8]"
            data-oid="7a.214j"
          >
            {t("projects.cta.button")}
          </CTAButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" data-oid="bbu-qh9">
        <div className="container mx-auto px-4" data-oid="f.ndw2d">
          <div
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            data-oid="ny09jhv"
          >
            <div data-oid="gf_qa5t">
              <div className="flex items-center gap-3 mb-6" data-oid="cfh6mfx">
                <div
                  className="relative w-14 h-14 overflow-hidden rounded-lg bg-white shadow-lg border-2 border-[#4FB3D9] transform hover:scale-105 transition-all duration-300"
                  data-oid="q7-:m7:"
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
                    data-oid="y7ire67"
                  />
                </div>
                <div data-oid="86mxq_k">
                  <span
                    className="font-bold text-lg flex items-center"
                    data-oid="_0-9hdj"
                  >
                    <span className="text-[#4FB3D9] mr-1" data-oid="ogkk230">
                      ✦
                    </span>{" "}
                    Jaya Nexus
                  </span>
                  <p className="text-sm text-gray-400" data-oid=".-yh06q">
                    {t("footer.tagline")}
                  </p>
                </div>
              </div>

              <p className="text-gray-400 mb-6" data-oid="gipcgya">
                {t("footer.description")}
              </p>
            </div>

            <div data-oid="bw7ez2_">
              <h3 className="font-bold text-lg mb-4" data-oid="7j8dw3a">
                {t("footer.quickLinks")}
              </h3>
              <ul className="space-y-2" data-oid="j4ktxe7">
                <li data-oid="58cmcvu">
                  <a
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="_o7kqor"
                  >
                    {t("nav.home")}
                  </a>
                </li>
                <li data-oid="csmryvy">
                  <a
                    href="/#about"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="swusrfp"
                  >
                    {t("nav.about")}
                  </a>
                </li>
                <li data-oid="ex.f:wf">
                  <a
                    href="/#services"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="bky7-d6"
                  >
                    {t("nav.services")}
                  </a>
                </li>
                <li data-oid="xh0073l">
                  <a
                    href="/Projects"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="skczf7n"
                  >
                    {t("nav.projects")}
                  </a>
                </li>
                <li data-oid="4tu6dhd">
                  <a
                    href="/#contact"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="h.twjeh"
                  >
                    {t("nav.contact")}
                  </a>
                </li>
              </ul>
            </div>

            <div data-oid="wmzhhne">
              <h3 className="font-bold text-lg mb-4" data-oid="3zeium1">
                {t("footer.services")}
              </h3>
              <ul className="space-y-2" data-oid="c_7x4q8">
                <li data-oid="s27tgwy">
                  <a
                    href="/#services"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="awm7gb9"
                  >
                    {t("services.commercialbuilding.title")}
                  </a>
                </li>
                <li data-oid="eh6vht:">
                  <a
                    href="/#services"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid=":sha:-g"
                  >
                    {t("services.educational.title")}
                  </a>
                </li>
                <li data-oid="ik6sdtq">
                  <a
                    href="/#services"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid=".ecpi55"
                  >
                    {t("services.healthcare.title")}
                  </a>
                </li>
                <li data-oid="rxggilx">
                  <a
                    href="/#services"
                    className="text-gray-400 hover:text-white transition-colors"
                    data-oid="5ialthp"
                  >
                    {t("services.specialized.title")}
                  </a>
                </li>
              </ul>
            </div>

            <div data-oid="lkc2hxd">
              <h3 className="font-bold text-lg mb-4" data-oid="9821ek1">
                {t("footer.contactInfo")}
              </h3>
              <ul className="space-y-4" data-oid="2ws26s_">
                <li className="flex items-start gap-3" data-oid="5taikkc">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="dlno9nj"
                  >
                    <path
                      d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid="i4wo32h"
                    />

                    <path
                      d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid="_klbd.x"
                    />
                  </svg>
                  <span className="text-gray-400" data-oid="zf1w:io">
                    {t("footer.address")}
                  </span>
                </li>
                <li className="flex items-start gap-3" data-oid="ai8ok6z">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="53xej:e"
                  >
                    <path
                      d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.27099 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4135 11.5865 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0554 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid="3m-i064"
                    />
                  </svg>
                  <span className="text-gray-400" data-oid="je70n63">
                    {t("contact.contactInfo.phone")
                      .replace("Phone: ", "")
                      .replace("Telefon: ", "")}
                  </span>
                </li>
                <li className="flex items-start gap-3" data-oid="2ngap-_">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    data-oid="mru6xpm"
                  >
                    <path
                      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid="x3x9f_y"
                    />

                    <path
                      d="M22 6L12 13L2 6"
                      stroke="#4FB3D9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      data-oid=".jqp55l"
                    />
                  </svg>
                  <span className="text-gray-400" data-oid="1dpv.zi">
                    {t("contact.contactInfo.email")
                      .replace("Email: ", "")
                      .replace("E-mel: ", "")}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="border-t border-gray-800 mt-12 pt-8 text-center"
            data-oid="gexr7dv"
          >
            <p className="text-gray-500" data-oid="fv6zfw0">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
