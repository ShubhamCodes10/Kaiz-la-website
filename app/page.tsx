import Footer from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import About from "@/components/sections/About"
import Contact from "@/components/sections/Contact"
import  Hero  from "@/components/sections/Hero"
import Process from "@/components/sections/Process"
import Services from "@/components/sections/services"
import TestimonialsAndPartners from "@/components/sections/testimonials"
import WhyChooseUs from "@/components/sections/WhyChooseUs"

export default function Home() {
  return (
    <div className="bg-background">
      <Header/>
      <Hero/>
      <About/>
      <WhyChooseUs/>
      <Services/>
      <Process/>
      <TestimonialsAndPartners/>
      <Contact/>
      <Footer/>
    </div>
  )
}
