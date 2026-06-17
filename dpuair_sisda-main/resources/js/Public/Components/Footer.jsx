import FooterLogo from "@/Public/Components/Footer/FooterLogo";
import FooterLinks from "@/Public/Components/Footer/FooterLinks";
import FooterContacts from "@/Public/Components/Footer/FooterContacts";

import footerData from "@/Public/Components/Footer/footerData.json";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="relative bg-[#173c94] text-white overflow-hidden">
            {/* Background Logo */}
            <div className="absolute right-0 bottom-0 w-1/2 opacity-5">
                <img
                    src="/assets/images/PUSDAJATIM_WHITE_LOGO.png"
                    alt=""
                    className="w-full h-full object-contain"
                />
            </div>

            <div className="relative max-w-screen-2xl mx-auto px-6 sm:px-8 lg:px-12 py-20 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 mb-16">
                    <div className="lg:col-span-4">
                        <FooterLogo socialMedia={footerData.socialMedia} />
                    </div>
                    <div className="lg:col-span-5">
                        <FooterLinks
                            footerSections={footerData.footerSections}
                        />
                    </div>
                    <div className="lg:col-span-3">
                        <FooterContacts
                            quickContacts={footerData.quickContacts}
                        />
                    </div>
                </div>

                {/* Bottom Area */}
                <div className="border-t border-white/10 pt-8">
                    <p className="text-sm text-white/60">
                        © {year} Dinas Pekerjaan Umum Sumber Daya Air Provinsi
                        Jawa Timur
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
