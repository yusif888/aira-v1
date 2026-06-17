import "../css/app.css";
import "./bootstrap";
// Import CSS yang diperlukan untuk React Quill dan komponen admin
import "../css/quill-global.css";
import "../css/quill-custom.css";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot, hydrateRoot } from "react-dom/client";
import { route as ziggyRoute } from "ziggy-js";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${appName} - ${title}`,
    resolve: (name) => {
        // Check if it's an Admin page (starts with Admin/)
        if (name.startsWith("Admin/")) {
            return resolvePageComponent(
                `./Admin/Pages/${name.replace("Admin/", "")}.jsx`,
                import.meta.glob("./Admin/Pages/**/*.jsx"),
            );
        }

        // Use same resolve logic as SSR for consistency
        return resolvePageComponent(
            `./Public/Pages/${name}.jsx`,
            import.meta.glob("./Public/Pages/**/*.jsx"),
        ).catch(() => {
            // Fallback to Admin pages
            return resolvePageComponent(
                `./Admin/Pages/${name}.jsx`,
                import.meta.glob("./Admin/Pages/**/*.jsx"),
            );
        });
    },
    setup({ el, App, props }) {
        // More accurate SSR detection
        const hasServerRenderedContent = el.innerHTML.trim().length > 0;

        // Make route() helper available globally
        window.route = (name, params, absolute, config) =>
            ziggyRoute(name, params, absolute, {
                ...config,
                // Use Ziggy data from props
                ...(props.initialPage.props.ziggy || {}),
            });

        if (hasServerRenderedContent) {
            // Hydrate existing server-rendered content
            hydrateRoot(el, <App {...props} />);
        } else {
            // Fresh client-side render
            const root = createRoot(el);
            root.render(<App {...props} />);
        }
    },
    progress: {
        color: "#4B5563",
    },
});
