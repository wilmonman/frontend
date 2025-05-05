import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { Github, BookOpen, ExternalLink } from 'lucide-react';

// --- Import logo images ---
import logoTop from '../../assets/logos/Logo_Escuela.png';
import logoBottom from '../../assets/logos/Logo_UIS.png';

// --- Footer Component ---
const Footer = () => {
    const { t } = useTranslation('app'); // Use 'app' namespace
    const currentYear = new Date().getFullYear();

    // Use translation keys for link names
    const footerLinks = {
        useful: [
            { key: 'footer.links.about', path: '/about', internal: true },
            { key: 'footer.links.contact', path: '/contact', internal: true },
            { key: 'footer.links.privacy', path: '/privacy', internal: true },
        ],
        resources: [
            { key: 'footer.links.github', href: 'https://github.com/wilmonman/frontend', icon: Github, external: true },
            { key: 'footer.links.satnogs', href: 'https://satnogs.org/', icon: ExternalLink, external: true },
            { key: 'footer.links.docs', path: '/docs', icon: BookOpen, internal: true },
        ]
    };

    const linkClasses = "text-sm text-text-footer-secondary hover:text-blue-600 dark:hover:text-blue-400 transition duration-200 ease-in-out focus:outline-none focus-visible:text-blue-600 dark:focus-visible:text-blue-400";
    const resourceLinkClasses = `${linkClasses} inline-flex items-center space-x-1.5`;

    return (
        <footer className="bg-bg-footer text-text-footer-secondary pt-12 pb-8 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* === LOGO SECTION === */}
                    <div className="mb-6 md:mb-0">
                        <div className="flex flex-col items-start space-y-2">
                            {/* --- E3T Logo Link (Translate aria-label) --- */}
                            <a
                                href="https://e3t.uis.edu.co/eisi/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t('e3tAriaLabel')} // Translate
                                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                            >
                                <img
                                    src={logoTop}
                                    alt={t('logoAlt') + ' E3T'} // Combine or make specific key
                                    className="h-20 w-auto block"
                                />
                            </a>
                            {/* --- UIS Logo Link (Translate aria-label) --- */}
                            <a
                                href="https://uis.edu.co"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={t('uisAriaLabel')} // Translate
                                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
                            >
                                <img
                                    src={logoBottom}
                                    alt={t('logoAlt') + ' UIS'} // Combine or make specific key
                                    className="h-12 w-auto block"
                                />
                            </a>
                        </div>
                        {/* Translate tagline */}
                        <p className="text-sm mt-5 max-w-xs text-text-footer-muted">
                           {t('footer.tagline')}
                        </p>
                    </div>
                    {/* === END LOGO SECTION === */}

                    {/* Useful Links (Translate title and links) */}
                    <div>
                        <h5 className="font-semibold mb-4 text-text-footer-primary tracking-wide uppercase text-sm">{t('footer.usefulLinks')}</h5>
                        <ul className="space-y-2">
                            {footerLinks.useful.map(link => (
                                <li key={link.key}>
                                    {link.internal ? (
                                        <Link to={link.path} className={linkClasses}>
                                            {t(link.key)} {/* Translate name */}
                                        </Link>
                                    ) : (
                                         <Link to={link.path || '#'} className={linkClasses}>
                                            {t(link.key)} {/* Translate name */}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links (Translate title and links) */}
                    <div>
                        <h5 className="font-semibold mb-4 text-text-footer-primary tracking-wide uppercase text-sm">{t('footer.resources')}</h5>
                        <ul className="space-y-2">
                             {footerLinks.resources.map(link => (
                                <li key={link.key}>
                                    {link.internal ? (
                                        <Link to={link.path} className={resourceLinkClasses}>
                                            {link.icon && <link.icon size={14} />}
                                            <span>{t(link.key)}</span> {/* Translate name */}
                                        </Link>
                                    ) : (
                                        <a
                                            href={link.href}
                                            target={link.external ? "_blank" : "_self"}
                                            rel={link.external ? "noopener noreferrer" : ""}
                                            className={resourceLinkClasses}
                                        >
                                            {link.icon && <link.icon size={14} />}
                                            <span>{t(link.key)}</span> {/* Translate name */}
                                            {link.external && <ExternalLink size={12} className="opacity-70 ml-1" />}
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright (Translate and interpolate year) */}
                <div className="border-t border-border-footer pt-6 text-center text-xs text-text-footer-muted">
                    {/* Use interpolation for the year */}
                    <p>{t('footer.copyright', { year: currentYear })}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
