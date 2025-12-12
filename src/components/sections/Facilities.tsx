"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const facilities = [
    {
        id: 1,
        title: "Spacious Playground",
        description: "Large playground with modern equipment for outdoor games, physical education, and recreational activities.",
        gradient: "from-[#43a047] to-[#66bb6a]",
        icon: (
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
        ),
        features: ["Running Track", "Basketball Court", "Football Field", "Play Equipment"],
    },
    {
        id: 2,
        title: "Sports Complex",
        description: "Indoor sports facilities including badminton, table tennis, yoga room, and gymnasium for all-weather activities.",
        gradient: "from-[#1e88e5] to-[#42a5f5]",
        icon: (
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        ),
        features: ["Indoor Courts", "Gymnasium", "Yoga Hall", "Swimming Pool"],
    },
    {
        id: 3,
        title: "Modern Classrooms",
        description: "Air-conditioned smart classrooms with digital boards, projectors, and comfortable seating for optimal learning.",
        gradient: "from-[#7b1fa2] to-[#ab47bc]",
        icon: (
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
            </svg>
        ),
        features: ["Smart Boards", "AC Rooms", "Library Corner", "Science Labs"],
    },
    {
        id: 4,
        title: "Computer Lab",
        description: "State-of-the-art computer laboratory with latest systems, high-speed internet, and coding programs.",
        gradient: "from-[#f4511e] to-[#ff7043]",
        icon: (
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
            </svg>
        ),
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
            {/* Gradient Header with Icon */}
            <div className={`relative h-52 bg-gradient-to-br ${facility.gradient} flex items-center justify-center overflow-hidden`}>
                {/* Decorative circles */}
                <div className="absolute top-6 right-6 w-20 h-20 rounded-full bg-white/15" />
                <div className="absolute bottom-8 left-8 w-12 h-12 rounded-full bg-white/15" />

                {/* Icon Container */}
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative z-10 w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                >
                    {facility.icon}
                </motion.div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
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
                    className="mt-16 bg-gradient-to-r from-[#C4A35A] to-[#A38842] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/20 translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                    </svg>
                                </div>
                                <h3
                                    className="text-2xl md:text-3xl font-semibold"
                                    style={{ fontFamily: "var(--font-playfair)" }}
                                >
                                    Safe & Spacious Playground
                                </h3>
                            </div>
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
                                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
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

                        {/* Sports Icons */}
                        <div className="flex gap-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                            >
                                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <circle cx="12" cy="12" r="10" opacity="0.3" />
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.74c.08.33.15.66.19 1H13v-1zm0 9.93V19h2.87c-.87.48-1.84.8-2.87.93zM18.24 17H13v-1h5.92c-.2.35-.43.69-.68 1zm1.5-3H13v-1h6.93c-.04.34-.11.67-.19 1z" />
                                </svg>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                            >
                                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM5.23 7.75C6.1 8.62 7.23 9 8.5 9c.53 0 1.04-.07 1.5-.2v6.4c-.46-.13-.97-.2-1.5-.2-1.27 0-2.4.38-3.27 1.25.17-1.05.27-2.13.27-3.25s-.1-2.2-.27-3.25zM12 20c-1.12 0-2.2-.1-3.25-.27.87-.87 1.25-2 1.25-3.27 0-.53-.07-1.04-.2-1.5h6.4c-.13.46-.2.97-.2 1.5 0 1.27.38 2.4 1.25 3.27-1.05.17-2.13.27-3.25.27zm6.77-3.75c-.87-.87-2-1.25-3.27-1.25-.53 0-1.04.07-1.5.2V8.8c.46.13.97.2 1.5.2 1.27 0 2.4-.38 3.27-1.25-.17 1.05-.27 2.13-.27 3.25s.1 2.2.27 3.25z" />
                                </svg>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                            >
                                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" />
                                </svg>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
