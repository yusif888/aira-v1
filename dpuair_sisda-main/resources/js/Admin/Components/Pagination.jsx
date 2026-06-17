import React from "react";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

const Pagination = ({
    pagination,
    showInfo = true,
    onPageChange,
    routeName,
    filters = {},
}) => {
    if (!pagination) {
        return null;
    }

    // Pastikan nilai current_page dan last_page ada dan valid
    const currentPage = parseInt(pagination.current_page) || 1;
    const lastPage = parseInt(pagination.last_page) || 1;

    if (lastPage <= 1) {
        return null;
    }

    const handlePageClick = (page) => {
        // Validasi halaman yang diminta
        if (page < 1 || page > lastPage) return;
        
        // Mencegah navigasi ke halaman yang sama
        if (page === currentPage) return;
        
        if (onPageChange) {
            // Jika ada custom handler, gunakan itu
            onPageChange(page);
        } else if (routeName) {
            // Jika tidak ada custom handler tapi ada routeName, gunakan internal handler
            const params = {
                ...filters,
                page: page,
            };
            
            // Gunakan window.location untuk langsung pindah tanpa loading
            const url = route(routeName, params);
            window.location.href = url;
        } else {
            // Fallback jika tidak ada onPageChange dan routeName
            console.warn("Neither onPageChange nor routeName provided, using fallback navigation");
            const url = new URL(window.location.href);
            url.searchParams.set('page', page);
            window.location.href = url.toString();
        }
    };

    const generatePageNumbers = () => {
        const pages = [];
        
        // Selalu tampilkan halaman pertama
        pages.push(1);
        
        // Tampilkan halaman di sekitar halaman saat ini
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(lastPage - 1, currentPage + 1);
        
        for (let i = startPage; i <= endPage; i++) {
            if (i !== 1 && i !== lastPage) {
                pages.push(i);
            }
        }
        
        // Selalu tampilkan halaman terakhir jika ada lebih dari 1 halaman
        if (lastPage > 1) {
            pages.push(lastPage);
        }
        
        return [...new Set(pages)].sort((a, b) => a - b);
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className="flex items-center justify-between px-6 py-3 border-t bg-white text-sm text-gray-600">
            {showInfo && (
                <div>
                    Menampilkan {pagination.from || 0} - {pagination.to || 0}{" "}
                    dari {pagination.total || 0}
                </div>
            )}

            <div className="flex items-center gap-2">
                {/* Tombol Sebelumnya */}
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className={`px-3 py-2 text-sm font-medium rounded-md border ${
                        currentPage <= 1
                            ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
                            : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                >
                    <i className="fas fa-chevron-left mr-1"></i>
                    Sebelumnya
                </button>

                {/* Nomor Halaman */}
                {pageNumbers.map((page, index) => {
                    const prevPage = pageNumbers[index - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;

                    return (
                        <React.Fragment key={page}>
                            {showEllipsis && (
                                <span className="px-2 py-2 text-gray-500">...</span>
                            )}
                            <button
                                onClick={() => handlePageClick(page)}
                                className={`px-3 py-2 text-sm font-medium rounded-md border ${
                                    page === currentPage
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                {page}
                            </button>
                        </React.Fragment>
                    );
                })}

                {/* Tombol Selanjutnya */}
                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                    className={`px-3 py-2 text-sm font-medium rounded-md border ${
                        currentPage >= lastPage
                            ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
                            : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                >
                    Selanjutnya
                    <i className="fas fa-chevron-right ml-1"></i>
                </button>
            </div>
        </div>
    );
};

export default Pagination;