import GuestLayout from "@/Public/Layouts/GuestLayout";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Head } from "@inertiajs/react";

// Data untuk timeline, termasuk URL PDF (placeholder)
const timelineData = [
    {
        id: "rpjpd",
        icon: "fas fa-landmark",
        subtitle: "Rencana Pembangunan Jangka Panjang Daerah",
        title: "RPJPD 2025 - 2045",
        content:
            "Rencana Pembangunan Jangka Panjang Daerah (RPJPD) adalah dokumen perencanaan makro yang menjadi acuan pembangunan daerah dalam kurun waktu 20 tahun, memastikan kesinambungan dan arah strategis jangka panjang.",
        pdfUrl: "/storage/documents/RPJPD-JAWATIMUR-2025-2045.pdf",
    },
    {
        id: "rpjmd",
        icon: "fas fa-file-alt",
        subtitle: "Rencana Pembangunan Jangka Menengah Daerah",
        title: "RPJMD 2019 - 2024",
        content:
            "Rencana Pembangunan Jangka Menengah Daerah (RPJMD) adalah penjabaran resmi dari visi, misi, dan program kepala daerah ke dalam tujuan, sasaran, dan kebijakan pembangunan yang terukur.",
        pdfUrl: "/storage/documents/RPJMD-JAWATIMUR-2019-2024.pdf",
    },
    {
        id: "renstra",
        icon: "fas fa-building-shield",
        subtitle: "Rencana Strategis",
        title: "Renstra 2019 - 2024 (Perubahan)",
        content:
            "Rencana Strategis (Renstra) Dinas PU SDA adalah dokumen turunan dari RPJMD yang berisi rencana aksi, program, dan kegiatan spesifik dinas untuk mencapai sasaran pembangunan di bidang sumber daya air.",
        pdfUrl: "/storage/documents/RENSTRA-PUSDA-JAWATIMUR-2019-2024-PERUBAHAN.pdf",
    },
];

export default function VisiMisi() {
    const [selectedItem, setSelectedItem] = useState(timelineData[0]);

    return (
        <GuestLayout>
            <Head>
                <title>Visi & Misi - Dinas PU SDA Jatim</title>
                <meta
                    name="description"
                    content="Pelajari landasan visi dan misi Dinas PU Sumber Daya Air Jawa Timur yang menjadi acuan dalam setiap program, kebijakan, dan pelayanan publik."
                />
            </Head>
            {/* Hero Section - Mobile Optimized */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 min-h-[50vh] sm:min-h-[45vh] lg:min-h-[35vh] flex items-center overflow-hidden -mt-0">
                <div className="absolute inset-0 opacity-10"></div>

                {/* Floating Elements - Mobile Optimized */}
                <div className="absolute top-5 left-5 sm:top-10 sm:left-20 w-8 h-8 sm:w-12 sm:h-12 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-1/3 right-10 sm:right-32 w-12 h-12 sm:w-16 sm:h-16 bg-cyan-400/20 rounded-full blur-2xl animate-bounce"></div>
                <div className="absolute bottom-10 left-1/4 w-10 h-10 sm:w-14 sm:h-14 bg-blue-300/15 rounded-full blur-xl animate-pulse delay-1000"></div>

                {/* Main Content - Mobile Optimized */}
                <div className="container mx-auto px-4 sm:px-6 relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6">
                            <span className="text-cyan-300 text-xs sm:text-sm font-medium">
                                ✨ Profil Dinas SDA Provinsi Jawa Timur
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                            Visi
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                                &nbsp;Misi
                            </span>
                        </h1>

                        <p className="text-sm sm:text-lg text-blue-100 leading-relaxed max-w-3xl mx-auto">
                            Visi dan misi berikut menjadi landasan utama dalam
                            setiap program, kebijakan, dan pelayanan yang
                            diberikan, sejalan dengan tujuan pembangunan daerah
                            dan kebutuhan masyarakat Jawa Timur.
                        </p>
                    </div>
                </div>
            </section>

            {/* Timeline Section - Mobile Optimized */}
            <section className="py-8 sm:py-12 bg-white">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="text-center mb-6 sm:mb-8">
                        <h2 className="text-xl sm:text-3xl font-bold text-gray-800">
                            Alur Visi & Misi
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-2">
                            Klik setiap tahapan untuk melihat dokumen terkait.
                        </p>
                    </div>

                    {/* Mobile: Vertical Stack, Desktop: Horizontal */}
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-3 lg:space-x-3">
                        {timelineData.map((item, index) => (
                            <div key={item.id} className="w-full lg:flex-1">
                                <div
                                    className={`relative px-4 py-3 sm:px-6 sm:py-4 cursor-pointer group transition-all duration-300 border-l-4 lg:border-l-0 lg:border-b-4 w-full rounded-lg ${
                                        selectedItem.id === item.id
                                            ? "border-blue-500 bg-white shadow-lg"
                                            : "border-transparent bg-gray-100 hover:bg-gray-200 hover:border-gray-300"
                                    }`}
                                    onClick={() => setSelectedItem(item)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                                                selectedItem.id === item.id
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-300 text-gray-600 group-hover:bg-gray-400"
                                            }`}
                                        >
                                            <i
                                                className={`${item.icon} text-sm sm:text-lg`}
                                            ></i>
                                        </div>
                                        <div className="text-left min-w-0 flex-1">
                                            <h3
                                                className={`font-bold text-sm sm:text-lg leading-tight ${
                                                    selectedItem.id === item.id
                                                        ? "text-blue-600"
                                                        : "text-gray-800"
                                                }`}
                                            >
                                                {item.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-500 leading-tight line-clamp-2">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Preview Section - Mobile Optimized */}
            <section className="py-6 sm:py-10 pb-12 sm:pb-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6">
                    <div className="max-w-7xl mx-auto bg-white p-4 sm:p-8 rounded-lg sm:rounded-2xl shadow-xl border border-gray-100">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedItem.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h3 className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wider">
                                    {selectedItem.subtitle}
                                </h3>
                                <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mt-1 mb-3 sm:mb-4">
                                    {selectedItem.title}
                                </h2>
                                <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                                    {selectedItem.content}
                                </p>

                                {/* Mobile-friendly PDF viewer */}
                                <div className="bg-gray-100 rounded-lg overflow-hidden border">
                                    <div className="bg-gradient-to-r from-gray-200 to-gray-100 p-3 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            </div>
                                            <span className="text-xs text-gray-600 font-medium">
                                                PDF Document Viewer
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-[50vh] sm:h-[60vh] lg:h-[70vh]">
                                        <iframe
                                            src={selectedItem.pdfUrl}
                                            width="100%"
                                            height="100%"
                                            title={selectedItem.title}
                                            className="w-full h-full"
                                        ></iframe>
                                    </div>
                                </div>

                                {/* Action buttons - Mobile optimized */}
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                                    <p className="text-xs sm:text-sm text-gray-500 text-center">
                                        Pratinjau dokumen untuk{" "}
                                        {selectedItem.title}
                                    </p>
                                    <a
                                        href={selectedItem.pdfUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
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
                                        Buka di Tab Baru
                                    </a>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
