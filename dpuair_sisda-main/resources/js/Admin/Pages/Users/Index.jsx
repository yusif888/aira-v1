import React, { useState } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import DataTable from "@/Admin/Components/DataTable";
import FilterBar from "@/Admin/Components/FilterBar";
import EmptyState from "@/Admin/Components/EmptyState";
import { format } from "date-fns";
import id from "date-fns/locale/id/index.js";
import { confirmDelete } from "@/Components/SweetAlert";

export default function Index({ auth, users }) {
    // State untuk filter
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users.data);
    const [showFilters, setShowFilters] = useState(false);

    // Filter users berdasarkan search term
    React.useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredUsers(users.data);
        } else {
            const filtered = users.data.filter(
                (user) =>
                    user.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchTerm, users.data]);

    const handleFilterChange = (field, value) => {
        if (field === "search") {
            setSearchTerm(value);
        }
    };

    const handleReset = () => {
        setSearchTerm("");
    };

    function destroy(user) {
        confirmDelete(user.name, "pengguna").then((result) => {
            if (result.isConfirmed) {
                router.delete(route("admin.users.destroy", user.id), {
                    preserveScroll: true,
                });
            }
        });
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Pengguna
                </h2>
            }
        >
            <Head title="Manajemen Pengguna" />

            <div className="py-6">
                <div className="max-w-full mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Daftar Pengguna
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
                                    <Link href={route("admin.users.create")}>
                                        <PrimaryButton>
                                            Tambah Pengguna
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
                                        searchPlaceholder="Cari nama atau email..."
                                        showSearch={true}
                                        showCategory={false}
                                        showStatus={false}
                                        totalItems={filteredUsers.length}
                                        itemLabel="pengguna"
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
                                        label: "Nama Pengguna",
                                        render: (item) => (
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.name}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "roles",
                                        label: "Role",
                                        render: (item) => (
                                            <div className="flex flex-wrap gap-1">
                                                {item.roles &&
                                                item.roles.length > 0 ? (
                                                    item.roles.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                                                        >
                                                            {role.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-500">
                                                        -
                                                    </span>
                                                )}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "email",
                                        label: "Email",
                                        render: (item) => (
                                            <div className="text-sm text-gray-500">
                                                {item.email}
                                            </div>
                                        ),
                                    },
                                    {
                                        key: "created_at",
                                        label: "Tanggal Bergabung",
                                        render: (item) => (
                                            <div className="text-sm text-gray-500">
                                                {format(
                                                    new Date(item.created_at),
                                                    "d MMMM yyyy, HH:mm",
                                                    { locale: id }
                                                )}
                                            </div>
                                        ),
                                    },
                                ]}
                                data={filteredUsers}
                                actions={[
                                    {
                                        key: "edit",
                                        title: "Edit",
                                        icon: "fas fa-edit",
                                        href: (item) =>
                                            route("admin.users.edit", item.id),
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
                                        destroy(item);
                                    }
                                }}
                                emptyState={
                                    <EmptyState
                                        icon="fas fa-users"
                                        title="Tidak ada pengguna tersedia"
                                        description="Belum ada pengguna yang ditambahkan. Mulai dengan menambahkan pengguna pertama Anda."
                                        actionLink={route("admin.users.create")}
                                        actionText="Tambah Pengguna Pertama"
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
