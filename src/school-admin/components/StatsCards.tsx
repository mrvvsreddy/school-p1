"use client";

import React from "react";
import { dashboardStats } from "../data/mockData";

const teacherAttendance = {
    present: 208,
    total: 224,
};

const stats = [
    {
        label: "Students",
        value: dashboardStats.students,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
        ),
        color: "bg-blue-500",
    },
    {
        label: "Teachers",
        value: `${teacherAttendance.present}/${teacherAttendance.total}`,
        subLabel: `${Math.round((teacherAttendance.present / teacherAttendance.total) * 100)}% Present`,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
        ),
        color: "bg-purple-500",
    },
    {
        label: "Attendance",
        value: `${dashboardStats.totalAttendance}%`,
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        color: "bg-green-500",
        trend: "+2%",
        trendLabel: "vs last day",
    },
];

export default function StatsCards() {
    return (
        <div className="grid grid-cols-3 gap-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                >
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-gray-500">{stat.label}</p>
                        <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                            {stat.icon}
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-[#333]">{stat.value}</p>
                    {stat.subLabel && (
                        <p className="text-xs text-green-500 font-medium mt-1">{stat.subLabel}</p>
                    )}
                    {stat.trend && (
                        <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs font-medium text-green-500">{stat.trend}</span>
                            <span className="text-xs text-gray-400">{stat.trendLabel}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
