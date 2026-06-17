import React from "react";

/**
 * Banner informasi untuk kategori yang terlindungi (tidak bisa dihapus karena ada tipe dokumen terkait).
 */
const ProtectedCategoryBanner = () => {
    return (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
            <div className="ml-3 flex-1">
                <div className="text-sm text-blue-700">
                    <p>
                        Kategori yang masih dipakai tipe dokumen tidak bisa
                        dihapus. Ditandai badge{" "}
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <i className="fas fa-lock mr-1"></i> Terlindungi
                        </span>
                    </p>
                    <div className="bg-white p-3 rounded border border-blue-200 mt-2">
                        <p className="text-xs font-medium text-blue-800 mb-1">
                            <i className="fas fa-lightbulb text-yellow-500 mr-1"></i>
                            Cara menghapus:
                        </p>
                        <ul className="text-xs text-blue-700 list-disc pl-5">
                            <li>
                                Hapus semua tipe dokumen yang memakai kategori
                            </li>
                            <li>Atau ganti kategori pada tipe dokumen</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProtectedCategoryBanner;
