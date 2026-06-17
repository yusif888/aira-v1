import { Link } from "@inertiajs/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";

export default function BeritaSection({ latestNews = [] }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Ambil 5 berita terbaru
    const displayNews = latestNews.slice(0, 5);

    return (
        <section className="relative py-24 lg:py-32 bg-white">
            <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Section Header */}
                <div className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="space-y-4"
                    >
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
                            Berita Terkini
                        </h2>
                        <div className="w-16 h-px bg-gray-900"></div>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl leading-relaxed">
                            Informasi terbaru tentang program dan kegiatan
                            pengelolaan sumber daya air
                        </p>
                    </motion.div>
                </div>

                {/* News Slider */}
                <div className="relative">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={32}
                        slidesPerView={1}
                        loop={true}
                        navigation={{
                            prevEl: ".news-swiper-button-prev",
                            nextEl: ".news-swiper-button-next",
                        }}
                        pagination={{
                            el: ".news-swiper-pagination",
                            clickable: true,
                            bulletClass: "swiper-pagination-bullet",
                            bulletActiveClass:
                                "swiper-pagination-bullet-active",
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                                spaceBetween: 24,
                            },
                            1024: {
                                slidesPerView: 3,
                                spaceBetween: 32,
                            },
                        }}
                        className="pb-16"
                    >
                        {displayNews.map((news, index) => (
                            <SwiperSlide key={news.id}>
                                <motion.article
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1,
                                    }}
                                    viewport={{ once: true }}
                                    className="group h-full"
                                >
                                    <Link
                                        href={route("public.news.show", {
                                            article: news.slug,
                                        })}
                                        className="block h-full space-y-6"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                            <img
                                                src={`/storage/${news.featured_image_path}`}
                                                alt={news.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-4">
                                            {/* Category & Date */}
                                            <div className="flex items-center justify-between text-sm text-gray-500">
                                                {news.category && (
                                                    <span className="font-medium">
                                                        {news.category.name}
                                                    </span>
                                                )}
                                                <span>
                                                    {formatDate(
                                                        news.published_at
                                                    )}
                                                </span>
                                            </div>

                                            {/* Divider */}
                                            <div className="w-12 h-px bg-gray-900 group-hover:w-16 transition-all duration-300"></div>

                                            {/* Title */}
                                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors duration-300 line-clamp-2 leading-tight">
                                                {news.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                                {news.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.article>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Buttons */}
                    <button className="news-swiper-button-prev absolute top-1/3 -left-6 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors duration-300">
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>

                    <button className="news-swiper-button-next absolute top-1/3 -right-6 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors duration-300">
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>

                    {/* Pagination Dots */}
                    <div className="news-swiper-pagination flex justify-center gap-2 mt-8"></div>
                </div>

                {/* Call to Action */}
                <div className="mt-20">
                    <Link
                        href={route("public.news.index")}
                        className="inline-flex items-center group"
                    >
                        <span className="text-lg font-bold text-gray-900 group-hover:text-gray-600 transition-colors duration-300">
                            Lihat Semua Berita
                        </span>
                        <div className="ml-4 w-12 h-px bg-gray-900 group-hover:w-16 transition-all duration-300"></div>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .swiper-pagination-bullet {
                    width: 8px;
                    height: 8px;
                    background: #d1d5db;
                    opacity: 1;
                    transition: all 0.3s;
                }
                .swiper-pagination-bullet-active {
                    width: 32px;
                    border-radius: 4px;
                    background: #111827;
                }
            `}</style>
        </section>
    );
}
