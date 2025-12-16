"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface NavLink {
    name: string;
    href: string;
    visible: boolean;
}

interface HeaderData {
    logo: {
        image: string;
    };
    navLinks: NavLink[];
}

const defaultData: HeaderData = {
    logo: {
        image: ""
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

const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export default function HeaderEditorPage() {
    const [data, setData] = useState<HeaderData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const logoFileInput = useRef<HTMLInputElement>(null);

    // Preview state
    const [showPreview, setShowPreview] = useState(true);
    const [previewWidth, setPreviewWidth] = useState(50);
    const [isResizing, setIsResizing] = useState(false);
    const [fullscreenPreview, setFullscreenPreview] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);
    const [previewZoom, setPreviewZoom] = useState(100);
    const [previewHeight, setPreviewHeight] = useState(600);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    const sectionName = "Site Header";
    const previewUrl = "/preview/header";
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const fullscreenIframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/pages/shared`);
                const content = await res.json();
                const header = content.header || {};

                setData({
                    logo: header.logo || defaultData.logo,
                    navLinks: header.navLinks || defaultData.navLinks
                });
            } catch (error) {
                console.error("Failed to load header data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Send data to preview
    const sendPreviewData = useCallback(() => {
        const message = { type: "HEADER_PREVIEW_UPDATE", data };
        iframeRef.current?.contentWindow?.postMessage(message, "*");
        fullscreenIframeRef.current?.contentWindow?.postMessage(message, "*");
    }, [data]);

    useEffect(() => {
        if (!loading) sendPreviewData();
    }, [data, loading, sendPreviewData]);

    // Handle messages from preview
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "REQUEST_HEADER_DATA") sendPreviewData();
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
            console.log('Saving header to API:', apiUrl);

            const res = await fetch(`${apiUrl}/api/pages/shared/header`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                alert("Published successfully!");
                setPreviewKey(k => k + 1);
            } else {
                const error = await res.json();
                alert(`Error saving: ${error.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Error saving - check console for details");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        setUploading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch(`${apiUrl}/api/editor/upload`, { method: "POST", body: formData });
            if (res.ok) {
                const result = await res.json();
                setData({ ...data, logo: { image: result.url } });
            } else {
                alert("Upload failed");
            }
        } catch {
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const updateNavLink = (i: number, f: keyof NavLink, v: string | boolean) => {
        const links = [...data.navLinks];
        links[i] = { ...links[i], [f]: v };
        setData({ ...data, navLinks: links });
    };

    const addNavLink = () => setData({ ...data, navLinks: [...data.navLinks, { name: "New Link", href: "/", visible: true }] });
    const removeNavLink = (i: number) => setData({ ...data, navLinks: data.navLinks.filter((_, idx) => idx !== i) });

    const zoomIn = () => setPreviewZoom(z => Math.min(z + 10, 100));
    const zoomOut = () => setPreviewZoom(z => Math.max(z - 10, 50));

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="w-8 h-8 border-2 border-[#C4A35A]/30 border-t-[#C4A35A] rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col h-screen overflow-hidden">
            <input type="file" accept="image/*" ref={logoFileInput} onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} className="hidden" />

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

            <div className="border-b border-gray-200 px-6 py-3 sticky top-0 bg-white z-50 shrink-0">
                <div className="max-w-[1800px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/editor" className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></Link>
                        <span className="text-gray-300">|</span><span className="text-gray-500 text-sm">Editing: {sectionName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowPreview(!showPreview)} className={`flex items-center gap-2 px-4 py-2 border font-medium rounded-lg ${showPreview ? 'border-[#C4A35A] text-[#C4A35A] bg-[#C4A35A]/10' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                        </button>
                        <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#E55A00] hover:bg-[#cc5000] text-white font-medium rounded-lg disabled:opacity-50">{saving ? "Publishing..." : "Publish"}</button>
                    </div>
                </div>
            </div>

            <div ref={containerRef} className={`flex-1 overflow-hidden flex ${showPreview ? '' : 'justify-center'}`}>
                <div className="overflow-y-auto h-full p-8 transition-all duration-300" style={{ width: showPreview ? `${100 - previewWidth}%` : '100%', maxWidth: showPreview ? 'none' : '900px' }}>
                    <div className="max-w-3xl mx-auto space-y-8 pb-16">
                        <div className="mb-4"><label className="text-xs text-[#C4A35A] font-medium uppercase tracking-wider">Component</label><h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#C4A35A] py-2">Header</h1></div>

                        {/* Logo Section */}
                        <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="font-semibold text-gray-700 mb-4">Logo Image</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Logo Image URL</label>
                                    <div className="flex gap-2">
                                        <input type="text" value={data.logo.image} onChange={e => setData({ ...data, logo: { image: e.target.value } })} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg" placeholder="Enter image URL or upload" />
                                        <button onClick={() => logoFileInput.current?.click()} disabled={uploading} className="px-4 py-2.5 bg-[#C4A35A] text-white font-medium rounded-lg hover:bg-[#A38842] transition-colors disabled:opacity-50">{uploading ? 'Uploading...' : 'Upload'}</button>
                                    </div>
                                </div>
                                {data.logo.image && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Editor Preview (Actual size in Live Preview)</label>
                                        <div className="relative h-24 w-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            <Image src={data.logo.image} alt="Logo" fill style={{ objectFit: 'contain' }} className="p-2" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="font-semibold text-gray-700 mb-4">Navigation Links</h3>
                            <div className="space-y-3">
                                {data.navLinks.map((link, i) => (
                                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <label className="flex items-center gap-2 text-sm">
                                                <input type="checkbox" checked={link.visible} onChange={e => updateNavLink(i, "visible", e.target.checked)} className="w-4 h-4" />
                                                {link.visible ? 'Visible' : 'Hidden'}
                                            </label>
                                            <button onClick={() => removeNavLink(i)} className="text-red-400 hover:text-red-600 p-1"><TrashIcon /></button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input type="text" value={link.name} onChange={e => updateNavLink(i, "name", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Link Name" />
                                            <input type="text" value={link.href} onChange={e => updateNavLink(i, "href", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="URL" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addNavLink} className="mt-3 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Link</button>
                        </div>
                    </div>
                </div>

                {showPreview && <div className="w-2 cursor-col-resize flex items-center justify-center hover:bg-[#C4A35A]/20 group flex-shrink-0" onMouseDown={() => setIsResizing(true)}><div className="w-1 h-16 bg-gray-300 rounded-full group-hover:bg-[#C4A35A]"></div></div>}

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
