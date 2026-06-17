import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function StatsCarouselSection() {
    const swiperRef = useRef(null);

    const statsData = [
        {
            id: 1,
            label: "Curah Hujan Rerata Tahunan Jawa Timur",
            value: "1.850",
            subtext: "mm/tahun",
            icon: "fa-solid fa-cloud-rain",
        },
        {
            id: 8,
            label: "Jumlah Daerah Irigasi",
            value: "10,527",
            subtext: "Kewenangan Provinsi",
            icon: "fa-solid fa-seedling",
        },
        {
            id: 9,
            label: "Total Luas Daerah Irigasi",
            value: "999,951",
            subtext: "Hektar",
            icon: "fa-solid fa-map-location-dot",
        },
        {
            id: 10,
            label: "Luas Wilayah Sungai Kewenangan Provinsi",
            value: "55,042.12",
            subtext: "Hektar",
            icon: "fa-solid fa-seedling",
        },
        {
            id: 11,
            label: "Panjang Sungai Kewenangan Provinsi",
            value: "5,119.76",
            subtext: "Kilometer",
            icon: "fa-solid fa-water",
        },
        // {
        //     id: 13,
        //     label: "Wisata SDA",
        //     value: "15",
        //     subtext: "Lokasi Destinasi",
        //     icon: "fa-solid fa-umbrella-beach",
        // },
        // {
        //     id: 14,
        //     label: "Pos Hidrologi",
        //     value: "54",
        //     subtext: "Pos Pemantauan Online",
        //     icon: "fa-solid fa-tower-cell",
        // },
        // {
        //     id: 15,
        //     label: "Pelayanan Air",
        //     value: "92,5%",
        //     subtext: "Indeks Kepuasan",
        //     icon: "fa-solid fa-thumbs-up",
        // },
    ];

    return (
        <section className="py-8 md:py-12 bg-white overflow-hidden border-t-2 border-[#173c94]">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold">
                        Data Statistik 2025
                    </h2>
                </div>

                {/* Swiper Carousel */}
                <div className="relative group">
                    <Swiper
                        modules={[Pagination, Navigation, Autoplay]}
                        spaceBetween={20}
                        slidesPerView={1}
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 3,
                            },
                            1024: {
                                slidesPerView: 4,
                            },
                            1280: {
                                slidesPerView: 5,
                            },
                        }}
                        loop={true}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        navigation={{
                            prevEl: ".stats-swiper-button-prev",
                            nextEl: ".stats-swiper-button-next",
                        }}
                        pagination={{
                            clickable: true,
                            el: ".stats-swiper-pagination",
                            renderBullet: function (index, className) {
                                return (
                                    '<span class="' +
                                    className +
                                    ' !w-2 !h-2 md:!w-2.5 md:!h-2.5 !rounded-full !bg-[#173c94]/50 !opacity-100 hover:!bg-[#173c94] transition-all duration-300 !mx-1"></span>'
                                );
                            },
                        }}
                        className="w-full pb-12"
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {statsData.map((stat) => (
                            <SwiperSlide key={stat.id} className="py-3">
                                <div className="flex flex-col items-center justify-center p-6 h-full bg-white rounded-3xl border border-gray-100 transition-transform hover:-translate-y-1 duration-300">
                                    <div className="w-16 h-16 bg-[#173c94]/10 text-[#173c94] rounded-full flex items-center justify-center mb-4">
                                        <i
                                            className={`${stat.icon} text-3xl`}
                                        ></i>
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-800 mb-1">
                                        {stat.value}
                                    </h3>
                                    <p className="text-[#173c94] text-center font-medium mb-1">
                                        {stat.label}
                                    </p>
                                    <p className="text-gray-500 text-center text-sm">
                                        {stat.subtext}
                                    </p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Buttons */}
                    <button className="stats-swiper-button-prev absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-[#173c94] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md border border-gray-100 hover:bg-gray-50">
                        <i className="fa-solid fa-chevron-left"></i>
                    </button>
                    <button className="stats-swiper-button-next absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white text-[#173c94] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md border border-gray-100 hover:bg-gray-50">
                        <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </section>
    );
}
