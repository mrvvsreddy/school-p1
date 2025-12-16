"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Define interfaces to match database structure
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
        { name: "Contact", href: "/contact", visible: true },
    ]
};

export default function Header() {
    const [data, setData] = useState<HeaderData>(defaultData);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Fetch header data from database
    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/pages/shared`);
                const json = await res.json();
                const headerData = json.header || {};

                if (headerData && Object.keys(headerData).length > 0) {
                    setData({
                        logo: {
                            image: headerData.logo?.image || defaultData.logo.image,
                            text: headerData.logo?.text || defaultData.logo.text,
                            subtext: headerData.logo?.subtext || defaultData.logo.subtext
                        },
                        navLinks: headerData.navLinks || defaultData.navLinks
                    });
                }
            } catch (error) {
                console.error("Failed to load header data:", error);
            }
        };
        fetchHeaderData();
    }, []);

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Filter visible nav links
    const visibleNavLinks = data.navLinks.filter(link => link.visible !== false);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
                : "bg-transparent py-5"
                }`}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                {/* Left Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {visibleNavLinks.slice(0, 3).map((link, index) => (
                        <motion.div
                            key={link.name}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link
                                href={link.href}
                                className={`nav-link ${isScrolled ? "!text-[#333]" : "text-white"
                                    } hover:text-[#C4A35A] transition-colors`}
                            >
                                {link.name}
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                {/* Logo */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex items-center justify-center"
                >
                    <Link href="/" className="flex flex-col items-center">
                        {data.logo.image ? (
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={data.logo.image} alt="School Logo" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div
                                className={`relative w-16 h-16 rounded-full border-2 ${isScrolled ? "border-[#333]" : "border-white"
                                    } flex items-center justify-center`}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span
                                        className={`text-2xl font-bold ${isScrolled ? "text-[#333]" : "text-white"
                                            }`}
                                        style={{ fontFamily: "var(--font-playfair)" }}
                                    >
                                        {data.logo.text.charAt(0)}
                                    </span>
                                </div>
                            </div>
                        )}
                        <span
                            className={`mt-1 text-xs font-semibold tracking-widest ${isScrolled ? "text-[#333]" : "text-white"
                                }`}
                        >
                            {data.logo.text}
                        </span>
                        <span
                            className={`text-[8px] tracking-[0.2em] ${isScrolled ? "text-[#666]" : "text-white/80"
                                }`}
                        >
                            {data.logo.subtext}
                        </span>
                    </Link>
                </motion.div>

                {/* Right Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                    {visibleNavLinks.slice(3).map((link, index) => (
                        <motion.div
                            key={link.name}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: (index + 3) * 0.1 }}
                            className="relative"
                        >
                            <Link
                                href={link.href}
                                className={`nav-link flex items-center gap-1 ${isScrolled ? "!text-[#333]" : "text-white"
                                    } hover:text-[#C4A35A] transition-colors`}
                            >
                                {link.name}
                            </Link>
                        </motion.div>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className={`lg:hidden p-2 ${isScrolled ? "text-[#333]" : "text-white"}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white shadow-lg"
                    >
                        <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
                            {visibleNavLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[#333] py-2 hover:text-[#C4A35A] transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
