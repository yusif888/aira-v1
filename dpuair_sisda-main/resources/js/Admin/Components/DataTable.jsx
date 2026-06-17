import React, { useState, useMemo } from "react";
import { Link } from "@inertiajs/react";

const DataTable = ({
    columns,
    data,
    actions = [],
    onActionClick,
    showActions = true,
    showHeader = true,
    className = "",
    emptyState = null,
    sortable = true,
    defaultSort = null,
}) => {
    const [sortConfig, setSortConfig] = useState(
        defaultSort || { key: null, direction: "asc" },
    );

    const hasData = data && data.length > 0;

    // Function to handle sorting
    const handleSort = (key) => {
        if (!sortable) return;

        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Sort data based on current sort configuration
    const sortedData = useMemo(() => {
        if (!hasData || !sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // Handle null/undefined values
            if (aValue == null && bValue == null) return 0;
            if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
            if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

            // Handle different data types
            if (typeof aValue === "string" && typeof bValue === "string") {
                const comparison = aValue.localeCompare(bValue, "id", {
                    numeric: true,
                });
                return sortConfig.direction === "asc"
                    ? comparison
                    : -comparison;
            }

            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc"
                    ? aValue - bValue
                    : bValue - aValue;
            }

            // Fallback to string comparison
            const comparison = String(aValue).localeCompare(
                String(bValue),
                "id",
                { numeric: true },
            );
            return sortConfig.direction === "asc" ? comparison : -comparison;
        });
    }, [data, sortConfig, hasData]);

    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">
                {showHeader && (
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    scope="col"
                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                                        column.align === "center"
                                            ? "text-center"
                                            : "text-left"
                                    } ${sortable && column.sortable !== false ? "cursor-pointer hover:bg-gray-100 select-none" : ""}`}
                                    onClick={() =>
                                        sortable &&
                                        column.sortable !== false &&
                                        handleSort(column.key)
                                    }
                                >
                                    <div className="flex items-center gap-1">
                                        <span>{column.label}</span>
                                        {sortable &&
                                            column.sortable !== false && (
                                                <div className="flex flex-col">
                                                    <i
                                                        className={`fas fa-chevron-up text-xs ${
                                                            sortConfig.key ===
                                                                column.key &&
                                                            sortConfig.direction ===
                                                                "asc"
                                                                ? "text-blue-600"
                                                                : "text-gray-400"
                                                        }`}
                                                    ></i>
                                                    <i
                                                        className={`fas fa-chevron-down text-xs -mt-1 ${
                                                            sortConfig.key ===
                                                                column.key &&
                                                            sortConfig.direction ===
                                                                "desc"
                                                                ? "text-blue-600"
                                                                : "text-gray-400"
                                                        }`}
                                                    ></i>
                                                </div>
                                            )}
                                    </div>
                                </th>
                            ))}
                            {showActions && (
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Aksi
                                </th>
                            )}
                        </tr>
                    </thead>
                )}
                <tbody className="bg-white divide-y divide-gray-200">
                    {hasData ? (
                        sortedData.map((item, rowIndex) => (
                            <tr
                                key={item.id || rowIndex}
                                className="hover:bg-gray-50"
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            column.align === "center"
                                                ? "text-center"
                                                : "text-left"
                                        } ${column.className || ""}`}
                                    >
                                        {column.render
                                            ? column.render(item)
                                            : item[column.key]}
                                    </td>
                                ))}
                                {showActions && (
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <div className="flex justify-center gap-2">
                                            {actions.map(
                                                (action, actionIndex) => {
                                                    // Check if action should be shown for this item
                                                    if (
                                                        action.show &&
                                                        typeof action.show ===
                                                            "function" &&
                                                        !action.show(item)
                                                    ) {
                                                        return null; // Skip this action
                                                    }

                                                    const actionProps = {
                                                        key: actionIndex,
                                                        className: `inline-flex items-center justify-center w-8 h-8 rounded-md border ${
                                                            action.variant ===
                                                            "danger"
                                                                ? "text-red-600 hover:bg-red-50"
                                                                : action.variant ===
                                                                    "success"
                                                                  ? "text-green-600 hover:bg-green-50"
                                                                  : action.variant ===
                                                                      "info"
                                                                    ? "text-blue-600 hover:bg-blue-50"
                                                                    : "text-gray-600 hover:bg-gray-50"
                                                        }`,
                                                        title: action.title,
                                                        onClick: () =>
                                                            onActionClick(
                                                                action.key,
                                                                item,
                                                            ),
                                                    };

                                                    if (action.href) {
                                                        return (
                                                            <Link
                                                                key={
                                                                    actionIndex
                                                                }
                                                                href={
                                                                    typeof action.href ===
                                                                    "function"
                                                                        ? action.href(
                                                                              item,
                                                                          )
                                                                        : action.href
                                                                }
                                                                className={
                                                                    actionProps.className
                                                                }
                                                                title={
                                                                    actionProps.title
                                                                }
                                                            >
                                                                <i
                                                                    className={`${action.icon} text-sm`}
                                                                ></i>
                                                            </Link>
                                                        );
                                                    }

                                                    return (
                                                        <button
                                                            key={actionIndex}
                                                            className={
                                                                actionProps.className
                                                            }
                                                            title={
                                                                actionProps.title
                                                            }
                                                            onClick={
                                                                actionProps.onClick
                                                            }
                                                        >
                                                            <i
                                                                className={`${action.icon} text-sm`}
                                                            ></i>
                                                        </button>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + (showActions ? 1 : 0)}
                                className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                            >
                                {emptyState || "Tidak ada data tersedia."}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
