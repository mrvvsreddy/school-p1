"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface FooterLink {
    name: string;
    href: string;
}

interface FooterData {
    logo: {
        image: string;
        text: string;
        subtext: string;
    };
    links: {
        quickLinks: FooterLink[];
        academics: FooterLink[];
        resources: FooterLink[];
    };
    contact: {
        phone: string;
        email: string;
        address: string;
    };
    socialLinks: FooterLink[];
}

const defaultData: FooterData = {
    logo: {
        image: "",
        text: "BALAYEASU",
        subtext: "SCHOOL"
    },
    links: {
        quickLinks: [
            { name: "About Us", href: "/about" },
            { name: "Admissions", href: "/admissions" },
            { name: "Contact", href: "/contact" }
        ],
        academics: [
            { name: "Curriculum", href: "/academics" },
            { name: "Classes", href: "/classes" },
            { name: "Faculty", href: "/faculty" }
        ],
        resources: [
            { name: "Gallery", href: "/gallery" },
            { name: "Events", href: "/events" },
            { name: "Downloads", href: "/downloads" }
        ]
    },
    contact: {
        phone: "+91 98765 43210",
        email: "info@school.edu",
        address: "123 Education Lane, City, State 123456"
    },
    socialLinks: [
        { name: "Facebook", href: "#" },
        { name: "Twitter", href: "#" },
        { name: "Instagram", href: "#" }
    ]
};

const socialIcons: Record<string, React.ReactNode> = {
    "facebook": (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    "twitter": (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
    ),
    "instagram": (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    ),
    "youtube": (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
};

export default function FooterPreviewPage() {
    const [data, setData] = useState<FooterData>(defaultData);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "FOOTER_PREVIEW_UPDATE" && event.data.data) {
                const received = event.data.data;
                setData({
                    logo: {
                        image: received.logo?.image || defaultData.logo.image,
                        text: received.logo?.text || defaultData.logo.text,
                        subtext: received.logo?.subtext || defaultData.logo.subtext
                    },
                    links: {
                        quickLinks: received.links?.quickLinks || defaultData.links.quickLinks,
                        academics: received.links?.academics || defaultData.links.academics,
                        resources: received.links?.resources || defaultData.links.resources
                    },
                    contact: {
                        phone: received.contact?.phone || defaultData.contact.phone,
                        email: received.contact?.email || defaultData.contact.email,
                        address: received.contact?.address || defaultData.contact.address
                    },
                    socialLinks: received.socialLinks || defaultData.socialLinks
                });
            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_FOOTER_DATA" }, "*");

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
            {/* Contact Info Banner - Same as Footer.tsx */}
            <section className="bg-[#C4A35A]">
                <div className="container mx-auto px-6 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-white/80 text-xs">Call Us</div>
                                <div className="font-semibold text-white text-sm">{data.contact?.phone || defaultData.contact.phone}</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-white/80 text-xs">Email Us</div>
                                <div className="font-semibold text-white text-sm">{data.contact?.email || defaultData.contact.email}</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center md:justify-end gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <div className="text-white/80 text-xs">Visit Us</div>
                                <div className="font-semibold text-white text-sm">{data.contact?.address || defaultData.contact.address}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Preview - Dark section like Footer.tsx */}
            <section className="bg-[#1A1A1A] py-8">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Logo & Social Links */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex items-center gap-3 mb-4">
                                {data.logo?.image ? (
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C4A35A]">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={data.logo.image} alt="Logo" className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 rounded-full border-2 border-[#C4A35A] flex items-center justify-center">
                                        <span className="text-lg font-bold text-[#C4A35A]">{(data.logo?.text || "B").charAt(0)}</span>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-sm font-semibold text-white">{data.logo?.text || defaultData.logo.text}</h3>
                                    <p className="text-[8px] text-[#888] tracking-widest">{data.logo?.subtext || defaultData.logo.subtext}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                {data.socialLinks.map((social, i) => (
                                    <div key={i} className="w-8 h-8 rounded-full bg-[#333] flex items-center justify-center hover:bg-[#C4A35A] text-white text-xs cursor-pointer transition-colors">
                                        {socialIcons[social.name.toLowerCase()] || social.name[0]}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick Links */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
                            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                {data.links.quickLinks.map((link, i) => (
                                    <li key={i}>
                                        <span className="text-[#888] hover:text-[#C4A35A] text-xs cursor-pointer transition-colors">
                                            {link.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Academics */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                            <h4 className="text-sm font-semibold text-white mb-4">Academics</h4>
                            <ul className="space-y-2">
                                {data.links.academics.map((link, i) => (
                                    <li key={i}>
                                        <span className="text-[#888] hover:text-[#C4A35A] text-xs cursor-pointer transition-colors">
                                            {link.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Resources */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
                            <ul className="space-y-2">
                                {data.links.resources.map((link, i) => (
                                    <li key={i}>
                                        <span className="text-[#888] hover:text-[#C4A35A] text-xs cursor-pointer transition-colors">
                                            {link.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Copyright */}
                    <div className="border-t border-[#333] mt-6 pt-4">
                        <p className="text-[#666] text-xs text-center">
                            © {new Date().getFullYear()} Balayeasu School. All rights reserved.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
