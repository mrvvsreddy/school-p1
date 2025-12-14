"use client";

import React from "react";
import { studentDistribution, dashboardStats } from "../data/mockData";

export default function StudentsChart() {
    const totalStudents = dashboardStats.students;
    const maleStudents = Math.round((studentDistribution.male / 100) * totalStudents);
    const femaleStudents = Math.round((studentDistribution.female / 100) * totalStudents);

    const malePercentage = studentDistribution.male;
    const circumference = 2 * Math.PI * 35;
    const maleOffset = (malePercentage / 100) * circumference;
    const femaleOffset = ((100 - malePercentage) / 100) * circumference;

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-[#333]">Students</h3>
                <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                </button>
            </div>

            {/* Donut Chart */}
            <div className="flex flex-col items-center">
                <div className="relative w-28 h-28">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="10"
                        />
                        {/* Male segment */}
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke="#C4A35A"
                            strokeWidth="10"
                            strokeDasharray={`${maleOffset} ${circumference}`}
                            strokeLinecap="round"
                        />
                        {/* Female segment */}
                        <circle
                            cx="50"
                            cy="50"
                            r="35"
                            fill="none"
                            stroke="#2D3748"
                            strokeWidth="10"
                            strokeDasharray={`${femaleOffset} ${circumference}`}
                            strokeDashoffset={-maleOffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Legend with numbers */}
                <div className="flex items-center gap-6 mt-4">
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#C4A35A]"></div>
                            <span className="text-xs text-gray-500">Male</span>
                        </div>
                        <span className="text-lg font-bold text-[#333]">{maleStudents}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#2D3748]"></div>
                            <span className="text-xs text-gray-500">Female</span>
                        </div>
                        <span className="text-lg font-bold text-[#333]">{femaleStudents}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
