import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState, useMemo, useEffect } from "react";
import WeatherTicker from "./WeatherTicker";

export default function HeroSection({ news, weatherData }) {
    const banners =
        news?.length > 0
            ? news
            : [
                  {
                      id: 1,
                      title: "Selamat Datang",
                      image: "/storage/images/SELAMAT.png",
                  },
                  {
                      id: 2,
                      title: "FHD Alur",
                      image: "/storage/images/FHDAlur.png",
                  },
              ];

    // Duplicate slides jika kurang dari 4, supaya Swiper loop bisa jalan dengan 3 slidesPerView
    const slides = useMemo(() => {
        if (banners.length >= 4) return banners;
        const duplicated = [];
        while (duplicated.length < 6) {
            duplicated.push(...banners);
        }
        return duplicated.slice(0, 6);
    }, [banners]);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return (
        <>
            <div
                className="relative group py-3"
                style={{ background: "#ffffff" }}
            >
                <div className="relative overflow-hidden">
                    <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        slidesPerView={isMobile ? 1 : "auto"}
                        centeredSlides={!isMobile}
                        spaceBetween={isMobile ? 0 : 10}
                        loop={true}
                        speed={600}
                        grabCursor={true}
                        navigation={{
                            prevEl: ".hero-swiper-prev",
                            nextEl: ".hero-swiper-next",
                        }}
                        autoplay={{
                            delay: 5000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                        }}
                        onSlideChange={(swiper) =>
                            setActiveIndex(swiper.realIndex)
                        }
                        observer={true}
                        observeParents={true}
                    >
                        {slides.map((banner, index) => (
                            <SwiperSlide
                                key={`${banner.id}-${index}`}
                                style={isMobile ? {} : { width: "auto" }}
                            >
                                {({ isActive }) => (
                                    <img
                                        src={
                                            banner.image || "/storage/test.jpg"
                                        }
                                        alt={banner.title}
                                        className={`rounded-xl transition-opacity duration-500 block ${
                                            isActive
                                                ? "opacity-100"
                                                : "opacity-30"
                                        }`}
                                        style={
                                            isMobile
                                                ? {
                                                      width: "100%",
                                                      height: "56vw",
                                                      objectFit: "cover",
                                                  }
                                                : {
                                                      width: "auto",
                                                      height: "50vh",
                                                  }
                                        }
                                    />
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation Arrows */}
                    <div className="absolute inset-y-0 left-2 md:left-4 z-20 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="hero-swiper-prev w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#173c94] text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110">
                            <i className="fa-solid fa-chevron-left text-sm"></i>
                        </button>
                    </div>
                    <div className="absolute inset-y-0 right-2 md:right-4 z-20 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="hero-swiper-next w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#173c94] text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110">
                            <i className="fa-solid fa-chevron-right text-sm"></i>
                        </button>
                    </div>
                </div>
            </div>
            <WeatherTicker weatherData={weatherData} />
        </>
    );
}
