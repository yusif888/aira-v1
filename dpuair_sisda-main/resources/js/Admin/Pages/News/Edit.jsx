import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Checkbox from "@/Components/Checkbox";
import RichTextEditor from "@/Components/RichTextEditor";
import RequiredInputLabel from "@/Components/RequiredInputLabel";
import TagPicker from "@/Components/TagPicker";
import { useState, useEffect, useRef, Suspense } from "react";
import { showLoading, showSuccessModal, showErrorModal, confirmEdit, confirmCancel, closeLoading } from "@/Components/SweetAlert";

export default function Edit({ auth, news, categories, tags, users }) {
    // State untuk validasi dan UI
    const [validationErrors, setValidationErrors] = useState({});
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const statusDropdownRef = useRef(null);
    const [preview, setPreview] = useState(null);

    // State untuk menyimpan data asli (backup)
    const [originalNews, setOriginalNews] = useState(null);

    // Helper functions yang lebih defensive
    const getCategoryId = () => {
        // Cek berbagai kemungkinan struktur data
        if (news?.category_id) return String(news.category_id);
        if (news?.category?.id) return String(news.category.id);
        if (originalNews?.category_id) return String(originalNews.category_id);
        return "";
    };

    const getTagsArray = () => {
        // Cek berbagai kemungkinan struktur data tags
        if (news?.tags && Array.isArray(news.tags) && news.tags.length > 0) {
            return news.tags.map((tag) => String(tag.id || tag));
        }
        if (originalNews?.tags && Array.isArray(originalNews.tags) && originalNews.tags.length > 0) {
            return originalNews.tags.map((tag) => String(tag.id || tag));
        }
        return [];
    };

    const getImageUrl = () => {
        if (news?.featured_image_url) return news.featured_image_url;
        if (news?.image_url) return news.image_url;
        if (news?.featured_image) return news.featured_image;
        if (originalNews?.featured_image_url)
            return originalNews.featured_image_url;
        return null;
    };

    // Initialize form dengan data yang dipastikan ada
    const { data, setData, post, processing, errors, reset } = useForm({
        title: news?.title || "",
        content: news?.content || "",
        category_id: getCategoryId(),
        author_id: news?.author_id || news?.user_id || "",
        status: news?.status || "draft",
        tags: getTagsArray(),
        excerpt: news?.excerpt || "",
        is_featured: Boolean(news?.is_featured),
        meta_title: news?.meta_title || news?.title || "",
        meta_description: news?.meta_description || news?.excerpt || "",
        featured_image_path: null,
        keep_existing_image: true,
        published_at: news?.published_at
            ? new Date(news.published_at).toISOString().slice(0, 16)
            : "",
        _method: "PUT",
    });

    // Effect untuk menyimpan data asli dan memastikan form terisi
    useEffect(() => {
        if (news && !originalNews) {
            setOriginalNews({ ...news });
        }

        // Set preview image
        const imageUrl = getImageUrl();
        if (imageUrl) {
            setPreview(imageUrl);
        }


        // FORCE UPDATE form data dengan nilai terbaru
        const categoryId = getCategoryId();
        const tagsArray = getTagsArray();

        if (categoryId || tagsArray.length > 0) {
            setData((prevData) => {
                const newData = {
                    ...prevData,
                    title: news?.title || prevData.title,
                    content: news?.content || prevData.content,
                    category_id: categoryId || prevData.category_id,
                    author_id:
                        news?.author_id || news?.user_id || prevData.author_id,
                    status: news?.status || prevData.status,
                    tags: tagsArray.length > 0 ? tagsArray : prevData.tags,
                    excerpt: news?.excerpt || prevData.excerpt,
                    is_featured: Boolean(news?.is_featured),
                    meta_title:
                        news?.meta_title || news?.title || prevData.meta_title,
                    meta_description:
                        news?.meta_description ||
                        news?.excerpt ||
                        prevData.meta_description,
                    featured_image_path: null,
                    keep_existing_image: true,
                    published_at: news?.published_at
                        ? new Date(news.published_at).toISOString().slice(0, 16)
                        : prevData.published_at,
                    _method: "PUT",
                };

                return newData;
            });
        }
    }, [news?.id, news?.updated_at]); // Trigger saat ID atau updated_at berubah

    // Effect khusus untuk memastikan kategori dan tags tidak kosong
    useEffect(() => {
        if (!data.category_id && news?.category_id) {
            setData("category_id", String(news.category_id));
        }
        if (data.tags.length === 0 && news?.tags && news.tags.length > 0) {
            setData(
                "tags",
                news.tags.map((tag) => String(tag.id || tag))
            );
        }
    }, [data.category_id, data.tags, news]);

    // Effect untuk memastikan tags tetap sinkron setelah refresh
    useEffect(() => {
        if (news?.tags && Array.isArray(news.tags) && news.tags.length > 0) {
            const tagIds = news.tags.map((tag) => String(tag.id || tag));
            if (JSON.stringify(tagIds) !== JSON.stringify(data.tags)) {
                setData("tags", tagIds);
            }
        }
    }, [news?.id, news?.updated_at]);


    const handleChange = (e) => {
        const { name, type, value, checked, files } = e.target;

        if (type === "checkbox") {
            setData(name, checked);
        } else if (type === "file") {
            if (files && files[0]) {
                setData(name, files[0]);
                setData("keep_existing_image", false);
                const previewUrl = URL.createObjectURL(files[0]);
                setPreview(previewUrl);
            } else {
                setData(name, null);
                setData("keep_existing_image", true);
                setPreview(getImageUrl());
            }
        } else {
            setData(name, value);
        }

        // Clear validation error
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

    const submit = (e) => {
        e.preventDefault();

        // Konfirmasi sebelum menyimpan
        confirmEdit(
            news?.title || "Berita",
            data.title || news?.title,
            "berita"
        ).then((result) => {
            if (result.isConfirmed) {
                // Proses penyimpanan jika user mengkonfirmasi
                processSave();
            }
        });
    };

    const processSave = () => {
        if (!news?.id) {
            showErrorModal("ID berita tidak ditemukan", "Error!");
            return;
        }

        // Client-side validation
        const errors = {};

        if (!data.title?.trim()) {
            errors.title = "Judul artikel wajib diisi";
        }

        if (!data.content?.trim()) {
            errors.content = "Konten artikel wajib diisi";
        }

        if (!data.category_id) {
            errors.category_id = "Kategori wajib dipilih";
        }

        if (!data.author_id) {
            errors.author_id = "Penulis artikel wajib dipilih";
        }

        if (!data.excerpt?.trim()) {
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

        if (!data.meta_title?.trim()) {
            errors.meta_title = "Judul SEO wajib diisi";
        }

        if (!data.meta_description?.trim()) {
            errors.meta_description = "Deskripsi SEO wajib diisi";
        }

        if (!data.tags || data.tags.length === 0) {
            errors.tags = "Tags artikel wajib dipilih minimal 1 tag";
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

        // Clear validation errors if validation passes
        setValidationErrors({});

        // Tampilkan loading SweetAlert
        showLoading("Menyimpan...", "Mohon tunggu, sedang menyimpan berita");

        // Submit menggunakan Inertia post
        post(route("admin.news.update", news.id), {
            preserveScroll: true,
            onSuccess: (page) => {
                console.log("Update successful:", page);

                // Tutup loading SweetAlert dan tampilkan sukses
                closeLoading();

                // Delay kecil untuk memastikan loading benar-benar ditutup
                setTimeout(() => {
                    showSuccessModal(
                        data.title || news?.title,
                        "berhasil diupdate dan disimpan",
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
                    showErrorModal("Terjadi kesalahan saat menyimpan berita.");
                }, 100);
            },
            onFinish: () => {
                console.log("Request finished");
                // Pastikan loading SweetAlert ditutup
                closeLoading();
            },
        });
    };

    const handleCancel = () => {
        confirmCancel(
            "Apakah Anda yakin ingin membatalkan? Perubahan yang belum disimpan akan hilang."
        ).then((result) => {
            if (result.isConfirmed) {
                router.visit(route("admin.news.index"), {
                    preserveState: false,
                    preserveScroll: false,
                });
            }
        });
    };

    // Manual fix untuk kategori kosong
    const fixEmptyCategory = () => {
        if (news?.category_id) {
            const categoryId = String(news.category_id);
            setData("category_id", categoryId);
            showSuccessModal(
                `ID: ${categoryId}`,
                "kategori diperbaiki",
                "kategori"
            );
        } else {
            showErrorModal("Tidak ada data kategori asli yang bisa digunakan");
        }
    };

    // Manual fix untuk tags kosong
    const fixEmptyTags = () => {
        if (news?.tags && news.tags.length > 0) {
            const tagIds = news.tags.map((tag) => String(tag.id || tag));
            setData("tags", tagIds);
            showSuccessModal(
                `${tagIds.length} tags`,
                "tags diperbaiki",
                "tags"
            );
        } else {
            showErrorModal("Tidak ada data tags asli yang bisa digunakan");
        }
    };

    // Get current selections for display
    const getCurrentCategory = () => {
        if (!data.category_id) return null;
        return categories?.find(
            (cat) => String(cat.id) === String(data.category_id)
        );
    };

    const currentCategory = getCurrentCategory();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Berita: {news?.title || "Untitled"}
                </h2>
            }
        >
            <Head title="Edit Berita" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* INFO */}
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <span className="font-semibold">
                                        Informasi:
                                    </span>{" "}
                                    Field yang ditandai dengan{" "}
                                    <span className="text-red-600 font-bold">
                                        *
                                    </span>{" "}
                                    wajib diisi.
                                </p>
                            </div>

                            <form
                                onSubmit={submit}
                                encType="multipart/form-data"
                            >
                                {/* TITLE */}
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
                                        className={`mt-1 block w-full ${
                                            validationErrors.title
                                                ? "border-red-500"
                                                : ""
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

                                {/* CONTENT */}
                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="content"
                                        value="Konten Artikel "
                                        required={true}
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
                                                    setData("content", value);
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

                                {/* CATEGORY */}
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
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 text-left px-3 py-2 ${
                                            validationErrors.category_id
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">
                                            -- Pilih Kategori --
                                        </option>
                                        {categories?.map((cat) => (
                                            <option
                                                key={cat.id}
                                                value={String(cat.id)}
                                            >
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="mt-1 text-sm text-gray-300">
                                        Terpilih:{" "}
                                        <strong>
                                            {currentCategory?.name ||
                                                "Belum dipilih"}
                                        </strong>
                                    </div>
                                    <InputError
                                        message={
                                            validationErrors.category_id ||
                                            errors.category_id
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* AUTHOR */}
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
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 text-left px-3 py-2 ${
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
                                                value={String(user.id)}
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

                                {/* EXCERPT */}
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
                                        className={`mt-1 block w-full border rounded-md px-3 py-2 ${
                                            validationErrors.excerpt
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        onChange={handleChange}
                                        placeholder="Ringkasan artikel..."
                                    />
                                    <div className="text-right text-sm text-gray-300">
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

                                {/* TAGS */}
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
                                        value="Status "
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
                                            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 text-left px-3 py-2 ${
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
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setData((prevData) => ({
                                                            ...prevData,
                                                            status: "draft",
                                                            published_at: "", // Clear published_at when changing to draft
                                                        }));
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
                                        )}
                                    </div>
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

                                {/* FEATURED */}
                                <div className="mb-4">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="is_featured"
                                            checked={data.is_featured}
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">
                                            Tandai sebagai Berita Unggulan
                                        </span>
                                    </label>
                                </div>

                                {/* SEO FIELDS */}
                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="meta_description"
                                        value="Judul SEO"
                                        required={true}
                                    />
                                    <TextInput
                                        id="meta_title"
                                        name="meta_title"
                                        value={data.meta_title}
                                        className="mt-1 block w-full"
                                        onChange={handleChange}
                                        placeholder="Judul untuk SEO..."
                                    />
                                    <InputError
                                        message={
                                            validationErrors.meta_title ||
                                            errors.meta_title
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="meta_description"
                                        value="Deskripsi SEO"
                                        required={true}
                                    />
                                    <textarea
                                        id="meta_description"
                                        name="meta_description"
                                        value={data.meta_description}
                                        rows={3}
                                        className="mt-1 block w-full border rounded-md px-3 py-2 border-gray-300"
                                        onChange={handleChange}
                                        placeholder="Deskripsi untuk SEO..."
                                    />
                                    <InputError
                                        message={
                                            validationErrors.meta_description ||
                                            errors.meta_description
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* IMAGE */}
                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor="featured_image_path"
                                        value="Gambar Artikel"
                                    />
                                    <input
                                        type="file"
                                        id="featured_image_path"
                                        name="featured_image_path"
                                        accept="image/*"
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={handleChange}
                                    />
                                    <div className="text-sm text-yellow-500 mt-1">
                                        Biarkan kosong jika tidak ingin mengubah
                                        gambar
                                    </div>
                                    {preview && (
                                        <div className="mt-3">
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-48 h-auto rounded border"
                                            />
                                            <p className="text-sm text-gray-600 mt-1">
                                                {data.featured_image_path
                                                    ? "Gambar baru dipilih"
                                                    : "Gambar saat ini"}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* SUBMIT */}
                                <div className="flex justify-end gap-2 mt-6">
                                    <SecondaryButton
                                        type="button"
                                        onClick={handleCancel}
                                    >
                                        Batal
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {processing
                                            ? "Menyimpan..."
                                            : "Update Berita"}
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
