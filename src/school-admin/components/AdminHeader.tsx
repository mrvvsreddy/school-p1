"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    image_url?: string;
}

export default function AdminHeader() {
    const [user, setUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        // Try to get user from localStorage first
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                console.error("Failed to parse stored user");
            }
        }
    }, []);

    const displayName = user?.name || "Admin";
    const displayRole = user?.role || "Administrator";
    const initials = displayName.charAt(0).toUpperCase();

    return (
        <header className="h-12 bg-white border-b border-gray-100 flex items-center justify-between px-4">
            {/* Page Title */}
            <h1 className="text-base font-semibold text-[#333]">Dashboard</h1>

            {/* Actions & Profile */}
            <div className="flex items-center gap-3">
                {/* Site Editor Button */}
                <Link href="/editor">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-r from-[#C4A35A] to-[#8B7355] text-white font-medium rounded-lg hover:shadow-md transition-all cursor-pointer">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Site Editor
                    </button>
                </Link>

                {/* Profile */}
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <p className="text-xs font-semibold text-[#333]">{displayName}</p>
                        <p className="text-[10px] text-gray-400 capitalize">{displayRole}</p>
                    </div>
                    {/* Avatar - Image or Initial */}
                    {user?.image_url ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer">
                            <Image
                                src={user.image_url}
                                alt={displayName}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4A35A] to-[#8B7355] flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
                            {initials}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

