"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// Types matching the About page structure
interface Milestone {
    year: string;
    event: string;
}

interface FoundationItem {
    icon: string;
    title: string;
    content: string;
}

interface Leader {
    name: string;
    role: string;
    exp: string;
    image?: string;
}

interface AboutData {
    storyTitle: string;
    storyIntro1: string;
    storyIntro2: string;
    storyIntro3: string;
    milestones: Milestone[];
    foundation: FoundationItem[];
    leadership: Leader[];
}

const defaultData: AboutData = {
    storyTitle: "Our Story",
    storyIntro1: "Founded with a vision to provide quality education.",
    storyIntro2: "We believe in nurturing every child's potential.",
    storyIntro3: "Our commitment to excellence drives everything we do.",
    milestones: [],
    foundation: [],
    leadership: []
};

// Icons (Reused from Home Editor)
const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ChevronIcon = ({ open }: { open: boolean }) => <svg className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const ZoomInIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>;
const ZoomOutIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>;

export default function AboutEditorPage() {
    const [data, setData] = useState<AboutData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewWidth, setPreviewWidth] = useState(50);
    const [fullscreenPreview, setFullscreenPreview] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);
    const [previewZoom, setPreviewZoom] = useState(50);
    const [openSections, setOpenSections] = useState({ story: true, milestones: false, foundation: false, leadership: false });

    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const fullscreenIframeRef = useRef<HTMLIFrameElement>(null);
    const leaderFileInputs = useRef<(HTMLInputElement | null)[]>([]);

    const previewUrl = "/preview/about";
    const sectionName = "About Page";

    const sendPreviewData = useCallback(() => {
        const message = { type: "ABOUT_PREVIEW_UPDATE", data };
        iframeRef.current?.contentWindow?.postMessage(message, "*");
        fullscreenIframeRef.current?.contentWindow?.postMessage(message, "*");
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/pages/about`);
                const content = await res.json();
                const about = content.about || {};

                setData({
                    storyTitle: about.storyTitle || defaultData.storyTitle,
                    storyIntro1: about.storyIntro1 || defaultData.storyIntro1,
                    storyIntro2: about.storyIntro2 || defaultData.storyIntro2,
                    storyIntro3: about.storyIntro3 || defaultData.storyIntro3,
                    milestones: about.milestones || [],
                    foundation: about.foundation || [],
                    leadership: about.leadership || []
                });
            } catch (error) {
                console.error("Failed to load about data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => { if (!loading) sendPreviewData(); }, [data, loading, sendPreviewData]);

    const [previewHeight, setPreviewHeight] = useState(2000);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data?.type === "REQUEST_ABOUT_DATA") sendPreviewData();
            if (event.data?.type === "PREVIEW_HEIGHT_UPDATE") setPreviewHeight(event.data.height);
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [sendPreviewData]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => { if (!isResizing || !containerRef.current) return; const rect = containerRef.current.getBoundingClientRect(); setPreviewWidth(Math.min(Math.max(((rect.right - e.clientX) / rect.width) * 100, 25), 75)); };
        const handleMouseUp = () => setIsResizing(false);
        if (isResizing) { document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp); }
        return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
    }, [isResizing]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

            const res = await fetch(`${apiUrl}/api/pages/about/batch`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sections: { about: data } })
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
            alert("Error saving");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (index: number, file: File) => {
        setUploading(`leader-${index}`);
        try {
            const formData = new FormData(); formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (res.ok) {
                const result = await res.json();
                updateLeader(index, "image", result.url);
            } else alert("Upload failed");
        } catch { alert("Upload failed"); } finally { setUploading(null); }
    };

    const toggleSection = (section: keyof typeof openSections) => setOpenSections({ ...openSections, [section]: !openSections[section] });

    // Milestones functions
    const updateMilestone = (i: number, f: keyof Milestone, v: string) => { const m = [...data.milestones]; m[i] = { ...m[i], [f]: v }; setData({ ...data, milestones: m }); };
    const addMilestone = () => setData({ ...data, milestones: [...data.milestones, { year: new Date().getFullYear().toString(), event: "New Event" }] });
    const removeMilestone = (i: number) => setData({ ...data, milestones: data.milestones.filter((_, idx) => idx !== i) });

    // Foundation functions
    const updateFoundation = (i: number, f: keyof FoundationItem, v: string) => { const list = [...data.foundation]; list[i] = { ...list[i], [f]: v }; setData({ ...data, foundation: list }); };
    const addFoundation = () => setData({ ...data, foundation: [...data.foundation, { icon: "🏛️", title: "New Value", content: "Description" }] });
    const removeFoundation = (i: number) => setData({ ...data, foundation: data.foundation.filter((_, idx) => idx !== i) });

    // Leadership functions
    const updateLeader = (i: number, f: keyof Leader, v: string) => { const list = [...data.leadership]; list[i] = { ...list[i], [f]: v }; setData({ ...data, leadership: list }); };
    const addLeader = () => setData({ ...data, leadership: [...data.leadership, { name: "New Leader", role: "Role", exp: "Experience" }] });
    const removeLeader = (i: number) => setData({ ...data, leadership: data.leadership.filter((_, idx) => idx !== i) });

    // Zoom controls
    const zoomIn = () => setPreviewZoom(z => Math.min(z + 10, 100));
    const zoomOut = () => setPreviewZoom(z => Math.max(z - 10, 30));

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="w-8 h-8 border-2 border-[#C4A35A]/30 border-t-[#C4A35A] rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {fullscreenPreview && (
                <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full h-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                            <span className="text-sm text-gray-600 font-medium">Full Preview - {sectionName}</span>
                            <button onClick={() => setFullscreenPreview(false)} className="p-1.5 hover:bg-gray-200 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                        <iframe ref={fullscreenIframeRef} key={previewKey} src={previewUrl} className="flex-1 w-full" />
                    </div>
                </div>
            )}

            <div className="border-b border-gray-200 px-6 py-3 sticky top-0 bg-white z-50">
                <div className="max-w-[1800px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/editor" className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></Link>
                        <span className="text-gray-300">|</span><span className="text-gray-500 text-sm">Editing: {sectionName}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setShowPreview(!showPreview)} className={`flex items-center gap-2 px-4 py-2 border font-medium rounded-lg ${showPreview ? 'border-[#C4A35A] text-[#C4A35A] bg-[#C4A35A]/10' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            {showPreview ? 'Hide' : 'Preview'}
                        </button>
                        <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#E55A00] hover:bg-[#cc5000] text-white font-medium rounded-lg disabled:opacity-50">{saving ? "Publishing..." : "Publish"}</button>
                    </div>
                </div>
            </div>

            <div ref={containerRef} className={`max-w-[1800px] mx-auto px-6 py-8 ${showPreview ? 'flex gap-0' : ''}`}>
                <div className="overflow-y-auto" style={{ width: showPreview ? `${100 - previewWidth}%` : '100%', maxWidth: showPreview ? 'none' : '900px', margin: showPreview ? 0 : '0 auto' }}>
                    <div className="mb-8"><label className="text-xs text-[#C4A35A] font-medium uppercase tracking-wider">Page</label><h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#C4A35A] py-2">{sectionName}</h1></div>

                    {/* STORY SECTION */}
                    <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <button onClick={() => toggleSection('story')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#C4A35A] rounded-lg flex items-center justify-center text-white font-bold text-sm">1</div><span className="font-semibold text-gray-700">Our Story</span></div>
                            <ChevronIcon open={openSections.story} />
                        </button>
                        {openSections.story && (
                            <div className="p-6 space-y-5">
                                <div><label className="block text-sm font-medium text-gray-600 mb-2">Title</label><input type="text" value={data.storyTitle} onChange={e => setData({ ...data, storyTitle: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-600 mb-2">Paragraph 1</label><textarea value={data.storyIntro1} onChange={e => setData({ ...data, storyIntro1: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" /></div>
                                <div><label className="block text-sm font-medium text-gray-600 mb-2">Paragraph 2</label><textarea value={data.storyIntro2} onChange={e => setData({ ...data, storyIntro2: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" /></div>
                                <div><label className="block text-sm font-medium text-gray-600 mb-2">Paragraph 3</label><textarea value={data.storyIntro3} onChange={e => setData({ ...data, storyIntro3: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" /></div>
                            </div>
                        )}
                    </div>

                    {/* MILESTONES SECTION */}
                    <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <button onClick={() => toggleSection('milestones')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#C4A35A] rounded-lg flex items-center justify-center text-white font-bold text-sm">2</div><span className="font-semibold text-gray-700">Key Milestones</span></div>
                            <ChevronIcon open={openSections.milestones} />
                        </button>
                        {openSections.milestones && (
                            <div className="p-6">
                                <div className="space-y-3">
                                    {data.milestones.map((m, i) => (
                                        <div key={i} className="flex gap-2 items-start">
                                            <input type="text" value={m.year} onChange={e => updateMilestone(i, "year", e.target.value)} className="w-24 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Year" />
                                            <input type="text" value={m.event} onChange={e => updateMilestone(i, "event", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Event Description" />
                                            <button onClick={() => removeMilestone(i)} className="text-red-400 hover:text-red-600 p-2"><TrashIcon /></button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addMilestone} className="mt-3 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm flex items-center gap-2">+ Add Milestone</button>
                            </div>
                        )}
                    </div>

                    {/* FOUNDATION SECTION */}
                    <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <button onClick={() => toggleSection('foundation')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#C4A35A] rounded-lg flex items-center justify-center text-white font-bold text-sm">3</div><span className="font-semibold text-gray-700">Our Foundation (Values)</span></div>
                            <ChevronIcon open={openSections.foundation} />
                        </button>
                        {openSections.foundation && (
                            <div className="p-6">
                                <div className="space-y-4">
                                    {data.foundation.map((f, i) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between mb-2"><span className="text-xs text-gray-500 uppercase">Value {i + 1}</span><button onClick={() => removeFoundation(i)} className="text-red-400 hover:text-red-600"><TrashIcon /></button></div>
                                            <div className="grid gap-2">
                                                <div className="flex gap-2">
                                                    <input type="text" value={f.icon} onChange={e => updateFoundation(i, "icon", e.target.value)} className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center" placeholder="Icon" />
                                                    <input type="text" value={f.title} onChange={e => updateFoundation(i, "title", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Title" />
                                                </div>
                                                <textarea value={f.content} onChange={e => updateFoundation(i, "content", e.target.value)} rows={2} className="px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="Description" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addFoundation} className="mt-3 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm flex items-center gap-2">+ Add Value</button>
                            </div>
                        )}
                    </div>

                    {/* LEADERSHIP SECTION */}
                    <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <button onClick={() => toggleSection('leadership')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#C4A35A] rounded-lg flex items-center justify-center text-white font-bold text-sm">4</div><span className="font-semibold text-gray-700">Leadership</span></div>
                            <ChevronIcon open={openSections.leadership} />
                        </button>
                        {openSections.leadership && (
                            <div className="p-6">
                                <div className="space-y-4">
                                    {data.leadership.map((leader, i) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-4">
                                            <input type="file" accept="image/*" ref={el => { leaderFileInputs.current[i] = el; }} onChange={e => { const file = e.target.files?.[0]; if (file) handleImageUpload(i, file); }} className="hidden" />
                                            <div className="flex justify-between mb-2"><span className="text-xs text-gray-500 uppercase">Leader {i + 1}</span><button onClick={() => removeLeader(i)} className="text-red-400 hover:text-red-600"><TrashIcon /></button></div>
                                            <div className="flex gap-4 items-start">
                                                <div className="w-20 h-20 bg-gray-100 rounded-full flex-shrink-0 overflow-hidden relative border border-gray-200 group">
                                                    {leader.image ? (
                                                        <Image src={leader.image} alt={leader.name} className="w-full h-full object-cover" fill style={{ objectFit: 'cover' }} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => leaderFileInputs.current[i]?.click()}>
                                                        <span className="text-white text-xs font-medium">{uploading === `leader-${i}` ? '...' : 'Edit'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 grid gap-2">
                                                    <input type="text" value={leader.name} onChange={e => updateLeader(i, "name", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Name" />
                                                    <input type="text" value={leader.role} onChange={e => updateLeader(i, "role", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Role" />
                                                    <input type="text" value={leader.exp} onChange={e => updateLeader(i, "exp", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Experience" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addLeader} className="mt-3 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm flex items-center gap-2">+ Add Leader</button>
                            </div>
                        )}
                    </div>

                </div>

                {showPreview && <div className="w-2 cursor-col-resize flex items-center justify-center hover:bg-[#C4A35A]/20 group flex-shrink-0" onMouseDown={() => setIsResizing(true)}><div className="w-1 h-16 bg-gray-300 rounded-full group-hover:bg-[#C4A35A]"></div></div>}

                {showPreview && (
                    <div style={{ width: `${previewWidth}%` }} className="sticky top-[80px] h-[calc(100vh-120px)] flex-shrink-0">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full overflow-hidden flex flex-col">
                            <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                                <div className="flex items-center gap-2"><span className="text-sm text-gray-600 font-medium">{sectionName} Preview</span><span className="text-xs text-gray-400">({previewZoom}%)</span></div>
                                <div className="flex items-center gap-1">
                                    <button onClick={zoomOut} className="p-1.5 hover:bg-gray-200 rounded" title="Zoom Out"><ZoomOutIcon /></button>
                                    <span className="text-xs text-gray-500 w-8 text-center">{previewZoom}%</span>
                                    <button onClick={zoomIn} className="p-1.5 hover:bg-gray-200 rounded" title="Zoom In"><ZoomInIcon /></button>
                                    <div className="w-px h-4 bg-gray-300 mx-1"></div>
                                    <button onClick={() => setPreviewKey(k => k + 1)} className="p-1.5 hover:bg-gray-200 rounded" title="Refresh"><svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg></button>
                                    <button onClick={() => setFullscreenPreview(true)} className="p-1.5 hover:bg-gray-200 rounded" title="Fullscreen"><svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m5 5v-4m0 4h-4" /></svg></button>
                                </div>
                            </div>
                            <div className="flex-1 overflow-x-hidden overflow-y-auto">
                                <iframe
                                    ref={iframeRef}
                                    key={previewKey}
                                    src={previewUrl}
                                    className="border-0 bg-white"
                                    style={{
                                        width: `${10000 / previewZoom}%`,
                                        height: `${previewHeight}px`,
                                        transform: `scale(${previewZoom / 100})`,
                                        transformOrigin: 'top left',
                                        marginBottom: `-${previewHeight * (1 - previewZoom / 100)}px`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
