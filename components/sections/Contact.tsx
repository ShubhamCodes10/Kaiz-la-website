"use client"

import { motion, type Variants } from "framer-motion"
import { Mail, Phone, MapPin, Send } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
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

export default function Contact() {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      details: "hello@kaizla.com",
      description: "For inquiries and support.",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+86 138 0013 8000",
      description: "Mon-Fri, 8am - 6pm CST.",
    },
    {
      icon: MapPin,
      title: "Our Headquarters",
      description: "Visit us by appointment.",
    },
  ]

  return (
    <section id="contact" className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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
              Get In <span className="text-secondary">Touch</span>
            </h2>
            <div className="w-20 h-1 bg-accent mx-auto rounded-full shadow-sm mb-6"></div>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Ready to streamline your sourcing? Let's discuss how we can help transform your supply chain.
            </p>
          </motion.div>

          {/* Unified Contact Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-card/50 backdrop-blur-md border border-border/10 rounded-2xl p-8 lg:p-12 shadow-xl"
          >
            {/* Left Side: Contact Information */}
            <div className="lg:col-span-5">
              <h3 className="text-3xl font-bold text-primary mb-6">Contact Information</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We're here to help. Reach out through any channel, and our team will get back to you within 24 hours.
              </p>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-primary">{info.title}</h4>
                      <p className="text-base text-secondary font-medium">{info.details}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="lg:col-span-7">
              <h3 className="text-3xl font-bold text-primary mb-6">Send Us a Message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                  <input type="text" placeholder="Last Name" className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <input type="email" placeholder="Your Business Email" className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                <input type="text" placeholder="Subject" className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent" />
                <textarea placeholder="Tell us about your sourcing needs..." rows={5} className="w-full bg-background/50 border border-border/20 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full inline-flex items-center justify-center bg-secondary text-background px-6 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl group"
                >
                  Send Message
                  <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
