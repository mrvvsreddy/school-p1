"use client";

import React, { useState, useRef } from "react";

// Fixed daily attendance data
const dailyAttendanceData = [
    { day: 1, male: 660, female: 540 },
    { day: 2, male: 675, female: 535 },
    { day: 3, male: 665, female: 550 },
    { day: 4, male: 680, female: 545 },
    { day: 5, male: 670, female: 530 },
    { day: 6, male: 685, female: 555 },
    { day: 7, male: 675, female: 540 },
    { day: 8, male: 660, female: 535 },
    { day: 9, male: 680, female: 550 },
    { day: 10, male: 670, female: 545 },
    { day: 11, male: 685, female: 530 },
    { day: 12, male: 675, female: 555 },
    { day: 13, male: 660, female: 540 },
    { day: 14, male: 680, female: 535 },
    { day: 15, male: 670, female: 550 },
    { day: 16, male: 685, female: 545 },
    { day: 17, male: 675, female: 530 },
    { day: 18, male: 660, female: 555 },
    { day: 19, male: 680, female: 540 },
    { day: 20, male: 670, female: 535 },
    { day: 21, male: 685, female: 550 },
    { day: 22, male: 675, female: 545 },
    { day: 23, male: 660, female: 530 },
    { day: 24, male: 680, female: 555 },
    { day: 25, male: 670, female: 540 },
    { day: 26, male: 685, female: 535 },
    { day: 27, male: 675, female: 550 },
    { day: 28, male: 660, female: 545 },
];

const totalStudents = 1260;
// Derive specific totals based on 55% Male / 45% Female split from StudentsChart
const totalMales = Math.round(totalStudents * 0.55);   // ~693
const totalFemales = Math.round(totalStudents * 0.45); // ~567

export default function AttendanceChart() {
    const [filter, setFilter] = useState<"days" | "week" | "month">("days");
    const [tooltip, setTooltip] = useState<{
        visible: boolean;
        x: number;
        y: number;
        data: { male: number; female: number; total: number; label: string } | null;
    }>({ visible: false, x: 0, y: 0, data: null });

    const containerRef = useRef<HTMLDivElement>(null);

    const getData = () => {
        if (filter === "week") {
            const weeks = [];
            for (let i = 0; i < dailyAttendanceData.length; i += 7) {
                const weekData = dailyAttendanceData.slice(i, i + 7);
                const avgMale = Math.round(weekData.reduce((sum, d) => sum + d.male, 0) / weekData.length);
                const avgFemale = Math.round(weekData.reduce((sum, d) => sum + d.female, 0) / weekData.length);
                weeks.push({ label: `W${weeks.length + 1}`, male: avgMale, female: avgFemale, total: avgMale + avgFemale });
            }
            return weeks;
        } else if (filter === "month") {
            return [
                { label: "Jan", male: 680, female: 545, total: 1225 },
                { label: "Feb", male: 675, female: 540, total: 1215 },
                { label: "Mar", male: 690, female: 555, total: 1245 },
                { label: "Apr", male: 685, female: 548, total: 1233 },
                { label: "May", male: 670, female: 535, total: 1205 },
                { label: "Jun", male: 695, female: 560, total: 1255 },
                { label: "Jul", male: 688, female: 552, total: 1240 },
                { label: "Aug", male: 678, female: 542, total: 1220 },
                { label: "Sep", male: 692, female: 558, total: 1250 },
                { label: "Oct", male: 683, female: 547, total: 1230 },
                { label: "Nov", male: 687, female: 553, total: 1240 },
                { label: "Dec", male: 693, female: 557, total: 1250 },
            ];
        }
        return dailyAttendanceData.map(d => ({
            label: String(d.day),
            male: d.male,
            female: d.female,
            total: d.male + d.female
        }));
    };

    const data = getData();
    const barWidth = 48;
    const gap = 16;
    const chartHeight = 200;

    interface AttendanceItem {
        label: string;
        male: number;
        female: number;
        total: number;
    }

    const handleMouseEnter = (e: React.MouseEvent, item: AttendanceItem) => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const targetRect = (e.currentTarget as HTMLElement).getBoundingClientRect();

        const x = targetRect.right - containerRect.left;
        const y = targetRect.top - containerRect.top + (targetRect.height / 2);

        setTooltip({
            visible: true,
            x: x,
            y: y,
            data: item
        });
    };

    const handleMouseLeave = () => {
        setTooltip((prev) => ({ ...prev, visible: false }));
    };

    return (
        <div ref={containerRef} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 relative z-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-base font-semibold text-[#333]">Attendance</h3>
                    <p className="text-xs text-gray-500">Daily attendance overview</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-gray-100 rounded-lg p-0.5">
                        {(["days", "week", "month"] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${filter === f
                                    ? "bg-[#C4A35A] text-white"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#C4A35A]"></div>
                            <span className="text-xs text-gray-500">Male</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#2D3748]"></div>
                            <span className="text-xs text-gray-500">Female</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Container */}
            <div className="flex" style={{ height: `${chartHeight}px` }}>
                {/* Y-axis labels */}
                <div className="flex flex-col justify-between text-[10px] text-gray-400 pr-3 text-right" style={{ width: '40px', height: '100%', paddingBottom: '24px' }}>
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                    <span>0%</span>
                </div>

                {/* Main Scrollable Area */}
                <div className="flex-1 relative min-w-0 h-full">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none" style={{ paddingBottom: '24px' }}>
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="border-b border-gray-50 w-full h-0"></div>
                        ))}
                    </div>

                    {/* Scroll View */}
                    <div
                        className="absolute inset-0 overflow-x-auto scrollbar-thin"
                        style={{ scrollbarWidth: 'thin' }}
                    >
                        <div
                            className="flex items-end h-full"
                            style={{
                                width: 'max-content',
                                minWidth: '100%',
                                paddingBottom: '24px',
                                paddingRight: '16px'
                            }}
                        >
                            {data.map((item, index) => {
                                // Calculate percentage relative to Specific Gender Total
                                const malePercent = Math.min((item.male / totalMales) * 100, 100);
                                const femalePercent = Math.min((item.female / totalFemales) * 100, 100);

                                return (
                                    <div
                                        key={index}
                                        className="relative flex flex-col items-center justify-end h-full group"
                                        style={{
                                            width: `${barWidth}px`,
                                            marginRight: `${gap}px`,
                                            flexShrink: 0
                                        }}
                                        onMouseEnter={(e) => handleMouseEnter(e, item)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        {/* Bars */}
                                        <div className="flex items-end justify-center w-full gap-1 h-full">
                                            <div
                                                className="w-5 rounded-t cursor-pointer transition-all duration-300 hover:opacity-80"
                                                style={{
                                                    height: `${malePercent}%`,
                                                    backgroundColor: '#C4A35A'
                                                }}
                                            ></div>
                                            <div
                                                className="w-5 rounded-t cursor-pointer transition-all duration-300 hover:opacity-80"
                                                style={{
                                                    height: `${femalePercent}%`,
                                                    backgroundColor: '#2D3748'
                                                }}
                                            ></div>
                                        </div>

                                        {/* X-Label */}
                                        <div className="absolute top-full mt-2 text-[10px] text-gray-400 font-medium">
                                            {item.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Tooltip */}
            {tooltip.visible && tooltip.data && (
                <div
                    className="absolute z-50 bg-[#333] text-white text-xs rounded-lg px-3 py-2 shadow-xl pointer-events-none"
                    style={{
                        left: `${tooltip.x + 10}px`,
                        top: `${tooltip.y}px`,
                        transform: 'translateY(-50%)',
                    }}
                >
                    <div className="font-bold mb-1">
                        {Math.round((tooltip.data.total / totalStudents) * 100)}% Attendance
                    </div>
                    <div className="flex gap-3 text-[10px] text-gray-300">
                        <span>Male: {tooltip.data.male}</span>
                        <span>Female: {tooltip.data.female}</span>
                    </div>
                    {/* Arrow */}
                    <div
                        className="absolute right-full top-1/2 -mt-1 border-4 border-transparent border-r-[#333]"
                    ></div>
                </div>
            )}
        </div>
    );
}
