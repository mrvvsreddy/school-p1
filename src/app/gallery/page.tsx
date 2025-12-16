"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";

interface GalleryImage {
    src: string;
    alt: string;
    category: string;
}

export default function GalleryPage() {
    const [images, setImages] = React.useState<GalleryImage[]>([]);

    React.useEffect(() => {
        const fetchImages = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/pages/gallery`);
                const json = await res.json();

                // Handle both data structures:
                // 1. json.gallery (from editor which saves as { gallery: { galleryImages: [...] } })
                // 2. json.images.list (legacy structure)
                const galleryData = json.gallery || json;
                const images = galleryData.galleryImages || galleryData.images?.list || [];
                setImages(images);
            } catch (error) {
                console.error("Failed to load gallery:", error);
            }
        };
        fetchImages();
    }, []);

    if (images.length === 0) return <div className="min-h-screen pt-32 text-center">Loading...</div>;

    return (
        <main className="min-h-screen">
            <Header />

            {/* Hero Banner */}
            <section className="pt-32 pb-16 bg-gradient-to-br from-[#ff6f00] via-[#ff8f00] to-[#ffa000] relative overflow-hidden">
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
                        Photo Gallery
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-lg max-w-2xl"
                    >
                        Glimpses of life at Balayeasu School.
                    </motion.p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {images.map((image, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative h-64 rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                    <span className="text-xs bg-[#C4A35A] text-white px-2 py-1 rounded">{image.category}</span>
                                    <h3 className="text-white font-medium mt-2">{image.alt}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
