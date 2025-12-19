"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const menuItems = [
    { name: "Dashboard", icon: "dashboard", path: "/school-admin" },
    { name: "Applications", icon: "applications", path: "/school-admin/applications", badgeType: "applications" },
    { name: "Contacts", icon: "contacts", path: "/school-admin/contacts", badgeType: "contacts" },
    { name: "Students", icon: "students", path: "/school-admin/students" },
    { name: "Teachers", icon: "teachers", path: "/school-admin/teachers" },
    { name: "Class", icon: "class", path: "/school-admin/class" },
    { name: "Exam", icon: "exam", path: "/school-admin/exam" },
    { name: "Media", icon: "media", path: "/school-admin/media" },
];

const iconMap: Record<string, React.ReactNode> = {
    dashboard: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    ),
    students: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    teachers: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
    ),
    class: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    exam: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
    ),
    media: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    applications: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    contacts: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    logout: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    ),
};

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [badges, setBadges] = useState<{ applications: number; contacts: number }>({ applications: 0, contacts: 0 });

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                // Fetch applications pending count
                const appRes = await fetch(`${API_BASE}/api/applications/stats`, { credentials: 'include' });
                const appData = appRes.ok ? await appRes.json() : { pending_count: 0 };

                // Fetch contacts new count
                const contactRes = await fetch(`${API_BASE}/api/contacts/stats`, { credentials: 'include' });
                const contactData = contactRes.ok ? await contactRes.json() : { new_count: 0 };

                setBadges({
                    applications: appData.pending_count || 0,
                    contacts: contactData.new_count || 0
                });
            } catch (error) {
                console.error("Failed to fetch badge counts:", error);
            }
        };
        fetchBadges();

        // Refresh every 30 seconds
        const interval = setInterval(fetchBadges, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("adminToken");
        localStorage.removeItem("user");
        router.push("/");
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-52 bg-white border-r border-gray-100 flex flex-col z-50">
            {/* Main Menu */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto">
                <ul className="space-y-0.5">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        const badgeCount = item.badgeType ? badges[item.badgeType as keyof typeof badges] : 0;
                        const showBadge = badgeCount > 0;

                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all relative ${isActive
                                        ? "bg-[#C4A35A] text-white shadow-sm"
                                        : "text-[#666] hover:bg-gray-50 hover:text-[#333]"
                                        }`}
                                >
                                    {iconMap[item.icon]}
                                    <span className="font-medium">{item.name}</span>
                                    {showBadge && (
                                        <span className="absolute right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom Menu - Logout Button */}
            <div className="p-3 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-red-500 hover:bg-red-50 w-full cursor-pointer"
                >
                    {iconMap.logout}
                    <span className="font-medium">Log out</span>
                </button>
            </div>
        </aside>
    );
}
