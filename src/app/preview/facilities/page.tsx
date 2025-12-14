"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Facility {
    title: string;
    description: string;
    image: string;
    features: string[];
}

interface AdditionalFacility {
    name: string;
    icon: string;
}

interface FacilitiesData {
    facilities: Facility[];
    additional: AdditionalFacility[];
}

const defaultData: FacilitiesData = {
    facilities: [
        {
            title: "Spacious Playground",
            description: "Our 2-acre playground provides ample space for outdoor games.",
            image: "/facility-playground.jpg",
            features: ["2 Acre Area", "Running Track"]
        }
    ],
    additional: [
        { name: "Library", icon: "📚" }
    ]
};

export default function FacilitiesPreviewPage() {
    const [data, setData] = useState<FacilitiesData>(defaultData);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "FACILITIES_PREVIEW_UPDATE" && event.data.data) {
                const received = event.data.data;
                setData({
                    facilities: received.facilities || defaultData.facilities,
                    additional: received.additional || defaultData.additional
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_FACILITIES_DATA" }, "*");

        // Report height update
        const heightUpdateInterval = setInterval(() => {
            if (document.body) {
                window.parent.postMessage({
                    type: "PREVIEW_HEIGHT_UPDATE",
                    height: document.body.scrollHeight
                }, "*");
            }
        }, 500);

        return () => {
            window.removeEventListener("message", handleMessage);
            clearInterval(heightUpdateInterval);
        };
    }, []);

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Banner */}
            <section className="pt-20 pb-16 bg-gradient-to-br from-[#43a047] via-[#388e3c] to-[#2e7d32] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/20" />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                        Our Facilities
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto md:mx-0">
                        World-class infrastructure for holistic development.
                    </p>
                </div>
            </section>

            {/* Facilities Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="space-y-16">
                        {data.facilities.map((facility, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                                    <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                                        {facility.image ? (
                                            <Image
                                                src={facility.image}
                                                alt={facility.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                        )}
                                    </div>
                                </div>
                                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                                    <h3 className="text-2xl md:text-3xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                                        {facility.title}
                                    </h3>
                                    <p className="text-[#666] mb-6">{facility.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {facility.features.map((feature, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-[#C4A35A]/10 text-[#C4A35A] rounded-full text-sm font-medium">
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Facilities */}
            <section className="py-20 bg-[#FAF8F5]">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#333] text-center mb-12" style={{ fontFamily: "var(--font-playfair)" }}>
                        Additional Facilities
                    </h2>
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {data.additional.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-xl p-6 text-center shadow-md"
                            >
                                <span className="text-4xl mb-3 block">{item.icon}</span>
                                <h3 className="font-semibold text-[#333]">{item.name}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
