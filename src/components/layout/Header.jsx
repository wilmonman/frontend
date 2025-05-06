import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BookOpen, RadioTower, Eye, Image as ImageIcon, Satellite, Github, Sun, Moon, Globe, Menu, X, ExternalLink } from 'lucide-react'; // Satellite is already imported

// --- Logo Component (Modified) ---
const Logo = () => {
  const { t } = useTranslation('app');

  return (
    <Link to="/" className="flex items-center space-x-2 flex-shrink-0" aria-label={t('logoAriaLabel', 'Navigate to Home')}>
      {/* Use the Satellite icon from lucide-react */}
      <Satellite
        size={32} // You can adjust the size as needed
        className="text-blue-600 dark:text-blue-500 transition-colors duration-300" // Re-using existing color and transition classes
      />
      <span className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
        {t('appName', 'SatUIS')}
      </span>
    </Link>
  );
};


// --- Header Component ---
const Header = () => {
  const { t, i18n } = useTranslation('app');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const navLinks = [
    { key: 'nav.home', path: '/', icon: Home, exact: true },
    { key: 'nav.resources', path: '/resources', icon: BookOpen },
    { key: 'nav.groundStation', path: '/ground-station', icon: RadioTower },
    { key: 'nav.observations', path: '/observations', icon: Eye },
    { key: 'nav.images', path: '/images', icon: ImageIcon },
    { key: 'nav.satellites', path: '/satellites', icon: Satellite },
  ];

  // Theme Initialization
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    const initialIsDark = storedTheme === 'dark' || (!storedTheme && prefersDark);

    setIsDarkMode(initialIsDark);

    if (initialIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Theme Toggle Function
  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark'); // Use setItem
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light'); // Use setItem
    }
  };

  // Language Toggle Function
  const toggleLanguage = () => {
    const currentLang = i18n.language || 'en';
    const newLang = currentLang.startsWith('es') ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  // Close Mobile Menu on Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // Tailwind's 'md' breakpoint
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // OS Theme Preference Listener
  useEffect(() => {
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e) => {
      if (!localStorage.getItem('theme')) { // Check if 'theme' key exists
        const newIsDarkMode = e.matches;
        setIsDarkMode(newIsDarkMode);
        if (newIsDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    matcher.addEventListener('change', listener);
    return () => matcher.removeEventListener('change', listener);
  }, []);


  // NavLink Class Function
  const getNavLinkClasses = ({ isActive }, isMobile = false) => {
    const baseClasses = `flex items-center space-x-${isMobile ? '2' : '1.5'} transition duration-200 ease-in-out focus:outline-none`;
    const desktopPadding = 'px-3 py-2 rounded-md text-sm font-medium';
    const mobilePadding = 'px-3 py-2.5 rounded-md text-base font-medium';
    const focusVisibleClasses = 'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900';
    const mobileFocusClasses = 'focus-visible:bg-slate-100 dark:focus-visible:bg-slate-800';

    const activeClasses = 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200';
    const inactiveClasses = 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-100';

    return `
      ${baseClasses}
      ${isMobile ? mobilePadding : desktopPadding}
      ${isActive ? activeClasses : inactiveClasses}
      ${isMobile ? mobileFocusClasses : focusVisibleClasses}
    `;
  };

  return (
    <header className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 transition-colors duration-300 animate-[slide-down_0.5s_ease-out_forwards]">
      {/* --- Main Header Bar --- */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Logo /> {/* Logo component now uses the Satellite icon */}

          {/* --- Desktop Navigation (Using NavLink) --- */}
          <nav className="hidden md:flex space-x-1 items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.key}
                to={link.path}
                className={({ isActive }) => getNavLinkClasses({ isActive }, false)}
                end={link.exact}
              >
                <link.icon size={16} />
                <span>{t(link.key, link.key.split('.').pop())}</span>
              </NavLink>
            ))}
          </nav>

          {/* --- Mobile Menu Button --- */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition duration-150 ease-in-out"
              aria-label={t('mobileMenuButton.toggleLabel', 'Toggle menu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Secondary Bar --- */}
      <div className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="container mx-auto px-4 py-1.5 flex justify-end items-center space-x-4">
          {/* Language Switch */}
          <button
            onClick={toggleLanguage}
            className="flex items-center text-sm px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition duration-150 ease-in-out"
            aria-label={t('languageSwitcher.label', `Switch language to ${i18n.language?.startsWith('es') ? 'English' : 'Español'}`)}
          >
            <Globe size={16} className="mr-1.5" />
            {i18n.language?.startsWith('es') ? 'EN' : 'ES'}
          </button>

          {/* Theme Switch */}
          <button
            onClick={toggleTheme} // This is the button in question
            className="flex items-center text-sm px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition duration-150 ease-in-out"
            aria-label={t(isDarkMode ? 'themeSwitcher.labelLight' : 'themeSwitcher.labelDark', `Switch to ${isDarkMode ? 'light' : 'dark'} mode`)}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* --- Mobile Navigation Menu --- */}
      <div
        id="mobile-menu"
        className={`
          md:hidden absolute top-full left-0 right-0 z-40 shadow-lg bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'transform translate-y-0 opacity-100 pointer-events-auto' : 'transform -translate-y-full opacity-0 pointer-events-none'}
        `}
        aria-hidden={!isMobileMenuOpen}
       >
        <div className="container mx-auto px-4">
            <nav className="flex flex-col py-2 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.key}
                  to={link.path}
                  className={({ isActive }) => getNavLinkClasses({ isActive }, true)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  end={link.exact}
                >
                  <link.icon size={18} />
                  <span>{t(link.key, link.key.split('.').pop())}</span>
                </NavLink>
              ))}
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
