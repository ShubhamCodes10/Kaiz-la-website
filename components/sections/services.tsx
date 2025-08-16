"use client"

import { motion, type Variants } from "framer-motion"
import { Globe, ShieldCheck, Building2, FileText, Plane, Home, ArrowRight } from "lucide-react"
import { useState } from "react"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

export default function Services() {
  const [hoveredService, setHoveredService] = useState<string | null>(null)

  const services = [
    {
      icon: Globe,
      title: "Supplier Discovery and Negotiation",
      description:
        "We identify and vet the best suppliers for your needs, handling all negotiations to secure optimal terms and pricing.",
      step: "01",
    },
    {
      icon: ShieldCheck,
      title: "Quality Checks and Production Tracking",
      description:
        "Comprehensive quality assurance and real-time production monitoring to ensure your products meet specifications.",
      step: "02",
    },
    {
      icon: Building2,
      title: "Warehousing",
      description: "Secure storage solutions with inventory management to streamline your supply chain operations.",
      step: "03",
    },
    {
      icon: FileText,
      title: "Customs Clearance",
      description:
        "Expert handling of all customs documentation and procedures to ensure smooth international trade compliance.",
      step: "04",
    },
    {
      icon: Plane,
      title: "International Logistics",
      description:
        "Optimized shipping solutions via air and sea freight, tailored to balance cost, speed, and reliability.",
      step: "05",
    },
    {
      icon: Home,
      title: "Last-Mile Delivery to Your Doorstep",
      description:
        "Complete delivery management ensuring your products reach you safely and on time, wherever you are.",
      step: "06",
    },
  ]

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty("--mouse-x", `${x}px`)
    card.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <section id="services" className="bg-background py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-4 drop-shadow-sm">
              Our <span className="text-secondary">Services</span>
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full shadow-sm mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              <span className="font-semibold text-foreground">End-to-End Solutions</span> - We manage the entire
              lifecycle of your procurement with precision, transparency, and expertise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {services.map((service) => (
              <motion.div
                key={service.step}
                variants={itemVariants}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setHoveredService(service.step)}
                onMouseLeave={() => setHoveredService(null)}
                className="group relative rounded-xl bg-card p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden cursor-pointer"
              >
                <div
                  className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), theme(colors.secondary / 0.15), transparent 80%)",
                  }}
                />

                <div className="relative h-full flex flex-col">
                  <div className="absolute top-4 right-4 text-xs font-bold text-primary/40 z-10">
                    {service.step}
                  </div>

                  <div className="mb-5 flex-shrink-0">
                    <motion.div 
                      className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300"
                      animate={{
                        rotate: hoveredService === service.step ? [0, -10, 10, 0] : 0,
                        scale: hoveredService === service.step ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <motion.div
                        animate={{
                          scale: hoveredService === service.step ? [1, 1.2, 1] : 1,
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <service.icon className="h-8 w-8 text-secondary" />
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-secondary mb-3 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed flex-1">
                      {service.description}
                    </p>
                  </div>

                  {/* <motion.div
                    className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 10 }}
                    animate={{ y: hoveredService === service.step ? 0 : 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center text-secondary text-sm font-medium">
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </motion.div> */}
                </div>
              </motion.div>
            ))}
          </div>

          {/* <motion.div 
            variants={itemVariants}
            className="text-center mt-12 lg:mt-16"
          >
            <motion.button
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
              className="group inline-flex items-center justify-center rounded-lg bg-secondary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                animate={{
                  translateX: [-100, 300],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />
              <span className="relative z-10">Explore All Services</span>
              <ArrowRight className="relative z-10 ml-2 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  )
}