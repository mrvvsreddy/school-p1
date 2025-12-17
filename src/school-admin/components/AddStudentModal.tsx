"use client";

import React, { useState, useEffect, useRef } from "react";
import { createStudent, uploadStudentPhoto } from "@/school-admin/services/studentService";
import { getClasses, Class } from "@/school-admin/services/classService";

interface AddStudentModalProps {
    onClose: () => void;
    onAdd: () => void;
}

export default function AddStudentModal({ onClose, onAdd }: AddStudentModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [classes, setClasses] = useState<Class[]>([]);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        class_id: "",
        roll_no: "",
        dob: "",
        gender: "",
        address: "",
        phone: "",
        email: "",
        father_name: "",
        mother_name: "",
        guardian_phone: "",
        admission_no: "",
    });

    // Fetch classes on mount
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await getClasses();
                setClasses(response.classes);
            } catch (err) {
                console.error("Failed to fetch classes:", err);
            }
        };
        fetchClasses();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Build personal_info object
            const personal_info: Record<string, string> = {};
            if (formData.dob) personal_info.dob = formData.dob;
            if (formData.gender) personal_info.gender = formData.gender;
            if (formData.address) personal_info.address = formData.address;
            if (formData.phone) personal_info.phone = formData.phone;
            if (formData.email) personal_info.email = formData.email;
            if (formData.father_name) personal_info.father_name = formData.father_name;
            if (formData.mother_name) personal_info.mother_name = formData.mother_name;
            if (formData.guardian_phone) personal_info.guardian_phone = formData.guardian_phone;

            // Create student first
            const newStudent = await createStudent({
                name: formData.name,
                roll_no: formData.roll_no,
                class_id: formData.class_id,
                admission_no: formData.admission_no || undefined,
                personal_info: Object.keys(personal_info).length > 0 ? personal_info : undefined,
            });

            // Upload photo if selected
            if (photoFile && newStudent.id) {
                try {
                    await uploadStudentPhoto(newStudent.id, photoFile);
                } catch (photoErr) {
                    console.error("Photo upload failed:", photoErr);
                    // Student was created, just photo failed
                }
            }

            onAdd();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add student");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0 z-10">
                    <h3 className="text-lg font-bold text-gray-800">Add New Student</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                    >
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-6">
                    {/* Photo Upload Section */}
                    <div className="mb-6 flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="relative">
                            {photoPreview ? (
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="w-20 h-20 rounded-full object-cover border-2 border-[#C4A35A]"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-800">Student Photo</h4>
                            <p className="text-xs text-gray-500 mt-1">Upload a photo (JPEG, PNG, max 2MB)</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handlePhotoSelect}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-2 px-4 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                {photoFile ? "Change Photo" : "Upload Photo"}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Basic Info Column */}
                        <div className="space-y-5">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
                                Personal Information
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">FULL NAME *</label>
                                    <input
                                        required
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] transition-all"
                                        placeholder="Enter student's full name"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">CLASS *</label>
                                        <select
                                            required
                                            name="class_id"
                                            value={formData.class_id}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] cursor-pointer"
                                        >
                                            <option value="">Select Class</option>
                                            {classes.map(cls => (
                                                <option key={cls.id} value={cls.id}>{cls.class}-{cls.section}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">ROLL NO *</label>
                                        <input
                                            required
                                            name="roll_no"
                                            value={formData.roll_no}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                            placeholder="Ex: 001"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">DATE OF BIRTH</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">GENDER</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] cursor-pointer"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">ADDRESS</label>
                                    <input
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                        placeholder="Full residential address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">ADMISSION NO</label>
                                    <input
                                        name="admission_no"
                                        value={formData.admission_no}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                        placeholder="Ex: ADM2024001"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info Column */}
                        <div className="space-y-5">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">
                                Family & Contact Details
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">FATHER&apos;S NAME</label>
                                        <input
                                            name="father_name"
                                            value={formData.father_name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">MOTHER&apos;S NAME</label>
                                        <input
                                            name="mother_name"
                                            value={formData.mother_name}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">PHONE</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                            placeholder="Student/Parent phone"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">GUARDIAN PHONE</label>
                                        <input
                                            name="guardian_phone"
                                            value={formData.guardian_phone}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                            placeholder="Emergency contact"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">EMAIL</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                        placeholder="Parent's email"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-[#C4A35A] text-white text-sm font-medium rounded-lg hover:bg-[#A38842] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "Add Student"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
