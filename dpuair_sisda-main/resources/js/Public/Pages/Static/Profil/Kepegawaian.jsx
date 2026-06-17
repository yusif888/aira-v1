import { Head } from "@inertiajs/react";
import GuestLayout from "../../../Layouts/GuestLayout";

export default function Kepegawaian() {
    return (
        <GuestLayout>
            <Head>
                <title>Profil Kepegawaian</title>
                <meta
                    name="description"
                    content="Profil kepegawaian Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur"
                />
            </Head>

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Profil Kepegawaian
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Informasi mengenai profil kepegawaian di Dinas
                            Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
                        <div className="prose prose-lg max-w-none">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Data Kepegawaian
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                <div className="bg-blue-50 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                        Total Pegawai
                                    </h3>
                                    <p className="text-3xl font-bold text-blue-600">
                                        XXX Orang
                                    </p>
                                </div>

                                <div className="bg-green-50 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                                        PNS
                                    </h3>
                                    <p className="text-3xl font-bold text-green-600">
                                        XXX Orang
                                    </p>
                                </div>

                                <div className="bg-orange-50 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-orange-900 mb-2">
                                        Non-PNS
                                    </h3>
                                    <p className="text-3xl font-bold text-orange-600">
                                        XXX Orang
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl">
                                <p className="text-gray-600 text-center">
                                    <em>
                                        Data kepegawaian akan diperbarui secara
                                        berkala
                                    </em>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
