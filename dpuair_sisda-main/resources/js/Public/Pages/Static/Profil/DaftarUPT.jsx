import { Head } from "@inertiajs/react";
import GuestLayout from "../../../Layouts/GuestLayout";

export default function DaftarUPT() {
    const uptList = [
        {
            id: 1,
            name: "UPT PSDA WS Sampean Setail Bondowoso",
            location: "Bondowoso",
            address: "Jl. Raya Bondowoso",
            phone: "(0332) 421234",
            coverage: "Wilayah Sungai Sampean Setail",
        },
        {
            id: 2,
            name: "UPT PSDA WS Bondoyudo Lumajang",
            location: "Lumajang",
            address: "Jl. Raya Lumajang",
            phone: "(0334) 881234",
            coverage: "Wilayah Sungai Bondoyudo",
        },
        {
            id: 3,
            name: "UPT PSDA WS Welang Pekalen Pasuruan",
            location: "Pasuruan",
            address: "Jl. Raya Pasuruan",
            phone: "(0343) 421234",
            coverage: "Wilayah Sungai Welang Pekalen",
        },
        {
            id: 4,
            name: "UPT PSDA WS Kepulauan Madura Pamekasan",
            location: "Pamekasan",
            address: "Jl. Raya Pamekasan",
            phone: "(0324) 321234",
            coverage: "Wilayah Sungai Kepulauan Madura",
        },
        {
            id: 5,
            name: "UPT PSDA WS Bengawan Solo Bojonegoro",
            location: "Bojonegoro",
            address: "Jl. Raya Bojonegoro",
            phone: "(0353) 881234",
            coverage: "Wilayah Sungai Bengawan Solo",
        },
        {
            id: 6,
            name: "UPT PSDA WS Brantas Kediri",
            location: "Kediri",
            address: "Jl. Raya Kediri",
            phone: "(0354) 681234",
            coverage: "Wilayah Sungai Brantas",
        },
    ];

    return (
        <GuestLayout>
            <Head>
                <title>Daftar UPT</title>
                <meta
                    name="description"
                    content="Daftar Unit Pelaksana Teknis (UPT) Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur"
                />
            </Head>

            {/* Hero Section */}
            <section className="relative bg-[#173c94] py-24 lg:py-32 overflow-hidden">
                {/* Background Logo Watermark */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 opacity-5">
                    <img
                        src="/assets/images/PUSDAJATIM_WHITE_LOGO.png"
                        alt=""
                        className="w-full h-full object-contain"
                    />
                </div>

                <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
                            Unit Pelaksana Teknis
                        </h1>
                        <div className="w-16 h-px bg-white mb-8"></div>
                        <p className="text-xl text-white/80 leading-relaxed">
                            Unit Pelaksana Teknis PSDA WS di berbagai wilayah
                            sungai Provinsi Jawa Timur
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 bg-white">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="space-y-8">
                        {uptList.map((upt, index) => (
                            <div
                                key={upt.id}
                                className="border-b border-gray-200 last:border-b-0 pb-8 last:pb-0"
                            >
                                <div className="flex items-start gap-6">
                                    {/* Number */}
                                    <div className="flex-shrink-0 w-8 text-center">
                                        <span className="text-lg font-bold text-gray-400">
                                            {index + 1}.
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 space-y-4">
                                        {/* Title */}
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {upt.name}
                                        </h3>

                                        {/* Details */}
                                        <div className="grid md:grid-cols-2 gap-4 text-gray-600">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 mb-1">
                                                    Lokasi
                                                </p>
                                                <p>{upt.location}</p>
                                            </div>
                                            <div className="md:col-span-2">
                                                <p className="text-sm font-bold text-gray-900 mb-1">
                                                    Cakupan Wilayah
                                                </p>
                                                <p>{upt.coverage}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
