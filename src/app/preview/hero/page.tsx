"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface HeroSlide {
    id: number;
    title: string;
    subtitle: string;
    image: string;
}

interface HeroButton {
    id: number;
    text: string;
    url: string;
    color: string;
    visible: boolean;
}

const defaultSlides: HeroSlide[] = [
    { id: 1, title: "Nurturing Young Minds", subtitle: "Providing quality education from Class 1 to 10.", image: "/hero-bg-1.jpg" },
];

const defaultButtons: HeroButton[] = [
    { id: 1, text: "Admissions Open", url: "/admissions/apply", color: "#C4A35A", visible: true }
];

export default function HeroPreviewPage() {
    const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
    const [buttons, setButtons] = useState<HeroButton[]>(defaultButtons);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "HERO_PREVIEW_UPDATE") {
                if (event.data.slides) setSlides(event.data.slides);
                if (event.data.buttons) setButtons(event.data.buttons);
                setCurrentSlide(0);
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_HERO_DATA" }, "*");
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % slides.length), 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const visibleButtons = buttons.filter(btn => btn.visible);

    return (
        <section className="relative h-screen min-h-[500px] overflow-hidden bg-[#1a1a1a]">
            {slides.map((slide, index) => (
                <motion.div
                    key={slide.id || index}
                    className="absolute inset-0"
                    initial={false}
                    animate={{ opacity: index === currentSlide ? 1 : 0, scale: index === currentSlide ? 1 : 1.05 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    style={{ zIndex: index === currentSlide ? 1 : 0 }}
                >
                    {slide.image ? (
                        <Image src={slide.image} alt={slide.title} fill className="object-cover" sizes="100vw" />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
                </motion.div>
            ))}

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
                        {slides[currentSlide]?.title || "Title"}
                    </motion.h1>

                    <motion.p
                        key={`subtitle-${currentSlide}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-white/90 text-base md:text-lg max-w-2xl mx-auto mb-10"
                    >
                        {slides[currentSlide]?.subtitle || "Subtitle"}
                    </motion.p>

                    {visibleButtons.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-wrap items-center justify-center gap-4"
                        >
                            {visibleButtons.map((btn) => (
                                <Link
                                    key={btn.id}
                                    href={btn.url || "#"}
                                    className="inline-block px-8 py-3 text-white font-semibold rounded hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: btn.color }}
                                >
                                    {btn.text}
                                </Link>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>

            {slides.length > 1 && (
                <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-3 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-[#C4A35A] w-8" : "bg-white/50 w-3"}`}
                        />
                    ))}
                </div>
            )}

            <div className="absolute bottom-4 right-4 z-20 text-white/60 text-sm font-medium">
                <span className="text-white">{String(currentSlide + 1).padStart(2, '0')}</span>
                <span className="mx-1">/</span>
                <span>{String(slides.length).padStart(2, '0')}</span>
            </div>
        </section>
    );
}
