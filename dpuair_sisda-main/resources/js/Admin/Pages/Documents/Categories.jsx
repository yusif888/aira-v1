import React, { useState, useEffect } from "react";
import { Head, router, usePage, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import {
    confirmDelete,
    showSuccess,
    showSuccessModal,
    showError,
} from "@/Components/SweetAlert";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import DataTable from "@/Admin/Components/DataTable";
import EmptyState from "@/Admin/Components/EmptyState";
import FilterBar from "@/Admin/Components/FilterBar";
import Pagination from "@/Admin/Components/Pagination";
import { route } from "ziggy-js";

// Partials
import ProtectedCategoryBanner from "./Partials/ProtectedCategoryBanner";
import CategoryTypesList from "./Partials/CategoryTypesList";
import {
    CreateCategoryModal,
    EditCategoryModal,
} from "./Partials/CategoryModals";
import { CreateTypeModal, EditTypeModal } from "./Partials/TypeModals";

export default function DocumentCategories({ auth, categories = [], filters }) {
    const { flash } = usePage().props;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const [showEditTypeModal, setShowEditTypeModal] = useState(false);
    const [showCreateTypeModal, setShowCreateTypeModal] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    const [typeFormData, setTypeFormData] = useState({
        name: "",
        is_active: true,
    });
    const [newTypeFormData, setNewTypeFormData] = useState({
        name: "",
        is_active: true,
    });
    const [showAllTypes, setShowAllTypes] = useState(new Set());

    const initialFormData = { name: "", description: "", is_active: true };
    const [formData, setFormData] = useState(initialFormData);
    const { data, setData, reset } = useForm({
        search: filters?.search || "",
        status: filters?.status || "",
        category: filters?.category || "",
        per_page: filters?.per_page || "10",
    });

    // State untuk filter dropdown
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (filters) {
            setData({
                search: filters.search || "",
                status: filters.status || "",
                category: filters.category || "",
                per_page: filters.per_page || "10",
            });
        }
    }, [filters]);

    const debouncedSearch = React.useCallback(
        React.useMemo(() => {
            let timeoutId;
            return (searchTerm) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    if (
                        searchTerm.trim() !== "" &&
                        searchTerm !== data.search
                    ) {
                        router.get(
                            route("admin.documents.categories"),
                            { ...data, search: searchTerm },
                            {
                                preserveState: true,
                                preserveScroll: true,
                            },
                        );
                    }
                }, 500);
            };
        }, [data, setData]),
        [data, setData],
    );

    useEffect(() => {
        if (flash?.success) {
            showSuccessModal(flash.success, "berhasil", "kategori dokumen", 30);
        }
        if (flash?.error) {
            showError(flash.error, "Gagal!");
        }
    }, [flash]);

    const resetForm = () => {
        setFormData(initialFormData);
        setErrors({});
    };

    const resetTypeForm = () => {
        setNewTypeFormData({ name: "", is_active: true });
        setErrors({});
    };

    const handleEditType = (type) => {
        setSelectedType(type);
        setTypeFormData({
            name: type.name || "",
            is_active: type.is_active ?? true,
        });
        setShowEditTypeModal(true);
        setErrors({});
    };

    const handleCreateType = (category) => {
        setSelectedCategory(category);
        setNewTypeFormData({ name: "", is_active: true });
        setShowCreateTypeModal(true);
        setErrors({});
    };

    const submitCreateType = (e) => {
        e.preventDefault();
        if (!selectedCategory) return;

        if (!newTypeFormData.name || newTypeFormData.name.trim() === "") {
            setErrors({ name: "Nama tipe dokumen wajib diisi" });
            return;
        }

        setProcessing(true);
        setErrors({});

        const formPayload = {
            name: newTypeFormData.name.trim(),
            category_id: selectedCategory.id,
            is_active: newTypeFormData.is_active,
        };

        router.post(route("admin.documents.types.store"), formPayload, {
            onSuccess: () => {
                setShowCreateTypeModal(false);
                setSelectedCategory(null);
                resetTypeForm();
                router.reload();
            },
            onError: (err) => setErrors(err),
            onFinish: () => setProcessing(false),
        });
    };

    const toggleShowAllTypes = (categoryId) => {
        const next = new Set(showAllTypes);
        if (next.has(categoryId)) next.delete(categoryId);
        else next.add(categoryId);
        setShowAllTypes(next);
    };

    const submitEditType = (e) => {
        e.preventDefault();
        if (!selectedType) return;

        setProcessing(true);
        setErrors({});

        const formPayload = {
            name: typeFormData.name,
            is_active: typeFormData.is_active,
            _method: "PUT",
        };

        router.put(
            route("admin.documents.types.update", selectedType.id),
            formPayload,
            {
                onSuccess: () => {
                    setShowEditTypeModal(false);
                    setSelectedType(null);
                    setTypeFormData({ name: "", is_active: true });
                    router.reload();
                },
                onError: (err) => setErrors(err),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleDeleteType = async () => {
        if (!selectedType) return;
        const result = await confirmDelete(selectedType.name, "tipe dokumen");
        if (!result.isConfirmed) return;
        setProcessing(true);
        router.delete(route("admin.documents.types.destroy", selectedType.id), {
            onSuccess: () => {
                setShowEditTypeModal(false);
                setSelectedType(null);
                setTypeFormData({ name: "", is_active: true });
                router.reload();
            },
            onFinish: () => setProcessing(false),
        });
    };

    const handleCreate = () => {
        setShowCreateModal(true);
        resetForm();
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name || "",
            description: category.description || "",
            is_active:
                category.is_active !== undefined ? category.is_active : true,
        });
        setShowEditModal(true);
        setErrors({});
    };

    const handleDelete = async (category) => {
        let confirmResult;
        confirmResult = await confirmDelete(
            category.types_count > 0
                ? `${category.name} (${category.types_count} Tipe)`
                : category.name,
            "kategori",
        );

        if (confirmResult.isConfirmed) {
            setProcessing(true);
            router.delete(
                route(
                    "admin.documents.document-categories.destroy",
                    category.id,
                ),
                {
                    onSuccess: () => {
                        showSuccess(
                            category.name,
                            "berhasil dihapus",
                            "Kategori",
                        );
                        setProcessing(false);
                    },
                    onError: () => setProcessing(false),
                },
            );
        }
    };

    const submitCreate = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post(
            route("admin.documents.document-categories.store"),
            formData,
            {
                onSuccess: () => {
                    setShowCreateModal(false);
                    resetForm();
                    setProcessing(false);
                },
                onError: (err) => {
                    setErrors(err);
                    setProcessing(false);
                },
            },
        );
    };

    const submitEdit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.put(
            route(
                "admin.documents.document-categories.update",
                selectedCategory.id,
            ),
            formData,
            {
                onSuccess: () => {
                    setShowEditModal(false);
                    setSelectedCategory(null);
                    resetForm();
                    setProcessing(false);
                },
                onError: (err) => {
                    setErrors(err);
                    setProcessing(false);
                },
            },
        );
    };

    const setFormDataByField = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: name === "is_active" ? value === "1" : value,
        }));
    };
    const setTypeFormDataByField = (name, value) => {
        setTypeFormData((prev) => ({
            ...prev,
            [name.replace("type_", "")]:
                name === "type_is_active" ? value === "1" : value,
        }));
    };
    const setNewTypeFormDataByField = (name, value) => {
        setNewTypeFormData((prev) => ({
            ...prev,
            [name.replace("new_type_", "")]:
                name === "new_type_is_active" ? value === "1" : value,
        }));
    };

    const columns = [
        {
            key: "name",
            label: "Kategori Dokumen",
            className: "w-1/3",
            render: (item) => (
                <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                    </div>
                    {item.description && (
                        <div className="text-xs text-gray-500 truncate">
                            {item.description}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            className: "w-1/6",
            align: "center",
            render: (item) => (
                <div className="flex justify-center">
                    <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                        }`}
                    >
                        {item.is_active ? "Aktif" : "Tidak Aktif"}
                    </span>
                </div>
            ),
        },
        {
            key: "actions",
            label: "Aksi",
            className: "w-1/6",
            align: "center",
            render: (item) => (
                <div className="flex justify-center gap-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md border text-gray-600 hover:bg-gray-50"
                        title="Edit Kategori"
                    >
                        <i className="fas fa-edit text-sm"></i>
                    </button>
                    <button
                        onClick={() => handleDelete(item)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md border text-red-600 hover:bg-red-50"
                        title="Hapus Kategori"
                        disabled={item.documents_count > 0}
                        style={
                            item.documents_count > 0
                                ? { opacity: 0.5, cursor: "not-allowed" }
                                : {}
                        }
                    >
                        <i className="fas fa-trash text-sm"></i>
                    </button>
                </div>
            ),
        },
        {
            key: "types",
            label: "Tipe Dokumen",
            className: "w-1/2",
            render: (item) => (
                <CategoryTypesList
                    category={item}
                    showAllTypes={showAllTypes}
                    toggleShowAllTypes={toggleShowAllTypes}
                    handleEditType={handleEditType}
                    handleCreateType={handleCreateType}
                />
            ),
        },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Kategori & Tipe Dokumen
                    </h2>
                </div>
            }
        >
            <Head title="Kategori Dokumen" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Manajemen Kategori & Tipe Dokumen
                                </h2>
                                <div className="flex gap-2">
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
                                    <PrimaryButton onClick={handleCreate}>
                                        <i className="fas fa-plus mr-2"></i>
                                        Tambah Kategori
                                    </PrimaryButton>
                                </div>
                            </div>

                            {/* Filters */}
                            {showFilters && (
                                <div className="filter-slide-in">
                                    <FilterBar
                                        variant="compact"
                                        gridCols="md:grid-cols-3"
                                        searchColSpan="md:col-span-1"
                                        filters={data}
                                        onFilterChange={(key, value) => {
                                            if (key === "search") {
                                                setData(key, value);
                                                if (value.trim() === "") {
                                                    router.get(
                                                        route(
                                                            "admin.documents.categories",
                                                        ),
                                                        { ...data, search: "" },
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                } else {
                                                    debouncedSearch(value);
                                                }
                                            } else {
                                                setData(key, value);
                                                router.get(
                                                    route(
                                                        "admin.documents.categories",
                                                    ),
                                                    { ...data, [key]: value },
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    },
                                                );
                                            }
                                        }}
                                        onReset={() => {
                                            reset();
                                            router.get(
                                                route(
                                                    "admin.documents.categories",
                                                ),
                                            );
                                        }}
                                        searchPlaceholder="Cari nama kategori..."
                                        showSearch={true}
                                        showStatus={true}
                                        statusOptions={[
                                            { value: "1", label: "Aktif" },
                                            {
                                                value: "0",
                                                label: "Tidak Aktif",
                                            },
                                        ]}
                                        totalItems={categories.total}
                                        itemLabel="kategori"
                                        showPageSelector={true}
                                        pageSelectorOptions={[
                                            5, 10, 25, 50, 100,
                                        ]}
                                        pageSelectorLabel="Tampilkan:"
                                        pageSelectorSuffix="per halaman"
                                    />
                                </div>
                            )}

                            <ProtectedCategoryBanner />

                            {categories?.data && categories.data.length > 0 ? (
                                <DataTable
                                    columns={columns}
                                    data={categories.data}
                                    showHeader={true}
                                    showActions={false}
                                />
                            ) : (
                                <EmptyState
                                    icon="fas fa-folder"
                                    iconSize="text-5xl"
                                    title="Belum ada kategori"
                                    description="Mulai dengan menambahkan kategori dokumen pertama."
                                    actionButton={
                                        <PrimaryButton onClick={handleCreate}>
                                            <i className="fas fa-plus mr-2"></i>
                                            Tambah Kategori Pertama
                                        </PrimaryButton>
                                    }
                                    variant="default"
                                    containerClassName="mb-0"
                                />
                            )}

                            {/* Pagination */}
                            {categories &&
                                categories.data &&
                                categories.data.length > 0 && (
                                    <Pagination
                                        pagination={categories}
                                        showInfo={true}
                                        routeName="admin.documents.categories"
                                        filters={data}
                                    />
                                )}
                        </div>
                    </div>
                </div>
            </div>

            <CreateCategoryModal
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                formData={formData}
                setFormData={setFormDataByField}
                onSubmit={submitCreate}
                processing={processing}
                errors={errors}
            />

            <EditCategoryModal
                show={showEditModal}
                onClose={() => setShowEditModal(false)}
                formData={formData}
                setFormData={setFormDataByField}
                onSubmit={submitEdit}
                processing={processing}
                errors={errors}
                selectedCategory={selectedCategory}
                handleDelete={handleDelete}
            />

            <CreateTypeModal
                show={showCreateTypeModal}
                onClose={() => setShowCreateTypeModal(false)}
                formData={newTypeFormData}
                setFormData={setNewTypeFormDataByField}
                onSubmit={submitCreateType}
                processing={processing}
                errors={errors}
                selectedCategory={selectedCategory}
            />

            <EditTypeModal
                show={showEditTypeModal}
                onClose={() => setShowEditTypeModal(false)}
                formData={typeFormData}
                setFormData={setTypeFormDataByField}
                onSubmit={submitEditType}
                processing={processing}
                errors={errors}
                selectedType={selectedType}
                onDelete={handleDeleteType}
            />
        </AuthenticatedLayout>
    );
}
