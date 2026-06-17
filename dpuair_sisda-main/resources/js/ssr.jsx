import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";
import { createElement } from "react";
import ReactDOMServer from "react-dom/server";
import { route as ziggyRoute } from "ziggy-js";

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: (name) => {
            // Use eager loading for SSR performance
            const publicPages = import.meta.glob("./Public/Pages/**/*.jsx", {
                eager: true,
            });
            const adminPages = import.meta.glob("./Admin/Pages/**/*.jsx", {
                eager: true,
            });

            // Try Public pages first (same order as CSR)
            const publicPagePath = `./Public/Pages/${name}.jsx`;
            if (publicPages[publicPagePath]) {
                return publicPages[publicPagePath];
            }

            // Fallback to Admin pages
            const adminPagePath = `./Admin/Pages/${name}.jsx`;
            if (adminPages[adminPagePath]) {
                return adminPages[adminPagePath];
            }

            // Return null if not found
            return null;
        },
        setup: ({ App, props }) => {
            // Make route() helper available globally for SSR
            global.route = (name, params, absolute, config) =>
                ziggyRoute(name, params, absolute, {
                    ...config,
                    ...(props.initialPage.props.ziggy || {}),
                });

            return createElement(App, props);
        },
    })
);
