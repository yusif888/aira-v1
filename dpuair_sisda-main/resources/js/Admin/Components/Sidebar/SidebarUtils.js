// Helper to get a checkable path from a menu item
export const getPathForCheck = (item) => {
    if (item.href && item.href !== "#") return item.href;
    if (item.route) {
        try {
            // Check if route function exists globally
            if (typeof route !== "undefined") {
                return new URL(route(item.route)).pathname;
            }
            // Fallback: construct path manually if route helper not available
            return `/admin/${item.route
                .replace("admin.", "")
                .replace(".", "/")}`;
        } catch (e) {
            console.warn("Route helper error:", e);
            return null;
        }
    }
    return null;
};

// Build href from item
export const getHref = (item) => {
    if (!item) return null;
    if (item.href) return item.href;
    if (item.route) {
        try {
            // Check if route function exists globally
            if (typeof route !== "undefined") {
                return route(item.route);
            }
            // Fallback: construct path manually
            return `/admin/${item.route
                .replace("admin.", "")
                .replace(".", "/")}`;
        } catch (e) {
            console.warn("Route helper error:", e);
            return null;
        }
    }
    return null;
};

// Menu data statis berdasarkan modul
export const menuCategories = [
    {
        key: "dashboard",
        name: "Dashboard",
        icon: "fas fa-chart-line",
        route: "admin.dashboard",
        type: "link", // Direct link
    },
    {
        key: "news",
        name: "Berita",
        icon: "fas fa-newspaper",
        type: "dropdown", // Dropdown menu
        items: [
            { name: "Berita", route: "admin.news.index" },
            { name: "Kategori Berita", route: "admin.news.categories" },
            { name: "Tags Berita", route: "admin.news.tags" },
            { name: "Berita Terhapus", route: "admin.news.trash" },
        ],
    },
    {
        key: "documents",
        name: "Dokumen",
        icon: "fas fa-file-alt",
        type: "dropdown", // Dropdown menu
        items: [
            { name: "Dokumen", route: "admin.documents.index" },
            {
                name: "Kategori & Tipe Dokumen",
                route: "admin.documents.categories",
            },
            { name: "Tags Dokumen", route: "admin.documents.tags" },
            { name: "Dokumen Terhapus", route: "admin.documents.trash" },
        ],
    },
    {
        key: "portal_data",
        name: "Portal Data",
        icon: "fas fa-database",
        type: "dropdown", // Dropdown menu
        items: [{ name: "Dataset", route: "admin.portal-data.datasets" }],
    },
    {
        key: "pelayanan",
        name: "Pelayanan",
        icon: "fas fa-clipboard-list",
        type: "dropdown",
        items: [
            { name: "Antrian", route: "admin.pelayanan.antrian.index" },
        ],
    },
    {
        key: "infrastruktur_sda",
        name: "Infrastruktur SDA",
        icon: "fas fa-building",
        type: "dropdown", // Dropdown menu
        items: [
            {
                name: "Data Infrastruktur SDA",
                route: "admin.infrastruktur-sda.index",
            },
            {
                name: "Kategori Infrastruktur SDA",
                route: "admin.infrastruktur-sda.categories",
            },
        ],
    },
    {
        key: "setting",
        name: "Pengaturan",
        icon: "fas fa-cog",
        type: "dropdown", // Dropdown menu
        items: [
            { name: "Manajemen User", route: "admin.users.index" },
            { name: "Manajemen Role", route: "admin.roles.index" },
            {
                name: "Manajemen Hak Akses",
                route: "admin.permissions.index",
            },
        ],
    },
];

// Create a flattened list of all menu items for smarter active state checking
export const allMenuItems = menuCategories.flatMap((category) =>
    category.items && category.items.length > 0
        ? category.items
        : category.route
          ? [category]
          : [],
);

// Check if current URL matches the path with smart logic
export const isCurrentPath = (path) => {
    if (typeof window !== "undefined" && path) {
        const currentPath = window.location.pathname;

        // Check if this path is a base for another more specific menu item.
        // For example, `/admin/news` is a base for `/admin/news/categories`.
        const isPrefixForOtherItem = allMenuItems.some((item) => {
            const itemPath = getPathForCheck(item);
            return (
                itemPath && itemPath !== path && itemPath.startsWith(path + "/")
            );
        });

        if (isPrefixForOtherItem) {
            // If it's a prefix for another item, we need an exact match.
            // This prevents "Berita" from being active when on "Kategori Berita".
            return currentPath === path;
        } else {
            // If it's not a prefix for another item, we can do a partial match.
            // This allows "Manajemen User" (`/admin/users`) to be active
            // when on `/admin/users/4/edit`.
            return currentPath.startsWith(path);
        }
    }
    return false;
};

// Check if any child items are active
export const isChildActive = (items) => {
    if (!items || !Array.isArray(items)) return false;
    return items.some((item) => {
        const path = getPathForCheck(item);
        return path ? isCurrentPath(path) : false;
    });
};
