import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link, usePage } from "@inertiajs/react";

// SSR-safe route helper
const safeRoute = (name, params = {}) => {
    if (typeof window !== "undefined" && window.route) {
        return route(name, params);
    }
    // Fallback for SSR - return basic URL structure
    const routes = {
        dashboard: "/dashboard",
        "profile.edit": "/profile",
        logout: "/logout",
    };
    return routes[name] || "#";
};

const Header = ({ setMobileMenuOpen }) => {
    const user = usePage().props.auth.user;

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between items-center">
                    {/* Left side - Mobile menu and breadcrumb */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-200"
                            aria-label="Open mobile menu"
                        >
                            <i className="fas fa-bars text-lg"></i>
                        </button>

                        {/* Logo for mobile */}
                        <Link href="/" className="lg:hidden flex-shrink-0">
                            <ApplicationLogo className="h-8 w-auto fill-current text-gray-800" />
                        </Link>
                    </div>

                    {/* Right side - User menu */}
                    <div className="flex items-center">
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="flex items-center max-w-xs bg-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors duration-200 p-2"
                                        aria-label="User menu"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <i className="fas fa-user text-white text-sm"></i>
                                            </div>
                                            <div className="hidden sm:block text-left">
                                                <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                                                    {user.name}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate max-w-32">
                                                    {user.email}
                                                </div>
                                            </div>
                                            <i className="fas fa-chevron-down text-gray-400 text-xs hidden sm:block"></i>
                                        </div>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {user.name}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                            {user.email}
                                        </div>
                                    </div>
                                    <Dropdown.Link
                                        href={route("admin.profile.edit")}
                                    >
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
