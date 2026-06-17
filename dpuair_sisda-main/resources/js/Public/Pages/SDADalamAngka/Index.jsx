import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";
import React from "react";

export default function Index() {
    const reports = [
        {
            year: 2025,
            description:
                "Publikasi ini memuat data dan informasi terbaru tentang kondisi dan pengelolaan sumber daya air di Jawa Timur dari berbagai bidang Dinas PU SDA. Disusun sebagai referensi dan bahan literasi, diharapkan mendukung kolaborasi dan pengambilan kebijakan demi pengelolaan SDA yang berkelanjutan.",
            href: "/sda-dalam-angka/show",
            params: { year: 2025 },
            target: "_blank",
        },
        {
            year: 2024,
            description:
                "Publikasi ini memuat data dan informasi terbaru tentang kondisi dan pengelolaan sumber daya air di Jawa Timur dari berbagai bidang Dinas PU SDA. Disusun sebagai referensi dan bahan literasi, diharapkan mendukung kolaborasi dan pengambilan kebijakan demi pengelolaan SDA yang berkelanjutan.",
            href: "/sda-dalam-angka/show",
            params: { year: 2024 },
            target: "_blank",
        },
    ];
    return (
        <GuestLayout>
            <Head>
                <title>SDA Dalam Angka</title>
                <meta name="description" content="SDA Dalam Angka" />
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
                            SDA Dalam Angka
                        </h1>
                        <div className="w-16 h-px bg-white mb-8"></div>
                        <p className="text-xl text-white/80 leading-relaxed">
                            SDA Dalam Angka adalah laporan tahunan yang
                            menyajikan data, informasi, dan statistik terkait
                            pengelolaan sumber daya air di Provinsi Jawa Timur.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 bg-white">
                <div className="max-w-screen mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                        {reports.map((report) => (
                            <a
                                href={`${report.href}?${new URLSearchParams(
                                    report.params
                                ).toString()}`}
                                target={report.target}
                                className="group relative rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 transition-all duration-300 overflow-hidden p-8 block focus:outline-none"
                            >
                                {/* Background Year Number */}
                                <div className="absolute -right-4 -bottom-10 select-none">
                                    <span className="text-9xl font-black text-gray-200/50 transition-colors duration-300 group-hover:text-gray-300/60">
                                        {report.year}
                                    </span>
                                </div>

                                <div className="relative z-10 h-full flex flex-col">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        SDA Dalam Angka {report.year}
                                    </h2>
                                    <p className="text-gray-600 mt-2 mb-8 flex-grow text-justify">
                                        {report.description}
                                    </p>
                                    <span className="flex items-center text-[#173c94] font-semibold group-hover:text-[#102a6a] mt-auto transform transition-transform duration-300 group-hover:translate-x-2">
                                        Lihat Laporan
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
