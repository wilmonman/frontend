// src/views/components/WebSdrEmbedSection.jsx
import React from 'react';
import { Antenna } from 'lucide-react'; // Import Antenna icon

// Reusable Component for WebSDR Embed Section
const WebSdrEmbedSection = ({ sdrEmbedUrl, t, sectionsVisible, animatedSectionClasses }) => {
  // If no URL is provided, don't render anything.
  // We also check sectionsVisible here to ensure it respects the parent's animation timing,
  // though the animation classes are applied on the section tag itself.
  if (!sdrEmbedUrl) {
    return null; 
  }

  return (
    <section
      className={`mb-12 md:mb-16 ${animatedSectionClasses} ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      // This new section will appear after the main title, so it gets an early animation delay.
      style={{ transitionDelay: sectionsVisible ? '100ms' : '0ms' }} 
    >
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
        <Antenna size={28} className="mr-3 text-sky-500 dark:text-sky-400" />
        {t('sdrInteractiveSection.title', 'Interactive WebSDR (Experimental)')} 
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        {t('sdrInteractiveSection.description', 'Attempting to embed a live WebSDR. Due to security restrictions by the SDR provider, this may not load correctly. For the best experience, visit the SDR site directly.')}
      </p>
      
      <div className="bg-white dark:bg-slate-800 p-2 sm:p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <iframe
          src={sdrEmbedUrl}
          title={t('sdrInteractiveSection.iframeTitle', 'Embedded WebSDR Interface')}
          className="w-full h-[500px] sm:h-[600px] md:h-[700px] border-0 rounded-md"
          // Consider adding sandbox attributes if needed, after testing:
          // sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          // allow="microphone" // If the specific WebSDR requires it
        >
          <p>{t('sdrInteractiveSection.iframeFallback', 'Your browser does not support iframes, or the content is blocked.')}</p>
        </iframe>
      </div>
    </section>
  );
};

export default WebSdrEmbedSection; // Export the component
