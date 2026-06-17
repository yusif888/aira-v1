import Swal from "sweetalert2";

// Helper function untuk truncate text
const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

// SweetAlert untuk konfirmasi hapus dengan truncate
export const confirmDelete = (itemName, itemType = "item", maxLength = 20) => {
    return Swal.fire({
        title: `Hapus ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}?`,
        html: `${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
        } <strong>${truncateText(
            itemName,
            maxLength
        )}</strong> akan hilang dari halaman ${itemType}!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
        reverseButtons: true,
    });
};

// SweetAlert untuk loading state
export const showLoading = (
    title = "Memproses...",
    message = "Mohon tunggu sebentar"
) => {
    return Swal.fire({
        title: title,
        html: message,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
};

// SweetAlert untuk menutup loading
export const closeLoading = () => {
    return Swal.close();
};

// SweetAlert untuk success dengan truncate (toast)
export const showSuccess = (
    itemName,
    action = "berhasil",
    itemType = "item",
    maxLength = 20
) => {
    return Swal.fire({
        title: "Berhasil!",
        html: `${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
        } <strong>${truncateText(itemName, maxLength)}</strong> ${action}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
    });
};

// SweetAlert untuk success dengan truncate (modal center)
export const showSuccessModal = (
    itemName,
    action = "berhasil",
    itemType = "item",
    maxLength = 20
) => {
    return Swal.fire({
        title: "Berhasil!",
        html: `${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
        } <strong>${truncateText(itemName, maxLength)}</strong> ${action}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
    });
};

// SweetAlert untuk error (toast)
export const showError = (message = "Terjadi kesalahan", title = "Gagal!") => {
    return Swal.fire({
        title: title,
        html: message,
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
    });
};

// SweetAlert untuk error (modal center)
export const showErrorModal = (
    message = "Terjadi kesalahan",
    title = "Gagal!"
) => {
    return Swal.fire({
        title: title,
        html: message,
        icon: "error",
        timer: 3000,
        showConfirmButton: false,
    });
};

// SweetAlert untuk konfirmasi edit dengan truncate
export const confirmEdit = (
    oldName,
    newName,
    itemType = "item",
    maxLength = 20
) => {
    return Swal.fire({
        title: `Simpan Perubahan ${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
        }?`,
        html: `${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
        } <strong>${truncateText(
            oldName,
            maxLength
        )}</strong> akan berubah menjadi <strong>${truncateText(
            newName,
            maxLength
        )}</strong>`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Simpan!",
        cancelButtonText: "Batal",
        reverseButtons: true,
    });
};

// SweetAlert untuk konfirmasi create dengan truncate
export const confirmCreate = (itemName, itemType = "item", maxLength = 20) => {
    return Swal.fire({
        title: `Simpan ${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
        } Baru?`,
        html: `${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
        } <strong>${truncateText(
            itemName,
            maxLength
        )}</strong> akan ditambahkan`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Simpan!",
        cancelButtonText: "Batal",
        reverseButtons: true,
    });
};

// SweetAlert untuk konfirmasi restore dengan truncate
export const confirmRestore = (itemName, itemType = "item", maxLength = 20) => {
    return Swal.fire({
        title: `Pulihkan ${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
        }?`,
        html: `${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
        } <strong>${truncateText(
            itemName,
            maxLength
        )}</strong> akan dipulihkan`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Ya, Pulihkan!",
        cancelButtonText: "Batal",
        reverseButtons: true,
    });
};

// SweetAlert untuk konfirmasi hapus permanen dengan truncate
export const confirmPermanentDelete = (
    itemName,
    itemType = "item",
    maxLength = 20
) => {
    return Swal.fire({
        title: `Hapus Permanen ${
            itemType.charAt(0).toUpperCase() + itemType.slice(1)
        }?`,
        html: `Menghapus ${itemType} <strong>${truncateText(
            itemName,
            maxLength
        )}</strong> bersifat permanen dan tidak dapat digunakan!`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
        reverseButtons: true,
    });
};

// SweetAlert untuk konfirmasi batal
export const confirmCancel = (
    message = "Apakah Anda yakin ingin membatalkan? Data yang sudah diisi akan hilang."
) => {
    return Swal.fire({
        title: "Konfirmasi Batal",
        html: message,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#6c757d",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Batalkan",
        cancelButtonText: "Kembali Isi",
        reverseButtons: true,
    });
};

// Export fungsi truncate untuk penggunaan standalone
export { truncateText };
