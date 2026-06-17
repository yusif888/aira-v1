import React from "react";
import Modal from "@/Components/Modal";
import RequiredInputLabel from "@/Components/RequiredInputLabel";
import DangerButton from "@/Components/DangerButton";

/**
 * ModalForm Component - Komponen modal form yang dapat digunakan kembali
 *
 * @param {Object} props - Props komponen
 * @param {boolean} props.show - Tampilkan modal atau tidak
 * @param {Function} props.onClose - Callback function untuk menutup modal
 * @param {string} props.title - Judul modal
 * @param {Object} props.formData - Data form saat ini
 * @param {Function} props.setFormData - Function untuk mengubah data form
 * @param {Function} props.onSubmit - Callback function untuk submit form
 * @param {boolean} props.processing - Status processing form
 * @param {Object} props.errors - Object error dari form
 * @param {Array} props.fields - Array konfigurasi field form
 * @param {string} props.submitText - Teks tombol submit
 * @param {string} props.cancelText - Teks tombol cancel
 * @param {boolean} props.showDeleteButton - Tampilkan tombol hapus atau tidak
 * @param {Function} props.onDelete - Callback function untuk delete
 * @param {boolean} props.deleteDisabled - Apakah tombol hapus disabled
 * @param {string} props.deleteDisabledTitle - Tooltip untuk tombol hapus yang disabled
 * @param {string} props.deleteText - Teks tombol hapus
 *
 * @example
 * <ModalForm
 *   show={showCreateModal}
 *   onClose={() => setShowCreateModal(false)}
 *   title="Tambah Kategori Baru"
 *   formData={data}
 *   setFormData={setData}
 *   onSubmit={submitCreate}
 *   processing={processing}
 *   errors={errors}
 *   fields={[
 *     {
 *       name: 'name',
 *       label: 'Nama Kategori',
 *       type: 'text',
 *       placeholder: 'Contoh: Pembangunan & Infrastruktur',
 *       required: true
 *     },
 *     {
 *       name: 'description',
 *       label: 'Deskripsi',
 *       type: 'textarea',
 *       placeholder: 'Deskripsi singkat tentang kategori ini...',
 *       required: false
 *     }
 *   ]}
 *   submitText="Simpan Kategori"
 *   cancelText="Batal"
 *   showDeleteButton={true}
 *   onDelete={handleDelete}
 *   deleteDisabled={false}
 *   deleteText="Hapus"
 * />
 */
const ModalForm = ({
    show = false,
    onClose,
    title = "Form Modal",
    formData = {},
    setFormData,
    onSubmit,
    processing = false,
    errors = {},
    fields = [],
    submitText = "Simpan",
    cancelText = "Batal",
    children
}) => {
    const handleInputChange = (name, value) => {
        setFormData(name, value);
    };

    const renderField = (field) => {
        const {
            name,
            label,
            type = "text",
            placeholder = "",
            required = false,
            options = [],
        } = field;
        const value = formData[name] || "";
        const error = errors[name];

        switch (type) {
            case "textarea":
                return (
                    <div key={name} className="mb-4">
                        <label
                            htmlFor={name}
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            {label}
                        </label>
                        <textarea
                            id={name}
                            value={value}
                            onChange={(e) =>
                                handleInputChange(name, e.target.value)
                            }
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={placeholder}
                            required={required}
                        />
                        {error && (
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        )}
                    </div>
                );

            case "select":
                return (
                    <div key={name} className="mb-4">
                        <label
                            htmlFor={name}
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            {label}
                        </label>
                        <select
                            id={name}
                            value={value}
                            onChange={(e) =>
                                handleInputChange(name, e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required={required}
                        >
                            <option value="">Pilih {label}</option>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {error && (
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        )}
                    </div>
                );

            default:
                return (
                    <div key={name} className="mb-4">
                        {required ? (
                            <RequiredInputLabel
                                htmlFor={name}
                                value={label}
                                required={true}
                            />
                        ) : (
                            <label
                                htmlFor={name}
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                {label}
                            </label>
                        )}
                        <input
                            type={type}
                            id={name}
                            value={value}
                            onChange={(e) =>
                                handleInputChange(name, e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={placeholder}
                            required={required}
                        />
                        {error && (
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        )}
                    </div>
                );
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {title}
                </h3>

                {/* Additional content before form */}
                {children}

                <form onSubmit={onSubmit}>
                    {fields.map(renderField)}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : submitText}
                        </button>
                    </div>
                    {children} {/* <-- ini WAJIB agar konten custom (seperti DangerButton) muncul */}
                </form>
            </div>
        </Modal>
    );
};

export default ModalForm;
