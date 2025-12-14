"use client";

import React, { useState } from "react";

interface StudentDetailModalProps {
    student: any;
    onClose: () => void;
    onEdit: (updatedStudent: any) => void;
}

export default function StudentDetailModal({ student, onClose, onEdit }: StudentDetailModalProps) {
    const [activeTab, setActiveTab] = useState<"Profile" | "Attendance" | "Exams">("Profile");
    const [isEditing, setIsEditing] = useState(false);

    // Edit State
    const [editForm, setEditForm] = useState(student ? { ...student } : {});

    // Exam Filters
    const [examYear, setExamYear] = useState("2023");
    const [examModel, setExamModel] = useState("Final");

    if (!student) return null;

    // --- Data ---
    const attendanceStats = {
        totalDays: 240,
        present: 216,
        absent: 15,
        leave: 9,
        percentage: 90
    };

    // Mock Exam Data Structure
    const allExamResults: any = {
        "2023": {
            "Mid-term": [
                { subject: "Mathematics", marks: 78, total: 100, grade: "B+" },
                { subject: "Science", marks: 82, total: 100, grade: "A" },
                { subject: "English", marks: 75, total: 100, grade: "B+" },
            ],
            "Final": [
                { subject: "Mathematics", marks: 85, total: 100, grade: "A" },
                { subject: "Science", marks: 88, total: 100, grade: "A" },
                { subject: "English", marks: 80, total: 100, grade: "A-" },
            ]
        },
        "2024": {
            "Mid-term": [
                { subject: "Mathematics", marks: 92, total: 100, grade: "A+" },
                { subject: "Science", marks: 90, total: 100, grade: "A+" },
                { subject: "English", marks: 88, total: 100, grade: "A" },
            ],
            "Final": [] // Not yet conducted
        }
    };

    const currentExamResults = allExamResults[examYear]?.[examModel] || [];

    // --- Handlers ---
    const handleSaveProfile = () => {
        onEdit(editForm); // Pass updated data up
        setIsEditing(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name.startsWith("parents.")) {
            const field = name.split(".")[1];
            setEditForm((prev: any) => ({
                ...prev,
                parents: { ...prev.parents, [field]: value }
            }));
        } else {
            setEditForm((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                    <div className="flex gap-5">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#C4A35A] to-[#A38842] flex items-center justify-center shadow-lg transform -translate-y-1">
                            <span className="text-3xl font-bold text-white">{student.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span>Class {student.class}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>Roll #{student.rollNo}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>ID: {student.id}</span>
                            </div>
                            <div className="mt-2 text-xs">
                                <span className={`px-2 py-0.5 rounded font-semibold ${student.status === "Present" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                    }`}>
                                    {student.status} Today
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 border-b border-gray-100">
                    <div className="flex gap-6">
                        {["Profile", "Attendance", "Exams"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${activeTab === tab ? "border-[#C4A35A] text-[#C4A35A]" : "border-transparent text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    {/* --- PROFILE TAB --- */}
                    {activeTab === "Profile" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                            {/* Edit Mode vs View Mode */}
                            {isEditing ? (
                                <>
                                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-900">Edit Personal Details</h4>
                                        <div className="space-y-3">
                                            <EditInput label="DOB" name="dob" value={editForm.dob} onChange={handleInputChange} />
                                            <EditInput label="Address" name="address" value={editForm.address} onChange={handleInputChange} />
                                            <EditInput label="Contact" name="contact" value={editForm.contact} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-900">Edit Family Details</h4>
                                        <div className="space-y-3">
                                            <EditInput label="Father" name="parents.father" value={editForm.parents?.father} onChange={handleInputChange} />
                                            <EditInput label="Mother" name="parents.mother" value={editForm.parents?.mother} onChange={handleInputChange} />
                                            <EditInput label="Phone" name="parents.phone" value={editForm.parents?.phone} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Personal Details</h4>
                                        <div className="space-y-3">
                                            <DetailRow label="Date of Birth" value={student.dob} />
                                            <DetailRow label="Gender" value="Male" />
                                            <DetailRow label="Address" value={student.address} />
                                            <DetailRow label="Contact" value={student.contact} />
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Family Details</h4>
                                        <div className="space-y-3">
                                            <DetailRow label="Father" value={student.parents?.father} />
                                            <DetailRow label="Mother" value={student.parents?.mother} />
                                            <DetailRow label="Phone" value={student.parents?.phone} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* --- ATTENDANCE TAB --- */}
                    {activeTab === "Attendance" && (
                        <div className="animate-fadeIn space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard label="Total Days" value={attendanceStats.totalDays} color="bg-blue-100 text-blue-700" />
                                <StatCard label="Present" value={attendanceStats.present} color="bg-green-100 text-green-700" />
                                <StatCard label="Absent" value={attendanceStats.absent} color="bg-red-100 text-red-700" />
                                <StatCard label="Leave" value={attendanceStats.leave} color="bg-yellow-100 text-yellow-700" />
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm relative z-0">
                                <h4 className="text-sm font-semibold text-gray-900 mb-6">Monthly Attendance</h4>
                                <div className="h-48 flex items-end gap-2 px-2">
                                    {/* Mock Bar Chart with Tooltip */}
                                    {[95, 88, 92, 85, 96, 90, 88, 94, 98, 91, 89, 93].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gray-50 rounded-t relative group h-full flex items-end">
                                            <div
                                                className="w-full bg-[#C4A35A] rounded-t transition-all group-hover:opacity-90"
                                                style={{ height: `${h}%` }}
                                            ></div>
                                            {/* Tooltip on Hover */}
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10 shadow-lg">
                                                {h}% Present
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                            </div>
                                            <div className="absolute -bottom-6 w-full text-center text-[9px] text-gray-400">
                                                {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- EXAMS TAB --- */}
                    {activeTab === "Exams" && (
                        <div className="space-y-5 animate-fadeIn">
                            {/* Filters */}
                            <div className="flex gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500">Year</label>
                                    <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                                        {["2023", "2024"].map(year => (
                                            <button
                                                key={year}
                                                onClick={() => setExamYear(year)}
                                                className={`px-3 py-1 text-xs rounded-md transition-colors ${examYear === year ? "bg-[#C4A35A] text-white" : "text-gray-600 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-500">Exam</label>
                                    <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                                        {["Mid-term", "Final"].map(model => (
                                            <button
                                                key={model}
                                                onClick={() => setExamModel(model)}
                                                className={`px-3 py-1 text-xs rounded-md transition-colors ${examModel === model ? "bg-[#C4A35A] text-white" : "text-gray-600 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {model}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Results Table */}
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                                            <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Marks</th>
                                            <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                                            <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {currentExamResults.length > 0 ? (
                                            currentExamResults.map((exam: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-gray-50/50">
                                                    <td className="px-5 py-3 text-xs font-medium text-gray-900">{exam.subject}</td>
                                                    <td className="px-5 py-3 text-xs text-gray-600">
                                                        <span className="font-semibold">{exam.marks}</span> / {exam.total}
                                                    </td>
                                                    <td className="px-5 py-3">
                                                        <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-700 border border-gray-200">
                                                            {exam.grade}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 text-[10px] font-bold text-green-600 uppercase">Passed</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-5 py-8 text-center text-xs text-gray-400 italic">
                                                    No results found for {examModel} {examYear}.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                    {activeTab === "Profile" && ( // Edit only shows on Profile tab
                        isEditing ? (
                            <button
                                onClick={handleSaveProfile}
                                className="px-5 py-2 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm cursor-pointer"
                            >
                                Save Changes
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-5 py-2 text-sm bg-[#C4A35A] text-white font-medium rounded-lg hover:bg-[#A38842] transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit Profile
                            </button>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

// Helpers
function DetailRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs font-medium text-gray-900">{value || "N/A"}</span>
        </div>
    );
}

function EditInput({ label, value, onChange, name }: any) {
    return (
        <div>
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">{label}</label>
            <input
                name={name}
                value={value || ""}
                onChange={onChange}
                className="w-full text-sm border-b border-gray-200 py-1 focus:outline-none focus:border-[#C4A35A] bg-transparent"
            />
        </div>
    );
}

function StatCard({ label, value, color }: { label: string, value: string | number, color: string }) {
    return (
        <div className={`p-3 rounded-lg flex flex-col items-center justify-center border border-transparent ${color.replace('text-', 'bg-').replace('100', '50')}`}>
            <p className="text-[10px] uppercase tracking-wide opacity-70 mb-1">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}
