import { useEffect, useRef, useState } from "react";
import GuestLayout from "@/Public/Layouts/GuestLayout";
import { Head } from "@inertiajs/react";

function loadCssOnce(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = (e) => reject(e);
        document.body.appendChild(script);
    });
}

export default function PetaUPT({ mapboxToken }) {
    const mapRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [mapInstance, setMapInstance] = useState(null);

    // Default center for East Java
    const center = [-7.75, 112.02];
    const zoom = 8;

    useEffect(() => {
        let destroyed = false;
        (async () => {
            try {
                if (mapboxToken) {
                    // Try Mapbox GL JS via CDN
                    loadCssOnce(
                        "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css"
                    );
                    await loadScriptOnce(
                        "https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js"
                    );
                    if (destroyed) return;
                    // eslint-disable-next-line no-undef
                    const mapboxgl = window.mapboxgl;
                    mapboxgl.accessToken = mapboxToken;
                    const map = new mapboxgl.Map({
                        container: mapRef.current,
                        style: "mapbox://styles/mapbox/streets-v12",
                        center: [center[1], center[0]],
                        zoom,
                    });
                    map.addControl(
                        new mapboxgl.NavigationControl(),
                        "top-right"
                    );

                    setMapInstance(map);
                    setReady(true);
                    return;
                }
            } catch (e) {
                // Fallthrough to Leaflet
            }

            // Leaflet fallback via CDN (no install required)
            try {
                loadCssOnce("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
                await loadScriptOnce(
                    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                );
                if (destroyed) return;
                // eslint-disable-next-line no-undef
                const L = window.L;
                const map = L.map(mapRef.current).setView(center, zoom);
                L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                        maxZoom: 19,
                        attribution: "&copy; OpenStreetMap",
                    }
                ).addTo(map);
                setMapInstance(map);
                setReady(true);
            } catch (e) {
                console.error("Map load failed", e);
            }
        })();

        return () => {
            destroyed = true;
        };
    }, [mapboxToken]);

    return (
        <GuestLayout>
            <Head>
                <title>Peta Sebaran UPT</title>
                <meta
                    name="description"
                    content="Lihat peta sebaran Unit Pelaksana Teknis (UPT) Dinas Pekerjaan Umum Sumber Daya Air di seluruh wilayah Provinsi Jawa Timur."
                />
            </Head>

            {/* Hero Section */}
            <section className="relative bg-[#173c94] py-24 lg:py-32 overflow-hidden">
                {/* Background Logo Watermark */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 opacity-5">
                    <img
                        src="/assets/images/PUSDAJATIM_WHITE_LOGO.png"
                        alt=""
                        className="w-full h-full object-contain"
                    />
                </div>

                <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight mb-6">
                            Peta Sebaran UPT
                        </h1>
                        <div className="w-16 h-px bg-white mb-8"></div>
                        <p className="text-xl text-white/80 leading-relaxed">
                            Unit Pelaksana Teknis Dinas SDA Provinsi Jawa Timur
                        </p>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 bg-white">
                <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Left: Sidebar */}
                        <div className="lg:col-span-3">
                            <div className="sticky top-24 space-y-6">
                                {/* Coming Soon */}
                                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                                        Coming Soon
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                        Data lokasi UPT sedang dalam proses
                                        pengembangan
                                    </p>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p>Fitur ini akan menampilkan:</p>
                                        <ul className="space-y-1 pl-4">
                                            <li>
                                                • Lokasi semua UPT di Jawa Timur
                                            </li>
                                            <li>
                                                • Detail kontak dan informasi
                                                UPT
                                            </li>
                                            <li>
                                                • Wilayah kerja masing-masing
                                                UPT
                                            </li>
                                            <li>• Navigasi interaktif</li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-base font-bold text-gray-900 mb-3">
                                        Informasi UPT
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Dinas SDA Provinsi Jawa Timur memiliki
                                        beberapa Unit Pelaksana Teknis (UPT)
                                        yang tersebar di berbagai wilayah
                                        sungai. Untuk informasi sementara,
                                        silakan hubungi kantor pusat Dinas SDA
                                        Provinsi Jawa Timur.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Map */}
                        <div className="lg:col-span-9">
                            <div className="bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative">
                                <div
                                    ref={mapRef}
                                    className="w-full h-[600px] lg:h-[700px]"
                                />
                                {!ready && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                        <p className="text-gray-500">
                                            Memuat peta...
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
