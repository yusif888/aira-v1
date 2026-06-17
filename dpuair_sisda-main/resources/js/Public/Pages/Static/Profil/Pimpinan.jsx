import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function Pimpinan() {
    const pimpinanList = [
        {
            id: 1,
            name: "I Nyoman Gunadi, S.T., M.T.",
            position: "Plt. Kepala Dinas",
            subordinates: [],
        },
        {
            id: 2,
            name: "Ir. Fauzy Nasruddin, S.T., M.Sc.",
            position: "Sekretaris Dinas",
            subordinates: [
                {
                    name: "Endah Prihatin Wachyuningsari, SE.",
                    position: "Kepala Sub Bagian Umum dan Kepegawaian",
                },
                {
                    name: "A'an Yulianto, S.IP., M.M.",
                    position: "Ketua Tim Kerja",
                },
                { name: "Kisnanto Satriyo, S.T.", position: "Ketua Tim Kerja" },
            ],
        },
        {
            id: 3,
            name: "Ir. Novita Andrianie, S.T., M.T.",
            position: "Kepala Bidang Perencanaan Sumber Daya Air",
            subordinates: [
                {
                    name: "Ir. Catur Arik Kurniawati, ST., M.Eng.",
                    position:
                        "Kepala Seksi Hidrologi dan Pemantauan Kualitas Air",
                },
                {
                    name: "Agung Wirawan Pradana, ST., M.T.",
                    position: "Kepala Seksi Perencanaan Umum",
                },
                {
                    name: "Ir. Arif Wahyu Kristianto, S.T., M.T.",
                    position: "Ketua Tim Kerja",
                },
            ],
        },
        {
            id: 4,
            name: "Mohammad Waziruddin, S.T., M.M.",
            position: "Kepala Bidang Sungai, Waduk, dan Pantai",
            subordinates: [
                {
                    name: "Ir. Ali Mukhtar, S.T., M.T.",
                    position:
                        "Kepala Seksi Rehabilitasi dan Pembangunan Sungai, Waduk dan Pantai",
                },
                {
                    name: "Dian Dwi Ernawati, ST., MT.",
                    position: "Kepala Seksi Operasi Sungai, Waduk dan Pantai",
                },
                { name: "Ir. Amos Sangka, SP.", position: "Ketua Tim Kerja" },
            ],
        },
        {
            id: 5,
            name: "Anton Dharma Pusaka Mas, S.T., M.T.",
            position: "Plt. Kepala Bidang Irigasi",
            subordinates: [
                {
                    name: "Annas Wibowo, S.T., M.T.",
                    position: "Kepala Seksi Operasi Jaringan Irigasi",
                },
                {
                    name: "Ir. Titin Suhartini, S.T., M.T.",
                    position: "Kepala Seksi Pemeliharaan Jaringan Irigasi",
                },
                {
                    name: "Ir. Diah Asri Sawitri, S.T., M.T.",
                    position: "Ketua Tim Kerja",
                },
            ],
        },
        {
            id: 6,
            name: "Ruse Rante Pademme, S.H., M.H.",
            position: "Kepala Bidang Bina Manfaat",
            subordinates: [
                {
                    name: "Ir. Krisdian Marta Fitri Englando, A.Md.LLAJ., S.T., M.T.",
                    position: "Kepala Seksi Pemanfaatan dan Pengelolaan Aset",
                },
                {
                    name: "Ari Pudji Astono, S.Sos.",
                    position: "Ketua Tim Kerja",
                },
            ],
        },
        {
            id: 7,
            name: "Ir. Anton Daniswara, S.T.",
            position: "Plt. Kepala UPT PSDA WS Brantas di Kediri",
            subordinates: [
                {
                    name: "Ir. Tri Wuryani, S.T., M.T.",
                    position: "Kepala Sub Bagian Tata Usaha",
                },
                {
                    name: "Arra Misrokhis Amik, S.T., M.T.",
                    position: "Kepala Seksi Operasi",
                },
                {
                    name: "Ir. Cahyo Handono, S.T., M.PSDA.",
                    position: "Kepala Seksi Pemeliharaan dan Rehabilitasi",
                },
            ],
        },
        {
            id: 8,
            name: "Ir. Zacharia Oesman, M.T.",
            position: "Kepala UPT PSDA WS Bengawan Solo di Bojonegoro",
            subordinates: [
                {
                    name: "Andik Handoko, S.T., M.T.",
                    position: "Kepala Sub Bagian Tata Usaha",
                },
                {
                    name: "Teguh Prasetyo, S.T.",
                    position: "Kepala Seksi Operasi",
                },
                {
                    name: "Aswin Prasetiyanto, S.T.",
                    position: "Kepala Seksi Pemeliharaan dan Rehabilitasi",
                },
            ],
        },
        {
            id: 9,
            name: "Ir. Prabowo, S.T., M.T.",
            position: "Plt. Kepala UPT PSDA WS Sampean Setail di Bondowoso",
            subordinates: [
                {
                    name: "Dewi Sri Lestari, S.E.",
                    position: "Kepala Sub Bagian Tata Usaha",
                },
                {
                    name: "Irma Enggarwati, S.T.P.",
                    position: "Kepala Seksi Operasi",
                },
                {
                    name: "Prorida Sari, S.T., M.Eng.",
                    position: "Kepala Seksi Pemeliharaan dan Rehabilitasi",
                },
            ],
        },
        {
            id: 10,
            name: "Ir. Prabowo, S.T., M.T.",
            position: "Kepala UPT PSDA WS Bondoyudo Baru di Lumajang",
            subordinates: [
                {
                    name: "Ahmad Hudaifah, S.E., M.Si.",
                    position: "Kepala Sub Bagian Tata Usaha",
                },
                {
                    name: "Ir. Agus Setiawan, S.T.",
                    position: "Kepala Seksi Operasi",
                },
                {
                    name: "Ir. Windari Wahyu Ningsih, ST., MT.",
                    position: "Kepala Seksi Pemeliharaan dan Rehabilitasi",
                },
            ],
        },
        {
            id: 11,
            name: "Anton Dharma Pusaka Mas, S.T., M.T.",
            position: "Kepala UPT PSDA WS Welang Pekalen di Pasuruan",
            subordinates: [
                {
                    name: "Ir. Era Silvia, S.T., M.T.",
                    position: "Kepala Sub Bagian Tata Usaha",
                },
                {
                    name: "Dwi Anggoro Al Gafur, ST.",
                    position: "Kepala Seksi Operasi",
                },
                {
                    name: "Taufan Hikmah, ST.",
                    position: "Kepala Seksi Pemeliharaan dan Rehabilitasi",
                },
                {
                    name: "Hizbul Maulana, ST.",
                    position: "Kepala Seksi Pemeliharaan dan Rehabilitasi",
                },
            ],
        },
        {
            id: 12,
            name: "Ir. Anton Daniswara, S.T.",
            position: "Kepala UPT PSDA WS Kepulauan Madura di Pamekasan",
            subordinates: [
                {
                    name: "Girindra Pratama, SE.",
                    position: "Kepala Sub Bagian Tata Usaha",
                },
                {
                    name: "Ir. Siswanto, S.T., M.T.",
                    position: "Kepala Seksi Operasi",
                },
                {
                    name: "Ir. Giyanto, S.T., M.PSDA.",
                    position: "Kepala Seksi Pemeliharaan dan Rehabilitasi",
                },
            ],
        },
    ];

    return (
        <GuestLayout>
            <Head>
                <title>Profil Pejabat</title>
                <meta
                    name="description"
                    content="Kenali tim kepemimpinan dan pejabat struktural di Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur yang berdedikasi untuk kemajuan pengelolaan SDA."
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
                            Profil Pejabat
                        </h1>
                        <div className="w-16 h-px bg-white mb-8"></div>
                        <p className="text-xl text-white/80 leading-relaxed">
                            Tim kepemimpinan yang berdedikasi dalam mengelola
                            sumber daya air untuk kemakmuran masyarakat Jawa
                            Timur
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 bg-white">
                <div className="max-w-screen mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {pimpinanList.map((pimpinan, index) => (
                            <div
                                key={pimpinan.id}
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
                                        {/* Main Position */}
                                        <div className="space-y-2">
                                            {/* Name */}
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {pimpinan.name}
                                            </h3>

                                            {/* Position */}
                                            <p className="text-xl text-gray-600">
                                                {pimpinan.position}
                                            </p>
                                        </div>

                                        {/* Subordinates */}
                                        {pimpinan.subordinates.length > 0 && (
                                            <div className="ml-6 space-y-3 border-l-2 border-blue-200 pl-6">
                                                {pimpinan.subordinates.map(
                                                    (subordinate, subIndex) => (
                                                        <div
                                                            key={subIndex}
                                                            className="space-y-1"
                                                        >
                                                            <h4 className="text-lg font-semibold text-gray-800">
                                                                {
                                                                    subordinate.name
                                                                }
                                                            </h4>
                                                            <p className="text-base text-gray-600">
                                                                {
                                                                    subordinate.position
                                                                }
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Note */}
                    <div className="mt-16 p-8 bg-gray-50 rounded-lg border border-gray-200 max-w-4xl mx-auto">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                            Informasi Penting
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Struktur pimpinan dan pejabat struktural dapat
                            mengalami perubahan sesuai dengan kebijakan
                            organisasi dan kebutuhan pelayanan publik. Untuk
                            informasi terkini, silakan hubungi bagian
                            kepegawaian atau kunjungi kantor Dinas PU Sumber
                            Daya Air Provinsi Jawa Timur.
                        </p>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
