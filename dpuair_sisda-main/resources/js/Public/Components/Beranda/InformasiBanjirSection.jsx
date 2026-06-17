import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import FloodService from "@/Services/FloodService";

export default function InformasiBanjirSection() {
    const swiperRef = useRef(null);
    const [banjirData, setBanjirData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await FloodService.fetchFloodData({ limit: 6 });
                setBanjirData(data);
            } catch (err) {
                console.error("Failed to load flood data", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Skeleton Loading Component
    if (loading) {
        return (
            <section className="py-8 md:py-12 bg-white overflow-hidden">
                <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="animate-pulse flex flex-col gap-6">
                        <div className="h-8 bg-slate-200 rounded w-1/4 mb-4"></div>
                        <div className="flex gap-4 overflow-hidden">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="min-w-[300px] h-[200px] bg-slate-100 rounded-2xl"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 md:py-12 bg-white overflow-hidden">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                        Laporan Banjir
                    </h2>
                    <a
                        href="https://sibb.dpuair.jatimprov.go.id/beranda"
                        target="_blank"
                        className="inline-flex items-center justify-center font-semibold text-sm text-blue-600 hover:text-blue-700 transition-colors gap-2"
                    >
                        <span>Lihat Semua</span>
                        <i className="fa-solid fa-arrow-right"></i>
                    </a>
                </div>

                {/* Carousel */}
                <div className="relative group px-4 md:px-0">
                    <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-110 transition-all duration-300"
                    >
                        <i className="fa-solid fa-chevron-left text-sm"></i>
                    </button>
                    <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-md border border-slate-100 flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-110 transition-all duration-300"
                    >
                        <i className="fa-solid fa-chevron-right text-sm"></i>
                    </button>

                    <Swiper
                        modules={[Navigation, Autoplay]}
                        spaceBetween={16}
                        slidesPerView={1}
                        navigation={false}
                        loop={true}
                        autoplay={{
                            delay: 4500,
                            disableOnInteraction: false,
                        }}
                        onBeforeInit={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                            1280: { slidesPerView: 4 },
                        }}
                        className="!pb-6 !pt-2"
                    >
                        {banjirData.map((item) => (
                            <SwiperSlide key={item.id} className="h-auto">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="bg-blue-50 relative rounded-2xl p-5 overflow-hidden h-full min-h-[180px] flex flex-col justify-between group transition-shadow hover:shadow-md"
                                >
                                    {/* Background Decor */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>
                                    <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-white/30 rounded-full blur-xl pointer-events-none"></div>

                                    {/* Header */}
                                    <div className="relative z-10 mb-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                                                    {item.das}
                                                </span>
                                                <h4
                                                    className="text-base font-bold text-slate-800 line-clamp-2 leading-tight"
                                                    title={item.title}
                                                >
                                                    {item.title}
                                                </h4>
                                            </div>
                                        </div>
                                        <p className="text-slate-500 text-xs font-medium flex items-center gap-1.5 mt-1">
                                            <i className="fa-regular fa-clock text-[10px]"></i>
                                            {item.datetime}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-end justify-between relative z-10 mt-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                                Daerah Irigasi
                                            </span>
                                            <span
                                                className="text-slate-700 font-semibold text-xs truncate max-w-[120px]"
                                                title={item.location}
                                            >
                                                {item.location}
                                            </span>
                                        </div>
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md group-hover:bg-blue-700 transition-colors cursor-pointer"
                                        >
                                            <i className="fa-solid fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-xs"></i>
                                        </a>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </section>
    );
}
