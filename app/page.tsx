import About from "@/components/sections/About"
import Contact from "@/components/sections/Contact"
import  Hero  from "@/components/sections/Hero"
import Process from "@/components/sections/Process"
import Services from "@/components/sections/services"
import WhyChooseUs from "@/components/sections/WhyChooseUs"

export default function Home() {
  return (
    <div className="bg-background">
      <Hero/>
      <About/>
      <Services/>
      <Process/>
      <WhyChooseUs/>
      <Contact/>
    </div>
  )
}
