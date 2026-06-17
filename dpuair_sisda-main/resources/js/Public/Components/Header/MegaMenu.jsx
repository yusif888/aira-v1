import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/react";

const MegaMenu = ({ isOpen, onClose, isScrolled, menuData, triggerRef }) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [isPositioned, setIsPositioned] = useState(false);

    useEffect(() => {
        if (isOpen && triggerRef?.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();

            // Simple positioning - dropdown di bawah trigger
            const left = triggerRect.left;
            const top = triggerRect.bottom + 5; // 5px gap

            setPosition({ top, left });
            setIsPositioned(true);
        } else {
            setIsPositioned(false);
        }
    }, [isOpen, triggerRef]);

    if (!isOpen || !menuData || !isPositioned) return null;

    return (
        <div className="fixed inset-0 z-[100]" onClick={onClose}>
            <div
                className="fixed z-[101]"
                style={{
                    top: `${position.top}px`,
                    left: `${position.left}px`,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-64 bg-white rounded-lg shadow-2xl border border-gray-200/80 overflow-hidden opacity-100 transition-opacity duration-150">
                    <div className="py-2">
                        {menuData.items.map((item) => {
                            const isExternal = item.target === "_blank";
                            const Component = isExternal ? "a" : Link;
                            const linkProps = isExternal
                                ? {
                                      href: item.url,
                                      target: "_blank",
                                      rel: "noopener noreferrer",
                                  }
                                : { href: item.url || "#" };

                            return (
                                <Component
                                    key={item.id}
                                    {...linkProps}
                                    onClick={onClose}
                                    className="group flex items-center px-4 py-3 text-sm text-gray-700 hover:text-[#173c94] hover:bg-gradient-to-r hover:from-[#173c94]/10 hover:to-transparent transition-all duration-200 relative overflow-hidden border-b border-gray-100 last:border-b-0"
                                >
                                    <div className="w-1.5 h-1.5 bg-[#173c94] rounded-full mr-3 group-hover:bg-[#0f2a6b] transition-colors duration-200 flex-shrink-0"></div>
                                    <span className="font-medium group-hover:translate-x-1 transition-transform duration-200 flex-1">
                                        {item.title}
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
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#173c94]/0 via-[#173c94]/3 to-[#173c94]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                </Component>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
