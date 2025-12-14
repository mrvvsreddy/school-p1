"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface FooterLink {
    name: string;
    href: string;
}

interface FooterData {
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
    links: {
        quickLinks: [],
        academics: [],
        resources: []
    },
    contact: {
        phone: "+91 98765 43210",
        email: "info@balayeasuschool.edu",
        address: "123 Education Lane, City"
    },
    socialLinks: []
};

const TrashIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const ChevronIcon = ({ open }: { open: boolean }) => <svg className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;

export default function FooterEditorPage() {
    const [data, setData] = useState<FooterData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [openSections, setOpenSections] = useState({ links: true, contact: false, social: false });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                const res = await fetch(`${apiUrl}/api/pages/shared`);
                const content = await res.json();
                const footer = content.footer || {};

                setData({
                    links: footer.links || defaultData.links,
                    contact: footer.contact || defaultData.contact,
                    socialLinks: footer.socialLinks || defaultData.socialLinks
                });
            } catch (error) {
                console.error("Failed to load footer data:", error);
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
            console.log('Saving footer to API:', apiUrl);

            const res = await fetch(`${apiUrl}/api/pages/shared/footer`, {
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

    const toggleSection = (section: keyof typeof openSections) => setOpenSections({ ...openSections, [section]: !openSections[section] });

    // Link management functions
    const updateLink = (category: keyof FooterData['links'], i: number, f: keyof FooterLink, v: string) => {
        const links = { ...data.links };
        links[category][i] = { ...links[category][i], [f]: v };
        setData({ ...data, links });
    };

    const addLink = (category: keyof FooterData['links']) => {
        const links = { ...data.links };
        links[category] = [...links[category], { name: "New Link", href: "/" }];
        setData({ ...data, links });
    };

    const removeLink = (category: keyof FooterData['links'], i: number) => {
        const links = { ...data.links };
        links[category] = links[category].filter((_, idx) => idx !== i);
        setData({ ...data, links });
    };

    // Social link management
    const updateSocialLink = (i: number, f: keyof FooterLink, v: string) => {
        const social = [...data.socialLinks];
        social[i] = { ...social[i], [f]: v };
        setData({ ...data, socialLinks: social });
    };

    const addSocialLink = () => setData({ ...data, socialLinks: [...data.socialLinks, { name: "Facebook", href: "#" }] });
    const removeSocialLink = (i: number) => setData({ ...data, socialLinks: data.socialLinks.filter((_, idx) => idx !== i) });

    if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-50"><div className="w-8 h-8 border-2 border-[#C4A35A]/30 border-t-[#C4A35A] rounded-full animate-spin"></div></div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="border-b border-gray-200 px-6 py-3 sticky top-0 bg-white z-50">
                <div className="max-w-[900px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/editor" className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg></Link>
                        <span className="text-gray-300">|</span><span className="text-gray-500 text-sm">Editing: Footer</span>
                    </div>
                    <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-[#E55A00] hover:bg-[#cc5000] text-white font-medium rounded-lg disabled:opacity-50">{saving ? "Publishing..." : "Publish"}</button>
                </div>
            </div>

            <div className="max-w-[900px] mx-auto px-6 py-8">
                <div className="mb-8"><label className="text-xs text-[#C4A35A] font-medium uppercase tracking-wider">Component</label><h1 className="text-2xl font-semibold text-gray-800 border-b-2 border-[#C4A35A] py-2">Footer</h1></div>

                {/* Footer Links */}
                <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button onClick={() => toggleSection('links')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#C4A35A] rounded-lg flex items-center justify-center text-white font-bold text-sm">1</div><span className="font-semibold text-gray-700">Footer Links</span></div>
                        <ChevronIcon open={openSections.links} />
                    </button>
                    {openSections.links && (
                        <div className="p-6 space-y-6">
                            {/* Quick Links */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-3">Quick Links</label>
                                <div className="space-y-2">
                                    {data.links.quickLinks.map((link, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input type="text" value={link.name} onChange={e => updateLink('quickLinks', i, "name", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Name" />
                                            <input type="text" value={link.href} onChange={e => updateLink('quickLinks', i, "href", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="URL" />
                                            <button onClick={() => removeLink('quickLinks', i)} className="text-red-400 hover:text-red-600 p-2"><TrashIcon /></button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => addLink('quickLinks')} className="mt-2 px-3 py-1.5 border border-dashed border-gray-300 rounded text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm">+ Add Link</button>
                            </div>

                            {/* Academics Links */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-3">Academics Links</label>
                                <div className="space-y-2">
                                    {data.links.academics.map((link, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input type="text" value={link.name} onChange={e => updateLink('academics', i, "name", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Name" />
                                            <input type="text" value={link.href} onChange={e => updateLink('academics', i, "href", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="URL" />
                                            <button onClick={() => removeLink('academics', i)} className="text-red-400 hover:text-red-600 p-2"><TrashIcon /></button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => addLink('academics')} className="mt-2 px-3 py-1.5 border border-dashed border-gray-300 rounded text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm">+ Add Link</button>
                            </div>

                            {/* Resources Links */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-3">Resources Links</label>
                                <div className="space-y-2">
                                    {data.links.resources.map((link, i) => (
                                        <div key={i} className="flex gap-2">
                                            <input type="text" value={link.name} onChange={e => updateLink('resources', i, "name", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Name" />
                                            <input type="text" value={link.href} onChange={e => updateLink('resources', i, "href", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="URL" />
                                            <button onClick={() => removeLink('resources', i)} className="text-red-400 hover:text-red-600 p-2"><TrashIcon /></button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => addLink('resources')} className="mt-2 px-3 py-1.5 border border-dashed border-gray-300 rounded text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm">+ Add Link</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Contact Info */}
                <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button onClick={() => toggleSection('contact')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#C4A35A] rounded-lg flex items-center justify-center text-white font-bold text-sm">2</div><span className="font-semibold text-gray-700">Contact Information</span></div>
                        <ChevronIcon open={openSections.contact} />
                    </button>
                    {openSections.contact && (
                        <div className="p-6 space-y-4">
                            <div><label className="block text-sm font-medium text-gray-600 mb-2">Phone</label><input type="text" value={data.contact.phone} onChange={e => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-600 mb-2">Email</label><input type="email" value={data.contact.email} onChange={e => setData({ ...data, contact: { ...data.contact, email: e.target.value } })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" /></div>
                            <div><label className="block text-sm font-medium text-gray-600 mb-2">Address</label><input type="text" value={data.contact.address} onChange={e => setData({ ...data, contact: { ...data.contact, address: e.target.value } })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg" /></div>
                        </div>
                    )}
                </div>

                {/* Social Links */}
                <div className="mb-4 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <button onClick={() => toggleSection('social')} className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#C4A35A] rounded-lg flex items-center justify-center text-white font-bold text-sm">3</div><span className="font-semibold text-gray-700">Social Media Links</span></div>
                        <ChevronIcon open={openSections.social} />
                    </button>
                    {openSections.social && (
                        <div className="p-6">
                            <div className="space-y-2">
                                {data.socialLinks.map((link, i) => (
                                    <div key={i} className="flex gap-2">
                                        <input type="text" value={link.name} onChange={e => updateSocialLink(i, "name", e.target.value)} className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Platform" />
                                        <input type="text" value={link.href} onChange={e => updateSocialLink(i, "href", e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="URL" />
                                        <button onClick={() => removeSocialLink(i)} className="text-red-400 hover:text-red-600 p-2"><TrashIcon /></button>
                                    </div>
                                ))}
                            </div>
                            <button onClick={addSocialLink} className="mt-3 px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#C4A35A] hover:text-[#C4A35A] text-sm flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>Add Social Link</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
