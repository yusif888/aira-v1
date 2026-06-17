import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Link, Head } from "@inertiajs/react";
import { useState } from "react";

export default function DocumentShow({ entry, relatedDocuments = [] }) {
    const [iframeLoading, setIframeLoading] = useState(true);
    const [iframeError, setIframeError] = useState(false);

    const handleIframeLoad = () => {
        setIframeLoading(false);
        setIframeError(false);
    };

    const handleIframeError = () => {
        setIframeLoading(false);
        setIframeError(true);
    };

    const canPreview = (filePath) => {
        if (!filePath) return false;
        const extension = filePath.split(".").pop()?.toLowerCase();
        return ["pdf", "txt", "rtf"].includes(extension);
    };

    const getFileExtension = (filePath) => {
        if (!filePath) return "N/A";
        return filePath.split(".").pop()?.toUpperCase() || "N/A";
    };

    const getFileIcon = (filePath) => {
        if (!filePath) return "📄";
        const extension = filePath.split(".").pop()?.toLowerCase();

        const iconMap = {
            pdf: "📕",
            doc: "📘",
            docx: "📘",
            xls: "📗",
            xlsx: "📗",
            ppt: "📙",
            pptx: "📙",
            txt: "📝",
            rtf: "📝",
            zip: "🗜️",
            rar: "🗜️",
        };

        return iconMap[extension] || "📄";
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString("id-ID", options);
    };

    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = entry.title;

    return (
        <GuestLayout>
            <Head>
                <title>{`${entry.title} - Dinas PU SDA Jatim`}</title>
                <meta name="description" content={entry.description} />
            </Head>

            {/* Document Section */}
            <section className="py-16 bg-white">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Left: Document Content */}
                        <div className="lg:col-span-8">
                            <article>
                                {/* Meta */}
                                <div className="mb-6 text-sm text-gray-500">
                                    {entry.type?.category?.name} •{" "}
                                    {entry.type?.name} • Tahun {entry.year}
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                                    {entry.title}
                                </h1>

                                {/* Divider */}
                                <div className="w-16 h-px bg-gray-900 mb-8"></div>

                                {/* Document Number */}
                                {entry.document_number && (
                                    <div className="mb-8 p-4 bg-gray-50 border-l-4 border-gray-900">
                                        <p className="text-sm text-gray-500 mb-1">
                                            Nomor Dokumen
                                        </p>
                                        <p className="text-lg font-bold text-gray-900">
                                            {entry.document_number}
                                        </p>
                                    </div>
                                )}

                                {/* Description */}
                                {entry.description && (
                                    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-12">
                                        <p>{entry.description}</p>
                                    </div>
                                )}

                                {/* Document Preview */}
                                {entry.file_path && (
                                    <div className="mb-12">
                                        {canPreview(entry.file_path) ? (
                                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                {/* Preview Header */}
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-lg">
                                                            {getFileIcon(
                                                                entry.file_path
                                                            )}
                                                        </span>
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {getFileExtension(
                                                                entry.file_path
                                                            )}{" "}
                                                            Document
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <a
                                                            href={`/storage/${entry.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                                        >
                                                            Buka di Tab Baru
                                                        </a>
                                                    </div>
                                                </div>

                                                {/* Preview Content */}
                                                <div
                                                    className="relative bg-gray-100"
                                                    style={{ height: "70vh" }}
                                                >
                                                    {/* Loading State */}
                                                    {iframeLoading && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-white">
                                                            <div className="text-center">
                                                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
                                                                <p className="text-sm text-gray-600">
                                                                    Memuat
                                                                    dokumen...
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Error State */}
                                                    {iframeError && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-white">
                                                            <div className="text-center">
                                                                <p className="text-gray-800 font-medium mb-2">
                                                                    Gagal memuat
                                                                    preview
                                                                </p>
                                                                <p className="text-sm text-gray-600 mb-4">
                                                                    Dokumen
                                                                    tidak dapat
                                                                    ditampilkan
                                                                </p>
                                                                <button
                                                                    onClick={() => {
                                                                        setIframeLoading(
                                                                            true
                                                                        );
                                                                        setIframeError(
                                                                            false
                                                                        );
                                                                    }}
                                                                    className="text-sm text-gray-900 underline hover:no-underline"
                                                                >
                                                                    Coba lagi
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    <iframe
                                                        src={`/storage/${entry.file_path}#toolbar=1&navpanes=0&scrollbar=1`}
                                                        className="w-full h-full"
                                                        title="Preview Dokumen"
                                                        onLoad={
                                                            handleIframeLoad
                                                        }
                                                        onError={
                                                            handleIframeError
                                                        }
                                                        style={{
                                                            display:
                                                                iframeLoading ||
                                                                iframeError
                                                                    ? "none"
                                                                    : "block",
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="border border-gray-200 rounded-lg p-12 text-center bg-gray-50">
                                                <span className="text-4xl mb-4 block">
                                                    {getFileIcon(
                                                        entry.file_path
                                                    )}
                                                </span>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                    Preview Tidak Tersedia
                                                </h3>
                                                <p className="text-gray-600 mb-6">
                                                    File{" "}
                                                    {getFileExtension(
                                                        entry.file_path
                                                    )}{" "}
                                                    tidak dapat di-preview di
                                                    browser
                                                </p>
                                                <a
                                                    href={`/storage/${entry.file_path}`}
                                                    download
                                                    className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                                                >
                                                    <svg
                                                        className="w-5 h-5 mr-2"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                    Download File
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Tags */}
                                {entry.tags && entry.tags.length > 0 && (
                                    <div className="mt-12 pt-8 border-t border-gray-200">
                                        <h3 className="text-base font-bold text-gray-900 mb-4">
                                            Tags
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {entry.tags.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="text-sm px-3 py-1 bg-gray-100 text-gray-600"
                                                >
                                                    #{tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Share */}
                                <div className="mt-12 pt-8 border-t border-gray-200">
                                    <h3 className="text-base font-bold text-gray-900 mb-4">
                                        Bagikan
                                    </h3>
                                    <div className="flex gap-4">
                                        <a
                                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                                shareUrl
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                        </a>
                                        <a
                                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                                shareUrl
                                            )}&text=${encodeURIComponent(
                                                shareTitle
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                            </svg>
                                        </a>
                                        <a
                                            href={`https://wa.me/?text=${encodeURIComponent(
                                                shareTitle + " " + shareUrl
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-gray-900 transition-colors duration-300"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </article>
                        </div>

                        {/* Right: Sidebar */}
                        <div className="lg:col-span-4">
                            <div className="sticky top-24 space-y-8">
                                {/* Download Action */}
                                {entry.file_path && (
                                    <div>
                                        <h3 className="text-base font-bold text-gray-900 mb-4">
                                            Download
                                        </h3>
                                        <a
                                            href={`/storage/${entry.file_path}`}
                                            download
                                            className="flex items-center justify-center w-full px-6 py-4 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                                        >
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            Download Dokumen
                                        </a>
                                        <p className="text-sm text-gray-500 mt-2 text-center">
                                            Format:{" "}
                                            {getFileExtension(entry.file_path)}
                                        </p>
                                    </div>
                                )}

                                {/* Document Info */}
                                <div className="border-t border-gray-200 pt-8">
                                    <h3 className="text-base font-bold text-gray-900 mb-4">
                                        Informasi Dokumen
                                    </h3>
                                    <dl className="space-y-4">
                                        <div>
                                            <dt className="text-sm text-gray-500">
                                                Kategori
                                            </dt>
                                            <dd className="text-gray-900">
                                                {entry.type?.category?.name}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm text-gray-500">
                                                Jenis
                                            </dt>
                                            <dd className="text-gray-900">
                                                {entry.type?.name}
                                            </dd>
                                        </div>
                                        <div>
                                            <dt className="text-sm text-gray-500">
                                                Tahun
                                            </dt>
                                            <dd className="text-gray-900">
                                                {entry.year}
                                            </dd>
                                        </div>
                                        {entry.created_at && (
                                            <div>
                                                <dt className="text-sm text-gray-500">
                                                    Dipublikasi
                                                </dt>
                                                <dd className="text-gray-900">
                                                    {formatDate(
                                                        entry.created_at
                                                    )}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>

                                {/* Related Documents */}
                                {relatedDocuments &&
                                    relatedDocuments.length > 0 && (
                                        <div className="border-t border-gray-200 pt-8">
                                            <h3 className="text-base font-bold text-gray-900 mb-6">
                                                Dokumen Terkait
                                            </h3>
                                            <div className="space-y-6">
                                                {relatedDocuments.map(
                                                    (related) => (
                                                        <div
                                                            key={related.id}
                                                            className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0"
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "public.documents.show",
                                                                    {
                                                                        entry: related.slug,
                                                                    }
                                                                )}
                                                                className="group"
                                                            >
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-lg">
                                                                            {getFileIcon(
                                                                                related.file_path
                                                                            )}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500 uppercase">
                                                                            {getFileExtension(
                                                                                related.file_path
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                    <h4 className="text-base font-bold text-gray-900 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2">
                                                                        {
                                                                            related.title
                                                                        }
                                                                    </h4>
                                                                    <p className="text-sm text-gray-500">
                                                                        Tahun{" "}
                                                                        {
                                                                            related.year
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            {/* View All */}
                                            <div className="mt-6">
                                                <Link
                                                    href={route(
                                                        "public.documents.index"
                                                    )}
                                                    className="inline-flex items-center group"
                                                >
                                                    <span className="text-sm font-bold text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
                                                        Lihat Semua Dokumen
                                                    </span>
                                                    <div className="ml-3 w-8 h-px bg-gray-900 group-hover:w-12 transition-all duration-300"></div>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
