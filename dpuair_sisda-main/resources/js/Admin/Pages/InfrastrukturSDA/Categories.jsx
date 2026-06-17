import React, { useState } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import DataTable from "@/Admin/Components/DataTable";
import EmptyState from "@/Admin/Components/EmptyState";
import { confirmDelete, showLoading, showSuccess, closeLoading } from "@/Components/SweetAlert";

// Komponen Modal untuk Create/Edit
const CategoryModal = ({
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
                <div className="mb-4">
                    <InputLabel htmlFor="code" value="Kode" />
                    <TextInput
                        id="code"
                        name="code"
                        value={formData.code}
                        className="mt-1 block w-full"
                        onChange={(e) => onInputChange("code", e.target.value)}
                        placeholder="master, sih3, irigasi"
                        required
                    />
                    <InputError message={errors.code} className="mt-2" />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="name" value="Nama Kategori" />
                    <TextInput
                        id="name"
                        name="name"
                        value={formData.name}
                        className="mt-1 block w-full"
                        onChange={(e) => onInputChange("name", e.target.value)}
                        placeholder="Data Master, SIH3, IRIGASI"
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mb-4">
                    <InputLabel htmlFor="icon" value="Icon (SVG atau FontAwesome Class)" />
                    <textarea
                        id="icon"
                        name="icon"
                        value={formData.icon || ""}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        onChange={(e) => onInputChange("icon", e.target.value)}
                        placeholder="Contoh SVG: <svg>...</svg> atau FontAwesome: fas fa-building"
                        rows="3"
                    ></textarea>
                    <p className="mt-1 text-xs text-gray-500">
                        Anda bisa menggunakan kode SVG lengkap atau class FontAwesome (contoh: fas fa-building)
                    </p>
                    <InputError message={errors.icon} className="mt-2" />
                </div>

                <div className="mb-6 flex items-center">
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={(e) => onInputChange("is_active", e.target.checked)}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                        Aktif
                    </label>
                </div>

                <div className="flex justify-end gap-3">
                    <SecondaryButton type="button" onClick={onClose} disabled={processing}>
                        Batal
                    </SecondaryButton>
                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? "Menyimpan..." : submitText}
                    </PrimaryButton>
                </div>
            </form>
        </div>
    </Modal>
);

export default function Categories({ auth, categories = [] }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        icon: "",
        is_active: true,
    });

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const openCreateModal = () => {
        setFormData({
            code: "",
            name: "",
            icon: "",
            is_active: true,
        });
        setErrors({});
        setShowCreateModal(true);
    };

    const openEditModal = (category) => {
        setFormData({
            id: category.id,
            code: category.code,
            name: category.name,
            icon: category.icon || "",
            is_active: category.is_active,
        });
        setErrors({});
        setShowEditModal(true);
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        setFormData({
            code: "",
            name: "",
            icon: "",
            is_active: true,
        });
        setErrors({});
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setFormData({
            code: "",
            name: "",
            icon: "",
            is_active: true,
        });
        setErrors({});
    };

    const submitCreate = (e) => {
        e.preventDefault();
        setProcessing(true);
        showLoading("Menyimpan...", "Mohon tunggu sebentar");

        router.post(route("admin.infrastruktur-sda.categories.store"), formData, {
            onSuccess: () => {
                closeLoading();
                showSuccess("Kategori berhasil ditambahkan", "Data kategori baru telah disimpan.");
                closeCreateModal();
                setProcessing(false);
            },
            onError: (errors) => {
                closeLoading();
                setErrors(errors);
                setProcessing(false);
            },
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        setProcessing(true);
        showLoading("Mengupdate...", "Mohon tunggu sebentar");

        router.put(route("admin.infrastruktur-sda.categories.update", formData.id), formData, {
            onSuccess: () => {
                closeLoading();
                showSuccess("Kategori berhasil diupdate", "Perubahan data telah disimpan.");
                closeEditModal();
                setProcessing(false);
            },
            onError: (errors) => {
                closeLoading();
                setErrors(errors);
                setProcessing(false);
            },
        });
    };

    const handleDelete = (id, category) => {
        confirmDelete(category?.name, "kategori", 20).then((result) => {
            if (result.isConfirmed) {
                showLoading("Menghapus...", "Mohon tunggu sebentar");

                router.delete(route("admin.infrastruktur-sda.categories.destroy", id), {
                    onSuccess: () => {
                        closeLoading();
                        showSuccess(
                            category?.name,
                            "berhasil dihapus",
                            "kategori",
                            20
                        );
                    },
                    onError: () => {
                        closeLoading();
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Kategori Infrastruktur SDA
                    </h2>
                </div>
            }
        >
            <Head title="Kategori Infrastruktur SDA" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Manajemen Kategori
                                </h2>
                                <PrimaryButton onClick={openCreateModal}>
                                    <i className="fas fa-plus mr-2"></i>
                                    Tambah Kategori
                                </PrimaryButton>
                            </div>

                            {categories.length > 0 ? (
                                <DataTable
                                    columns={[
                                        {
                                            key: "code",
                                            label: "Kode",
                                            className: "w-1/4",
                                            render: (item) => (
                                                <span className="font-mono text-sm text-gray-900">
                                                    {item.code}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: "name",
                                            label: "Nama Kategori",
                                            className: "w-1/3",
                                            render: (item) => (
                                                <span className="text-sm font-medium text-gray-900">
                                                    {item.name}
                                                </span>
                                            ),
                                        },
                                        {
                                            key: "infrastruktur_count",
                                            label: "Jumlah Data",
                                            className: "w-1/6",
                                            render: (item) => (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {item.infrastruktur_count || 0} data
                                                </span>
                                            ),
                                        },
                                        {
                                            key: "status",
                                            label: "Status",
                                            className: "w-1/6",
                                            render: (item) => (
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        item.is_active
                                                            ? "bg-emerald-100 text-emerald-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {item.is_active ? "Aktif" : "Nonaktif"}
                                                </span>
                                            ),
                                        },
                                    ]}
                                    data={categories}
                                    actions={[
                                        {
                                            key: "edit",
                                            title: "Edit",
                                            icon: "fas fa-edit",
                                            variant: "primary",
                                        },
                                        {
                                            key: "delete",
                                            title: "Hapus",
                                            icon: "fas fa-trash",
                                            variant: "danger",
                                        },
                                    ]}
                                    onActionClick={(action, item) => {
                                        if (action === "edit") {
                                            openEditModal(item);
                                        } else if (action === "delete") {
                                            handleDelete(item.id, item);
                                        }
                                    }}
                                />
                            ) : (
                                <EmptyState
                                    icon="fas fa-folder-open"
                                    title="Belum ada kategori"
                                    description="Belum ada kategori infrastruktur yang terdaftar di sistem"
                                    actionButton={
                                        <PrimaryButton onClick={openCreateModal} type="button">
                                            <i className="fas fa-plus mr-2"></i>
                                            Tambah Kategori Pertama
                                        </PrimaryButton>
                                    }
                                    titleSize="text-lg"
                                    descriptionSize="text-base"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Create */}
            <CategoryModal
                show={showCreateModal}
                onClose={closeCreateModal}
                title="Tambah Kategori Baru"
                onSubmit={submitCreate}
                submitText="Simpan Kategori"
                formData={formData}
                onInputChange={handleInputChange}
                processing={processing}
                errors={errors}
            />

            {/* Modal Edit */}
            <CategoryModal
                show={showEditModal}
                onClose={closeEditModal}
                title="Edit Kategori"
                onSubmit={submitEdit}
                submitText="Update Kategori"
                formData={formData}
                onInputChange={handleInputChange}
                processing={processing}
                errors={errors}
            />
        </AuthenticatedLayout>
    );
}
