import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, useForm, router, Link, usePage } from "@inertiajs/react";
import EmptyState from "@/Admin/Components/EmptyState";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import ModalForm from "@/Admin/Components/ModalForm";
import FilterBar from "@/Admin/Components/FilterBar";
import DataCard, { DataCardGrid } from "@/Admin/Components/DataCard";
import { showSuccessModal, showErrorModal, confirmPermanentDelete, confirmEdit } from "@/Components/SweetAlert";
import Pagination from "@/Admin/Components/Pagination";

export default function Tags({ auth, tags = [], filters = {} }) {
    const pageProps = usePage().props;
    const flash = pageProps?.flash || {};
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
    } = useForm({
        name: "",
        description: "",
    });

    // State untuk search input yang terpisah dari filters
    const [searchInput, setSearchInput] = useState(filters?.search || "");
    // State untuk per_page yang terpisah dari filters
    const [perPageInput, setPerPageInput] = useState(filters?.per_page || "10");

    // Sinkronisasi state dengan filters dari backend
    React.useEffect(() => {
        setSearchInput(filters.search || "");
        setPerPageInput(filters.per_page || "10");
    }, [filters.search, filters.per_page]);

    // Handle search dengan debounce
    React.useEffect(() => {
        if (!searchInput && !filters.search) return;
        if (searchInput === filters.search) return;

        const timeoutId = setTimeout(() => {
            router.get(
                route("admin.news.tags"),
                { ...filters, search: searchInput, per_page: perPageInput },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchInput]);

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

    const displayTags = tags.data || [];
    const filteredTags = displayTags;

    const getTagColor = (index) => tagColors[index % tagColors.length];

    const checkSlugDuplicate = (name, excludeId = null) => {
        if (!name) return false;

        const newSlug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        return (
            tags.data?.some((tag) => {
                if (excludeId && tag.id === excludeId) return false;
                return tag.slug === newSlug;
            }) || false
        );
    };

    // Custom setFormData untuk ModalForm dengan validasi real-time
    const handleFormDataChange = (name, value) => {
        setData(name, value);

        // Validasi real-time untuk field name
        if (name === "name" && value) {
            const isEdit = showEditModal;
            const isDuplicate = checkSlugDuplicate(
                value,
                isEdit ? selectedTag?.id : null
            );
            if (isDuplicate) {
                setData("slugError", "Tag dengan nama ini sudah ada!");
            } else {
                setData("slugError", "");
            }
        }
    };

    // Handle flash messages
    React.useEffect(() => {
        if (flash?.success) {
            showSuccessModal("", flash.success, "item");
        }

        if (flash?.error) {
            showErrorModal(flash.error);
        }
    }, [flash]);

    const handleCreate = () => {
        setShowCreateModal(true);
        setData("slugError", "");
        reset();
    };

    const handleEdit = (tag) => {
        setSelectedTag(tag);
        setData("name", tag.name || "");
        setData("slugError", "");
        setShowEditModal(true);
    };

    const handleDelete = (tagItem) => {
        confirmPermanentDelete(tagItem?.name, "tag").then((result) => {
            if (result.isConfirmed) {
                destroy(route("admin.news.tags.destroy", tagItem.id), {
                    onSuccess: () => {
                        showSuccessModal(tagItem?.name, "berhasil dihapus", "tag");

                        router.get(
                            route("admin.news.tags"),
                            {},
                            {
                                preserveState: false,
                                preserveScroll: false,
                            }
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

                        showErrorModal(errorMessage, "Gagal Menghapus Tag!");
                    },
                });
            }
        });
    };

    const submitCreate = (e) => {
        e.preventDefault();

        if (data.slugError) {
            return;
        }

        post(route("admin.news.tags.store"), {
            onSuccess: () => {
                setShowCreateModal(false);
                setData("slugError", "");
                reset();

                showSuccessModal("", "Tag berhasil ditambahkan", "tag");

                router.get(
                    route("admin.news.tags"),
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
                    if (errors.name.includes("unique")) {
                        errorMessage =
                            "Tag dengan nama ini sudah ada! Silakan gunakan nama yang berbeda.";
                    } else {
                        errorMessage = errors.name;
                    }
                } else if (errors?.message) {
                    errorMessage = errors.message;
                } else if (typeof errors === "string") {
                    errorMessage = errors;
                } else if (errors?.error) {
                    errorMessage = errors.error;
                }

                showErrorModal(errorMessage, "Gagal Menambahkan Tag!");
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();

        if (data.slugError) {
            return;
        }

        confirmEdit(selectedTag.name, data.name, "tag").then((result) => {
            if (result.isConfirmed) {
                put(route("admin.news.tags.update", selectedTag.id), {
                    onSuccess: () => {
                        setShowEditModal(false);
                        setSelectedTag(null);
                        setData("slugError", "");
                        reset();

                        showSuccessModal(`${selectedTag.name} → ${data.name}`, "tag berhasil diubah", "tag");

                        router.get(
                            route("admin.news.tags"),
                            {},
                            {
                                preserveState: false,
                                preserveScroll: false,
                            }
                        );
                    },
                    onError: (errors) => {
                        let errorMessage =
                            "Terjadi kesalahan saat memperbarui tag.";

                        if (errors?.name) {
                            if (errors.name.includes("unique")) {
                                errorMessage =
                                    "Tag dengan nama ini sudah ada! Silakan gunakan nama yang berbeda.";
                            } else {
                                errorMessage = errors.name;
                            }
                        } else if (errors?.message) {
                            errorMessage = errors.message;
                        } else if (typeof errors === "string") {
                            errorMessage = errors;
                        } else if (errors?.error) {
                            errorMessage = errors.error;
                        }

                        showErrorModal(errorMessage, "Gagal Memperbarui Tag!");
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tags Berita
                </h2>
            }
        >
            <Head title="Tags Berita" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Manajemen Tags Berita
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
                                            <i className="fas fa-plus"></i>
                                            Tambah Tag
                                        </PrimaryButton>
                                    </div>
                                </div>

                                {/* FilterBar */}
                                {showFilters && (
                                    <div className="filter-slide-in">
                                        <FilterBar
                                            variant="compact"
                                            gridCols="md:grid-cols-2"
                                            searchColSpan="md:col-span-1"
                                            filters={{
                                                ...filters,
                                                search: searchInput,
                                                per_page: perPageInput,
                                            }}
                                            onFilterChange={(key, value) => {
                                                if (key === "search") {
                                                    setSearchInput(value);
                                                } else if (key === "per_page") {
                                                    setPerPageInput(value);
                                                    // Langsung request ke server ketika per_page berubah
                                                    router.get(
                                                        route("admin.news.tags"),
                                                        {
                                                            ...filters,
                                                            per_page: value,
                                                        },
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        }
                                                    );
                                                } else {
                                                    router.get(
                                                        route("admin.news.tags"),
                                                        { ...filters, [key]: value },
                                                        { preserveState: true, preserveScroll: true,
                                                        }
                                                    );
                                                }
                                            }}
                                            onReset={() => {
                                                setSearchInput("");
                                                setPerPageInput("10");
                                                router.get(
                                                    route("admin.news.tags"),
                                                    { per_page: "10" },
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
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
                                                Tag yang masih dipakai berita
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
                                                        Hapus semua berita yang
                                                        memakai tag
                                                    </li>
                                                    <li>
                                                        Atau ganti tag pada
                                                        berita
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {filteredTags.length > 0 ? (
                                <DataCardGrid>
                                    {displayTags.map((tag, index) => (
                                        <DataCard
                                            key={tag.id}
                                            item={tag}
                                            index={index}
                                            icon="fas fa-tag"
                                            iconColor={getTagColor(index)}
                                            title={tag.name}
                                            subtitle={tag.slug}
                                            count={tag.articles_count}
                                            countLabel="berita"
                                            isProtected={tag.articles_count > 0}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            editColor="text-purple-600 hover:text-purple-800"
                                            disabledDelete={
                                                tag.articles_count > 0
                                            }
                                        />
                                    ))}
                                </DataCardGrid>
                            ) : searchInput ? (
                                <EmptyState
                                    icon="fas fa-search"
                                    title="Tidak ditemukan"
                                    description={`Tidak ada tag yang cocok dengan "${searchInput}".`}
                                    actionButton={
                                        <SecondaryButton
                                            onClick={() => {
                                                setSearchInput("");
                                                router.get(
                                                    route("admin.news.tags"),
                                                    {},
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    }
                                                );
                                            }}
                                        >
                                            <i className="fas fa-times mr-2"></i>
                                            Clear Search
                                        </SecondaryButton>
                                    }
                                />
                            ) : (
                                <EmptyState
                                    icon="fas fa-tags"
                                    title="Belum ada tag"
                                    description="Mulai dengan menambahkan tag pertama untuk membantu mengkategorikan berita Anda."
                                        actionButton={
                                        <PrimaryButton onClick={handleCreate}>
                                            <i className="fas fa-plus mr-2"></i>Tambah Tag Pertama
                                            </PrimaryButton>
                                        }
                                    />
                            )}

                            {/* Pagination */}
                            {tags?.data && tags.data.length > 0 && (
                                <div className="mt-6">
                                    <Pagination
                                        pagination={tags}
                                        showInfo={true}
                                        routeName="admin.news.tags"
                                        filters={filters}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Tag */}
            <ModalForm
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Tambah Tag Baru"
                formData={data}
                setFormData={handleFormDataChange}
                onSubmit={submitCreate}
                processing={processing}
                errors={errors}
                customErrors={{ name: data.slugError }}
                submitDisabled={data.slugError || !data.name.trim()}
                fields={[
                    {
                        name: "name",
                        label: "Nama Tag",
                        type: "text",
                        placeholder: "Contoh: infrastruktur",
                        required: true,
                    },
                ]}
                submitText="Simpan Tag"
                cancelText="Batal"
            />

            {/* Modal Edit Tag */}
            <ModalForm
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Edit Tag"
                formData={data}
                setFormData={handleFormDataChange}
                onSubmit={submitEdit}
                processing={processing}
                errors={errors}
                customErrors={{ name: data.slugError }}
                submitDisabled={data.slugError || !data.name.trim()}
                fields={[
                    {
                        name: "name",
                        label: "Nama Tag",
                        type: "text",
                        placeholder: "Contoh: infrastruktur",
                        required: true,
                    },
                ]}
                submitText="Update Tag"
                cancelText="Batal"
            />
        </AuthenticatedLayout>
    );
}
