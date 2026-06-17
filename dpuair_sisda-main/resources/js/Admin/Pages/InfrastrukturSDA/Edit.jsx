import React, { useState, useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Admin/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import { showLoading, showSuccess, closeLoading } from "@/Components/SweetAlert";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Edit({ auth, categories = [], infrastruktur }) {
    const { data, setData, post, processing, errors } = useForm({
        name: infrastruktur.name || "",
        description: infrastruktur.description || "",
        category_id: infrastruktur.category_id || "",
        code: infrastruktur.code || "",
        type: infrastruktur.type || "marker",
        legend_color: infrastruktur.legend_color || "#3B82F6",
        latitude: infrastruktur.latitude || "",
        longitude: infrastruktur.longitude || "",
        geojson: infrastruktur.geojson || "",
        geojson_file: null,
        is_active: infrastruktur.is_active ?? true,
        _method: "PUT",
    });

    const [fileInfo, setFileInfo] = useState(null);
    const [geoJsonPreview, setGeoJsonPreview] = useState(null);
    const mapContainer = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const previewMapContainer = useRef(null);
    const previewMapRef = useRef(null);

    useEffect(() => {
        if (!mapContainer.current) return;
        
        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://api.maptiler.com/maps/streets-v2/style.json?key=psNOn7FkqrLr9hSTkoqX",
            center: [112.0, -7.8],
            zoom: 8,
        });

        mapRef.current = map;

        return () => map.remove();
    }, []);

    useEffect(() => {
        if (!mapRef.current || data.type !== 'marker') return;
        
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
            if (markerRef.current) {
                markerRef.current.remove();
            }

            const marker = new maplibregl.Marker({
                draggable: true,
                color: data.legend_color || '#3B82F6'
            })
                .setLngLat([lng, lat])
                .addTo(mapRef.current);

            marker.on('dragend', () => {
                const lngLat = marker.getLngLat();
                setData({
                    ...data,
                    latitude: lngLat.lat.toFixed(6),
                    longitude: lngLat.lng.toFixed(6)
                });
            });

            markerRef.current = marker;

            mapRef.current.flyTo({
                center: [lng, lat],
                zoom: 13,
                essential: true
            });
        }
    }, [data.latitude, data.longitude, data.type, data.legend_color]);

    useEffect(() => {
        if (!mapRef.current || data.type !== 'marker') return;

        const handleMapClick = (e) => {
            const { lng, lat } = e.lngLat;
            setData({
                ...data,
                latitude: lat.toFixed(6),
                longitude: lng.toFixed(6)
            });
        };

        mapRef.current.on('click', handleMapClick);

        return () => {
            if (mapRef.current) {
                mapRef.current.off('click', handleMapClick);
            }
        };
    }, [data.type]);

    useEffect(() => {
        if (!previewMapContainer.current || (data.type !== 'line' && data.type !== 'polygon')) return;

        if (!previewMapRef.current) {
            const previewMap = new maplibregl.Map({
                container: previewMapContainer.current,
                style: "https://api.maptiler.com/maps/streets-v2/style.json?key=psNOn7FkqrLr9hSTkoqX",
                center: [112.0, -7.8],
                zoom: 6,
            });

            previewMapRef.current = previewMap;
        }

        const map = previewMapRef.current;

        const getGeoJson = () => {
            if (geoJsonPreview) return geoJsonPreview;
            if (data.geojson) {
                try {
                    return JSON.parse(data.geojson);
                } catch (e) {
                    console.error('Invalid GeoJSON in data.geojson', e);
                    return null;
                }
            }
            return null;
        };

        const geo = getGeoJson();
        if (!geo) {
            if (map.getLayer('preview-line')) map.removeLayer('preview-line');
            if (map.getLayer('preview-fill')) map.removeLayer('preview-fill');
            if (map.getSource('geojson-preview')) map.removeSource('geojson-preview');
            return;
        }

        const ensureAndUpdate = () => {
            if (map.getSource && map.getSource('geojson-preview')) {
                try {
                    map.getSource('geojson-preview').setData(geo);
                } catch (e) {
                    console.error('Failed to set source data', e);
                }
            } else if (map.addSource) {
                try {
                    map.addSource('geojson-preview', {
                        type: 'geojson',
                        data: geo,
                    });
                } catch (e) {
                    console.error('Failed to add source', e);
                }
            }

            try { if (map.getLayer && map.getLayer('preview-line')) map.removeLayer('preview-line'); } catch (e) {}
            try { if (map.getLayer && map.getLayer('preview-fill')) map.removeLayer('preview-fill'); } catch (e) {}

            const color = data.legend_color || '#3B82F6';
            try {
                if (data.type === 'polygon') {
                    map.addLayer({
                        id: 'preview-fill',
                        type: 'fill',
                        source: 'geojson-preview',
                        paint: {
                            'fill-color': color,
                            'fill-opacity': 0.35,
                        },
                    });

                    map.addLayer({
                        id: 'preview-line',
                        type: 'line',
                        source: 'geojson-preview',
                        paint: {
                            'line-color': color,
                            'line-width': 3,
                        },
                    });
                } else {
                    map.addLayer({
                        id: 'preview-line',
                        type: 'line',
                        source: 'geojson-preview',
                        paint: {
                            'line-color': color,
                            'line-width': 3,
                        },
                    });
                }
            } catch (e) {
                console.error('Failed to add layers', e);
            }
        };

        if (!map.isStyleLoaded || !map.isStyleLoaded()) {
            map.once('load', ensureAndUpdate);
        } else {
            ensureAndUpdate();
        }

        try {
            const coords = [];

            const collectCoords = (obj) => {
                if (!obj) return;
                if (obj.type === 'FeatureCollection' && Array.isArray(obj.features)) {
                    obj.features.forEach((f) => collectCoords(f.geometry || f));
                } else if (obj.type === 'Feature') {
                    collectCoords(obj.geometry);
                } else if (obj.type === 'GeometryCollection' && Array.isArray(obj.geometries)) {
                    obj.geometries.forEach((g) => collectCoords(g));
                } else if (Array.isArray(obj.coordinates)) {
                    const traverse = (c) => {
                        if (typeof c[0] === 'number' && typeof c[1] === 'number') {
                            coords.push(c);
                        } else if (Array.isArray(c)) {
                            c.forEach(traverse);
                        }
                    };
                    traverse(obj.coordinates);
                }
            };

            collectCoords(geo);

            if (coords.length) {
                let minLng = coords[0][0], minLat = coords[0][1], maxLng = coords[0][0], maxLat = coords[0][1];
                coords.forEach((c) => {
                    if (c[0] < minLng) minLng = c[0];
                    if (c[0] > maxLng) maxLng = c[0];
                    if (c[1] < minLat) minLat = c[1];
                    if (c[1] > maxLat) maxLat = c[1];
                });

                const padding = 0.01;
                map.fitBounds([[minLng - padding, minLat - padding], [maxLng + padding, maxLat + padding]], { padding: 40, duration: 500 });
            }
        } catch (e) {
            console.error('Error fitting bounds for preview', e);
        }

        return () => {
            if (map && map.style && map.getLayer && map.getSource) {
                if (map.getLayer('preview-line')) try { map.removeLayer('preview-line'); } catch (e) {}
                if (map.getLayer('preview-fill')) try { map.removeLayer('preview-fill'); } catch (e) {}
                if (map.getSource('geojson-preview')) try { map.removeSource('geojson-preview'); } catch (e) {}
            }
        };
    }, [data.type, geoJsonPreview, data.geojson, data.legend_color]);

    useEffect(() => {
        if (infrastruktur.geojson) {
            try {
                const json = typeof infrastruktur.geojson === 'string' 
                    ? JSON.parse(infrastruktur.geojson) 
                    : infrastruktur.geojson;
                setGeoJsonPreview(json);
            } catch (error) {
                console.error("Error parsing existing GeoJSON:", error);
            }
        }

        // Show existing file info if file_path exists
        if (infrastruktur.file_path) {
            const fileName = infrastruktur.file_path.split('/').pop();
            setFileInfo({
                name: fileName,
                size: 'File tersimpan',
                isExisting: true
            });
        }
    }, [infrastruktur.geojson, infrastruktur.file_path]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("geojson_file", file);
            setFileInfo({
                name: file.name,
                size: (file.size / 1024).toFixed(2) + ' KB',
            });
            // Read and parse the file (set preview and form geojson)
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const json = JSON.parse(event.target.result);
                    setGeoJsonPreview(json);
                    setData("geojson", JSON.stringify(json));
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            };
            reader.readAsText(file);
        }

    };

    // continue with normal render
    const removeFile = () => {
        setData("geojson_file", null);
        
        // If removing a newly uploaded file, restore original data
        if (!fileInfo?.isExisting) {
            // Restore original geojson if exists
            if (infrastruktur.geojson) {
                setData("geojson", infrastruktur.geojson);
                try {
                    const json = typeof infrastruktur.geojson === 'string'
                        ? JSON.parse(infrastruktur.geojson)
                        : infrastruktur.geojson;
                    setGeoJsonPreview(json);
                } catch (error) {
                    console.error("Error restoring GeoJSON:", error);
                }
            }

            // Restore existing file info if available
            if (infrastruktur.file_path) {
                const fileName = infrastruktur.file_path.split('/').pop();
                setFileInfo({
                    name: fileName,
                    size: 'File tersimpan',
                    isExisting: true
                });
            } else {
                setFileInfo(null);
                setGeoJsonPreview(null);
            }
        } else {
            // If removing existing file, clear everything
            setFileInfo(null);
            setGeoJsonPreview(null);
            setData("geojson", "");
        }
    };

    const submit = (e) => {
        e.preventDefault();
        showLoading('Menyimpan Data...', 'Mohon tunggu sebentar');
        post(route("admin.infrastruktur-sda.update", infrastruktur.id), {
            onSuccess: () => {
                closeLoading();
                showSuccess('Data berhasil diupdate', 'Infrastruktur telah diperbarui.', 'success');
            },
            onError: () => {
                closeLoading();
            }
        });
    };
        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="flex items-center gap-3">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Edit Infrastruktur SDA
                        </h2>
                    </div>
                }
            >
                <Head title="Edit Infrastruktur SDA" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Left Column */}
                                    <div className="space-y-6">
                                        <div>
                                            <InputLabel htmlFor="name" value="Nama Infrastruktur" />
                                            <TextInput
                                                id="name"
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full"
                                                autoComplete="name"
                                                isFocused={true}
                                                onChange={(e) => setData("name", e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="category_id" value="Kategori" />
                                            <select
                                                id="category_id"
                                                name="category_id"
                                                value={data.category_id}
                                                onChange={(e) => setData("category_id", e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            >
                                                <option value="">Pilih Kategori</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.category_id} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="code" value="Kode" />
                                            <TextInput
                                                id="code"
                                                name="code"
                                                value={data.code}
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData("code", e.target.value)}
                                                placeholder="awlr, posDugaAir, bendungan, dll"
                                                required
                                            />
                                            <InputError message={errors.code} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="type" value="Tipe Geometri" />
                                            <select
                                                id="type"
                                                name="type"
                                                value={data.type}
                                                onChange={(e) => setData("type", e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                required
                                            >
                                                <option value="marker">Marker (Point)</option>
                                                <option value="line">Line</option>
                                                <option value="polygon">Polygon</option>
                                            </select>
                                            <InputError message={errors.type} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="legend_color" value="Warna Legend" />
                                            <div className="flex gap-2 mt-1">
                                                <input
                                                    type="color"
                                                    id="legend_color"
                                                    name="legend_color"
                                                    value={data.legend_color}
                                                    onChange={(e) => setData("legend_color", e.target.value)}
                                                    className="h-10 w-20 border-gray-300 rounded-md"
                                                />
                                                <TextInput
                                                    value={data.legend_color}
                                                    className="flex-1"
                                                    onChange={(e) => setData("legend_color", e.target.value)}
                                                    placeholder="#3B82F6"
                                                />
                                            </div>
                                            <InputError message={errors.legend_color} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="description" value="Deskripsi" />
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={data.description}
                                                onChange={(e) => setData("description", e.target.value)}
                                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                rows="4"
                                            ></textarea>
                                            <InputError message={errors.description} className="mt-2" />
                                        </div>
                                         <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="is_active"
                                                name="is_active"
                                                checked={data.is_active}
                                                onChange={(e) => setData("is_active", e.target.checked)}
                                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                            />
                                            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                                                Aktif
                                            </label>
                                        </div>
                                    </div>

                                    {/* Right Column - Map and Coordinates */}
                                    <div className="space-y-6">
                                        {/* File Upload - Available for all types */}
                                        <div>
                                            <InputLabel htmlFor="geojson_file" value="Upload File GeoJSON/JSON" />
                                            <div className="mt-1">
                                                {!fileInfo ? (
                                                    <div className="flex items-center justify-center w-full">
                                                        <label
                                                            htmlFor="geojson_file"
                                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                                        >
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                                                <p className="mb-2 text-sm text-gray-500">
                                                                    <span className="font-semibold">Klik untuk upload</span> atau drag and drop
                                                                </p>
                                                                <p className="text-xs text-gray-500">GeoJSON atau JSON (Max 10MB)</p>
                                                            </div>
                                                            <input
                                                                id="geojson_file"
                                                                type="file"
                                                                className="hidden"
                                                                accept=".json,.geojson"
                                                                onChange={handleFileChange}
                                                            />
                                                        </label>
                                                    </div>
                                                ) : (
                                                    <div className="p-4 border-2 border-green-200 bg-green-50 rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <i className={`fas ${fileInfo.isExisting ? 'fa-file-check' : 'fa-file-alt'} text-2xl text-green-600`}></i>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-900">{fileInfo.name}</p>
                                                                    <p className="text-xs text-gray-500">
                                                                        {fileInfo.isExisting ? (
                                                                            <span className="flex items-center gap-1">
                                                                                <i className="fas fa-check-circle text-green-600"></i>
                                                                                {fileInfo.size}
                                                                            </span>
                                                                        ) : (
                                                                            fileInfo.size
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={removeFile}
                                                                className="text-red-600 hover:text-red-800"
                                                                title={fileInfo.isExisting ? "Hapus file yang tersimpan" : "Hapus file yang diupload"}
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <InputError message={errors.geojson_file} className="mt-2" />
                                        </div>


                                        {/* Manual Input for Marker */}
                                        {data.type === 'marker' && !fileInfo && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <InputLabel htmlFor="latitude" value="Latitude" />
                                                    <TextInput
                                                        id="latitude"
                                                        name="latitude"
                                                        type="number"
                                                        step="any"
                                                        value={data.latitude}
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData("latitude", e.target.value)}
                                                        placeholder="-7.12345"
                                                    />
                                                    <InputError message={errors.latitude} className="mt-2" />
                                                </div>
                                                <div>
                                                    <InputLabel htmlFor="longitude" value="Longitude" />
                                                    <TextInput
                                                        id="longitude"
                                                        name="longitude"
                                                        type="number"
                                                        step="any"
                                                        value={data.longitude}
                                                        className="mt-1 block w-full"
                                                        onChange={(e) => setData("longitude", e.target.value)}
                                                        placeholder="110.12345"
                                                    />
                                                    <InputError message={errors.longitude} className="mt-2" />
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Interactive Map for Marker */}
                                        {data.type === 'marker' && (
                                            <div>
                                                <InputLabel value="Pilih Lokasi di Peta" />
                                                <div className="mt-1">
                                                    <div 
                                                        ref={mapContainer} 
                                                        className="w-full h-64 rounded-lg border-2 border-gray-300"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-2">
                                                        <i className="fas fa-info-circle mr-1"></i>
                                                        Klik pada peta untuk memilih lokasi atau drag marker yang ada
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Preview for Line/Polygon (read-only) */}
                                        {(data.type === 'line' || data.type === 'polygon') && (
                                            <div>
                                                {!geoJsonPreview && !data.geojson ? (
                                                    <div className="p-4 border-2 border-dashed rounded-lg text-center bg-gray-50">
                                                        <i className="fas fa-map-marked-alt text-4xl text-gray-400 mb-3"></i>
                                                        <h3 className="text-lg font-medium text-gray-700">Integrasi Peta</h3>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Upload atau paste GeoJSON untuk menampilkan preview read-only dari Line/Polygon di sini.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <InputLabel value="Preview GeoJSON" />
                                                        <div className="mt-1">
                                                            <div
                                                                ref={previewMapContainer}
                                                                className="w-full h-64 rounded-lg border-2 border-gray-300"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-6 border-t">
                                    <Link href={route("admin.infrastruktur-sda.index")}>
                                        <SecondaryButton type="button" disabled={processing}>
                                            Batal
                                        </SecondaryButton>
                                    </Link>
                                    <PrimaryButton type="submit" disabled={processing}>
                                        {processing ? "Menyimpan..." : "Update Infrastruktur"}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
