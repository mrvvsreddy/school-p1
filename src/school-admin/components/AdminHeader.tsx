"use client";

import React from "react";
import Link from "next/link";
import { adminUser } from "../data/mockData";

export default function AdminHeader() {
    return (
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6">
            {/* Page Title */}
            <h1 className="text-xl font-semibold text-[#333]">Dashboard</h1>

            {/* Actions & Profile */}
            <div className="flex items-center gap-4">
                {/* Site Editor Button */}
                <Link href="/editor">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C4A35A] to-[#8B7355] text-white font-medium rounded-lg hover:shadow-lg transition-all cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Site Editor
                    </button>
                </Link>

                {/* Profile */}
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-semibold text-[#333]">{adminUser.name}</p>
                        <p className="text-xs text-gray-400">{adminUser.role}</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C4A35A] to-[#8B7355] flex items-center justify-center text-white font-semibold cursor-pointer">
                        {adminUser.name.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
}
