import { useState, useMemo } from "react";
import { Link, Head } from "@inertiajs/react";
import InfrastrukturLayout from "@/Public/Layouts/InfrastrukturLayout";
import MapViewMapLibre from "@/Public/Pages/InfrastrukturSDA/MapViewMapLibre";
import SidebarInfrastrukturSDA from "@/Public/Components/SidebarInfrastrukturSDA";

export default function InfrastrukturSDAIndex({ mapboxToken, categoriesFromDB = [] }) {
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [filters, setFilters] = useState({});

    const toggleFilter = (itemId) => {
        setFilters((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    // Transform data dari database ke format yang diperlukan untuk peta
    const { markers, polygonAreas, lineStrings } = useMemo(() => {
        const activeMarkers = [];
        const activePolygons = [];
        const activeLines = [];

        // Process data from database
        categoriesFromDB.forEach((category) => {
            category.data?.forEach((item) => {
                if (filters[item.id]) {
                    switch (item.type) {
                        case 'marker':
                            if (item.latitude && item.longitude) {
                                activeMarkers.push({
                                    id: item.id,
                                    name: item.name,
                                    description: item.description || '',
                                    type: item.code,
                                    color: item.legend_color || '#3B82F6',
                                    coordinates: [parseFloat(item.longitude), parseFloat(item.latitude)], // [lng, lat]
                                });
                            }
                            break;
                        case 'polygon':
                            if (item.geojson) {
                                activePolygons.push({
                                    id: item.id,
                                    name: item.name,
                                    type: item.code,
                                    color: item.legend_color || '#3B82F6',
                                    geojson: item.geojson,
                                });
                            }
                            break;
                        case 'line':
                            if (item.geojson) {
                                activeLines.push({
                                    id: item.id,
                                    name: item.name,
                                    type: item.code,
                                    color: item.legend_color || '#3B82F6',
                                    geojson: item.geojson,
                                });
                            }
                            break;
                    }
                }
            });
        });

        return {
            markers: activeMarkers,
            polygonAreas: activePolygons,
            lineStrings: activeLines,
        };
    }, [filters, categoriesFromDB]);

    return (
        <InfrastrukturLayout>
            <Head>
                <title>Peta Infrastruktur SDA</title>
                <meta
                    name="description"
                    content="Peta sebaran infrastruktur Sumber Daya Air di Provinsi Jawa Timur"
                />
            </Head>

            <div className="w-full h-screen relative">
                {/* Overlay Header */}
                <div className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm shadow-md">
                    <div className="flex px-6 justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center group">
                            <Link
                                href="/"
                                className="flex items-center space-x-3 transition-transform duration-300 group-hover:scale-105"
                            >
                                <div className="relative">
                                    <img
                                        src="/assets/images/PUSDAJATIM.png"
                                        alt="Logo PUSDAJATIM"
                                        className="h-12 w-auto transition-all duration-300"
                                    />
                                </div>
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Infrastruktur Sumber Daya Air
                        </h1>
                    </div>
                </div>

                {/* Sidebar Filter dari Database */}
                <SidebarInfrastrukturSDA
                    categories={categoriesFromDB}
                    filters={filters}
                    onToggleFilter={toggleFilter}
                    isOpen={isFilterOpen}
                    onToggleOpen={() => setIsFilterOpen(!isFilterOpen)}
                />

                <MapViewMapLibre
                    markers={markers}
                    polygonAreas={polygonAreas}
                    lineStrings={lineStrings}
                />
            </div>
        </InfrastrukturLayout>
    );
}
