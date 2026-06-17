import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Checkbox from "@/Components/Checkbox";

export default function Create({ auth, permissions }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        permissions: [],
    });

    const handleCheckboxChange = (e) => {
        const permissionName = e.target.name;
        if (e.target.checked) {
            setData("permissions", [...data.permissions, permissionName]);
        } else {
            setData(
                "permissions",
                data.permissions.filter((p) => p !== permissionName)
            );
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.roles.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tambah Role Baru
                </h2>
            }
        >
            <Head title="Tambah Role" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor="name"
                                        value="Nama Role"
                                    />
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        autoComplete="name"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <InputLabel value="Permissions" />
                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {permissions.map((permission) => (
                                            <label
                                                key={permission.id}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    name={permission.name}
                                                    checked={data.permissions.includes(
                                                        permission.name
                                                    )}
                                                    onChange={
                                                        handleCheckboxChange
                                                    }
                                                />
                                                <span className="ml-2 text-sm text-gray-600">
                                                    {permission.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError
                                        message={errors.permissions}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <PrimaryButton
                                        className="ml-4"
                                        disabled={processing}
                                    >
                                        Simpan
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
