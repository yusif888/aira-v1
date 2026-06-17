import { Link } from "@inertiajs/react";

const FooterLogo = ({ socialMedia }) => (
    <div className="space-y-8">
        {/* Logo & Name */}
        <div>
            <img
                src="/assets/images/PUSDAJATIM_WHITE.png"
                alt="Logo PUSDAJATIM"
                className="h-20 w-auto mb-6"
            />
            <h3 className="text-2xl font-bold text-white mb-2">
                Dinas PU Sumber Daya Air
            </h3>
            <p className="text-white/60">Provinsi Jawa Timur</p>
        </div>

        {/* Description */}
        <p className="text-white/80 leading-relaxed max-w-sm">
            Berkomitmen untuk mengelola dan mengembangkan infrastruktur sumber
            daya air demi kesejahteraan masyarakat
        </p>

        {/* Social Media */}
        <div className="space-y-4">
            <h4 className="text-base font-bold text-white">Media Sosial</h4>
            <div className="flex gap-4">
                {socialMedia.map((social) => (
                    <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-white transition-colors duration-300"
                        title={social.name}
                    >
                        <i className={`${social.iconClass} text-2xl`}></i>
                    </a>
                ))}
            </div>
        </div>
    </div>
);

export default FooterLogo;
