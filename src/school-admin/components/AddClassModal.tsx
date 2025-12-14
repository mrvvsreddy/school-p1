"use client";

import React, { useState } from "react";

interface AddClassFormData {
    name: string;
    grade: string;
    section: string;
    classTeacher: string;
    capacity: number;
    room: string;
}

interface AddClassModalProps {
    onClose: () => void;
    onAdd: (classData: AddClassFormData) => void;
}

export default function AddClassModal({ onClose, onAdd }: AddClassModalProps) {
    const [formData, setFormData] = useState<AddClassFormData>({
        name: "",
        grade: "",
        section: "",
        classTeacher: "",
        capacity: 0,
        room: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800">Add New Class</h3>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">CLASS NAME</label>
                            <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="e.g. 10-A" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">GRADE</label>
                            <input required name="grade" value={formData.grade} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="e.g. Grade 10" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">SECTION</label>
                            <input required name="section" value={formData.section} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="e.g. A" />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">ROOM NO</label>
                            <input required name="room" value={formData.room} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="101" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">CLASS TEACHER</label>
                        <input required name="classTeacher" value={formData.classTeacher} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="Teacher Name" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-1">CAPACITY</label>
                        <input required type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]" placeholder="40" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-[#C4A35A] text-white text-sm font-medium rounded-lg hover:bg-[#A38842] transition-colors shadow-sm cursor-pointer">Create Class</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
