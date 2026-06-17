import React from 'react';

/**
 * PageSelector Component - Komponen selector per page yang sederhana
 * 
 * @param {Object} props - Props komponen
 * @param {string} props.value - Nilai per page saat ini
 * @param {Function} props.onChange - Callback function untuk perubahan per page
 * @param {Array} props.options - Array opsi per page
 * @param {string} props.label - Label untuk selector
 * @param {string} props.suffix - Teks setelah selector
 * 
 * @example
 * <PageSelector
 *   value={data.per_page || "10"}
 *   onChange={(value) => {
 *     setData("per_page", value);
 *     router.get(route("admin.news.index"), { ...data, per_page: value }, { preserveState: true });
 *   }}
 *   label="Tampilkan:"
 *   suffix="per halaman"
 * />
 */
const PageSelector = ({ 
    value = "10",
    onChange,
    options = [5, 10, 25, 50, 100],
    label = "Tampilkan:",
    suffix = "per halaman"
}) => {
    return (
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <select
                className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
            <span className="text-sm text-gray-600">
                {suffix}
            </span>
        </div>
    );
};

export default PageSelector;
