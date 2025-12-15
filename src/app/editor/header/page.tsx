"use client";

import React, { useState, useEffect, useRef } from "react";
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

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="w-8 h-8 border-2 border-[#C4A35A]/30 border-t-[#C4A35A] rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <input type="file" accept="image/*" ref={logoFileInput} onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} className="hidden" />

            <div className="border-b border-gray-200 px-6 py-3 sticky top-0 bg-white z-50">
                <div className="max-w-[900px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/editor" className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></Link>
                        <span className="text-gray-300">|</span><span className="text-gray-500 text-sm">Editing: Header</span>
                    </div>
                    <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#E55A00] hover:bg-[#cc5000] text-white font-medium rounded-lg disabled:opacity-50">{saving ? "Publishing..." : "Publish"}</button>
                </div>
            </div>

            <div className="max-w-[900px] mx-auto px-6 py-8">
                <div className="mb-8"><label className="text-xs text-[#C4A35A] font-medium uppercase tracking-wider">Component</label><h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#C4A35A] py-2">Header</h1></div>

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
                                <label className="block text-sm font-medium text-gray-600 mb-2">Preview</label>
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
    );
}
