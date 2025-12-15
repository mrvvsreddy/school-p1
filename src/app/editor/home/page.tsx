"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// Types
interface HeroButton { id: number; text: string; url: string; color: string; visible: boolean; }
interface HeroSlide { id: number; title: string; subtitle: string; image: string; }
interface Stat { number: string; label: string; }
interface Facility { title: string; description: string; image: string; }
interface PlaygroundFeature { icon: string; text: string; }
interface PlaygroundData { title: string; description: string; features: PlaygroundFeature[]; image: string; buttonText: string; buttonUrl: string; }

interface HomeData {
    hero: { slides: HeroSlide[]; buttons: HeroButton[] };
    welcome: { title: string; paragraphs: string[]; signatureImage: string; signatureText: string; stats: Stat[] };
    facilities: { list: Facility[] };
    playground: PlaygroundData;
}

const defaultPlayground: PlaygroundData = {
    title: "Safe & Spacious Playground",
    description: "Our 2-acre playground provides ample space for children to run, play, and explore. Equipped with modern safety surfaces and age-appropriate equipment.",
    features: [{ icon: "check", text: "2 Acres Area" }, { icon: "shield", text: "Safety Certified" }, { icon: "clock", text: "Morning PT Sessions" }],
    image: "/facility-playground.jpg",
    buttonText: "View All Facilities",
    buttonUrl: "/facilities"
};

const defaultData: HomeData = {
    hero: { slides: [{ id: 1, title: "Welcome", subtitle: "Description", image: "" }], buttons: [{ id: 1, text: "Admissions Open", url: "/admissions", color: "#C4A35A", visible: true }] },
    welcome: { title: "Welcome", paragraphs: [""], signatureImage: "", signatureText: "School Principal", stats: [{ number: "25+", label: "Years" }] },
    facilities: { list: [] },
    playground: defaultPlayground
};

const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const DragIcon = () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>;
const ChevronIcon = ({ open }: { open: boolean }) => <svg className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
const ZoomInIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>;
const ZoomOutIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg>;

export default function HomeEditorPage() {
    const [data, setData] = useState<HomeData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [previewWidth, setPreviewWidth] = useState(50);
    const [fullscreenPreview, setFullscreenPreview] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [previewKey, setPreviewKey] = useState(0);
    const [previewZoom, setPreviewZoom] = useState(50);
    const [openSections, setOpenSections] = useState({ hero: true, welcome: false, facilities: false, playground: false });
    const [draggedSlideIndex, setDraggedSlideIndex] = useState<number | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const fullscreenIframeRef = useRef<HTMLIFrameElement>(null);
    const heroFileInputs = useRef<(HTMLInputElement | null)[]>([]);
    const facilityFileInputs = useRef<(HTMLInputElement | null)[]>([]);
    const signatureFileInput = useRef<HTMLInputElement>(null);
    const playgroundFileInput = useRef<HTMLInputElement>(null);

    const previewUrl = "/preview/home";
    const sectionName = "Homepage";

    const sendPreviewData = useCallback(() => {
        const message = { type: "HOME_PREVIEW_UPDATE", data };
        iframeRef.current?.contentWindow?.postMessage(message, "*");
        fullscreenIframeRef.current?.contentWindow?.postMessage(message, "*");
    }, [data]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/pages/home`);
                const content = await res.json();

                const welcome = content.welcome || {};
                const paragraphs = welcome.paragraphs || [];
                if (paragraphs.length === 0 && (welcome.intro1 || welcome.intro2)) {
                    if (welcome.intro1) paragraphs.push(welcome.intro1);
                    if (welcome.intro2) paragraphs.push(welcome.intro2);
                }

                setData({
                    hero: {
                        slides: content.hero?.slides || defaultData.hero.slides,
                        buttons: content.hero?.buttons || defaultData.hero.buttons
                    },
                    welcome: {
                        title: welcome.title || "Welcome",
                        paragraphs: paragraphs.length > 0 ? paragraphs : [""],
                        signatureImage: welcome.signatureImage || "",
                        signatureText: welcome.signatureText || "School Principal",
                        stats: welcome.stats || defaultData.welcome.stats
                    },
                    facilities: { list: content.facilities?.list || [] },
                    playground: content.playground || defaultPlayground
                });
            } catch (error) {
                console.error("Failed to load home data:", error);
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
            if (event.data?.type === "REQUEST_HOME_DATA") sendPreviewData();
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
            console.log('Saving to API:', apiUrl);

            // Prepare sections for batch update
            const sections = {
                hero: data.hero,
                welcome: {
                    ...data.welcome,
                    intro1: data.welcome.paragraphs[0] || "",
                    intro2: data.welcome.paragraphs[1] || ""
                },
                facilities: data.facilities,
                playground: data.playground
            };

            console.log('Sections to save:', sections);
            const url = `${apiUrl}/api/pages/home/batch`;
            console.log('Full URL:', url);

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sections })
            });

            console.log('Response status:', res.status);

            if (res.ok) {
                const result = await res.json();
                console.log('Save successful:', result);
                alert("Published successfully!");
                setPreviewKey(k => k + 1);
            } else {
                const error = await res.json();
                console.error('Save error:', error);
                alert(`Error saving: ${error.detail || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Error saving - check console for details");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (section: string, index: number, file: File) => {
        setUploading(`${section}-${index}`);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const formData = new FormData(); formData.append("file", file);
            const res = await fetch(`${apiUrl}/api/editor/upload`, { method: "POST", body: formData });
            if (res.ok) {
                const result = await res.json();
                if (section === "hero") updateHeroSlide(index, "image", result.url);
                else if (section === "facility") updateFacility(index, "image", result.url);
                else if (section === "signature") setData({ ...data, welcome: { ...data.welcome, signatureImage: result.url } });
                else if (section === "playground") setData({ ...data, playground: { ...data.playground, image: result.url } });
            } else alert("Upload failed");
        } catch { alert("Upload failed"); } finally { setUploading(null); }
    };

    const toggleSection = (section: keyof typeof openSections) => setOpenSections({ ...openSections, [section]: !openSections[section] });

    // Hero functions
    const updateHeroSlide = (i: number, f: keyof HeroSlide, v: string | number) => { const s = [...data.hero.slides]; s[i] = { ...s[i], [f]: v }; setData({ ...data, hero: { ...data.hero, slides: s } }); };
    const addHeroSlide = () => setData({ ...data, hero: { ...data.hero, slides: [...data.hero.slides, { id: Date.now(), title: "New Slide", subtitle: "", image: "" }] } });
    const removeHeroSlide = (i: number) => { if (data.hero.slides.length > 1) setData({ ...data, hero: { ...data.hero, slides: data.hero.slides.filter((_, idx) => idx !== i) } }); };
    const handleSlideDragStart = (i: number) => setDraggedSlideIndex(i);
    const handleSlideDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); if (draggedSlideIndex === null || draggedSlideIndex === i) return; const s = [...data.hero.slides]; const [r] = s.splice(draggedSlideIndex, 1); s.splice(i, 0, r); setData({ ...data, hero: { ...data.hero, slides: s } }); setDraggedSlideIndex(i); };
    const handleSlideDragEnd = () => setDraggedSlideIndex(null);

    // Hero buttons
    const updateHeroButton = (i: number, f: keyof HeroButton, v: string | boolean) => { const b = [...data.hero.buttons]; b[i] = { ...b[i], [f]: v }; setData({ ...data, hero: { ...data.hero, buttons: b } }); };
    const addHeroButton = () => setData({ ...data, hero: { ...data.hero, buttons: [...data.hero.buttons, { id: Date.now(), text: "New Button", url: "/", color: "#C4A35A", visible: true }] } });
    const removeHeroButton = (i: number) => setData({ ...data, hero: { ...data.hero, buttons: data.hero.buttons.filter((_, idx) => idx !== i) } });

    // Welcome functions
    const updateWelcomeParagraph = (i: number, v: string) => { const p = [...data.welcome.paragraphs]; p[i] = v; setData({ ...data, welcome: { ...data.welcome, paragraphs: p } }); };
    const addWelcomeParagraph = () => setData({ ...data, welcome: { ...data.welcome, paragraphs: [...data.welcome.paragraphs, ""] } });
    const removeWelcomeParagraph = (i: number) => { if (data.welcome.paragraphs.length > 1) setData({ ...data, welcome: { ...data.welcome, paragraphs: data.welcome.paragraphs.filter((_, idx) => idx !== i) } }); };
    const updateWelcomeStat = (i: number, f: keyof Stat, v: string) => { const s = [...data.welcome.stats]; s[i] = { ...s[i], [f]: v }; setData({ ...data, welcome: { ...data.welcome, stats: s } }); };
    const addWelcomeStat = () => setData({ ...data, welcome: { ...data.welcome, stats: [...data.welcome.stats, { number: "0", label: "New Stat" }] } });
    const removeWelcomeStat = (i: number) => { if (data.welcome.stats.length > 1) setData({ ...data, welcome: { ...data.welcome, stats: data.welcome.stats.filter((_, idx) => idx !== i) } }); };

    // Facilities functions
    const updateFacility = (i: number, f: keyof Facility, v: string) => { const l = [...data.facilities.list]; l[i] = { ...l[i], [f]: v }; setData({ ...data, facilities: { list: l } }); };
    const addFacility = () => setData({ ...data, facilities: { list: [...data.facilities.list, { title: "New Facility", description: "", image: "" }] } });
    const removeFacility = (i: number) => setData({ ...data, facilities: { list: data.facilities.list.filter((_, idx) => idx !== i) } });

    // Playground functions
    const updatePlaygroundFeature = (i: number, v: string) => { const f = [...data.playground.features]; f[i] = { ...f[i], text: v }; setData({ ...data, playground: { ...data.playground, features: f } }); };
    const addPlaygroundFeature = () => setData({ ...data, playground: { ...data.playground, features: [...data.playground.features, { icon: "check", text: "" }] } });
    const removePlaygroundFeature = (i: number) => setData({ ...data, playground: { ...data.playground, features: data.playground.features.filter((_, idx) => idx !== i) } });

    // Zoom controls
    const zoomIn = () => setPreviewZoom(z => Math.min(z + 10, 100));
    const zoomOut = () => setPreviewZoom(z => Math.max(z - 10, 30));

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="w-8 h-8 border-2 border-[#C4A35A]/30 border-t-[#C4A35A] rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <input type="file" accept="image/*" ref={signatureFileInput} onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload("signature", 0, f); }} className="hidden" />
            <input type="file" accept="image/*" ref={playgroundFileInput} onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload("playground", 0, f); }} className="hidden" />

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

                    {/* HERO SECTION */}
                    <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <button onClick={() => toggleSection('hero')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#C4A35A] rounded-lg flex items-center justify-center text-white font-bold text-sm">1</div><span className="font-semibold text-gray-700">Hero Banner</span></div>
                            <ChevronIcon open={openSections.hero} />
                        </button>
                        {openSections.hero && (
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-3">Slides (Drag to reorder)</label>
                                    <div className="space-y-3">
                                        {data.hero.slides.map((slide, i) => (
                                            <div key={slide.id || i} draggable onDragStart={() => handleSlideDragStart(i)} onDragOver={e => handleSlideDragOver(e, i)} onDragEnd={handleSlideDragEnd} className={`border border-gray-200 rounded-lg p-4 cursor-move ${draggedSlideIndex === i ? 'opacity-50 border-[#C4A35A]' : ''}`}>
                                                <input type="file" accept="image/*" ref={el => { heroFileInputs.current[i] = el; }} onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload("hero", i, f); }} className="hidden" />
                                                <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><DragIcon /><span className="text-xs text-gray-500 uppercase">Slide {i + 1}</span></div><button onClick={() => removeHeroSlide(i)} className="text-red-400 hover:text-red-600 p-1"><TrashIcon /></button></div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <input type="text" value={slide.title} onChange={e => updateHeroSlide(i, "title", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Title" />
                                                    <textarea value={slide.subtitle} onChange={e => updateHeroSlide(i, "subtitle", e.target.value)} rows={2} className="px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="Subtitle" />
                                                    <div className="flex gap-2"><input type="text" value={slide.image} onChange={e => updateHeroSlide(i, "image", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Image URL" /><button onClick={() => heroFileInputs.current[i]?.click()} className="px-3 py-2 bg-[#C4A35A] text-white text-sm rounded-lg flex-shrink-0">{uploading === `hero-${i}` ? '...' : 'Upload'}</button></div>
                                                    {slide.image && (
                                                        <div className="mt-2 h-32 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                                                            <Image src={slide.image} alt={slide.title || `Slide ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={addHeroSlide} className="mt-3 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Slide</button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-3">CTA Buttons</label>
                                    <div className="space-y-2">
                                        {data.hero.buttons.map((btn, i) => (
                                            <div key={btn.id || i} className="border border-gray-200 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={btn.visible} onChange={e => updateHeroButton(i, "visible", e.target.checked)} className="w-4 h-4" />{btn.visible ? 'Visible' : 'Hidden'}</label><button onClick={() => removeHeroButton(i)} className="text-red-400 hover:text-red-600 p-1"><TrashIcon /></button></div>
                                                <div className="grid grid-cols-3 gap-2"><input type="text" value={btn.text} onChange={e => updateHeroButton(i, "text", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Text" /><input type="text" value={btn.url} onChange={e => updateHeroButton(i, "url", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="URL" /><div className="flex gap-1"><input type="color" value={btn.color} onChange={e => updateHeroButton(i, "color", e.target.value)} className="w-10 h-full rounded border cursor-pointer" /><input type="text" value={btn.color} onChange={e => updateHeroButton(i, "color", e.target.value)} className="flex-1 min-w-0 px-2 py-2 border border-gray-200 rounded-lg text-xs font-mono" /></div></div>
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={addHeroButton} className="mt-3 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Button</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* WELCOME SECTION */}
                    <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <button onClick={() => toggleSection('welcome')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#C4A35A] rounded-lg flex items-center justify-center text-white font-bold text-sm">2</div><span className="font-semibold text-gray-700">Welcome Section</span></div>
                            <ChevronIcon open={openSections.welcome} />
                        </button>
                        {openSections.welcome && (
                            <div className="p-6 space-y-5">
                                <div><label className="block text-sm font-medium text-gray-600 mb-2">Title</label><input type="text" value={data.welcome.title} onChange={e => setData({ ...data, welcome: { ...data.welcome, title: e.target.value } })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" /></div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Paragraphs</label>
                                    {data.welcome.paragraphs.map((p, i) => (<div key={i} className="flex gap-2 mb-2"><textarea value={p} onChange={e => updateWelcomeParagraph(i, e.target.value)} rows={2} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" />{data.welcome.paragraphs.length > 1 && <button onClick={() => removeWelcomeParagraph(i)} className="text-red-400 hover:text-red-600"><TrashIcon /></button>}</div>))}
                                    <button onClick={addWelcomeParagraph} className="px-3 py-1.5 border border-dashed border-gray-300 rounded text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm">+ Add Paragraph</button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Statistics</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {data.welcome.stats.map((s, i) => (<div key={i} className="border border-gray-200 rounded-lg p-3"><div className="flex justify-between mb-2"><span className="text-xs text-gray-400">Stat {i + 1}</span>{data.welcome.stats.length > 1 && <button onClick={() => removeWelcomeStat(i)} className="text-red-400"><TrashIcon /></button>}</div><input type="text" value={s.number} onChange={e => updateWelcomeStat(i, "number", e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-lg font-bold text-[#C4A35A] mb-1" /><input type="text" value={s.label} onChange={e => updateWelcomeStat(i, "label", e.target.value)} className="w-full px-2 py-1 border border-gray-200 rounded text-sm" /></div>))}
                                    </div>
                                    <button onClick={addWelcomeStat} className="mt-2 px-3 py-1.5 border border-dashed border-gray-300 rounded text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm">+ Add Stat</button>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Signature</label>
                                    <div className="grid grid-cols-2 gap-3"><div><div className="flex gap-2"><input type="text" value={data.welcome.signatureImage} onChange={e => setData({ ...data, welcome: { ...data.welcome, signatureImage: e.target.value } })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Image URL" /><button onClick={() => signatureFileInput.current?.click()} className="px-3 py-2 bg-[#C4A35A] text-white text-sm rounded-lg">{uploading === 'signature-0' ? '...' : 'Upload'}</button></div></div><div><input type="text" value={data.welcome.signatureText} onChange={e => setData({ ...data, welcome: { ...data.welcome, signatureText: e.target.value } })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Signature text" /></div></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* FACILITIES SECTION */}
                    <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <button onClick={() => toggleSection('facilities')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#C4A35A] rounded-lg flex items-center justify-center text-white font-bold text-sm">3</div><span className="font-semibold text-gray-700">Facilities</span></div>
                            <ChevronIcon open={openSections.facilities} />
                        </button>
                        {openSections.facilities && (
                            <div className="p-6">
                                <div className="space-y-3">
                                    {data.facilities.list.map((f, i) => (
                                        <div key={i} className="border border-gray-200 rounded-lg p-4">
                                            <input type="file" accept="image/*" ref={el => { facilityFileInputs.current[i] = el; }} onChange={e => { const file = e.target.files?.[0]; if (file) handleImageUpload("facility", i, file); }} className="hidden" />
                                            <div className="flex justify-between mb-2"><span className="text-xs text-gray-500 uppercase">Facility {i + 1}</span><button onClick={() => removeFacility(i)} className="text-red-400 hover:text-red-600"><TrashIcon /></button></div>
                                            <div className="grid gap-2"><input type="text" value={f.title} onChange={e => updateFacility(i, "title", e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Title" /><textarea value={f.description} onChange={e => updateFacility(i, "description", e.target.value)} rows={2} className="px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none" placeholder="Description" /><div className="flex gap-2"><input type="text" value={f.image} onChange={e => updateFacility(i, "image", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Image URL" /><button onClick={() => facilityFileInputs.current[i]?.click()} className="px-3 py-2 bg-[#C4A35A] text-white text-sm rounded-lg">{uploading === `facility-${i}` ? '...' : 'Upload'}</button></div>{f.image && (<div className="mt-2 h-24 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200"><Image src={f.image} alt={f.title || `Facility ${i + 1}`} fill style={{ objectFit: 'cover' }} /></div>)}</div>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addFacility} className="mt-3 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Facility</button>
                            </div>
                        )}
                    </div>

                    {/* PLAYGROUND SECTION */}
                    <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <button onClick={() => toggleSection('playground')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#C4A35A] rounded-lg flex items-center justify-center text-white font-bold text-sm">4</div><span className="font-semibold text-gray-700">Playground Highlight</span></div>
                            <ChevronIcon open={openSections.playground} />
                        </button>
                        {openSections.playground && (
                            <div className="p-6 space-y-4">
                                <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">This appears as a golden gradient banner at the bottom of the facilities section.</p>
                                <div><label className="block text-sm font-medium text-gray-600 mb-2">Title</label><input type="text" value={data.playground.title} onChange={e => setData({ ...data, playground: { ...data.playground, title: e.target.value } })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" placeholder="Safe & Spacious Playground" /></div>
                                <div><label className="block text-sm font-medium text-gray-600 mb-2">Description</label><textarea value={data.playground.description} onChange={e => setData({ ...data, playground: { ...data.playground, description: e.target.value } })} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg resize-none" placeholder="Our 2-acre playground provides ample space..." /></div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Features (with checkmark icons)</label>
                                    <div className="space-y-2">
                                        {data.playground.features.map((f, i) => (<div key={i} className="flex gap-2 items-center"><div className="w-6 h-6 bg-[#C4A35A]/20 rounded flex items-center justify-center"><svg className="w-3 h-3 text-[#C4A35A]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div><input type="text" value={f.text} onChange={e => updatePlaygroundFeature(i, e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Feature..." /><button onClick={() => removePlaygroundFeature(i)} className="text-red-400 hover:text-red-600"><TrashIcon /></button></div>))}
                                    </div>
                                    <button onClick={addPlaygroundFeature} className="mt-2 px-3 py-1.5 border border-dashed border-gray-300 rounded text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm">+ Add Feature</button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-600 mb-2">Button Text</label><input type="text" value={data.playground.buttonText} onChange={e => setData({ ...data, playground: { ...data.playground, buttonText: e.target.value } })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="View All Facilities" /></div>
                                    <div><label className="block text-sm font-medium text-gray-600 mb-2">Button URL</label><input type="text" value={data.playground.buttonUrl} onChange={e => setData({ ...data, playground: { ...data.playground, buttonUrl: e.target.value } })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="/facilities" /></div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-2">Background Image</label>
                                    <div className="flex gap-2"><input type="text" value={data.playground.image} onChange={e => setData({ ...data, playground: { ...data.playground, image: e.target.value } })} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="/facility-playground.jpg" /><button onClick={() => playgroundFileInput.current?.click()} className="px-4 py-2 bg-[#C4A35A] text-white text-sm rounded-lg">{uploading === 'playground-0' ? '...' : 'Upload'}</button></div>
                                    {data.playground.image && <div className="mt-2 h-24 bg-gray-100 rounded-lg overflow-hidden relative"><Image src={data.playground.image} alt="" className="w-full h-full object-cover" fill style={{ objectFit: 'cover' }} /><div className="absolute inset-0 bg-gradient-to-r from-[#C4A35A]/60 to-[#A38842]/60"></div></div>}
                                </div>
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
                                    <button onClick={() => setFullscreenPreview(true)} className="p-1.5 hover:bg-gray-200 rounded" title="Fullscreen"><svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg></button>
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
