import React, { useState } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, useForm, router, Link } from "@inertiajs/react";
import DataTable from "@/Admin/Components/DataTable";
import FilterBar from "@/Admin/Components/FilterBar";
import PageSelector from "@/Admin/Components/PageSelector";
import Pagination from "@/Admin/Components/Pagination";
import EmptyState from "@/Admin/Components/EmptyState";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import StatusBadge from "@/Admin/Components/StatusBadge";
import {
    confirmPermanentDelete,
    showLoading,
    showSuccessModal,
    showError,
    confirmRestore,
    showErrorModal,
} from "@/Components/SweetAlert";
import DangerButton from "@/Components/DangerButton";

export default function Trash({
    auth,
    deletedNews = [],
    filters = {},
    categories = [],
}) {
    const [showFilters, setShowFilters] = useState(false);

    const { data, setData, reset } = useForm({
        search: filters?.search || "",
        category: filters?.category || "",
        per_page: filters?.per_page || "10",
    });

    const handleRestore = (newsItem) => {
        confirmRestore(newsItem?.title, "berita", 20).then((result) => {
            if (result.isConfirmed) {
                router.patch(
                    route("admin.news.restore", newsItem.id),
                    {},
                    {
                        onSuccess: () => {
                            showSuccessModal(
                                newsItem?.title,
                                "berhasil dipulihkan",
                                "berita",
                                15
                            );

                            router.get(
                                route("admin.news.trash"),
                                {},
                                {
                                    preserveState: false,
                                    preserveScroll: false,
                                }
                            );
                        },
                        onError: (errors) => {
                            console.error("Restore error:", errors);

                            let errorMessage =
                                "Terjadi kesalahan saat memulihkan berita.";

                            if (errors?.message) {
                                errorMessage = errors.message;
                            } else if (typeof errors === "string") {
                                errorMessage = errors;
                            } else if (errors?.error) {
                                errorMessage = errors.error;
                            }

                            showErrorModal(
                                errorMessage,
                                "Gagal Memulihkan Berita!"
                            );
                        },
                    }
                );
            }
        });
    };

    const handlePermanentDelete = (newsItem) => {
        confirmPermanentDelete(newsItem?.title, "berita", 20).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.news.force-delete", newsItem.id), {
                    onSuccess: () => {
                        showSuccessModal(
                            newsItem?.title,
                            "berhasil dihapus secara permanen",
                            "berita",
                            15
                        );

                        router.get(
                            route("admin.news.trash"),
                            {},
                            {
                                preserveState: false,
                                preserveScroll: false,
                            }
                        );
                    },
                    onError: (errors) => {
                        console.error("Permanent delete error:", errors);

                        let errorMessage =
                            "Terjadi kesalahan saat menghapus berita secara permanen.";

                        if (errors?.message) {
                            errorMessage = errors.message;
                        } else if (typeof errors === "string") {
                            errorMessage = errors;
                        } else if (errors?.error) {
                            errorMessage = errors.error;
                        }

                        showErrorModal(
                            errorMessage,
                            "Gagal Menghapus Berita Secara Permanen!"
                        );
                    },
                });
            }
        });
    };

    const handleFilterChange = (field, value) => {
        setData(field, value);
        router.get(
            route("admin.news.trash"),
            { ...data, [field]: value },
            { preserveState: true }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Berita Terhapus
                </h2>
            }
        >
            <Head title="Berita Terhapus" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Berita yang Dihapus
                                </h2>
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
                                        filters={data}
                                        onFilterChange={handleFilterChange}
                                        onReset={() => {
                                            reset();
                                            router.get(
                                                route("admin.news.trash")
                                            );
                                        }}
                                        searchPlaceholder="Cari judul, ringkasan, atau konten..."
                                        showSearch={true}
                                        showCategory={true}
                                        showStatus={false}
                                        categories={categories}
                                        totalItems={deletedNews.total}
                                        itemLabel="berita terhapus"
                                        gridCols="md:grid-cols-4"
                                        searchColSpan="md:col-span-2"
                                        variant="detailed"
                                        showPageSelector={true}
                                        pageSelectorOptions={[
                                            5, 10, 25, 50, 100,
                                        ]}
                                    />
                                </div>
                            )}

                            {/* DataTable dengan header yang selalu ditampilkan */}
                            <DataTable
                                columns={[
                                    {
                                        key: "title",
                                        label: "Berita",
                                        className: "w-1/3 max-w-0",
                                        render: (item) => (
                                            <div className="flex items-center gap-3">
                                                {item.featured_image_path && (
                                                    <img
                                                        src={
                                                            "/storage/" +
                                                            item.featured_image_path
                                                        }
                                                        alt=""
                                                        className="w-12 h-12 object-cover rounded-md border flex-shrink-0"
                                                    />
                                                )}
                                                <div className="min-w-0 flex-1 overflow-hidden">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        Oleh{" "}
                                                        {item.author?.name ||
                                                            "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "category",
                                        label: "Kategori",
                                        className: "w-1/6",
                                        render: (item) =>
                                            item.category?.name || "-",
                                    },
                                    {
                                        key: "deleted_at",
                                        label: "Dihapus Pada",
                                        className: "w-1/6",
                                        render: (item) =>
                                            item.deleted_at
                                                ? new Date(
                                                      item.deleted_at
                                                  ).toLocaleString("id-ID", {
                                                      year: "numeric",
                                                      month: "2-digit",
                                                      day: "2-digit",
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                      second: "2-digit",
                                                  })
                                                : "-",
                                    },
                                ]}
                                data={deletedNews?.data || []}
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
                                        handlePermanentDelete(item);
                                    }
                                }}
                                // WHILE TIDAK ADA DATA TAMPILKAN EMPTY STATE
                                showHeader={true}
                                emptyState={
                                    <EmptyState
                                        icon="fas fa-trash"
                                        title="Tidak ada berita yang dihapus"
                                        description="Semua berita yang dihapus akan muncul di sini."
                                        actionLink={route("admin.news.index")}
                                        actionText="Kembali ke Berita"
                                    />
                                }
                            />
                            {/* Pagination */}
                            <Pagination
                                pagination={deletedNews}
                                showInfo={true}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
