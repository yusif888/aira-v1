import { useEffect, useRef } from "react";

export default function MapComponent() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        // Load Leaflet CSS and JS dynamically
        const loadLeaflet = async () => {
            // Load CSS
            if (!document.querySelector('link[href*="leaflet"]')) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
                link.integrity =
                    "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
                link.crossOrigin = "";
                document.head.appendChild(link);
            }

            // Load JS
            if (!window.L) {
                return new Promise((resolve) => {
                    const script = document.createElement("script");
                    script.src =
                        "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
                    script.integrity =
                        "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
                    script.crossOrigin = "";
                    script.onload = resolve;
                    document.head.appendChild(script);
                });
            }
        };

        const initializeMap = async () => {
            await loadLeaflet();

            if (mapRef.current && window.L && !mapInstanceRef.current) {
                // Initialize map centered on East Java
                const map = window.L.map(mapRef.current).setView(
                    [-7.5, 112.5],
                    8
                );

                // Add OpenStreetMap tiles
                window.L.tileLayer(
                    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                    {
                        attribution:
                            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        maxZoom: 18,
                    }
                ).addTo(map);

                // Sample markers with different colors and types
                const markers = [
                    {
                        lat: -7.9666,
                        lng: 112.6326,
                        name: "Pos Malang",
                        type: "utama",
                        color: "red",
                    },
                    {
                        lat: -7.2575,
                        lng: 112.7521,
                        name: "Pos Surabaya",
                        type: "regional",
                        color: "blue",
                    },
                    {
                        lat: -7.8168,
                        lng: 112.0101,
                        name: "Pos Kediri",
                        type: "monitoring",
                        color: "green",
                    },
                    {
                        lat: -7.7543,
                        lng: 113.2159,
                        name: "Pos Probolinggo",
                        type: "emergensi",
                        color: "purple",
                    },
                    {
                        lat: -8.0667,
                        lng: 111.9,
                        name: "Pos Tulungagung",
                        type: "penelitian",
                        color: "yellow",
                    },
                    {
                        lat: -7.6391,
                        lng: 112.9075,
                        name: "Pos Pasuruan",
                        type: "koordinasi",
                        color: "orange",
                    },
                    {
                        lat: -8.1335,
                        lng: 111.4824,
                        name: "Pos Pacitan",
                        type: "monitoring",
                        color: "green",
                    },
                    {
                        lat: -7.5636,
                        lng: 110.8306,
                        name: "Pos Magetan",
                        type: "regional",
                        color: "blue",
                    },
                ];

                // Custom marker icons
                const createCustomIcon = (color) => {
                    return window.L.divIcon({
                        className: "custom-marker",
                        html: `<div style="
                            width: 20px; 
                            height: 20px; 
                            background-color: ${color}; 
                            border: 3px solid white; 
                            border-radius: 50%; 
                            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                            animation: pulse 2s infinite;
                        "></div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10],
                    });
                };

                // Add markers to map
                markers.forEach((marker) => {
                    const icon = createCustomIcon(marker.color);
                    window.L.marker([marker.lat, marker.lng], { icon }).addTo(
                        map
                    ).bindPopup(`
                            <div style="font-family: system-ui; padding: 5px;">
                                <strong style="color: #1f2937; font-size: 14px;">${
                                    marker.name
                                }</strong><br>
                                <span style="color: #6b7280; font-size: 12px; text-transform: capitalize;">
                                    ${marker.type.replace("_", " ")}
                                </span><br>
                                <div style="margin-top: 8px;">
                                    <span style="
                                        display: inline-block; 
                                        width: 8px; 
                                        height: 8px; 
                                        background-color: ${marker.color}; 
                                        border-radius: 50%; 
                                        margin-right: 6px;
                                    "></span>
                                    <span style="color: #374151; font-size: 11px;">Status: Aktif</span>
                                </div>
                            </div>
                        `);
                });

                // Add CSS for pulse animation
                if (!document.querySelector("#leaflet-custom-styles")) {
                    const style = document.createElement("style");
                    style.id = "leaflet-custom-styles";
                    style.textContent = `
                        @keyframes pulse {
                            0% { transform: scale(1); opacity: 1; }
                            50% { transform: scale(1.1); opacity: 0.7; }
                            100% { transform: scale(1); opacity: 1; }
                        }
                        .custom-marker {
                            background: transparent !important;
                            border: none !important;
                        }
                        .leaflet-popup-content-wrapper {
                            border-radius: 8px !important;
                            box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
                        }
                        .leaflet-popup-tip {
                            background: white !important;
                        }
                        /* Fix z-index to prevent overlapping header */
                        .leaflet-container {
                            z-index: 1 !important;
                        }
                        .leaflet-control-container {
                            z-index: 10 !important;
                        }
                        .leaflet-popup-pane {
                            z-index: 20 !important;
                        }
                        .leaflet-tooltip-pane {
                            z-index: 15 !important;
                        }
                    `;
                    document.head.appendChild(style);
                }

                mapInstanceRef.current = map;
            }
        };

        initializeMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={mapRef}
            className="w-full h-full min-h-[400px] rounded-xl"
            style={{ minHeight: "400px" }}
        />
    );
}
