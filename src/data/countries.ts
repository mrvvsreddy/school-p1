export interface Country {
    code: string;
    name: string;
    flag: string;
    dialCode: string;
}

export const countries: Country[] = [
    { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91" },
    { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
    { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
    { code: "AE", name: "UAE", flag: "🇦🇪", dialCode: "+971" },
    { code: "SG", name: "Singapore", flag: "🇸🇬", dialCode: "+65" },
    { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61" },
    { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
    { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49" },
    { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
    { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81" },
    { code: "CN", name: "China", flag: "🇨🇳", dialCode: "+86" },
    { code: "KR", name: "South Korea", flag: "🇰🇷", dialCode: "+82" },
    { code: "SA", name: "Saudi Arabia", flag: "🇸🇦", dialCode: "+966" },
    { code: "QA", name: "Qatar", flag: "🇶🇦", dialCode: "+974" },
    { code: "KW", name: "Kuwait", flag: "🇰🇼", dialCode: "+965" },
    { code: "OM", name: "Oman", flag: "🇴🇲", dialCode: "+968" },
    { code: "BH", name: "Bahrain", flag: "🇧🇭", dialCode: "+973" },
    { code: "NZ", name: "New Zealand", flag: "🇳🇿", dialCode: "+64" },
    { code: "MY", name: "Malaysia", flag: "🇲🇾", dialCode: "+60" },
    { code: "TH", name: "Thailand", flag: "🇹🇭", dialCode: "+66" },
    { code: "ID", name: "Indonesia", flag: "🇮🇩", dialCode: "+62" },
    { code: "PH", name: "Philippines", flag: "🇵🇭", dialCode: "+63" },
    { code: "VN", name: "Vietnam", flag: "🇻🇳", dialCode: "+84" },
    { code: "BD", name: "Bangladesh", flag: "🇧🇩", dialCode: "+880" },
    { code: "PK", name: "Pakistan", flag: "🇵🇰", dialCode: "+92" },
    { code: "LK", name: "Sri Lanka", flag: "🇱🇰", dialCode: "+94" },
    { code: "NP", name: "Nepal", flag: "🇳🇵", dialCode: "+977" },
    { code: "ZA", name: "South Africa", flag: "🇿🇦", dialCode: "+27" },
    { code: "NG", name: "Nigeria", flag: "🇳🇬", dialCode: "+234" },
    { code: "KE", name: "Kenya", flag: "🇰🇪", dialCode: "+254" },
];

export const defaultCountry = countries[0]; // India

export const getCountryByDialCode = (dialCode: string): Country | undefined => {
    return countries.find(c => c.dialCode === dialCode);
};

export const getCountryByCode = (code: string): Country | undefined => {
    return countries.find(c => c.code === code);
};
