"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";


interface Facility {
    title: string;
    description: string;
    image: string;
    features?: string[];
}

const FacilityCard = ({ facility, index }: { facility: Facility; index: number }) => (
    <motion.div
        key={facility.title}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
    >
        <div className={index % 2 === 1 ? 'md:order-2' : ''}>
            <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                <Image
                    src={facility.image}
                    alt={facility.title}
                    fill
                    className="object-cover"
                />
            </div>
        </div>
        <div className={index % 2 === 1 ? 'md:order-1' : ''}>
            <h3 className="text-2xl md:text-3xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                {facility.title}
            </h3>
            <p className="text-[#666] mb-6">{facility.description}</p>
            <div className="flex flex-wrap gap-2">
                {facility.features && facility.features.map((feature: string) => (
                    <span key={feature} className="px-4 py-2 bg-[#C4A35A]/10 text-[#C4A35A] rounded-full text-sm font-medium">
                        {feature}
                    </span>
                ))}
            </div>
        </div>
    </motion.div>
);

interface AdditionalFacility {
    name: string;
    icon: string;
}

interface FacilityResponse {
    main_list?: { list: Facility[] };
    additional?: { list: AdditionalFacility[] };
}

export default function FacilitiesPage() {
    const [data, setData] = useState<FacilityResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/pages/facilities`);
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error("Failed to load facilities data:", error);
            }
        };
        fetchData();
    }, []);

    if (!data) return <div className="min-h-screen pt-32 text-center">Loading...</div>;

    const facilities = data.main_list?.list || [];
    const additionalFacilities = data.additional?.list || [];

    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero Banner */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-[#43a047] via-[#388e3c] to-[#2e7d32] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/20" />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Our Facilities
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl"
                    >
                        World-class infrastructure for holistic development.
                    </motion.p>
                </div>
            </section>

            {/* Facilities Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="space-y-16">
                        {facilities.map((facility, index) => (
                            <FacilityCard key={facility.title} facility={facility} index={index} />
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
                        {additionalFacilities.map((item) => (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow"
                            >
                                <span className="text-4xl mb-3 block">{item.icon}</span>
                                <h3 className="font-semibold text-[#333]">{item.name}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
