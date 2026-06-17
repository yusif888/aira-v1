import React from "react";
import ModalForm from "@/Admin/Components/ModalForm";

/**
 * Modal pembuatan kategori baru.
 *
 * @param {Object} props
 * @param {boolean} props.show - visibility
 * @param {Function} props.onClose - close handler
 * @param {Object} props.formData - form data
 * @param {Function} props.setFormData - form setter
 * @param {Function} props.onSubmit - submit handler
 * @param {boolean} props.processing - loading state
 * @param {Object} props.errors - validation errors
 */
export const CreateCategoryModal = ({
    show,
    onClose,
    formData,
    setFormData,
    onSubmit,
    processing,
    errors,
}) => {
    return (
        <ModalForm
            show={show}
            onClose={onClose}
            title="Tambah Kategori Baru"
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            processing={processing}
            errors={errors}
            fields={[
                {
                    name: "name",
                    label: "Nama Kategori",
                    type: "text",
                    placeholder: "Masukkan nama kategori",
                    required: true,
                },
                {
                    name: "description",
                    label: "Deskripsi (Opsional)",
                    type: "textarea",
                    placeholder: "Deskripsi kategori",
                    required: false,
                },
                {
                    name: "is_active",
                    label: "Status",
                    type: "select",
                    options: [
                        { value: "1", label: "Aktif" },
                        { value: "0", label: "Tidak Aktif" },
                    ],
                    required: true,
                },
            ]}
            submitText="Simpan"
            cancelText="Batal"
        />
    );
};

/**
 * Modal edit kategori.
 *
 * @param {Object} props
 * @param {boolean} props.show
 * @param {Function} props.onClose
 * @param {Object} props.formData
 * @param {Function} props.setFormData
 * @param {Function} props.onSubmit
 * @param {boolean} props.processing
 * @param {Object} props.errors
 * @param {Function} props.handleDelete - Delete handler
 * @param {Object} props.selectedCategory - Current category
 */
export const EditCategoryModal = ({
    show,
    onClose,
    formData,
    setFormData,
    onSubmit,
    processing,
    errors,
    handleDelete,
    selectedCategory,
}) => {
    return (
        <ModalForm
            show={show}
            onClose={onClose}
            title="Edit Kategori"
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            processing={processing}
            errors={errors}
            fields={[
                {
                    name: "name",
                    label: "Nama Kategori",
                    type: "text",
                    placeholder: "Masukkan nama kategori",
                    required: true,
                },
                {
                    name: "description",
                    label: "Deskripsi (Opsional)",
                    type: "textarea",
                    placeholder: "Deskripsi kategori",
                    required: false,
                },
                {
                    name: "is_active",
                    label: "Status",
                    type: "select",
                    options: [
                        { value: "1", label: "Aktif" },
                        { value: "0", label: "Tidak Aktif" },
                    ],
                    required: true,
                },
            ]}
            submitText="Update"
            cancelText="Batal"
            showDeleteButton={true}
            onDelete={() => handleDelete(selectedCategory)}
            deleteDisabled={(selectedCategory?.types_count ?? 0) > 0}
            deleteDisabledTitle={
                (selectedCategory?.types_count ?? 0) > 0
                    ? "Tidak dapat dihapus karena masih memiliki tipe dokumen"
                    : undefined
            }
            deleteText="Hapus"
        />
    );
};
