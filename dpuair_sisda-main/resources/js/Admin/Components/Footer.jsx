import { Link } from "@inertiajs/react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    {/* Left section - Copyright */}
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                            © {currentYear} | Sistem Informasi Sumber Daya Air
                        </div>
                    </div>

                    {/* Right section - System info and version */}
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                        <div className="flex items-center space-x-2">
                            All rights reserved
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
