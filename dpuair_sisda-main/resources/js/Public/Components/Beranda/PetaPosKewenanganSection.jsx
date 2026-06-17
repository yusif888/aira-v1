import MapComponent from "./MapComponent";

export default function PetaPosKewenanganSection() {
    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Peta Sebaran Pos Kewenangan
                    </h2>
                    <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 sm:mt-4">
                        Visualisasi sebaran lokasi pos pemantauan dan wilayah
                        kewenangan Dinas PU SDA Jawa Timur untuk monitoring
                        real-time.
                    </p>
                </div>

                <div className="max-w-screen mx-auto">
                    {/* Map Container */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        {/* Map Area */}
                        <div className="relative">
                            <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100 relative overflow-hidden">
                                {/* Grid Pattern */}
                                <div className="absolute inset-0 opacity-20">
                                    <div className="grid grid-cols-12 h-full">
                                        {[...Array(48)].map((_, i) => (
                                            <div
                                                key={i}
                                                className="border border-gray-300/30"
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Map Component */}
                                <MapComponent />

                                {/* Coordinate Display */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                                    <div className="text-xs text-gray-600 font-mono">
                                        <div>Lat: -7.2504° S</div>
                                        <div>Lng: 112.7688° E</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
