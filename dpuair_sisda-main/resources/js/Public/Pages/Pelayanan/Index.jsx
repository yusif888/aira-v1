import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useState } from "react";

const PelayananIndex = ({ jenisKunjungan = [] }) => {
    const [activeTab, setActiveTab] = useState("daftar");

    const { data, setData, post, processing, errors, reset } = useForm({
        nama_lengkap:        "",
        email:               "",
        instansi_asal:       "",
        jenis_kunjungan_id:  "",
        nomor_whatsapp:      "",
        catatan:             "",
        tanggal_kedatangan:  "",
    });

    const {
        data: checkData, setData: setCheckData,
        post: postCheck, processing: checkProcessing, errors: checkErrors,
    } = useForm({ kode_antrian: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("pelayanan.store"), { onSuccess: () => reset() });
    };

    const handleCheckSubmit = (e) => {
        e.preventDefault();
        postCheck(route("pelayanan.check"));
    };

    const selectedJenis = jenisKunjungan.find(j => j.id == data.jenis_kunjungan_id);

    return (
        <GuestLayout>
            <Head>
                <title>Antrian Pelayanan</title>
                <meta name="description" content="Daftar antrian pelayanan online Dinas PU SDA Jawa Timur" />
            </Head>

            {/* Hero */}
            <section className="relative bg-[#173c94] py-24 lg:py-32 overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 opacity-5">
                    <img src="/assets/images/PUSDAJATIM_WHITE_LOGO.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
                            Antrian Pelayanan
                        </h1>
                        <div className="w-16 h-px bg-white mb-8" />
                        <p className="text-xl text-white/80 leading-relaxed">
                            Sistem pendaftaran antrian online Dinas PU SDA Jawa Timur. Dapatkan kode antrian langsung di email Anda.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tab Navigation */}
            <section className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex gap-8">
                        {[{ key: "daftar", label: "Daftar Antrian" }, { key: "cek", label: "Cek Status" }].map(tab => (
                            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                                className={`py-4 px-2 font-medium transition-all ${
                                    activeTab === tab.key
                                        ? "text-[#173c94] border-b-2 border-[#173c94]"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 bg-white">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="max-w-4xl mx-auto space-y-16">

                        {activeTab === "daftar" ? (
                            <>
                                {/* Form */}
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Formulir Pendaftaran</h2>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 space-y-6">

                                            {/* Nama */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                                    Nama Lengkap <span className="text-red-600">*</span>
                                                </label>
                                                <input type="text" value={data.nama_lengkap}
                                                    onChange={e => setData("nama_lengkap", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173c94] focus:border-transparent bg-white"
                                                    placeholder="Contoh: Budi Santoso" required />
                                                {errors.nama_lengkap && <p className="mt-2 text-sm text-red-600">{errors.nama_lengkap}</p>}
                                            </div>

                                            {/* Email */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                                    Email <span className="text-red-600">*</span>
                                                </label>
                                                <input type="email" value={data.email}
                                                    onChange={e => setData("email", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173c94] focus:border-transparent bg-white"
                                                    placeholder="nama@email.com" required />
                                                <p className="mt-2 text-sm text-gray-600">Kode antrian akan dikirim ke email ini</p>
                                                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                                            </div>

                                            {/* Instansi */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                                    Instansi/Asal <span className="text-red-600">*</span>
                                                </label>
                                                <input type="text" value={data.instansi_asal}
                                                    onChange={e => setData("instansi_asal", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173c94] focus:border-transparent bg-white"
                                                    placeholder="Contoh: Dinas Pertanian Kab. Malang" required />
                                                {errors.instansi_asal && <p className="mt-2 text-sm text-red-600">{errors.instansi_asal}</p>}
                                            </div>

                                            {/* Jenis Kunjungan */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                                    Jenis Kunjungan <span className="text-red-600">*</span>
                                                </label>
                                                <select value={data.jenis_kunjungan_id}
                                                    onChange={e => setData("jenis_kunjungan_id", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173c94] focus:border-transparent bg-white"
                                                    required>
                                                    <option value="">Pilih jenis kunjungan</option>
                                                    {jenisKunjungan.map(j => (
                                                        <option key={j.id} value={j.id}>{j.kode} — {j.nama}</option>
                                                    ))}
                                                </select>
                                                {selectedJenis?.deskripsi && (
                                                    <p className="mt-2 text-sm text-gray-600 italic">{selectedJenis.deskripsi}</p>
                                                )}
                                                {errors.jenis_kunjungan_id && <p className="mt-2 text-sm text-red-600">{errors.jenis_kunjungan_id}</p>}
                                            </div>

                                            {/* WhatsApp */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                                    Nomor WhatsApp <span className="text-red-600">*</span>
                                                </label>
                                                <input type="tel" value={data.nomor_whatsapp}
                                                    onChange={e => setData("nomor_whatsapp", e.target.value)}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173c94] focus:border-transparent bg-white"
                                                    placeholder="08xxxxxxxxxx" required />
                                                {errors.nomor_whatsapp && <p className="mt-2 text-sm text-red-600">{errors.nomor_whatsapp}</p>}
                                            </div>

                                            {/* Tanggal Kedatangan */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-900 mb-2">
                                                    Tanggal Kedatangan <span className="text-red-600">*</span>
                                                </label>
                                                <input type="date" value={data.tanggal_kedatangan}
                                                    onChange={e => setData("tanggal_kedatangan", e.target.value)}
                                                    min={new Date().toISOString().split("T")[0]}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173c94] focus:border-transparent bg-white"
                                                    required />
                                                {errors.tanggal_kedatangan && <p className="mt-2 text-sm text-red-600">{errors.tanggal_kedatangan}</p>}
                                            </div>

                                            {/* Catatan */}
                                            <div>
                                                <label className="block text-sm font-bold text-gray-900 mb-2">Catatan</label>
                                                <textarea value={data.catatan}
                                                    onChange={e => setData("catatan", e.target.value)}
                                                    rows="4"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173c94] focus:border-transparent bg-white"
                                                    placeholder="Keperluan atau informasi tambahan (opsional)" />
                                                {errors.catatan && <p className="mt-2 text-sm text-red-600">{errors.catatan}</p>}
                                            </div>

                                            <div className="pt-4">
                                                <button type="submit" disabled={processing}
                                                    className="w-full bg-[#173c94] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#0f2a6b] focus:outline-none focus:ring-4 focus:ring-[#173c94] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                                    {processing ? (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <i className="fas fa-spinner fa-spin" /> Memproses...
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center justify-center gap-2">
                                                            <i className="fas fa-paper-plane" /> Daftar Antrian
                                                        </span>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Daftar Layanan */}
                                {jenisKunjungan.length > 0 && (
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Jenis Kunjungan Tersedia</h2>
                                        <div className="space-y-6">
                                            {jenisKunjungan.map((j, index) => (
                                                <div key={j.id} className="flex items-start gap-6">
                                                    <div className="flex-shrink-0 w-8 text-center">
                                                        <span className="text-lg font-bold text-gray-400">{index + 1}.</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-[#173c94] text-white">
                                                                {j.kode}
                                                            </span>
                                                            <h3 className="text-lg font-bold text-gray-900">{j.nama}</h3>
                                                        </div>
                                                        {j.deskripsi && (
                                                            <p className="text-gray-700 leading-relaxed">{j.deskripsi}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Petunjuk */}
                                <div className="mt-16 p-8 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Petunjuk Pendaftaran</h3>
                                    <div className="space-y-3 text-gray-600 leading-relaxed">
                                        <p>1. Lengkapi formulir pendaftaran di atas dengan data yang benar</p>
                                        <p>2. Pastikan email yang dimasukkan aktif dan dapat menerima notifikasi</p>
                                        <p>3. Kode antrian akan dikirim otomatis ke email Anda setelah pendaftaran berhasil</p>
                                        <p>4. Simpan kode antrian dan tunjukkan saat datang ke kantor sesuai jadwal</p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Cek Status */
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">Cek Status Antrian</h2>

                                <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
                                    <form onSubmit={handleCheckSubmit} className="max-w-md mx-auto">
                                        <div className="mb-6">
                                            <label className="block text-sm font-bold text-gray-900 mb-2 text-center">
                                                Masukkan Kode Antrian Anda
                                            </label>
                                            <input type="text" value={checkData.kode_antrian}
                                                onChange={e => setCheckData("kode_antrian", e.target.value.toUpperCase())}
                                                className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#173c94] focus:border-[#173c94] text-center font-mono text-2xl font-bold tracking-wider bg-white"
                                                placeholder="FHD20260514001" required />
                                            {checkErrors.kode_antrian && (
                                                <p className="mt-2 text-sm text-red-600 text-center">{checkErrors.kode_antrian}</p>
                                            )}
                                        </div>

                                        <button type="submit" disabled={checkProcessing}
                                            className="w-full bg-[#173c94] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#0f2a6b] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                                            {checkProcessing ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <i className="fas fa-spinner fa-spin" /> Mencari...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <i className="fas fa-search" /> Cek Status
                                                </span>
                                            )}
                                        </button>
                                    </form>
                                </div>

                                <div className="mt-8 p-8 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Informasi</h3>
                                    <div className="space-y-3 text-gray-600 leading-relaxed">
                                        <p>• Kode antrian telah dikirim ke email Anda saat pendaftaran</p>
                                        <p>• Format kode: singkatan jenis + 8 digit tanggal + 3 digit nomor urut</p>
                                        <p>• Contoh: FHD20260514001 (FHD, 14 Mei 2026, antrian ke-1)</p>
                                        <p>• Jika tidak menemukan email, cek folder spam/junk</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
};

export default PelayananIndex;
