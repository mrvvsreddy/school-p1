"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Activity {
    title: string;
    description: string;
    image: string;
    features: string[];
}

interface Event {
    name: string;
    month: string;
    desc: string;
    icon: string;
}

interface ActivitiesData {
    activities: Activity[];
    events: Event[];
}

const defaultData: ActivitiesData = {
    activities: [
        {
            title: "Arts & Culture",
            description: "Nurture creativity and artistic expression through our comprehensive arts program.",
            image: "/activity-arts.jpg",
            features: ["Music & Dance", "Art & Craft"]
        }
    ],
    events: [
        { name: "Annual Day", month: "December", desc: "Grand celebration with performances", icon: "🎉" }
    ]
};

export default function ActivitiesPreviewPage() {
    const [data, setData] = useState<ActivitiesData>(defaultData);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "ACTIVITIES_PREVIEW_UPDATE" && event.data.data) {
                const received = event.data.data;
                setData({
                    activities: received.activities || defaultData.activities,
                    events: received.events || defaultData.events
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_ACTIVITIES_DATA" }, "*");

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
                        Extracurricular Activities
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto md:mx-0">
                        Discover your passion beyond the classroom.
                    </p>
                </div>
            </section>

            {/* Activities Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="space-y-16">
                        {data.activities.map((activity, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                                    <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg bg-gray-100">
                                        {activity.image ? (
                                            <Image
                                                src={activity.image}
                                                alt={activity.title}
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
                                        {activity.title}
                                    </h3>
                                    <p className="text-[#666] mb-6">{activity.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {activity.features.map((feature, idx) => (
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

            {/* Annual Events */}
            <section className="py-20 bg-[#FAF8F5]">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#333] text-center mb-12" style={{ fontFamily: "var(--font-playfair)" }}>
                        Annual Events
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.events.map((event, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-xl p-6 text-center shadow-md"
                            >
                                <span className="text-4xl mb-3 block">{event.icon}</span>
                                <span className="text-xs font-medium bg-[#C4A35A]/10 text-[#C4A35A] px-3 py-1 rounded-full">{event.month}</span>
                                <h3 className="font-semibold text-[#333] mt-3 mb-2">{event.name}</h3>
                                <p className="text-[#666] text-sm">{event.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
