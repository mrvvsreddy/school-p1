"use client";

import React, { useState } from "react";
import { createClass } from "@/school-admin/services/classService";

interface AddClassModalProps {
    onClose: () => void;
    onAdd: () => void;  // Callback after creation
}

export default function AddClassModal({ onClose, onAdd }: AddClassModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        class: "",
        section: "",
        capacity: 40,
        room: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createClass({
                class: formData.class,
                section: formData.section,
                capacity: formData.capacity,
                room: formData.room,
            });
            onAdd();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add class");
            setLoading(false);
        }
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
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">CLASS *</label>
                            <select
                                required
                                name="class"
                                value={formData.class}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] cursor-pointer"
                            >
                                <option value="">Select Class</option>
                                <option value="LKG">LKG</option>
                                <option value="UKG">UKG</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">SECTION *</label>
                            <select
                                required
                                name="section"
                                value={formData.section}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A] cursor-pointer"
                            >
                                <option value="">Select Section</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">ROOM</label>
                            <input
                                name="room"
                                value={formData.room}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                                placeholder="e.g., 101"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">CAPACITY</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                min={1}
                                max={100}
                                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#C4A35A]"
                            />
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
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
                            {loading ? "Creating..." : "Create Class"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
