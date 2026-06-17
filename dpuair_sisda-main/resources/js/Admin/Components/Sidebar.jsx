import SidebarContent from "./Sidebar/SidebarContent";

const Sidebar = ({
    sidebarCollapsed = false,
    setSidebarCollapsed,
    mobileMenuOpen = false,
    setMobileMenuOpen,
    isMobile = false,
}) => {
    if (isMobile) {
        return (
            <div className="mobile-sidebar relative flex flex-col w-80 max-w-xs bg-white shadow-xl">
                <SidebarContent
                    isMobile={true}
                    setMobileMenuOpen={setMobileMenuOpen}
                    sidebarCollapsed={false}
                />
            </div>
        );
    }

    return (
        <div
            className={`hidden lg:flex flex-col bg-white shadow-sm border-r border-gray-200 transition-all duration-300 ease-in-out fixed left-0 top-0 h-full z-40 ${
                sidebarCollapsed ? "w-20" : "w-64"
            }`}
        >
            <SidebarContent
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                isMobile={false}
            />
        </div>
    );
};

export default Sidebar;
