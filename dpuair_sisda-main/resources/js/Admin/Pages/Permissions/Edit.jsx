import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Edit({ auth, permission }) {
    const { data, setData, put, processing, errors } = useForm({
        name: permission.name || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.permissions.update", permission.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Hak Akses
                </h2>
            }
        >
            <Head title="Edit Hak Akses" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit}>
                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor="name"
                                        value="Nama Hak Akses"
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

                                <div className="flex items-center justify-end mt-4">
                                    <Link
                                        href={route("admin.permissions.index")}
                                    >
                                        <SecondaryButton className="mr-4">
                                            Batal
                                        </SecondaryButton>
                                    </Link>
                                    <PrimaryButton
                                        className="ml-4"
                                        disabled={processing}
                                    >
                                        Simpan Perubahan
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
