import GuestLayout from "@/Public/Layouts/GuestLayout";
import { router, Link, usePage, Head } from "@inertiajs/react";
import { useMemo, useState } from "react";

export default function DocumentIndex({
    entries,
    filters,
    categories,
    types,
    tags,
}) {
    const [localFilters, setLocalFilters] = useState({
        search: filters?.search ?? "",
        category_id: filters?.category_id ?? "",
        type_id: filters?.type_id ?? "",
        year: filters?.year ?? "",
        tag: filters?.tag ?? "",
    });

    const years = useMemo(() => {
        const current = new Date().getFullYear();
        const out = [];
        for (let y = current; y >= current - 20; y -= 1) out.push(y);
        return out;
    }, []);

    const applyFilters = (e) => {
        e.preventDefault();
        const params = Object.fromEntries(
            Object.entries(localFilters).filter(
                ([_, v]) => v !== "" && v !== null
            )
        );
        router.get(route("public.documents.index"), params, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const clearFilters = () => {
        setLocalFilters({
            search: "",
            category_id: "",
            type_id: "",
            year: "",
            tag: "",
        });
        router.get(
            route("public.documents.index"),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const Pagination = ({ links }) => (
        <div className="flex justify-center items-center gap-2 mt-12">
            {links.map((link, index) => {
                const isFirst = index === 0;
                const isLast = index === links.length - 1;

                return (
                    <Link
                        key={index}
                        href={link.url || "#"}
                        preserveState
                        preserveScroll
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
                );
            })}
        </div>
    );

    return (
        <GuestLayout>
            <Head>
                <title>Dokumen</title>
                <meta
                    name="description"
                    content="Pusat unduhan dokumen resmi, peraturan, laporan, dan regulasi terkini terkait pengelolaan Sumber Daya Air di Provinsi Jawa Timur."
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
                            Dokumen
                        </h1>
                        <div className="w-16 h-px bg-white mb-8"></div>
                        <p className="text-xl text-white/80 leading-relaxed">
                            Temukan dokumen resmi, peraturan, dan regulasi
                            terkini terkait pengelolaan SDA Jawa Timur
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section - 2 Grid Layout */}
            <section className="py-16 bg-white">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Left: Document List */}
                        <div className="lg:col-span-8">
                            {/* Search Bar */}
                            <div className="mb-8">
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900 transition-colors duration-300"
                                    placeholder="Cari dokumen..."
                                    value={localFilters.search}
                                    onChange={(e) =>
                                        setLocalFilters((f) => ({
                                            ...f,
                                            search: e.target.value,
                                        }))
                                    }
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") applyFilters(e);
                                    }}
                                />
                            </div>

                            {/* Results Count */}
                            <div className="mb-8">
                                <p className="text-gray-600">
                                    Ditemukan{" "}
                                    <span className="font-bold text-gray-900">
                                        {entries?.total}
                                    </span>{" "}
                                    dokumen
                                </p>
                            </div>

                            {/* Document List */}
                            {entries.data.length > 0 ? (
                                <>
                                    <div className="space-y-6">
                                        {entries?.data?.map((e, index) => (
                                            <a
                                                key={e.id}
                                                href={route(
                                                    "public.documents.show",
                                                    e.id
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-start gap-6 border-b border-gray-200 last:border-b-0 pb-6 last:pb-0 group"
                                            >
                                                {/* Number */}
                                                <div className="flex-shrink-0 w-8 text-center">
                                                    <span className="text-lg font-bold text-gray-400 group-hover:text-gray-900 transition-colors duration-300">
                                                        {index + 1}.
                                                    </span>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0 space-y-2">
                                                    {/* Title */}
                                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
                                                        {e.title}
                                                    </h2>

                                                    {/* Meta */}
                                                    <div className="text-sm text-gray-500">
                                                        {e.type?.category?.name}{" "}
                                                        • {e.type?.name}
                                                        {e.document_number &&
                                                            ` • No: ${e.document_number}`}
                                                        {e.year &&
                                                            ` • ${e.year}`}
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {entries?.links && (
                                        <Pagination links={entries.links} />
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        Tidak Ada Dokumen Ditemukan
                                    </h2>
                                    <p className="text-gray-600 mb-8">
                                        Coba ubah kata kunci pencarian atau
                                        filter
                                    </p>
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center group"
                                    >
                                        <span className="text-lg font-bold text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
                                            Reset Filter
                                        </span>
                                        <div className="ml-4 w-12 h-px bg-gray-900 group-hover:w-16 transition-all duration-300"></div>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right: Sidebar - Categories & Filters */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-8">
                                {/* Categories */}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                                        Kategori
                                    </h3>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => {
                                                setLocalFilters((f) => ({
                                                    ...f,
                                                    category_id: "",
                                                    type_id: "",
                                                }));
                                                router.get(
                                                    route(
                                                        "public.documents.index"
                                                    ),
                                                    {
                                                        ...localFilters,
                                                        category_id: "",
                                                        type_id: "",
                                                    },
                                                    {
                                                        preserveScroll: true,
                                                        preserveState: true,
                                                    }
                                                );
                                            }}
                                            className={`w-full text-left px-4 py-3 transition-colors duration-300 ${
                                                !localFilters.category_id
                                                    ? "text-gray-900 font-bold border-l-2 border-gray-900"
                                                    : "text-gray-600 hover:text-gray-900"
                                            }`}
                                        >
                                            Semua Kategori
                                        </button>
                                        {categories?.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => {
                                                    setLocalFilters((f) => ({
                                                        ...f,
                                                        category_id: String(
                                                            c.id
                                                        ),
                                                        type_id: "",
                                                    }));
                                                    router.get(
                                                        route(
                                                            "public.documents.index"
                                                        ),
                                                        {
                                                            ...localFilters,
                                                            category_id: String(
                                                                c.id
                                                            ),
                                                            type_id: "",
                                                        },
                                                        {
                                                            preserveScroll: true,
                                                            preserveState: true,
                                                        }
                                                    );
                                                }}
                                                className={`w-full text-left px-4 py-3 transition-colors duration-300 ${
                                                    String(
                                                        localFilters.category_id
                                                    ) === String(c.id)
                                                        ? "text-gray-900 font-bold border-l-2 border-gray-900"
                                                        : "text-gray-600 hover:text-gray-900"
                                                }`}
                                            >
                                                {c.name}
                                            </button>
                                        ))}
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
