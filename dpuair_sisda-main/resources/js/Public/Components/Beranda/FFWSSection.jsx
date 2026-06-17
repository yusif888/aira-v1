import { useEffect, useState } from "react";

export default function FFWSSection() {
    const [loadingStates, setLoadingStates] = useState({
        rainfall: true,
        waterLevel: true,
    });

    // Simulate API loading
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingStates({
                rainfall: false,
                waterLevel: false,
            });
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    // Sample data structure based on the image - will be replaced with real API data
    const rainfallData = [
        {
            id: 1,
            value: "1.03",
            unit: "mm",
            status: "Normal",
            statusColor: "text-green-600",
            bgColor: "from-green-400 to-emerald-500",
            location: "Purwodadi - S.Welang",
            code: "BE10128",
            coordinates: { lat: -7.8058, lng: 112.764 },
            lastUpdate: "2025-09-07",
            time: "20:00",
        },
        {
            id: 2,
            value: "1.28",
            unit: "mm",
            status: "Normal",
            statusColor: "text-green-600",
            bgColor: "from-green-400 to-emerald-500",
            location: "Kolam Urnbulan",
            code: "BE10155",
            coordinates: { lat: -7.7532, lng: 112.6543 },
            lastUpdate: "2025-09-07",
            time: "20:00",
        },
        {
            id: 3,
            value: "0.22",
            unit: "mm",
            status: "Unknown",
            statusColor: "text-orange-600",
            bgColor: "from-orange-400 to-red-500",
            location: "Dhompo - S.Welang",
            code: "BE10126",
            coordinates: { lat: -7.658, lng: 112.8613 },
            lastUpdate: "2025-09-07",
            time: "20:00",
        },
    ];

    const waterLevelData = [
        {
            id: 1,
            value: "0.00",
            unit: "mm",
            status: "Tidak Hujan",
            statusColor: "text-blue-600",
            bgColor: "from-cyan-400 to-blue-500",
            location: "ARR Cendono",
            code: "BE10124",
            coordinates: { lat: -7.758, lng: 112.6925 },
            lastUpdate: "2025-09-07",
            time: "20:00",
        },
        {
            id: 2,
            value: "0.00",
            unit: "mm",
            status: "Tidak Hujan",
            statusColor: "text-blue-600",
            bgColor: "from-cyan-400 to-blue-500",
            location: "ARR Lawang",
            code: "BE10125",
            coordinates: { lat: -7.835, lng: 112.6977 },
            lastUpdate: "2025-09-07",
            time: "17:00",
        },
        {
            id: 3,
            value: "0.00",
            unit: "mm",
            status: "Tidak Hujan",
            statusColor: "text-blue-600",
            bgColor: "from-cyan-400 to-blue-500",
            location: "ARR PUSDA Gayungan",
            code: "BE10109",
            coordinates: { lat: -7.3269, lng: 112.7385 },
            lastUpdate: "2025-09-07",
            time: "20:00",
        },
    ];

    const SkeletonLoader = () => (
        <div className="animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                    >
                        <div className="bg-gray-300 h-32 relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-gray-400 rounded-full"></div>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                                <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const MonitoringCard = ({ data, type }) => (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 overflow-hidden group">
            {/* Header with gradient background */}
            <div
                className={`bg-gradient-to-br ${data.bgColor} p-6 text-white relative overflow-hidden`}
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 right-2 w-8 h-8 bg-white/20 rounded-full"></div>
                    <div className="absolute bottom-2 left-2 w-6 h-6 bg-white/20 rounded-full"></div>
                </div>

                <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        {type === "rainfall" ? (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 21l1-4 1 4m4-7l1-4 1 4m4-7l1-4 1 4"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        )}
                    </div>

                    {/* Value */}
                    <div className="text-2xl sm:text-3xl font-bold mb-1">
                        {data.value}{" "}
                        <span className="text-lg">{data.unit}</span>
                    </div>

                    {/* Status */}
                    <div className="text-white/90 text-sm font-medium">
                        {data.status}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Nama Pos:</span>
                        <span className="font-medium text-gray-900">
                            {data.location}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Kode Pos:</span>
                        <span className="font-medium text-gray-900">
                            {data.code}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Koordinat:</span>
                        <span className="font-mono text-xs text-gray-700">
                            {data.coordinates.lat}°, {data.coordinates.lng}°
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Update:</span>
                        <span className="font-medium text-gray-900">
                            {data.lastUpdate} - {data.time}
                        </span>
                    </div>
                </div>

                {/* Status Badge */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${data.statusColor} bg-gray-100`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                                data.status === "Normal"
                                    ? "bg-green-400"
                                    : data.status === "Unknown"
                                    ? "bg-orange-400"
                                    : "bg-blue-400"
                            }`}
                        ></div>
                        Status: {data.status}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Flood Forecasting Warning System
                    </h2>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 sm:mt-4">
                        Sistem peringatan dini banjir dengan monitoring
                        real-time curah hujan dan tinggi muka air di seluruh
                        Jawa Timur.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Rainfall Monitoring */}
                    <div className="space-y-6">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Pos Duga Air PU SDA
                            </h3>
                            <p className="text-gray-600">
                                Monitoring curah hujan real-time dari pos
                                pemantauan
                            </p>
                        </div>

                        {loadingStates.rainfall ? (
                            <SkeletonLoader />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {rainfallData.map((station) => (
                                    <MonitoringCard
                                        key={station.id}
                                        data={station}
                                        type="rainfall"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Water Level Monitoring */}
                    <div className="space-y-6">
                        <div className="text-center lg:text-left">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Hujan PU SDA
                            </h3>
                            <p className="text-gray-600">
                                Monitoring tinggi muka air dan curah hujan
                                terkini
                            </p>
                        </div>

                        {loadingStates.waterLevel ? (
                            <SkeletonLoader />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {waterLevelData.map((station) => (
                                    <MonitoringCard
                                        key={station.id}
                                        data={station}
                                        type="waterlevel"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* CTA to Full FFWS System */}
                    <div className="text-center pt-8 border-t border-gray-200">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-2xl mx-auto">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Sistem FFWS Lengkap
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Akses dashboard lengkap dengan data historis,
                                prediksi cuaca, dan analisis komprehensif sistem
                                peringatan dini banjir.
                            </p>

                            <a
                                href="https://sih3.dpuair.jatimprov.go.id/ffwsview/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
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
                                <span>Akses FFWS Dashboard</span>
                            </a>

                            <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                                    <span>Normal</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-1"></div>
                                    <span>Siaga</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
                                    <span>Bahaya</span>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                                    <span>Tidak Hujan</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
