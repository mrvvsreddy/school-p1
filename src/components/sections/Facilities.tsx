"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const facilities = [
    {
        id: 1,
        title: "Spacious Playground",
        description: "Large playground with modern equipment for outdoor games, physical education, and recreational activities.",
        image: "/facility-playground.jpg",
        features: ["Running Track", "Basketball Court", "Football Field", "Play Equipment"],
    },
    {
        id: 2,
        title: "Sports Complex",
        description: "Indoor sports facilities including badminton, table tennis, yoga room, and gymnasium for all-weather activities.",
        image: "/facility-sports.jpg",
        features: ["Indoor Courts", "Gymnasium", "Yoga Hall", "Swimming Pool"],
    },
    {
        id: 3,
        title: "Modern Classrooms",
        description: "Air-conditioned smart classrooms with digital boards, projectors, and comfortable seating for optimal learning.",
        image: "/facility-classroom.jpg",
        features: ["Smart Boards", "AC Rooms", "Library Corner", "Science Labs"],
    },
    {
        id: 4,
        title: "Computer Lab",
        description: "State-of-the-art computer laboratory with latest systems, high-speed internet, and coding programs.",
        image: "/facility-computer.jpg",
        features: ["Latest Systems", "High-Speed Internet", "Coding Classes", "Digital Learning"],
    },
];

const FacilityCard = ({ facility, index }: { facility: typeof facilities[0]; index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
        >
            {/* Image Header */}
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={facility.image}
                    alt={facility.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3
                        className="text-xl font-semibold text-white"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        {facility.title}
                    </h3>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <p className="text-[#666] text-sm leading-relaxed mb-4">
                    {facility.description}
                </p>

                {/* Features Tags */}
                <div className="flex flex-wrap gap-2">
                    {facility.features.map((feature) => (
                        <span
                            key={feature}
                            className="px-3 py-1 bg-[#C4A35A]/10 text-[#C4A35A] text-xs font-medium rounded-full border border-[#C4A35A]/20"
                        >
                            {feature}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default function Facilities() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="facilities" className="py-24 bg-white" ref={ref}>
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        className="inline-block px-4 py-2 bg-[#C4A35A]/10 text-[#C4A35A] rounded-full text-sm font-medium mb-4"
                    >
                        World-Class Infrastructure
                    </motion.span>
                    <h2
                        className="text-3xl md:text-4xl font-semibold text-[#333] mb-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Our Facilities
                    </h2>
                    <p className="text-[#666] max-w-2xl mx-auto">
                        State-of-the-art infrastructure designed to provide the best learning environment for our students.
                    </p>
                </motion.div>

                {/* Facilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {facilities.map((facility, index) => (
                        <FacilityCard key={facility.id} facility={facility} index={index} />
                    ))}
                </div>

                {/* Highlighted Feature - Playground */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-16 rounded-3xl overflow-hidden relative"
                >
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src="/facility-playground.jpg"
                            alt="Playground"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#C4A35A]/95 to-[#A38842]/90" />
                    </div>

                    <div className="relative z-10 p-8 md:p-12 text-white">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-1">
                                <h3
                                    className="text-2xl md:text-3xl font-semibold mb-4"
                                    style={{ fontFamily: "var(--font-playfair)" }}
                                >
                                    Safe & Spacious Playground
                                </h3>
                                <p className="text-white/90 mb-6 text-base">
                                    Our 2-acre playground provides ample space for children to run, play, and explore.
                                    Equipped with modern safety surfaces and age-appropriate equipment, it&apos;s where
                                    memories and friendships are made.
                                </p>
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium">2 Acres Area</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium">Safety Certified</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium">Morning PT Sessions</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/facilities"
                                className="bg-white text-[#C4A35A] px-8 py-3 rounded-full font-semibold hover:bg-[#FAF8F5] transition-colors"
                            >
                                View All Facilities
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
