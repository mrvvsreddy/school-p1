"use client";

import React, { useState, useRef, useEffect } from "react";
import { countries, defaultCountry, Country } from "@/data/countries";

interface PhoneInputProps {
    value: string;
    onChange: (phone: string, dialCode: string) => void;
    placeholder?: string;
    required?: boolean;
    defaultDialCode?: string;
}

export default function PhoneInput({
    value,
    onChange,
    placeholder = "Phone Number",
    required = false,
    defaultDialCode = "+91",
}: PhoneInputProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState<Country>(
        countries.find(c => c.dialCode === defaultDialCode) || defaultCountry
    );
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
                setSearchQuery("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCountries = countries.filter(
        country =>
            country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            country.dialCode.includes(searchQuery)
    );

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
        onChange(value, country.dialCode);
        setShowDropdown(false);
        setSearchQuery("");
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers
        onChange(newValue, selectedCountry.dialCode);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex">
                <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-1 px-3 py-3 rounded-l-lg border border-r-0 border-[#E5E5E5] bg-white hover:bg-gray-50 focus:border-[#C4A35A] focus:outline-none transition-colors min-w-[100px]"
                >
                    <span className="text-xl">{selectedCountry.flag}</span>
                    <span className="text-sm text-[#333] font-medium">{selectedCountry.dialCode}</span>
                    <svg className="w-4 h-4 text-[#666] ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                <input
                    type="tel"
                    placeholder={placeholder}
                    required={required}
                    className="w-full px-4 py-3 rounded-r-lg border border-[#E5E5E5] focus:border-[#C4A35A] focus:outline-none transition-colors"
                    value={value}
                    onChange={handlePhoneChange}
                />
            </div>

            {showDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-[#E5E5E5] rounded-lg shadow-xl z-50 w-72 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-[#E5E5E5]">
                        <input
                            type="text"
                            placeholder="Search country..."
                            className="w-full px-3 py-2 text-sm border border-[#E5E5E5] rounded-md focus:border-[#C4A35A] focus:outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                    </div>

                    {/* Country List */}
                    <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    onClick={() => handleCountrySelect(country)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#FAF8F5] transition-colors text-left ${selectedCountry.code === country.code ? "bg-[#C4A35A]/10" : ""
                                        }`}
                                >
                                    <span className="text-xl">{country.flag}</span>
                                    <span className="text-[#333] flex-1">{country.name}</span>
                                    <span className="text-[#666] text-sm">{country.dialCode}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-4 py-3 text-center text-[#666] text-sm">
                                No countries found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
