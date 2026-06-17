import { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import SocialMediaBar from "./Header/SocialMediaBar";
import MegaMenu from "./Header/MegaMenu";

import HeaderMobile from "./Header/HeaderMobile";

export default function Header({ transparentAtTop = false }) {
    // Main States
    const [activeMenu, setActiveMenu] = useState(null); // null, 'profil', 'program', etc.
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [currentDate, setCurrentDate] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);

    // Mobile States
    const [mobileOpenSections, setMobileOpenSections] = useState({});
    const [mobileOpenItems, setMobileOpenItems] = useState({});
    const [openMobileDropdownId, setOpenMobileDropdownId] = useState(null);

    // Ref untuk dropdown positioning
    const profilButtonRef = useRef(null);
    const beritaButtonRef = useRef(null);
    const dokumenButtonRef = useRef(null);
    const infrastrukturSdaButtonRef = useRef(null);
    const portalDataButtonRef = useRef(null);
    const pengaduanButtonRef = useRef(null);

    const profilMenu = {
        id: "profil",
        name: "PROFIL",
        data: {
            title: "PROFIL",
            subtitle: "Informasi mengenai Dinas PU Sumber Daya Air Jawa Timur.",
            icon: "fas fa-building",
            items: [
                {
                    id: "tupoksi",
                    title: "Tugas Pokok dan Fungsi",
                    url: "/profil/tupoksi",
                },
                {
                    id: "dasar-hukum",
                    title: "Dasar Hukum",
                    url: "/profil/dasar-hukum",
                },
                {
                    id: "struktur-organisasi",
                    title: "Struktur Organisasi",
                    url: "/organisasi/struktur",
                },
                {
                    id: "daftar-upt",
                    title: "Daftar UPT",
                    url: "/upt/daftar-upt",
                },
                {
                    id: "profil-pejabat",
                    title: "Profil Pejabat",
                    url: "/profil/pimpinan",
                },
            ],
        },
    };

    const beritaMenu = {
        id: "berita",
        name: "BERITA",
        data: {
            title: "BERITA",
            items: [
                {
                    id: "berita-umum",
                    title: "Berita Umum",
                    url: "/berita?category=berita-umum",
                },
                {
                    id: "publikasi",
                    title: "Publikasi",
                    url: "/berita?category=pulbikasi",
                },
                {
                    id: "event",
                    title: "Event",
                    url: "/berita?category=event",
                },
                {
                    id: "tkpsda",
                    title: "TKPSDA",
                    url: "/berita?category=tkpsda",
                },
                {
                    id: "dsda",
                    title: "DSDA",
                    url: "/berita?category=dewan-sda",
                },
                {
                    id: "komir",
                    title: "KOMIR",
                    url: "/berita?category=komir",
                },
            ],
        },
    };

    const dokumenMenu = {
        id: "dokumen",
        name: "DOKUMEN",
        data: {
            title: "DOKUMEN",
            items: [
                {
                    id: "semua-dokumen",
                    title: "Semua Dokumen",
                    url: "/dokumen",
                },
                {
                    id: "renstra",
                    title: "Renstra",
                    url: "/dokumen?search=renstra",
                },
                {
                    id: "renja",
                    title: "Renja",
                    url: "/dokumen?search=renja",
                },
                {
                    id: "sakip-lakip",
                    title: "SAKIP",
                    url: "/dokumen?search=sakip",
                },

                {
                    id: "sakip-lakip",
                    title: "LAKIP",
                    url: "/dokumen?search=lakip",
                },
                {
                    id: "lembar-kerja-rekanan",
                    title: "LKR",
                    url: "/dokumen?search=lkr",
                },
            ],
        },
    };

    const infrastrukturSdaMenu = {
        id: "infrastruktur-sda",
        name: "INFRASTRUKTUR SDA",
        data: {
            title: "INFRASTRUKTUR SDA",
            items: [],
        },
    };

    const pengaduanMenu = {
        id: "pengaduan",
        name: "PENGADUAN",
        data: {
            title: "PENGADUAN",
            items: [],
        },
    };

    const portalDataMenu = {
        id: "portal-data",
        name: "PORTAL DATA",
        data: {
            title: "PORTAL DATA",
            items: [
                {
                    id: "telusur-banyu",
                    title: "TELUSUR BANYU",
                    url: "https://telusurbanyu.dpuair.jatimprov.go.id/map?session=guest",
                    target: "_blank",
                },
                {
                    id: "fhd",
                    title: "FHD",
                    url: "https://hidrologi.dpuair.jatimprov.go.id/pelayanan/",
                    target: "_blank",
                },
                {
                    id: "sih3",
                    title: "SIH3",
                    url: "https://sih3.dpuair.jatimprov.go.id/",
                    target: "_blank",
                },
                {
                    id: "sibb",
                    title: "SIBB",
                    url: "https://sibb.dpuair.jatimprov.go.id/",
                    target: "_blank",
                },
                {
                    id: "joss",
                    title: "JOSS",
                    url: "https://joss.jatimprov.go.id/",
                    target: "_blank",
                },
                {
                    id: "skopi",
                    title: "SKOPI",
                    url: "https://sites.google.com/view/monevkinerja/home",
                    target: "_blank",
                },
                {
                    id: "sda-dalam-angka",
                    title: "SDA DALAM ANGKA",
                    url: "/sda-dalam-angka",
                },
                {
                    id: "sda-access",
                    title: "SDA ACCESS",
                    url: "https://pusda-planning.rachmanesa.com/",
                    target: "_blank",
                },
                {
                    id: "ppid",
                    title: "PPID",
                    url: "https://sih3.dpuair.jatimprov.go.id/ppidpusda/",
                    target: "_blank",
                },

                {
                    id: "pelayanan-publik",
                    title: "Pelayanan Publik",
                    url: "https://sippn.menpan.go.id/instansi/dinas-pekerjaan-umum-sumber-daya-air-provinsi-jawa-timur-173279",
                    target: "_blank",
                },
                {
                    id: "pelayanan-dinas",
                    title: "Pelayanan Dinas",
                    url: "https://linktr.ee/pusdajatim",
                    target: "_blank",
                },
            ],
        },
    };

    const menuConfig = {
        profil: profilMenu,
        berita: beritaMenu,
        dokumen: dokumenMenu,
        "infrastruktur-sda": infrastrukturSdaMenu,
        "portal-data": portalDataMenu,
        pengaduan: pengaduanMenu,
    };

    const menuItems = [
        { type: "link", name: "BERANDA", href: "/" },
        { type: "dropdown", ...profilMenu },
        { type: "dropdown", ...portalDataMenu },
        { type: "dropdown", ...beritaMenu },
        { type: "dropdown", ...dokumenMenu },
        {
            type: "external",
            name: "PENGADUAN",
            href: "https://www.lapor.go.id/",
            target: "_blank",
        },
        // { type: "link", name: "GALERI", href: "/galeri" },
        // { type: "link", name: "INFRASTRUKTUR SDA", href: "/infrastruktur-sda" },
    ];

    // Initialize date and scroll effects
    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const options = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "Asia/Jakarta",
            };
            setCurrentDate(now.toLocaleDateString("id-ID", options));
        };
        updateDate();
        const interval = setInterval(updateDate, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setActiveMenu(null);
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Handlers
    const toggleDesktopMenu = (menuId) => {
        setActiveMenu((prev) => (prev === menuId ? null : menuId));
    };

    const toggleMobileSection = (sectionId) => {
        setMobileOpenSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const toggleMobileItem = (itemId) => {
        setMobileOpenItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    const renderDesktopMenuItem = (item, index) => {
        const baseClasses =
            "px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-xl relative group";
        const scrolledClasses =
            "text-[#342c2c] hover:text-[#173c94] hover:bg-[#173c94]/10";
        const topClasses = "text-white hover:text-[#fcbc2c] hover:bg-white/10";

        if (item.type === "link") {
            return (
                <Link
                    key={index}
                    href={item.href}
                    className={`${baseClasses} ${
                        isScrolled ? scrolledClasses : topClasses
                    }`}
                >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-current/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
            );
        }

        if (item.type === "external") {
            return (
                <a
                    key={index}
                    href={item.href}
                    target={item.target}
                    rel={item.rel}
                    className={`${baseClasses} ${
                        isScrolled ? scrolledClasses : topClasses
                    }`}
                >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-current/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </a>
            );
        }

        if (item.type === "dropdown") {
            const isActive = activeMenu === item.id;
            const activeScrolledClasses = "bg-[#173c94]/10 text-[#173c94]";
            const activeTopClasses = "bg-white/10 text-[#fcbc2c]";

            return (
                <button
                    key={index}
                    ref={
                        item.id === "profil"
                            ? profilButtonRef
                            : item.id === "berita"
                            ? beritaButtonRef
                            : item.id === "dokumen"
                            ? dokumenButtonRef
                            : item.id === "infrastruktur-sda"
                            ? infrastrukturSdaButtonRef
                            : item.id === "portal-data"
                            ? portalDataButtonRef
                            : item.id === "pengaduan"
                            ? pengaduanButtonRef
                            : null
                    }
                    onClick={() => toggleDesktopMenu(item.id)}
                    className={`flex items-center space-x-2 ${baseClasses} ${
                        isScrolled ? scrolledClasses : topClasses
                    } ${
                        isActive
                            ? isScrolled
                                ? activeScrolledClasses
                                : activeTopClasses
                            : ""
                    }`}
                >
                    <span className="relative z-10">{item.name}</span>
                    <svg
                        className={`w-4 h-4 transition-all duration-300 relative z-10 ${
                            isActive ? "rotate-180 scale-110" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-current/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            );
        }
    };

    return (
        <>
            <SocialMediaBar currentDate={currentDate} />

            <header
                className={`sticky top-0 z-[60] transition-all duration-500 ${
                    isScrolled
                        ? "bg-white/95 backdrop-blur-xl shadow-lg "
                        : transparentAtTop
                        ? "bg-transparent"
                        : "bg-[#173c94]"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
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
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#173c94]/0 via-[#173c94]/10 to-[#173c94]/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                            </Link>
                        </div>

                        <nav className="hidden lg:flex items-center space-x-1">
                            {menuItems.map(renderDesktopMenuItem)}
                        </nav>

                        <div className="hidden lg:flex items-center ml-4">
                            <a
                                href="/infrastruktur-sda"
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                                    isScrolled
                                        ? "text-[#173c94] hover:text-[#fcbc2c] hover:bg-[#173c94]/5"
                                        : "text-white hover:text-[#fcbc2c] hover:bg-white/10"
                                }`}
                            >
                                INFRASTRUKTUR SDA
                            </a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="lg:hidden">
                                {!isMobileMenuOpen && (
                                    <button
                                        onClick={() =>
                                            setIsMobileMenuOpen(true)
                                        }
                                        className={`p-3 rounded-xl transition-all duration-300 group ${
                                            isScrolled
                                                ? "text-[#342c2c] hover:text-[#173c94] hover:bg-[#173c94]/10"
                                                : "text-white hover:text-[#fcbc2c] hover:bg-white/10"
                                        }`}
                                        aria-label="Buka menu"
                                    >
                                        <svg
                                            className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile menu is rendered outside the sticky header to avoid stacking issues when scrolled */}
                </div>
            </header>

            {isMobileMenuOpen && (
                <HeaderMobile
                    isMenuOpen={isMobileMenuOpen}
                    setIsMenuOpen={setIsMobileMenuOpen}
                    openMobileDropdownId={openMobileDropdownId}
                    setOpenMobileDropdownId={setOpenMobileDropdownId}
                    menuItems={menuItems}
                    mobileOpenSections={mobileOpenSections}
                    mobileOpenItems={mobileOpenItems}
                    toggleMobileSection={toggleMobileSection}
                    toggleMobileItem={toggleMobileItem}
                    isScrolled={isScrolled}
                />
            )}

            <MegaMenu
                isOpen={!!activeMenu}
                onClose={() => setActiveMenu(null)}
                isScrolled={isScrolled}
                menuData={activeMenu ? menuConfig[activeMenu].data : null}
                triggerRef={
                    activeMenu === "profil"
                        ? profilButtonRef
                        : activeMenu === "berita"
                        ? beritaButtonRef
                        : activeMenu === "dokumen"
                        ? dokumenButtonRef
                        : activeMenu === "infrastruktur-sda"
                        ? infrastrukturSdaButtonRef
                        : activeMenu === "portal-data"
                        ? portalDataButtonRef
                        : activeMenu === "pengaduan"
                        ? pengaduanButtonRef
                        : null
                }
            />
        </>
    );
}
