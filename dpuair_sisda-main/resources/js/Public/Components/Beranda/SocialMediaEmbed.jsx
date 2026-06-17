import { motion } from "framer-motion";

export default function SocialMediaEmbed() {
    const socialMedia = [
        {
            id: 1,
            name: "TikTok",
            username: "@pusdajatim",
            url: "https://www.tiktok.com/@pusdajatim",
            icon: (
                <svg
                    className="w-16 h-16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
            ),
            originalIcon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 293768 333327"
                    shapeRendering="geometricPrecision"
                    textRendering="geometricPrecision"
                    imageRendering="optimizeQuality"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    className="w-16 h-16"
                >
                    <path
                        d="M204958 0c5369 45832 32829 78170 77253 81022v43471l-287 27V87593c-44424-2850-69965-30183-75333-76015l-47060-1v192819c6791 86790-60835 89368-86703 56462 30342 18977 79608 6642 73766-68039V0h58365zM78515 319644c-26591-5471-50770-21358-64969-44588-34496-56437-3401-148418 96651-157884v54345l-164 27v-40773C17274 145544 7961 245185 33650 286633c9906 15984 26169 27227 44864 33011z"
                        fill="#26f4ee"
                    />
                    <path
                        d="M218434 11587c3505 29920 15609 55386 35948 70259-27522-10602-43651-34934-47791-70262l11843 3zm63489 82463c3786 804 7734 1348 11844 1611v51530c-25770 2537-48321-5946-74600-21749l4034 88251c0 28460 106 41467-15166 67648-34260 58734-95927 63376-137628 35401 54529 22502 137077-4810 136916-103049v-96320c26279 15803 48830 24286 74600 21748V94050zm-171890 37247c5390-1122 11048-1985 16998-2548v54345c-21666 3569-35427 10222-41862 22528-20267 38754 5827 69491 35017 74111-33931 5638-73721-28750-49999-74111 6434-12304 18180-18959 39846-22528v-51797zm64479-119719h1808-1808z"
                        fill="#fb2c53"
                    />
                    <path d="M206590 11578c5369 45832 30910 73164 75333 76015v51528c-25770 2539-48321-5945-74600-21748v96320c206 125717-135035 135283-173673 72939-25688-41449-16376-141089 76383-155862v52323c-21666 3569-33412 10224-39846 22528-39762 76035 98926 121273 89342-1225V11577l47060 1z" />
                </svg>
            ),
        },
        {
            id: 2,
            name: "Instagram",
            username: "@pusdajatim",
            url: "https://www.instagram.com/pusdajatim/",
            icon: (
                <svg
                    className="w-16 h-16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
            originalIcon: (
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                    alt="Instagram"
                    className="w-16 h-16"
                />
            ),
        },
        {
            id: 3,
            name: "YouTube",
            username: "@pusdajatim",
            url: "https://www.youtube.com/@pusdajatim",
            icon: (
                <svg
                    className="w-16 h-16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
            ),
            originalIcon: (
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg"
                    alt="YouTube"
                    className="w-16 h-16"
                />
            ),
        },
    ];

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
                        className="space-y-4"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                            Media Sosial
                        </h2>
                        <div className="w-16 h-px bg-gray-900"></div>
                        <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                            Ikuti dan terhubung dengan kami untuk update
                            terbaru, edukasi, dan interaksi publik
                        </p>
                    </motion.div>

                    {/* Right: Social Media Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {socialMedia.map((social, index) => (
                            <motion.a
                                key={social.id}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.2 + index * 0.1,
                                }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05, y: -8 }}
                                className="group relative bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4 hover:border-gray-300 hover:shadow-2xl hover:shadow-gray-900/10 transition-all duration-300"
                            >
                                {/* External Link Icon */}
                                <div className="absolute top-4 right-4">
                                    <svg
                                        className="w-5 h-5 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </div>

                                {/* Logo Icon */}
                                <div className="relative flex justify-center">
                                    {/* Default SVG Icon */}
                                    <div className="text-gray-300 group-hover:opacity-0 transition-opacity duration-300">
                                        {social.icon}
                                    </div>

                                    {/* Original Logo - Hidden by default, shown on hover */}
                                    <div className="absolute inset-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {social.originalIcon}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    {/* Platform Name */}
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                                        {social.name}
                                    </h3>

                                    {/* Divider */}
                                    <div className="flex justify-center">
                                        <div className="w-12 h-px bg-gray-300 group-hover:w-full group-hover:bg-gray-900 transition-all duration-300"></div>
                                    </div>

                                    {/* Username */}
                                    <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                                        {social.username}
                                    </p>

                                    {/* CTA Label */}
                                    <div className="pt-2">
                                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 group-hover:text-gray-900 group-hover:gap-3 transition-all duration-300">
                                            Kunjungi
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
