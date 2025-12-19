"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { HeroSlide } from "@/data/types";

interface HeroProps {
    slides?: HeroSlide[];
}

export default function Hero({ slides }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        if (!slides || slides.length === 0) return;
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };



    useEffect(() => {
        if (!isAutoPlaying || !slides || slides.length === 0) return;

        const timer = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(timer);
    }, [isAutoPlaying, nextSlide, slides]);

    if (!slides || slides.length === 0) return null;

    return (
        <section id="home" className="relative h-[40dvh] min-h-[350px] md:h-[100dvh] w-full overflow-hidden bg-[#1a1a1a]">
            {slides.map((slide, index) => (
                <motion.div
                    key={slide.id}
                    className="absolute inset-0 h-full w-full"
                    initial={false}
                    animate={{
                        opacity: index === currentSlide ? 1 : 0,
                        zIndex: index === currentSlide ? 10 : 0
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    {/* Background Media */}
                    <motion.div
                        className="absolute inset-0 h-full w-full"
                        animate={{ scale: index === currentSlide ? 1 : 1.05 }}
                        transition={{ duration: 6, ease: "easeOut" }} // Slower, subtler zoom
                    >
                        {slide.mediaType === 'video' ? (
                            <div className="relative h-full w-full">
                                <video
                                    src={slide.image}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40" /> {/* Video specific overlay */}
                            </div>
                        ) : (
                            <div className="relative h-full w-full">
                                {slide.image ? (
                                    <Image
                                        src={slide.image}
                                        alt={slide.title}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                        sizes="100vw"
                                        quality={90}
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-neutral-900" />
                                )}
                                <div className="absolute inset-0 bg-black/30" /> {/* Image specific overlay */}
                            </div>
                        )}
                        {/* Global Gradient Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
                    </motion.div>

                    {/* Content Layer - Centered */}
                    <div className="relative z-10 h-full w-full flex items-center justify-center text-center px-4 sm:px-6">
                        <div className="max-w-5xl w-full flex flex-col items-center">
                            <motion.h1
                                key={`title-${index}`} // Re-trigger on slide change
                                initial={{ opacity: 0, y: 20 }}
                                animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-3 sm:mb-6 leading-tight drop-shadow-lg"
                                style={{ fontFamily: "var(--font-playfair)" }}
                            >
                                {slide.title}
                            </motion.h1>

                            <motion.p
                                key={`subtitle-${index}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="text-white/90 text-sm sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto mb-6 sm:mb-10 drop-shadow-md font-light tracking-wide"
                            >
                                {slide.subtitle}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={index === currentSlide ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.8, delay: 0.7 }}
                            >
                                <Link
                                    href="/admissions/apply"
                                    className="btn-primary inline-flex items-center justify-center px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-lg font-medium tracking-wide"
                                >
                                    Admissions Open
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            ))}

            {/* Slide Indicators */}
            <div className="absolute bottom-10 sm:bottom-12 left-0 right-0 z-20 flex justify-center gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide
                            ? "bg-[#C4A35A] w-8 sm:w-10"
                            : "bg-white/40 hover:bg-white/60 w-8 sm:w-10"
                            }`}
                    />
                ))}
            </div>


        </section>
    );
}
