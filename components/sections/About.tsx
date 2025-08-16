"use client"

import { motion, type Variants } from "framer-motion"
import { MapPin, Building2, Users2, Zap } from "lucide-react"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
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

export default function About() {
  return (
    <section id="about" className="bg-background py-12 lg:py-16">
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
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-4 drop-shadow-sm">About <span className="text-secondary">Kaiz La</span> </h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full shadow-sm"></div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column - Images */}
            <motion.div variants={itemVariants} className="lg:col-span-5 space-y-4 lg:space-y-6">
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="International trade and sourcing operations"
                  className="w-full h-[300px] lg:h-[350px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 text-white drop-shadow-md">
                  <div className="text-xl lg:text-2xl font-bold">Sourcing Excellence</div>
                  <div className="text-sm opacity-90">Factory to Doorstep</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Manufacturing and quality control"
                    className="w-full h-[160px] lg:h-[180px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-transparent"></div>
                </div>
                <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400"
                    alt="Global logistics and shipping"
                    className="w-full h-[160px] lg:h-[180px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-accent/50 to-transparent"></div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Content */}
            <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6 lg:space-y-8">
              <div className="space-y-4 lg:space-y-6">
                <p className="text-lg sm:text-xl lg:text-2xl text-foreground leading-relaxed font-medium">
                  <span className="text-secondary">Kaiz La</span>  is a leading sourcing-as-a-service company based in the heart of China, facilitating seamless
                  trade between Chinese suppliers and clients across India and the Middle East.
                </p>
                <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                  We enable businesses to source products directly from China at the supplier's MOQ, handling every step
                  from factory to final delivery through our AI-enabled platform and experienced on-ground teams.
                </p>
              </div>

              {/* Key Info List */}
              <div className="w-full">
                <ul className="space-y-4">

                  {/* Item 1: Headquarters */}
                  <li className="group flex items-center gap-5 p-4 rounded-xl bg-card/60 backdrop-blur-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-card/80">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10 transition-all duration-300">
                      <MapPin className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-foreground transition-colors duration-300 group-hover:text-primary">Headquarters</h4>
                      <p className="text-sm text-muted-foreground">Shenzhen, China</p>
                    </div>
                  </li>

                  {/* Item 2: Markets Served */}
                  <li className="group flex items-center gap-5 p-4 rounded-xl bg-card/60 backdrop-blur-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-card/80">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10 transition-all duration-300">
                      <Users2 className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-foreground transition-colors duration-300 group-hover:text-primary">Markets Served</h4>
                      <p className="text-sm text-muted-foreground"> India, Middle East & Southeast Asia</p>
                    </div>
                  </li>

                  {/* Item 3: Service Model */}
                  <li className="group flex items-center gap-5 p-4 rounded-xl bg-card/60 backdrop-blur-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-card/80">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10 transition-all duration-300">
                      <Building2 className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-foreground transition-colors duration-300 group-hover:text-primary">Service Model</h4>
                      <p className="text-sm text-muted-foreground">End-to-End Product Sourcing & Logistics
                      </p>
                    </div>
                  </li>

                  {/* Item 4: Technology */}
                  <li className="group flex items-center gap-5 p-4 rounded-xl bg-card/60 backdrop-blur-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:bg-card/80">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10 transition-all duration-300">
                      <Zap className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-bold text-foreground transition-colors duration-300 group-hover:text-primary">Technology</h4>
                      <p className="text-sm text-muted-foreground">AI-Enabled Supplier Management</p>
                    </div>
                  </li>

                </ul>
              </div>

              {/* Bottom Quote */}
              <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-6 lg:p-8 border border-border/50 shadow-md backdrop-blur-sm">
                <blockquote className="text-base lg:text-lg xl:text-xl text-foreground italic leading-relaxed drop-shadow-sm">
                  "We simplify global sourcing by offering comprehensive end-to-end services that extend far beyond
                  traditional procurement."
                </blockquote>
                <div className="mt-3 lg:mt-4 text-sm font-semibold text-secondary drop-shadow-sm">— Kaiz La Team</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}