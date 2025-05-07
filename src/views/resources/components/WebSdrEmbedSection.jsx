// src/views/components/WebSdrEmbedSection.jsx
import React from 'react';
import { Antenna, ExternalLink } from 'lucide-react'; // Import Antenna and ExternalLink icons

// Reusable Component for featuring a WebSDR site
const WebSdrEmbedSection = ({ t, sectionsVisible, animatedSectionClasses }) => {
  // Information for the specific WebSDR site
  const sdrSite = {
    url: "http://websdr.ewi.utwente.nl:8901/",
    // You will need to add/update these translation keys in your i18n files
    titleKey: "sdrInteractiveSection.featuredSite.title", 
    descriptionKey: "sdrInteractiveSection.featuredSite.description",
    linkTextKey: "sdrInteractiveSection.featuredSite.linkText",
    thumbnailSrc: "/thumbnails/websdr_utwente_screenshot.png", // Placeholder path - replace with your actual thumbnail
    thumbnailAltKey: "sdrInteractiveSection.featuredSite.thumbnailAlt"
  };

  // Default texts if translations are not found
  const defaultTexts = {
    title: "Featured WebSDR: University of Twente",
    description: "Explore the radio spectrum with this popular WebSDR receiver, operated by the University of Twente in the Netherlands. Tune into various amateur radio bands, shortwave broadcasts, and more.",
    linkText: "Visit WebSDR @ University of Twente",
    thumbnailAlt: "Screenshot of the WebSDR interface from University of Twente"
  };

  return (
    <section
      className={`mb-12 md:mb-16 ${animatedSectionClasses} ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: sectionsVisible ? '100ms' : '0ms' }} 
    >
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
        <Antenna size={28} className="mr-3 text-sky-500 dark:text-sky-400" />
        {t(sdrSite.titleKey, defaultTexts.title)} 
      </h2>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Thumbnail Image */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <img 
            src={sdrSite.thumbnailSrc} 
            alt={t(sdrSite.thumbnailAltKey, defaultTexts.thumbnailAlt)}
            className="rounded-lg shadow-md border border-slate-300 dark:border-slate-600 w-full h-auto object-contain"
            onError={(e) => {
              // Simple fallback: hide image or show placeholder text if image fails to load
              e.target.onerror = null; // prevent infinite loop
              e.target.style.display = 'none'; 
              // You could insert a placeholder text div here if desired
              const fallbackText = e.target.nextElementSibling;
              if (fallbackText && fallbackText.classList.contains('thumbnail-error-fallback')) {
                fallbackText.style.display = 'block';
              }
            }}
          />
          <div 
            className="thumbnail-error-fallback text-center text-slate-500 dark:text-slate-400 text-xs py-2" 
            style={{display: 'none'}}
          >
            {t('sdrInteractiveSection.thumbnailError', 'Thumbnail not available')}
          </div>
        </div>

        {/* Description and Link */}
        <div className="flex-grow text-center md:text-left">
          <p className="text-base text-slate-700 dark:text-slate-300 mb-4">
            {t(sdrSite.descriptionKey, defaultTexts.description)}
          </p>
          <a
            href={sdrSite.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-300 group"
          >
            {t(sdrSite.linkTextKey, defaultTexts.linkText)}
            <ExternalLink size={20} className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default WebSdrEmbedSection;
