"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { name: "Dashboard", icon: "dashboard", path: "/school-admin" },
    { name: "Students", icon: "students", path: "/school-admin/students" },
    { name: "Teachers", icon: "teachers", path: "/school-admin/teachers" },
    { name: "Class", icon: "class", path: "/school-admin/class" },
    { name: "Exam", icon: "exam", path: "/school-admin/exam" },
    { name: "Transport", icon: "transport", path: "/school-admin/transport" },
    { name: "Notice", icon: "notice", path: "/school-admin/notice" },
];

const bottomMenuItems = [
    { name: "Settings", icon: "settings", path: "/school-admin/settings" },
    { name: "Log out", icon: "logout", path: "/" },
];

const iconMap: Record<string, React.ReactNode> = {
    dashboard: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    ),
    students: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
    ),
    teachers: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
    ),
    parents: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    account: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    class: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    exam: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
    ),
    transport: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
    ),
    notice: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
    ),
    settings: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    logout: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    ),
};

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
                <Link href="/school-admin" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C4A35A] to-[#8B7355] rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">B</span>
                    </div>
                    <span className="text-xl font-bold text-[#333]" style={{ fontFamily: "var(--font-playfair)" }}>
                        BalaYesu
                    </span>
                </Link>
            </div>

            {/* Main Menu */}
            <nav className="flex-1 py-6 px-4 overflow-y-auto">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? "bg-[#C4A35A] text-white shadow-lg shadow-[#C4A35A]/30"
                                        : "text-[#666] hover:bg-gray-50 hover:text-[#333]"
                                        }`}
                                >
                                    {iconMap[item.icon]}
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom Menu */}
            <div className="p-4 border-t border-gray-100">
                <ul className="space-y-1">
                    {bottomMenuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <li key={item.name}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? "bg-[#C4A35A] text-white"
                                        : item.name === "Log out"
                                            ? "text-red-500 hover:bg-red-50"
                                            : "text-[#666] hover:bg-gray-50 hover:text-[#333]"
                                        }`}
                                >
                                    {iconMap[item.icon]}
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}
