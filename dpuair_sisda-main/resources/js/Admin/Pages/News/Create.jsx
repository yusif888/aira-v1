import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Checkbox from "@/Components/Checkbox";
import RichTextEditor from "@/Components/RichTextEditor";
import { useState, useEffect, useRef, Suspense } from "react";
import RequiredInputLabel from "@/Components/RequiredInputLabel";
import TagPicker from "@/Components/TagPicker";
import { showLoading, showSuccessModal, showErrorModal, confirmCancel, closeLoading } from "@/Components/SweetAlert";

export default function Create({ auth, categories, tags, users }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        content: "",
        category_id: "",
        tags: [],
        excerpt: "",
        status: "draft",
        is_featured: false,
        featured_image_path: null,
        published_at: "",
        author_id: auth.user.id, // Default to current user
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const statusDropdownRef = useRef(null);


    const handleChange = (e) => {
        const { name, type, value, checked, files } = e.target;
        if (type === "checkbox") {
            setData(name, checked);
        } else if (type === "file") {
            setData(name, files[0]);
        } else {
            setData(name, value);
        }

        // Clear validation error for this field when user starts typing
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }

        // Clear published_at when status changes to draft
        if (name === "status" && value === "draft") {
            setData((prevData) => ({
                ...prevData,
                status: value,
                published_at: "",
            }));
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                statusDropdownRef.current &&
                !statusDropdownRef.current.contains(event.target)
            ) {
                setStatusDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleCancel = () => {
        confirmCancel().then((result) => {
            if (result.isConfirmed) {
                router.visit(route("admin.news.index"), {
                    preserveState: false,
                    preserveScroll: false,
                });
            }
        });
    };

    const submit = (e) => {
        e.preventDefault();

        // Client-side validation
        const errors = {};

        if (!data.title.trim()) {
            errors.title = "Judul artikel wajib diisi";
        }

        if (!data.content.trim()) {
            errors.content = "Konten artikel wajib diisi";
        }

        if (!data.category_id) {
            errors.category_id = "Kategori wajib dipilih";
        }

        if (!data.author_id) {
            errors.author_id = "Penulis artikel wajib dipilih";
        }

        if (!data.excerpt.trim()) {
            errors.excerpt = "Ringkasan artikel wajib diisi";
        }

        if (!data.status) {
            errors.status = "Status wajib dipilih";
        }

        // Validasi published_at jika status adalah published
        if (data.status === "published" && !data.published_at.trim()) {
            errors.published_at =
                "Tanggal publish wajib diisi untuk artikel yang dipublikasikan";
        }

        if (!data.tags || data.tags.length === 0) {
            errors.tags = "Tags artikel wajib dipilih minimal 1 tag";
        }

        if (!data.featured_image_path) {
            errors.featured_image_path = "Gambar utama artikel wajib diupload";
        }

        // If there are validation errors, don't submit
        if (Object.keys(errors).length > 0) {
            console.error("Validation errors:", errors);
            setValidationErrors(errors);
            showErrorModal(
                "Mohon lengkapi semua field yang wajib diisi!",
                "Validasi Gagal!"
            );
            return;
        }

        // Tampilkan loading SweetAlert
        showLoading("Menyimpan...", "Mohon tunggu, sedang menyimpan berita");

        post(route("admin.news.store"), {
            forceFormData: true,
            onSuccess: () => {
                // Tutup loading SweetAlert dan tampilkan sukses
                closeLoading();

                // Delay kecil untuk memastikan loading benar-benar ditutup
                setTimeout(() => {
                    showSuccessModal(
                        data.title,
                        "berhasil ditambahkan",
                        "berita"
                    ).then(() => {
                        // Redirect ke halaman index setelah SweetAlert selesai
                        router.visit(route("admin.news.index"));
                    });
                }, 100);
            },
            onError: (errors) => {
                // Tutup loading SweetAlert
                closeLoading();

                // Delay kecil untuk memastikan loading benar-benar ditutup
                setTimeout(() => {
                    showErrorModal(
                        "Terjadi kesalahan saat menambahkan berita."
                    );
                }, 100);
            },
            onFinish: () => {
                closeLoading();
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tambah Berita Baru
                </h2>
            }
        >
            <Head title="Tambah Berita" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Info field wajib */}
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <span className="font-semibold">
                                        Informasi:
                                    </span>{" "}
                                    Field yang ditandai dengan{" "}
                                    <span className="text-red-600 font-bold">
                                        *
                                    </span>{" "}
                                    adalah field wajib yang harus diisi.
                                </p>
                            </div>

                            {/* Error message dari server */}
                            {errors.error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-800">
                                        <span className="font-semibold">
                                            Error:
                                        </span>{" "}
                                        {errors.error}
                                    </p>
                                </div>
                            )}

                            <form
                                onSubmit={submit}
                                encType="multipart/form-data"
                            >
                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="title"
                                        value="Judul Artikel "
                                        required={true}
                                    />
                                    <TextInput
                                        id="title"
                                        name="title"
                                        value={data.title}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                            validationErrors.title
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        onChange={handleChange}
                                        placeholder="Masukkan judul artikel..."
                                    />
                                    <InputError
                                        message={
                                            validationErrors.title ||
                                            errors.title
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor="content"
                                        value="Konten Artikel Lengkap *"
                                    />
                                    <div
                                        style={{
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "0.5rem",
                                            padding: "1rem",
                                            background: "#f9fafb",
                                        }}
                                    >
                                        <Suspense
                                            fallback={<div>Loading...</div>}
                                        >
                                            <RichTextEditor
                                                key={`rich-editor-${
                                                    data.content
                                                        ? "with-content"
                                                        : "empty"
                                                }`}
                                                value={data.content || ""}
                                                onChange={(value) => {
                                                    console.log(
                                                        "Content changed to:",
                                                        value
                                                    );
                                                    setData("content", value);
                                                    // Clear validation error
                                                    if (
                                                        validationErrors.content
                                                    ) {
                                                        setValidationErrors(
                                                            (prev) => ({
                                                                ...prev,
                                                                content: null,
                                                            })
                                                        );
                                                    }
                                                }}
                                                placeholder="Tulis konten artikel lengkap di sini..."
                                                height="200px"
                                            />
                                        </Suspense>
                                    </div>
                                    <InputError
                                        message={
                                            validationErrors.content ||
                                            errors.content
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="category_id"
                                        value="Kategori Artikel "
                                        required={true}
                                    />
                                    <select
                                        id="category_id"
                                        name="category_id"
                                        value={data.category_id}
                                        onChange={(e) => {
                                            setData(
                                                "category_id",
                                                e.target.value
                                            );
                                            // Clear validation error
                                            if (validationErrors.category_id) {
                                                setValidationErrors((prev) => ({
                                                    ...prev,
                                                    category_id: null,
                                                }));
                                            }
                                        }}
                                        className={`mt-1 block w-full rounded-md shadow-sm ${
                                            validationErrors.category_id
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">
                                            -- Pilih Kategori --
                                        </option>
                                        {categories?.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={
                                            validationErrors.category_id ||
                                            errors.category_id
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="author_id"
                                        value="Penulis Artikel "
                                        required={true}
                                    />
                                    <select
                                        id="author_id"
                                        name="author_id"
                                        value={data.author_id}
                                        onChange={(e) => {
                                            setData(
                                                "author_id",
                                                e.target.value
                                            );
                                            // Clear validation error
                                            if (validationErrors.author_id) {
                                                setValidationErrors((prev) => ({
                                                    ...prev,
                                                    author_id: null,
                                                }));
                                            }
                                        }}
                                        className={`mt-1 block w-full rounded-md shadow-sm ${
                                            validationErrors.author_id
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">
                                            -- Pilih Penulis --
                                        </option>
                                        {users?.map((user) => (
                                            <option
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name} ({user.email})
                                            </option>
                                        ))}
                                    </select>
                                    <div className="mt-1 text-sm text-gray-500">
                                        Pilih penulis yang akan tercantum
                                        sebagai author artikel ini
                                    </div>
                                    <InputError
                                        message={
                                            validationErrors.author_id ||
                                            errors.author_id
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="excerpt"
                                        value="Ringkasan Artikel "
                                        required={true}
                                    />
                                    <textarea
                                        id="excerpt"
                                        name="excerpt"
                                        value={data.excerpt}
                                        rows={3}
                                        maxLength={500}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                            validationErrors.excerpt
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        onChange={handleChange}
                                        placeholder="Ringkasan singkat artikel (maksimal 500 karakter)..."
                                    />
                                    <div className="mt-1 text-sm text-gray-500 text-right">
                                        {data.excerpt.length}/500 karakter
                                    </div>
                                    <InputError
                                        message={
                                            validationErrors.excerpt ||
                                            errors.excerpt
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <TagPicker
                                    label="Tags Artikel"
                                    required={true}
                                    tags={tags}
                                    selectedTags={data.tags}
                                    onTagsChange={(newTags) => {
                                        setData("tags", newTags);
                                        if (validationErrors.tags) {
                                            setValidationErrors((prev) => ({
                                                ...prev,
                                                tags: null,
                                            }));
                                        }
                                    }}
                                    validationErrors={validationErrors}
                                    errors={errors}
                                />

                                {/* DROPDOWN STATUS */}
                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="status"
                                        value="Status Publikasi Artikel "
                                        required={true}
                                    />
                                    <div
                                        className="relative"
                                        ref={statusDropdownRef}
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setStatusDropdownOpen(
                                                    !statusDropdownOpen
                                                )
                                            }
                                            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 text-left px-3 py-2 ${
                                                validationErrors.status
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    {data.status ===
                                                    "published" ? (
                                                        <>
                                                            <i className="fas fa-check-circle text-green-600 mr-2"></i>
                                                            <span className="text-green-800 font-medium">
                                                                Published
                                                            </span>
                                                        </>
                                                    ) : data.status ===
                                                      "draft" ? (
                                                        <>
                                                            <i className="fas fa-file text-yellow-600 mr-2"></i>
                                                            <span className="text-yellow-800 font-medium">
                                                                Draft
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-500">
                                                            -- Pilih Status --
                                                        </span>
                                                    )}
                                                </div>
                                                <i className="fas fa-chevron-down text-gray-400"></i>
                                            </div>
                                        </button>

                                        {statusDropdownOpen && (
                                            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
                                                <div className="py-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setData(
                                                                (prevData) => ({
                                                                    ...prevData,
                                                                    status: "draft",
                                                                    published_at:
                                                                        "", // Clear published_at when changing to draft
                                                                })
                                                            );
                                                            setStatusDropdownOpen(
                                                                false
                                                            );
                                                            // Clear validation errors
                                                            if (
                                                                validationErrors.status ||
                                                                validationErrors.published_at
                                                            ) {
                                                                setValidationErrors(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        status: null,
                                                                        published_at:
                                                                            null,
                                                                    })
                                                                );
                                                            }
                                                        }}
                                                        className="w-full text-left px-3 py-2 hover:bg-yellow-50 flex items-center"
                                                    >
                                                        <i className="fas fa-file text-yellow-600 mr-2"></i>
                                                        <span className="text-yellow-800">
                                                            Draft
                                                        </span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setData(
                                                                "status",
                                                                "published"
                                                            );
                                                            setStatusDropdownOpen(
                                                                false
                                                            );
                                                            // Clear validation errors
                                                            if (
                                                                validationErrors.status
                                                            ) {
                                                                setValidationErrors(
                                                                    (prev) => ({
                                                                        ...prev,
                                                                        status: null,
                                                                    })
                                                                );
                                                            }
                                                        }}
                                                        className="w-full text-left px-3 py-2 hover:bg-green-50 flex items-center"
                                                    >
                                                        <i className="fas fa-check-circle text-green-600 mr-2"></i>
                                                        <span className="text-green-800">
                                                            Published
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <InputError
                                        message={
                                            validationErrors.status ||
                                            errors.status
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* FIELD TANGGAL PUBLISH */}
                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="published_at"
                                        value="Tanggal Publish "
                                        required={data.status === "published"}
                                    />
                                    <TextInput
                                        id="published_at"
                                        name="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                            validationErrors.published_at
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        onChange={handleChange}
                                    />
                                    <div className="mt-1 text-sm text-gray-500">
                                        {data.status === "published" ? (
                                            <span className="text-red-600">
                                                * Wajib diisi untuk artikel yang
                                                dipublikasikan
                                            </span>
                                        ) : (
                                            <span>
                                                Opsional untuk draft. Pilih
                                                tanggal dan waktu kapan artikel
                                                akan dipublikasikan.
                                            </span>
                                        )}
                                    </div>
                                    <InputError
                                        message={
                                            validationErrors.published_at ||
                                            errors.published_at
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <InputLabel value="Fitur Berita" />
                                    <div className="mt-2">
                                        <label className="flex items-center">
                                            <Checkbox
                                                name="is_featured"
                                                checked={data.is_featured}
                                                onChange={handleChange}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">
                                                Tandai sebagai Berita Unggulan
                                                (Featured)
                                            </span>
                                        </label>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Berita unggulan akan ditampilkan di
                                            halaman utama dan mendapat prioritas
                                            tinggi
                                        </p>
                                    </div>
                                    <InputError
                                        message={errors.is_featured}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="featured_image_path"
                                        value="Gambar Utama Artikel (Thumbnail) "
                                        required={true}
                                    />
                                    <input
                                        type="file"
                                        id="featured_image_path"
                                        name="featured_image_path"
                                        accept="image/*"
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={handleChange}
                                    />
                                    <div className="mt-1 text-sm text-gray-500">
                                        Format: JPG, PNG, GIF.
                                    </div>
                                    <InputError
                                        message={
                                            validationErrors.featured_image_path ||
                                            errors.featured_image_path
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-end mt-6">
                                    <div className="text-sm text-gray-600 mr-4">
                                        Pastikan semua field wajib (*) telah
                                        diisi
                                    </div>
                                    <SecondaryButton
                                        type="button"
                                        onClick={handleCancel}
                                        className="mr-2"
                                    >
                                        Batal
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {processing
                                            ? "Menyimpan..."
                                            : "Simpan Berita"}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
