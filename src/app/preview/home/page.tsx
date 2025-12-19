"use client";

import React, { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";

// Types
interface HeroSlide { id: number; title: string; subtitle: string; image: string; }
interface HeroButton { id: number; text: string; url: string; color: string; visible: boolean; }
interface Stat { number: string; label: string; }
interface Facility { title: string; description: string; image: string; features?: string[]; }
interface PlaygroundData { title: string; description: string; features: { icon: string; text: string }[]; image: string; buttonText: string; buttonUrl: string; }

interface HomeData {
    hero: { slides: HeroSlide[]; buttons: HeroButton[] };
    welcome: { title: string; paragraphs: string[]; signatureImage: string; signatureText: string; stats: Stat[] };
    facilities: { list: Facility[] };
    playground: PlaygroundData;
}

const defaultData: HomeData = {
    hero: { slides: [{ id: 1, title: "Welcome", subtitle: "Description", image: "" }], buttons: [] },
    welcome: { title: "Welcome", paragraphs: [""], signatureImage: "", signatureText: "Principal", stats: [] },
    facilities: { list: [] },
    playground: { title: "Safe & Spacious Playground", description: "Our 2-acre playground provides ample space for children to run, play, and explore.", features: [{ icon: "check", text: "2 Acres Area" }, { icon: "shield", text: "Safety Certified" }, { icon: "clock", text: "Morning PT Sessions" }], image: "/facility-playground.jpg", buttonText: "View All Facilities", buttonUrl: "/facilities" }
};

export default function HomePreviewPage() {
    const [data, setData] = useState<HomeData>(defaultData);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "HOME_PREVIEW_UPDATE" && event.data.data) {
                setData(prev => ({ ...prev, ...event.data.data }));

            }
        };
        window.addEventListener("message", handleMessage);
        window.parent.postMessage({ type: "REQUEST_HOME_DATA" }, "*");

        // Report height changes
        const resizeObserver = new ResizeObserver(() => {
            window.parent.postMessage({
                type: "PREVIEW_HEIGHT_UPDATE",
                height: document.documentElement.scrollHeight
            }, "*");
        });
        resizeObserver.observe(document.body);

        return () => {
            window.removeEventListener("message", handleMessage);
            resizeObserver.disconnect();
        };
    }, []);




    const defaultStats = [{ number: "25+", label: "Years" }, { number: "1500+", label: "Students" }, { number: "80+", label: "Teachers" }, { number: "100%", label: "Pass Rate" }];


    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* HERO SECTION */}
            <Hero slides={data.hero.slides} />

            {/* WELCOME SECTION */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-semibold text-[#333] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>{data.welcome.title || "Welcome"}</h2>
                        {data.welcome.paragraphs.map((p, i) => (<p key={i} className="text-[#666] text-base leading-relaxed mb-4">{p}</p>))}
                        <div className="flex flex-col items-center mt-6">
                            {data.welcome.signatureImage ? (<Image src={data.welcome.signatureImage} alt="Signature" className="h-12 mb-2" width={128} height={48} style={{ objectFit: 'contain' }} />) : (<svg viewBox="0 0 200 60" className="w-32 h-10 text-[#333]" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 40 Q20 20, 30 40 T50 40 Q60 35, 70 30 L75 30 Q85 28, 95 35 L100 35 Q110 30, 120 35 Q130 40, 140 35 L145 33 Q155 28, 165 30 L180 32" /></svg>)}
                            <span className="text-sm text-[#888] italic">{data.welcome.signatureText || "Principal"}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
                        {(data.welcome.stats.length > 0 ? data.welcome.stats : defaultStats).map((s, i) => (<div key={i} className="text-center"><div className="text-2xl md:text-3xl font-bold text-[#C4A35A] mb-1" style={{ fontFamily: "var(--font-playfair)" }}>{s.number}</div><div className="text-sm text-[#666]">{s.label}</div></div>))}
                    </div>
                </div>
            </section>

            {/* FACILITIES SECTION */}
            {data.facilities.list.length > 0 && (
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <span className="inline-block px-4 py-2 bg-[#C4A35A]/10 text-[#C4A35A] rounded-full text-sm font-medium mb-4">World-Class Infrastructure</span>
                            <h2 className="text-3xl font-semibold text-[#333] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>Our Facilities</h2>
                            <p className="text-[#666] max-w-2xl mx-auto">State-of-the-art infrastructure designed to provide the best learning environment.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {data.facilities.list.map((f, i) => (
                                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                                    <div className="relative h-56 bg-gray-200">{f.image ? <Image src={f.image} alt={f.title} fill className="object-cover" /> : <div className="flex items-center justify-center h-full text-gray-400">No Image</div>}<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" /><div className="absolute bottom-0 left-0 right-0 p-5"><h3 className="text-xl font-semibold text-white" style={{ fontFamily: "var(--font-playfair)" }}>{f.title}</h3></div></div>
                                    <div className="p-6"><p className="text-[#666] text-sm leading-relaxed">{f.description}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* PLAYGROUND HIGHLIGHT SECTION - Golden Gradient Banner */}
            {data.playground && data.playground.title && (
                <section className="py-0">
                    <div className="container mx-auto px-6">
                        <div className="rounded-3xl overflow-hidden relative">
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                {data.playground.image ? <Image src={data.playground.image} alt={data.playground.title} fill className="object-cover" /> : <div className="bg-gray-300 h-full" />}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#C4A35A]/95 to-[#A38842]/90" />
                            </div>

                            <div className="relative z-10 p-8 md:p-12 text-white">
                                <div className="flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-1">
                                        <h3 className="text-2xl md:text-3xl font-semibold mb-4" style={{ fontFamily: "var(--font-playfair)" }}>{data.playground.title}</h3>
                                        <p className="text-white/90 mb-6 text-base">{data.playground.description}</p>
                                        <div className="flex flex-wrap gap-6">
                                            {data.playground.features?.map((f, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                                        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-medium">{f.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {data.playground.buttonText && (
                                        <Link href={data.playground.buttonUrl || "/facilities"} className="bg-white text-[#C4A35A] px-8 py-3 rounded-full font-semibold hover:bg-[#FAF8F5] transition-colors">
                                            {data.playground.buttonText}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <Footer />
        </div>
    );
}
