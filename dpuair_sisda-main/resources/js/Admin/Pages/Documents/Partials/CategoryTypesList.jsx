import React from "react";

/**
 * Komponen list tipe dokumen dalam tabel kategori.
 *
 * @param {Object} props
 * @param {Object} props.category - Data kategori
 * @param {Set} props.showAllTypes - Set ID kategori yang expanded
 * @param {Function} props.toggleShowAllTypes - Fungsi toggle expand
 * @param {Function} props.handleEditType - Handler edit tipe
 * @param {Function} props.handleCreateType - Handler create tipe
 */
const CategoryTypesList = ({
    category,
    showAllTypes,
    toggleShowAllTypes,
    handleEditType,
    handleCreateType,
}) => {
    const showAll = showAllTypes.has(category.id);
    const displayTypes = showAll ? category.types : category.types.slice(0, 3);
    const hasMore = category.types.length > 3;

    return (
        <div className="space-y-2">
            {category.types && category.types.length > 0 ? (
                <>
                    {displayTypes.map((type) => (
                        <div
                            key={type.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">
                                    {type.name}
                                </span>
                                <span
                                    className={`w-2 h-2 rounded-full ${
                                        type.is_active
                                            ? "bg-green-500"
                                            : "bg-gray-400"
                                    }`}
                                ></span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">
                                    {type.documents_count || 0}
                                </span>
                                <button
                                    onClick={() => handleEditType(type)}
                                    className="text-blue-600 hover:text-blue-800 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Edit Tipe Dokumen"
                                >
                                    <i className="fas fa-edit text-xs"></i>
                                </button>
                            </div>
                        </div>
                    ))}

                    {hasMore && (
                        <button
                            onClick={() => toggleShowAllTypes(category.id)}
                            className="w-full text-center py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center justify-center space-x-1"
                            title={
                                showAll
                                    ? "Kembali ke tampilan default"
                                    : "Tampilkan semua tipe dokumen"
                            }
                        >
                            <i
                                className={`fas ${
                                    showAll
                                        ? "fa-chevron-up"
                                        : "fa-chevron-down"
                                } text-xs`}
                            ></i>
                            <span>{showAll ? "Default" : "Show More"}</span>
                        </button>
                    )}
                </>
            ) : (
                <div className="text-center py-2">
                    <span className="text-sm text-gray-500">
                        Tidak ada tipe dokumen
                    </span>
                </div>
            )}

            <button
                onClick={() => handleCreateType(category)}
                className="w-full mt-2 text-center py-2.5 text-sm font-medium text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center space-x-2 border border-dashed border-green-300 hover:border-green-600 shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                title="Tambah Tipe Dokumen Baru"
            >
                <i className="fas fa-plus text-xs"></i>
                <span>Tambah Tipe Dokumen</span>
            </button>
        </div>
    );
};

export default CategoryTypesList;
