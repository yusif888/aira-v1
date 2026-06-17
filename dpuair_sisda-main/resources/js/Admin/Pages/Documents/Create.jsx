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
import { showError, confirmCreate, showSuccess } from "@/Components/SweetAlert";
// import { TagPicker } from "rsuite";

export default function Create({ auth, categories, types, tags }) {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        document_number: "",
        year: new Date().getFullYear(),
        description: "",
        type_id: "",
        tags: [],
        file_path: null,
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [filteredTypes, setFilteredTypes] = useState([]);

    // Filter types berdasarkan kategori yang dipilih
    useEffect(() => {
        if (data.category_id) {
            const filtered = types.filter(
                (type) => type.category_id == data.category_id
            );
            setFilteredTypes(filtered);
            // Reset type_id jika kategori berubah
            if (data.type_id && !filtered.find((t) => t.id == data.type_id)) {
                setData("type_id", "");
            }
        } else {
            setFilteredTypes([]);
            setData("type_id", "");
        }
    }, [data.category_id, types]);

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

        if (!data.file_path) {
            errors.file_path = "File dokumen wajib diupload";
        }

        // If there are validation errors, don't submit
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            showError('Mohon lengkapi semua field yang wajib diisi!', 'Validasi Gagal');
            return;
        }

        // Clear validation errors if validation passes
        setValidationErrors({});

        // Show confirmation dialog
        confirmCreate(data.title, 'dokumen').then((result) => {
            if (result.isConfirmed) {
                post(route("admin.documents.store"), {
                    forceFormData: true,
                    onSuccess: () => {
                        showSuccess(data.title, 'berhasil disimpan', 'dokumen');
                    },
                    onError: (errors) => {
                        showError('Terjadi kesalahan saat menyimpan dokumen.', 'Gagal!');
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tambah Dokumen Baru
                </h2>
            }
        >
            <Head title="Tambah Dokumen" />

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
                                        value="Judul Dokumen "
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
                                        placeholder="Masukkan judul dokumen..."
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
                                        htmlFor="document_number"
                                        value="Nomor Dokumen"
                                    />
                                    <TextInput
                                        id="document_number"
                                        name="document_number"
                                        value={data.document_number}
                                        className="mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300"
                                        onChange={handleChange}
                                        placeholder="Nomor dokumen (opsional)..."
                                    />
                                    <InputError
                                        message={errors.document_number}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="year"
                                        value="Tahun Dokumen "
                                        required={true}
                                    />
                                    <select
                                        id="year"
                                        name="year"
                                        value={data.year}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full rounded-md shadow-sm ${
                                            validationErrors.year
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                    >
                                        <option value="">
                                            -- Pilih Tahun --
                                        </option>
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
                                            validationErrors.year || errors.year
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="description"
                                        value="Deskripsi Dokumen "
                                        required={true}
                                    />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        rows={3}
                                        maxLength={500}
                                        className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                            validationErrors.description
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        onChange={handleChange}
                                        placeholder="Deskripsi singkat dokumen (maksimal 500 karakter)..."
                                    />
                                    <div className="mt-1 text-sm text-gray-500 text-right">
                                        {data.description.length}/500 karakter
                                    </div>
                                    <InputError
                                        message={
                                            validationErrors.description ||
                                            errors.description
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4 flex gap-6">
                                    {/* Kategori Dokumen */}
                                    <div className="w-1/2">
                                        <RequiredInputLabel
                                            htmlFor="category_id"
                                            value="Kategori Dokumen "
                                            required={true}
                                        />
                                        <select
                                            id="category_id"
                                            name="category_id"
                                            value={data.category_id}
                                            onChange={handleChange}
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
                                                <option
                                                    key={cat.id}
                                                    value={cat.id}
                                                >
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

                                    {/* Jenis Dokumen */}
                                    <div className="w-1/2">
                                        <RequiredInputLabel
                                            htmlFor="type_id"
                                            value="Tipe Dokumen "
                                            required={true}
                                        />
                                        <select
                                            id="type_id"
                                            name="type_id"
                                            value={data.type_id}
                                            onChange={handleChange}
                                            disabled={!data.category_id}
                                            className={`mt-1 block w-full rounded-md shadow-sm ${
                                                validationErrors.type_id
                                                    ? "border-red-500"
                                                    : "border-gray-300"
                                            } ${
                                                !data.category_id
                                                    ? "bg-gray-100"
                                                    : ""
                                            }`}
                                        >
                                            <option value="">
                                                {data.category_id
                                                    ? "-- Pilih Tipe Dokumen --"
                                                    : "-- Pilih kategori terlebih dahulu --"}
                                            </option>
                                            {filteredTypes?.map((type) => (
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
                                                validationErrors.type_id ||
                                                errors.type_id
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

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

                                <div className="mb-4">
                                    <RequiredInputLabel
                                        htmlFor="file_path"
                                        value="File Dokumen "
                                        required={true}
                                    />
                                    <input
                                        type="file"
                                        id="file_path"
                                        name="file_path"
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                                        className={`mt-1 block w-full border rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                                            validationErrors.file_path
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        onChange={handleChange}
                                    />
                                    <InputError
                                        message={
                                            validationErrors.file_path ||
                                            errors.file_path
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
                                        onClick={() =>
                                            router.visit(
                                                route("admin.documents.index")
                                            )
                                        }
                                        className="mr-2"
                                    >
                                        Batal
                                    </SecondaryButton>
                                    <PrimaryButton disabled={processing}>
                                        {processing
                                            ? "Menyimpan..."
                                            : "Simpan Dokumen"}
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
