import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function Tupoksi() {
    const fungsiList = [
        "Perumusan kebijakan di bidang pekerjaan umum sumber daya air",
        "Pelaksanaan kebijakan di bidang pekerjaan umum sumber daya air",
        "Pelaksanaan evaluasi dan pelaporan di bidang pekerjaan umum sumber daya air",
        "Pelaksanaan administrasi Dinas di bidang pekerjaan umum sumber daya air",
        "Pelaksanaan fungsi lain yang diberikan oleh Gubernur terkait dengan tugas dan fungsinya",
    ];

    return (
        <GuestLayout>
            <Head>
                <title>Tugas Pokok & Fungsi</title>
                <meta
                    name="description"
                    content="Penjelasan mengenai tugas pokok dan fungsi (Tupoksi) Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur berdasarkan peraturan yang berlaku."
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
                            Tugas Pokok & Fungsi
                        </h1>
                        <div className="w-16 h-px bg-white mb-8"></div>
                        <p className="text-xl text-white/80 leading-relaxed">
                            Berdasarkan Peraturan Gubernur Jawa Timur Nomor 72
                            Tahun 2023 tentang Kedudukan, Susunan Organisasi,
                            Uraian Tugas dan Fungsi Serta Tata Kerja Dinas
                            Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 bg-white">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="max-w-4xl mx-auto space-y-16">
                        {/* Tugas Section */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                Tugas
                            </h2>
                            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
                                <p className="text-gray-700 leading-relaxed text-lg">
                                    Membantu Gubernur melaksanakan urusan
                                    pemerintahan yang menjadi kewenangan
                                    Pemerintah Provinsi di bidang pekerjaan umum
                                    sumber daya air dan tugas pembantuan.
                                </p>
                            </div>
                        </div>

                        {/* Fungsi Section */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                Fungsi
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Dinas dalam melaksanakan tugas sebagaimana
                                dimaksud menyelenggarakan fungsi:
                            </p>
                            <div className="space-y-6">
                                {fungsiList.map((fungsi, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-6"
                                    >
                                        {/* Number */}
                                        <div className="flex-shrink-0 w-8 text-center">
                                            <span className="text-lg font-bold text-gray-400">
                                                {index + 1}.
                                            </span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-700 leading-relaxed">
                                                {fungsi}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="mt-16 p-8 bg-gray-50 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3">
                                Dasar Hukum
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                                Tugas Pokok dan Fungsi ini ditetapkan
                                berdasarkan Peraturan Gubernur Jawa Timur Nomor
                                72 Tahun 2023 tentang Kedudukan, Susunan
                                Organisasi, Uraian Tugas dan Fungsi Serta Tata
                                Kerja Dinas Pekerjaan Umum Sumber Daya Air
                                Provinsi Jawa Timur.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
