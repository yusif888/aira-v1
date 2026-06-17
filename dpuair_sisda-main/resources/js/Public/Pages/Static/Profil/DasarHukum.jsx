import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

export default function DasarHukum() {
    const legalDocuments = [
        {
            category: "Undang-Undang",
            badge: "UU",
            badgeColor: "red",
            items: [
                {
                    title: "Undang-Undang Nomor 2 Tahun 1950 tentang Pembentukan Provinsi Djawa Timur (Himpunan Peraturan-Peraturan Negara Tahun 1950) sebagaimana telah diubah dengan Undang-Undang Nomor 18 Tahun 1950 tentang Perubahan dalam Undang-Undang Nomor 2 Tahun 1950",
                    pdfUrl: "#",
                },
                {
                    title: "Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah sebagaimana telah diubah beberapa kali, terakhir dengan Undang-Undang Nomor 9 Tahun 2015",
                    pdfUrl: "#",
                },
                {
                    title: "Undang-Undang Nomor 5 Tahun 2004 tentang Aparatur Sipil Negara",
                    pdfUrl: "#",
                },
                {
                    title: "Undang-Undang No.17 Tahun 2019 Tentang Sumber Daya Air",
                    pdfUrl: "#",
                },
                {
                    title: "Undang-Undang No.11 Tahun 2020 Tentang Cipta Kerja",
                    pdfUrl: "#",
                },
                {
                    title: "Undang-Undang No.6 Tahun 2023 Tentang Penetapan Peraturan Pemerintah Pengganti Undang-Undang Nomor 2 Tahun 2022 tentang Cipta Kerja Menjadi Undang-Undang",
                    pdfUrl: "#",
                },
            ],
        },
        {
            category: "Peraturan Pemerintah",
            badge: "PP",
            badgeColor: "orange",
            items: [
                {
                    title: "Peraturan Pemerintah Republik Indonesia Nomor 20 Tahun 2006 tentang Irigasi",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Pemerintah Republik Indonesia Nomor 38 Tahun 2011 tentang Sungai",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Pemerintah Nomor 30 Tahun 2024 tentang Pengelolaan Sumber Daya Air",
                    pdfUrl: "#",
                },
            ],
        },
        {
            category: "Peraturan Menteri PUPR",
            badge: "PM",
            badgeColor: "green",
            items: [
                {
                    title: "Peraturan Menteri PUPR RI Nomor 04/PRT/M/2015 Tentang Kriteria Dan Penetapan Wilayah Sungai",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Menteri PUPR RI Nomor 07/PRT/M/2015 tentang Pantai",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Menteri PUPR RI Nomor 08/PRT/M/2015 tentang Penetapan Garis Sempadan Jaringan Irigasi",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Menteri PUPR RI Nomor 10/PRT/M/2015 tentang Rencana dan Rencana Teknis Tata Pengaturan Air dan Tata Pengairan",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Menteri PUPR RI Nomor 14/PRT/M/2015 Tentang Kriteria Dan Penetapan Status Daerah Irigasi",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Menteri PUPR RI Nomor 18/PRT/M/2015 tentang Operasi dan Pemeliharaan Sumber Daya Air",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Menteri PUPR RI Nomor 23/PRT/M/2015 tentang Pengelolaan Aset Irigasi",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Menteri PUPR RI Nomor 28/PRT/M/2015 tentang Sempadan Sungai dan Garis Sempadan Danau",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Menteri PUPR RI Nomor 30/PRT/M/2015 tentang Pengembangan dan Pengelolaan Sistem Irigasi",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Menteri PUPR RI Nomor 01/PRT/M/2016 tentang Tata Cara Perizinan Pengusahaan Sumber Daya Air dan Penggunaan Sumber Daya Air",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Menteri PUPR RI Nomor 1 Tahun 2022 tentang Pedoman Penyusunan Perkiraan Biaya Pekerjaan Konstruksi Bidang Pekerjaan Umum dan Perumahan Rakyat",
                    pdfUrl: "#",
                },
            ],
        },
        {
            category: "Peraturan Daerah Provinsi Jawa Timur",
            badge: "PD",
            badgeColor: "blue",
            items: [
                {
                    title: "Peraturan Daerah Provinsi Jawa Timur Nomor 11 Tahun 2016 tentang Pembentukan dan Susunan Perangkat Daerah sebagaimana telah diubah dengan Peraturan Daerah Provinsi Jawa Timur Nomor 3 Tahun 2018",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Daerah Provinsi Jawa Timur Nomor 18 Tahun 2016 tentang Pengelolaan Sungai",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Daerah Nomor 9 Tahun 2019 tentang Pengarusutamaan Gender",
                    pdfUrl: "#",
                },
            ],
        },
        {
            category: "Peraturan Gubernur Jawa Timur",
            badge: "PG",
            badgeColor: "purple",
            items: [
                {
                    title: "Peraturan Gubernur Jawa Timur Nomor 49 Tahun 2018 tentang Nomenklatur, Susunan Organisasi, Uraian Tugas Dan Fungsi Serta Tata Kerja UPT Dinas PU SDA Provinsi Jawa Timur",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Gubernur Jawa Timur Nomor 60 Tahun 2021 tentang Kebijakan Pengelolaan Sistem Informasi Hidrologi, Hidrometeorologi, dan Hidrogeologi pada Tingkat Provinsi",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Gubernur Jawa Timur Nomor 72 Tahun 2023 tentang Kedudukan, Susunan Organisasi, Uraian Tugas dan Fungsi Serta Tata Kerja Dinas PU SDA Provinsi Jawa Timur",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Gubernur Jawa Timur Nomor 35 Tahun 2023 tentang Standar Biaya Umum Tahun 2024",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Gubernur Jawa Timur Nomor 88 Tahun 2023 tentang Pedoman Kerja dan Pelaksanaan Tugas",
                    pdfUrl: "#",
                },
                {
                    title: "Peraturan Gubernur Jawa Timur Nomor 1 Tahun 2024 tentang Kebijakan Pengelolaan Sumber Daya Air",
                    pdfUrl: "#",
                },
            ],
        },
    ];

    const getBadgeColor = (color) => {
        const colors = {
            red: "bg-red-100 text-red-600",
            orange: "bg-orange-100 text-orange-600",
            green: "bg-green-100 text-green-600",
            blue: "bg-blue-100 text-blue-600",
            purple: "bg-purple-100 text-purple-600",
        };
        return colors[color] || colors.blue;
    };

    return (
        <GuestLayout>
            <Head>
                <title>Dasar Hukum</title>
                <meta
                    name="description"
                    content="Pelajari landasan yuridis dan peraturan yang menjadi dasar hukum pelaksanaan tugas dan fungsi Dinas Pekerjaan Umum Sumber Daya Air Provinsi Jawa Timur."
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
                            Dasar Hukum
                        </h1>
                        <div className="w-16 h-px bg-white mb-8"></div>
                        <p className="text-xl text-white/80 leading-relaxed">
                            Landasan yuridis yang menjadi dasar pelaksanaan
                            tugas dan fungsi Dinas Pekerjaan Umum Sumber Daya
                            Air Provinsi Jawa Timur
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-16 bg-white">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="space-y-16">
                        {legalDocuments.map((doc, docIndex) => (
                            <div key={docIndex}>
                                <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                                    <span
                                        className={`w-12 h-12 ${getBadgeColor(
                                            doc.badgeColor
                                        )} rounded-lg flex items-center justify-center text-base font-bold mr-4`}
                                    >
                                        {doc.badge}
                                    </span>
                                    {doc.category}
                                </h2>

                                <div className="space-y-4">
                                    {doc.items.map((item, itemIndex) => (
                                        <div
                                            key={itemIndex}
                                            className="flex items-start gap-6 group"
                                        >
                                            {/* Number */}
                                            <div className="flex-shrink-0 w-8 text-center">
                                                <span className="text-lg font-bold text-gray-400 group-hover:text-gray-900 transition-colors duration-300">
                                                    {itemIndex + 1}.
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-gray-700 leading-relaxed">
                                                    {item.title}
                                                </p>
                                            </div>

                                            {/* Download Link */}
                                            <a
                                                href={item.pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-shrink-0 text-gray-400 hover:text-gray-900 transition-colors duration-300"
                                                title="Download PDF"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer Note */}
                    <div className="mt-16 p-8 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                            Catatan Penting
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Semua peraturan perundang-undangan di atas merupakan
                            landasan hukum yang sah dan berlaku untuk
                            pelaksanaan tugas dan fungsi Dinas Pekerjaan Umum
                            Sumber Daya Air Provinsi Jawa Timur. Peraturan ini
                            dapat mengalami perubahan sesuai dengan perkembangan
                            kebijakan dan kebutuhan daerah.
                        </p>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
