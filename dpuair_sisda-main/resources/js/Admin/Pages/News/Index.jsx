import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DataTable from "@/Admin/Components/DataTable";
import StatusBadge from "@/Admin/Components/StatusBadge";
import FilterBar from "@/Admin/Components/FilterBar";
import PageSelector from "@/Admin/Components/PageSelector";
import Pagination from "@/Admin/Components/Pagination";
import EmptyState from "@/Admin/Components/EmptyState";
import { confirmDelete, showLoading, showSuccess, showError, closeLoading } from "@/Components/SweetAlert";
import { router } from "@inertiajs/react";
import { useEffect, useState, useCallback } from "react";

export default function Index({ auth, news, filters, categories }) {
    const { flash } = usePage().props;
    
    // State untuk filter dropdown
    const [showFilters, setShowFilters] = useState(false);
    
    // Check if required props are available
    if (!auth) console.warn('Auth prop is missing');
    if (!news) console.warn('News prop is missing');
    if (!categories) console.warn('Categories prop is missing');
    
    // Early return jika ada error
    if (!auth) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h1>
                    <p className="text-gray-600">User authentication data is missing</p>
                </div>
            </div>
        );
    }
    
    // Fallback jika data tidak tersedia
    if (!news || !categories) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-blue-500 text-6xl mb-4">⏳</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Loading Data...</h1>
                    <p className="text-gray-600">Please wait while we load the news data</p>
                    <div className="mt-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    const { data, setData, get, reset } = useForm({
        search: filters?.search || "",
        status: filters?.status || "",
        category: filters?.category || "",
        per_page: filters?.per_page || "10",
    });

    // State untuk force refresh
    const [forceRefresh, setForceRefresh] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);



    useEffect(() => {
        // Sync incoming filters on first render
        setData({
            search: filters?.search || "",
            status: filters?.status || "",
            category: filters?.category || "",
            per_page: filters?.per_page || "10",
        });

        // Check flash message untuk refresh dari edit
        if (flash?.success) {
            setForceRefresh(true);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flash]);

    // Effect untuk handle force refresh
    useEffect(() => {
        if (forceRefresh) {
            setForceRefresh(false);
        }
    }, [forceRefresh]);

    const submitFilters = (e) => {
        e.preventDefault();

        router.get(route("admin.news.index"), data, {
            preserveState: false,
            preserveScroll: true,
            replace: false,
            only: ["news", "filters"],
        });
    };

    const resetFilters = () => {
        reset();

        router.get(
            route("admin.news.index"),
            {},
            {
                preserveState: false,
                preserveScroll: false,
                replace: false,
            }
        );
    };

    const handleFilterChange = (field, value) => {
        setData(field, value);
        router.get(
            route("admin.news.index"),
            { ...data, [field]: value },
            { preserveState: true }
        );
    };

    // Debounced search function
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId;
            return (searchTerm) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    if (searchTerm.trim() === '') {
                        router.get(route("admin.news.index"), { ...data, search: '' }, { preserveState: true });
                    } else {
                        router.get(route("admin.news.index"), { ...data, search: searchTerm }, { preserveState: true });
                    }
                }, 500); // 500ms delay
            };
        })(),
        [data]
    );

    function destroy(id, newsItem) {
        confirmDelete(newsItem?.title, 'berita', 20).then((result) => {
            if (result.isConfirmed) {
                showLoading('Menghapus...', 'Mohon tunggu sebentar');

                router.delete(route("admin.news.destroy", id), {
                    preserveState: false,
                    onSuccess: () => {
                        closeLoading();
                        showSuccess(newsItem?.title, 'berhasil dihapus', 'berita', 20);
                    },
                    onError: (errors) => {
                        closeLoading();
                        showError('Gagal menghapus berita');
                    },
                });
            }
        });
    }

    // Helper function untuk mendapatkan image URL yang lebih robust
    const getImageUrl = (item) => {
        if (item.featured_image_path) {
            return "/storage/" + item.featured_image_path;
        }
        if (item.featured_image_url) {
            return item.featured_image_url;
        }
        if (item.image_url) {
            return item.image_url;
        }
        return null;
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Berita
                </h2>
            }
        >
            <Head title="Berita" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Loading State */}
                            {isLoading && (
                                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                        <span className="text-sm text-blue-800">Memuat data...</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Daftar Berita
                                </h2>
                                <div className="flex gap-2">
                                    <SecondaryButton
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center gap-2"
                                    >
                                        <i className={`fas ${showFilters ? "fa-times" : "fa-filter"}`}></i>
                                        {showFilters ? "Sembunyikan Filter" : "Filter"}
                                    </SecondaryButton>
                                    <Link href={route("admin.news.create")}>
                                        <PrimaryButton>
                                            <i className="fas fa-plus mr-2"></i>
                                            Tambah Berita
                                        </PrimaryButton>
                                    </Link>
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
                                            router.get(route("admin.news.index"));
                                        }}
                                        searchPlaceholder="Cari judul, ringkasan, atau konten..."
                                        showSearch={true}
                                        showCategory={true}
                                        showStatus={true}
                                        categories={categories}
                                        statusOptions={[
                                            { value: "draft", label: "Draft" },
                                            { value: "published", label: "Published" },
                                        ]}
                                        totalItems={news.total}
                                        itemLabel="berita"
                                        gridCols="md:grid-cols-3"
                                        searchColSpan="md:col-span-1"
                                        variant="detailed"
                                        showPageSelector={true}
                                        pageSelectorOptions={[5, 10, 25, 50, 100]}
                                    />
                                </div>
                            )}



                            {/* DataTable */}
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
                                                        src={getImageUrl(item)}
                                                        alt=""
                                                        className="w-12 h-12 object-cover rounded-md border flex-shrink-0"
                                                    />
                                                )}
                                                <div className="min-w-0 flex-1 overflow-hidden">
                                                    <div className="text-sm font-medium text-gray-900 truncate">
                                                        {item.title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        Oleh {item.author?.name || "-"}
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "category",
                                        label: "Kategori",
                                        className: "w-1/6",
                                        render: (item) => item.category?.name || "-",
                                    },
                                    {
                                        key: "status",
                                        label: "Status",
                                        className: "w-1/6",
                                        render: (item) => <StatusBadge status={item.status} />,
                                    },
                                    {
                                        key: "published_at",
                                        label: "Tanggal Publikasi",
                                        className: "w-1/6",
                                        render: (item) =>
                                            item.published_at
                                                ? new Date(item.published_at).toLocaleDateString("id-ID")
                                                : "-",
                                    },
                                ]}
                                data={news?.data || []}
                                actions={[
                                    {
                                        key: "view",
                                        title: "Lihat Berita",
                                        icon: "fas fa-external-link-alt",
                                        variant: "info",
                                        show: (item) => item.status === "published",
                                    },
                                    {
                                        key: "edit",
                                        title: "Edit",
                                        icon: "fas fa-edit",
                                        href: (item) => route("admin.news.edit", item.id),
                                        show: (item) => item.status === "draft",
                                    },
                                    {
                                        key: "delete",
                                        title: "Hapus",
                                        icon: "fas fa-trash",
                                        variant: "danger",
                                    },
                                ]}
                                onActionClick={(action, item) => {
                                    if (action === "delete") {
                                        destroy(item.id, item);
                                    } else if (action === "view") {
                                        // Redirect ke halaman publik berita
                                        const publicUrl = `https://dpuair.jatimprov.go.id/berita/details/${item.slug}`;
                                        window.open(publicUrl, '_blank');
                                    }
                                }}
                                showHeader={true}
                                emptyState={
                                    <EmptyState
                                        icon="fas fa-newspaper"
                                        title="Tidak ada berita tersedia"
                                        description="Belum ada berita yang ditambahkan. Mulai dengan menambahkan berita pertama Anda."
                                        actionLink={route("admin.news.create")}
                                        actionText="Tambah Berita Pertama"
                                        actionIcon="fas fa-plus"
                                    />
                                }
                            />
                            
                            {/* Pagination */}
                            <Pagination pagination={news} showInfo={true} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}