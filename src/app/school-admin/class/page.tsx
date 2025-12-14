"use client";

import React, { useState } from "react";
import { classes } from "@/school-admin/data/mockData";
import ClassDetailModal from "@/school-admin/components/ClassDetailModal";
import AddClassModal from "@/school-admin/components/AddClassModal";

interface ClassData {
    id: number;
    name: string;
    grade: string;
    section: string;
    classTeacher: string;
    studentsCount: number;
    capacity: number;
    room: string;
    attendance: {
        today: number;
        history: number[];
    };
    subjects: { name: string; teacher: string }[];
    schedule: { time: string; subject: string }[];
}

export default function ClassesPage() {
    const [classList, setClassList] = useState<ClassData[]>(classes);
    const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredClasses = classList.filter(cls =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.classTeacher.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddClass = (newClass: ClassData) => {
        const classWithMockData = {
            ...newClass,
            id: classList.length + 1,
            studentsCount: 0,
            attendance: { today: 0, history: [0, 0, 0, 0, 0, 0, 0] },
            subjects: [],
            schedule: []
        };
        setClassList([...classList, classWithMockData]);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#333]">Classes</h1>
                    <p className="text-gray-500 mt-1">Manage classes, sections, and timetables</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#C4A35A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#A38842] transition-colors cursor-pointer flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Add Class
                </button>
            </div>

            {/* List View Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-[#333]">All Classes</h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search class or teacher..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C4A35A] w-64"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class Name</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class Teacher</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Students</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredClasses.length > 0 ? (
                            filteredClasses.map((cls) => (
                                <tr
                                    key={cls.id}
                                    onClick={() => setSelectedClass(cls)}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#C4A35A]/10 flex items-center justify-center text-[#C4A35A] font-bold text-sm">
                                                {cls.name}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{cls.grade}</p>
                                                <p className="text-xs text-gray-500">Section {cls.section}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                        {cls.classTeacher}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">{cls.studentsCount}</span>
                                            <span className="text-gray-400">/ {cls.capacity}</span>
                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full ml-2">
                                                <div
                                                    className="h-full bg-[#C4A35A] rounded-full"
                                                    style={{ width: `${(cls.studentsCount / cls.capacity) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                        {cls.room}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 w-24">
                                            <div className="flex justify-between items-center text-xs mb-0.5">
                                                <span className="font-semibold text-gray-700">{cls.attendance.today}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${cls.attendance.today > 90 ? "bg-green-500" :
                                                        cls.attendance.today > 75 ? "bg-yellow-500" : "bg-red-500"
                                                        }`}
                                                    style={{ width: `${cls.attendance.today}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No classes found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            {selectedClass && (
                <ClassDetailModal
                    classData={selectedClass}
                    onClose={() => setSelectedClass(null)}
                />
            )}

            {isAddModalOpen && (
                <AddClassModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddClass}
                />
            )}
        </div>
    );
}
