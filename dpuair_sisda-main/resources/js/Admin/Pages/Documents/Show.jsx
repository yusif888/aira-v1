import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { useState } from "react";

export default function Show({ auth, document }) {
    const [iframeLoading, setIframeLoading] = useState(true);
    const [iframeError, setIframeError] = useState(false);

    // Debug: log document data
    console.log("Document data:", document);
    console.log("File path:", document?.file_path);

    const handleDownload = () => {
        if (!document.file_path) {
            alert("File tidak tersedia untuk di-download");
            return;
        }

        try {
            const fileUrl = `/storage/${document.file_path}`;
            const fileName =
                document.file_path.split("/").pop() || document.title;

            console.log("Attempting download:", fileUrl);
            console.log("File name:", fileName);

            // Method 1: Fetch API untuk download yang lebih robust
            fetch(fileUrl)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        );
                    }
                    return response.blob();
                })
                .then((blob) => {
                    // Buat URL untuk blob
                    const url = window.URL.createObjectURL(blob);

                    // Buat link download
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = fileName;

                    // Trigger download
                    document.body.appendChild(link);
                    link.click();

                    // Cleanup
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);

                    console.log("Download completed successfully");
                })
                .catch((error) => {
                    console.error("Fetch download error:", error);

                    // Fallback: window.open
                    console.log("Trying fallback method: window.open");
                    window.open(fileUrl, "_blank");
                });
        } catch (error) {
            console.error("Download error:", error);
            alert("Gagal mengunduh file. Silakan coba buka file di tab baru.");
        }
    };

    const handleIframeLoad = () => {
        setIframeLoading(false);
        setIframeError(false);
    };

    const handleIframeError = () => {
        setIframeLoading(false);
        setIframeError(true);
    };

    const getFileIcon = (filePath) => {
        if (!filePath) return "fas fa-file";

        const extension = filePath.split(".").pop()?.toLowerCase();
        switch (extension) {
            case "pdf":
                return "fas fa-file-pdf text-red-600";
            case "doc":
            case "docx":
                return "fas fa-file-word text-blue-600";
            case "xls":
            case "xlsx":
                return "fas fa-file-excel text-green-600";
            case "ppt":
            case "pptx":
                return "fas fa-file-powerpoint text-orange-600";
            case "txt":
                return "fas fa-file-alt text-gray-600";
            default:
                return "fas fa-file text-gray-600";
        }
    };

    const getFileSize = (filePath) => {
        // Gunakan file size dari backend jika tersedia
        if (document.file_size_formatted) {
            return document.file_size_formatted;
        }
        return "File tersedia";
    };

    const canPreview = (filePath) => {
        if (!filePath) return false;
        const extension = filePath.split(".").pop()?.toLowerCase();
        // Hanya file yang bisa di-preview di browser
        return ["pdf", "txt", "rtf"].includes(extension);
    };

    const getPreviewMessage = (filePath) => {
        if (!filePath) return "";
        const extension = filePath.split(".").pop()?.toLowerCase();

        if (["pdf", "txt", "rtf"].includes(extension)) {
            return "Dokumen dapat di-preview langsung di browser";
        } else if (
            ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)
        ) {
            return "Dokumen tidak dapat di-preview. Silakan download untuk membuka.";
        } else {
            return "Format file tidak dikenali";
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail Dokumen
                </h2>
            }
        >
            <Head title={`Detail Dokumen - ${document.title}`} />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header dengan tombol aksi */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {document.title}
                                    </h1>
                                    {document.document_number && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Nomor: {document.document_number}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <SecondaryButton
                                        onClick={() =>
                                            router.visit(
                                                route(
                                                    "admin.documents.edit",
                                                    document.id
                                                )
                                            )
                                        }
                                    >
                                        <i className="fas fa-edit mr-2"></i>
                                        Edit
                                    </SecondaryButton>
                                    {document.file_path && (
                                        <PrimaryButton onClick={handleDownload}>
                                            <i className="fas fa-download mr-2"></i>
                                            Download
                                        </PrimaryButton>
                                    )}
                                </div>
                            </div>

                            {/* Informasi dokumen */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Tahun
                                        </h3>
                                        <p className="text-sm text-gray-900">
                                            {document.year}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Kategori
                                        </h3>
                                        <p className="text-sm text-gray-900">
                                            {document.type?.category?.name ||
                                                "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Jenis Dokumen
                                        </h3>
                                        <p className="text-sm text-gray-900">
                                            {document.type?.name || "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Uploader
                                        </h3>
                                        <p className="text-sm text-gray-900">
                                            {document.uploader?.name || "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Tanggal Upload
                                        </h3>
                                        <p className="text-sm text-gray-900">
                                            {document.created_at
                                                ? new Date(
                                                      document.created_at
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          year: "numeric",
                                                          month: "long",
                                                          day: "numeric",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      }
                                                  )
                                                : "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Terakhir Diupdate
                                        </h3>
                                        <p className="text-sm text-gray-900">
                                            {document.updated_at
                                                ? new Date(
                                                      document.updated_at
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          year: "numeric",
                                                          month: "long",
                                                          day: "numeric",
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                      }
                                                  )
                                                : "-"}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">
                                            Tags
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {document.tags &&
                                            document.tags.length > 0 ? (
                                                document.tags.map((tag) => (
                                                    <span
                                                        key={tag.id}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                    >
                                                        {tag.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-gray-500">
                                                    Tidak ada tags
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Deskripsi */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">
                                    Deskripsi
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-900">
                                        {document.description ||
                                            "Tidak ada deskripsi"}
                                    </p>
                                </div>
                            </div>

                            {/* File Info */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">
                                    File Dokumen
                                </h3>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                                    <div className="flex items-center space-x-3">
                                        <i
                                            className={`${getFileIcon(
                                                document.file_path
                                            )} text-2xl`}
                                        ></i>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {document.file_path
                                                    ? document.file_path
                                                          .split("/")
                                                          .pop()
                                                    : "File tidak tersedia"}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {getFileSize(
                                                    document.file_path
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preview Dokumen */}
                            {document.file_path && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Preview Dokumen
                                    </h4>
                                    <p className="text-xs text-gray-600 mb-3">
                                        {getPreviewMessage(document.file_path)}
                                    </p>
                                    {canPreview(document.file_path) ? (
                                        <div className="aspect-[3/4] h-[70vh] w-full bg-gray-100 rounded border overflow-hidden relative">
                                            {/* Loading State */}
                                            {iframeLoading && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                    <div className="text-center">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                                        <p className="text-sm text-gray-600">
                                                            Memuat dokumen...
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Error State */}
                                            {iframeError && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                    <div className="text-center">
                                                        <i className="fas fa-exclamation-triangle text-4xl text-yellow-500 mb-2"></i>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            Gagal memuat preview
                                                            dokumen
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
                                                            className="text-blue-600 hover:text-blue-800 text-sm"
                                                        >
                                                            Coba lagi
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <iframe
                                                src={`/storage/${document.file_path}#toolbar=1&navpanes=0&scrollbar=1`}
                                                className="w-full h-[70vh]"
                                                title="Preview Dokumen"
                                                onLoad={handleIframeLoad}
                                                onError={handleIframeError}
                                                style={{
                                                    display:
                                                        iframeLoading ||
                                                        iframeError
                                                            ? "none"
                                                            : "block",
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-gray-50 p-6 rounded-lg border text-center">
                                            <i className="fas fa-file-alt text-4xl text-gray-400 mb-3"></i>
                                            <p className="text-sm text-gray-600 mb-2">
                                                File ini tidak dapat di-preview
                                                langsung di browser
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Silakan download file untuk
                                                membuka dengan aplikasi yang
                                                sesuai
                                            </p>
                                        </div>
                                    )}
                                    <div className="mt-3">
                                        <a
                                            href={`/storage/${document.file_path}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-700 hover:text-blue-800 text-sm"
                                        >
                                            <i className="fas fa-external-link-alt mr-1"></i>
                                            Buka di tab baru
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Tombol kembali */}
                            <div className="flex justify-end">
                                <SecondaryButton
                                    onClick={() =>
                                        router.visit(
                                            route("admin.documents.index")
                                        )
                                    }
                                >
                                    <i className="fas fa-arrow-left mr-2"></i>
                                    Kembali ke Daftar
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
