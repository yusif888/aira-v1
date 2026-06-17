import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";

export default function CurahHujanSection() {
    const [activeTab, setActiveTab] = useState("Saat ini");
    const swiperRef = useRef(null);

    const tabs = ["Saat ini", "Hari ini", "Besok", "Lusa"];

    // Mock Data for Weather
    const weatherData = [
        {
            id: 1,
            city: "Surabaya",
            time: "08.00 WIB",
            temp: "32°C",
            condition: "Cerah Berawan",
            icon: "fa-solid fa-cloud-sun",
            bg: "bg-blue-50",
        },
        {
            id: 2,
            city: "Malang",
            time: "08.00 WIB",
            temp: "24°C",
            condition: "Hujan Ringan",
            icon: "fa-solid fa-cloud-rain",
            bg: "bg-blue-50",
        },
        {
            id: 3,
            city: "Banyuwangi",
            time: "08.00 WIB",
            temp: "28°C",
            condition: "Cerah",
            icon: "fa-solid fa-sun",
            bg: "bg-blue-50",
        },
        {
            id: 4,
            city: "Kediri",
            time: "08.00 WIB",
            temp: "29°C",
            condition: "Berawan",
            icon: "fa-solid fa-cloud",
            bg: "bg-blue-50",
        },
        {
            id: 5,
            city: "Madiun",
            time: "08.00 WIB",
            temp: "30°C",
            condition: "Hujan Petir",
            icon: "fa-solid fa-cloud-bolt",
            bg: "bg-blue-50",
        },
        {
            id: 6,
            city: "Jember",
            time: "08.00 WIB",
            temp: "27°C",
            condition: "Berawan Tebal",
            icon: "fa-solid fa-cloud-meatball",
            bg: "bg-blue-50",
        },
    ];

    return (
        <section className="py-8 md:py-12 bg-white overflow-hidden">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                        Curah Hujan di Jawa Timur
                    </h2>
                </div>

                {/* Coming Soon Placeholder */}
                <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <i className="fa-solid fa-cloud-rain text-2xl text-blue-600"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                        Coming Soon
                    </h3>
                    <p className="text-slate-500 text-center max-w-md">
                        Fitur pantauan curah hujan sedang dalam pengembangan.
                    </p>
                </div>
            </div>
        </section>
    );
}
