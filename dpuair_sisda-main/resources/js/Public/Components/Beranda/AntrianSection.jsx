import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

const steps = [
    {
        number: "01",
        title: "Daftar Online",
        description: "Isi formulir pendaftaran dan pilih jenis kunjungan sesuai kebutuhan Anda.",
    },
    {
        number: "02",
        title: "Terima Kode Antrian",
        description: "Kode antrian dikirim otomatis ke email Anda sebagai bukti pendaftaran.",
    },
    {
        number: "03",
        title: "Datang ke Kantor",
        description: "Tunjukkan kode antrian kepada petugas sesuai jadwal kedatangan Anda.",
    },
];

export default function AntrianSection() {
    return (
        <section className="relative py-16 lg:py-20 bg-gray-200 overflow-hidden">
            {/* Background Logo */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 opacity-60">
                <img
                    src="/assets/images/PUSDAJATIM_WHITE_LOGO.png"
                    alt=""
                    className="w-full h-full object-contain"
                />
            </div>

            <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left: Header */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                                Antrian Pelayanan
                            </h2>
                            <div className="w-16 h-px bg-gray-900" />
                            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                                Rencanakan kunjungan Anda ke Dinas PU SDA Jawa
                                Timur dengan mudah. Daftar antrian online dan
                                kami siapkan pelayanan terbaik untuk Anda.
                            </p>
                        </div>

                        <Link
                            href={route("pelayanan.index")}
                            className="inline-flex items-center gap-2 bg-[#173c94] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0f2a6b] transition-all duration-300"
                        >
                            Daftar Antrian Sekarang
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </motion.div>

                    {/* Right: Steps */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4"
                            >
                                <span className="text-4xl font-bold text-gray-200 leading-none select-none">
                                    {step.number}
                                </span>
                                <div>
                                    <h3 className="text-base font-bold text-gray-900 mb-1">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
