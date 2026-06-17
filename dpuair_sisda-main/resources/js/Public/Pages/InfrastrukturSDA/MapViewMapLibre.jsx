import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Helper untuk mengekstrak 'properties' dari berbagai jenis GeoJSON
const getFeatureProperties = (geojson) => {
    if (!geojson) return null;
    if (geojson.type === "FeatureCollection") {
        return geojson.features?.[0]?.properties;
    }
    if (geojson.type === "Feature") {
        return geojson.properties;
    }
    return null;
};

// Helper untuk membuat HTML popup yang konsisten
const createPopupHTML = (name, description, coordinates = null) => {
    const googleMapsUrl = coordinates
        ? `https://www.google.com/maps/search/?api=1&query=${coordinates[1]},${coordinates[0]}`
        : null;
    const coordsString = coordinates ? JSON.stringify(coordinates) : "";

    return `
    <div class="p-3 " style="font-family: sans-serif;">
        <h3 class="font-bold text-base text-gray-900 mb-1">${name}</h3>
        <div class="text-sm text-gray-700">${description}</div>
        <div class="mt-3 flex items-center space-x-4">
            ${
                googleMapsUrl
                    ? `<a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline">
                         Petunjuk Arah &rarr;
                       </a>`
                    : ""
            }
            ${
                coordinates
                    ? `<button data-coords='${coordsString}' class="popup-zoom-button text-xs font-semibold text-green-600 hover:text-green-800 hover:underline focus:outline-none">
                         Lihat &bigodot;
                       </button>`
                    : ""
            }
        </div>
    </div>
    `;
};

export default function MapViewMapLibre({
    markers = [],
    polygonAreas = [],
    lineStrings = [],
}) {
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const addedPolygonIdsRef = useRef([]); // Untuk melacak poligon
    const addedLineIdsRef = useRef([]); // Untuk melacak garis
    const mapLoadedRef = useRef(false);

    useEffect(() => {
        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://api.maptiler.com/maps/streets-v2/style.json?key=psNOn7FkqrLr9hSTkoqX",
            center: [112.0, -7.8], // Center of East Java
            zoom: 8,
        });

        map.on("load", () => {
            mapLoadedRef.current = true;
        });

        mapRef.current = map;

        return () => map.remove();
    }, []);

    // Update markers when markers change
    useEffect(() => {
        if (!mapRef.current) return;

        // Remove existing markers
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        // Add new markers (already filtered from parent)
        markers.forEach((markerData) => {
            // Gunakan helper untuk popup
            const popup = new maplibregl.Popup({ offset: 25 }).setHTML(
                createPopupHTML(
                    markerData.name,
                    markerData.description,
                    markerData.coordinates
                )
            );

            // Tambahkan event listener untuk tombol zoom
            popup.on("open", () => {
                const zoomButton = popup
                    .getElement()
                    .querySelector(".popup-zoom-button");
                if (zoomButton) {
                    zoomButton.onclick = (e) => {
                        const coords = JSON.parse(e.target.dataset.coords);
                        mapRef.current.flyTo({
                            center: coords,
                            zoom: 20, // Zoom lebih dekat
                            essential: true,
                        });
                    };
                }
            });

            // Create marker element with dynamic color from markerData
            const el = document.createElement("div");
            el.className = "marker";
            el.style.width = "20px";
            el.style.height = "20px";
            el.style.borderRadius = "50%";
            el.style.backgroundColor = markerData.color || "#ef4444"; // Use color from data or fallback
            el.style.border = "1px solid white";
            el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
            el.style.cursor = "pointer";

            // Create and add marker to map
            const marker = new maplibregl.Marker({ element: el })
                .setLngLat(markerData.coordinates)
                .setPopup(popup)
                .addTo(mapRef.current);

            markersRef.current.push(marker);
        });
    }, [markers]);

    // Add polygon areas to map
    useEffect(() => {
        if (!mapRef.current || !mapLoadedRef.current) return;

        const map = mapRef.current;

        // Hapus layer dan source poligon yang ada sebelumnya
        addedPolygonIdsRef.current.forEach(
            ({ layerId, lineLayerId, sourceId }) => {
                if (map.getLayer(layerId)) map.removeLayer(layerId);
                if (map.getLayer(lineLayerId)) map.removeLayer(lineLayerId);
                if (map.getSource(sourceId)) map.removeSource(sourceId);
            }
        );
        addedPolygonIdsRef.current = []; // Kosongkan referensi

        // Add new polygon layers (already filtered from parent)
        polygonAreas.forEach((area) => {
            const sourceId = `polygon-source-${area.id}`;
            const layerId = `polygon-${area.id}`;
            const lineLayerId = `polygon-line-${area.id}`;

            // Simpan ID untuk pembersihan berikutnya
            addedPolygonIdsRef.current.push({
                layerId,
                lineLayerId,
                sourceId,
            });

            // Add source
            map.addSource(sourceId, {
                type: "geojson",
                data: area.geojson,
            });

            // Add fill layer
            map.addLayer({
                id: layerId,
                type: "fill",
                source: sourceId,
                paint: {
                    "fill-color": area.color || "#3b82f6", // Gunakan warna dari prop
                    "fill-opacity":
                        getFeatureProperties(area.geojson)?.fillOpacity || 0.2,
                },
            });

            // Add outline layer
            map.addLayer({
                id: lineLayerId,
                type: "line",
                source: sourceId,
                paint: {
                    "line-color": area.color || "#3b82f6", // Gunakan warna dari prop
                    "line-width": 2,
                },
            });

            // Add popup on click
            map.on("click", layerId, (e) => {
                const feature = e.features[0];
                const coordinates = e.lngLat;
                const props = feature.properties;

                // Membuat deskripsi dari properti yang ada di GeoJSON
                const description = `
                    <ul class="text-xs list-none space-y-1 mt-2">
                        <li><strong>Kode:</strong> ${
                            props.KODE_WS || "N/A"
                        }</li>
                        <li><strong>Luas:</strong> ${
                            props.Luas_WS || "N/A"
                        }</li>
                    </ul>
                `;

                new maplibregl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(
                        // Gunakan `area.name` dari `Index.jsx` dan deskripsi yang baru dibuat
                        createPopupHTML(area.name, description)
                    )
                    .addTo(map);
            });

            // Change cursor on hover
            map.on("mouseenter", layerId, () => {
                map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", layerId, () => {
                map.getCanvas().style.cursor = "";
            });
        });
    }, [polygonAreas]);

    // Add LineString to map
    useEffect(() => {
        if (!mapRef.current || !mapLoadedRef.current) return;

        const map = mapRef.current;

        // Hapus layer dan source garis yang ada sebelumnya
        addedLineIdsRef.current.forEach(({ layerId, sourceId }) => {
            if (map.getLayer(layerId)) map.removeLayer(layerId);
            if (map.getSource(sourceId)) map.removeSource(sourceId);
        });
        addedLineIdsRef.current = []; // Kosongkan referensi

        // Add new line layers (already filtered from parent)
        lineStrings.forEach((line) => {
            const sourceId = `line-source-${line.id}`;
            const layerId = `line-${line.id}`;

            // Simpan ID untuk pembersihan berikutnya
            addedLineIdsRef.current.push({ layerId, sourceId });

            // Add source
            map.addSource(sourceId, {
                type: "geojson",
                data: line.geojson,
            });

            // Add line layer
            map.addLayer({
                id: layerId,
                type: "line",
                source: sourceId,
                layout: {
                    "line-join": "round",
                    "line-cap": "round",
                },
                paint: {
                    "line-color": line.color || "#0ea5e9", // Gunakan warna dari prop
                    "line-width":
                        getFeatureProperties(line.geojson)?.width || 3,
                },
            });

            // Add popup on click
            map.on("click", layerId, (e) => {
                const feature = e.features[0];
                const coordinates = e.lngLat;

                new maplibregl.Popup()
                    .setLngLat(coordinates)
                    .setHTML(
                        createPopupHTML(
                            feature.properties.name,
                            feature.properties.description
                        )
                    )
                    .addTo(map);
            });

            // Change cursor on hover
            map.on("mouseenter", layerId, () => {
                map.getCanvas().style.cursor = "pointer";
            });

            map.on("mouseleave", layerId, () => {
                map.getCanvas().style.cursor = "";
            });
        });
    }, [lineStrings]);

    return (
        <div
            ref={mapContainer}
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
