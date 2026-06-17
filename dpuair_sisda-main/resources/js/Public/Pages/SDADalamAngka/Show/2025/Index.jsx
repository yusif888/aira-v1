import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react"; 

import SekretariatContent from './Sekretariat';
import PerencanaanSumberDayaAirContent from './PerencanaanSumberDayaAir';
import IrigasiContent from './Irigasi';
import SungaiWadukPantaiContent from './SungaiWadukPantai';
import BinaManfaatContent from './BinaManfaat';

// --- Struktur Data dengan Referensi Komponen ---
const chapters = [
    { 
        number: "I", 
        title: "Sekretariat", 
        Component: SekretariatContent 
    },
    {
        number: "II",
        title: "Bidang Perencanaan Sumber Daya Air",
        Component: PerencanaanSumberDayaAirContent,
    },
    { 
        number: "III", 
        title: "Bidang Irigasi", 
        Component: IrigasiContent 
    },
    {
        number: "IV",
        title: "Bidang Sungai, Waduk dan Pantai",
        Component: SungaiWadukPantaiContent,
    },
    {
        number: "V",
        title: "Bidang Bina Manfaat",
        Component: BinaManfaatContent,
    },
];

export default function TableOfContentsTabs() {
    // State untuk melacak tab mana yang aktif. `0` untuk tab pertama.
    const [activeIndex, setActiveIndex] = useState(0);

    // Ambil komponen yang sedang aktif berdasarkan state
    const ActiveComponent = chapters[activeIndex].Component;

    return (
        <>
            <Head>
                <title>SDA Dalam Angka 2025</title>
                <meta
                    name="description"
                    content="Laporan Tahunan Sumber Daya Air Provinsi Jawa Timur Tahun 2025"
                />
            </Head>

            <main className="bg-white text-zinc-800 font-sans xl:px-20 lg:px-8">
                <div className="max-w-screen mx-auto">
                    {/* --- Section 1: Hero / Judul Halaman --- */}
                    <header className="py-24 sm:py-32 px-6 lg:px-8 border-b border-zinc-200">
                        <Link
                            href="/sda-dalam-angka"
                            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                        >
                            ← Kembali ke Arsip Tahunan
                        </Link>
                        <h1 className="mt-6 text-5xl sm:text-7xl font-bold tracking-tighter">
                            SDA Dalam Angka
                        </h1>
                        <h2 className="text-5xl sm:text-7xl font-bold tracking-tighter text-zinc-300">
                            Tahun 2025
                        </h2>
                    </header>

                    {/* --- Section 2: Layout Tab Navigator --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        {/* Kolom Kiri: Daftar Tab (Navigasi Bab) */}
                        <aside className="lg:col-span-3 py-12 lg:py-16 border-b lg:border-b-0 lg:border-r border-zinc-200">
                            <div className="lg:sticky lg:top-24 px-4 lg:px-6">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-6">
                                    Daftar Isi
                                </h3>
                                <nav className="flex flex-col items-start gap-1">
                                    {chapters.map((chapter, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setActiveIndex(index)
                                            }
                                            className={`flex items-start gap-4 w-full text-left p-3 rounded-md transition-colors duration-200 ${
                                                activeIndex === index
                                                    ? "bg-zinc-100" // Latar belakang halus untuk tab aktif
                                                    : "hover:bg-zinc-50"
                                            }`}
                                        >
                                            <span
                                                className={`font-mono text-sm pt-1 ${
                                                    activeIndex === index
                                                        ? "text-[#173c94]"
                                                        : "text-zinc-400"
                                                }`}
                                            >
                                                BAB {chapter.number}
                                            </span>
                                            <span
                                                className={`font-semibold ${
                                                    activeIndex === index
                                                        ? "text-zinc-900"
                                                        : "text-zinc-600"
                                                }`}
                                            >
                                                {chapter.title}
                                            </span>
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </aside>

                        {/* Kolom Kanan: Panel Konten */}
                        <article className="lg:col-span-9 py-12 lg:py-16 px-5 lg:px-8">
                            <div
                                className="prose prose-zinc prose-lg max-w-none animate-fadeIn"
                                key={activeIndex}
                            >
                                {/* `key` di sini penting untuk memicu animasi saat komponen berganti */}
                                {ActiveComponent && <ActiveComponent />}
                            </div>
                        </article>
                    </div>
                </div>
            </main>
        </>
    );
}