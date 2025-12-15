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

    const scrollToContent = () => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: "smooth" });
        }
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
        <section id="home" className="relative h-screen min-h-[700px] overflow-hidden bg-[#1a1a1a]">
            {/* All Background Media - Stacked with opacity transitions */}
            {slides.map((slide, index) => (
                <motion.div
                    key={slide.id}
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                        opacity: index === currentSlide ? 1 : 0,
                        scale: index === currentSlide ? 1 : 1.05,
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    style={{ zIndex: index === currentSlide ? 1 : 0 }}
                >
                    {slide.mediaType === 'video' ? (
                        <video
                            src={slide.image}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                            sizes="100vw"
                        />
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
                </motion.div>
            ))}

            {/* Content */}
            <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
                <div className="max-w-4xl">
                    <motion.h1
                        key={`title-${currentSlide}`}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        {slides[currentSlide].title}
                    </motion.h1>

                    <motion.p
                        key={`subtitle-${currentSlide}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-white/90 text-base md:text-lg max-w-2xl mx-auto mb-10"
                    >
                        {slides[currentSlide].subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/admissions/apply" className="btn-primary">Admissions Open</Link>
                    </motion.div>
                </div>
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to slide ${index + 1}`}
                        className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${index === currentSlide
                            ? "bg-[#C4A35A] w-8"
                            : "bg-white/50 hover:bg-white/70 w-3"
                            }`}
                    />
                ))}
            </div>

            {/* Scroll Down Button */}
            <motion.button
                onClick={scrollToContent}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                aria-label="Scroll to content"
            >
                <svg
                    className="w-6 h-6 text-white/80 hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                </svg>
            </motion.button>

            {/* Slide Counter */}
            <div className="absolute bottom-6 right-6 z-20 text-white/60 text-sm font-medium">
                <span className="text-white">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="mx-1">/</span>
                <span>{String(slides.length).padStart(2, '0')}</span>
            </div>
        </section>
    );
}
