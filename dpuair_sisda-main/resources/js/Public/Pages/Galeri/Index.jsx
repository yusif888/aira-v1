import { Head } from "@inertiajs/react";
import GuestLayout from "../../Layouts/GuestLayout";
import { useState } from "react";

export default function GaleriIndex() {
    const [selectedCategory, setSelectedCategory] = useState("semua");

    // Sample gallery data
    const galleryItems = [
        {
            id: 1,
            title: "Pembangunan Infrastruktur Irigasi",
            category: "infrastruktur",
            image: "/storage/gallery/gallery-1.jpg",
            description:
                "Proyek pembangunan jaringan irigasi untuk mendukung ketahanan pangan",
        },
        {
            id: 2,
            title: "Pengelolaan Waduk dan Bendungan",
            category: "infrastruktur",
            image: "/storage/gallery/gallery-2.jpg",
            description:
                "Operasi dan pemeliharaan waduk untuk penyediaan air baku",
        },
        {
            id: 3,
            title: "Konservasi Sumber Daya Air",
            category: "konservasi",
            image: "/storage/gallery/gallery-3.jpg",
            description: "Program pelestarian dan perlindungan sumber mata air",
        },
        {
            id: 4,
            title: "Pengendalian Banjir",
            category: "pengendalian",
            image: "/storage/gallery/gallery-4.jpg",
            description:
                "Pembangunan tanggul dan infrastruktur pengendali banjir",
        },
        {
            id: 5,
            title: "Pengamanan Pantai",
            category: "pengendalian",
            image: "/storage/gallery/gallery-5.jpg",
            description:
                "Proyek pembangunan bangunan pengaman pantai dari abrasi",
        },
        {
            id: 6,
            title: "Kegiatan Sosialisasi",
            category: "kegiatan",
            image: "/storage/gallery/gallery-6.jpg",
            description: "Sosialisasi program kepada masyarakat",
        },
    ];

    const categories = [
        { id: "semua", name: "Semua", count: galleryItems.length },
        {
            id: "infrastruktur",
            name: "Infrastruktur",
            count: galleryItems.filter(
                (item) => item.category === "infrastruktur"
            ).length,
        },
        {
            id: "konservasi",
            name: "Konservasi",
            count: galleryItems.filter((item) => item.category === "konservasi")
                .length,
        },
        {
            id: "pengendalian",
            name: "Pengendalian",
            count: galleryItems.filter(
                (item) => item.category === "pengendalian"
            ).length,
        },
        {
            id: "kegiatan",
            name: "Kegiatan",
            count: galleryItems.filter((item) => item.category === "kegiatan")
                .length,
        },
    ];

    const filteredItems =
        selectedCategory === "semua"
            ? galleryItems
            : galleryItems.filter((item) => item.category === selectedCategory);

    return (
        <GuestLayout>
            <Head>
                <title>Galeri</title>
                <meta
                    name="description"
                    content="Galeri foto kegiatan dan program Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur"
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Galeri
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Dokumentasi visual kegiatan dan program pengelolaan
                            sumber daya air di Provinsi Jawa Timur
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                                    selectedCategory === category.id
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md"
                                }`}
                            >
                                {category.name}
                                <span className="ml-2 text-xs opacity-75">
                                    ({category.count})
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 rounded-full backdrop-blur-sm">
                                            {
                                                categories.find(
                                                    (cat) =>
                                                        cat.id === item.category
                                                )?.name
                                            }
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredItems.length === 0 && (
                        <div className="text-center py-12">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-12 h-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Tidak ada foto
                            </h3>
                            <p className="text-gray-600">
                                Belum ada foto untuk kategori yang dipilih.
                            </p>
                        </div>
                    )}

                    {/* Info */}
                    <div className="mt-12 text-center">
                        <div className="bg-blue-50 rounded-xl p-6">
                            <p className="text-blue-800">
                                <strong>Informasi:</strong> Galeri ini
                                menampilkan dokumentasi kegiatan dan program
                                Dinas Pekerjaan Umum Sumber Daya Air Provinsi
                                Jawa Timur. Foto-foto akan terus diperbarui
                                seiring dengan berjalannya program dan kegiatan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
