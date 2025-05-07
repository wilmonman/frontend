// src/views/ResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, ExternalLink, Rocket, Wifi, Globe, Antenna, BrainCircuit, Database,
  MapPin, Gamepad2, Satellite, Radio, Star, Users, Code2, HardDrive, CalendarDays,
  BarChart3, Lightbulb, Zap, PackageOpen, Tv, Link2, CloudSun as LucideCloudSun,
  ImageOff as ImageIconOff, RadioTower
} from 'lucide-react';

// ... (rest of your imports and base data definitions remain the same) ...

// --- Card for Links of Interest with Favicon Fetching ---
// ... (InterestLinkCard component remains the same) ...


function ResourcesPage() {
  const { t } = useTranslation('resources');
  const [sectionsVisible, setSectionsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSectionsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // ... (featuredLinksData, linksOfInterestData, levelStyles, curiousFactsData mappings remain the same) ...
  
  // ... (CuriousFactCard component remains the same) ...

  // Data for the new WebSDR card - URL UPDATED HERE
  const featuredWebSDR = {
    url: "http://ham.websdrbordeaux.fr:8000/index2.html", // <-- UPDATED URL
    thumbnail: "/thumbnails/WebSDR.png", 
    title: t('sdrInteractiveSection.featuredSite.title'),
    description: t('sdrInteractiveSection.featuredSite.description'),
    linkText: t('sdrInteractiveSection.featuredSite.linkText'),
    altText: t('sdrInteractiveSection.featuredSite.thumbnailAlt')
  };

  return (
    <div className="text-slate-800 dark:text-slate-200 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Page Title and Subtitle Section */}
        {/* ... (this section remains the same) ... */}

        {/* Featured WebSDR Card Section */}
        {/* ... (this section's structure remains the same, it will pick up new text via 't()') ... */}
        <section
          className={`mb-12 md:mb-16 ${"transition-all duration-700 ease-out transform"} ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: sectionsVisible ? '100ms' : '0ms' }}
        >
          <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row md:items-center">
              {/* Thumbnail */}
              <div className="md:w-1/3 mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                <img
                  src={featuredWebSDR.thumbnail}
                  alt={featuredWebSDR.altText} // Will use new alt text
                  className="w-full h-auto object-cover rounded-lg shadow-md border border-slate-300 dark:border-slate-600"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none'; 
                    const fallback = e.target.nextElementSibling; 
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <div 
                    className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm bg-slate-100 dark:bg-slate-700 rounded-lg py-4"
                    style={{display: 'none'}} 
                >
                    {t('sdrInteractiveSection.thumbnailError', 'Thumbnail not available')}
                </div>
              </div>
              {/* Content */}
              <div className="flex-grow">
                <h3 className="text-2xl md:text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-3 flex items-center">
                  <RadioTower size={28} className="mr-3 text-indigo-500 dark:text-indigo-400" />
                  {featuredWebSDR.title} {/* Will use new title */}
                </h3>
                {/* Use dangerouslySetInnerHTML to render newlines from the description */}
                <p 
                  className="text-slate-600 dark:text-slate-400 mb-6 text-base leading-relaxed whitespace-pre-line"
                  // whitespace-pre-line will respect newlines \n from the JSON
                >
                  {featuredWebSDR.description} {/* Will use new description */}
                </p>
                <a
                  href={featuredWebSDR.url} // Uses the updated URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-300 group"
                >
                  {featuredWebSDR.linkText} {/* Will use new link text */}
                  <ExternalLink size={20} className="ml-2 transform group-hover:translate-x-1 transition-transform duration-200" />
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* ... (Rest of the sections: Featured Links, Learning Links, Curious Facts remain the same) ... */}

      </div>
    </div>
  );
}

export default ResourcesPage;
