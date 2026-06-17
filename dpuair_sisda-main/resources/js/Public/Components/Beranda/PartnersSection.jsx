import { useEffect } from "react";

/**
 * PartnersSection (Mitra & Ekosistem)
 * ----------------------------------
 * Logo carousel sederhana yang berputar otomatis (infinite scroll) untuk menampilkan
 * mitra kerja dan ekosistem Dinas. Menggunakan CSS keyframe animation tanpa dependensi eksternal.
 */
export default function PartnersSection() {
    // Tambahkan style keyframes sekali saat komponen dipakai
    useEffect(() => {
        if (document.getElementById("partners-scroll-style")) return;
        const style = document.createElement("style");
        style.id = "partners-scroll-style";
        style.textContent = `
            @keyframes scrollPartners {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
            }
        `;
        document.head.appendChild(style);
    }, []);

    const partners = [
        {
            id: "bbws-brantas",
            name: "BBWS Brantas",
            logo: "https://via.placeholder.com/150x80?text=BBWS+Brantas",
            url: "https://sda.pu.go.id/brantas/",
        },
        {
            id: "bbws-bsolo",
            name: "BBWS Bengawan Solo",
            logo: "https://via.placeholder.com/150x80?text=BBWS+B.Solo",
            url: "https://sda.pu.go.id/bengawansolo/",
        },
        {
            id: "bpdas",
            name: "BPDAS",
            logo: "https://via.placeholder.com/150x80?text=BPDAS",
            url: "#",
        },
        {
            id: "komisi-irigasi",
            name: "Komisi Irigasi",
            logo: "https://via.placeholder.com/150x80?text=Komisi+Irigasi",
            url: "#",
        },
        {
            id: "hippa",
            name: "HIPPA",
            logo: "https://via.placeholder.com/150x80?text=HIPPA",
            url: "#",
        },
        {
            id: "kps",
            name: "Kelompok Peduli Sungai",
            logo: "https://via.placeholder.com/150x80?text=KPS",
            url: "#",
        },
    ];

    // Duplikat array untuk scroll mulus
    const logosLoop = [...partners, ...partners];

    return (
        <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-gray-50 border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Formal Section Header */}
                <div className="text-center mb-20">
                    <div className="relative mb-12">
                        {/* Subtle decorative elements */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl mb-8 shadow-lg">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
                                Mitra &amp;
                                <span className="block text-slate-600 font-light italic">
                                    Ekosistem
                                </span>
                            </h2>

                            <div className="w-24 h-1 bg-gradient-to-r from-slate-800 to-slate-600 mx-auto mb-8"></div>

                            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
                                Membangun sinergi strategis dengan berbagai
                                lembaga pemerintah pusat, forum koordinasi, dan
                                mitra masyarakat untuk mewujudkan pengelolaan
                                sumber daya air yang berkelanjutan dan
                                terintegrasi.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Premium Partners Carousel */}
                <div className="relative">
                    {/* Elegant gradient overlays */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

                    <div className="overflow-hidden py-8">
                        <div
                            className="flex items-center space-x-20"
                            style={{
                                animation: "scrollPartners 40s linear infinite",
                                width: "max-content",
                            }}
                        >
                            {logosLoop.map((partner, idx) => (
                                <a
                                    key={`${partner.id}-${idx}`}
                                    href={partner.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex-shrink-0 transition-all duration-500 hover:scale-110"
                                >
                                    <div className="relative bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl hover:border-slate-200 transition-all duration-500 group-hover:-translate-y-2">
                                        {/* Subtle background pattern */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                        <div className="relative z-10">
                                            <img
                                                src={partner.logo}
                                                alt={partner.name}
                                                className="h-20 w-auto object-contain mx-auto grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70 group-hover:opacity-100"
                                                loading="lazy"
                                            />

                                            {/* Partner name overlay on hover */}
                                            <div className="absolute inset-x-0 -bottom-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                <div className="bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg mx-auto w-fit shadow-lg">
                                                    {partner.name}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Professional Partnership Statement */}
                <div className="text-center mt-16">
                    <div className="inline-flex flex-col items-center space-y-4">
                        <div className="w-16 h-0.5 bg-gradient-to-r from-slate-300 via-slate-600 to-slate-300"></div>
                        <p className="text-slate-500 text-sm font-medium tracking-wide uppercase">
                            Kemitraan Strategis untuk Masa Depan yang
                            Berkelanjutan
                        </p>
                        <div className="w-16 h-0.5 bg-gradient-to-r from-slate-300 via-slate-600 to-slate-300"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
