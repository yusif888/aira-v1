import React, { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import SecondaryButton from "@/Components/SecondaryButton";
import DataTable from "@/Admin/Components/DataTable";
import FilterBar from "@/Admin/Components/FilterBar";
import EmptyState from "@/Admin/Components/EmptyState";
import Pagination from "@/Admin/Components/Pagination";
import {confirmRestore, confirmPermanentDelete, showSuccess, showError } from "@/Components/SweetAlert";

export default function Trash({
    auth,
    documents,
    categories,
    types,
    years,
    filters,
}) {
    const { delete: destroy, post, get } = useForm();
    const [showFilters, setShowFilters] = useState(false);

    const handleRestore = (document) => {
        confirmRestore(document.title, "dokumen").then((result) => {
            if (result.isConfirmed) {
                post(route("admin.documents.restore", document.id), {
                    onSuccess: () => {
                        showSuccess(document.title, "berhasil dipulihkan", "dokumen");
                    },
                    onError: () => {
                        showError("Terjadi kesalahan saat memulihkan dokumen.");
                    },
                });
            }
        });
    };

    const handleForceDelete = (document) => {
        confirmPermanentDelete(document.title, "dokumen").then((result) => {
            if (result.isConfirmed) {
                destroy(route("admin.documents.force-delete", document.id), {
                    onSuccess: () => {
                        showSuccess(document.title, "berhasil dihapus secara permanen", "dokumen");
                    },
                    onError: () => {
                        showError("Terjadi kesalahan saat menghapus dokumen.");
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dokumen Terhapus
                </h2>
            }
        >
            <Head title="Trash Dokumen" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Manajemen Dokumen yang Dihapus
                                    </h3>
                                </div>
                                <div className="flex gap-2">
                                    <SecondaryButton
                                        onClick={() =>
                                            setShowFilters(!showFilters)
                                        }
                                        className="flex items-center gap-2"
                                    >
                                        <i
                                            className={`fas ${
                                                showFilters
                                                    ? "fa-times"
                                                    : "fa-filter"
                                            }`}
                                        ></i>
                                        {showFilters
                                            ? "Sembunyikan Filter"
                                            : "Filter"}
                                    </SecondaryButton>
                                </div>
                            </div>

                            {/* Filters */}
                            {showFilters && (
                                <div className="filter-slide-in">
                                    <FilterBar
                                        filters={filters}
                                        onFilterChange={(field, value) => {
                                            router.get(
                                                route("admin.documents.trash"),
                                                { ...filters, [field]: value },
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                }
                                            );
                                        }}
                                        onReset={() => {
                                            router.get(
                                                route("admin.documents.trash"),
                                                {},
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                }
                                            );
                                        }}
                                        searchPlaceholder="Cari judul dokumen..."
                                        showSearch={true}
                                        showCategory={false}
                                        showStatus={false}
                                        totalItems={documents.total}
                                        itemLabel="dokumen terhapus"
                                        gridCols="md:grid-cols-3"
                                        searchColSpan="md:col-span-2"
                                        variant="detailed"
                                        showPageSelector={true}
                                        pageSelectorOptions={[5, 10, 25, 50, 100]}
                                    />
                                </div>
                            )}

                            <DataTable
                                columns={[
                                    {
                                        key: "title",
                                        label: "Judul",
                                        className: "w-1/3 max-w-0",
                                        render: (item) => (
                                            <div className="max-w-xs">
                                                <div className="font-medium text-gray-900 truncate">
                                                    {item.title}
                                                </div>
                                                {item.document_number && (
                                                    <div className="text-sm text-gray-500">
                                                        {item.document_number}
                                                    </div>
                                                )}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "category",
                                        label: "Kategori",
                                        className: "w-1/6",
                                        render: (item) =>
                                            item.type?.category?.name || "-",
                                    },
                                    {
                                        key: "type",
                                        label: "Jenis",
                                        className: "w-1/6",
                                        render: (item) =>
                                            item.type?.name || "-",
                                    },
                                    {
                                        key: "year",
                                        label: "Tahun",
                                        className: "w-1/6",
                                        render: (item) =>
                                            item.year || "-",
                                    },
                                    {
                                        key: "deleted_at",
                                        label: "Dihapus",
                                        className: "w-1/6",
                                        render: (item) =>
                                            item.deleted_at
                                                ? new Date(item.deleted_at).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          day: "2-digit",
                                                          month: "2-digit",
                                                          year: "numeric",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      }
                                                  )
                                                : "-",
                                    },
                                ]}
                                data={documents?.data || []}
                                actions={[
                                    {
                                        key: "restore",
                                        title: "Pulihkan",
                                        icon: "fas fa-undo",
                                    },
                                    {
                                        key: "permanent-delete",
                                        title: "Hapus Permanen",
                                        icon: "fas fa-trash",
                                        variant: "danger",
                                    },
                                ]}
                                onActionClick={(action, item) => {
                                    if (action === "restore") {
                                        handleRestore(item);
                                    } else if (action === "permanent-delete") {
                                        handleForceDelete(item);
                                    }
                                }}
                                showHeader={true}
                                emptyState={
                                    <EmptyState
                                        icon="fas fa-trash"
                                        title="Trash kosong"
                                        description="Tidak ada dokumen yang dihapus"
                                        actionLink={route("admin.documents.index")}
                                        actionText="Kembali ke Dokumen"
                                        variant="minimal"
                                    />
                                }
                            />

                            {/* Pagination */}
                            <Pagination pagination={documents} showInfo={true} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
