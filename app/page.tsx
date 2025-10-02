"use client";
import Footer from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import About from "@/components/sections/About"
import Contact from "@/components/sections/Contact"
import  Hero  from "@/components/sections/Hero"
import Process from "@/components/sections/Process"
import Services from "@/components/sections/services"
import TestimonialsAndPartners from "@/components/sections/testimonials"
import WhyChooseUs from "@/components/sections/WhyChooseUs"

import { useState, useEffect } from "react"

export default function Home() {
  const [showCookieBanner, setShowCookieBanner] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cookiesAccepted = document.cookie.includes("kaizla_cookies_accepted=true");
      if (cookiesAccepted) {
        setShowCookieBanner(false);
      }
    }
  }, []);

  const handleAcceptCookies = () => {
    if (typeof window !== "undefined") {
      document.cookie = "kaizla_cookies_accepted=true; path=/; max-age=" + 60 * 60 * 24 * 365;
      setShowCookieBanner(false);
    }
  };
  return (
    <div className="bg-background relative">
      <Header/>
      <Hero/>
      <About/>
      <WhyChooseUs/>
      <Services/>
      <Process/>
      <TestimonialsAndPartners/>
      <Contact/>
      <Footer/>
      {showCookieBanner && (
        <div className="fixed bottom-4 left-0 w-full flex justify-center z-50">
          <div className="bg-white shadow-lg rounded-lg px-6 py-4 flex items-center gap-4">
            <span className="text-sm text-gray-700">We use cookies to improve your experience. By using our site, you agree to cookies and our Terms.</span>
            <button
              className="text-white px-4 py-2 rounded transition"
              style={{ backgroundColor: '#CC3433' }}
              onClick={handleAcceptCookies}
            >
              Accept Cookies
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
