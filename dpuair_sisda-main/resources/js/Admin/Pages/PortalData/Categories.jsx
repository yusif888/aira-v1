import React, { useState } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import SecondaryButton from "@/Components/SecondaryButton";
import PrimaryButton from "@/Components/PrimaryButton";
import Swal from "sweetalert2";

export default function PortalDataCategories({ auth }) {
    // State untuk modal
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // State untuk form
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        description: '',
        color: '#3B82F6',
        icon: 'fas fa-database'
    });
    
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    // Data contoh untuk statistik
    const statsData = [
        { title: "Total Kategori", value: "8", icon: "fas fa-folder", color: "bg-blue-500" },
        { title: "Dataset", value: "42", icon: "fas fa-database", color: "bg-green-500" },
        { title: "Download", value: "1,248", icon: "fas fa-download", color: "bg-purple-500" },
        { title: "Pengguna", value: "3,542", icon: "fas fa-users", color: "bg-yellow-500" }
    ];
    
    // Data contoh untuk kategori
    const [categories, setCategories] = useState([
        { id: 1, name: "Demografi", description: "Data kependudukan dan demografi", color: "#3B82F6", icon: "fas fa-users", datasets: 12, downloads: 342 },
        { id: 2, name: "Ekonomi", description: "Data ekonomi dan keuangan", color: "#10B981", icon: "fas fa-chart-line", datasets: 8, downloads: 256 },
        { id: 3, name: "Kesehatan", description: "Data kesehatan masyarakat", color: "#EF4444", icon: "fas fa-heartbeat", datasets: 6, downloads: 198 },
        { id: 4, name: "Pendidikan", description: "Data pendidikan dan sekolah", color: "#F59E0B", icon: "fas fa-graduation-cap", datasets: 9, downloads: 276 },
        { id: 5, name: "Lingkungan", description: "Data lingkungan hidup", color: "#8B5CF6", icon: "fas fa-leaf", datasets: 4, downloads: 124 },
        { id: 6, name: "Infrastruktur", description: "Data infrastruktur wilayah", color: "#EC4899", icon: "fas fa-road", datasets: 3, downloads: 52 }
    ]);
    
    // Ikon untuk dropdown
    const icons = [
        { value: "fas fa-database", label: "Database" },
        { value: "fas fa-users", label: "Users" },
        { value: "fas fa-chart-line", label: "Chart" },
        { value: "fas fa-heartbeat", label: "Health" },
        { value: "fas fa-graduation-cap", label: "Education" },
        { value: "fas fa-leaf", label: "Environment" },
        { value: "fas fa-road", label: "Infrastructure" },
        { value: "fas fa-map", label: "Map" },
        { value: "fas fa-building", label: "Building" }
    ];
    
    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    // Reset form
    const resetForm = () => {
        setFormData({
            id: null,
            name: '',
            description: '',
            color: '#3B82F6',
            icon: 'fas fa-database'
        });
        setErrors({});
    };
    
    // Show add modal
    const handleAddClick = () => {
        resetForm();
        setShowAddModal(true);
    };
    
    // Show edit modal
    const handleEditClick = (category) => {
        setSelectedCategory(category);
        setFormData({
            id: category.id,
            name: category.name,
            description: category.description,
            color: category.color,
            icon: category.icon
        });
        setShowEditModal(true);
    };
    
    // Show delete modal
    const handleDeleteClick = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };
    
    // Submit form (add or edit)
    const handleSubmit = (e, isEdit = false) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        
        // Validasi sederhana
        if (!formData.name.trim()) {
            setErrors({ name: 'Nama kategori harus diisi' });
            setProcessing(false);
            return;
        }
        
        // Simulasi proses simpan data
        setTimeout(() => {
            if (isEdit) {
                // Update category
                const updatedCategories = categories.map(category => 
                    category.id === formData.id 
                        ? { ...category, name: formData.name, description: formData.description, color: formData.color, icon: formData.icon }
                        : category
                );
                setCategories(updatedCategories);
                setShowEditModal(false);
                Swal.fire('Berhasil!', 'Kategori data berhasil diperbarui', 'success');
            } else {
                // Add new category
                const newCategory = {
                    id: categories.length + 1,
                    name: formData.name,
                    description: formData.description,
                    color: formData.color,
                    icon: formData.icon,
                    datasets: 0,
                    downloads: 0
                };
                setCategories([...categories, newCategory]);
                setShowAddModal(false);
                Swal.fire('Berhasil!', 'Kategori data berhasil ditambahkan', 'success');
            }
            
            resetForm();
            setProcessing(false);
        }, 1000);
    };
    
    // Confirm delete
    const confirmDelete = () => {
        // Simulasi proses hapus data
        setTimeout(() => {
            const updatedCategories = categories.filter(category => category.id !== selectedCategory.id);
            setCategories(updatedCategories);
            setShowDeleteModal(false);
            Swal.fire('Berhasil!', 'Kategori data berhasil dihapus', 'success');
        }, 500);
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Kategori Data
                </h2>
            }
        >
            <Head title="Kategori Data" />
            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Bagian Dashboard Kategori Data dengan tombol Tambah Kategori */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-bold mb-2">Dashboard Kategori Data</h3>

                                </div>
                                <div className="mt-4 sm:mt-0">
                                    <button 
                                        onClick={handleAddClick}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm transition-colors"
                                    >
                                        <i className="fas fa-plus mr-2"></i>Tambah Kategori
                                    </button>
                                </div>
                            </div>
                            
                            {/* Statistik Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {statsData.map((stat, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center">
                                            <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mr-4`}>
                                                <i className={`${stat.icon} text-white text-xl`}></i>
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                                                <div className="text-sm text-gray-600">{stat.title}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Daftar Kategori */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-medium text-gray-800">Daftar Kategori Data</h4>
                                    <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">Lihat Semua</a>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categories.map((category) => (
                                        <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: category.color + '20' }}>
                                                        <i className={`${category.icon} text-lg`} style={{ color: category.color }}></i>
                                                    </div>
                                                </div>
                                                <div className="ml-3 flex-1">
                                                    <h5 className="text-sm font-medium text-gray-900">{category.name}</h5>
                                                    <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                                                    <div className="mt-2 flex justify-between items-center">
                                                        <div className="flex space-x-3">
                                                            <span className="text-xs text-gray-500">
                                                                <i className="fas fa-database mr-1"></i> {category.datasets} dataset
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                <i className="fas fa-download mr-1"></i> {category.downloads}
                                                            </span>
                                                        </div>
                                                        <div className="flex space-x-1">
                                                            <button 
                                                                onClick={() => handleEditClick(category)}
                                                                className="text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteClick(category)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Grafik Distribusi Dataset - Enhanced Version */}
                            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-8">
                                <h4 className="font-medium text-gray-800 mb-6">Distribusi Dataset per Kategori</h4>
                                <div className="h-96 flex items-end space-x-3 px-6 bg-gray-50 rounded-lg py-6 mt-4 relative overflow-hidden">
                                    {categories.map((category, index) => {
                                        const maxValue = Math.max(...categories.map(c => c.datasets));
                                        const height = Math.max((category.datasets / maxValue) * 200, 25); // Minimum height 25px, max 200px
                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center group">
                                                {/* Bar */}
                                                <div className="relative w-full max-w-16 flex justify-center mb-4">
                                                    <div 
                                                        className="w-10 rounded-t-lg transition-all duration-300 group-hover:w-12 shadow-sm"
                                                        style={{ 
                                                            height: `${height}px`,
                                                            background: `linear-gradient(to top, ${category.color}, ${category.color}80)`,
                                                            border: `2px solid ${category.color}`
                                                        }}
                                                    >
                                                        {/* Value label on top of bar */}
                                                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                            {category.datasets} datasets
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Category info */}
                                                <div className="text-center">
                                                    <div className="flex justify-center mb-2">
                                                        <div 
                                                            className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                                                            style={{ backgroundColor: category.color + '20', border: `2px solid ${category.color}30` }}
                                                        >
                                                            <i className={`${category.icon} text-sm`} style={{ color: category.color }}></i>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-gray-600 font-medium mb-1 truncate">
                                                        {category.name}
                                                    </div>
                                                    <div className="text-xl font-bold text-gray-800">
                                                        {category.datasets}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        datasets
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Chart Legend */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {categories.map((category, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: category.color }}
                                                ></div>
                                                <span className="text-xs text-gray-600">{category.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* Summary Stats */}
                                <div className="mt-4 bg-blue-50 rounded-lg p-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                        <div>
                                            <div className="text-lg font-bold text-blue-800">{categories.reduce((sum, cat) => sum + cat.datasets, 0)}</div>
                                            <div className="text-xs text-blue-600">Total Dataset</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-green-800">{Math.max(...categories.map(c => c.datasets))}</div>
                                            <div className="text-xs text-green-600">Terbanyak</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-orange-800">{Math.min(...categories.map(c => c.datasets))}</div>
                                            <div className="text-xs text-orange-600">Tersedikit</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-purple-800">{Math.round(categories.reduce((sum, cat) => sum + cat.datasets, 0) / categories.length)}</div>
                                            <div className="text-xs text-purple-600">Rata-rata</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Informasi Fitur */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <i className="fas fa-info-circle text-blue-400 text-xl"></i>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">Fitur Manajemen Kategori Data</h3>
                                        <div className="mt-2 text-sm text-blue-700">
                                            <p>Halaman ini berisi fitur untuk mengelola kategori data portal. Anda dapat menambah, mengedit, menghapus, dan memantau statistik kategori data.</p>
                                        </div>
                                        <div className="mt-4">
                                            <div className="-mx-2 -my-1.5 flex">
                                                <button
                                                    type="button"
                                                    className="bg-blue-100 text-blue-800 rounded-md px-3 py-1.5 text-sm font-medium hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    Pelajari Lebih Lanjut
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Modal Tambah Kategori */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah Kategori Baru</h3>
                    <form onSubmit={(e) => handleSubmit(e, false)}>
                        <div className="mb-4">
                            <InputLabel htmlFor="name" value="Nama Kategori" required={true} />
                            <TextInput
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full"
                                placeholder="Masukkan nama kategori"
                                required
                            />
                            {errors.name && <InputError message={errors.name} className="mt-2" />}
                        </div>
                        
                        <div className="mb-4">
                            <InputLabel htmlFor="description" value="Deskripsi" />
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Masukkan deskripsi kategori"
                            ></textarea>
                        </div>
                        
                        <div className="mb-4">
                            <InputLabel htmlFor="color" value="Warna" />
                            <div className="mt-1 flex items-center">
                                <input 
                                    type="color" 
                                    id="color" 
                                    name="color" 
                                    value={formData.color} 
                                    onChange={handleInputChange}
                                    className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer" 
                                />
                                <TextInput 
                                    value={formData.color} 
                                    onChange={handleInputChange} 
                                    name="color" 
                                    className="ml-3 flex-1" 
                                    placeholder="#3B82F6" 
                                />
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <InputLabel htmlFor="icon" value="Ikon" />
                            <select
                                id="icon"
                                name="icon"
                                value={formData.icon}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {icons.map((icon, index) => (
                                    <option key={index} value={icon.value}>{icon.label}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <SecondaryButton type="button" onClick={() => setShowAddModal(false)} disabled={processing}>
                                Batal
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
            
            {/* Modal Edit Kategori */}
            <Modal show={showEditModal} onClose={() => setShowEditModal(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Kategori</h3>
                    <form onSubmit={(e) => handleSubmit(e, true)}>
                        <div className="mb-4">
                            <InputLabel htmlFor="name" value="Nama Kategori" required={true} />
                            <TextInput
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full"
                                placeholder="Masukkan nama kategori"
                                required
                            />
                            {errors.name && <InputError message={errors.name} className="mt-2" />}
                        </div>
                        
                        <div className="mb-4">
                            <InputLabel htmlFor="description" value="Deskripsi" />
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Masukkan deskripsi kategori"
                            ></textarea>
                        </div>
                        
                        <div className="mb-4">
                            <InputLabel htmlFor="color" value="Warna" />
                            <div className="mt-1 flex items-center">
                                <input 
                                    type="color" 
                                    id="color" 
                                    name="color" 
                                    value={formData.color} 
                                    onChange={handleInputChange}
                                    className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer" 
                                />
                                <TextInput 
                                    value={formData.color} 
                                    onChange={handleInputChange} 
                                    name="color" 
                                    className="ml-3 flex-1" 
                                    placeholder="#3B82F6" 
                                />
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <InputLabel htmlFor="icon" value="Ikon" />
                            <select
                                id="icon"
                                name="icon"
                                value={formData.icon}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {icons.map((icon, index) => (
                                    <option key={index} value={icon.value}>{icon.label}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex justify-end gap-3">
                            <SecondaryButton type="button" onClick={() => setShowEditModal(false)} disabled={processing}>
                                Batal
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={processing}>
                                {processing ? 'Memperbarui...' : 'Update Kategori'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
            
            {/* Modal Hapus Kategori */}
            <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Hapus Kategori</h3>
                    <p className="text-gray-600 mb-6">
                        Apakah Anda yakin ingin menghapus kategori "{selectedCategory?.name}"? Tindakan ini tidak dapat dibatalkan.
                    </p>
                    <div className="flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={() => setShowDeleteModal(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            type="button"
                            onClick={confirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus Kategori
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}