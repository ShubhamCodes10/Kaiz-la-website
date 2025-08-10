"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Search, Handshake, Shield, Warehouse, FileCheck, Truck } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.15,
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

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(1);
  const processSteps = [
    {
      icon: Search,
      title: "Supplier Discovery",
      description: "Kaiz La begins by understanding your product needs and sourcing goals. Using a combination of Al tools and on-ground specialists, we scout and vet reliable suppliers across China-focusing on product quality, compliance, and pricing. This ensures you access manufacturers that match both your specs and budget.",
      step: 1,
    },
    {
      icon: Handshake,
      title: "Negotiation & Contracts",
      description: "Once potential suppliers are shortlisted, our local procurement team steps in to negotiate optimal terms. We handle language, pricing, timelines, and risk management - protecting your business interests, ensuring accountability from day one.",
      step: 2,
    },
    {
      icon: Shield,
      title: "Quality Control",
      description: "Before any shipment leaves the factory, our QA specialists detailed inspections at multiple stages. From material checks to finished goods verification, we ensure your product meets the promised standards and certifications-minimizing costly errors and returns.",
      step: 3,
    },
    {
      icon: Warehouse,
      title: "Warehousing & Consolidation",
      description: "Goods from various suppliers can be stored in our secure warehouses across China. We manage timelines and consolidate different products into unified shipments-helping you reduce shipping costs, avoid fragmented logistics, and streamline inventory intake.",
      step: 4,
    },
    {
      icon: FileCheck,
      title: "Customs Clearance",
      description: "We prepare all necessary export documents and declarations for smooth customs clearance. Whether you're importing into India, the Middle East, or Southeast Asia, we ensure compliance with destination-country regulations to avoid delays, penalties, or extra duties.",
      step: 5,
    },
    {
      icon: Truck,
      title: "Final Delivery",
      description: "Your goods are dispatched using the most efficient logistics solution-air or sea-based on your timeline and budget. We provide full tracking visibility, coordinated handoffs, and active support until the goods reach your doorstep or distribution center.",
      step: 6,
    },
  ];

  const contentRefs = processSteps.map(() => useRef<HTMLDivElement>(null));

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observers = contentRefs.map((ref, index) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(index + 1);
          }
        });
      }, observerOptions);

      if (ref.current) {
        observer.observe(ref.current);
      }
      return observer;
    });

    return () => {
      observers.forEach((observer, index) => {
        if (contentRefs[index].current) {
          observer.unobserve(contentRefs[index].current as Element);
        }
      });
    };
  }, []);


  return (
    <section id="how-it-works" className="bg-background py-12 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-6xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-4 drop-shadow-sm">
              How It <span className="text-secondary">Works</span>
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full shadow-sm mb-6"></div>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our streamlined six-step process ensures a seamless and transparent sourcing experience from factory to your doorstep.
            </p>
          </motion.div>

          {/* Sticky Numbered List Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-16">
            {/* Left Column: Sticky Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {processSteps.map((step) => (
                  <motion.div
                    key={step.step}
                    variants={itemVariants}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${activeStep === step.step ? 'bg-secondary text-background scale-105' : 'bg-transparent'}`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold transition-all duration-300 ${activeStep === step.step ? 'bg-background text-primary' : 'bg-muted text-muted-foreground'}`}>
                      {step.step}
                    </div>
                    <h3 className={`text-lg font-semibold transition-colors duration-300 ${activeStep === step.step ? 'text-background' : 'text-primary'}`}>
                      {step.title}
                    </h3>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Column: Scrolling Content */}
            <div className="lg:col-span-2 space-y-12">
              {processSteps.map((step, index) => (
                <div key={step.step} ref={contentRefs[index]} className="min-h-[60vh] flex items-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    className="w-full bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-border/10"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <step.icon className="h-7 w-7 text-secondary" />
                      </div>
                      <h3 className="text-2xl font-bold text-secondary">{step.title}</h3>
                    </div>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Layout: Simple Vertical Timeline */}
          <div className="lg:hidden space-y-8">
            {processSteps.map((step) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="bg-card/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-border/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold bg-accent/10 text-accent">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary">{step.title}</h3>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 flex-shrink-0 flex justify-center">
                    <step.icon className="h-6 w-6 text-secondary/70 mt-1" />
                  </div>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </section>
  )
}