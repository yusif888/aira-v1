import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function TaglineSection() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Parallax for text elements
    const yText = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacityText = useTransform(
        scrollYProgress,
        [0.2, 0.5, 0.8],
        [0, 1, 0]
    );

    return (
        <section
            ref={sectionRef}
            className="relative w-full min-h-screen bg-white overflow-hidden flex items-center"
        >
            {/* 1. Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Abstract Gradient Orbs - Adjusted for Light Mode */}
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-50 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-yellow-50 rounded-full blur-[150px] animate-pulse-slow delay-1000"></div>
            </div>

            <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-0">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]">
                    {/* 2. Left Content: Typography & Philosophy */}
                    <div className="space-y-10 order-2 lg:order-1">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            {/* Decorative Line */}
                            <div className="w-20 h-1.5 bg-gradient-to-r from-[#fcbc2c] to-transparent mb-8 rounded-full"></div>

                            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#173c94] leading-tight tracking-tight">
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#173c94] to-blue-600">
                                    Memayu
                                </span>
                                <span className="block text-[#0a1a44]">
                                    Hayuning{" "}
                                    <span className="text-[#fcbc2c] font-serif italic">
                                        Tirto
                                    </span>
                                </span>
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white/60 backdrop-blur-md border-l-4 border-[#fcbc2c] p-6 lg:p-8 rounded-r-2xl shadow-lg shadow-blue-900/5"
                        >
                            <p className="text-xl text-gray-600 leading-relaxed font-light">
                                "Filosofi kami adalah{" "}
                                <strong className="text-[#173c94] font-semibold">
                                    memuliakan air
                                </strong>{" "}
                                sebagai sumber kehidupan. Mengelola dengan hati,
                                melayani dengan integritas, untuk keberlanjutan
                                masa depan Jawa Timur."
                            </p>
                        </motion.div>

                        {/* Stats / Highlights */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-8 pt-4"
                        >
                            <div>
                                <h4 className="text-4xl font-bold text-[#173c94]">
                                    38
                                </h4>
                                <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">
                                    Kabupaten/Kota
                                </p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-bold text-[#173c94]">
                                    100%
                                </h4>
                                <p className="text-sm text-gray-500 uppercase tracking-wider mt-1">
                                    Dedikasi Pelayanan
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* 3. Right Content: Immersive Image Blend */}
                    <div className="relative h-full min-h-[500px] lg:min-h-[800px] flex items-end justify-center lg:justify-end order-1 lg:order-2">
                        {/* The Image Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1 }}
                            viewport={{ once: true }}
                            className="relative w-full h-full flex items-end"
                        >
                            {/* Background Shape behind image - Adjusted for White Theme */}
                            <div className="absolute bottom-0 right-0 w-[80%] h-[90%] bg-gradient-to-t from-blue-50 to-white rounded-t-[100px] -z-10 opacity-100"></div>

                            <img
                                src="/assets/images/PAK-NYOMAN.png"
                                alt="I Nyoman Gunadi, S.T., M.T."
                                className="w-full h-auto max-h-[800px] object-contain drop-shadow-2xl z-10 mask-image-gradient-white"
                                style={{
                                    maskImage:
                                        "linear-gradient(to bottom, black 80%, transparent 100%)",
                                    WebkitMaskImage:
                                        "linear-gradient(to bottom, black 80%, transparent 100%)",
                                }}
                            />

                            {/* Name Card Floating - White Theme Version */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="absolute bottom-10 right-0 lg:-left-10 bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-2xl shadow-[0_20px_50px_rgba(23,60,148,0.15)] z-20 max-w-xs"
                            >
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-[#fcbc2c] flex items-center justify-center text-white shadow-md">
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
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#173c94] uppercase tracking-widest font-semibold">
                                            Kepala Dinas
                                        </p>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                    I Nyoman Gunadi, S.T., M.T.
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    PLT Kepala Dinas PU Sumber Daya Air Provinsi
                                    Jawa Timur
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
