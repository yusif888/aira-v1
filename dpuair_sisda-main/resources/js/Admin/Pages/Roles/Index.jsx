import React, { useState } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DataTable from "@/Admin/Components/DataTable";
import FilterBar from "@/Admin/Components/FilterBar";
import EmptyState from "@/Admin/Components/EmptyState";

export default function Index({ auth, roles }) {
    // State untuk filter
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRoles, setFilteredRoles] = useState(roles.data);
    const [showFilters, setShowFilters] = useState(false);
    
    // Filter roles berdasarkan search term
    React.useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredRoles(roles.data);
        } else {
            const filtered = roles.data.filter(role =>
                role.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRoles(filtered);
        }
    }, [searchTerm, roles.data]);
    
    const handleFilterChange = (field, value) => {
        if (field === 'search') {
            setSearchTerm(value);
        }
    };
    
    const handleReset = () => {
        setSearchTerm('');
    };
    
    function destroy(id) {
        if (confirm("Apakah Anda yakin ingin menghapus role ini?")) {
            router.delete(route("admin.roles.destroy", id));
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Role
                </h2>
            }
        >
            <Head title="Manajemen Role" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Daftar Role
                                </h3>
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
                                    <Link href={route("admin.roles.create")}>
                                        <PrimaryButton>Tambah Role</PrimaryButton>
                                    </Link>
                                </div>
                            </div>

                            {/* Filters */}
                            {showFilters && (
                                <div className="filter-slide-in">
                                    <FilterBar
                                        filters={{ search: searchTerm }}
                                        onFilterChange={handleFilterChange}
                                        onReset={handleReset}
                                        searchPlaceholder="Cari nama role..."
                                        showSearch={true}
                                        showCategory={false}
                                        showStatus={false}
                                        totalItems={filteredRoles.length}
                                        itemLabel="role"
                                        gridCols="md:grid-cols-3"
                                        searchColSpan="md:col-span-2"
                                        variant="detailed"
                                    />
                                </div>
                            )}

                            <DataTable
                                columns={[
                                    {
                                        key: 'name',
                                        label: 'Nama Role',
                                        render: (item) => (
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.name}
                                            </div>
                                        )
                                    },
                                    {
                                        key: 'permissions',
                                        label: 'Permissions',
                                        render: (item) => (
                                            <div className="flex flex-wrap gap-1">
                                                {item.permissions.map((permission) => (
                                                    <span
                                                        key={permission.id}
                                                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                                                    >
                                                        {permission.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )
                                    }
                                ]}
                                data={filteredRoles}
                                actions={[
                                    {
                                        key: 'edit',
                                        title: 'Edit',
                                        icon: 'fas fa-edit',
                                        href: (item) => route("admin.roles.edit", item.id)
                                    },
                                    {
                                        key: 'delete',
                                        title: 'Hapus',
                                        icon: 'fas fa-trash',
                                        variant: 'danger'
                                    }
                                ]}
                                onActionClick={(action, item) => {
                                    if (action === 'delete') {
                                        destroy(item.id);
                                    }
                                }}
                                emptyState={
                                    <EmptyState
                                        icon="fas fa-user-shield"
                                        title="Tidak ada role tersedia"
                                        description="Belum ada role yang ditambahkan. Mulai dengan menambahkan role pertama Anda."
                                        actionLink={route("admin.roles.create")}
                                        actionText="Tambah Role Pertama"
                                        actionIcon="fas fa-plus"
                                    />
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
