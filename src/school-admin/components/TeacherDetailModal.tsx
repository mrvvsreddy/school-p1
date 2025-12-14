"use client";

import React, { useState } from "react";

interface TeacherDetailModalProps {
    teacher: any;
    onClose: () => void;
    onEdit: (updatedTeacher: any) => void;
}

export default function TeacherDetailModal({ teacher, onClose, onEdit }: TeacherDetailModalProps) {
    const [activeTab, setActiveTab] = useState<"Profile" | "Attendance" | "Finance">("Profile");
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(teacher ? { ...teacher } : {});

    if (!teacher) return null;

    // Mock Data
    const attendanceStats = {
        totalDays: 240,
        present: 228,
        absent: 8,
        leave: 4,
        percentage: 95
    };

    const paymentHistory = [
        { month: "January 2023", amount: teacher.salary, status: "Paid", date: "31 Jan, 2023" },
        { month: "December 2022", amount: teacher.salary, status: "Paid", date: "31 Dec, 2022" },
        { month: "November 2022", amount: teacher.salary, status: "Paid", date: "30 Nov, 2022" },
    ];

    const handleSaveProfile = () => {
        onEdit(editForm);
        setIsEditing(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditForm((prev: any) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex items-start justify-between bg-gray-50/50">
                    <div className="flex gap-5">
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#8B7355] to-[#C4A35A] flex items-center justify-center shadow-lg transform -translate-y-1">
                            <span className="text-3xl font-bold text-white">{teacher.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{teacher.name}</h2>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span>{teacher.subject}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>{teacher.department}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>ID: {teacher.id}</span>
                            </div>
                            <div className="mt-2 text-xs">
                                <span className={`px-2 py-0.5 rounded font-semibold ${teacher.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                    {teacher.status}
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
                        {["Profile", "Attendance", "Finance"].map((tab) => (
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
                            {isEditing ? (
                                <>
                                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-900">Edit Personal Details</h4>
                                        <div className="space-y-3">
                                            <EditInput label="DOB" name="dob" value={editForm.dob} onChange={handleInputChange} />
                                            <EditInput label="Address" name="address" value={editForm.address} onChange={handleInputChange} />
                                            <EditInput label="Contact" name="contact" value={editForm.contact} onChange={handleInputChange} />
                                            <EditInput label="Email" name="email" value={editForm.email} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-900">Edit Professional Details</h4>
                                        <div className="space-y-3">
                                            <EditInput label="Subject" name="subject" value={editForm.subject} onChange={handleInputChange} />
                                            <EditInput label="Department" name="department" value={editForm.department} onChange={handleInputChange} />
                                            <EditInput label="Join Date" name="joinDate" value={editForm.joinDate} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-900">Edit Financial Details</h4>
                                        <div className="space-y-3">
                                            <EditInput label="Salary" name="salary" value={editForm.salary} onChange={handleInputChange} />
                                            <EditInput label="Bank Account" name="bankAccount" value={editForm.bankAccount} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Personal Details</h4>
                                        <div className="space-y-3">
                                            <DetailRow label="Date of Birth" value={teacher.dob} />
                                            <DetailRow label="Address" value={teacher.address} />
                                            <DetailRow label="Contact" value={teacher.contact} />
                                            <DetailRow label="Email" value={teacher.email} />
                                        </div>
                                    </div>
                                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Professional Details</h4>
                                        <div className="space-y-3">
                                            <DetailRow label="Subject" value={teacher.subject} />
                                            <DetailRow label="Department" value={teacher.department} />
                                            <DetailRow label="Join Date" value={teacher.joinDate} />
                                        </div>
                                    </div>
                                    {/* Financial info only in view if not editing? Or keep it seperate tab? 
                                        Since we added a Finance Tab, let's keep detailed finance there. 
                                        But basic edits can happen here or we can disable edits for finance unless admin.
                                        Let's put basic finance view here too for quick access? No, let's stick to the Tab for cleaner view.
                                    */}
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
                                    {[98, 96, 95, 92, 97, 95, 98, 99, 94, 96, 95, 98].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gray-50 rounded-t relative group h-full flex items-end">
                                            <div
                                                className="w-full bg-[#C4A35A] rounded-t transition-all group-hover:opacity-90"
                                                style={{ height: `${h}%` }}
                                            ></div>
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

                    {/* --- FINANCE TAB --- */}
                    {activeTab === "Finance" && (
                        <div className="animate-fadeIn space-y-6">
                            {/* Salary Card */}
                            <div className="bg-gradient-to-r from-[#2c3e50] to-[#34495e] rounded-xl p-6 text-white shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs text-gray-300 uppercase tracking-widest mb-1">Current Salary</p>
                                        <h3 className="text-3xl font-bold">₹{teacher.salary || "N/A"}</h3>
                                        <p className="text-xs text-gray-400 mt-2">Paid Monthly</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-300 uppercase tracking-widest mb-1">Bank Information</p>
                                        <p className="font-medium text-lg">{teacher.bankAccount || "Not Linked"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment History Table */}
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                    <h4 className="text-sm font-semibold text-gray-900">Payment History</h4>
                                    <button className="text-xs text-[#C4A35A] font-medium hover:underline">Download Statements</button>
                                </div>
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Month</th>
                                            <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {paymentHistory.map((payment, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50">
                                                <td className="px-5 py-3 text-xs font-medium text-gray-900">{payment.month}</td>
                                                <td className="px-5 py-3 text-xs text-gray-500">{payment.date}</td>
                                                <td className="px-5 py-3 text-xs font-semibold text-gray-900">₹{payment.amount}</td>
                                                <td className="px-5 py-3">
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-bold uppercase border border-green-200">
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
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
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
