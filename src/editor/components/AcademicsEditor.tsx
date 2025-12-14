"use client";

import React from "react";
import { SiteContent, AcademicGrade, Methodology, AcademicTerm } from "@/data/types";

interface AcademicsEditorProps {
    content: SiteContent;
    onUpdate: (content: SiteContent) => void;
}

export default function AcademicsEditor({ content, onUpdate }: AcademicsEditorProps) {
    const academics = content.academics;

    const updateAcademics = (field: string, value: AcademicGrade[] | Methodology[] | AcademicTerm[]) => {
        onUpdate({
            ...content,
            academics: { ...academics, [field]: value },
        });
    };

    // Grades
    const updateGrade = (index: number, field: keyof AcademicGrade, value: string | string[]) => {
        const newGrades = [...academics.grades];
        newGrades[index] = { ...newGrades[index], [field]: value };
        updateAcademics("grades", newGrades);
    };

    const updateGradeFeature = (gradeIndex: number, featureIndex: number, value: string) => {
        const newGrades = [...academics.grades];
        const newFeatures = [...newGrades[gradeIndex].features];
        newFeatures[featureIndex] = value;
        newGrades[gradeIndex] = { ...newGrades[gradeIndex], features: newFeatures };
        updateAcademics("grades", newGrades);
    };

    const addGradeFeature = (gradeIndex: number) => {
        const newGrades = [...academics.grades];
        newGrades[gradeIndex] = {
            ...newGrades[gradeIndex],
            features: [...newGrades[gradeIndex].features, ""],
        };
        updateAcademics("grades", newGrades);
    };

    const removeGradeFeature = (gradeIndex: number, featureIndex: number) => {
        const newGrades = [...academics.grades];
        newGrades[gradeIndex] = {
            ...newGrades[gradeIndex],
            features: newGrades[gradeIndex].features.filter((_, i) => i !== featureIndex),
        };
        updateAcademics("grades", newGrades);
    };

    // Methodologies
    const updateMethodology = (index: number, field: keyof Methodology, value: string) => {
        const newMethodologies = [...academics.methodologies];
        newMethodologies[index] = { ...newMethodologies[index], [field]: value };
        updateAcademics("methodologies", newMethodologies);
    };

    const addMethodology = () => {
        updateAcademics("methodologies", [...academics.methodologies, { name: "", icon: "" }]);
    };

    const removeMethodology = (index: number) => {
        updateAcademics("methodologies", academics.methodologies.filter((_, i) => i !== index));
    };

    // Calendar
    const updateTerm = (index: number, field: keyof AcademicTerm, value: string) => {
        const newCalendar = [...academics.calendar];
        newCalendar[index] = { ...newCalendar[index], [field]: value };
        updateAcademics("calendar", newCalendar);
    };

    const addTerm = () => {
        updateAcademics("calendar", [...academics.calendar, { term: "", dates: "", exams: "" }]);
    };

    const removeTerm = (index: number) => {
        updateAcademics("calendar", academics.calendar.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Academics Page</h2>
                <p className="text-gray-500 text-sm">Edit the Academics page content</p>
            </div>

            {/* Academic Grades */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-lg">🎓</span> Academic Grades
                </h3>
                {academics.grades.map((grade, gradeIndex) => (
                    <div key={gradeIndex} className="bg-white rounded-lg p-4 border border-gray-100 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={grade.title}
                                    onChange={(e) => updateGrade(gradeIndex, "title", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Classes</label>
                                <input
                                    type="text"
                                    value={grade.classes}
                                    onChange={(e) => updateGrade(gradeIndex, "classes", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">Age Range</label>
                                <input
                                    type="text"
                                    value={grade.age}
                                    onChange={(e) => updateGrade(gradeIndex, "age", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                            <textarea
                                value={grade.description}
                                onChange={(e) => updateGrade(gradeIndex, "description", e.target.value)}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm resize-none"
                            />
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-gray-500">Core Subjects</label>
                                <button
                                    onClick={() => addGradeFeature(gradeIndex)}
                                    className="text-xs text-[#C4A35A] hover:underline"
                                >
                                    + Add Subject
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {grade.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center gap-1 bg-[#C4A35A]/10 rounded-full pl-3 pr-1 py-1">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => updateGradeFeature(gradeIndex, featureIndex, e.target.value)}
                                            className="bg-transparent border-none outline-none text-sm text-[#C4A35A] w-20"
                                        />
                                        <button
                                            onClick={() => removeGradeFeature(gradeIndex, featureIndex)}
                                            className="p-1 text-[#C4A35A] hover:text-red-500"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Teaching Methodologies */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <span className="text-lg">📚</span> Teaching Methodologies
                    </h3>
                    <button
                        onClick={addMethodology}
                        className="px-3 py-1.5 text-sm bg-[#C4A35A] text-white rounded-lg hover:bg-[#b0924e] transition-colors"
                    >
                        + Add
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {academics.methodologies.map((method, index) => (
                        <div key={index} className="flex gap-2 items-center bg-white rounded-lg p-3 border border-gray-100">
                            <input
                                type="text"
                                value={method.icon}
                                onChange={(e) => updateMethodology(index, "icon", e.target.value)}
                                placeholder="Icon"
                                className="w-12 px-2 py-2 border border-gray-200 rounded-lg text-center text-lg"
                            />
                            <input
                                type="text"
                                value={method.name}
                                onChange={(e) => updateMethodology(index, "name", e.target.value)}
                                placeholder="Methodology name"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm"
                            />
                            <button
                                onClick={() => removeMethodology(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Academic Calendar */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <span className="text-lg">📅</span> Academic Calendar
                    </h3>
                    <button
                        onClick={addTerm}
                        className="px-3 py-1.5 text-sm bg-[#C4A35A] text-white rounded-lg hover:bg-[#b0924e] transition-colors"
                    >
                        + Add Term
                    </button>
                </div>
                <div className="space-y-3">
                    {academics.calendar.map((term, index) => (
                        <div key={index} className="flex gap-3 items-center bg-white rounded-lg p-3 border border-gray-100">
                            <input
                                type="text"
                                value={term.term}
                                onChange={(e) => updateTerm(index, "term", e.target.value)}
                                placeholder="Term Name"
                                className="w-32 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm"
                            />
                            <input
                                type="text"
                                value={term.dates}
                                onChange={(e) => updateTerm(index, "dates", e.target.value)}
                                placeholder="Duration"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm"
                            />
                            <input
                                type="text"
                                value={term.exams}
                                onChange={(e) => updateTerm(index, "exams", e.target.value)}
                                placeholder="Exams"
                                className="w-28 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#C4A35A]/50 focus:border-[#C4A35A] outline-none text-sm"
                            />
                            <button
                                onClick={() => removeTerm(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
