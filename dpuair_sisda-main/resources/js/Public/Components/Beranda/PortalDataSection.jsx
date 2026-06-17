import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function PortalDataSection() {
    // Static data untuk demo (nantinya bisa diganti dengan props dari controller)
    const portalDataCategories = [
        {
            id: 1,
            title: "SIH3",
            logo: "/storage/images/logoSIH3.png", // Asumsi nama file logo
            subtitle:
                "Sistem Informasi Hidrologi, Hidrometeorologi & Hidrogeologi",
            description: "Monitoring real-time curah hujan dan debit sungai",
            link: "https://sih3.dpuair.jatimprov.go.id/",
        },
        {
            id: 2,
            title: "SIBB",
            logo: "/storage/images/logoSIBB.svg", // Asumsi nama file logo
            subtitle: "Sistem Informasi Bencana Banjir",
            description:
                "Pemantauan dan prediksi bencana banjir dengan sistem peringatan dini",
            link: "https://sibb.dpuair.jatimprov.go.id/",
        },
        {
            id: 3,
            title: "Telusur Banyu",
            logo: "/storage/images/logoTELUSUR.png", // Asumsi nama file logo
            subtitle: "Telusur Banyu",
            description: "Aplikasi penelusuran sarana & prasarana sungai Jatim",
            link: "https://telusurbanyu.dpuair.jatimprov.go.id/",
        },
        {
            id: 4,
            title: "Fast Hydrology Data",
            logo: "/storage/images/logoFHD.png", // Asumsi nama file logo
            subtitle: "Pelayanan Data Hidrologi",
            description: "Data curah hujan",
            link: "https://hidrologi.dpuair.jatimprov.go.id/pelayanan/",
        },
    ];

    return (
        <section className="relative py-24 lg:py-32 bg-[#173c94] overflow-hidden">
            {/* Background Logo */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4/12 opacity-5">
                <img
                    src="/assets/images/PUSDAJATIM_WHITE_LOGO.png"
                    alt=""
                    className="w-full h-full object-contain"
                />
            </div>

            <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Section Header */}
                <div className="mb-14 md:mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                            Portal Data
                        </h2>
                        <div className="w-16 h-px bg-white"></div>
                        <p className="text-lg sm:text-xl text-white/80 max-w-3xl leading-relaxed">
                            Portal data dan sistem informasi layanan digital
                            untuk publik, mitra, dan internal. Akses dashboard
                            monitoring, data hidrologi, dokumen, hingga layanan
                            interaktif secara online.
                        </p>
                    </motion.div>
                </div>

                {/* Portal Data Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {portalDataCategories.map((category, index) => (
                        <motion.a
                            key={category.id}
                            href={category.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group relative bg-gray-200 border border-white/20 rounded-2xl p-6 lg:p-8 hover:shadow-2xl hover:shadow-[#173c94]/40 transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Logo Wrapper */}
                            <div className="w-full h-20 sm:h-24 mb-6 flex items-center justify-center">
                                {category.logo ? (
                                    <img
                                        src={category.logo}
                                        alt={`Logo ${category.title}`}
                                        className="h-full object-contain filter"
                                        onError={(e) => {
                                            // Fallback if image not found
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display =
                                                "block";
                                        }}
                                    />
                                ) : null}
                                {/* Fallback Title if no logo or image fails to load */}
                                <h3
                                    className="text-3xl font-bold text-[#173c94]"
                                    style={{
                                        display: category.logo
                                            ? "none"
                                            : "block",
                                    }}
                                >
                                    {category.title}
                                </h3>
                            </div>

                            {/* Content */}
                            <div className="space-y-4 flex-grow flex flex-col">
                                <div>
                                    {/* Subtitle */}
                                    <p className="text-lg font-bold text-[#173c94] group-hover:text-blue-600 transition-colors duration-300 mb-2">
                                        {category.subtitle}
                                    </p>

                                    {/* Divider */}
                                    <div className="w-12 h-1 bg-[#173c94]/20 group-hover:w-full group-hover:bg-[#173c94] transition-all duration-500 rounded-full mb-3"></div>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                        {category.description}
                                    </p>
                                </div>

                                {/* External Link Icon & CTA Label - Pushed to bottom */}
                                <div className="pt-6 mt-auto flex items-center justify-between border-t border-gray-100">
                                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[#173c94] group-hover:text-blue-600 transition-colors duration-300">
                                        Akses Portal
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-[#173c94]/10 flex items-center justify-center group-hover:bg-[#173c94] transition-colors duration-300">
                                        <svg
                                            className="w-4 h-4 text-[#173c94] group-hover:text-white transition-colors duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
}
