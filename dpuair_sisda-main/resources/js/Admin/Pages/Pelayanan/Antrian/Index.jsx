import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import SecondaryButton from "@/Components/SecondaryButton";
import DataTable from "@/Admin/Components/DataTable";
import FilterBar from "@/Admin/Components/FilterBar";
import Pagination from "@/Admin/Components/Pagination";
import EmptyState from "@/Admin/Components/EmptyState";

// ─── Modal: Export PDF ────────────────────────────────────────────────────────
function ExportModal({ jenisKunjungan, statusOptions, onClose }) {
    const today = new Date().toISOString().split("T")[0];
    const [form, setForm] = useState({
        date_from:          today,
        date_to:            today,
        status:             "",
        jenis_kunjungan_id: "",
    });

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const handleExport = () => {
        const params = new URLSearchParams();
        Object.entries(form).forEach(([k, v]) => { if (v) params.append(k, v); });
        window.open(route("admin.pelayanan.antrian.export") + "?" + params.toString(), "_blank");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
                    <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white">
                            <i className="fas fa-file-pdf text-lg" />
                            <h3 className="text-base font-semibold">Export PDF Antrian</h3>
                        </div>
                        <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                            <i className="fas fa-times text-lg" />
                        </button>
                    </div>

                    <div className="px-6 py-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Dari Tanggal <span className="text-red-500">*</span>
                                </label>
                                <input type="date" value={form.date_from}
                                    onChange={e => set("date_from", e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-rose-500 focus:ring-rose-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sampai Tanggal <span className="text-red-500">*</span>
                                </label>
                                <input type="date" value={form.date_to}
                                    min={form.date_from}
                                    onChange={e => set("date_to", e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-rose-500 focus:ring-rose-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kunjungan</label>
                            <select value={form.jenis_kunjungan_id} onChange={e => set("jenis_kunjungan_id", e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-rose-500 focus:ring-rose-500">
                                <option value="">Semua Jenis</option>
                                {jenisKunjungan.map(j => (
                                    <option key={j.id} value={j.id}>{j.kode} — {j.nama}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select value={form.status} onChange={e => set("status", e.target.value)}
                                className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-rose-500 focus:ring-rose-500">
                                <option value="">Semua Status</option>
                                {Object.entries(statusOptions).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </select>
                        </div>

                        <p className="text-xs text-gray-400">
                            Filter berdasarkan <strong>tanggal kedatangan</strong>. PDF akan terbuka di tab baru.
                        </p>
                    </div>

                    <div className="bg-gray-50 px-6 py-3 flex justify-end gap-2">
                        <button onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            Batal
                        </button>
                        <button onClick={handleExport}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white text-sm font-medium rounded-md hover:bg-rose-700 transition-colors">
                            <i className="fas fa-download" /> Download PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const STATUS_CONFIG = {
    pending:    { bg: "bg-amber-100",   text: "text-amber-800",   label: "Menunggu" },
    diproses:   { bg: "bg-sky-100",     text: "text-sky-800",     label: "Diproses" },
    selesai:    { bg: "bg-emerald-100", text: "text-emerald-800", label: "Selesai"  },
    dibatalkan: { bg: "bg-rose-100",    text: "text-rose-800",    label: "Ditolak"  },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] ?? { bg: "bg-gray-100", text: "text-gray-800", label: status };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
        </span>
    );
}

// ─── Modal: Detail Antrian ────────────────────────────────────────────────────
function DetailModal({ pelayanan, onClose }) {
    const handleUpdateStatus = (newStatus) => {
        const confirmMessages = {
            diproses:   `Mulai memproses antrian ${pelayanan.kode_antrian}?`,
            selesai:    `Tandai antrian ${pelayanan.kode_antrian} sebagai selesai?`,
            dibatalkan: `Tolak/batalkan antrian ${pelayanan.kode_antrian}? Tindakan ini tidak dapat dibatalkan.`,
        };

        if (confirm(confirmMessages[newStatus])) {
            router.patch(
                route("admin.pelayanan.antrian.update-status", pelayanan.id),
                { status: newStatus },
                { preserveState: true, preserveScroll: true, onSuccess: onClose }
            );
        }
    };

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("id-ID", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
        });

    const isFinal = pelayanan.status === "selesai" || pelayanan.status === "dibatalkan";

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Detail Antrian Pelayanan</h3>
                        <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                            <i className="fas fa-times text-xl" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4">
                        {/* Kode */}
                        <div className="mb-6 text-center">
                            <div className="inline-block bg-blue-50 px-6 py-3 rounded-lg">
                                <p className="text-sm text-gray-600 mb-1">Kode Antrian</p>
                                <p className="text-3xl font-bold font-mono text-blue-600">{pelayanan.kode_antrian}</p>
                            </div>
                        </div>

                        {/* Data */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {[
                                { label: "Nama Lengkap",    value: pelayanan.nama_lengkap },
                                { label: "Email",           value: pelayanan.email },
                                { label: "Instansi/Asal",   value: pelayanan.instansi_asal },
                                { label: "Nomor WhatsApp",  value: pelayanan.nomor_whatsapp },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{value}</p>
                                </div>
                            ))}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kunjungan</label>
                                <p className="text-gray-900">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                        {pelayanan.jenis_kunjungan?.kode ?? "-"}
                                    </span>
                                    <span className="ml-2 text-sm text-gray-600">{pelayanan.jenis_kunjungan?.nama}</span>
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kedatangan</label>
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{formatDate(pelayanan.tanggal_kedatangan)}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <p><StatusBadge status={pelayanan.status} /></p>
                            </div>
                        </div>

                        {pelayanan.catatan && (
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
                                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">{pelayanan.catatan}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="border-t pt-4">
                            {pelayanan.status === "pending" && (
                                <>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Aksi Selanjutnya</label>
                                    <div className="flex flex-wrap gap-3">
                                        <button onClick={() => handleUpdateStatus("diproses")}
                                            className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-sky-300 rounded-lg text-base font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 transition-all">
                                            <i className="fas fa-play-circle mr-2 text-lg" /> Proses Sekarang
                                        </button>
                                        <button onClick={() => handleUpdateStatus("dibatalkan")}
                                            className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-rose-300 rounded-lg text-base font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition-all">
                                            <i className="fas fa-ban mr-2 text-lg" /> Tolak Antrian
                                        </button>
                                    </div>
                                </>
                            )}

                            {pelayanan.status === "diproses" && (
                                <>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Selesaikan Pelayanan</label>
                                    <button onClick={() => handleUpdateStatus("selesai")}
                                        className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-300 rounded-lg text-base font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all">
                                        <i className="fas fa-check-circle mr-2 text-lg" /> Tandai Selesai
                                    </button>
                                </>
                            )}

                            {isFinal && (
                                <div className="bg-gray-50 rounded-lg p-4 text-center">
                                    <i className="fas fa-info-circle text-gray-400 text-2xl mb-2" />
                                    <p className="text-sm text-gray-600">Status sudah final, tidak dapat diubah lagi.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-3 flex justify-end">
                        <button onClick={onClose}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Modal: Kelola Jenis Kunjungan ────────────────────────────────────────────
function JenisKunjunganModal({ jenisKunjungan, onClose }) {
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const emptyForm = { kode: "", nama: "", deskripsi: "", urutan: "", aktif: true };

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm(emptyForm);

    const startEdit = (item) => {
        setEditingId(item.id);
        setShowForm(false);
        setData({ kode: item.kode, nama: item.nama, deskripsi: item.deskripsi ?? "", urutan: item.urutan, aktif: item.aktif });
        clearErrors();
    };

    const startCreate = () => {
        setEditingId(null);
        setShowForm(true);
        reset();
        clearErrors();
    };

    const cancelForm = () => {
        setEditingId(null);
        setShowForm(false);
        reset();
        clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingId) {
            put(route("admin.pelayanan.jenis-kunjungan.update", editingId), {
                preserveScroll: true,
                onSuccess: cancelForm,
            });
        } else {
            post(route("admin.pelayanan.jenis-kunjungan.store"), {
                preserveScroll: true,
                onSuccess: cancelForm,
            });
        }
    };

    const handleDelete = (item) => {
        if (confirm(`Hapus jenis kunjungan "${item.nama}"? Antrian yang terkait tidak akan ikut terhapus.`)) {
            destroy(route("admin.pelayanan.jenis-kunjungan.destroy", item.id), { preserveScroll: true });
        }
    };

    const FormPanel = () => (
        <form onSubmit={handleSubmit} className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 space-y-3">
            <h4 className="text-sm font-semibold text-blue-800 mb-3">
                {editingId ? "Edit Jenis Kunjungan" : "Tambah Jenis Kunjungan Baru"}
            </h4>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Kode <span className="text-red-500">*</span></label>
                    <input type="text" value={data.kode} onChange={e => setData("kode", e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="TOUR" maxLength={20} />
                    {errors.kode && <p className="mt-1 text-xs text-red-600">{errors.kode}</p>}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Urutan</label>
                    <input type="number" value={data.urutan} onChange={e => setData("urutan", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0" min={0} />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nama <span className="text-red-500">*</span></label>
                <input type="text" value={data.nama} onChange={e => setData("nama", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nama jenis kunjungan" />
                {errors.nama && <p className="mt-1 text-xs text-red-600">{errors.nama}</p>}
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea value={data.deskripsi} onChange={e => setData("deskripsi", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Deskripsi singkat (opsional)" />
            </div>

            <div className="flex items-center gap-2">
                <input type="checkbox" id="aktif-check" checked={data.aktif} onChange={e => setData("aktif", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600" />
                <label htmlFor="aktif-check" className="text-sm text-gray-700">Aktif</label>
            </div>

            <div className="flex gap-2 pt-1">
                <button type="submit" disabled={processing}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
                    {processing ? "Menyimpan..." : "Simpan"}
                </button>
                <button type="button" onClick={cancelForm}
                    className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
                    Batal
                </button>
            </div>
        </form>
    );

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Kelola Jenis Kunjungan</h3>
                        <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
                            <i className="fas fa-times text-xl" />
                        </button>
                    </div>

                    <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                        {(showForm || editingId) && <FormPanel />}

                        {!showForm && !editingId && (
                            <button onClick={startCreate}
                                className="mb-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 transition-colors">
                                <i className="fas fa-plus" /> Tambah Jenis Kunjungan
                            </button>
                        )}

                        <div className="space-y-2">
                            {jenisKunjungan.map((item) => (
                                <div key={item.id}
                                    className={`flex items-start gap-3 p-3 rounded-lg border ${item.aktif ? "border-gray-200 bg-white" : "border-gray-100 bg-gray-50"}`}>
                                    <div className="flex-shrink-0 w-16 text-center">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono bg-purple-100 text-purple-800">
                                            {item.kode}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-900">{item.nama}</span>
                                            {!item.aktif && (
                                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Nonaktif</span>
                                            )}
                                        </div>
                                        {item.deskripsi && (
                                            <p className="text-xs text-gray-500 mt-0.5 truncate">{item.deskripsi}</p>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0 flex gap-1">
                                        <button onClick={() => startEdit(item)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                                            <i className="fas fa-pencil-alt text-xs" />
                                        </button>
                                        <button onClick={() => handleDelete(item)}
                                            className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors" title="Hapus">
                                            <i className="fas fa-trash text-xs" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {jenisKunjungan.length === 0 && (
                                <p className="text-center text-gray-500 text-sm py-8">Belum ada jenis kunjungan.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 px-6 py-3 flex justify-end">
                        <button onClick={onClose}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Index({
    auth,
    pelayanans = { data: [] },
    jenisKunjungan = [],
    filters = {},
    statusOptions = {},
}) {
    const [showFilters, setShowFilters]             = useState(false);
    const [showDetailModal, setShowDetailModal]     = useState(false);
    const [showJenisModal, setShowJenisModal]       = useState(false);
    const [showExportModal, setShowExportModal]     = useState(false);
    const [selectedPelayanan, setSelectedPelayanan] = useState(null);
    const [searchTimeout, setSearchTimeout]         = useState(null);

    const { data, setData, processing } = useForm({
        search:            filters.search || "",
        status:            filters.status || "",
        jenis_kunjungan_id: filters.jenis_kunjungan_id || "",
        per_page:          filters.per_page || 10,
    });

    useEffect(() => () => { if (searchTimeout) clearTimeout(searchTimeout); }, [searchTimeout]);

    const handleFilter = () => {
        router.get(route("admin.pelayanan.antrian.index"), { ...data, page: 1 }, {
            preserveState: true, preserveScroll: true,
        });
    };

    const handleSearch = (value) => {
        if (searchTimeout) clearTimeout(searchTimeout);
        setData("search", value);
        if (!value?.trim()) { if (filters.search) handleFilter(); return; }
        setSearchTimeout(setTimeout(handleFilter, 800));
    };

    const handleReset = () => {
        setData({ search: "", status: "", jenis_kunjungan_id: "", per_page: 10 });
        router.get(route("admin.pelayanan.antrian.index"), {}, { preserveState: false });
    };

    const openDetail = (item) => { setSelectedPelayanan(item); setShowDetailModal(true); };
    const closeDetail = () => { setShowDetailModal(false); setSelectedPelayanan(null); };

    const jenisKunjunganOptions = jenisKunjungan.reduce((acc, j) => ({ ...acc, [j.id]: j.kode + " — " + j.nama }), {});

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Antrian Pelayanan</h2>
                </div>
            }
        >
            <Head title="Antrian Pelayanan" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-gray-900">Manajemen Antrian Pelayanan</h2>
                                <div className="flex gap-2">
                                    <button onClick={() => setShowExportModal(true)}
                                        className="inline-flex items-center gap-2 px-3 py-2 border border-rose-300 rounded-md text-sm font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors">
                                        <i className="fas fa-file-pdf" /> Export PDF
                                    </button>
                                    <button onClick={() => setShowJenisModal(true)}
                                        className="inline-flex items-center gap-2 px-3 py-2 border border-purple-300 rounded-md text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors">
                                        <i className="fas fa-tags" /> Kelola Jenis Kunjungan
                                    </button>
                                    <SecondaryButton onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
                                        <i className={`fas ${showFilters ? "fa-times" : "fa-filter"}`} />
                                        {showFilters ? "Sembunyikan Filter" : "Filter"}
                                    </SecondaryButton>
                                </div>
                            </div>

                            {showFilters && (
                                <div className="filter-slide-in">
                                    <FilterBar
                                        filters={data}
                                        onFilterChange={(field, value) => {
                                            setData(field, value);
                                            if (field === "search") handleSearch(value);
                                            else handleFilter();
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
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <select value={data.status}
                                                onChange={(e) => { setData("status", e.target.value); handleFilter(); }}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                                <option value="">Semua Status</option>
                                                {Object.entries(statusOptions).map(([k, v]) => (
                                                    <option key={k} value={k}>{v}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kunjungan</label>
                                            <select value={data.jenis_kunjungan_id}
                                                onChange={(e) => { setData("jenis_kunjungan_id", e.target.value); handleFilter(); }}
                                                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                                <option value="">Semua Jenis</option>
                                                {Object.entries(jenisKunjunganOptions).map(([k, v]) => (
                                                    <option key={k} value={k}>{v}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </FilterBar>
                                </div>
                            )}

                            <DataTable
                                columns={[
                                    {
                                        key: "kode_antrian", label: "Kode Antrian", className: "w-1/8",
                                        render: (item) => (
                                            <div className="font-mono font-semibold text-blue-600">{item.kode_antrian}</div>
                                        ),
                                    },
                                    {
                                        key: "nama_lengkap", label: "Nama Lengkap", className: "w-1/4",
                                        render: (item) => (
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 truncate">{item.nama_lengkap}</div>
                                                <div className="text-xs text-gray-500 truncate" title={item.instansi_asal}>{item.instansi_asal}</div>
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "jenis_kunjungan", label: "Jenis Kunjungan", className: "w-1/6",
                                        render: (item) => (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {item.jenis_kunjungan?.kode ?? "-"}
                                            </span>
                                        ),
                                    },
                                    {
                                        key: "nomor_whatsapp", label: "WhatsApp", className: "w-1/8",
                                        render: (item) => <div className="text-sm text-gray-600">{item.nomor_whatsapp}</div>,
                                    },
                                    {
                                        key: "tanggal_kedatangan", label: "Tgl Kedatangan", className: "w-1/8",
                                        render: (item) => (
                                            <div className="text-sm text-gray-600">
                                                {new Date(item.tanggal_kedatangan).toLocaleDateString("id-ID", {
                                                    day: "numeric", month: "short", year: "numeric",
                                                })}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "status", label: "Status", className: "w-1/8",
                                        render: (item) => <StatusBadge status={item.status} />,
                                    },
                                ]}
                                data={pelayanans.data}
                                actions={[{ key: "view", title: "Lihat Detail", icon: "fas fa-eye", variant: "primary" }]}
                                onActionClick={(action, item) => { if (action === "view") openDetail(item); }}
                            />

                            {processing && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600" />
                                    <span className="text-sm text-yellow-800">Sedang mencari data...</span>
                                </div>
                            )}

                            {pelayanans.data.length > 0 && (
                                <Pagination pagination={pelayanans} showInfo={true}
                                    routeName="admin.pelayanan.antrian.index" filters={data} />
                            )}

                            {pelayanans.data.length === 0 && (
                                <>
                                    {filters.search || filters.status || filters.jenis_kunjungan_id ? (
                                        <EmptyState icon="fas fa-clipboard-list" title="Tidak ada antrian ditemukan"
                                            description={filters.search ? `Tidak ada antrian dengan pencarian "${filters.search}"` : "Coba ubah filter atau hapus beberapa kriteria pencarian"}
                                            actionButton={
                                                <button onClick={handleReset}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                                                    Reset Filter
                                                </button>
                                            }
                                            titleSize="text-lg" descriptionSize="text-base" />
                                    ) : (
                                        <EmptyState icon="fas fa-clipboard-list"
                                            title="Belum ada antrian pelayanan"
                                            description="Belum ada antrian pelayanan yang terdaftar di sistem"
                                            titleSize="text-lg" descriptionSize="text-base" />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showDetailModal && selectedPelayanan && (
                <DetailModal pelayanan={selectedPelayanan} onClose={closeDetail} />
            )}

            {showJenisModal && (
                <JenisKunjunganModal jenisKunjungan={jenisKunjungan} onClose={() => setShowJenisModal(false)} />
            )}

            {showExportModal && (
                <ExportModal
                    jenisKunjungan={jenisKunjungan}
                    statusOptions={statusOptions}
                    onClose={() => setShowExportModal(false)}
                />
            )}
        </AuthenticatedLayout>
    );
}
