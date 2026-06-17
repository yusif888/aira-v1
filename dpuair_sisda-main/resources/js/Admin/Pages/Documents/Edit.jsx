import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import { useState, useEffect } from "react";
import RequiredInputLabel from "@/Components/RequiredInputLabel";
import TagPicker from "@/Components/TagPicker";

export default function Edit({ auth, document, categories, types, tags }) {
    const { data, setData, post, processing, errors } = useForm({
        title: document.title || "",
        document_number: document.document_number || "",
        year: document.year || new Date().getFullYear(),
        description: document.description || "",
        category_id: document.type?.category?.id || "",
        type_id: document.type_id || "",
        tags: document.tags?.map((tag) => tag.id) || [],
        file_path: null,
        _method: "PUT", // Laravel method spoofing untuk update
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [currentFile, setCurrentFile] = useState(
        document.file_path
            ? {
                  name: document.file_path.split("/").pop(),
                  path: document.file_path,
                  size: document.file_size_formatted || "Unknown",
              }
            : null
    );

    // Filter types berdasarkan kategori yang dipilih
    useEffect(() => {
        if (data.category_id) {
            const filtered = types.filter(
                (type) => type.category_id == data.category_id
            );
            setFilteredTypes(filtered);
            // Reset type_id jika kategori berubah dan type tidak valid
            if (data.type_id && !filtered.find((t) => t.id == data.type_id)) {
                setData("type_id", "");
            }
        } else {
            setFilteredTypes([]);
            setData("type_id", "");
        }
    }, [data.category_id, types]);

    // Set initial category_id when component mounts
    useEffect(() => {
        if (document.type?.category?.id) {
            setData("category_id", document.type.category.id);
        }
    }, [document.type?.category?.id]);

    const handleChange = (e) => {
        const { name, type, value, checked, files } = e.target;
        if (type === "checkbox") {
            setData(name, checked);
        } else if (type === "file") {
            setData(name, files[0]);
            // Update current file preview
            if (files[0]) {
                setCurrentFile({
                    name: files[0].name,
                    path: URL.createObjectURL(files[0]),
                    size: (files[0].size / 1024 / 1024).toFixed(2) + " MB",
                });
            }
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
    };

    const submit = (e) => {
        e.preventDefault();

        // Client-side validation
        const errors = {};

        if (!data.title.trim()) {
            errors.title = "Judul dokumen wajib diisi";
        }

        if (!data.description.trim()) {
            errors.description = "Deskripsi dokumen wajib diisi";
        }

        if (!data.category_id) {
            errors.category_id = "Kategori wajib dipilih";
        }

        if (!data.type_id) {
            errors.type_id = "Tipe dokumen wajib dipilih";
        }

        if (!data.year) {
            errors.year = "Tahun dokumen wajib diisi";
        }

        if (!data.tags || data.tags.length === 0) {
            errors.tags = "Tags dokumen wajib dipilih minimal 1 tag";
        }

        // If there are validation errors, don't submit
        if (Object.keys(errors).length > 0) {
            console.error("Validation errors:", errors);
            setValidationErrors(errors);
            alert("Mohon lengkapi semua field yang wajib diisi!");
            return;
        }

        // Submit form
        post(route("admin.documents.update", document.id), {
            onSuccess: () => {
                // Success handling is done by Inertia
            },
            onError: (errors) => {
                setValidationErrors(errors);
            },
        });
    };

    const handleCancel = () => {
        router.get(route("admin.documents.index"));
    };

    const removeFile = () => {
        setData("file_path", null);
        setCurrentFile(null);
        if (validationErrors.file_path) {
            setValidationErrors((prev) => ({
                ...prev,
                file_path: null,
            }));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Dokumen
                </h2>
            }
        >
            <Head title="Edit Dokumen" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium">
                                    Edit Dokumen: {document.title}
                                </h3>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <RequiredInputLabel
                                        htmlFor="title"
                                        value="Judul Dokumen"
                                    />
                                    <TextInput
                                        id="title"
                                        name="title"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.title}
                                        onChange={handleChange}
                                        required
                                    />
                                    <InputError
                                        message={
                                            errors.title ||
                                            validationErrors.title
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Document Number */}
                                <div>
                                    <InputLabel
                                        htmlFor="document_number"
                                        value="Nomor Dokumen"
                                    />
                                    <TextInput
                                        id="document_number"
                                        name="document_number"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.document_number}
                                        onChange={handleChange}
                                        placeholder="Opsional - Nomor dokumen resmi"
                                    />
                                    <InputError
                                        message={
                                            errors.document_number ||
                                            validationErrors.document_number
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Category and Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Category */}
                                    <div>
                                        <RequiredInputLabel
                                            htmlFor="category_id"
                                            value="Kategori"
                                        />
                                        <select
                                            id="category_id"
                                            name="category_id"
                                            className="mt-1 block w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                                            value={data.category_id}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">
                                                Pilih Kategori
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={
                                                errors.category_id ||
                                                validationErrors.category_id
                                            }
                                            className="mt-2"
                                        />
                                    </div>

                                    {/* Type */}
                                    <div>
                                        <RequiredInputLabel
                                            htmlFor="type_id"
                                            value="Tipe Dokumen"
                                        />
                                        <select
                                            id="type_id"
                                            name="type_id"
                                            className="mt-1 block w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                                            value={data.type_id}
                                            onChange={handleChange}
                                            required
                                            disabled={!data.category_id}
                                        >
                                            <option value="">
                                                {data.category_id
                                                    ? "Pilih Tipe Dokumen"
                                                    : "Pilih Kategori dulu"}
                                            </option>
                                            {filteredTypes.map((type) => (
                                                <option
                                                    key={type.id}
                                                    value={type.id}
                                                >
                                                    {type.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={
                                                errors.type_id ||
                                                validationErrors.type_id
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                {/* Year */}
                                <div>
                                    <RequiredInputLabel
                                        htmlFor="year"
                                        value="Tahun Dokumen"
                                    />
                                    <select
                                        id="year"
                                        name="year"
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={data.year}
                                        onChange={handleChange}
                                        required
                                    >
                                        {Array.from({ length: 30 }, (_, i) => {
                                            const year =
                                                new Date().getFullYear() -
                                                15 +
                                                i;
                                            return (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <InputError
                                        message={
                                            errors.year || validationErrors.year
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <RequiredInputLabel
                                        htmlFor="description"
                                        value="Deskripsi Dokumen"
                                    />
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        value={data.description}
                                        onChange={handleChange}
                                        required
                                        maxLength={500}
                                        placeholder="Deskripsi singkat tentang dokumen ini..."
                                    />
                                    <div className="mt-1 text-sm text-gray-500 text-right">
                                        {data.description.length}/500 karakter
                                    </div>
                                    <InputError
                                        message={
                                            errors.description ||
                                            validationErrors.description
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Tags */}
                                <TagPicker
                                    label="Tags Dokumen"
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

                                {/* File Upload */}
                                <div>
                                    <InputLabel
                                        htmlFor="file_path"
                                        value="File Dokumen"
                                    />

                                    {/* Current File Display */}
                                    {currentFile && (
                                        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <i className="fas fa-file text-blue-500 text-lg"></i>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {currentFile.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Ukuran:{" "}
                                                            {currentFile.size}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeFile}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    <i className="fas fa-trash mr-1"></i>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* File Input */}
                                    <input
                                        id="file_path"
                                        name="file_path"
                                        type="file"
                                        className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        onChange={handleChange}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Format yang didukung: PDF, DOC, DOCX,
                                        XLS, XLSX, PPT, PPTX, TXT, RTF (Maksimal
                                        10MB)
                                    </p>
                                    <InputError
                                        message={
                                            errors.file_path ||
                                            validationErrors.file_path
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                {/* Form Actions */}
                                <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                                    <div className="flex gap-3">
                                        <SecondaryButton
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={processing}
                                        >
                                            Batal
                                        </SecondaryButton>
                                        <PrimaryButton
                                            type="submit"
                                            disabled={processing}
                                            className="flex items-center gap-2"
                                        >
                                            {processing ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin"></i>
                                                    Menyimpan...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save mr-2"></i>
                                                    Simpan Perubahan
                                                </>
                                            )}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
