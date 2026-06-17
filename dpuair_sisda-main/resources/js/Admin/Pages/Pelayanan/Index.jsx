import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import SecondaryButton from "@/Components/SecondaryButton";
import DataTable from "@/Admin/Components/DataTable";
import FilterBar from "@/Admin/Components/FilterBar";
import Pagination from "@/Admin/Components/Pagination";
import EmptyState from "@/Admin/Components/EmptyState";

export default function Index({
    auth,
    pelayanans = { data: [] },
    filters = {},
    statusOptions = {},
    jenisLayananOptions = {},
}) {
    const [showFilters, setShowFilters] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPelayanan, setSelectedPelayanan] = useState(null);

    const { data, setData, processing } = useForm({
        search: filters.search || "",
        status: filters.status || "",
        jenis_layanan: filters.jenis_layanan || "",
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

    const handleViewDetail = (item) => {
        setSelectedPelayanan(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPelayanan(null);
    };

    const handleUpdateStatusModal = (newStatus) => {
        const confirmMessages = {
            diproses: `Mulai memproses antrian ${selectedPelayanan.kode_antrian}?`,
            selesai: `Tandai antrian ${selectedPelayanan.kode_antrian} sebagai selesai?`,
            dibatalkan: `Tolak/batalkan antrian ${selectedPelayanan.kode_antrian}? Tindakan ini tidak dapat dibatalkan.`,
        };

        if (confirm(confirmMessages[newStatus])) {
            router.patch(
                route("admin.pelayanan.update-status", selectedPelayanan.id),
                { status: newStatus },
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        handleCloseModal();
                    },
                }
            );
        }
    };

    const handleFilter = () => {
        router.get(
            route("admin.pelayanan.index"),
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
            status: "",
            jenis_layanan: "",
            per_page: 10,
        });
        router.get(
            route("admin.pelayanan.index"),
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Antrian Pelayanan
                    </h2>
                </div>
            }
        >
            <Head title="Antrian Pelayanan" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Manajemen Antrian Pelayanan
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
                                        totalItems={pelayanans.total}
                                        itemLabel="antrian"
                                        searchPlaceholder="Cari kode antrian, nama, atau instansi..."
                                        variant="detailed"
                                        gridCols="md:grid-cols-3"
                                        searchColSpan="md:col-span-1"
                                        showPageSelector={true}
                                        pageSelectorOptions={[10, 25, 50, 100]}
                                    >
                                        {/* Status Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Status
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={(e) => {
                                                    setData(
                                                        "status",
                                                        e.target.value
                                                    );
                                                    handleFilter();
                                                }}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">
                                                    Semua Status
                                                </option>
                                                {Object.entries(
                                                    statusOptions
                                                ).map(([key, value]) => (
                                                    <option
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Jenis Layanan Filter */}
            <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Jenis Layanan
                                            </label>
                                            <select
                                                value={data.jenis_layanan}
                                                onChange={(e) => {
                                                    setData(
                                                        "jenis_layanan",
                                                        e.target.value
                                                    );
                                                    handleFilter();
                                                }}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            >
                                                <option value="">
                                                    Semua Layanan
                                                </option>
                                                {Object.entries(
                                                    jenisLayananOptions
                                                ).map(([key, value]) => (
                                                    <option
                                                        key={key}
                                                        value={key}
                                                    >
                                                        {value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </FilterBar>
                                </div>
                            )}

                            <DataTable
                                columns={[
                                    {
                                        key: "kode_antrian",
                                        label: "Kode Antrian",
                                        className: "w-1/8",
                                        render: (item) => (
                                            <div className="font-mono font-semibold text-blue-600">
                                                {item.kode_antrian}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "nama_lengkap",
                                        label: "Nama Lengkap",
                                        className: "w-1/4",
                                        render: (item) => (
                                            <div className="max-w-full">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {item.nama_lengkap}
                                                </div>
                                                <div
                                                    className="text-xs text-gray-500 truncate"
                                                    title={item.instansi_asal}
                                                >
                                                    {item.instansi_asal}
                                                </div>
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "jenis_layanan",
                                        label: "Jenis Layanan",
                                        className: "w-1/8",
                                        render: (item) => (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {item.jenis_layanan}
                                            </span>
                                        ),
                                    },
                                    {
                                        key: "nomor_whatsapp",
                                        label: "WhatsApp",
                                        className: "w-1/8",
                                        render: (item) => (
                                            <div className="text-sm text-gray-600">
                                                {item.nomor_whatsapp}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "tanggal_kedatangan",
                                        label: "Tgl Kedatangan",
                                        className: "w-1/8",
                                        render: (item) => (
                                            <div className="text-sm text-gray-600">
                                                {new Date(
                                                    item.tanggal_kedatangan
                                                ).toLocaleDateString("id-ID", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "status",
                                        label: "Status",
                                        className: "w-1/8",
                                        render: (item) => {
                                            const statusConfig = {
                                                pending: {
                                                    bg: "bg-amber-100",
                                                    text: "text-amber-800",
                                                    label: "Menunggu",
                                                },
                                                diproses: {
                                                    bg: "bg-sky-100",
                                                    text: "text-sky-800",
                                                    label: "Diproses",
                                                },
                                                selesai: {
                                                    bg: "bg-emerald-100",
                                                    text: "text-emerald-800",
                                                    label: "Selesai",
                                                },
                                                dibatalkan: {
                                                    bg: "bg-rose-100",
                                                    text: "text-rose-800",
                                                    label: "Ditolak",
                                                },
                                            };
                                            const config = statusConfig[
                                                item.status
                                            ] || {
                                                bg: "bg-gray-100",
                                                text: "text-gray-800",
                                                label: item.status,
                                            };
                                            return (
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
                                                >
                                                    {config.label}
                                                </span>
                                            );
                                        },
                                    },
                                ]}
                                data={pelayanans.data}
                                actions={[
                                    {
                                        key: "view",
                                        title: "Lihat Detail",
                                        icon: "fas fa-eye",
                                        variant: "primary",
                                    },
                                ]}
                                onActionClick={(action, item) => {
                                    if (action === "view") {
                                        handleViewDetail(item);
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
                            {pelayanans.data.length > 0 && (
                                <Pagination
                                    pagination={pelayanans}
                                    showInfo={true}
                                    routeName="admin.pelayanan.index"
                                    filters={data}
                                />
                            )}

                            {/* Empty State */}
                            {pelayanans.data.length === 0 && (
                                <>
                                    {filters.search ||
                                    filters.status ||
                                    filters.jenis_layanan ? (
                                        <EmptyState
                                            icon="fas fa-clipboard-list"
                                            title="Tidak ada antrian ditemukan"
                                            description={
                                                filters.search
                                                    ? `Tidak ada antrian dengan pencarian "${filters.search}"`
                                                    : "Coba ubah filter atau hapus beberapa kriteria pencarian"
                                            }
                                            actionButton={
                                                <button
                                                    onClick={handleReset}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Reset Filter
                                                </button>
                                            }
                                            titleSize="text-lg"
                                            descriptionSize="text-base"
                                        />
                                    ) : (
                                        <EmptyState
                                            icon="fas fa-clipboard-list"
                                            title="Belum ada antrian pelayanan"
                                            description="Belum ada antrian pelayanan yang terdaftar di sistem"
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

            {/* Modal Detail Pelayanan */}
            {showModal && selectedPelayanan && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                            onClick={handleCloseModal}
                        ></div>

                        {/* Modal panel */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">
                                        Detail Antrian Pelayanan
                                    </h3>
                                    <button
                                        onClick={handleCloseModal}
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <i className="fas fa-times text-xl"></i>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-4">
                                {/* Kode Antrian */}
                                <div className="mb-6 text-center">
                                    <div className="inline-block bg-blue-50 px-6 py-3 rounded-lg">
                                        <p className="text-sm text-gray-600 mb-1">
                                            Kode Antrian
                                        </p>
                                        <p className="text-3xl font-bold font-mono text-blue-600">
                                            {selectedPelayanan.kode_antrian}
                                        </p>
                                    </div>
                                </div>

                                {/* Data Pengunjung */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nama Lengkap
                                        </label>
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                            {selectedPelayanan.nama_lengkap}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                            {selectedPelayanan.email}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Instansi/Asal
                                        </label>
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                            {selectedPelayanan.instansi_asal}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Jenis Layanan
                                        </label>
                                        <p className="text-gray-900">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                                {
                                                    selectedPelayanan.jenis_layanan
                                                }
                                            </span>
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nomor WhatsApp
                                        </label>
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                            {selectedPelayanan.nomor_whatsapp}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tanggal Kedatangan
                                        </label>
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                            {new Date(
                                                selectedPelayanan.tanggal_kedatangan
                                            ).toLocaleDateString("id-ID", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Status Saat Ini
                                        </label>
                                        <p className="text-gray-900">
                                            {(() => {
                                                const statusConfig = {
                                                    pending: {
                                                        bg: "bg-amber-100",
                                                        text: "text-amber-800",
                                                        label: "Menunggu",
                                                    },
                                                    diproses: {
                                                        bg: "bg-sky-100",
                                                        text: "text-sky-800",
                                                        label: "Diproses",
                                                    },
                                                    selesai: {
                                                        bg: "bg-emerald-100",
                                                        text: "text-emerald-800",
                                                        label: "Selesai",
                                                    },
                                                    dibatalkan: {
                                                        bg: "bg-rose-100",
                                                        text: "text-rose-800",
                                                        label: "Ditolak",
                                                    },
                                                };
                                                const config = statusConfig[
                                                    selectedPelayanan.status
                                                ] || {
                                                    bg: "bg-gray-100",
                                                    text: "text-gray-800",
                                                    label: selectedPelayanan.status,
                                                };
                                                return (
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
                                                    >
                                                        {config.label}
                                                    </span>
                                                );
                                            })()}
                                        </p>
                                    </div>
                                </div>

                                {/* Catatan */}
                                {selectedPelayanan.catatan && (
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Catatan
                                        </label>
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                                            {selectedPelayanan.catatan}
                                        </p>
                                    </div>
                                )}

                                {/* Update Status Actions */}
                                <div className="border-t pt-4">
                                    {selectedPelayanan.status === "pending" && (
                                        <>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                Aksi Selanjutnya
                                            </label>
                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatusModal(
                                                            "diproses"
                                                        )
                                                    }
                                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-sky-300 rounded-lg shadow-sm text-base font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 hover:border-sky-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all"
                                                >
                                                    <i className="fas fa-play-circle mr-2 text-lg"></i>
                                                    Proses Sekarang
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatusModal(
                                                            "dibatalkan"
                                                        )
                                                    }
                                                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-rose-300 rounded-lg shadow-sm text-base font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 hover:border-rose-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-all"
                                                >
                                                    <i className="fas fa-ban mr-2 text-lg"></i>
                                                    Tolak Antrian
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {selectedPelayanan.status ===
                                        "diproses" && (
                                        <>
                                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                                Selesaikan Pelayanan
                                            </label>
                                            <button
                                                onClick={() =>
                                                    handleUpdateStatusModal(
                                                        "selesai"
                                                    )
                                                }
                                                className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-300 rounded-lg shadow-sm text-base font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
                                            >
                                                <i className="fas fa-check-circle mr-2 text-lg"></i>
                                                Tandai Selesai
                                            </button>
                                        </>
                                    )}

                                    {(selectedPelayanan.status === "selesai" ||
                                        selectedPelayanan.status ===
                                            "dibatalkan") && (
                                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                                            <i className="fas fa-info-circle text-gray-400 text-2xl mb-2"></i>
                                            <p className="text-sm text-gray-600">
                                                Status sudah final, tidak dapat
                                                diubah lagi
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 px-6 py-3 flex justify-end">
                                <button
                                    onClick={handleCloseModal}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
