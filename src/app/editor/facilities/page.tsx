"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// --- Types ---
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
            image: "",
            features: ["2 Acre Area"]
        }
    ],
    additional: [
        { name: "Library", icon: "📚" }
    ]
};

export default function FacilitiesEditorPage() {
    const [data, setData] = useState<FacilitiesData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false);

    // Upload state
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const facilityFileInputs = useRef<(HTMLInputElement | null)[]>([]);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const fullscreenIframeRef = useRef<HTMLIFrameElement>(null);

    // Initial load
    useEffect(() => {
        fetch("/api/content")
            .then((res) => res.json())
            .then((content) => {
                if (content.facilities) {
                    setData(content.facilities);
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
            const message = { type: "FACILITIES_PREVIEW_UPDATE", data };
            iframeRef.current?.contentWindow?.postMessage(message, "*");
            fullscreenIframeRef.current?.contentWindow?.postMessage(message, "*");
        };
        sendPreviewData();
    }, [data]);

    // Listen for preview requests
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "REQUEST_FACILITIES_DATA") {
                const message = { type: "FACILITIES_PREVIEW_UPDATE", data };
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
                body: JSON.stringify({ facilities: data }),
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

    const handleImageUpload = async (file: File, index: number) => {
        const formData = new FormData();
        formData.append('file', file);
        const key = `facility-${index}`;
        setUploading(prev => ({ ...prev, [key]: true }));

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Upload failed');
            const { url } = await res.json();

            const newFacilities = [...data.facilities];
            newFacilities[index].image = url;
            setData({ ...data, facilities: newFacilities });
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(prev => ({ ...prev, [key]: false }));
        }
    };

    // --- Helpers ---
    const updateFacility = (index: number, field: keyof Facility, value: any) => {
        const newFacilities = [...data.facilities];
        newFacilities[index] = { ...newFacilities[index], [field]: value };
        setData({ ...data, facilities: newFacilities });
    };

    const addFacility = () => {
        setData({
            ...data,
            facilities: [...data.facilities, { title: "New Facility", description: "", image: "", features: [] }]
        });
    };

    const removeFacility = (index: number) => {
        setData({ ...data, facilities: data.facilities.filter((_, i) => i !== index) });
    };

    const updateFacilityFeatures = (index: number, featuresString: string) => {
        const features = featuresString.split(",").map(f => f.trim()).filter(f => f);
        updateFacility(index, "features", features);
    };

    const updateAdditional = (index: number, field: keyof AdditionalFacility, value: string) => {
        const newAdditional = [...data.additional];
        newAdditional[index] = { ...newAdditional[index], [field]: value };
        setData({ ...data, additional: newAdditional });
    };

    const addAdditional = () => {
        setData({ ...data, additional: [...data.additional, { name: "New Item", icon: "✨" }] });
    };

    const removeAdditional = (index: number) => {
        setData({ ...data, additional: data.additional.filter((_, i) => i !== index) });
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
                    <h1 className="text-xl font-bold text-gray-800">Facilities Editor</h1>
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

                        {/* Main Facilities */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">🏫</span> Main Facilities
                                </h2>
                                <button onClick={addFacility} className="text-sm px-3 py-1 bg-[#43a047]/10 text-[#43a047] rounded-full font-medium hover:bg-[#43a047]/20 transition-colors">
                                    + Add Facility
                                </button>
                            </div>
                            <div className="space-y-6">
                                {data.facilities.map((facility, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                        <button
                                            onClick={() => removeFacility(i)}
                                            className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>

                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                                            <input
                                                type="text"
                                                value={facility.title}
                                                onChange={(e) => updateFacility(i, "title", e.target.value)}
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                                            <textarea
                                                value={facility.description}
                                                onChange={(e) => updateFacility(i, "description", e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all resize-none"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Features (comma separated)</label>
                                            <input
                                                type="text"
                                                value={facility.features.join(", ")}
                                                onChange={(e) => updateFacilityFeatures(i, e.target.value)}
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Image</label>
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-24 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                                    {facility.image ? (
                                                        <img src={facility.image} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    ref={el => { facilityFileInputs.current[i] = el }}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleImageUpload(file, i);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => facilityFileInputs.current[i]?.click()}
                                                    disabled={uploading[`facility-${i}`]}
                                                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                                >
                                                    {uploading[`facility-${i}`] ? "Uploading..." : "Upload Image"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Additional Facilities */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">✨</span> Additional Facilities
                                </h2>
                                <button onClick={addAdditional} className="text-sm px-3 py-1 bg-[#43a047]/10 text-[#43a047] rounded-full font-medium hover:bg-[#43a047]/20 transition-colors">
                                    + Add Item
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {data.additional.map((item, i) => (
                                    <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 group relative">
                                        <button
                                            onClick={() => removeAdditional(i)}
                                            className="absolute top-2 right-2 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                        <div className="w-12">
                                            <input
                                                type="text"
                                                value={item.icon}
                                                onChange={(e) => updateAdditional(i, "icon", e.target.value)}
                                                className="w-full text-center text-2xl bg-transparent focus:bg-white rounded p-1 outline-none"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={item.name}
                                                onChange={(e) => updateAdditional(i, "name", e.target.value)}
                                                className="w-full font-medium bg-transparent focus:bg-white rounded px-2 py-1 outline-none border border-transparent focus:border-gray-200"
                                            />
                                        </div>
                                    </div>
                                ))}
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
                                        src="/preview/facilities"
                                        className="w-full h-full border-0"
                                        title="Facilities Preview"
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
                                src="/preview/facilities"
                                className="w-full h-full border-0"
                                title="Fullscreen Facilities Preview"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
