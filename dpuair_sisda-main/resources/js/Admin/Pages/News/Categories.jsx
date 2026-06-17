import React, { useState } from 'react';
import AuthenticatedLayout from '@/Admin/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import FilterBar from '@/Admin/Components/FilterBar';
import EmptyState from '@/Admin/Components/EmptyState';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import ModalForm from '@/Admin/Components/ModalForm';
import DataCard, { DataCardGrid } from '@/Admin/Components/DataCard';
import Pagination from '@/Admin/Components/Pagination';
import { confirmPermanentDelete, showSuccessModal, showError, confirmEdit } from '@/Components/SweetAlert';

export default function Categories({ auth, categories = [], filters = {} }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        search: filters?.search || '',
        per_page: filters?.per_page || '6',
        name: '',
        description: ''
    });

    // State search terpisah (sinkron dengan filters)
    const [searchInput, setSearchInput] = useState(filters?.search || data.search || '');

    useEffect(() => {
        setSearchInput(filters?.search || '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters?.search]);

    // Debounce autosubmit search
    useEffect(() => {
        if (!searchInput && !filters.search) return;
        if (searchInput === filters.search) return;

        const timeoutId = setTimeout(() => {
            router.get(
                route('admin.news.categories'),
                { ...filters, search: searchInput, page: 1 },
                { preserveState: true, preserveScroll: true }
            );
        }, 500);

        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    const handleCreate = () => {
        setShowCreateModal(true);
        reset();
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setData('name', category.name || '');
        setData('description', category.description || '');
        setShowEditModal(true);
    };

    const handleDelete = (categoryItem) => {
        confirmPermanentDelete(categoryItem?.name, 'kategori', 20).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.news.categories.destroy", categoryItem.id), {
                    onSuccess: () => {
                        showSuccessModal(categoryItem?.name, 'berhasil dihapus', 'kategori', 20);
                    },
                    onError: (errors) => {
                        let errorMessage = 'Terjadi kesalahan saat menghapus kategori.';
                        if (errors?.message) {
                            errorMessage = errors.message;
                        } else if (typeof errors === 'string') {
                            errorMessage = errors;
                        } else if (errors?.error) {
                            errorMessage = errors.error;
                        }
                        showError(errorMessage, 'Gagal Menghapus Kategori!');
                    }
                });
            }
        });
    };

    const submitCreate = (e) => {
        e.preventDefault();
        post(route('admin.news.categories.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
                showSuccessModal(data.name, 'berhasil ditambahkan', 'kategori', 15);
                router.get(route('admin.news.categories'), {}, {
                    preserveState: false,
                    preserveScroll: false
                });
            },
            onError: (errors) => {
                let errorMessage = 'Terjadi kesalahan saat menambahkan kategori.';
                if (errors?.name) {
                    if (errors.name.includes('unique')) {
                        errorMessage = 'Kategori dengan nama ini sudah ada! Silakan gunakan nama yang berbeda.';
                    } else {
                        errorMessage = errors.name;
                    }
                } else if (errors?.message) {
                    errorMessage = errors.message;
                } else if (typeof errors === 'string') {
                    errorMessage = errors;
                } else if (errors?.error) {
                    errorMessage = errors.error;
                }
                showError(errorMessage, 'Gagal Menambahkan Kategori!');
            }
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        confirmEdit(selectedCategory?.name, data.name, 'kategori', 20).then((result) => {
            if (result.isConfirmed) {
                put(route('admin.news.categories.update', selectedCategory.id), {
                    onSuccess: () => {
                        setShowEditModal(false);
                        setSelectedCategory(null);
                        reset();
                        showSuccessModal(`${selectedCategory?.name} berhasil diubah menjadi ${data.name}`, 'berhasil diubah', 'kategori', 15);
                        router.get(route('admin.news.categories'), {}, {
                            preserveState: false,
                            preserveScroll: false
                        });
                    },
                    onError: (errors) => {
                        let errorMessage = 'Terjadi kesalahan saat mengubah kategori.';
                        if (errors?.name) {
                            if (errors.name.includes('unique')) {
                                errorMessage = 'Kategori dengan nama ini sudah ada! Silakan gunakan nama yang berbeda.';
                            } else {
                                errorMessage = errors.name;
                            }
                        } else if (errors?.message) {
                            errorMessage = errors.message;
                        } else if (typeof errors === 'string') {
                            errorMessage = errors;
                        } else if (errors?.error) {
                            errorMessage = errors.error;
                        }
                        showError(errorMessage, 'Gagal Mengubah Kategori!');
                    }
                });
            }
        });
    };

    const filteredCategories = categories?.data || [];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Kategori Berita
                </h2>
            }
        >
            <Head title="Kategori Berita" />
            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">Manajemen Kategori Berita</h2>
                                    <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                        <SecondaryButton
                                            onClick={() => setShowFilters(!showFilters)}
                                            className="flex items-center gap-2"
                                        >
                                            <i className={`fas ${showFilters ? "fa-times" : "fa-filter"}`}></i>
                                            {showFilters ? "Sembunyikan Filter" : "Filter"}
                                        </SecondaryButton>
                                        <PrimaryButton onClick={handleCreate} className="whitespace-nowrap flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-colors duration-200">
                                            <i className="fas fa-plus"></i>Tambah Kategori
                                        </PrimaryButton>
                                    </div>
                                </div>

                                {/* Filters */}
                                {showFilters && (
                                    <div className="filter-slide-in">
                                        <FilterBar
                                            variant="compact"
                                            gridCols="md:grid-cols-2"
                                            searchColSpan="md:col-span-1"
                                            filters={data}
                                            onFilterChange={(key, value) => {
                                                setData(key, value);
                                                router.get(route('admin.news.categories'), { 
                                                    ...data, 
                                                    [key]: value 
                                                }, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                    replace: true,
                                                });
                                            }}
                                            searchPlaceholder="Cari kategori..."
                                            showPageSelector={true}
                                            pageSelectorOptions={[5, 10, 25, 50, 100]}
                                            showTotal={true}
                                            totalItems={categories.total || 0}
                                            itemLabel="kategori"
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

                                {filteredCategories.length > 0 ? (
                                    <DataCardGrid gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" gap="gap-4" className="mt-6">
                                        {filteredCategories.map((category, index) => (
                                            <DataCard
                                                key={category.id}
                                                item={category}
                                                index={index}
                                                icon="fas fa-folder"
                                                title={category.name}
                                                description={category.description}
                                                count={category.articles_count}
                                                countLabel="berita"
                                                isProtected={category.articles_count > 0}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                                editColor="text-blue-600 hover:text-blue-800"
                                                disabledDelete={category.articles_count > 0}
                                                cardStyle="bg-gray-50 hover:shadow-md"
                                            />
                                        )
                                    )}
                                </DataCardGrid>
                            ) : searchInput ? (
                                <EmptyState
                                    icon="fas fa-search"
                                    title="Tidak ditemukan"
                                    description={`Tidak ada kategori yang cocok dengan "${searchInput}".`}
                                    actionButton={
                                        <SecondaryButton
                                            onClick={() =>
                                                setData("search", "")
                                            }
                                        >
                                            <i className="fas fa-times mr-2"></i>
                                            Clear Search
                                        </SecondaryButton>
                                    }
                                />
                            ) : (
                                <EmptyState
                                    icon="fas fa-folder"
                                    title="Belum ada kategori"
                                    description="Mulai dengan menambahkan kategori pertama untuk membantu mengkategorikan berita Anda."
                                    actionButton={
                                        <PrimaryButton
                                            onClick={handleCreate}
                                            className="bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            <i className="fas fa-plus mr-2"></i>
                                            Tambah Kategori Pertama
                                        </PrimaryButton>
                                    }
                                />
                            )}

                                {/* Pagination */}
                                {categories.data && categories.data.length > 0 && (
                                    <div className="mt-6">
                                        <Pagination
                                            pagination={categories}
                                            showInfo={true}
                                            routeName="admin.news.categories"
                                            filters={data}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Kategori */}
            <ModalForm
                show={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Tambah Kategori Baru"
                formData={data}
                setFormData={setData}
                onSubmit={submitCreate}
                processing={processing}
                errors={errors}
                fields={[
                    {
                        name: 'name',
                        label: 'Nama Kategori',
                        type: 'text',
                        placeholder: 'Contoh: Pembangunan & Infrastruktur',
                        required: true
                    },
                    {
                        name: 'description',
                        label: 'Deskripsi',
                        type: 'textarea',
                        placeholder: 'Deskripsi singkat tentang kategori ini...',
                        required: false
                    }
                ]}
                submitText="Simpan Kategori"
                cancelText="Batal"
            />

            {/* Modal Edit Kategori */}
            <ModalForm
                show={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedCategory(null);
                    reset();
                }}
                title="Edit Kategori"
                formData={data}
                setFormData={setData}
                onSubmit={submitEdit}
                processing={processing}
                errors={errors}
                fields={[
                    {
                        name: 'name',
                        label: 'Nama Kategori',
                        type: 'text',
                        placeholder: 'Contoh: Pembangunan & Infrastruktur',
                        required: true
                    },
                    {
                        name: 'description',
                        label: 'Deskripsi',
                        type: 'textarea',
                        placeholder: 'Deskripsi singkat tentang kategori ini...',
                        required: false
                    }
                ]}
                submitText="Update Kategori"
                cancelText="Batal"
            />
        </AuthenticatedLayout>
    );
}