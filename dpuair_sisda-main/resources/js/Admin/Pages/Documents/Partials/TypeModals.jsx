import React from "react";
import ModalForm from "@/Admin/Components/ModalForm";

/**
 * Modal pembuatan tipe dokumen baru.
 *
 * @param {Object} props
 * @param {boolean} props.show
 * @param {Function} props.onClose
 * @param {Object} props.formData
 * @param {Function} props.setFormData
 * @param {Function} props.onSubmit
 * @param {boolean} props.processing
 * @param {Object} props.errors
 * @param {Object} props.selectedCategory - Parent category
 */
export const CreateTypeModal = ({
    show,
    onClose,
    formData,
    setFormData,
    onSubmit,
    processing,
    errors,
    selectedCategory,
}) => {
    return (
        <ModalForm
            show={show}
            onClose={onClose}
            title="Tambah Tipe Dokumen Baru"
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            processing={processing}
            errors={errors}
            fields={[
                {
                    name: "name",
                    label: "Nama Tipe Dokumen",
                    type: "text",
                    placeholder:
                        "Contoh: Surat Keputusan, Laporan Bulanan, Proposal, dll",
                    required: true,
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
        >
            {selectedCategory && (
                <p className="text-sm text-gray-600 mb-4">
                    Kategori:{" "}
                    <span className="font-medium">{selectedCategory.name}</span>
                </p>
            )}
        </ModalForm>
    );
};

/**
 * Modal edit tipe dokumen.
 *
 * @param {Object} props
 * @param {boolean} props.show
 * @param {Function} props.onClose
 * @param {Object} props.formData
 * @param {Function} props.setFormData
 * @param {Function} props.onSubmit
 * @param {boolean} props.processing
 * @param {Object} props.errors
 * @param {Object} props.selectedType - Current type
 * @param {Function} props.onDelete - Delete handler
 */
export const EditTypeModal = ({
    show,
    onClose,
    formData,
    setFormData,
    onSubmit,
    processing,
    errors,
    selectedType,
    onDelete,
}) => {
    return (
        <ModalForm
            show={show}
            onClose={onClose}
            title="Edit Tipe Dokumen"
            formData={formData}
            setFormData={setFormData}
            onSubmit={onSubmit}
            processing={processing}
            errors={errors}
            fields={[
                {
                    name: "name",
                    label: "Nama Tipe Dokumen",
                    type: "text",
                    placeholder: "Masukkan nama tipe dokumen",
                    required: true,
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
            showDeleteButton={true}
            onDelete={onDelete}
            deleteDisabled={(selectedType?.documents_count ?? 0) > 0}
            deleteText="Hapus"
        />
    );
};
