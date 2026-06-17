import React from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import UserForm from "./Partials/UserForm";

export default function Create({ auth, roles }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tambah Pengguna Baru
                </h2>
            }
        >
            <Head title="Tambah Pengguna Baru" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <UserForm
                                roles={roles}
                                submitRoute={route("admin.users.store")}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
