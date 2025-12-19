"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Teacher, updateTeacher, uploadTeacherPhoto } from "@/school-admin/services/teacherService";
import { getClasses, Class } from "@/school-admin/services/classService";

interface TeacherDetailModalProps {
    teacher: Teacher;
    onClose: () => void;
    onEdit: () => void;  // Callback after update
    onDelete: () => void;
}

export default function TeacherDetailModal({ teacher, onClose, onEdit, onDelete }: TeacherDetailModalProps) {
    const [activeTab, setActiveTab] = useState<"Profile" | "Attendance" | "Finance" | "Class">("Profile");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Teacher>>({});
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [assignedClass, setAssignedClass] = useState<Class | null>(null);

    useEffect(() => {
        if (teacher) {
            setEditForm({ ...teacher });
            getClasses().then(res => {
                const cls = res.classes.find(c => c.class_teacher_id === teacher.employee_id);
                setAssignedClass(cls || null);
            }).catch(() => { });
        }
    }, [teacher]);

    if (!teacher) return null;

    // Mock Data for attendance/finance tabs
    const attendanceStats = {
        totalDays: 240, present: 228, absent: 8, leave: 4, percentage: 95
    };

    const paymentHistory = [
        { month: "January 2024", amount: teacher.personal_info?.salary || "N/A", status: "Paid", date: "31 Jan, 2024" },
        { month: "December 2023", amount: teacher.personal_info?.salary || "N/A", status: "Paid", date: "31 Dec, 2023" },
        { month: "November 2023", amount: teacher.personal_info?.salary || "N/A", status: "Paid", date: "30 Nov, 2023" },
    ];

    const handleSaveProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            await updateTeacher(teacher.id, editForm);
            setIsEditing(false);
            onEdit();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save changes");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Handle nested personal_info fields
        if (name.startsWith("personal_info.")) {
            const field = name.split(".")[1];
            setEditForm((prev) => ({
                ...prev,
                personal_info: {
                    ...(prev.personal_info || {}),
                    [field]: value
                }
            }));
        } else {
            setEditForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingPhoto(true);
        setError(null);
        try {
            const result = await uploadTeacherPhoto(teacher.id, file);
            // Just update local state, don't trigger refresh/close
            setEditForm(prev => ({ ...prev, photo_url: result.photo_url }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload photo");
        } finally {
            setUploadingPhoto(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                    <div className="flex gap-5">
                        {teacher.photo_url ? (
                            <Image src={teacher.photo_url} alt={teacher.name} width={80} height={80} className="rounded-xl object-cover shadow-lg" />
                        ) : (
                            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#8B7355] to-[#C4A35A] flex items-center justify-center shadow-lg">
                                <span className="text-3xl font-bold text-white">{teacher.name.charAt(0)}</span>
                            </div>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{teacher.name}</h2>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span>{teacher.subject}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>{teacher.employee_id}</span>
                            </div>
                            <div className="mt-2 text-xs">
                                <span className={`px-2 py-0.5 rounded font-semibold ${teacher.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {teacher.status || "Active"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors cursor-pointer">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="px-6 border-b border-gray-100">
                    <div className="flex gap-6">
                        {["Profile", "Attendance", "Finance", ...(assignedClass ? ["Class"] : [])].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as "Profile" | "Attendance" | "Finance" | "Class")}
                                className={`py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${activeTab === tab
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
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* PROFILE TAB */}
                    {activeTab === "Profile" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                            {isEditing ? (
                                <>
                                    {/* Photo Upload Section */}
                                    <div className="md:col-span-2 bg-white p-5 rounded-xl border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-4">Profile Photo</h4>
                                        <div className="flex items-center gap-6">
                                            {editForm.photo_url || teacher.photo_url ? (
                                                <Image
                                                    src={editForm.photo_url || teacher.photo_url || ""}
                                                    alt={teacher.name}
                                                    width={96}
                                                    height={96}
                                                    className="rounded-xl object-cover shadow-md"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#8B7355] to-[#C4A35A] flex items-center justify-center shadow-md">
                                                    <span className="text-4xl font-bold text-white">{teacher.name.charAt(0)}</span>
                                                </div>
                                            )}
                                            <div>
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handlePhotoUpload}
                                                    accept="image/jpeg,image/png,image/webp"
                                                    className="hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    disabled={uploadingPhoto}
                                                    className="px-4 py-2 bg-[#C4A35A] text-white text-sm font-medium rounded-lg hover:bg-[#A38842] transition-colors disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {uploadingPhoto ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            Upload Photo
                                                        </>
                                                    )}
                                                </button>
                                                <p className="text-xs text-gray-400 mt-2">JPEG, PNG or WebP. Max 5MB.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-900">Edit Personal Details</h4>
                                        <div className="space-y-3">
                                            <EditInput label="Name" name="name" value={editForm.name || ""} onChange={handleInputChange} />
                                            <EditInput label="DOB" name="personal_info.dob" value={editForm.personal_info?.dob || ""} onChange={handleInputChange} />
                                            <EditInput label="Address" name="personal_info.address" value={editForm.personal_info?.address || ""} onChange={handleInputChange} />
                                            <EditInput label="Phone" name="personal_info.phone" value={editForm.personal_info?.phone || ""} onChange={handleInputChange} />
                                            <EditInput label="Email" name="personal_info.email" value={editForm.personal_info?.email || ""} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-900">Edit Professional Details</h4>
                                        <div className="space-y-3">
                                            <EditInput label="Subject" name="subject" value={editForm.subject || ""} onChange={handleInputChange} />
                                            <EditInput label="Designation" name="designation" value={editForm.designation || ""} onChange={handleInputChange} />
                                            <EditInput label="Join Date" name="join_date" value={editForm.join_date || ""} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-900">Edit Financial Details</h4>
                                        <div className="space-y-3">
                                            <EditInput label="Salary" name="personal_info.salary" value={editForm.personal_info?.salary || ""} onChange={handleInputChange} />
                                            <EditInput label="Bank Account" name="personal_info.bank_account" value={editForm.personal_info?.bank_account || ""} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Personal Details</h4>
                                        <div className="space-y-3">
                                            <DetailRow label="Date of Birth" value={teacher.personal_info?.dob} />
                                            <DetailRow label="Address" value={teacher.personal_info?.address} />
                                            <DetailRow label="Phone" value={teacher.personal_info?.phone} />
                                            <DetailRow label="Email" value={teacher.personal_info?.email} />
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Professional Details</h4>
                                        <div className="space-y-3">
                                            <DetailRow label="Subject" value={teacher.subject} />
                                            <DetailRow label="Designation" value={teacher.designation} />
                                            <DetailRow label="Join Date" value={teacher.join_date} />
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* ATTENDANCE TAB */}
                    {activeTab === "Attendance" && (
                        <div className="animate-fadeIn space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard label="Total Days" value={attendanceStats.totalDays} color="bg-blue-100 text-blue-700" />
                                <StatCard label="Present" value={attendanceStats.present} color="bg-green-100 text-green-700" />
                                <StatCard label="Absent" value={attendanceStats.absent} color="bg-red-100 text-red-700" />
                                <StatCard label="Leave" value={attendanceStats.leave} color="bg-yellow-100 text-yellow-700" />
                            </div>
                            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <h4 className="text-sm font-semibold text-gray-900 mb-6">Monthly Attendance</h4>
                                <div className="h-48 flex items-end gap-2 px-2">
                                    {[98, 96, 95, 92, 97, 95, 98, 99, 94, 96, 95, 98].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gray-50 rounded-t relative group h-full flex items-end">
                                            <div className="w-full bg-[#C4A35A] rounded-t transition-all group-hover:opacity-90" style={{ height: `${h}%` }}></div>
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-[10px] py-1 px-2 rounded z-10">
                                                {h}%
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

                    {/* FINANCE TAB */}
                    {activeTab === "Finance" && (
                        <div className="animate-fadeIn space-y-6">
                            <div className="bg-gradient-to-r from-[#2c3e50] to-[#34495e] rounded-xl p-6 text-white shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs text-gray-300 uppercase tracking-widest mb-1">Current Salary</p>
                                        <h3 className="text-3xl font-bold">₹{teacher.personal_info?.salary || "N/A"}</h3>
                                        <p className="text-xs text-gray-400 mt-2">Paid Monthly</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-300 uppercase tracking-widest mb-1">Bank Account</p>
                                        <p className="font-medium text-lg">{teacher.personal_info?.bank_account || "Not Linked"}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-900">Payment History</h4>
                                </div>
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Month</th>
                                            <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Date</th>
                                            <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Amount</th>
                                            <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paymentHistory.map((payment, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50">
                                                <td className="px-5 py-3 text-xs font-medium text-gray-900">{payment.month}</td>
                                                <td className="px-5 py-3 text-xs text-gray-500">{payment.date}</td>
                                                <td className="px-5 py-3 text-xs font-semibold text-gray-900">₹{payment.amount}</td>
                                                <td className="px-5 py-3">
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase">
                                                        {payment.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* CLASS TAB */}
                    {activeTab === "Class" && assignedClass && (
                        <div className="animate-fadeIn">
                            <div className="bg-gradient-to-r from-[#C4A35A]/10 to-[#8B7355]/10 p-6 rounded-xl border border-[#C4A35A]/20 shadow-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <svg className="w-6 h-6 text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <h4 className="text-lg font-semibold text-[#8B7355]">Class Teacher Of</h4>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="bg-white p-5 rounded-xl text-center shadow-sm">
                                        <p className="text-xs text-gray-500 mb-2">Class</p>
                                        <p className="text-2xl font-bold text-gray-900">{assignedClass.class}-{assignedClass.section}</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl text-center shadow-sm">
                                        <p className="text-xs text-gray-500 mb-2">Total Students</p>
                                        <p className="text-2xl font-bold text-gray-900">{assignedClass.students_count || 0}</p>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl text-center shadow-sm">
                                        <p className="text-xs text-gray-500 mb-2">Room</p>
                                        <p className="text-2xl font-bold text-gray-900">{assignedClass.room || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white flex justify-between">
                    <button
                        onClick={onDelete}
                        className="px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                        Delete Teacher
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                            Close
                        </button>
                        {activeTab === "Profile" && (
                            isEditing ? (
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={loading}
                                    className="px-5 py-2 text-sm bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
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
        </div>
    );
}

// Helpers
function DetailRow({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs font-medium text-gray-900">{value || "N/A"}</span>
        </div>
    );
}

function EditInput({ label, value, onChange, name }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; name: string }) {
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

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
    return (
        <div className={`p-3 rounded-lg flex flex-col items-center justify-center border border-transparent ${color.replace('text-', 'bg-').replace('100', '50')}`}>
            <p className="text-[10px] uppercase tracking-wide opacity-70 mb-1">{label}</p>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}
