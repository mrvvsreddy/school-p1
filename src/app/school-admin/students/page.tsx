"use client";

import React, { useState } from "react";
import { recentStudents } from "@/school-admin/data/mockData";
import StudentDetailModal from "@/school-admin/components/StudentDetailModal";
import AddStudentModal from "@/school-admin/components/AddStudentModal";

export default function StudentsPage() {
    // State
    const [students, setStudents] = useState<any[]>(recentStudents);
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All"); // All, Present, Absent, Leave
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Derived Data
    const totalStudents = students.length;
    const presentToday = students.filter(s => s.status === "Present").length;
    const absentToday = students.filter(s => s.status === "Absent").length;
    const onLeave = students.filter(s => s.status === "Leave").length;

    // Filtering Logic
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.rollNo.includes(searchQuery);
        const matchesClass = classFilter === "All" || student.class === classFilter;
        const matchesStatus = statusFilter === "All" || student.status === statusFilter;

        return matchesSearch && matchesClass && matchesStatus;
    });

    // Handlers
    const handleAddStudent = (newStudent: any) => {
        const studentWithId = { ...newStudent, id: students.length + 1 };
        setStudents([...students, studentWithId]);
    };

    const handleStatClick = (status: string) => {
        setStatusFilter(status === statusFilter ? "All" : status);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[#333]">Students</h1>
                    <p className="text-gray-500 mt-1">Manage all students in the school</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-[#C4A35A] text-white px-6 py-2.5 rounded-xl font-medium hover:bg-[#A38842] transition-colors cursor-pointer flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Student
                </button>
            </div>

            {/* Stats - Clickable Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Students", value: totalStudents, color: "bg-blue-500", filter: "All" },
                    { label: "Present Today", value: presentToday, color: "bg-green-500", filter: "Present" },
                    { label: "Absent Today", value: absentToday, color: "bg-red-500", filter: "Absent" },
                    { label: "On Leave", value: onLeave, color: "bg-yellow-500", filter: "Leave" },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        onClick={() => handleStatClick(stat.filter)}
                        className={`bg-white rounded-xl p-4 shadow-sm border transition-all cursor-pointer ${statusFilter === stat.filter
                                ? "border-[#C4A35A] ring-1 ring-[#C4A35A] bg-[#C4A35A]/5"
                                : "border-gray-100 hover:border-[#C4A35A]/50"
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
                        </div>
                        <p className="text-2xl font-bold text-[#333] mt-2">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Students Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <h3 className="text-lg font-semibold text-[#333]">All Students</h3>

                        <div className="flex items-center gap-3">
                            {/* Class Filter */}
                            <select
                                value={classFilter}
                                onChange={(e) => setClassFilter(e.target.value)}
                                className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C4A35A] cursor-pointer"
                            >
                                <option value="All">All Classes</option>
                                <option value="10-A">10-A</option>
                                <option value="10-B">10-B</option>
                                <option value="9-A">9-A</option>
                                <option value="9-B">9-B</option>
                                <option value="8-A">8-A</option>
                                <option value="8-B">8-B</option>
                            </select>

                            {/* Search Bar */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by name or roll no..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:border-[#C4A35A] w-64"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Roll No</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Parents</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr
                                    key={student.id}
                                    onClick={() => setSelectedStudent(student)}
                                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[#C4A35A]/10 flex items-center justify-center text-[#C4A35A] font-medium text-sm">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm text-[#333]">{student.name}</p>
                                                <p className="text-xs text-gray-400">ID: {student.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                                            {student.class}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">#{student.rollNo}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-gray-700">{student.parents?.father || "N/A"}</span>
                                            <span className="text-[10px] text-gray-400">Father</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{student.contact || "N/A"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === "Present"
                                                ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                                                : student.status === "Absent"
                                                    ? "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                                                    : "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${student.status === "Present" ? "bg-green-600" : student.status === "Absent" ? "bg-red-600" : "bg-yellow-600"
                                                }`}></span>
                                            {student.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No students found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modals */}
            <StudentDetailModal
                student={selectedStudent}
                onClose={() => setSelectedStudent(null)}
                onEdit={() => alert("Edit functionality coming soon")}
            />

            {isAddModalOpen && (
                <AddStudentModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddStudent}
                />
            )}
        </div>
    );
}
