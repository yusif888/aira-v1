import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, router, useForm, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import EmptyState from "@/Admin/Components/EmptyState";
import FilterBar from "@/Admin/Components/FilterBar";
import Pagination from "@/Admin/Components/Pagination";
import {
    confirmPermanentDelete,
    showSuccessModal,
    showError,
    confirmEdit,
} from "@/Components/SweetAlert";
import { route } from "ziggy-js";

// Komponen Modal
const TagModal = ({
    show,
    onClose,
    title,
    onSubmit,
    submitText,
    formData,
    onInputChange,
    processing,
    errors,
}) => (
    <Modal show={show} onClose={onClose}>
        <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
            <form onSubmit={onSubmit}>
                <div className="mb-6">
                    <InputLabel htmlFor="name" value="Nama Tag" />
                    <TextInput
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={onInputChange}
                        className="mt-1 block w-full"
                        placeholder="Contoh: Mata Air"
                        required
                        autoFocus
                        maxLength={255}
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>
                <div className="flex items-center justify-end space-x-3">
                    <SecondaryButton
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                    >
                        Batal
                    </SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? "Menyimpan..." : submitText}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    </Modal>
);

// Komponen Tombol Aksi
const ActionButtons = ({ tag, onEdit, onDelete }) => {
    const documentCount = tag.documents_count || 0;
    return (
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onClick={() => onEdit(tag)}
                className="text-blue-600 hover:text-blue-800 p-1"
                title="Edit"
            >
                <i className="fas fa-edit text-xs"></i>
            </button>
            <button
                onClick={() => onDelete(tag)}
                className={`p-1 ${
                    documentCount > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 hover:text-red-800"
                }`}
                disabled={documentCount > 0}
                title={
                    documentCount > 0
                        ? "Tidak bisa dihapus karena digunakan oleh dokumen"
                        : "Hapus"
                }
            >
                <i className="fas fa-trash text-xs"></i>
            </button>
        </div>
    );
};

// Komponen Card Tag
const TagCard = ({ tag, index, tagColor, onEdit, onDelete }) => {
    const documentCount = tag.documents_count || 0;
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-lg hover:from-blue-50 hover:to-indigo-100 transition-all duration-200 group">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <div
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white shadow-sm flex-shrink-0 text-xs"
                        style={{ backgroundColor: tagColor }}
                    >
                        <i className="fas fa-tag"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            {tag.name}
                        </p>
                    </div>
                </div>
                <ActionButtons tag={tag} onEdit={onEdit} onDelete={onDelete} />
            </div>
            <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{documentCount} dokumen</span>
                {documentCount > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <i className="fas fa-lock mr-1"></i> Terlindungi
                    </span>
                )}
            </div>
        </div>
    );
};

// Komponen Utama Halaman Tags
export default function Tags({ auth, tags = [], filters = {} }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        search: filters?.search || "",
        per_page: filters?.per_page || "6",
        name: "",
    });

    const tagColors = [
        "#EF4444",
        "#F97316",
        "#F59E0B",
        "#EAB308",
        "#84CC16",
        "#22C55E",
        "#10B981",
        "#14B8A6",
        "#06B6D4",
        "#0EA5E9",
        "#3B82F6",
        "#6366F1",
        "#8B5CF6",
        "#A855F7",
        "#D946EF",
        "#EC4899",
        "#F43F5E",
        "#6B7280",
        "#374151",
        "#1F2937",
    ];

    const handleCreate = () => {
        reset();
        setShowCreateModal(true);
    };

    const handleInputChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleEdit = (tag) => {
        setSelectedTag(tag);
        setData("name", tag.name || "");
        clearErrors();
        setShowEditModal(true);
    };

    const handleDelete = (tagItem) => {
        confirmPermanentDelete(tagItem?.name, "tag").then((result) => {
            if (result.isConfirmed) {
                destroy(route("admin.documents.tags.destroy", tagItem.id), {
                    onSuccess: () => {
                        showSuccessModal(
                            tagItem?.name,
                            "berhasil dihapus",
                            "tag"
                        );
                    },
                    onError: (errors) => {
                        let errorMessage =
                            "Terjadi kesalahan saat menghapus tag.";
                        if (errors?.message) {
                            errorMessage = errors.message;
                        } else if (typeof errors === "string") {
                            errorMessage = errors;
                        } else if (errors?.error) {
                            errorMessage = errors.error;
                        }
                        showError(errorMessage, "Gagal Menghapus Tag!");
                    },
                });
            }
        });
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        reset();
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        reset();
    };

    const getTagColor = (index) => tagColors[index % tagColors.length];

    const submitCreate = (e) => {
        e.preventDefault();
        post(route("admin.documents.tags.store"), {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
                showSuccessModal(data.name, "berhasil ditambahkan", "tag");
                router.get(
                    route("admin.documents.tags"),
                    {},
                    {
                        preserveState: false,
                        preserveScroll: false,
                    }
                );
            },
            onError: (errors) => {
                let errorMessage = "Terjadi kesalahan saat menambahkan tag.";
                if (errors?.name) {
                    errorMessage = errors.name.includes("unique")
                        ? "Tag dengan nama ini sudah ada! Silakan gunakan nama yang berbeda."
                        : errors.name;
                } else if (errors?.message) {
                    errorMessage = errors.message;
                } else if (typeof errors === "string") {
                    errorMessage = errors;
                } else if (errors?.error) {
                    errorMessage = errors.error;
                }
                showError(errorMessage, "Gagal Menambahkan Tag!");
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        confirmEdit(selectedTag?.name, data.name, "tag").then((result) => {
            if (result.isConfirmed) {
                put(route("admin.documents.tags.update", selectedTag.id), {
                    onSuccess: () => {
                        setShowEditModal(false);
                        setSelectedTag(null);
                        reset();
                        showSuccessModal(
                            `${selectedTag?.name} berhasil diubah menjadi ${data.name}`,
                            "berhasil diubah",
                            "tag"
                        );
                        router.get(
                            route("admin.documents.tags"),
                            {},
                            {
                                preserveState: false,
                                preserveScroll: false,
                            }
                        );
                    },
                    onError: (errors) => {
                        let errorMessage =
                            "Terjadi kesalahan saat mengubah tag.";
                        if (errors?.name) {
                            errorMessage = errors.name.includes("unique")
                                ? "Tag dengan nama ini sudah ada! Silakan gunakan nama yang berbeda."
                                : errors.name;
                        } else if (errors?.message) {
                            errorMessage = errors.message;
                        } else if (typeof errors === "string") {
                            errorMessage = errors;
                        } else if (errors?.error) {
                            errorMessage = errors.error;
                        }
                        showError(errorMessage, "Gagal Mengubah Tag!");
                    },
                });
            }
        });
    };

    const tagsData = tags?.data || [];
    const hasProtectedTags = tagsData.some((tag) => tag.documents_count > 0);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tags Dokumen
                </h2>
            }
        >
            <Head title="Tags Dokumen" />
            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Manajemen Tags Dokumen
                                    </h2>
                                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                        <SecondaryButton
                                            onClick={() =>
                                                setShowFilters(!showFilters)
                                            }
                                            className="flex items-center gap-2"
                                        >
                                            <i
                                                className={`fas ${
                                                    showFilters
                                                        ? "fa-times"
                                                        : "fa-filter"
                                                }`}
                                            ></i>
                                            {showFilters
                                                ? "Sembunyikan Filter"
                                                : "Filter"}
                                        </SecondaryButton>
                                        <PrimaryButton
                                            onClick={handleCreate}
                                            className="whitespace-nowrap flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-colors duration-200"
                                        >
                                            <i className="fas fa-plus"></i>{" "}
                                            Tambah Tag
                                        </PrimaryButton>
                                    </div>
                                </div>

                                {showFilters && (
                                    <div className="filter-slide-in">
                                        <FilterBar
                                            variant="compact"
                                            gridCols="md:grid-cols-2"
                                            searchColSpan="md:col-span-1"
                                            filters={data}
                                            onFilterChange={(key, value) => {
                                                setData(key, value);
                                                router.get(
                                                    route(
                                                        "admin.documents.tags"
                                                    ),
                                                    { ...data, [key]: value },
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                        replace: true,
                                                    }
                                                );
                                            }}
                                            searchPlaceholder="Cari tags..."
                                            showPageSelector={true}
                                            pageSelectorOptions={[
                                                5, 10, 25, 50, 100,
                                            ]}
                                            showTotal={true}
                                            totalItems={tags.total || 0}
                                            itemLabel="tag"
                                        />
                                    </div>
                                )}

                                {/* Banner Tag */}
                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
                                    <div className="ml-3 flex-1">
                                        <div className="text-sm  text-blue-700">
                                            <p>
                                                Tag yang masih dipakai dokumen
                                                tidak bisa dihapus. Ditandai
                                                badge{" "}
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <i className="fas fa-lock mr-1"></i>{" "}
                                                    Terlindungi
                                                </span>
                                            </p>
                                            <div className="bg-white p-3 rounded border border-blue-200 mt-2">
                                                <p className="text-xs font-medium text-blue-800 mb-1">
                                                    <i className="fas fa-lightbulb text-yellow-500 mr-1"></i>
                                                    Cara menghapus:
                                                </p>
                                                <ul className="text-xs text-blue-700 list-disc pl-5">
                                                    <li>
                                                        Hapus semua dokumen yang
                                                        memakai tag
                                                    </li>
                                                    <li>
                                                        Atau ganti tag pada
                                                        dokumen
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {tagsData.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                                        {tagsData.map((tag, index) => (
                                            <TagCard
                                                key={tag.id}
                                                tag={tag}
                                                index={index}
                                                tagColor={getTagColor(index)}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {tagsData.length > 0 && (
                                        <div className="mt-6">
                                            <Pagination
                                                pagination={tags}
                                                showInfo={true}
                                                routeName="admin.documents.tags"
                                                filters={data}
                                            />
                                        </div>
                                    )}
                                </>
                            ) : data.search ? (
                                <EmptyState
                                    icon="fas fa-search"
                                    title="Tidak ditemukan"
                                    description={`Tidak ada tag yang cocok dengan "${data.search}".`}
                                    actionButton={
                                        <SecondaryButton
                                            onClick={() =>
                                                setData("search", "")
                                            }
                                        >
                                            <i className="fas fa-times mr-2"></i>
                                            Bersihkan Pencarian
                                        </SecondaryButton>
                                    }
                                />
                            ) : (
                                <EmptyState
                                    icon="fas fa-tags"
                                    title="Belum ada tag"
                                    description="Mulai dengan menambahkan tag pertama untuk membantu mengkategorikan dokumen Anda."
                                    actionButton={
                                        <PrimaryButton
                                            onClick={handleCreate}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            <i className="fas fa-plus mr-2"></i>{" "}
                                            Tambah Tag Pertama
                                        </PrimaryButton>
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <TagModal
                show={showCreateModal}
                onClose={closeCreateModal}
                title="Tambah Tag Baru"
                onSubmit={submitCreate}
                submitText="Simpan Tag"
                formData={data}
                onInputChange={handleInputChange}
                processing={processing}
                errors={errors}
            />

            <TagModal
                show={showEditModal}
                onClose={closeEditModal}
                title="Edit Tag"
                onSubmit={submitEdit}
                submitText="Update Tag"
                formData={data}
                onInputChange={handleInputChange}
                processing={processing}
                errors={errors}
            />
        </AuthenticatedLayout>
    );
}