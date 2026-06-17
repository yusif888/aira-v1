import Sidebar from "@/Admin/Components/Sidebar";
import Header from "@/Admin/Components/Header";
import Footer from "@/Admin/Components/Footer";
import { useState, useEffect } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && !event.target.closest(".mobile-sidebar")) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [mobileMenuOpen]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 lg:bg-gray-100 flex flex-col">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    ></div>

                    {/* Mobile Sidebar */}
                    <Sidebar
                        sidebarCollapsed={sidebarCollapsed}
                        setSidebarCollapsed={setSidebarCollapsed}
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={setMobileMenuOpen}
                        isMobile={true}
                    />
                </div>
            )}

            <div className="flex min-h-screen">
                {/* Desktop Sidebar */}
                <Sidebar
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    isMobile={false}
                />

                {/* Main Content Area */}
                <div
                    className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
                        sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"
                    }`}
                >
                    {/* Top Navigation Header */}
                    <Header setMobileMenuOpen={setMobileMenuOpen} />

                    {/* Page Header */}
                    {header && (
                        <header className="bg-white shadow-sm border-b border-gray-200">
                            <div className="px-4 py-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    {/* Main Content */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                        <div className="max-w-full">{children}</div>
                    </main>

                    {/* Footer */}
                    <Footer />
                </div>
            </div>
        </div>
    );
}
