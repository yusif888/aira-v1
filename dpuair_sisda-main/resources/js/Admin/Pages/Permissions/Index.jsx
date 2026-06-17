import React, { useState } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DataTable from "@/Admin/Components/DataTable";
import FilterBar from "@/Admin/Components/FilterBar";
import EmptyState from "@/Admin/Components/EmptyState";

export default function Index({ auth, permissions }) {
    // State untuk filter
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPermissions, setFilteredPermissions] = useState(
        permissions.data
    );
    const [showFilters, setShowFilters] = useState(false);

    // Filter permissions berdasarkan search term
    React.useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredPermissions(permissions.data);
        } else {
            const filtered = permissions.data.filter((permission) =>
                permission.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredPermissions(filtered);
        }
    }, [searchTerm, permissions.data]);

    const handleFilterChange = (field, value) => {
        if (field === "search") {
            setSearchTerm(value);
        }
    };

    const handleReset = () => {
        setSearchTerm("");
    };

    function destroy(id) {
        if (confirm("Apakah Anda yakin ingin menghapus hak akses ini?")) {
            router.delete(route("admin.permissions.destroy", id));
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Hak Akses
                </h2>
            }
        >
            <Head title="Manajemen Hak Akses" />

            <div className="py-6">
                <div className="max-w-screen mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Daftar Hak Akses
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
                                    <Link
                                        href={route("admin.permissions.create")}
                                    >
                                        <PrimaryButton>
                                            Tambah Hak Akses
                                        </PrimaryButton>
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
                                        searchPlaceholder="Cari nama permission..."
                                        showSearch={true}
                                        showCategory={false}
                                        showStatus={false}
                                        totalItems={filteredPermissions.length}
                                        itemLabel="permission"
                                        gridCols="md:grid-cols-3"
                                        searchColSpan="md:col-span-2"
                                        variant="detailed"
                                    />
                                </div>
                            )}

                            <DataTable
                                columns={[
                                    {
                                        key: "name",
                                        label: "Nama",
                                        render: (item) => (
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.name}
                                            </div>
                                        ),
                                    },
                                ]}
                                data={filteredPermissions}
                                actions={[
                                    {
                                        key: "edit",
                                        title: "Edit",
                                        icon: "fas fa-edit",
                                        href: (item) =>
                                            route(
                                                "admin.permissions.edit",
                                                item.id
                                            ),
                                    },
                                    {
                                        key: "delete",
                                        title: "Hapus",
                                        icon: "fas fa-trash",
                                        variant: "danger",
                                    },
                                ]}
                                onActionClick={(action, item) => {
                                    if (action === "delete") {
                                        destroy(item.id);
                                    }
                                }}
                                emptyState={
                                    <EmptyState
                                        icon="fas fa-key"
                                        title="Tidak ada permission tersedia"
                                        description="Belum ada permission yang ditambahkan. Mulai dengan menambahkan permission pertama Anda."
                                        actionLink={route(
                                            "admin.permissions.create"
                                        )}
                                        actionText="Tambah Permission Pertama"
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
