import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Head, Link } from "@inertiajs/react";
import React from "react";

const STATUS_CONFIG = {
    pending: {
        label: "Menunggu",
        description: "Antrian Anda sedang dalam daftar tunggu",
        icon: "fa-clock",
        color: "text-amber-700",
    },
    diproses: {
        label: "Diproses",
        description: "Antrian Anda sedang diproses oleh petugas",
        icon: "fa-spinner",
        color: "text-sky-700",
    },
    selesai: {
        label: "Selesai",
        description: "Pelayanan Anda telah selesai",
        icon: "fa-check-circle",
        color: "text-emerald-700",
    },
    dibatalkan: {
        label: "Ditolak",
        description: "Antrian Anda telah ditolak/dibatalkan",
        icon: "fa-times-circle",
        color: "text-rose-700",
    },
};

const PelayananShow = ({ pelayanan }) => {
    const currentStatus = STATUS_CONFIG[pelayanan.status] ?? STATUS_CONFIG.pending;

    const formatDate = (d) =>
        new Date(d).toLocaleDateString("id-ID", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
        });

    return (
        <GuestLayout>
            <Head title={`Antrian ${pelayanan.kode_antrian}`} />

            {/* Hero */}
            <section className="relative bg-[#173c94] py-24 lg:py-32 overflow-hidden">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 opacity-5">
                    <img src="/assets/images/PUSDAJATIM_WHITE_LOGO.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="max-w-3xl">
                        <div className="mb-6">
                            <Link href={route("pelayanan.index")}
                                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                                <i className="fas fa-arrow-left" />
                                <span>Kembali</span>
                            </Link>
                        </div>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
                            Detail Antrian
                        </h1>
                        <div className="w-16 h-px bg-white mb-8" />
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8">
                            <p className="text-white/60 text-sm mb-2">Kode Antrian Anda</p>
                            <p className="text-4xl sm:text-5xl font-bold text-white tracking-wider font-mono">
                                {pelayanan.kode_antrian}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 bg-white">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="max-w-4xl mx-auto space-y-16">

                        {/* Status */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Status Antrian</h2>
                            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-white border-2 flex items-center justify-center ${currentStatus.color}`}>
                                        <i className={`fas ${currentStatus.icon} text-xl`} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{currentStatus.label}</h3>
                                        <p className="text-gray-600">{currentStatus.description}</p>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                                    {[
                                        {
                                            active: ["pending", "diproses", "selesai"].includes(pelayanan.status),
                                            color: "bg-amber-500",
                                            icon: "fa-clock",
                                            label: "Menunggu",
                                            desc: "Antrian terdaftar",
                                        },
                                        {
                                            active: ["diproses", "selesai"].includes(pelayanan.status),
                                            color: "bg-sky-500",
                                            icon: "fa-spinner",
                                            label: "Diproses",
                                            desc: "Sedang ditangani petugas",
                                        },
                                        {
                                            active: pelayanan.status === "selesai" || pelayanan.status === "dibatalkan",
                                            color: pelayanan.status === "dibatalkan" ? "bg-rose-500" : "bg-emerald-500",
                                            icon: pelayanan.status === "dibatalkan" ? "fa-times-circle" : "fa-check-circle",
                                            label: pelayanan.status === "dibatalkan" ? "Ditolak" : "Selesai",
                                            desc: pelayanan.status === "dibatalkan" ? "Antrian dibatalkan" : "Pelayanan selesai",
                                        },
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-start gap-4">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.active ? step.color + " text-white" : "bg-gray-200 text-gray-400"}`}>
                                                <i className={`fas ${step.icon} text-sm`} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{step.label}</h4>
                                                <p className="text-sm text-gray-600">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Detail */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">Detail Pendaftaran</h2>
                            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { label: "Nama Lengkap",   value: pelayanan.nama_lengkap },
                                        { label: "Email",          value: pelayanan.email },
                                        { label: "Instansi/Asal",  value: pelayanan.instansi_asal },
                                        { label: "Nomor WhatsApp", value: pelayanan.nomor_whatsapp },
                                    ].map(({ label, value }) => (
                                        <div key={label}>
                                            <p className="text-sm font-bold text-gray-500 mb-1">{label}</p>
                                            <p className="text-lg text-gray-900">{value || "-"}</p>
                                        </div>
                                    ))}

                                    <div>
                                        <p className="text-sm font-bold text-gray-500 mb-1">Jenis Kunjungan</p>
                                        <p className="text-lg">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-[#173c94] text-white mr-2">
                                                {pelayanan.jenis_kunjungan?.kode ?? "-"}
                                            </span>
                                            <span className="text-gray-700">{pelayanan.jenis_kunjungan?.nama}</span>
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold text-gray-500 mb-1">Tanggal Kedatangan</p>
                                        <p className="text-lg text-gray-900">
                                            {pelayanan.tanggal_kedatangan ? formatDate(pelayanan.tanggal_kedatangan) : "-"}
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Info Penting */}
                        <div className="p-8 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">Informasi Penting</h3>
                            <div className="space-y-3 text-gray-600 leading-relaxed">
                                <p>• Simpan kode antrian ini dengan baik untuk ditunjukkan saat kedatangan</p>
                                <p>• Harap datang 15 menit lebih awal dari jadwal untuk proses registrasi</p>
                                <p>• Email konfirmasi telah dikirim ke alamat email yang Anda daftarkan</p>
                                <p>• Untuk pertanyaan lebih lanjut, hubungi kami di (031) 1234-5678</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </GuestLayout>
    );
};

export default PelayananShow;
