"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface GalleryImage {
    src: string;
    alt: string;
    category: string;
}

interface GalleryData {
    galleryImages: GalleryImage[];
}

const defaultData: GalleryData = {
    galleryImages: [
        { src: "/gallery-1.jpg", alt: "Annual Sports Day", category: "Events" },
        { src: "/gallery-2.jpg", alt: "Science Exhibition", category: "Academics" }
    ]
};

const categories = ["All", "Campus", "Academics", "Sports", "Events"];

export default function GalleryPreviewPage() {
    const [data, setData] = useState<GalleryData>(defaultData);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "GALLERY_PREVIEW_UPDATE" && event.data.data) {
                const received = event.data.data;
                setData({
                    galleryImages: received.galleryImages || defaultData.galleryImages
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_GALLERY_DATA" }, "*");

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

    const filteredImages = filter === "All"
        ? data.galleryImages
        : data.galleryImages.filter(img => img.category === filter);

    return (
        <main className="min-h-screen bg-white">
            {/* Hero Banner */}
            <section className="pt-20 pb-16 bg-gradient-to-br from-[#c62828] via-[#d32f2f] to-[#b71c1c] relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white/20" />
                    <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/20" />
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                        Gallery
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto md:mx-0">
                        Glimpses of life at our school.
                    </p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${filter === cat
                                        ? "bg-[#C4A35A] text-white shadow-lg scale-105"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence>
                            {filteredImages.map((image, index) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                    key={index} // Note: Using index as key is not ideal for reordering, but fine for simple filter
                                    className="group relative h-72 rounded-xl overflow-hidden shadow-md cursor-pointer"
                                >
                                    {image.src ? (
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-gray-200 text-gray-400">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <div>
                                            <span className="text-[#C4A35A] text-sm font-medium mb-1 block">{image.category}</span>
                                            <h3 className="text-white font-semibold">{image.alt}</h3>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
