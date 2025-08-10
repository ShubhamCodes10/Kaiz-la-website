"use client"

import { motion, type Variants } from "framer-motion"
import { Search, Shield, Warehouse, FileCheck, Truck, MapPin } from "lucide-react"

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
  const services = [
    {
      icon: Search,
      title: "Supplier Discovery and Negotiation",
      description:
        "We identify and vet the best suppliers for your needs, handling all negotiations to secure optimal terms and pricing.",
      step: "01",
    },
    {
      icon: Shield,
      title: "Quality Checks and Production Tracking",
      description:
        "Comprehensive quality assurance and real-time production monitoring to ensure your products meet specifications.",
      step: "02",
    },
    {
      icon: Warehouse,
      title: "Warehousing",
      description: "Secure storage solutions with inventory management to streamline your supply chain operations.",
      step: "03",
    },
    {
      icon: FileCheck,
      title: "Customs Clearance",
      description:
        "Expert handling of all customs documentation and procedures to ensure smooth international trade compliance.",
      step: "04",
    },
    {
      icon: Truck,
      title: "International Logistics",
      description:
        "Optimized shipping solutions via air and sea freight, tailored to balance cost, speed, and reliability.",
      step: "05",
    },
    {
      icon: MapPin,
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
          {/* Section Header */}
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

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {services.map((service) => (
              <motion.div
                key={service.step}
                variants={itemVariants}
                onMouseMove={handleMouseMove}
                className="group relative rounded-xl bg-card p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-full overflow-hidden"
              >
                {/* Gradient Bloom Effect */}
                <div
                  className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), theme(colors.secondary / 0.15), transparent 80%)",
                  }}
                />

                <div className="relative h-full flex flex-col">
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 text-xs font-bold text-primary/40 z-10">
                    {service.step}
                  </div>

                  {/* Icon Container */}
                  <div className="mb-5 flex-shrink-0">
                    <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition-colors duration-300">
                      <service.icon className="h-8 w-8 text-secondary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-semibold text-secondary mb-3 leading-tight">
                      {service.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed flex-1">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}