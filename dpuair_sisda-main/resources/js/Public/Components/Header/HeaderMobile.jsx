import { Link } from "@inertiajs/react";

export default function HeaderMobile({
    isMenuOpen,
    setIsMenuOpen,
    openMobileDropdownId,
    setOpenMobileDropdownId,
    menuItems,
    mobileOpenSections,
    mobileOpenItems,
    toggleMobileSection,
    toggleMobileItem,
    isScrolled,
}) {
    const renderMobileMenuItem = (item, index) => {
        if (item.type === "link") {
            return (
                <div key={index} className="px-3 py-2">
                    <Link
                        href={item.href}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl border text-[#342c2c] hover:text-[#173c94] hover:bg-[#8a9bcc]/10 border-[#d1dbdf] hover:border-[#173c94]/30"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-[#948c8c] transition-colors duration-200"></div>
                            <span>{item.name}</span>
                        </div>
                        <svg
                            className="w-4 h-4 text-[#948c8c] transition-colors duration-200"
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
                    </Link>
                </div>
            );
        }

        if (item.type === "external") {
            return (
                <div key={index} className="px-3 py-2">
                    <a
                        href={item.href}
                        target={item.target}
                        rel={item.rel}
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl border text-[#342c2c] hover:text-[#173c94] hover:bg-[#8a9bcc]/10 border-[#d1dbdf] hover:border-[#173c94]/30"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-[#948c8c] transition-colors duration-200"></div>
                            <span>{item.name}</span>
                        </div>
                        <svg
                            className="w-4 h-4 text-[#948c8c] transition-colors duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </a>
                </div>
            );
        }

        if (item.type === "dropdown") {
            const isDropdownOpen = openMobileDropdownId === item.id;
            const toggleDropdown = () =>
                setOpenMobileDropdownId(isDropdownOpen ? null : item.id);

            return (
                <div key={index} className="px-3 py-2">
                    {/* Mobile Dropdown Button */}
                    <button
                        onClick={toggleDropdown}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl border ${
                            isDropdownOpen
                                ? "bg-gradient-to-r from-[#173c94]/10 to-[#8a9bcc]/10 border-[#173c94]/30 text-[#173c94]"
                                : "text-[#342c2c] hover:text-[#173c94] hover:bg-[#d1dbdf]/30 border-[#d1dbdf]"
                        }`}
                    >
                        <div className="flex items-center space-x-3">
                            <div
                                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                    isDropdownOpen
                                        ? "bg-[#173c94]"
                                        : "bg-[#948c8c]"
                                }`}
                            ></div>
                            <span>{item.name}</span>
                        </div>
                        <svg
                            className={`w-4 h-4 transition-all duration-300 ${
                                isDropdownOpen ? "rotate-180 scale-110" : ""
                            } ${
                                isDropdownOpen
                                    ? "text-[#173c94]"
                                    : "text-[#948c8c]"
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
                    </button>

                    {/* Mobile Dropdown Content */}
                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            isDropdownOpen
                                ? "opacity-100 mt-2"
                                : "max-h-0 opacity-0"
                        }`}
                    >
                        <div className="space-y-2 ml-4">
                            {(item.data?.items || []).map(
                                (menuItem, itemIndex) => (
                                    <Link
                                        key={itemIndex}
                                        href={menuItem.url || "#"}
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            setOpenMobileDropdownId(null);
                                        }}
                                        className="group flex items-center px-3 py-2.5 text-[#342c2c] hover:text-[#173c94] hover:bg-gradient-to-r hover:from-[#173c94]/10 hover:to-transparent rounded-xl text-sm transition-all duration-200 relative overflow-hidden border border-transparent hover:border-[#173c94]/20"
                                    >
                                        <div className="w-1.5 h-1.5 bg-[#173c94] rounded-full mr-3 group-hover:bg-[#0f2a6b] transition-colors duration-200 flex-shrink-0"></div>
                                        <span className="font-medium group-hover:translate-x-1 transition-transform duration-200 flex-1">
                                            {menuItem.title}
                                        </span>
                                        <svg
                                            className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-[#173c94]"
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
                                        <div className="absolute inset-0 bg-gradient-to-r from-[#173c94]/0 via-[#173c94]/3 to-[#173c94]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="fixed inset-0 z-[70] bg-white overflow-y-auto md:hidden">
            {/* Close button */}
            <button
                type="button"
                aria-label="Tutup menu"
                onClick={() => {
                    setIsMenuOpen(false);
                    setOpenMobileDropdownId(null);
                }}
                className="absolute top-3 right-3 p-3 rounded-xl border border-gray-200 text-[#342c2c] hover:text-white hover:bg-[#173c94] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#173c94]/40"
            >
                <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
            <div className="max-w-7xl mx-auto px-2 pt-24 pb-6 space-y-1 border-t border-[#d1dbdf]">
                {/* Menu Items */}
                {menuItems.map((item, index) =>
                    renderMobileMenuItem(item, index)
                )}

                {/* Mobile Infrastruktur SDA Link */}
                <div className="px-3 py-2">
                    <a
                        href="/infrastruktur-sda"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl border text-[#342c2c] hover:text-[#173c94] hover:bg-[#8a9bcc]/10 border-[#d1dbdf] hover:border-[#173c94]/30"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="font-bold">INFRASTRUKTUR SDA</span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
