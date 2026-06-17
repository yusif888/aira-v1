import React, { useState } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Datasets({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dataset
                </h2>
            }
        >
            <Head title="Dataset" />
            <div className="py-12">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-8 text-gray-900 flex flex-col items-center justify-center min-h-[300px]">
                            <span className="text-5xl mb-4 text-gray-300">
                                <i className="fas fa-database"></i>
                            </span>
                            <h3 className="text-2xl font-bold mb-2 text-gray-700">
                                Fitur "Portal Data" Segera Hadir
                            </h3>
                            <p className="text-gray-500 mb-6 text-center max-w-xl">
                                Modul pengelolaan dataset portal data sedang
                                dalam tahap pengembangan.
                                <br />
                                Nantikan fitur untuk menambah, mengedit, dan
                                memantau dataset publik di sini.
                            </p>
                            <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-500 rounded-full text-sm">
                                <i className="fas fa-tools mr-2"></i>
                                Coming Soon
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
