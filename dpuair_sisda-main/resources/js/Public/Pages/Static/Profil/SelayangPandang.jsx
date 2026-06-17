import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function SelayangPandang() {
    return (
        <GuestLayout>
            <Head>
                <title>Selayang Pandang - Dinas PU SDA Jatim</title>
                <meta
                    name="description"
                    content="Mengenal lebih dekat Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur, dari motto pelayanan, kewenangan, hingga wilayah kerja strategis."
                />
            </Head>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 h-[35vh] flex items-center overflow-hidden -mt-0">
                <div className="absolute inset-0 opacity-10"></div>

                {/* Floating Elements */}
                <div className="absolute top-10 left-20 w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 right-32 w-16 h-16 bg-cyan-400/20 rounded-full blur-2xl animate-bounce"></div>
                <div className="absolute bottom-16 left-1/4 w-14 h-14 bg-blue-300/15 rounded-full blur-xl animate-pulse delay-1000"></div>

                {/* Main Content */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <span className="text-cyan-300 text-sm font-medium">
                                ✨ Profil Dinas SDA Provinsi Jawa Timur
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Selayang
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                                &nbsp;Pandang
                            </span>
                        </h1>

                        <p className="text-lg text-blue-100 leading-relaxed max-w-3xl mx-auto">
                            Pengelola sumber daya air yang berkelanjutan,
                            berdaya guna, dan berhasil guna untuk kemakmuran
                            rakyat Jawa Timur yang berkeadilan.
                        </p>
                    </div>
                </div>
            </section>

            {/* Motto Section */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-base font-semibold text-blue-600 tracking-wider uppercase">
                            Motto Pelayanan
                        </h2>
                        <p className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                            MEMAYU HAYUNING TIRTO
                        </p>
                        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                            "Usaha Mempertahankan Kelestarian Sumber Daya Air"
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Section Header */}
                        <div className="text-center mb-20">
                            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                                Profil & Kewenangan
                            </h2>
                            <p className="mt-4 text-lg text-gray-500">
                                Sekilas tentang struktur, tugas, dan wilayah
                                kerja Dinas PU Sumber Daya Air Jawa Timur.
                            </p>
                        </div>

                        {/* Content Blocks */}
                        <div className="space-y-16">
                            {/* Block 1: OPD */}
                            <div className="flex flex-col md:flex-row items-center gap-12">
                                <div className="md:w-1/3">
                                    <div className="p-8 bg-blue-50 border border-blue-100 rounded-xl text-center">
                                        <svg
                                            className="h-12 w-12 text-blue-600 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            ></path>
                                        </svg>
                                        <h3 className="mt-6 text-xl font-bold text-gray-900">
                                            Organisasi Perangkat Daerah
                                        </h3>
                                    </div>
                                </div>
                                <div className="md:w-2/3">
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        Dinas Pekerjaan Umum Sumber Daya Air
                                        Provinsi Jawa Timur merupakan
                                        <strong className="font-semibold text-gray-900">
                                            {" "}
                                            unsur pelaksana otonomi daerah
                                        </strong>
                                        , dipimpin oleh seorang Kepala Dinas,
                                        yang berada di bawah dan bertanggung
                                        jawab kepada Gubernur melalui Sekretaris
                                        Daerah.
                                    </p>
                                </div>
                            </div>

                            {/* Block 2: Wilayah Kewenangan */}
                            <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                                <div className="md:w-1/3">
                                    <div className="p-8 bg-green-50 border border-green-100 rounded-xl text-center">
                                        <svg
                                            className="h-12 w-12 text-green-600 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M9 20l-5.447-2.724A2 2 0 013 15.382V8.618a2 2 0 011.553-1.894L10 4V20zm0 0l6-3V4l-5.447 2.724A2 2 0 009 8.618v6.764a2 2 0 00.553 1.894L15 20"
                                            ></path>
                                        </svg>
                                        <h3 className="mt-6 text-xl font-bold text-gray-900">
                                            Wilayah Kewenangan
                                        </h3>
                                    </div>
                                </div>
                                <div className="md:w-2/3">
                                    <p className="text-lg text-gray-700 leading-relaxed">
                                        Berdasarkan Peraturan Menteri PUPR No.
                                        <strong className="font-semibold text-gray-900">
                                            {" "}
                                            04/PRT/M/2015
                                        </strong>{" "}
                                        tentang Kriteria dan Penetapan Wilayah
                                        Sungai, wilayah kewenangan pengelolaan
                                        mencakup
                                        <strong className="font-semibold text-gray-900">
                                            {" "}
                                            7 (tujuh) wilayah sungai
                                        </strong>
                                        .
                                    </p>
                                </div>
                            </div>

                            {/* Block 3: Pembagian Wilayah Sungai */}
                            <div className="pt-16">
                                <div className="text-center mb-12">
                                    <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                                        Pembagian Wilayah Sungai
                                    </h3>
                                    <p className="mt-3 text-lg text-gray-500 max-w-3xl mx-auto">
                                        Kewenangan pengelolaan dibagi antara
                                        Pemerintah Pusat dan Pemerintah Provinsi
                                        untuk memastikan penanganan yang efektif
                                        dan strategis.
                                    </p>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Pemerintah Pusat */}
                                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                                            Pemerintah Pusat
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-4">
                                            (2 Wilayah Sungai Strategis
                                            Nasional)
                                        </p>
                                        <ul className="space-y-3">
                                            <li className="p-4 bg-white rounded-md border-l-4 border-blue-500 shadow-sm">
                                                <h5 className="font-semibold text-gray-800">
                                                    Wilayah Sungai Bengawan Solo
                                                </h5>
                                                <p className="text-sm text-gray-600">
                                                    Lintas provinsi
                                                </p>
                                            </li>
                                            <li className="p-4 bg-white rounded-md border-l-4 border-blue-500 shadow-sm">
                                                <h5 className="font-semibold text-gray-800">
                                                    Wilayah Sungai Brantas
                                                </h5>
                                                <p className="text-sm text-gray-600">
                                                    Strategis nasional
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* Pemerintah Provinsi */}
                                    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                                            Pemerintah Provinsi
                                        </h4>
                                        <p className="text-sm text-gray-500 mb-4">
                                            (5 Wilayah Sungai Lintas
                                            Kabupaten/Kota)
                                        </p>
                                        <ul className="space-y-2">
                                            {[
                                                "Madura Bawean",
                                                "Welang Rejoso",
                                                "Bondoyudo Bedadung",
                                                "Pekalen Sampean",
                                                "Baru Bajulmati",
                                            ].map((ws) => (
                                                <li
                                                    key={ws}
                                                    className="p-3 bg-white rounded-md border-l-4 border-green-500 shadow-sm"
                                                >
                                                    <h5 className="font-semibold text-sm text-gray-800">
                                                        Wilayah Sungai {ws}
                                                    </h5>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
