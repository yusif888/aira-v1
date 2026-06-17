import React from "react";

const LanguageSelector = ({
    currentLanguage,
    isOpen,
    onToggle,
    onLanguageChange,
    isScrolled,
}) => {
    const languageOptions = [
        { code: "ID", name: "Indonesia", flag: "🇮🇩" },
        { code: "EN", name: "English", flag: "🇺🇸" },
    ];

    return (
        <div className="relative">
            <button
                onClick={onToggle}
                className={`flex items-center space-x-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isScrolled
                        ? "text-[#342c2c] hover:text-[#173c94] hover:bg-[#173c94]/10"
                        : "text-white hover:text-[#fcbc2c] hover:bg-white/10"
                }`}
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                </svg>
                <span className="font-semibold">{currentLanguage}</span>
                <svg
                    className={`w-4 h-4 transition-all duration-300 ${
                        isOpen ? "rotate-180 scale-110" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-current/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-44 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 py-2 z-20">
                    <div className="px-3 py-2 border-b border-gray-100">
                        <div className="text-xs font-semibold text-[#173c94] uppercase tracking-wide">
                            Pilih Bahasa
                        </div>
                    </div>
                    {languageOptions.map((lang, index) => (
                        <button
                            key={index}
                            onClick={() => onLanguageChange(lang.code)}
                            className={`w-full flex items-center px-4 py-3 text-sm transition-all duration-300 group ${
                                currentLanguage === lang.code
                                    ? "bg-gradient-to-r from-[#173c94]/10 to-[#2a4a9e]/10 text-[#173c94] font-semibold"
                                    : "text-gray-600 hover:text-[#173c94] hover:bg-[#173c94]/5"
                            }`}
                        >
                            <div className="flex items-center space-x-3 flex-1">
                                <span className="text-lg">{lang.flag}</span>
                                <div className="text-left">
                                    <div className="font-medium">
                                        {lang.name}
                                    </div>
                                    <div className="text-xs text-gray-400 uppercase">
                                        {lang.code}
                                    </div>
                                </div>
                            </div>

                            {currentLanguage === lang.code && (
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-[#fcbc2c] rounded-full animate-pulse"></div>
                                    <svg
                                        className="w-4 h-4 text-[#173c94]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            )}

                            {currentLanguage !== lang.code && (
                                <svg
                                    className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            )}
                        </button>
                    ))}
                    <div className="px-3 py-2 border-t border-gray-100 mt-1">
                        <div className="text-xs text-gray-400 text-center">
                            Dukungan Multibahasa
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;
