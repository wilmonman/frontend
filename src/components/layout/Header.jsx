import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Satellite, Radio, Telescope, Menu, X, Home, BookOpen, Image as ImageIcon, Sun, Moon, Languages } from 'lucide-react';

function Header({ theme, toggleTheme, changeLanguage, currentLanguage }) {
    const { t } = useTranslation(['System', 'Header']);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    const handleLanguageToggle = () => {
    const nextLang = currentLanguage === 'en' ? 'es' : 'en';
    changeLanguage(nextLang);
    };

    // Navigation links data - keys remain the same but point to Header ns
    const navLinks = [
    { nameKey: 'Header:nav.home', path: '/home', icon: Home },
    { nameKey: 'Header:nav.resources', path: '/resources', icon: BookOpen },
    { nameKey: 'Header:nav.station', path: '/station', icon: Telescope },
    { nameKey: 'Header:nav.observations', path: '/observations', icon: Radio },
    { nameKey: 'Header:nav.images', path: '/images', icon: ImageIcon },
    { nameKey: 'Header:nav.satellites', path: '/satellites', icon: Satellite },
    ];

    // Theme-based styles 
    const bgColor = theme === 'light' ? 'bg-white' : 'bg-gray-900';
    const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';

    const iconColor = theme === 'light' ? 'text-blue-600' : 'text-blue-400';
    const activeLinkStyle = theme === 'light' ? 'bg-gray-100 text-blue-700' : 'bg-gray-700 text-white';
    const hoverBgColor = theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700';
    const hoverTextColor = theme === 'light' ? 'hover:text-gray-900' : 'hover:text-black';
    const mobileHoverBgColor = theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-gray-700';
    const mobileTextColor = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
    const toggleTextColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
    const toggleHoverTextColor = theme === 'light' ? 'hover:text-gray-800' : 'hover:text-white';
    const mobileMenuBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
    const mobileBorderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';


    return (
    <header className={`sticky top-0 z-50 font-sans shadow-md ${bgColor} ${textColor}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-stretch h-20">

            <Link to="/home" className="flex-shrink-0 flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md">
            <Satellite className={`h-10 w-10 mr-3 ${iconColor}`} />
            <span className="text-2xl font-bold">{t('appName')}</span>
            </Link>

            <div className="hidden md:flex md:flex-col justify-center">
            <nav className="flex space-x-1 items-center justify-end">
                {navLinks.map((link) => (
                <NavLink
                    key={link.nameKey}
                    to={link.path}
                    className={({ isActive }) =>
                    `px-3 py-1 rounded-md text-sm font-medium flex items-center transition duration-150 ease-in-out ${hoverBgColor} ${hoverTextColor} ${isActive ? activeLinkStyle : ''}`
                    }
                >
                    {link.icon && <link.icon className="h-4 w-4 mr-1" />}
                    {t(link.nameKey)}
                </NavLink>
                ))}
            </nav>
            <div className="flex space-x-3 items-center justify-end mt-1">
                <button
                onClick={handleLanguageToggle}
                className={`p-1 rounded-md text-sm font-medium flex items-center transition duration-150 ease-in-out ${toggleTextColor} ${hoverBgColor} ${toggleHoverTextColor}`}
                aria-label={t('toggle.language')}
                >
                <Languages className="h-5 w-5 mr-1" />
                {t('lang.current')}
                </button>

                <button
                onClick={toggleTheme}
                className={`p-1 rounded-md text-sm font-medium flex items-center transition duration-150 ease-in-out ${toggleTextColor} ${hoverBgColor} ${toggleHoverTextColor}`}
                aria-label={t(theme === 'light' ? 'toggle.themeLight' : 'toggle.themeDark')}
                >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>
            </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
                <button
                onClick={toggleMobileMenu}
                type="button"
                className={`inline-flex items-center justify-center p-2 rounded-md transition duration-150 ease-in-out ${toggleTextColor} ${hoverBgColor} ${toggleHoverTextColor} focus:outline-none focus:ring-2 focus:ring-inset ${theme === 'light' ? 'focus:ring-gray-300' : 'focus:ring-white'}`}
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                aria-label={t(isMobileMenuOpen ? 'toggle.menuClose' : 'toggle.menuOpen')}
                >
                <span className="sr-only">{t(isMobileMenuOpen ? 'toggle.menuClose' : 'toggle.menuOpen')}</span>
                {isMobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                </button>
            </div>
        </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 z-40" id="mobile-menu">
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 rounded-b-md shadow-lg ${mobileMenuBg}`}>
            {navLinks.map((link) => (
                <Link
                key={link.nameKey}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center transition duration-150 ease-in-out ${mobileTextColor} ${mobileHoverBgColor} ${hoverTextColor}`}
                >
                {link.icon && <link.icon className="h-5 w-5 mr-2" />}
                {t(link.nameKey)}
                </Link>
            ))}
                <div className={`border-t ${mobileBorderColor} my-2`}></div>
                <div className="flex justify-around items-center px-3 pt-2">
                <button
                onClick={() => { handleLanguageToggle(); setIsMobileMenuOpen(false); }}
                className={`p-2 rounded-md text-sm font-medium flex items-center transition duration-150 ease-in-out ${toggleTextColor} ${mobileHoverBgColor} ${toggleHoverTextColor}`}
                aria-label={t('toggle.language')}
                >
                <Languages className="h-5 w-5 mr-1" />
                {t('lang.current')}
                </button>
                <button
                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                className={`p-2 rounded-md text-sm font-medium flex items-center transition duration-150 ease-in-out ${toggleTextColor} ${mobileHoverBgColor} ${toggleHoverTextColor}`}
                aria-label={t(theme === 'light' ? 'toggle.themeLight' : 'toggle.themeDark')}
                >
                {theme === 'light' ? <Moon className="h-5 w-5 mr-1" /> : <Sun className="h-5 w-5 mr-1" />}
                    {t(theme === 'light' ? 'theme.dark' : 'theme.light')}
                </button>
            </div>
            </div>
        </div>
        )}
    </header>
    );
}

export default Header;
    