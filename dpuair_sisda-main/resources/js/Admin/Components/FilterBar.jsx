import React from "react";
import { router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import PageSelector from "./PageSelector";
import { DateRangePicker, TagPicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

/**
 * FilterBar Component - Komponen filter yang dapat digunakan kembali untuk semua halaman admin
 *
 * @param {Object} props - Props komponen
 * @param {Object} props.filters - Object berisi nilai filter saat ini
 * @param {Function} props.onFilterChange - Callback function untuk perubahan filter (opsional)
 * @param {Function} props.onReset - Callback function untuk reset filter (opsional)
 * @param {Function} props.onApply - Callback function untuk apply filter (opsional)
 * @param {boolean} props.processing - Status loading saat apply filter
 * @param {number} props.totalItems - Total item yang ditemukan
 * @param {string} props.itemLabel - Label untuk item (contoh: "dokumen", "berita")
 *
 * // Search Options
 * @param {boolean} props.showSearch - Tampilkan input pencarian
 * @param {string} props.searchPlaceholder - Placeholder untuk input pencarian
 * @param {string} props.searchColSpan - Class CSS untuk search column span
 *
 * // Category Options
 * @param {boolean} props.showCategory - Tampilkan filter kategori
 * @param {Array} props.categories - Array data kategori untuk dropdown
 * @param {string} props.categoryLabel - Label untuk kategori
 *
 * // Type Options
 * @param {boolean} props.showType - Tampilkan filter tipe/jenis
 * @param {Array} props.types - Array data tipe untuk dropdown
 * @param {string} props.typeLabel - Label untuk tipe
 * @param {boolean} props.typeDependsOnCategory - Tipe bergantung pada kategori yang dipilih
 *
 * // Status Options
 * @param {boolean} props.showStatus - Tampilkan filter status
 * @param {Array} props.statusOptions - Array opsi status untuk dropdown
 * @param {string} props.statusLabel - Label untuk status
 *
 * // Priority Options
 * @param {boolean} props.showPriority - Tampilkan filter prioritas
 * @param {Array} props.priorityOptions - Array opsi prioritas untuk dropdown
 * @param {string} props.priorityLabel - Label untuk prioritas
 *
 * // Year Options
 * @param {boolean} props.showYear - Tampilkan filter tahun
 * @param {Array} props.years - Array tahun untuk dropdown
 * @param {string} props.yearLabel - Label untuk tahun
 *
 * // Date Range Options
 * @param {boolean} props.showDateRange - Tampilkan filter rentang tanggal
 * @param {string} props.dateRangeLabel - Label untuk rentang tanggal
 * @param {Array} props.dateRange - Array tanggal range [start, end]
 * @param {Function} props.onDateRangeChange - Callback untuk perubahan date range
 *
 * // Tags Options
 * @param {boolean} props.showTags - Tampilkan filter tags
 * @param {Array} props.tags - Array data tags
 * @param {string} props.tagsLabel - Label untuk tags
 * @param {Array} props.selectedTags - Array tags yang dipilih
 * @param {Function} props.onTagsChange - Callback untuk perubahan tags
 *
 * // Layout Options
 * @param {string} props.gridCols - Class CSS untuk grid columns
 * @param {string} props.variant - Variant styling ('default', 'compact', 'detailed')
 * @param {boolean} props.showActions - Tampilkan action buttons
 * @param {boolean} props.showTotal - Tampilkan total items
 * @param {string} props.className - Class tambahan untuk container
 */
const FilterBar = ({
    filters = {},
    onFilterChange,
    onReset,
    onApply,
    processing = false,
    totalItems = 0,
    itemLabel = "item",

    // Search Options
    showSearch = true,
    searchPlaceholder = "Cari...",
    searchColSpan = "md:col-span-2",

    // Category Options
    showCategory = false,
    categories = [],
    categoryLabel = "Kategori",

    // Type Options
    showType = false,
    types = [],
    typeLabel = "Jenis",
    typeDependsOnCategory = false,

    // Status Options
    showStatus = false,
    statusOptions = [],
    statusLabel = "Status",

    // Priority Options
    showPriority = false,
    priorityOptions = [],
    priorityLabel = "Prioritas",

    // Year Options
    showYear = false,
    years = [],
    yearLabel = "Tahun Dokumen",

    // Date Range Options
    showDateRange = false,
    dateRangeLabel = "Rentang Tanggal",
    dateRange = [],
    onDateRangeChange,

    // Tags Options
    showTags = false,
    tags = [],
    tagsLabel = "Tags",
    selectedTags = [],
    onTagsChange,

    // Layout Options
    gridCols = "md:grid-cols-4",
    variant = "default",
    showActions = true,
    showTotal = true,
    className = "",

    // Page Selector Options
    showPageSelector = false,
    pageSelectorOptions = [5, 10, 25, 50, 100],
    pageSelectorLabel = "Tampilkan:",
    pageSelectorSuffix = "per halaman",
}) => {
    const handleSearchChange = (value) => {
        // Update local state and trigger filter change
        if (onFilterChange) {
            onFilterChange("search", value);
        }
    };

    const handleSelectChange = (field, value) => {
        if (onFilterChange) {
            onFilterChange(field, value);
        } else {
            router.get(
                window.location.pathname,
                { ...filters, [field]: value },
                { preserveState: true },
            );
        }
    };

    const handleReset = () => {
        if (onReset) {
            onReset();
        } else {
            router.get(window.location.pathname);
        }
    };

    const handleApply = () => {
        if (onApply) {
            onApply();
        }
    };

    // Render date range picker menggunakan rsuite DateRangePicker
    const renderDateRangePicker = () => {
        if (!showDateRange) return null;

        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {dateRangeLabel}
                </label>
                <div className="relative">
                    <DateRangePicker
                        placeholder="Pilih rentang tanggal"
                        onChange={(value) => {
                            if (onDateRangeChange) onDateRangeChange(value);
                        }}
                        className="w-full"
                    />
                </div>
            </div>
        );
    };

    // Render tags picker menggunakan rsuite TagPicker
    const renderTagsPicker = () => {
        if (!showTags) return null;

        return (
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {tagsLabel}
                </label>
                <div className="relative">
                    <TagPicker
                        data={tags.map((tag) => ({
                            label: tag.name,
                            value: tag.id,
                        }))}
                        value={selectedTags}
                        onChange={(value) => {
                            if (onTagsChange) onTagsChange(value);
                        }}
                        placeholder="Pilih tags"
                        style={{ width: "100%" }}
                    />
                </div>
            </div>
        );
    };

    const getContainerClasses = () => {
        switch (variant) {
            case "compact":
                return "mb-4 bg-gray-50 p-3 rounded-lg border";
            case "detailed":
                return "mb-6 bg-gray-50 p-4 rounded-lg border";
            default:
                return "mb-6";
        }
    };

    const getActionClasses = () => {
        switch (variant) {
            case "compact":
                return "flex justify-between items-center mt-3 pt-3 border-t border-gray-200";
            case "detailed":
                return "flex justify-between items-center mt-4 pt-4 border-t border-gray-200";
            default:
                return "flex justify-between items-center mt-4";
        }
    };

    return (
        <div className={`${getContainerClasses()} ${className}`}>
            <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
                {/* Search Input */}
                {showSearch && (
                    <div className={searchColSpan}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pencarian
                        </label>
                        <div className="relative">
                            <TextInput
                                type="text"
                                className="w-full text-sm"
                                placeholder={searchPlaceholder}
                                value={filters.search || ""}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        if (onFilterChange) {
                                            onFilterChange(
                                                "search",
                                                e.target.value,
                                            );
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Category Filter */}
                {showCategory && categories.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {categoryLabel}
                        </label>
                        <select
                            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                            value={filters.category || ""}
                            onChange={(e) =>
                                handleSelectChange("category", e.target.value)
                            }
                        >
                            <option value="">Semua {categoryLabel}</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Type Filter */}
                {showType && types.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {typeLabel}
                        </label>
                        <select
                            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                            value={filters.type || ""}
                            onChange={(e) =>
                                handleSelectChange("type", e.target.value)
                            }
                            disabled={
                                typeDependsOnCategory && !filters.category
                            }
                        >
                            <option value="">
                                {typeDependsOnCategory && !filters.category
                                    ? `Pilih ${categoryLabel} dulu`
                                    : `Semua ${typeLabel}`}
                            </option>
                            {types.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Status Filter */}
                {showStatus && statusOptions.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {statusLabel}
                        </label>
                        <select
                            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                            value={filters.status || ""}
                            onChange={(e) =>
                                handleSelectChange("status", e.target.value)
                            }
                        >
                            <option value="">Semua {statusLabel}</option>
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Priority Filter */}
                {showPriority && priorityOptions.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {priorityLabel}
                        </label>
                        <select
                            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                            value={filters.priority || ""}
                            onChange={(e) =>
                                handleSelectChange("priority", e.target.value)
                            }
                        >
                            <option value="">Semua {priorityLabel}</option>
                            {priorityOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Year Filter */}
                {showYear && years.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {yearLabel}
                        </label>
                        <select
                            className="w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                            value={filters.year || ""}
                            onChange={(e) =>
                                handleSelectChange("year", e.target.value)
                            }
                        >
                            <option value="">Semua {yearLabel}</option>
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Date Range Filter */}
                {renderDateRangePicker()}

                {/* Tags Filter */}
                {renderTagsPicker()}

                {/* Page Selector Filter */}
                {showPageSelector && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {pageSelectorLabel}
                        </label>
                        <PageSelector
                            value={filters.per_page || "10"}
                            onChange={(value) => {
                                if (onFilterChange) {
                                    onFilterChange("per_page", value);
                                } else {
                                    router.get(
                                        window.location.pathname,
                                        { ...filters, per_page: value },
                                        { preserveState: true },
                                    );
                                }
                            }}
                            options={pageSelectorOptions}
                            label=""
                            suffix={pageSelectorSuffix}
                        />
                    </div>
                )}
            </div>

            {/* Filter Actions */}
            {showActions && (
                <div className={getActionClasses()}>
                    {showTotal && (
                        <div className="text-sm text-gray-600">
                            {totalItems} {itemLabel} ditemukan
                        </div>
                    )}
                    <div className="flex gap-2">
                        <SecondaryButton
                            onClick={handleReset}
                            className="flex items-center gap-2"
                        >
                            <i className="fas fa-undo"></i>
                            Reset Filter
                        </SecondaryButton>
                        {onApply && (
                            <PrimaryButton
                                onClick={handleApply}
                                disabled={processing}
                                className="flex items-center gap-2"
                            >
                                <i className="fas fa-search"></i>
                                {processing ? "Mencari..." : "Terapkan Filter"}
                            </PrimaryButton>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterBar;
