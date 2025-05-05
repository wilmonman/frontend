import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, BookOpen, RadioTower, Eye, Image as ImageIcon, Satellite, Github, Sun, Moon, Globe, Menu, X, ExternalLink } from 'lucide-react'; // Added back missing icons if needed later

// --- Logo Component ---
const Logo = () => {
  const { t } = useTranslation('app');

  return (
    <Link to="/" className="flex items-center space-x-2 flex-shrink-0" aria-label={t('logoAriaLabel', 'Navigate to Home')}> {/* Added default value */}
      {/* Simple SVG Satellite Icon - Restored from first snippet */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600 dark:text-blue-500 transition-colors duration-300" // Added transition
      >
        <path d="M5.6 19.4 8 17H4.2A7.8 7.8 0 0 1 9 2.8" />
        <path d="m16 7 2.4 2.4" />
        <path d="M10.4 6.6 7 10h3.8a7.8 7.8 0 0 1 4.7 14.7" />
        <path d="M18.2 10.2A7.8 7.8 0 0 1 15 21.2" />
        <path d="M17 8h4" />
        <path d="m21 12-1.4 1.4" />
        <path d="m18 17-1.4 1.4" />
      </svg>
      <span className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">
        {t('appName', 'SatUIS')} {/* Added default value */}
      </span>
    </Link>
  );
};


// --- Header Component ---
const Header = () => {
  const { t, i18n } = useTranslation('app'); // Get translation function and i18n instance
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Initial state determined by useEffect

  // --- Navigation Links Configuration (Using translation keys and paths) ---
  const navLinks = [
    { key: 'nav.home', path: '/', icon: Home, exact: true }, // Add exact for home route matching
    { key: 'nav.resources', path: '/resources', icon: BookOpen },
    { key: 'nav.groundStation', path: '/ground-station', icon: RadioTower },
    { key: 'nav.observations', path: '/observations', icon: Eye },
    { key: 'nav.images', path: '/images', icon: ImageIcon },
    { key: 'nav.satellites', path: '/satellites', icon: Satellite },
  ];

  // --- Theme Initialization (Restored logic from first snippet) ---
  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    // Determine initial theme based on stored preference or OS setting
    const initialIsDark = storedTheme === 'dark' || (!storedTheme && prefersDark);

    setIsDarkMode(initialIsDark);

    // Apply the theme class to the document root
    if (initialIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); // Run only once on mount

  // --- Theme Toggle Function (Integrated i18n for aria-label) ---
  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark'; // Persist preference
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light'; // Persist preference
    }
  };

  // --- Language Toggle Function (Using i18n instance) ---
  const toggleLanguage = () => {
    const currentLang = i18n.language || 'en'; // Ensure we have a fallback
    const newLang = currentLang.startsWith('es') ? 'en' : 'es'; // Toggle between 'en' and 'es' prefixes
    i18n.changeLanguage(newLang);
  };

  // --- Close Mobile Menu on Resize (Restored from first snippet) ---
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // Tailwind's 'md' breakpoint
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Run only once on mount

  // --- OS Theme Preference Listener (Restored from first snippet) ---
  useEffect(() => {
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (e) => {
      // IMPORTANT: Only update if the user hasn't explicitly chosen a theme via the button
      if (!('theme' in localStorage)) {
        const newIsDarkMode = e.matches;
        setIsDarkMode(newIsDarkMode);
        if (newIsDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };
    // Add listener
    matcher.addEventListener('change', listener);
    // Clean up listener on component unmount
    return () => matcher.removeEventListener('change', listener);
  }, []); // Run only once on mount


  // --- NavLink Class Function (Inline for original style feel) ---
  const getNavLinkClasses = ({ isActive }, isMobile = false) => {
    const baseClasses = `flex items-center space-x-${isMobile ? '2' : '1.5'} transition duration-200 ease-in-out focus:outline-none`;
    const desktopPadding = 'px-3 py-2 rounded-md text-sm font-medium';
    const mobilePadding = 'px-3 py-2.5 rounded-md text-base font-medium'; // Slightly larger touch target for mobile
    const focusVisibleClasses = 'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-slate-900'; // Desktop focus
    const mobileFocusClasses = 'focus-visible:bg-slate-100 dark:focus-visible:bg-slate-800'; // Simpler mobile focus

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
    // Added back original animation class application style
    <header className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-50 transition-colors duration-300 animate-[slide-down_0.5s_ease-out_forwards]">
      {/* --- Main Header Bar --- */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Logo /> {/* Logo component now uses Link and t() */}

          {/* --- Desktop Navigation (Using NavLink) --- */}
          <nav className="hidden md:flex space-x-1 items-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.key}
                to={link.path}
                // Apply classes based on active state, replicating original style
                className={({ isActive }) => getNavLinkClasses({ isActive }, false)}
                end={link.exact} // Use 'end' prop for exact matching if specified
              >
                <link.icon size={16} />
                <span>{t(link.key, link.key.split('.').pop())}</span> {/* Translate name, provide fallback */}
              </NavLink>
            ))}
          </nav>

          {/* --- Mobile Menu Button (Translate aria-label) --- */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition duration-150 ease-in-out"
              aria-label={t('mobileMenuButton.toggleLabel', 'Toggle menu')} // Translate aria-label
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu" // Link button to menu
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Secondary Bar (Translate buttons) --- */}
      <div className="bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300">
        <div className="container mx-auto px-4 py-1.5 flex justify-end items-center space-x-4">
          {/* Language Switch */}
          <button
            onClick={toggleLanguage}
            className="flex items-center text-sm px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition duration-150 ease-in-out"
            // Translate aria-label dynamically
            aria-label={t('languageSwitcher.label', `Switch language to ${i18n.language?.startsWith('es') ? 'English' : 'Español'}`)}
          >
            <Globe size={16} className="mr-1.5" />
            {/* Show the language TO switch to */}
            {i18n.language?.startsWith('es') ? 'EN' : 'ES'}
          </button>

          {/* Theme Switch */}
          <button
            onClick={toggleTheme}
            className="flex items-center text-sm px-2 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition duration-150 ease-in-out"
            // Translate aria-label based on current theme state
            aria-label={t(isDarkMode ? 'themeSwitcher.labelLight' : 'themeSwitcher.labelDark', `Switch to ${isDarkMode ? 'light' : 'dark'} mode`)}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* --- Mobile Navigation Menu (Using NavLink, original transition style) --- */}
      <div
        id="mobile-menu" // ID for aria-controls
        className={`
          md:hidden absolute top-full left-0 right-0 z-40 shadow-lg bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'transform translate-y-0 opacity-100 pointer-events-auto' : 'transform -translate-y-full opacity-0 pointer-events-none'}
        `}
        aria-hidden={!isMobileMenuOpen} // Hide from screen readers when closed
       >
        <div className="container mx-auto px-4">
            <nav className="flex flex-col py-2 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.key}
                  to={link.path}
                  // Apply classes based on active state for mobile
                  className={({ isActive }) => getNavLinkClasses({ isActive }, true)}
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                  end={link.exact} // Use 'end' prop for exact matching
                >
                  <link.icon size={18} />
                  <span>{t(link.key, link.key.split('.').pop())}</span> {/* Translate name, provide fallback */}
                </NavLink>
              ))}
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
