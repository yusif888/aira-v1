import React, { useState } from "react";

export default function SidebarInfrastrukturSDA({ 
    categories = [], 
    filters = {}, 
    onToggleFilter,
    isOpen = true,
    onToggleOpen 
}) {
    const [openCategories, setOpenCategories] = useState(() => {
        const initial = {};
        categories.forEach((category) => {
            initial[category.id] = false;
        });
        return initial;
    });

    const toggleCategory = (categoryId) => {
        setOpenCategories((prev) => ({
            ...prev,
            [categoryId]: !prev[categoryId],
        }));
    };

    return (
        <div
            className={`absolute top-24 left-4 z-30 overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 ease-in-out ${
                isOpen ? "w-72" : "h-12 w-12"
            }`}
        >
            {/* Header yang juga berfungsi sebagai tombol */}
            <button
                onClick={onToggleOpen}
                className={`flex h-12 w-full items-center border-b border-gray-200 ${
                    isOpen ? "justify-between px-4" : "justify-center"
                }`}
                aria-label={isOpen ? "Tutup Filter" : "Buka Filter"}
            >
                {isOpen && (
                    <h2 className="text-base font-bold text-gray-800">
                        Legenda Peta
                    </h2>
                )}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={
                            isOpen
                                ? "M6 18L18 6M6 6l12 12"
                                : "M4 6h16M4 12h16M4 18h7"
                        }
                    />
                </svg>
            </button>

            {/* Konten Filter */}
            <div className="h-[calc(100vh-10rem)] space-y-4 overflow-y-auto p-4">
                {categories.length === 0 ? (
                    <div className="text-center py-8">
                        <i className="fas fa-folder-open text-4xl text-gray-300 mb-3"></i>
                        <p className="text-sm text-gray-500">Tidak ada kategori</p>
                    </div>
                ) : (
                    categories.map((category) => (
                        <div
                            key={category.id}
                            className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
                        >
                            {/* Category Header */}
                            <button
                                onClick={() => toggleCategory(category.id)}
                                className="group mb-3 flex w-full items-center justify-between text-left hover:bg-gray-50 rounded-md p-2 -ml-2 transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    {category.icon ? (
                                        category.icon.startsWith('<svg') ? (
                                            <div 
                                                className="w-5 h-5 text-gray-500 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                                                dangerouslySetInnerHTML={{ __html: category.icon }}
                                            />
                                        ) : (
                                            <i className={`${category.icon} text-gray-500 text-lg w-5`}></i>
                                        )
                                    ) : (
                                        <i className="fas fa-layer-group text-gray-500 text-lg w-5"></i>
                                    )}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600">
                                            {category.name}
                                        </h3>
                                        {category.data_count > 0 && (
                                            <span className="text-xs text-gray-500">
                                                {category.data_count} data
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                                        openCategories[category.id] ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* Category Items */}
                            {openCategories[category.id] && (
                                <div className="animate-fade-in-down space-y-2 pl-4">
                                    {!category.data || category.data.length === 0 ? (
                                        <p className="text-xs text-gray-400 italic py-2">
                                            Belum ada data
                                        </p>
                                    ) : (
                                        category.data.map((item) => (
                                            <label
                                                key={item.id}
                                                className="group flex cursor-pointer items-start gap-3 p-2 hover:bg-blue-50 rounded-md transition-colors duration-200"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={filters[item.id] || false}
                                                    onChange={() => onToggleFilter(item.id)}
                                                    className="h-4 w-4 mt-0.5 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        {/* Legend shape based on type */}
                                                        {item.type === 'marker' && (
                                                            <span
                                                                className="h-3 w-3 rounded-full flex-shrink-0"
                                                                style={{
                                                                    backgroundColor: item.legend_color || '#3B82F6',
                                                                }}
                                                            ></span>
                                                        )}
                                                        {item.type === 'polygon' && (
                                                            <span
                                                                className="h-3 w-3 rounded-sm flex-shrink-0"
                                                                style={{
                                                                    backgroundColor: item.legend_color || '#3B82F6',
                                                                }}
                                                            ></span>
                                                        )}
                                                        {item.type === 'line' && (
                                                            <span
                                                                className="h-0.5 w-6 flex-shrink-0"
                                                                style={{
                                                                    backgroundColor: item.legend_color || '#3B82F6',
                                                                }}
                                                            ></span>
                                                        )}
                                                        <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    {item.description && (
                                                        <p className="text-xs text-gray-500 mt-1 ml-5 line-clamp-2">
                                                            {item.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </label>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
