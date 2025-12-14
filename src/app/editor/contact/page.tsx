"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- Types ---
interface ContactInfo {
    address: string;
    phone1: string;
    phone2: string;
    email1: string;
    email2: string;
    officeHours: string;
}

interface ContactData {
    heroTitle: string;
    heroDesc: string;
    contactInfo: ContactInfo;
}

const defaultData: ContactData = {
    heroTitle: "Contact Us",
    heroDesc: "We'd love to hear from you. Get in touch with us.",
    contactInfo: {
        address: "123 Education Lane\nCity, State - 123456",
        phone1: "+91 98765 43210",
        phone2: "+91 12345 67890",
        email1: "info@balayeasuschool.edu",
        email2: "admissions@balayeasuschool.edu",
        officeHours: "Monday - Friday: 8:00 AM - 4:00 PM\nSaturday: 9:00 AM - 1:00 PM"
    }
};

export default function ContactEditorPage() {
    const [data, setData] = useState<ContactData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const fullscreenIframeRef = useRef<HTMLIFrameElement>(null);

    // Initial load
    useEffect(() => {
        fetch("/api/content")
            .then((res) => res.json())
            .then((content) => {
                if (content.contact) {
                    setData(content.contact);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Sync preview
    useEffect(() => {
        const sendPreviewData = () => {
            const message = { type: "CONTACT_PREVIEW_UPDATE", data };
            iframeRef.current?.contentWindow?.postMessage(message, "*");
            fullscreenIframeRef.current?.contentWindow?.postMessage(message, "*");
        };
        sendPreviewData();
    }, [data]);

    // Listen for preview requests
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "REQUEST_CONTACT_DATA") {
                const message = { type: "CONTACT_PREVIEW_UPDATE", data };
                iframeRef.current?.contentWindow?.postMessage(message, "*");
                fullscreenIframeRef.current?.contentWindow?.postMessage(message, "*");
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [data]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/content", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contact: data }),
            });
            if (!res.ok) throw new Error("Failed to save");
            alert("Changes published successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    // --- Helpers ---
    const updateField = (field: keyof ContactData, value: string) => {
        setData({ ...data, [field]: value });
    };

    const updateContactInfo = (field: keyof ContactInfo, value: string) => {
        setData({
            ...data,
            contactInfo: { ...data.contactInfo, [field]: value }
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/editor" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800">Contact Editor</h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                    >
                        {showPreview ? "Hide Preview" : "Show Preview"}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-[#43a047] text-white rounded-lg hover:bg-[#388e3c] transition-colors font-medium shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>Publish Changes</>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Editor Panel */}
                <div className={`flex-1 overflow-y-auto p-8 transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
                    <div className="max-w-3xl mx-auto space-y-8 pb-16">

                        {/* Hero Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">📢</span> Hero Section
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={data.heroTitle}
                                        onChange={(e) => updateField("heroTitle", e.target.value)}
                                        className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                                    <input
                                        type="text"
                                        value={data.heroDesc}
                                        onChange={(e) => updateField("heroDesc", e.target.value)}
                                        className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Contact Info Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">📞</span> Contact Information
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Address (Use newlines)</label>
                                    <textarea
                                        value={data.contactInfo.address}
                                        onChange={(e) => updateContactInfo("address", e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all resize-none"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone 1</label>
                                        <input
                                            type="text"
                                            value={data.contactInfo.phone1}
                                            onChange={(e) => updateContactInfo("phone1", e.target.value)}
                                            className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone 2</label>
                                        <input
                                            type="text"
                                            value={data.contactInfo.phone2}
                                            onChange={(e) => updateContactInfo("phone2", e.target.value)}
                                            className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email 1</label>
                                        <input
                                            type="text"
                                            value={data.contactInfo.email1}
                                            onChange={(e) => updateContactInfo("email1", e.target.value)}
                                            className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email 2</label>
                                        <input
                                            type="text"
                                            value={data.contactInfo.email2}
                                            onChange={(e) => updateContactInfo("email2", e.target.value)}
                                            className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Office Hours (Use newlines)</label>
                                    <textarea
                                        value={data.contactInfo.officeHours}
                                        onChange={(e) => updateContactInfo("officeHours", e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

                {/* Preview Panel */}
                <AnimatePresence mode="wait">
                    {showPreview && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "50%", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="border-l border-gray-200 bg-gray-50 flex flex-col relative"
                        >
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
                                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    Live Preview
                                </h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsPreviewFullscreen(true)}
                                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                        title="Fullscreen"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                    </button>
                                </div>
                            </div>
                            <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
                                <div className="w-full h-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                    <iframe
                                        ref={iframeRef}
                                        src="/preview/contact"
                                        className="w-full h-full border-0"
                                        title="Contact Preview"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Fullscreen Preview Modal */}
            <AnimatePresence>
                {isPreviewFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm"
                    >
                        <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden relative">
                            <button
                                onClick={() => setIsPreviewFullscreen(false)}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                            <iframe
                                ref={fullscreenIframeRef}
                                src="/preview/contact"
                                className="w-full h-full border-0"
                                title="Fullscreen Contact Preview"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
