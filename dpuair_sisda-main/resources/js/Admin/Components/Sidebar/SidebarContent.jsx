import React, { useState, useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import {
    menuCategories,
    getHref,
    getPathForCheck,
    isCurrentPath,
    isChildActive,
} from "./SidebarUtils";

/**
 * Isi konten sidebar termasuk header, menu navigasi, dan footer user.
 *
 * @param {Object} props
 * @param {boolean} props.sidebarCollapsed - Status sidebar collapsed
 * @param {Function} props.setSidebarCollapsed - Setter status sidebar
 * @param {Function} props.setMobileMenuOpen - Setter menu mobile
 * @param {boolean} props.isMobile - Status mobile view
 */
const SidebarContent = ({
    sidebarCollapsed,
    setSidebarCollapsed,
    setMobileMenuOpen,
    isMobile,
}) => {
    const { url } = usePage();
    const [expandedCategories, setExpandedCategories] = useState({
        dashboard: false,
        news: false,
        documents: false,
        portal_data: false,
        pelayanan: false,
        infrastruktur_sda: false,
        complaints: false,
        setting: false,
    });

    // Auto-expand categories based on active menu
    useEffect(() => {
        if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;

            const newExpandedState = {
                dashboard:
                    currentPath === "/admin/dashboard" ||
                    currentPath.startsWith("/admin/dashboard"),
                news:
                    currentPath.startsWith("/admin/news") ||
                    currentPath.startsWith("/admin/berita"),
                documents:
                    currentPath.startsWith("/admin/documents") ||
                    currentPath.startsWith("/admin/dokumen"),
                portal_data: currentPath.startsWith("/admin/portal-data"),
                pelayanan: currentPath.startsWith("/admin/pelayanan"),
                infrastruktur_sda: currentPath.startsWith(
                    "/admin/infrastruktur-sda",
                ),
                complaints:
                    currentPath.startsWith("/admin/complaints") ||
                    currentPath.startsWith("/admin/pengaduan"),
                setting:
                    currentPath.startsWith("/admin/users") ||
                    currentPath.startsWith("/admin/roles") ||
                    currentPath.startsWith("/admin/permissions"),
            };

            setExpandedCategories(newExpandedState);
        }
    }, [url]);

    const toggleCategory = (categoryKey) => {
        if (!sidebarCollapsed || isMobile) {
            setExpandedCategories((prev) => ({
                ...prev,
                [categoryKey]: !prev[categoryKey],
            }));
        }
    };

    // Handle navigation with event prevention
    const handleNavigation = (e, href) => {
        if (!href || href === "#") {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        if (isMobile && setMobileMenuOpen) {
            setMobileMenuOpen(false);
        }

        // Use Inertia router for navigation
        try {
            router.visit(href);
        } catch (error) {
            console.warn("Navigation error:", error);
            // Fallback to window location
            window.location.href = href;
        }
    };

    return (
        <>
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                {(!sidebarCollapsed || isMobile) && (
                    <Link href="/" className="flex-shrink-0">
                        <ApplicationLogo className="h-8 w-auto fill-current text-gray-800" />
                    </Link>
                )}
                {!isMobile && setSidebarCollapsed && (
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                        title={
                            sidebarCollapsed
                                ? "Expand Sidebar"
                                : "Collapse Sidebar"
                        }
                    >
                        <i
                            className={`fas ${
                                sidebarCollapsed ? "fa-bars" : "fa-times"
                            } text-current`}
                        ></i>
                    </button>
                )}
                {isMobile && setMobileMenuOpen && (
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                    >
                        <i className="fas fa-times text-current"></i>
                    </button>
                )}
            </div>

            {/* Sidebar Menu */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="space-y-2 px-3">
                    {menuCategories.map((category, index) => {
                        const linkHref = getHref(category);
                        const pathForCheck = getPathForCheck(category);
                        const isCategoryActive = pathForCheck
                            ? isCurrentPath(pathForCheck)
                            : isChildActive(category.items);
                        const categoryIcon = (
                            <i className={`${category.icon} text-current`}></i>
                        );

                        return (
                            <li key={category.key || index}>
                                <div className="group">
                                    {/* Category Header - Direct link or Dropdown */}
                                    {category.type === "link" ? (
                                        // Direct link (Dashboard, Pelayanan, etc.)
                                        <Link
                                            href={linkHref}
                                            onClick={(e) =>
                                                handleNavigation(e, linkHref)
                                            }
                                            className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                sidebarCollapsed && !isMobile
                                                    ? "justify-center"
                                                    : "justify-start"
                                            } ${
                                                isCategoryActive
                                                    ? "text-blue-600 bg-blue-50 border border-blue-200 shadow-sm"
                                                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                            }`}
                                        >
                                            <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                                {categoryIcon}
                                            </span>
                                            {(!sidebarCollapsed ||
                                                isMobile) && (
                                                <span className="ml-3 truncate">
                                                    {category.name}
                                                </span>
                                            )}
                                        </Link>
                                    ) : (
                                        // Dropdown button (Berita, Dokumen, Portal Data, Pengaturan)
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                toggleCategory(category.key);
                                            }}
                                            className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                                                sidebarCollapsed && !isMobile
                                                    ? "justify-center"
                                                    : "justify-between"
                                            } ${
                                                isCategoryActive ||
                                                expandedCategories[category.key]
                                                    ? "text-blue-600 bg-blue-50 border border-blue-200 shadow-sm"
                                                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                                            }`}
                                        >
                                            <div className="flex items-center min-w-0">
                                                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                                                    {categoryIcon}
                                                </span>
                                                {(!sidebarCollapsed ||
                                                    isMobile) && (
                                                    <span className="ml-3 truncate">
                                                        {category.name}
                                                    </span>
                                                )}
                                            </div>
                                            {/* Arrow indicator */}
                                            {(!sidebarCollapsed || isMobile) &&
                                                category.items &&
                                                category.items.length > 0 && (
                                                    <i
                                                        className={`fas fa-chevron-right text-xs transition-transform duration-200 flex-shrink-0 ${
                                                            expandedCategories[
                                                                category.key
                                                            ]
                                                                ? "rotate-90"
                                                                : ""
                                                        }`}
                                                    ></i>
                                                )}
                                        </button>
                                    )}

                                    {/* Submenu items with smooth animation - hanya untuk dropdown */}
                                    {category.type === "dropdown" &&
                                        (!sidebarCollapsed || isMobile) &&
                                        category.items &&
                                        category.items.length > 0 && (
                                            <div
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                                    expandedCategories[
                                                        category.key
                                                    ]
                                                        ? "max-h-96 opacity-100"
                                                        : "max-h-0 opacity-0"
                                                }`}
                                            >
                                                <ul className="ml-8 mt-2 space-y-1">
                                                    {category.items.map(
                                                        (item, itemIndex) => {
                                                            const itemHref =
                                                                getHref(item);
                                                            const pathForCheck =
                                                                getPathForCheck(
                                                                    item,
                                                                );
                                                            const isItemActive =
                                                                pathForCheck
                                                                    ? isCurrentPath(
                                                                          pathForCheck,
                                                                      )
                                                                    : false;

                                                            return (
                                                                <li
                                                                    key={
                                                                        item.route ||
                                                                        itemIndex
                                                                    }
                                                                >
                                                                    <Link
                                                                        href={
                                                                            itemHref ||
                                                                            "#"
                                                                        }
                                                                        onClick={(
                                                                            e,
                                                                        ) =>
                                                                            handleNavigation(
                                                                                e,
                                                                                itemHref,
                                                                            )
                                                                        }
                                                                        className={`block px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                                                                            isItemActive
                                                                                ? "text-blue-600 bg-blue-50 font-medium border border-blue-200"
                                                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                                                        }`}
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </Link>
                                                                </li>
                                                            );
                                                        },
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    );
};

export default SidebarContent;
