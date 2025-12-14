"use client";

import React from "react";
import StatsCards from "@/school-admin/components/StatsCards";
import AttendanceChart from "@/school-admin/components/AttendanceChart";
import StudentsChart from "@/school-admin/components/StudentsChart";
import NoticeBoard from "@/school-admin/components/NoticeBoard";
import EventCalendar from "@/school-admin/components/EventCalendar";

export default function AdminDashboard() {
    return (
        <div className="flex gap-4">
            {/* Main Content Area */}
            <div className="flex-1 space-y-4">
                {/* Stats Cards */}
                <StatsCards />

                {/* Charts Row */}
                <div className="grid grid-cols-12 gap-4">
                    {/* Attendance Chart - Takes 8 columns */}
                    <div className="col-span-12 lg:col-span-8">
                        <AttendanceChart />
                    </div>

                    {/* Students Chart - Takes 4 columns */}
                    <div className="col-span-12 lg:col-span-4">
                        <StudentsChart />
                    </div>
                </div>

                {/* Notice Board - Full width */}
                <NoticeBoard />
            </div>

            {/* Right Sidebar - Calendar only */}
            <div className="w-64 flex-shrink-0">
                <EventCalendar />
            </div>
        </div>
    );
}
