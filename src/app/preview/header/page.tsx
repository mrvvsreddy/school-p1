"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface NavLink {
    name: string;
    href: string;
    visible?: boolean;
}

interface HeaderData {
    logo: {
        image: string;
        text: string;
        subtext: string;
    };
    navLinks: NavLink[];
}

const defaultData: HeaderData = {
    logo: {
        image: "",
        text: "BALAYEASU",
        subtext: "SCHOOL"
    },
    navLinks: [
        { name: "About", href: "/about", visible: true },
        { name: "Academics", href: "/academics", visible: true },
        { name: "Facilities", href: "/facilities", visible: true },
        { name: "Activities", href: "/activities", visible: true },
        { name: "Admissions", href: "/admissions", visible: true },
        { name: "Contact", href: "/contact", visible: true }
    ]
};

export default function HeaderPreviewPage() {
    const [data, setData] = useState<HeaderData>(defaultData);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "HEADER_PREVIEW_UPDATE" && event.data.data) {
                const received = event.data.data;
                setData({
                    logo: {
                        image: received.logo?.image || defaultData.logo.image,
                        text: received.logo?.text || defaultData.logo.text,
                        subtext: received.logo?.subtext || defaultData.logo.subtext
                    },
                    navLinks: received.navLinks || defaultData.navLinks
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_HEADER_DATA" }, "*");

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

    // Filter visible nav links
    const visibleNavLinks = data.navLinks.filter(link => link.visible !== false);

    return (
        <main className="min-h-screen bg-white">
            {/* Header - Always show desktop style */}
            <header className="bg-gradient-to-br from-[#1976d2] via-[#1e88e5] to-[#2196f3] py-4">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* Left Navigation */}
                        <nav className="flex items-center gap-4">
                            {visibleNavLinks.slice(0, 3).map((link) => (
                                <span
                                    key={link.name}
                                    className="text-white text-sm font-medium hover:text-white/80 cursor-pointer transition-colors"
                                >
                                    {link.name}
                                </span>
                            ))}
                        </nav>

                        {/* Logo */}
                        <div className="flex flex-col items-center cursor-pointer">
                            {data.logo.image ? (
                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                    <Image src={data.logo.image} alt="Logo" fill className="object-contain" />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                                        {data.logo.text.charAt(0)}
                                    </span>
                                </div>
                            )}
                            <span className="mt-1 text-[10px] font-semibold tracking-widest text-white">
                                {data.logo.text}
                            </span>
                            <span className="text-[8px] tracking-[0.15em] text-white/80">
                                {data.logo.subtext}
                            </span>
                        </div>

                        {/* Right Navigation */}
                        <nav className="flex items-center gap-4">
                            {visibleNavLinks.slice(3).map((link) => (
                                <span
                                    key={link.name}
                                    className="text-white text-sm font-medium hover:text-white/80 cursor-pointer transition-colors"
                                >
                                    {link.name}
                                </span>
                            ))}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Hero Content */}
            <section className="bg-gradient-to-br from-[#1976d2] via-[#1e88e5] to-[#2196f3] pb-12 pt-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/20" />
                    <div className="absolute bottom-5 left-5 w-48 h-48 rounded-full bg-white/20" />
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold text-white mb-2"
                        style={{ fontFamily: "var(--font-playfair)" }}
                    >
                        Sample Page Title
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white/80 text-sm"
                    >
                        This is how your header will appear on pages.
                    </motion.p>
                </div>
            </section>

            {/* Navigation Info */}
            <section className="py-6 bg-[#FAF8F5]">
                <div className="container mx-auto px-4">
                    <h3 className="text-lg font-semibold text-[#333] mb-4">Navigation Links</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.navLinks.map((link, i) => (
                            <div
                                key={i}
                                className={`px-3 py-1.5 border rounded-full text-sm flex items-center gap-2 ${link.visible !== false
                                    ? 'bg-white border-gray-200 text-[#333]'
                                    : 'bg-gray-100 border-gray-300 text-gray-400 line-through'
                                    }`}
                            >
                                <span>{link.name}</span>
                                <span className="text-xs text-gray-400">{link.href}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Logo Info */}
            <section className="py-6 bg-white border-t">
                <div className="container mx-auto px-4">
                    <h3 className="text-lg font-semibold text-[#333] mb-4">Logo Settings</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Logo Image</p>
                            {data.logo.image ? (
                                <div className="w-16 h-16 border rounded bg-gray-100 relative">
                                    <Image src={data.logo.image} alt="Logo" fill className="object-contain" />
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No image</p>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Logo Text</p>
                            <p className="text-lg font-semibold text-[#333]">{data.logo.text}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Subtext</p>
                            <p className="text-lg font-semibold text-[#333]">{data.logo.subtext}</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
