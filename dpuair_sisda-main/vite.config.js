import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx", // Unified entry point
            ssr: "resources/js/ssr.jsx", // SSR only for public pages
            refresh: true,
        }),
        react(),
    ],
    assetsInclude: ["**/*.geojson"],
    ssr: {
        noExternal: ["@inertiajs/react", "@inertiajs/ssr"],
    },
    // Konfigurasi untuk menangani CSS dari node_modules
    css: {
        preprocessorOptions: {
            css: {
                charset: false,
            },
        },
    },
    // Optimasi untuk node_modules
    optimizeDeps: {
        include: [],
    },
    // Resolve alias untuk memastikan path yang benar
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
            "react-quill-new": "react-quill-new",
        },
    },
    build: {
        chunkSizeWarningLimit: 1000,
    },
    // --- TAMBAHKAN BAGIAN INI ---
    server: {
        host: "0.0.0.0",
        port: 3001,
        hmr: {
            host: "localhost",
        },
    },
});
