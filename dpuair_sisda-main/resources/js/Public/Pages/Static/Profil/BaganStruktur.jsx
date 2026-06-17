import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function BaganStruktur() {
    const pdfUrl = "/storage/documents/STRUKTUR-ORGANISASI-2025.pdf";

    return (
        <GuestLayout>
            <Head>
                <title>Bagan Struktur Organisasi</title>
                <meta
                    name="description"
                    content="Lihat bagan struktur organisasi resmi Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur untuk memahami hierarki dan unit kerja."
                />
            </Head>

            {/* Hero Section */}
            <section className="relative bg-[#173c94] py-24 lg:py-32 overflow-hidden">
                {/* Background Logo Watermark */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 opacity-5">
                    <img
                        src="/assets/images/PUSDAJATIM_WHITE_LOGO.png"
                        alt=""
                        className="w-full h-full object-contain"
                    />
                </div>

                <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
                            Struktur Organisasi
                        </h1>
                        <div className="w-16 h-px bg-white mb-8"></div>
                        <p className="text-xl text-white/80 leading-relaxed">
                            Bagan struktur organisasi Dinas Sumber Daya Air
                            Provinsi Jawa Timur menggambarkan susunan unit-unit
                            kerja dan hubungan koordinasi di lingkungan dinas
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 bg-white">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="space-y-8">
                        {/* PDF Preview */}
                        <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                            <iframe
                                src={pdfUrl}
                                width="100%"
                                height="800px"
                                title="Bagan Struktur Organisasi"
                                className="w-full"
                            ></iframe>
                        </div>

                        {/* Download Link */}
                        <div className="text-center">
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center group"
                            >
                                <span className="text-lg font-bold text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
                                    Buka di Tab Baru
                                </span>
                                <div className="ml-4 w-12 h-px bg-gray-900 group-hover:w-16 transition-all duration-300"></div>
                            </a>
                        </div>

                        {/* Footer Note */}
                        <div className="mt-8 p-8 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                Keterangan
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Struktur organisasi ini berlaku berdasarkan
                                Peraturan Gubernur Jawa Timur yang mengatur
                                tentang Kedudukan, Susunan Organisasi, Uraian
                                Tugas dan Fungsi Serta Tata Kerja Dinas
                                Pekerjaan Umum Sumber Daya Air Provinsi Jawa
                                Timur.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
