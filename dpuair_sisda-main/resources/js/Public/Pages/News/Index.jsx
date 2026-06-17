import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Link, router, Head } from "@inertiajs/react";
import React, { useState } from "react";

const NewsIndex = ({ news, filters, categories }) => {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("public.news.index"),
            { search: searchTerm, category: filters.category, per_page: 15 },
            { preserveState: true, replace: true }
        );
    };

    const handleCategoryFilter = (categorySlug) => {
        router.get(
            route("public.news.index"),
            { search: filters.search, category: categorySlug, per_page: 15 },
            { preserveState: true, replace: true }
        );
    };

    const Pagination = ({ links }) => (
        <div className="flex justify-center items-center gap-2 mt-12">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || "#"}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`
                        inline-flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium transition-colors duration-300
                        ${
                            link.active
                                ? "text-gray-900 border-b-2 border-gray-900"
                                : link.url
                                ? "text-gray-400 hover:text-gray-900"
                                : "text-gray-300 cursor-not-allowed"
                        }
                    `}
                    disabled={!link.url}
                />
            ))}
        </div>
    );

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    return (
        <GuestLayout>
            <Head>
                <title>Berita & Kegiatan</title>
                <meta
                    name="description"
                    content="Jelajahi berita, informasi kegiatan, dan update terbaru seputar program, proyek, dan kebijakan dari Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur."
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
                            Berita & Kegiatan
                        </h1>
                        <div className="w-16 h-px bg-white mb-8"></div>
                        <p className="text-xl text-white/80 leading-relaxed">
                            Temukan berita, informasi kegiatan, dan update
                            terbaru seputar Dinas Sumber Daya Air Provinsi Jawa
                            Timur
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section - 2 Grid Layout */}
            <section className="py-16 bg-white">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Left: News List */}
                        <div className="lg:col-span-8">
                            {/* Search Bar */}
                            <div className="mb-8">
                                <form onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        placeholder="Cari berita..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors duration-300"
                                    />
                                </form>
                            </div>

                            {/* Results Count */}
                            {news.data.length > 0 && (
                                <div className="mb-8">
                                    <p className="text-gray-600">
                                        Menampilkan{" "}
                                        <span className="font-bold text-gray-900">
                                            {news.from}-{news.to}
                                        </span>{" "}
                                        dari{" "}
                                        <span className="font-bold text-gray-900">
                                            {news.total}
                                        </span>{" "}
                                        berita
                                    </p>
                                </div>
                            )}

                            {/* News List */}
                            {news.data.length > 0 ? (
                                <>
                                    <div className="space-y-8">
                                        {news.data.map((item, index) => (
                                            <article
                                                key={item.slug}
                                                className="border-b border-gray-200 last:border-b-0 pb-8 last:pb-0"
                                            >
                                                <Link
                                                    href={route(
                                                        "public.news.show",
                                                        {
                                                            article: item.slug,
                                                        }
                                                    )}
                                                    className="grid md:grid-cols-3 gap-6 group"
                                                >
                                                    {/* Image */}
                                                    <div className="md:col-span-1">
                                                        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                                                            <img
                                                                src={`/storage/${item.featured_image_path}`}
                                                                alt={item.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="md:col-span-2 space-y-3">
                                                        {/* Meta */}
                                                        <div className="text-sm text-gray-500">
                                                            {
                                                                item.category
                                                                    ?.name
                                                            }{" "}
                                                            •{" "}
                                                            {formatDate(
                                                                item.published_at
                                                            )}
                                                        </div>

                                                        {/* Title */}
                                                        <h2 className="text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2">
                                                            {item.title}
                                                        </h2>

                                                        {/* Excerpt */}
                                                        {item.excerpt && (
                                                            <p className="text-gray-600 leading-relaxed line-clamp-3">
                                                                {item.excerpt}
                                                            </p>
                                                        )}
                                                    </div>
                                                </Link>
                                            </article>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {news?.links && (
                                        <Pagination links={news.links} />
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        Tidak Ada Berita Ditemukan
                                    </h2>
                                    <p className="text-gray-600 mb-8">
                                        Coba ubah kata kunci pencarian atau
                                        kategori
                                    </p>
                                    <Link
                                        href={route("public.news.index")}
                                        className="inline-flex items-center group"
                                    >
                                        <span className="text-lg font-bold text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
                                            Lihat Semua Berita
                                        </span>
                                        <div className="ml-4 w-12 h-px bg-gray-900 group-hover:w-16 transition-all duration-300"></div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Right: Sidebar - Categories */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    Kategori
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() =>
                                            handleCategoryFilter(null)
                                        }
                                        className={`w-full text-left px-4 py-3 transition-colors duration-300 ${
                                            !filters.category
                                                ? "text-gray-900 font-bold border-l-2 border-gray-900"
                                                : "text-gray-600 hover:text-gray-900"
                                        }`}
                                    >
                                        Semua Kategori
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() =>
                                                handleCategoryFilter(cat.slug)
                                            }
                                            className={`w-full text-left px-4 py-3 transition-colors duration-300 ${
                                                filters.category === cat.slug
                                                    ? "text-gray-900 font-bold border-l-2 border-gray-900"
                                                    : "text-gray-600 hover:text-gray-900"
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
};

export default NewsIndex;
