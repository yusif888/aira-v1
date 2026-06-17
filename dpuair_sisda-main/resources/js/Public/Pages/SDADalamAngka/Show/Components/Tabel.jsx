import React, { useRef, useState } from "react";

/**
 * Reusable table component for SDA Dalam Angka pages with pagination
 *
 * @param {Object} props
 * @param {Array} props.headers - Array of header objects: [{ key: string, label: string, align?: 'left'|'center'|'right' }]
 * @param {Array} props.data - Array of data rows (objects)
 * @param {Function} props.renderRow - Function to render each row: (row, index) => JSX
 * @param {Function} props.renderTotalRow - Optional function to render total row: (totalData) => JSX
 * @param {Object} props.totalData - Optional total data object
 * @param {string} props.noDataText - Optional text when no data available
 * @param {boolean} props.showNoColumn - Whether to auto-generate No column (default: false)
 * @param {string} props.tableCaption - Optional table caption for accessibility
 * @param {number} props.itemsPerPage - Number of items per page (default: 10)
 * @param {boolean} props.enablePagination - Whether to enable pagination (default: true)
 */

// Common cell styling classes
const CELL_CLASSES = {
    normal: "px-4 py-2 text-sm text-zinc-700",
    center: "px-4 py-2 text-sm text-zinc-700 text-center",
    bold: "px-4 py-2 text-sm text-zinc-900 font-semibold",
    boldCenter: "px-4 py-2 text-sm text-zinc-900 font-semibold text-center",
    total: "px-4 py-2 text-sm font-semibold text-zinc-800",
    totalCenter: "px-4 py-2 text-sm font-semibold text-zinc-800 text-center",
    totalBold: "px-4 py-2 text-sm font-bold text-zinc-900",
    totalBoldCenter: "px-4 py-2 text-sm font-bold text-zinc-900 text-center",

    // compact variants
    compactNormal: "px-3 py-1 text-xs text-zinc-700 break-words whitespace-normal border-b border-zinc-100 border-r border-zinc-100",
    compactCenter: "px-3 py-1 text-xs text-zinc-700 text-center break-words whitespace-normal border-b border-zinc-100 border-r border-zinc-100",
    compactBold: "px-3 py-1 text-xs text-zinc-900 font-semibold break-words whitespace-normal border-b border-zinc-100 border-r border-zinc-100",
    compactBoldCenter: "px-3 py-1 text-xs text-zinc-900 font-semibold text-center break-words whitespace-normal border-b border-zinc-100 border-r border-zinc-100",
};

/**
 * Helper function to render a table cell with consistent styling
 * @param {any} value - Cell value
 * @param {string} style - Style variant: 'normal', 'center', 'bold', 'boldCenter', 'total', 'totalCenter', 'totalBold', 'totalBoldCenter'
 * @param {Object} props - Additional props for td element
 */
export const renderCell = (value, style = 'normal', props = {}, compact = false) => {
    // Derive key for compact variant if requested
    let key = style;
    if (compact) {
        const capitalized = style.charAt(0).toUpperCase() + style.slice(1);
        const compactKey = 'compact' + capitalized;
        if (CELL_CLASSES[compactKey]) {
            key = compactKey;
        }
    }
    return (
        <td className={CELL_CLASSES[key] || CELL_CLASSES.normal} {...props}>
        {value}
        </td>
    );
};

/**
 * Helper function to render multiple cells from an object path
 * @param {Object} obj - Data object
 * @param {Array} paths - Array of property paths (e.g., ['pns.gol1', 'pppk.gol5'])
 * @param {string} style - Style variant for all cells
 */
export const renderCells = (obj, paths, style = 'center') => (
    <>
        {paths.map((path, idx) => {
            const value = path.split('.').reduce((acc, key) => acc?.[key], obj);
            return renderCell(value, style, { key: idx });
        })}
    </>
);

const Tabel = React.memo(({
    headers = [],
    data = [],
    renderRow,
    renderTotalRow,
    totalData,
    noDataText = "Data belum tersedia",
    showNoColumn = false,
    tableCaption,
    itemsPerPage = 10,
    pageSize = undefined,
    enablePagination = true,
    compact = false,
    headerBg = 'bg-zinc-50',
    headerTextClass = 'text-zinc-600',
    enableExport = false,
    showContinuationLabel = false
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const containerRef = useRef(null);

    // Validate required props
    if (!renderRow || typeof renderRow !== 'function') {
        console.error('Tabel component: renderRow prop is required and must be a function');
        return <p className="text-zinc-500 italic">Error: Invalid table configuration</p>;
    }

    if (!data || data.length === 0) {
        return <p className="text-zinc-500 italic">{noDataText}</p>;
    }

    // Pagination logic (support both `itemsPerPage` and `pageSize` props)
    const effectivePageSize = pageSize || itemsPerPage;
    const totalPages = enablePagination ? Math.ceil(data.length / effectivePageSize) : 1;
    const startIndex = enablePagination ? (currentPage - 1) * effectivePageSize : 0;
    const endIndex = enablePagination ? startIndex + effectivePageSize : data.length;
    const currentData = enablePagination ? data.slice(startIndex, endIndex) : data;

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll the table container into view smoothly
        if (containerRef.current) {
            try {
                containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch (e) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Adjust headers if showNoColumn is true
    const displayHeaders = showNoColumn
        ? [{ label: "No", align: "left", key: 'no', width: '48px' }, ...headers]
        : headers;

    // pagedData removed: we use currentData (itemsPerPage based) instead

    return (
        <div ref={containerRef} className="space-y-4">
            <div className="overflow-x-auto rounded-lg border border-zinc-200">
                <table
                    className={`min-w-full divide-y divide-zinc-200 ${compact ? 'text-xs' : 'text-sm'}`}
                    role="table"
                    aria-label={tableCaption || "Data table"}
                >
                    {tableCaption && (
                        <caption className="sr-only">{tableCaption}</caption>
                    )}
                    <thead className={`${headerBg}`}>
                        <tr>
                            {displayHeaders.map((header, idx) => (
                                <th
                                    key={idx}
                                    className={`px-4 py-3 ${compact ? 'py-2 px-3' : ''} text-xs font-semibold ${headerTextClass} ${
                                        header.align === 'center' ? 'text-center' :
                                        header.align === 'right' ? 'text-right' : 'text-left'
                                    }`}
                                    scope="col"
                                    style={ header.width ? { width: header.width } : undefined }
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {currentData.map((row, idx) => {
                            const actualIndex = startIndex + idx;
                            return (
                                <tr key={actualIndex} className="hover:bg-zinc-50">
                                    {showNoColumn && (
                                        <td className="px-4 py-2 text-sm text-zinc-700">{actualIndex + 1}</td>
                                    )}
                                    {renderRow(row, actualIndex)}
                                </tr>
                            );
                        })}
                        {renderTotalRow && totalData && (
                            <tr className="bg-blue-50" role="row">
                                {renderTotalRow(totalData)}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Export (responsive) */}
            {enableExport && (
                <div className="flex items-center justify-end gap-2 w-full px-4 py-2">
                    <button
                        onClick={() => {
                            // export CSV
                            const keys = displayHeaders.map(h => h.key || h.label).slice(showNoColumn ? 1 : 0);
                            const csvRows = [];
                            csvRows.push(['No', ...displayHeaders.map(h => h.label)].join(','));
                            (data || []).forEach((row, i) => {
                                const vals = displayHeaders.map(h => {
                                    const key = h.key || h.label;
                                    const v = row[key] ?? '';
                                    return `"${String(v).replace(/"/g, '""')}"`;
                                });
                                csvRows.push([i+1, ...vals].join(','));
                            });
                            const csvData = csvRows.join('\n');
                            const blob = new Blob([csvData], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = (tableCaption || 'table') + '.csv';
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                        }}
                        className="inline-flex items-center gap-2 px-3 py-1 border rounded bg-white hover:bg-zinc-50 text-sm"
                    >
                        <i className="fa fa-download"></i> Export CSV
                    </button>
                </div>
            )}

            {/* Pagination Controls */}
            {enablePagination && totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white border border-zinc-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <span>
                            Menampilkan {startIndex + 1} - {Math.min(endIndex, data.length)} dari {data.length} data
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                currentPage === 1
                                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            <i className="fas fa-chevron-left mr-1.5 text-xs" aria-hidden="true"></i>
                            Previous
                        </button>
                        
                        <div className="flex gap-1">
                            {[...Array(totalPages)].map((_, idx) => {
                                const page = idx + 1;
                                // Show first, last, current, and adjacent pages
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                                currentPage === page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                ) {
                                    return <span key={page} className="px-2 text-zinc-400">...</span>;
                                }
                                return null;
                            })}
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 text-sm font-medium rounded-md ${
                                currentPage === totalPages
                                    ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            Next
                            <i className="fas fa-chevron-right ml-1.5 text-xs" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
});

Tabel.displayName = 'Tabel';

export default Tabel;