"use client"

import { motion, AnimatePresence, type Variants } from "framer-motion"
import { useState } from "react"
import { Award, ShieldCheck, Clock, Brain, ArrowRight, CheckCircle, UserCheck } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
}

const contentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.3,
      ease: 'easeIn' as const,
    },
  },
};

export default function WhyChooseUs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabsData = [
    {
      icon: ShieldCheck,
      tabName: "3600 Confidentiality and Quality",
      title: "3600 Confidentiality and Quality - 100% Confidentiality & Zero IP Leakage",
      description: "From enquiry to delivery, we safeguard your business intelligence and product integrity at every stage of the sourcing journey. Our NDA-backed supplier and partner network operates under strict, pre-agreed confidentiality protocols, ensuring your designs, pricing, and market strategies remain fully protected. With Kaiz La, you get transparent quality control and absolute peace of mind—no leaks, no surprises.",
      stat: "100% Confidentiality & Zero IP Leakage",
    },
    {
      icon: Award,
      tabName: "Proven Expertise",
      title: "15+ Years of Industry-Leading Experience",
      description: "Our deep understanding of international trade nuances comes from over a decade of successfully navigating the complexities of the global market. We've seen it all, so you don't have to.",
      stat: "1000+ Projects Delivered",
    },
    {
      icon: ShieldCheck,
      tabName: "Verified Network",
      title: "Access an Elite, Vetted Supplier Network",
      description: " We connect you with top-tier manufacturers, delivering factory-direct pricing and uncompromising quality. Every partner is rigorously vetted to meet Kaiz La's high standards. Our strict in-house QA checks—conducted at multiple production stages—ensure your products meet exact specifications. Before loading, you receive a detailed quality inspection report, giving you complete transparency and confidence in every shipment.",
      stat: "500+ Trusted Partners",
    },
    {
      icon: Clock,
      tabName: "Optimized Lead Times",
      title: "Significantly Faster Delivery Times",
      description: "Our local presence in key markets and a fully integrated supply chain allow us to cut through delays and get your products to you faster.",
      stat: "Up to 40% Faster Delivery",
    },
    {
      icon: UserCheck,
      tabName: "Customer Experience Support",
      title: "Firsthand Confidence Before You Buy",
      description: (
        <>
          We invite you to China to personally experience your products before purchase. From the moment you arrive, Kaiz La handles every detail of your itinerary — travel, factory visits, product inspections, and more. A dedicated <span className="text-secondary font-bold">Kaiz La Customer Success Expert</span> accompanies you throughout the journey, ensuring seamless communication, transparency, and complete confidence in your sourcing decisions.
        </>
      ),
      stat: "100% On-Site Inspection Support",
    },
    {
      icon: Brain,
      tabName: "AI-Enhanced Operations",
      title: "Technology-Driven Sourcing",
      description: "Leverage our smart systems for efficient supplier management, real-time production tracking, and proactive risk minimization, ensuring 99.8% accuracy.",
      stat: "99.8% Order Accuracy",
    },
  ];

  return (
    <section id="why-choose-us" className="relative bg-background py-20 lg:py-28 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-6 drop-shadow-sm">
              The <span className="text-secondary">Kaiz La</span> Advantage
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We combine deep industry expertise with cutting-edge technology to transform your supply chain into a competitive advantage.
            </p>
          </motion.div>

          {/* Interactive Tab Showcase */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Tab Navigation */}
            <motion.div variants={itemVariants} className="lg:col-span-4 mb-8 lg:mb-0">
              <div className="space-y-2">
                {tabsData.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`w-full text-left flex items-center gap-4 p-4 cursor-pointer rounded-xl transition-all duration-300
                      ${activeTab === index ? 'bg-secondary shadow-lg border-border/20' : 'hover:bg-card/50'}`}
                  >
                    <div className={`w-12 h-12 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors duration-300
                      ${activeTab === index ? 'bg-secondary text-background ' : 'bg-primary/10 text-primary'}`}>
                      <tab.icon className="w-6 h-6" />
                    </div>
                    <span className={`text-lg font-semibold transition-colors duration-300 ${activeTab === index ? 'text-background font-extrabold' : 'text-primary'}`}>
                      {tab.tabName}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Right Column: Content Display */}
            <motion.div variants={itemVariants} className="lg:col-span-8">
              <div className="relative bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl p-8 lg:p-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="mb-6 pb-6 border-b border-border/10">
                      <h3 className="text-3xl lg:text-4xl font-bold text-secondary mb-3">{tabsData[activeTab].title}</h3>
                      <div className="text-lg text-muted-foreground leading-relaxed">
                        {tabsData[activeTab].description}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-accent" />
                      </div>
                      <p className="text-lg font-semibold text-accent">{tabsData[activeTab].stat}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* CTA Section - Placed after the tab component */}
          {/* <motion.div variants={itemVariants} className="mt-20">
            <div className="group relative rounded-2xl p-8 lg:p-12 overflow-hidden bg-gradient-to-r from-primary to-accent text-white">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="lg:w-1/2 mb-8 lg:mb-0">
                      <h3 className="text-3xl lg:text-4xl font-bold mb-3">Ready to Transform Your Sourcing?</h3>
                      <p className="text-lg opacity-90">
                          Let's build a more efficient and reliable supply chain for your business.
                      </p>
                  </div>
                  <div className="lg:w-1/2">
                      <div className="bg-white/10 backdrop-blur-sm p-2 rounded-xl flex flex-col sm:flex-row gap-2">
                          <input 
                              type="email" 
                              placeholder="Enter your business email"
                              className="w-full sm:flex-grow bg-transparent placeholder-white/70 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50"
                          />
                          <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full sm:w-auto inline-flex items-center justify-center bg-white text-primary px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl group"
                          >
                              Get a Free Quote
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                      </div>
                  </div>
                </div>
              </div>
          </motion.div> */}

        </motion.div>
      </div>
    </section>
  )
}