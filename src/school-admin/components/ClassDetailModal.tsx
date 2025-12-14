"use client";

import React, { useState } from "react";
import { recentStudents } from "@/school-admin/data/mockData";

interface ClassDetail {
    name: string;
    room: string;
    classTeacher: string;
    studentsCount: number;
    capacity: number;
    attendance: {
        today: number;
        history: number[];
    };
    subjects: { name: string; teacher: string }[];
    schedule: { time: string; subject: string }[];
}

interface ClassDetailModalProps {
    classData: ClassDetail;
    onClose: () => void;
}

export default function ClassDetailModal({ classData, onClose }: ClassDetailModalProps) {
    const [activeTab, setActiveTab] = useState<"Overview" | "Attendance" | "Timetable" | "Students">("Overview");

    if (!classData) return null;

    // Filter students for this class
    const classStudents = recentStudents.filter(s => s.class === classData.name);

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">Class {classData.name}</h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-[#C4A35A]/10 text-[#C4A35A] text-xs font-semibold border border-[#C4A35A]/20">
                                Room {classData.room}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Class Teacher: <span className="font-medium text-gray-800">{classData.classTeacher}</span></p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer text-gray-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 border-b border-gray-100 bg-white">
                    <div className="flex gap-8">
                        {["Overview", "Attendance", "Timetable", "Students"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as "Overview" | "Attendance" | "Timetable" | "Students")}
                                className={`py-4 text-sm font-medium border-b-2 transition-all cursor-pointer ${activeTab === tab
                                    ? "border-[#C4A35A] text-[#C4A35A]"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    {/* --- OVERVIEW TAB --- */}
                    {activeTab === "Overview" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                            {/* Stats */}
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{classData.studentsCount}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total Students</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{classData.attendance.today}%</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Attendance Today</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                </div>
                                <p className="text-3xl font-bold text-gray-900">{classData.capacity}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Class Capacity</p>
                            </div>

                            {/* Subjects List */}
                            <div className="md:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 border-b border-gray-100">
                                    <h3 className="font-semibold text-gray-900">Subjects & Teachers</h3>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {classData.subjects.map((subj, idx) => (
                                        <div key={idx} className="px-6 py-3 flex justify-between items-center hover:bg-gray-50">
                                            <span className="text-sm font-medium text-gray-800">{subj.name}</span>
                                            <span className="text-sm text-gray-500">{subj.teacher}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- ATTENDANCE TAB --- */}
                    {activeTab === "Attendance" && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="text-sm font-semibold text-gray-900 mb-6">Weekly Attendance Trend</h4>
                                <div className="h-64 flex gap-4 px-4">
                                    {classData.attendance.history.map((val: number, i: number) => (
                                        <div key={i} className="flex-1 h-full flex flex-col justify-end items-center gap-2 group relative">
                                            <div className="relative w-full flex-1 flex items-end bg-gray-50 rounded-lg overflow-hidden">
                                                <div
                                                    className="w-full bg-[#C4A35A] rounded-t-lg transition-all duration-500 ease-out group-hover:bg-[#A38842]"
                                                    style={{ height: `${val}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-semibold text-gray-500">Day {i + 1}</span>
                                            <div className="text-xs font-bold text-[#C4A35A] opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-8 mb-2 bg-white px-2 py-1 rounded shadow-md border border-gray-100 z-10">{val}%</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Stats Row */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                                    <p className="text-green-800 font-semibold mb-1">Highest Attendance</p>
                                    <p className="text-2xl font-bold text-green-900">{Math.max(...classData.attendance.history)}%</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                    <p className="text-red-800 font-semibold mb-1">Lowest Attendance</p>
                                    <p className="text-2xl font-bold text-red-900">{Math.min(...classData.attendance.history)}%</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- TIMETABLE TAB --- */}
                    {activeTab === "Timetable" && (
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm animate-fadeIn">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Slot</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject / Activity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {classData.schedule.map((slot, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 w-1/3">
                                                {slot.time}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {slot.subject === "Break" ? (
                                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold uppercase">
                                                        Break
                                                    </span>
                                                ) : (
                                                    <span className="font-medium text-gray-800">{slot.subject}</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* --- STUDENTS TAB --- */}
                    {activeTab === "Students" && (
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm animate-fadeIn">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll No</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {classStudents.length > 0 ? (
                                        classStudents.map((student) => (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#C4A35A]/10 flex items-center justify-center text-[#C4A35A] text-xs font-bold">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                        <span className="font-medium text-sm text-gray-900">{student.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">#{student.rollNo}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${student.status === "Present" ? "bg-green-100 text-green-700"
                                                        : student.status === "Absent" ? "bg-red-100 text-red-700"
                                                            : "bg-yellow-100 text-yellow-700"
                                                        }`}>
                                                        {student.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-gray-500 italic">
                                                No students found assigned to this class in the current records.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
