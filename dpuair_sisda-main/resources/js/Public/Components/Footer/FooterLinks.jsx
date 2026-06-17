import { Link } from "@inertiajs/react";

const FooterLinks = ({ footerSections = [] }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {footerSections.map((section) => (
            <div key={section.title}>
                <h4 className="text-base font-bold text-white mb-6">
                    {section.title}
                </h4>
                <ul className="space-y-3">
                    {section.links.map((link) => (
                        <li key={link.name}>
                            {link.external ? (
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
                                >
                                    {link.name}
                                </a>
                            ) : (
                                <Link
                                    href={link.href}
                                    className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
                                >
                                    {link.name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        ))}
    </div>
);

export default FooterLinks;
