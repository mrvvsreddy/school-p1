"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Student {
    id: string;
    name: string;
    roll_no?: string;
    class_id?: string;
    photo_url?: string;
}

interface Teacher {
    id: string;
    name: string;
    subject?: string;
    employee_id?: string;
    photo_url?: string;
}

interface Exam {
    id: string;
    subject: string;
    grade?: string;
    exam_date?: string;
    status?: string;
}

interface MediaFile {
    name: string;
    url: string;
    path: string;
}

interface DashboardData {
    students: { items: Student[]; total: number };
    teachers: { items: Teacher[]; total: number };
    exams: { items: Exam[]; total: number };
    media: { items: MediaFile[]; total: number };
}

export default function AdminDashboard() {
    const [data, setData] = useState<DashboardData>({
        students: { items: [], total: 0 },
        teachers: { items: [], total: 0 },
        exams: { items: [], total: 0 },
        media: { items: [], total: 0 },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentsRes, teachersRes, examsRes, mediaRes] = await Promise.all([
                    fetch(`${API_BASE}/api/students?page_size=5`, { credentials: 'include' }).catch(() => null),
                    fetch(`${API_BASE}/api/teachers?page_size=5`, { credentials: 'include' }).catch(() => null),
                    fetch(`${API_BASE}/api/exams?page_size=5`, { credentials: 'include' }).catch(() => null),
                    fetch(`${API_BASE}/api/storage/images`, { credentials: 'include' }).catch(() => null),
                ]);

                const students = studentsRes?.ok ? await studentsRes.json() : { students: [], total: 0 };
                const teachers = teachersRes?.ok ? await teachersRes.json() : { teachers: [], total: 0 };
                const exams = examsRes?.ok ? await examsRes.json() : { exams: [], total: 0 };
                const mediaResponse = mediaRes?.ok ? await mediaRes.json() : { images: [], total: 0 };
                const mediaImages = Array.isArray(mediaResponse) ? mediaResponse : (mediaResponse.images || []);

                setData({
                    students: { items: students.students || students.data || [], total: students.total || 0 },
                    teachers: { items: teachers.teachers || teachers.data || [], total: teachers.total || 0 },
                    exams: { items: exams.exams || exams.data || [], total: exams.total || 0 },
                    media: { items: mediaImages.slice(0, 6), total: mediaImages.length || mediaResponse.total || 0 },
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const stats = [
        { label: "Students", value: data.students.total, color: "bg-blue-500", href: "/school-admin/student" },
        { label: "Teachers", value: data.teachers.total, color: "bg-purple-500", href: "/school-admin/teacher" },
        { label: "Exams", value: data.exams.total, color: "bg-amber-500", href: "/school-admin/exam" },
        { label: "Media Files", value: data.media.total, color: "bg-green-500", href: "/school-admin/media" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-8 h-8 border-4 border-[#43a047] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                                <span className="text-lg font-bold">{stat.value > 99 ? '99+' : stat.value}</span>
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-[#333]">{stat.value}</p>
                        <p className="text-xs text-[#43a047] mt-1">View all →</p>
                    </Link>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Students */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-[#333]">Recent Students</h3>
                        <Link href="/school-admin/student" className="text-xs text-[#43a047] hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {data.students.items.length > 0 ? (
                            data.students.items.slice(0, 5).map((student) => (
                                <div key={student.id} className="p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium overflow-hidden">
                                        {student.photo_url ? (
                                            <Image src={student.photo_url} alt={student.name} width={36} height={36} className="w-full h-full object-cover" />
                                        ) : (
                                            student.name?.charAt(0).toUpperCase() || 'S'
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#333] truncate">{student.name}</p>
                                        <p className="text-xs text-gray-400">{student.roll_no || 'Student'}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">No students found</div>
                        )}
                    </div>
                </div>

                {/* Recent Teachers */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-[#333]">Recent Teachers</h3>
                        <Link href="/school-admin/teacher" className="text-xs text-[#43a047] hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {data.teachers.items.length > 0 ? (
                            data.teachers.items.slice(0, 5).map((teacher) => (
                                <div key={teacher.id} className="p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-sm font-medium overflow-hidden">
                                        {teacher.photo_url ? (
                                            <Image src={teacher.photo_url} alt={teacher.name} width={36} height={36} className="w-full h-full object-cover" />
                                        ) : (
                                            teacher.name?.charAt(0).toUpperCase() || 'T'
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#333] truncate">{teacher.name}</p>
                                        <p className="text-xs text-gray-400">{teacher.subject || teacher.employee_id || 'Teacher'}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">No teachers found</div>
                        )}
                    </div>
                </div>

                {/* Recent Exams */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-[#333]">Recent Exams</h3>
                        <Link href="/school-admin/exam" className="text-xs text-[#43a047] hover:underline">View All</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {data.exams.items.length > 0 ? (
                            data.exams.items.slice(0, 5).map((exam) => (
                                <div key={exam.id} className="p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-medium ${exam.status === 'Completed' ? 'bg-green-500' :
                                        exam.status === 'Scheduled' ? 'bg-blue-500' : 'bg-gray-400'
                                        }`}>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#333] truncate">{exam.subject}</p>
                                        <p className="text-xs text-gray-400">{exam.grade} • {exam.status || 'Draft'}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">No exams found</div>
                        )}
                    </div>
                </div>

                {/* Media Gallery */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-semibold text-[#333]">Media Library</h3>
                        <Link href="/school-admin/media" className="text-xs text-[#43a047] hover:underline">View All</Link>
                    </div>
                    <div className="p-3">
                        {data.media.items.length > 0 ? (
                            <div className="grid grid-cols-3 gap-2">
                                {data.media.items.slice(0, 6).map((file, i) => (
                                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group">
                                        {file.name.match(/\.(mp4|webm|mov)$/i) ? (
                                            <video src={file.url} className="w-full h-full object-cover" muted />
                                        ) : (
                                            <Image src={file.url} alt={file.name} fill className="object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-400 text-sm">No media files found</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
