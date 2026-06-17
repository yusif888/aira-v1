import { useEffect } from "react";

export default function MapView() {
    useEffect(() => {
        // Hanya jalankan jika di browser
        if (typeof window !== "undefined") {
            const initMap = async () => {
                const L = (await import("leaflet")).default;
                await import("leaflet/dist/leaflet.css");

                // Buat map
                const map = L.map("map").setView([-7.2575, 112.7521], 13);

                // Tambahkan tile layer (dari OpenStreetMap)
                L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution:
                        '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
                }).addTo(map);

                // Tambahkan marker
                L.marker([-7.2575, 112.7521]).addTo(map).bindPopup("Halo Surabaya!");

                // Cleanup ketika komponen unmount
                return () => {
                    map.remove();
                };
            };

            initMap();
        }
    }, []);

    return (
        <div
            id="map"
            style={{
                height: "100%",
                width: "100%",
            }}
            aria-label="Peta Infrastruktur Sumber Daya Air"
            tabIndex={0}
        ></div>
    );
}
