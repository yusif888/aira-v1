import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Checkbox from "@/Components/Checkbox";

export default function UserForm({
    user = null,
    roles,
    submitRoute,
    method = "post",
}) {
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        password_confirmation: "",
        roles: user?.roles || [],
        _method: method,
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const submitAction = method === "patch" ? patch : post;
        submitAction(submitRoute, {
            onSuccess: () => reset("password", "password_confirmation"),
        });
    };

    const handleRoleChange = (e) => {
        const roleName = e.target.name;
        if (e.target.checked) {
            setData("roles", [...data.roles, roleName]);
        } else {
            setData(
                "roles",
                data.roles.filter((r) => r !== roleName)
            );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <InputLabel htmlFor="name" value="Nama" />
                <TextInput
                    id="name"
                    name="name"
                    value={data.name}
                    className="mt-1 block w-full"
                    autoComplete="name"
                    isFocused={true}
                    onChange={(e) => setData("name", e.target.value)}
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="email" value="Email" />
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    autoComplete="username"
                    onChange={(e) => setData("email", e.target.value)}
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
                <InputLabel
                    htmlFor="password"
                    value={user ? "Password Baru (Opsional)" : "Password"}
                />
                <TextInput
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    onChange={(e) => setData("password", e.target.value)}
                />
                <InputError message={errors.password} className="mt-2" />
            </div>

            <div>
                <InputLabel
                    htmlFor="password_confirmation"
                    value={
                        user
                            ? "Konfirmasi Password Baru"
                            : "Konfirmasi Password"
                    }
                />
                <TextInput
                    id="password_confirmation"
                    type="password"
                    name="password_confirmation"
                    value={data.password_confirmation}
                    className="mt-1 block w-full"
                    autoComplete="new-password"
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                />
                <InputError
                    message={errors.password_confirmation}
                    className="mt-2"
                />
            </div>

            <div>
                <InputLabel value="Roles" />
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {roles.map((role) => (
                        <label key={role.id} className="flex items-center">
                            <Checkbox
                                name={role.name}
                                checked={data.roles.includes(role.name)}
                                onChange={handleRoleChange}
                            />
                            <span className="ms-2 text-sm text-gray-600">
                                {role.name}
                            </span>
                        </label>
                    ))}
                </div>
                <InputError message={errors.roles} className="mt-2" />
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>
                    {user ? "Simpan Perubahan" : "Buat Pengguna"}
                </PrimaryButton>

                <SecondaryButton
                    type="button"
                    onClick={() => window.history.back()}
                >
                    Batal
                </SecondaryButton>
            </div>
        </form>
    );
}
