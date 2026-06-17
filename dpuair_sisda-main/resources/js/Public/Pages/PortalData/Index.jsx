import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Link, router, Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

// Hardcoded portal data from navigation menu
const portalDataItems = [
    {
        id: 1,
        title: "Hidrologi",
        subtitle: "Data Hidrologi & Monitoring",
        description:
            "Akses data hidrologi, curah hujan, debit sungai, dan informasi monitoring sumber daya air secara real-time untuk mendukung pengelolaan yang optimal.",
        logo: "/assets/images/hidrologi.png",
        bgColor: "from-blue-500 to-cyan-500",
        category: "Monitoring",
        url: "https://hidrologi.dpuair.jatimprov.go.id/",
        stats: "Real-time Data",
        features: ["Curah Hujan", "Debit Sungai", "TMA", "Klimatologi"],
    },
    {
        id: 2,
        title: "SISWA",
        subtitle: "Sistem Informasi Sumber Daya Air",
        description:
            "Platform terintegrasi untuk pengelolaan informasi sumber daya air, aset infrastruktur, dan monitoring kinerja sistem irigasi di Jawa Timur.",
        logo: "/assets/images/siswa.png",
        bgColor: "from-emerald-500 to-teal-500",
        category: "Sistem Informasi",
        url: "https://siswa.dpuair.jatimprov.go.id/",
        stats: "Aset Terintegrasi",
        features: ["Aset SDA", "Irigasi", "Monitoring", "Laporan"],
    },
    {
        id: 3,
        title: "E-Surat",
        subtitle: "Elektronik Surat Menyurat",
        description:
            "Sistem manajemen surat elektronik untuk meningkatkan efisiensi administrasi dan dokumentasi korespondensi internal maupun eksternal.",
        logo: "/assets/images/e-surat.png",
        bgColor: "from-purple-500 to-indigo-500",
        category: "Administrasi",
        url: "https://e-surat.dpuair.jatimprov.go.id/",
        stats: "Paperless Office",
        features: ["Surat Masuk", "Surat Keluar", "Disposisi", "Arsip Digital"],
    },
    {
        id: 4,
        title: "Permintaan Data Hidrologi",
        subtitle: "Layanan Permintaan Data",
        description:
            "Portal layanan untuk mengajukan permintaan data hidrologi, meteorologi, dan informasi sumber daya air untuk keperluan penelitian dan analisis.",
        logo: "/assets/images/data-request.png",
        bgColor: "from-orange-500 to-red-500",
        category: "Layanan Publik",
        url: "https://data-request.dpuair.jatimprov.go.id/",
        stats: "Layanan 24/7",
        features: ["Request Data", "Download", "Analisis", "Konsultasi"],
    },
    {
        id: 5,
        title: "SIPRABHU",
        subtitle: "Sistem Prasarana Bangunan Air & Irigasi",
        description:
            "Platform untuk pengelolaan dan monitoring prasarana bangunan air, bendungan, embung, dan infrastruktur irigasi di seluruh Jawa Timur.",
        logo: "/assets/images/siprabhu.png",
        bgColor: "from-cyan-500 to-blue-500",
        category: "Infrastruktur",
        url: "https://siprabhu.dpuair.jatimprov.go.id/",
        stats: "Infrastruktur Terintegrasi",
        features: ["Bendungan", "Embung", "Irigasi", "Maintenance"],
    },
    {
        id: 6,
        title: "E-SPPD",
        subtitle: "Elektronik Surat Perjalanan Dinas",
        description:
            "Sistem pengelolaan surat perjalanan dinas elektronik untuk efisiensi administrasi perjalanan dinas dan pertanggungjawaban keuangan.",
        logo: "/assets/images/e-sppd.png",
        bgColor: "from-teal-500 to-green-500",
        category: "Administrasi",
        url: "https://e-sppd.dpuair.jatimprov.go.id/",
        stats: "Digital Travel",
        features: ["SPPD Online", "Tracking", "Laporan", "Reimbursement"],
    },
    {
        id: 7,
        title: "SIH3",
        subtitle: "Sistem Informasi Hidrologi, Hidrometeorologi & Hidrogeologi",
        description:
            "Platform komprehensif untuk monitoring dan analisis data hidrologi, hidrometeorologi, dan hidrogeologi secara real-time dan historis.",
        logo: "/assets/images/sih3.png",
        bgColor: "from-indigo-500 to-purple-500",
        category: "Monitoring",
        url: "https://sih3.dpuair.jatimprov.go.id/",
        stats: "3H Monitoring",
        features: ["Hidrologi", "Hidrometeorologi", "Hidrogeologi", "Analisis"],
    },
    {
        id: 8,
        title: "SIBB",
        subtitle: "Sistem Informasi Bencana Banjir",
        description:
            "Platform early warning system dan manajemen informasi bencana banjir dengan prediksi cuaca dan sistem peringatan dini terintegrasi.",
        logo: "/assets/images/sibb.png",
        bgColor: "from-red-500 to-pink-500",
        category: "Mitigasi Bencana",
        url: "https://sibb.dpuair.jatimprov.go.id/",
        stats: "Early Warning",
        features: ["Prediksi Banjir", "Alert System", "Mitigasi", "Response"],
    },
    {
        id: 9,
        title: "SKOPI",
        subtitle: "Sistem Koordinasi & Pelaporan Irigasi",
        description:
            "Platform koordinasi dan pelaporan untuk pengelolaan sistem irigasi, monitoring kinerja, dan evaluasi program pembangunan irigasi.",
        logo: "/assets/images/skopi.png",
        bgColor: "from-yellow-500 to-orange-500",
        category: "Koordinasi",
        url: "https://skopi.dpuair.jatimprov.go.id/",
        stats: "Koordinasi Terintegrasi",
        features: ["Koordinasi", "Pelaporan", "Monitoring", "Evaluasi"],
    },
];

const PortalDataIndex = ({ datasets, filters }) => {
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [filteredData, setFilteredData] = useState(portalDataItems);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!searchTerm.trim()) {
                setFilteredData(portalDataItems);
                return;
            }

            const filtered = portalDataItems.filter(
                (item) =>
                    item.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.subtitle
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.category
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.features.some((feature) =>
                        feature.toLowerCase().includes(searchTerm.toLowerCase())
                    )
            );

            setFilteredData(filtered);
        }, 300); // 300ms debounce delay

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const clearSearch = () => {
        setSearchTerm("");
    };

    const categoryColors = [
        "bg-sky-500",
        "bg-amber-500",
        "bg-emerald-500",
        "bg-indigo-500",
        "bg-rose-500",
        "bg-violet-500",
        "bg-teal-500",
        "bg-cyan-500",
        "bg-orange-500",
        "bg-purple-500",
        "bg-green-500",
    ];

    const getCategoryColor = (index) => {
        return categoryColors[index % categoryColors.length];
    };

    return (
        <GuestLayout>
            <Head>
                <title>
                    Portal Data & Sistem Informasi - Dinas PU SDA Jatim
                </title>
                <meta
                    name="description"
                    content="Akses berbagai sistem informasi dan portal data terintegrasi terkait pengelolaan Sumber Daya Air di Provinsi Jawa Timur secara real-time."
                />
            </Head>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 min-h-[50vh] sm:min-h-[45vh] lg:min-h-[40vh] flex items-center overflow-hidden -mt-0">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-5 left-5 sm:top-10 sm:left-20 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute top-1/3 right-10 sm:right-32 w-16 h-16 sm:w-20 sm:h-20 bg-cyan-400/20 rounded-full blur-2xl animate-bounce"></div>
                    <div className="absolute bottom-10 left-1/4 w-14 h-14 sm:w-18 sm:h-18 bg-blue-300/15 rounded-full blur-xl animate-pulse delay-1000"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                            <span className="text-cyan-300 text-sm font-medium">
                                🗄️ Pusat Data & Monitoring
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Portal
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                                &nbsp;Data
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-3xl mx-auto">
                            Akses berbagai sistem informasi dan portal data
                            terkait pengelolaan Sumber Daya Air Jawa Timur
                            secara terintegrasi dan real-time.
                        </p>
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <section className="bg-gray-50 py-6 sm:py-8 border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6">
                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Cari portal data (nama, kategori, fitur)..."
                                className="w-full px-4 py-3 sm:py-4 pr-12 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-sm sm:text-base"
                            />
                            <button
                                type="submit"
                                className="absolute inset-y-0 right-0 px-4 text-gray-500 hover:text-blue-600 transition-colors"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                        {searchTerm && (
                            <div className="flex items-center justify-between mt-3">
                                <p className="text-sm text-gray-600">
                                    Ditemukan{" "}
                                    <strong>{filteredData.length}</strong>{" "}
                                    portal data
                                    {searchTerm && (
                                        <span> untuk "{searchTerm}"</span>
                                    )}
                                </p>
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Reset
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {filteredData.length > 0 ? (
                    <>
                        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-gray-200">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                {searchTerm
                                    ? "Hasil Pencarian"
                                    : "Portal Data & Sistem Informasi"}
                            </h2>
                            <div className="text-sm text-gray-600">
                                <strong>{filteredData.length}</strong> portal
                                tersedia
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {filteredData.map((item, index) => (
                                <article
                                    key={item.id}
                                    className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-200 flex flex-col overflow-hidden transform hover:-translate-y-1"
                                >
                                    {/* Category Color Bar */}
                                    <div
                                        className={`h-1.5 ${getCategoryColor(
                                            index
                                        )}`}
                                    ></div>

                                    {/* Header with Logo */}
                                    <div
                                        className={`bg-gradient-to-br ${item.bgColor} p-6 text-center relative overflow-hidden`}
                                    >
                                        {/* Background Pattern */}
                                        <div className="absolute inset-0 opacity-10">
                                            <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full"></div>
                                            <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/20 rounded-full"></div>
                                        </div>

                                        <div className="relative z-10">
                                            {/* Logo Container */}
                                            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4 group-hover:scale-105 transition-transform duration-300 inline-block">
                                                <img
                                                    src={item.logo}
                                                    alt={`Logo ${item.title}`}
                                                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain mx-auto"
                                                    onError={(e) => {
                                                        e.target.style.display =
                                                            "none";
                                                        e.target.nextSibling.style.display =
                                                            "block";
                                                    }}
                                                />
                                                <div
                                                    className="w-12 h-12 sm:w-16 sm:h-16 bg-white/30 rounded-lg flex items-center justify-center text-white text-xl sm:text-2xl font-bold mx-auto"
                                                    style={{ display: "none" }}
                                                >
                                                    {item.title.charAt(0)}
                                                </div>
                                            </div>

                                            <h3 className="text-lg sm:text-xl font-bold text-white mb-1">
                                                {item.title}
                                            </h3>
                                            <p className="text-white/90 text-xs sm:text-sm font-medium">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 sm:p-6 flex-grow flex flex-col">
                                        <div className="flex-grow">
                                            {/* Category & Stats */}
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600">
                                                    {item.category}
                                                </span>
                                                <span className="text-xs text-blue-600 font-semibold">
                                                    {item.stats}
                                                </span>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                                {item.description}
                                            </p>

                                            {/* Features */}
                                            <div className="mb-4">
                                                <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                                                    Fitur Utama
                                                </h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.features.map(
                                                        (feature, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium"
                                                            >
                                                                {feature}
                                                            </span>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <div className="mt-auto">
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center w-full text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 group-hover:from-blue-700 group-hover:to-blue-800 px-4 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                                            >
                                                <svg
                                                    className="w-4 h-4 mr-2"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                    />
                                                </svg>
                                                Akses Portal
                                                <span className="ml-2 transform transition-transform duration-200 group-hover:translate-x-1">
                                                    →
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <div className="mb-6">
                                <svg
                                    className="w-16 h-16 text-gray-300 mx-auto"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                Tidak Ada Portal Data Ditemukan
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Coba ubah kata kunci pencarian untuk menemukan
                                portal data yang Anda cari.
                            </p>
                            <button
                                onClick={clearSearch}
                                className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md"
                            >
                                Reset Pencarian
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </GuestLayout>
    );
};

export default PortalDataIndex;
