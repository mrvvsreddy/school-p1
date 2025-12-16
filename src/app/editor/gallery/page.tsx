"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// --- Types ---
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
        { src: "", alt: "New Image", category: "Events" }
    ]
};

const CATEGORIES = ["Campus", "Academics", "Sports", "Events"];

export default function GalleryEditorPage() {
    const [data, setData] = useState<GalleryData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Preview state
    const [showPreview, setShowPreview] = useState(true);
    const [previewWidth, setPreviewWidth] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const [fullscreenPreview, setFullscreenPreview] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);
    const [previewZoom, setPreviewZoom] = useState(100);
    const [previewHeight, setPreviewHeight] = useState(600);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    const sectionName = "Photo Gallery";
    const previewUrl = "/preview/gallery";

    // Upload state
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});
    const galleryFileInputs = useRef<(HTMLInputElement | null)[]>([]);

    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const fullscreenIframeRef = useRef<HTMLIFrameElement>(null);

    // Initial load
    useEffect(() => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        fetch(`${apiUrl}/api/pages/gallery`)
            .then((res) => res.json())
            .then((content) => {
                if (content.gallery) {
                    setData(content.gallery);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Send data to preview
    const sendPreviewData = useCallback(() => {
        const message = { type: "GALLERY_PREVIEW_UPDATE", data };
        iframeRef.current?.contentWindow?.postMessage(message, "*");
        fullscreenIframeRef.current?.contentWindow?.postMessage(message, "*");
    }, [data]);

    useEffect(() => {
        if (!loading) sendPreviewData();
    }, [data, loading, sendPreviewData]);

    // Listen for preview requests
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "REQUEST_GALLERY_DATA") sendPreviewData();
            if (event.data?.type === "PREVIEW_HEIGHT_UPDATE") setPreviewHeight(event.data.height);
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [sendPreviewData]);

    // Resizing logic
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const newWidth = ((rect.right - e.clientX) / rect.width) * 100;
            setPreviewWidth(Math.min(Math.max(newWidth, 25), 75));
        };
        const handleMouseUp = () => setIsResizing(false);
        if (isResizing) { document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp); }
        return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
    }, [isResizing]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/pages/gallery/batch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sections: { gallery: data } }),
            });
            if (!res.ok) throw new Error("Failed to save");
            alert("Changes published successfully!");
            setPreviewKey(k => k + 1);
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
        const key = `gallery-${index}`;
        setUploading(prev => ({ ...prev, [key]: true }));

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(`${apiUrl}/api/editor/upload`, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) throw new Error('Upload failed');
            const { url } = await res.json();

            const newImages = [...data.galleryImages];
            newImages[index].src = url;
            setData({ ...data, galleryImages: newImages });
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(prev => ({ ...prev, [key]: false }));
        }
    };

    // --- Helpers ---
    const updateImage = (index: number, field: keyof GalleryImage, value: string) => {
        const newImages = [...data.galleryImages];
        newImages[index] = { ...newImages[index], [field]: value };
        setData({ ...data, galleryImages: newImages });
    };

    const addImage = () => {
        setData({
            ...data,
            galleryImages: [{ src: "", alt: "New Image", category: "Events" }, ...data.galleryImages]
        });
    };

    const removeImage = (index: number) => {
        setData({ ...data, galleryImages: data.galleryImages.filter((_, i) => i !== index) });
    };

    const zoomIn = () => setPreviewZoom(z => Math.min(z + 10, 100));
    const zoomOut = () => setPreviewZoom(z => Math.max(z - 10, 50));

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#F5F5F5] flex flex-col h-screen overflow-hidden">
            {fullscreenPreview && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full h-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                            <span className="text-sm text-gray-600 font-medium">Full Preview - {sectionName}</span>
                            <button onClick={() => setFullscreenPreview(false)} className="p-1.5 hover:bg-gray-200 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <iframe ref={fullscreenIframeRef} key={previewKey} src={previewUrl} className="flex-1 w-full border-0" />
                    </div>
                </div>
            )}

            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link href="/editor" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <span className="text-gray-300">|</span><span className="text-gray-500 text-sm">Editing: {sectionName}</span>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setShowPreview(!showPreview)} className={`flex items-center gap-2 px-4 py-2 border font-medium rounded-lg ${showPreview ? 'border-[#C4A35A] text-[#C4A35A] bg-[#C4A35A]/10' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                        {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2 bg-[#E55A00] text-white rounded-lg hover:bg-[#cc5000] transition-colors font-medium shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>Publish</>
                        )}
                    </button>
                </div>
            </header>

            <div ref={containerRef} className={`flex-1 overflow-hidden flex ${showPreview ? '' : 'justify-center'}`}>
                {/* Editor Panel */}
                <div className="overflow-y-auto h-full p-8 transition-all duration-300" style={{ width: showPreview ? `${100 - previewWidth}%` : '100%', maxWidth: showPreview ? 'none' : '900px' }}>
                    <div className="max-w-3xl mx-auto space-y-8 pb-16">

                        {/* Gallery Section */}
                        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-2xl">🖼️</span> Photo Gallery
                                </h2>
                                <button onClick={addImage} className="text-sm px-3 py-1 bg-[#43a047]/10 text-[#43a047] rounded-full font-medium hover:bg-[#43a047]/20 transition-colors">
                                    + Add Photo
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {data.galleryImages.map((img, i) => (
                                    <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative group">
                                        <button
                                            onClick={() => removeImage(i)}
                                            className="absolute top-2 right-2 z-10 p-1 bg-white/80 rounded-full text-red-500 hover:bg-white hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>

                                        <div className="mb-4">
                                            <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden shrink-0 mb-2">
                                                {img.src ? (
                                                    <Image src={img.src} alt="Preview" className="w-full h-full object-cover" fill style={{ objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-sm text-gray-400">No Image</div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="file"
                                                    ref={el => { galleryFileInputs.current[i] = el }}
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleImageUpload(file, i);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => galleryFileInputs.current[i]?.click()}
                                                    disabled={uploading[`gallery-${i}`]}
                                                    className="flex-1 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                                >
                                                    {uploading[`gallery-${i}`] ? "Uploading..." : "Upload Image"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Caption</label>
                                                <input
                                                    type="text"
                                                    value={img.alt}
                                                    onChange={(e) => updateImage(i, "alt", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                                                <select
                                                    value={img.category}
                                                    onChange={(e) => updateImage(i, "category", e.target.value)}
                                                    className="w-full px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-[#43a047] focus:ring-2 focus:ring-[#43a047]/20 outline-none transition-all"
                                                >
                                                    {CATEGORIES.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>

                {showPreview && <div className="w-2 cursor-col-resize flex items-center justify-center hover:bg-[#C4A35A]/20 group flex-shrink-0" onMouseDown={() => setIsResizing(true)}><div className="w-1 h-16 bg-gray-300 rounded-full group-hover:bg-[#C4A35A]"></div></div>}

                {/* Preview Panel */}
                {showPreview && (
                    <div style={{ width: `${previewWidth}%` }} className="bg-gray-100 flex flex-col h-full border-l border-gray-200 shadow-inner flex-shrink-0">
                        <div className="bg-white px-4 py-2 border-b border-gray-200 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 font-medium">Live Preview</span>
                                <div className="flex bg-gray-200 rounded-lg p-1 ml-2">
                                    <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded transition-all ${viewMode === 'desktop' ? 'bg-white shadow text-[#C4A35A]' : 'text-gray-500 hover:text-gray-700'}`} title="Desktop View">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </button>
                                    <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded transition-all ${viewMode === 'mobile' ? 'bg-white shadow text-[#C4A35A]' : 'text-gray-500 hover:text-gray-700'}`} title="Mobile View">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                                    </button>
                                </div>
                                <span className="text-xs text-gray-400">({previewZoom}%)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button onClick={zoomOut} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Zoom Out"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg></button>
                                <span className="text-xs text-gray-500 w-8 text-center select-none">{previewZoom}%</span>
                                <button onClick={zoomIn} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Zoom In"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg></button>
                                <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                <button onClick={() => setPreviewKey(k => k + 1)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Refresh"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
                                <button onClick={() => setFullscreenPreview(true)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600" title="Fullscreen"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg></button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto bg-gray-800 p-4 flex justify-center">
                            <div className="bg-white shadow-xl transition-all duration-200 origin-top" style={{
                                width: viewMode === 'desktop' ? '1280px' : '375px',
                                height: `${previewHeight}px`,
                                transform: `scale(${previewZoom / 100})`,
                                marginBottom: `-${previewHeight * (1 - previewZoom / 100)}px`
                            }}>
                                <iframe ref={iframeRef} key={previewKey} src={previewUrl} className="w-full h-full border-0" title="Preview" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
