"use client";

import React, { useState } from "react";

const daysOfWeek = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function EventCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startingDay = firstDay.getDay() - 1;
    if (startingDay < 0) startingDay = 6;

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const isToday = (day: number) => {
        return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            {/* Month & Year Navigation */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-base font-semibold text-[#333]">{monthNames[month]}</h3>
                    <p className="text-xs text-gray-500">{year}</p>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={prevMonth}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                {/* Day headers */}
                {daysOfWeek.map((day) => (
                    <div key={day} className="text-center text-[10px] text-gray-400 py-1 font-medium">
                        {day}
                    </div>
                ))}

                {/* Days */}
                {calendarDays.map((day, index) => (
                    <div key={index} className="aspect-square flex items-center justify-center">
                        {day !== null && (
                            <button
                                className={`w-7 h-7 rounded-full text-xs font-medium transition-all cursor-pointer ${isToday(day)
                                        ? "bg-[#C4A35A] text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {day}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
