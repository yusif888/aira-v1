import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, router, useForm, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DataTable from "@/Admin/Components/DataTable";
import FilterBar from "@/Admin/Components/FilterBar";
import Pagination from "@/Admin/Components/Pagination";
import EmptyState from "@/Admin/Components/EmptyState";
import { confirmDelete, showLoading, showSuccess, closeLoading } from "@/Components/SweetAlert";

export default function Index({
    auth,
    infrastruktur = { data: [] },
    filters = {},
    categories = [],
}) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);

    const { data, setData, processing } = useForm({
        search: filters.search || "",
        category: filters.category || "",
        type: filters.type || "",
        per_page: filters.per_page || 10,
    });

    // Auto reset search if empty
    useEffect(() => {
        if (!data.search || data.search.trim() === "") {
            setData("search", "");
            if (filters.search) {
                handleFilter();
            }
        }
    }, [data.search]);

    // Cleanup search timeout
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    const handleFilter = () => {
        router.get(
            route("admin.infrastruktur-sda.index"),
            {
                ...data,
                page: 1,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                },
            }
        );
    };

    const handleReset = () => {
        setData({
            search: "",
            category: "",
            type: "",
            per_page: 10,
        });
        router.get(
            route("admin.infrastruktur-sda.index"),
            {},
            {
                preserveState: false,
                preserveScroll: false,
            }
        );
    };

    const handleSearch = (value) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        setData("search", value);

        if (!value || value.trim() === "") {
            setData("search", "");
            if (filters.search) {
                handleFilter();
            }
            return;
        }

        const timeoutId = setTimeout(() => {
            handleFilter();
        }, 800);

        setSearchTimeout(timeoutId);
    };

    const handleDelete = (id, item) => {
        confirmDelete(item?.name, "infrastruktur", 20).then((result) => {
            if (result.isConfirmed) {
                showLoading("Menghapus...", "Mohon tunggu sebentar");

                router.delete(route("admin.infrastruktur-sda.destroy", id), {
                    preserveState: false,
                    onSuccess: () => {
                        closeLoading();
                        showSuccess(
                            item?.name,
                            "berhasil dihapus",
                            "infrastruktur",
                            20
                        );
                    },
                    onError: () => {
                        closeLoading();
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Infrastruktur SDA
                    </h2>
                </div>
            }
        >
            <Head title="Infrastruktur SDA" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Manajemen Data Infrastruktur SDA
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
                                    <Link
                                        href={route(
                                            "admin.infrastruktur-sda.create"
                                        )}
                                    >
                                        <PrimaryButton>
                                            <i className="fas fa-plus mr-2"></i>
                                            Tambah Infrastruktur
                                        </PrimaryButton>
                                    </Link>
                                </div>
                            </div>

                            {/* Filters */}
                            {showFilters && (
                                <div className="filter-slide-in">
                                    <FilterBar
                                        filters={data}
                                        onFilterChange={(field, value) => {
                                            setData(field, value);

                                            if (field === "search") {
                                                handleSearch(value);
                                            } else {
                                                handleFilter();
                                            }
                                        }}
                                        onReset={handleReset}
                                        onApply={handleFilter}
                                        processing={processing}
                                        showSearch={true}
                                        totalItems={infrastruktur.total}
                                        itemLabel="infrastruktur"
                                        searchPlaceholder="Cari nama infrastruktur atau deskripsi..."
                                        variant="detailed"
                                        gridCols="md:grid-cols-3"
                                        searchColSpan="md:col-span-1"
                                        showPageSelector={true}
                                        pageSelectorOptions={[10, 25, 50, 100]}
                                    >
                                        {/* Category Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Kategori
                                            </label>
                                            <select
                                                value={data.category}
                                                onChange={(e) => {
                                                    setData('category', e.target.value);
                                                    handleFilter();
                                                }}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">
                                                    Semua Kategori
                                                </option>
                                                {categories.map((category) => (
                                                    <option
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Type Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tipe Geometri
                                            </label>
                                            <select
                                                value={data.type}
                                                onChange={(e) => {
                                                    setData(
                                                        "type",
                                                        e.target.value
                                                    );
                                                    handleFilter();
                                                }}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">
                                                    Semua Tipe
                                                </option>
                                                <option value="marker">
                                                    Marker (Point)
                                                </option>
                                                <option value="line">
                                                    Line
                                                </option>
                                                <option value="polygon">
                                                    Polygon
                                                </option>
                                            </select>
                                        </div>
                                    </FilterBar>
                                </div>
                            )}

                            <DataTable
                                columns={[
                                    {
                                        key: "name",
                                        label: "Nama Infrastruktur",
                                        className: "w-1/4",
                                        render: (item) => (
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {item.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {item.code || "-"}
                                                </div>
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "category",
                                        label: "Kategori",
                                        className: "w-1/8",
                                        render: (item) => (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {item.category?.name || "-"}
                                            </span>
                                        ),
                                    },
                                    {
                                        key: "type",
                                        label: "Tipe",
                                        className: "w-1/8",
                                        render: (item) => {
                                            const typeConfig = {
                                                marker: {
                                                    icon: "fa-map-marker-alt",
                                                    bg: "bg-green-100",
                                                    text: "text-green-800",
                                                    label: "Marker",
                                                },
                                                line: {
                                                    icon: "fa-grip-lines",
                                                    bg: "bg-purple-100",
                                                    text: "text-purple-800",
                                                    label: "Line",
                                                },
                                                polygon: {
                                                    icon: "fa-draw-polygon",
                                                    bg: "bg-orange-100",
                                                    text: "text-orange-800",
                                                    label: "Polygon",
                                                },
                                            };
                                            const config =
                                                typeConfig[item.type] || typeConfig.marker;
                                            return (
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
                                                >
                                                    <i
                                                        className={`fas ${config.icon} mr-1`}
                                                    ></i>
                                                    {config.label}
                                                </span>
                                            );
                                        },
                                    },
                                    {
                                        key: "coordinates",
                                        label: "Lokasi",
                                        className: "w-1/4",
                                        render: (item) => {
                                            if (
                                                item.latitude &&
                                                item.longitude
                                            ) {
                                                return (
                                                    <div className="text-xs text-gray-600 font-mono">
                                                        {parseFloat(
                                                            item.latitude
                                                        ).toFixed(5)}
                                                        ,{" "}
                                                        {parseFloat(
                                                            item.longitude
                                                        ).toFixed(5)}
                                                    </div>
                                                );
                                            } else if (item.geojson) {
                                                return (
                                                    <div className="text-xs text-gray-600">
                                                        <i className="fas fa-map mr-1"></i>
                                                        GeoJSON Data
                                                    </div>
                                                );
                                            }
                                            return (
                                                <span className="text-xs text-gray-400">
                                                    -
                                                </span>
                                            );
                                        },
                                    },
                                    {
                                        key: "description",
                                        label: "Deskripsi",
                                        className: "w-1/4",
                                        render: (item) => (
                                            <div className="text-sm text-gray-600 truncate max-w-xs">
                                                {item.description || "-"}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "status",
                                        label: "Status",
                                        className: "w-1/8",
                                        render: (item) => (
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    item.is_active
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {item.is_active
                                                    ? "Aktif"
                                                    : "Nonaktif"}
                                            </span>
                                        ),
                                    },
                                ]}
                                data={infrastruktur.data}
                                actions={[
                                    {
                                        key: "edit",
                                        title: "Edit",
                                        icon: "fas fa-edit",
                                        variant: "primary",
                                        href: (item) =>
                                            route(
                                                "admin.infrastruktur-sda.edit",
                                                item.id
                                            ),
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
                                        handleDelete(item.id, item);
                                    }
                                }}
                            />

                            {/* Search Status */}
                            {processing && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                                        <span className="text-sm text-yellow-800">
                                            Sedang mencari data...
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Pagination */}
                            {infrastruktur.data.length > 0 && (
                                <Pagination
                                    pagination={infrastruktur}
                                    showInfo={true}
                                    routeName="admin.infrastruktur-sda.index"
                                    filters={data}
                                />
                            )}

                            {/* Empty State */}
                            {infrastruktur.data.length === 0 && (
                                <>
                                    {filters.search ||
                                    filters.category ||
                                    filters.type ? (
                                        <EmptyState
                                            icon="fas fa-map-marked-alt"
                                            title="Tidak ada infrastruktur ditemukan"
                                            description={
                                                filters.search
                                                    ? `Tidak ada infrastruktur dengan pencarian "${filters.search}"`
                                                    : "Coba ubah filter atau hapus beberapa kriteria pencarian"
                                            }
                                            actionButton={
                                                <PrimaryButton onClick={handleReset} type="button">
                                                    Reset Filter
                                                </PrimaryButton>
                                            }
                                            titleSize="text-lg"
                                            descriptionSize="text-base"
                                        />
                                    ) : (
                                        <EmptyState
                                            icon="fas fa-map-marked-alt"
                                            title="Belum ada data infrastruktur"
                                            description="Belum ada data infrastruktur yang terdaftar di sistem"
                                            actionLink={route(
                                                "admin.infrastruktur-sda.create"
                                            )}
                                            actionText="Tambah Infrastruktur Pertama"
                                            actionIcon="fas fa-plus"
                                            titleSize="text-lg"
                                            descriptionSize="text-base"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
