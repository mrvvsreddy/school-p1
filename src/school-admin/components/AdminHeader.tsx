"use client";

import React from "react";
import { adminUser } from "../data/mockData";

export default function AdminHeader() {
    return (
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6">
            {/* Page Title */}
            <h1 className="text-xl font-semibold text-[#333]">Dashboard</h1>

            {/* Profile Only */}
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-semibold text-[#333]">{adminUser.name}</p>
                    <p className="text-xs text-gray-400">{adminUser.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C4A35A] to-[#8B7355] flex items-center justify-center text-white font-semibold cursor-pointer">
                    {adminUser.name.charAt(0)}
                </div>
            </div>
        </header>
    );
}
