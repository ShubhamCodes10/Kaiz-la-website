"use client";

import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const testimonials = [
    { id: 1, name: "Priya Patel", content: "Their sourcing expertise is simply unparalleled. They streamlined our entire supply chain, delivering quality products ahead of schedule.", rating: 5, },
    { id: 2, name: "Rohan Sharma", content: "The attention to detail is remarkable. From vetting suppliers to final logistics, every step was handled with absolute precision.", rating: 5, },
    { id: 3, name: "Anjali Mehta", content: "A true game-changer for our expansion efforts. Their deep market understanding helped us navigate complex trade routes with ease.", rating: 5, },
    { id: 4, name: "Vikram Singh", content: "The level of transparency is fantastic. Real-time tracking and clear communication gave us complete control over our inventory.", rating: 5, },
    { id: 5, name: "Isha Reddy", content: "They made international trade compliance feel effortless. The documentation and customs support saved us countless hours.", rating: 5, },
    { id: 6, name: "Arjun Desai", content: "Working with them felt like a true partnership. Their team is responsive, knowledgeable, and genuinely invested in our success.", rating: 5, },
    { id: 7, name: "Sneha Joshi", content: "Exceptional service from start to finish. They consistently secure competitive pricing without ever compromising on quality.", rating: 5, },
    { id: 8, name: "Karan Malhotra", content: "Their platform is intuitive and powerful. Managing our global sourcing has never been more efficient or straightforward.", rating: 5, },
    { id: 9, name: "Diya Kumar", content: "The quality assurance process is incredibly thorough. We trust them to deliver products that meet the highest standards every time.", rating: 5, },
    { id: 10, name: "Aditya Gupta", content: "They have fundamentally transformed our procurement strategy for the better. We consider them an indispensable part of our team.", rating: 5, }
];

export default function Testimonials() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [direction, setDirection] = useState(0);

    const nextTestimonial = useCallback(() => {
        setDirection(1);
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, []);

    const prevTestimonial = useCallback(() => {
        setDirection(-1);
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }, []);

    const handleDotClick = (index: number) => {
        setDirection(index > currentTestimonial ? 1 : -1);
        setCurrentTestimonial(index);
    };

    useEffect(() => {
        const timer = setInterval(nextTestimonial, 7000);
        return () => clearInterval(timer);
    }, [nextTestimonial]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipeThreshold = 10;
        if (info.offset.x > swipeThreshold) {
            prevTestimonial();
        } else if (info.offset.x < -swipeThreshold) {
            nextTestimonial();
        }
    };

    const getVisibleTestimonials = () => {
        const visible = [];
        const len = testimonials.length;
        for (let i = -1; i <= 1; i++) {
            const index = (currentTestimonial + i + len) % len;
            visible.push({ ...testimonials[index], position: i });
        }
        return visible;
    };

    const renderStars = (rating: number, isActive: boolean) => (
        Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`h-5 w-5 transition-colors ${i < rating
                    ? (isActive ? "text-white fill-white" : "text-accent fill-accent")
                    : (isActive ? "text-white/30" : "text-muted/20")
                    }`}
            />
        ))
    );

    const sliderVariants = {
        enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0, }),
        center: { x: '0%', opacity: 1, zIndex: 1, },
        exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0, zIndex: 0, }),
    };

    return (
        <div className="bg-background text-foreground font-sans antialiased">
            <section className="py-16 lg:py-24 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12 lg:mb-16"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-3">
                            What Our <span className="text-secondary">Clients Say</span>
                        </h2>
                        <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full shadow-sm mb-4"></div>
                        <p className="text-lg text-muted max-w-3xl mx-auto">
                            Our commitment to excellence is reflected in the words of our clients.
                        </p>
                    </motion.div>

                    <div className="relative flex items-center justify-center">
                        <motion.button
                            onClick={prevTestimonial}
                            className="absolute left-0 z-20 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm shadow-lg border border-border/20 text-primary hover:bg-secondary hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 hidden md:flex items-center justify-center"
                            aria-label="Previous testimonial"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </motion.button>

                        <div className="relative w-full max-w-sm md:max-w-6xl h-[28rem] sm:h-[26rem] md:h-[24rem] overflow-hidden">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentTestimonial}
                                    variants={sliderVariants}
                                    custom={direction}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    onDragEnd={handleDragEnd}
                                    className="absolute w-full h-full cursor-grab active:cursor-grabbing"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 h-full">
                                        {getVisibleTestimonials().map((testimonial) => {
                                            const isActive = testimonial.position === 0;
                                            return (
                                                <div
                                                    key={testimonial.id}
                                                    className={`
                            relative rounded-2xl p-6 sm:p-8 flex flex-col transition-all duration-500 ease-in-out h-full
                            ${isActive
                                                            ? 'bg-secondary text-white shadow-2xl'
                                                            : 'bg-card text-foreground shadow-lg'}
                            ${!isActive && 'hidden md:flex'}
                          `}
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <Quote className={`h-10 w-10 ${isActive ? 'text-white/30' : 'text-secondary/20'}`} />
                                                        <div className="flex">{renderStars(testimonial.rating, isActive)}</div>
                                                    </div>
                                                    <p className={`text-base leading-relaxed mb-6 flex-grow ${isActive ? 'text-white/90' : 'text-muted'}`}>
                                                        {testimonial.content}
                                                    </p>
                                                    <div className="mt-auto flex items-end justify-between">
                                                        <div className={`font-bold text-lg ${isActive ? 'text-white' : 'text-primary'}`}>
                                                            {testimonial.name}
                                                        </div>
                                                        <div className="text-sm font-bold">
                                                            {String(testimonial.id).padStart(2, '0')}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <motion.button
                            onClick={nextTestimonial}
                            className="absolute right-0 z-20 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm shadow-lg border border-border/20 text-primary hover:bg-secondary hover:text-white transition-all duration-300 hover:scale-110 active:scale-95 hidden md:flex items-center justify-center"
                            aria-label="Next testimonial"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </motion.button>

                        <div className="md:hidden absolute -bottom-12 flex w-full max-w-xs justify-between">
                            <button onClick={prevTestimonial} className="p-2 rounded-full bg-card shadow-md" aria-label="Previous testimonial"><ChevronLeft /></button>
                            <button onClick={nextTestimonial} className="p-2 rounded-full bg-card shadow-md" aria-label="Next testimonial"><ChevronRight /></button>
                        </div>
                    </div>

                    <div className="flex justify-center mt-16 lg:mt-10 gap-2.5">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out
                  ${index === currentTestimonial ? "bg-secondary scale-125 w-6" : "bg-muted/30 hover:bg-muted/60"}
                `}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}