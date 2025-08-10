"use client"

import { motion, type Variants } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Award } from "lucide-react"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export default function Hero() {
  return (
    <section className="relative bg-background overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,theme(colors.primary)_1px,transparent_1px)] bg-[length:50px_50px]" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center pt-12 pb-20 sm:pt-16 sm:pb-24">
          <motion.div
            className="w-full max-w-7xl text-center space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 px-4 py-2 shadow-sm"
              variants={itemVariants}
            >
              <Award className="h-4 w-4 text-secondary shrink-0" />
              <span className="text-sm font-medium text-primary whitespace-nowrap">
                15+ Years of Global Sourcing Excellence
              </span>
            </motion.div>

            <motion.div className="space-y-3" variants={itemVariants}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary leading-[1.1] drop-shadow-xl">
                Empowering Global Trade with <span className="text-secondary drop-shadow-sm">Seamless Sourcing</span> Solutions
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-muted-foreground max-w-4xl mx-auto">
                Leading sourcing-as-a-service company connecting Global suppliers to clients across{" "}
                <span className="font-semibold text-secondary">India and the Middle East</span>.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
              variants={itemVariants}
            >
              <Link
                href="#"
                className="group inline-flex items-center justify-center rounded-lg bg-secondary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-secondary/90 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background"
              >
                Talk to an Expert
                <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              
              <Link
                href="#services"
                className="group inline-flex items-center justify-center rounded-lg bg-secondary px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-secondary/90 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background"
              >
                Know More
                <ArrowRight className="ml-2 h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pt-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              <div className="text-center p-4 rounded-lg bg-card/80 backdrop-blur-lg shadow-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-2xl sm:text-3xl font-bold text-secondary drop-shadow-sm">1000+</div>
                <div className="text-sm text-muted-foreground mt-1">Clients</div>
              </div>

              <div className="text-center p-4 rounded-lg bg-card/80 backdrop-blur-lg shadow-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-2xl sm:text-3xl font-bold text-secondary drop-shadow-sm">5 Million+</div>
                <div className="text-sm text-muted-foreground mt-1">Product Served</div>
              </div>

              <div className="col-span-2 lg:col-span-1 text-center p-4 rounded-lg bg-card/80 backdrop-blur-lg shadow-lg hover:shadow-lg transition-shadow duration-200">
                <div className="text-2xl sm:text-3xl font-bold text-secondary drop-shadow-sm">2009</div>
                <div className="text-sm text-muted-foreground mt-1">Founded</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
