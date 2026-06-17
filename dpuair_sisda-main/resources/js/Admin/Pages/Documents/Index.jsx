import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DataTable from "@/Admin/Components/DataTable";
import FilterBar from "@/Admin/Components/FilterBar";
import EmptyState from "@/Admin/Components/EmptyState";
import Pagination from "@/Admin/Components/Pagination";

export default function DocumentsIndex({
    auth,
    documents = { data: [] },
    categories = [],
    types = [],
    tags = [],
    years = [],
    filters = {},
}) {
    const [showFilters, setShowFilters] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(
        filters.category || "",
    );
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [dateRange, setDateRange] = useState([
        filters.date_from ? new Date(filters.date_from) : null,
        filters.date_to ? new Date(filters.date_to) : null,
    ]);

    const { data, setData, processing } = useForm({
        search: filters.search || "",
        category: filters.category || "",
        type: filters.type || "",
        year: filters.year || "",
        tags: filters.tags || [],
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
        per_page: filters.per_page || 10,
    });

    // Auto reset search if empty
    useEffect(() => {
        if (!data.search || data.search.trim() === "") {
            // Reset search field but keep other filters
            setData("search", "");
            // Only trigger search reset if we're not in initial load
            if (filters.search) {
                handleFilter();
            }
        }
    }, [data.search]);

    // Sync dateRange with form data
    useEffect(() => {
        // Check if dateRange is valid array and has both dates
        if (
            Array.isArray(dateRange) &&
            dateRange.length === 2 &&
            dateRange[0] &&
            dateRange[1]
        ) {
            setData("date_from", dateRange[0].toISOString().split("T")[0]);
            setData("date_to", dateRange[1].toISOString().split("T")[0]);
        } else {
            // Reset date fields if dateRange is invalid or empty
            setData("date_from", "");
            setData("date_to", "");
        }
    }, [dateRange]);

    // Filter types based on selected category
    useEffect(() => {
        if (selectedCategory) {
            const filtered = types.filter(
                (type) => type.category_id == selectedCategory,
            );
            setFilteredTypes(filtered);
        } else {
            setFilteredTypes([]);
        }
    }, [selectedCategory, types]);

    // Cleanup search timeout
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
            router.delete(route("admin.documents.destroy", id));
        }
    };

    const handleFilter = () => {
        router.get(
            route("admin.documents.index"),
            {
                ...data,
                page: 1, // Reset to first page when filtering
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    // Scroll ke atas setelah berhasil pindah halaman
                    window.scrollTo({ top: 0, behavior: "smooth" });
                },
            },
        );
    };

    const handleReset = () => {
        setData({
            search: "",
            category: "",
            type: "",
            year: "",
            tags: [],
            date_from: "",
            date_to: "",
            per_page: 10,
        });
        setSelectedCategory("");
        setDateRange([null, null]); // Always ensure it's a valid array
        router.get(
            route("admin.documents.index"),
            {},
            {
                preserveState: false,
                preserveScroll: false,
            },
        );
    };

    const handleSearch = (value) => {
        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Update search value
        setData("search", value);

        // If search is empty, reset immediately
        if (!value || value.trim() === "") {
            setData("search", "");
            // Only trigger filter if we had a previous search
            if (filters.search) {
                handleFilter();
            }
            return;
        }

        // Debounce search for non-empty values
        const timeoutId = setTimeout(() => {
            handleFilter();
        }, 800);

        setSearchTimeout(timeoutId);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Dokumen & Regulasi
                    </h2>
                </div>
            }
        >
            <Head title="Dokumen" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Manajemen Dokumen & Regulasi
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
                                        href={route("admin.documents.create")}
                                    >
                                        <PrimaryButton>
                                            <i className="fas fa-plus mr-2"></i>
                                            Tambah Dokumen
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
                                            if (field === "category") {
                                                setSelectedCategory(value);
                                                setData("category", value);
                                                setData("type", "");
                                            } else {
                                                setData(field, value);
                                            }

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
                                        showCategory={true}
                                        showType={true}
                                        showYear={true}
                                        showDateRange={true}
                                        showTags={true}
                                        categories={categories}
                                        types={types}
                                        years={years}
                                        tags={tags}
                                        selectedTags={data.tags}
                                        onTagsChange={(tags) =>
                                            setData("tags", tags)
                                        }
                                        dateRange={dateRange}
                                        onDateRangeChange={setDateRange}
                                        totalItems={documents.total}
                                        itemLabel="dokumen"
                                        searchPlaceholder="Cari judul dokumen..."
                                        dateRangeLabel="Rentang Tanggal Upload"
                                        tagsLabel="Tags"
                                        yearLabel="Tahun Dokumen"
                                        variant="detailed"
                                        gridCols="md:grid-cols-4"
                                        searchColSpan="md:col-span-2"
                                        typeDependsOnCategory={true}
                                        showPageSelector={true}
                                        pageSelectorOptions={[10, 25, 50, 100]}
                                    />
                                </div>
                            )}

                            <DataTable
                                columns={[
                                    {
                                        key: "title",
                                        label: "Judul Dokumen",
                                        className: "w-1/5",
                                        render: (item) => (
                                            <div className="max-w-full">
                                                <div
                                                    className="text-sm font-medium text-gray-900 truncate"
                                                    title={item.title}
                                                >
                                                    {item.title}
                                                </div>
                                                <div
                                                    className="text-xs text-gray-500 truncate"
                                                    title={item.description}
                                                >
                                                    {item.description}
                                                </div>
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "category",
                                        label: "Kategori",
                                        className: "w-1/8",
                                        render: (item) => (
                                            <div
                                                className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                                                title={
                                                    item.type?.category?.name ||
                                                    "-"
                                                }
                                            >
                                                {item.type?.category?.name ||
                                                    "-"}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "type",
                                        label: "Tipe Dokumen",
                                        className: "w-1/8",
                                        render: (item) => (
                                            <div
                                                className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
                                                title={item.type?.name || "-"}
                                            >
                                                {item.type?.name || "-"}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "tags",
                                        label: "Tags",
                                        className: "w-1/6",
                                        render: (item) => (
                                            <div className="flex flex-wrap gap-1">
                                                {item.tags &&
                                                item.tags.length > 0 ? (
                                                    item.tags
                                                        .slice(0, 2)
                                                        .map((tag) => (
                                                            <span
                                                                key={tag.id}
                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 max-w-[80px] overflow-hidden text-ellipsis whitespace-nowrap"
                                                                title={tag.name}
                                                            >
                                                                {tag.name}
                                                            </span>
                                                        ))
                                                ) : (
                                                    <span className="text-gray-400 text-xs">
                                                        -
                                                    </span>
                                                )}
                                                {item.tags &&
                                                    item.tags.length > 2 && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                            +
                                                            {item.tags.length -
                                                                2}
                                                        </span>
                                                    )}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "year",
                                        label: "Tahun Dokumen",
                                        className: "w-1/8",
                                        render: (item) => (
                                            <div
                                                className="text-center"
                                                title={item.year || "-"}
                                            >
                                                {item.year || "-"}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "created_at",
                                        label: "Tanggal Upload",
                                        render: (item) =>
                                            item.created_at
                                                ? new Date(
                                                      item.created_at,
                                                  ).toLocaleDateString("id-ID")
                                                : "-",
                                    },
                                ]}
                                data={documents.data}
                                actions={[
                                    {
                                        key: "view",
                                        title: "Lihat",
                                        icon: "fas fa-eye",
                                        href: (item) =>
                                            route(
                                                "admin.documents.show",
                                                item.id,
                                            ),
                                    },
                                    {
                                        key: "edit",
                                        title: "Edit",
                                        icon: "fas fa-edit",
                                        href: (item) =>
                                            route(
                                                "admin.documents.edit",
                                                item.id,
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
                                        handleDelete(item.id);
                                    }
                                }}
                            />

                            {/* Search Status */}
                            {processing && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                                        <span className="text-sm text-yellow-800">
                                            Sedang mencari dokumen...
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Pagination */}
                            {documents.data.length > 0 && (
                                <Pagination
                                    pagination={documents}
                                    showInfo={true}
                                    routeName="admin.documents.index"
                                    filters={data}
                                />
                            )}

                            {/* Empty State */}
                            {documents.data.length === 0 && (
                                <>
                                    {filters.search ||
                                    filters.category ||
                                    filters.type ||
                                    filters.year ||
                                    filters.tags ||
                                    filters.date_from ||
                                    filters.date_to ? (
                                        <EmptyState
                                            icon="fas fa-file-alt"
                                            title="Tidak ada dokumen ditemukan"
                                            description={
                                                filters.search
                                                    ? `Tidak ada dokumen dengan judul yang mengandung "${filters.search}"`
                                                    : "Coba ubah filter atau hapus beberapa kriteria pencarian"
                                            }
                                            actionButton={
                                                <PrimaryButton
                                                    onClick={handleReset}
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium"
                                                >
                                                    Reset Filter
                                                </PrimaryButton>
                                            }
                                            titleSize="text-lg"
                                            descriptionSize="text-base"
                                        />
                                    ) : (
                                        <EmptyState
                                            icon="fas fa-file-alt"
                                            title="Belum ada dokumen"
                                            description="Mulai dengan menambahkan dokumen pertama Anda"
                                            actionLink={route(
                                                "admin.documents.create",
                                            )}
                                            actionText="Tambah Dokumen"
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
