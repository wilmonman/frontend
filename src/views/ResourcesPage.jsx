// src/views/ResourcesPage.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen, ExternalLink, Rocket, Wifi, Globe, Antenna, BrainCircuit, Database,
  MapPin, Gamepad2, Satellite, Radio, Star, Users, Code2, HardDrive, CalendarDays,
  BarChart3, Lightbulb, Zap, PackageOpen, Tv, Link2, CloudSun as LucideCloudSun
  // Removed ImageIcon as it was for loading state of dynamic thumbnails
} from 'lucide-react';

// --- Base Data Definitions ---
// Added 'localThumbnail' property for static image paths
const baseFeaturedLinksData = [
  { id: 'nasa', url: "https://www.nasa.gov/", iconComponent: Rocket, iconColorClasses: "text-red-600 dark:text-red-500", localThumbnail: "/thumbnails/nasa.png" },
  { id: 'esa', url: "https://www.esa.int/", iconComponent: Rocket, iconColorClasses: "text-blue-600 dark:text-blue-500", localThumbnail: "/thumbnails/esa.png" },
  { id: 'satnogsNetwork', url: "https://network.satnogs.org/", iconComponent: Users, iconColorClasses: "text-green-600 dark:text-green-500", localThumbnail: "/thumbnails/satnogs_network.png" },
  { id: 'heavensAbove', url: "https://www.heavens-above.com/", iconComponent: Star, iconColorClasses: "text-yellow-500 dark:text-yellow-400", localThumbnail: "/thumbnails/heavens_above.png" },
  { id: 'stuffinspace', url: "http://stuffin.space/", iconComponent: Globe, iconColorClasses: "text-cyan-600 dark:text-cyan-500", localThumbnail: "/thumbnails/stuffinspace.png" },
  { id: 'satnogsDb', url: "https://db.satnogs.org/", iconComponent: Database, iconColorClasses: "text-sky-600 dark:text-sky-500", localThumbnail: "/thumbnails/satnogs_db.png" },
  { id: 'n2yo', url: "https://www.n2yo.com/", iconComponent: MapPin, iconColorClasses: "text-purple-600 dark:text-purple-500", localThumbnail: "/thumbnails/n2yo.png" },
  { id: 'celestrak', url: "https://celestrak.org/", iconComponent: BarChart3, iconColorClasses: "text-orange-600 dark:text-orange-500", localThumbnail: "/thumbnails/celestrak.png" },
  // Add more localThumbnail paths as needed, e.g., "/thumbnails/your-image-name.png"
  // Ensure these images exist in your `public/thumbnails/` directory.
];

const baseLinksOfInterestData = [
  { id: 'queEsUnSatelite', url: "https://spaceplace.nasa.gov/what-is-a-satellite/sp/", levelId: 'principiante', iconComponent: Lightbulb, iconColorClasses: "text-yellow-500" },
  { id: 'scan', url: "https://www.nasa.gov/directorates/heo/scan/index.html", levelId: 'principiante', iconComponent: Rocket, iconColorClasses: "text-indigo-500" },
  { id: 'arrl', url: "http://www.arrl.org/", levelId: 'principiante', iconComponent: Radio, iconColorClasses: "text-teal-500" },
  { id: 'amsat', url: "https://www.amsat.org/", levelId: 'principiante', iconComponent: Satellite, iconColorClasses: "text-purple-500" },
  { id: 'tiposDeOrbitas', url: "https://www.esa.int/kids/es/Aprende/El_Universo/Satelites/Tipos_de_orbitas", levelId: 'intermedio', iconComponent: Globe, iconColorClasses: "text-blue-500" },
  { id: 'comoFuncionanSats', url: "https://science.howstuffworks.com/satellite.htm", levelId: 'intermedio', iconComponent: Satellite, iconColorClasses: "text-sky-500" },
  { id: 'espectroRadio', url: "https://www.ane.gov.co/Paginas/Servicios/Cuadro-Nacional-de-Atribucion-de-Bandas-de-Frecuencias-(CNABF).aspx", levelId: 'intermedio', iconComponent: Wifi, iconColorClasses: "text-amber-500" },
  { id: 'libreSpace', url: "https://libre.space/", levelId: 'intermedio', iconComponent: Users, iconColorClasses: "text-lime-500" },
  { id: 'dsn', url: "https://www.jpl.nasa.gov/missions/dsn/", levelId: 'avanzado', iconComponent: Rocket, iconColorClasses: "text-indigo-700" },
  { id: 'sdrIntro', url: "https://www.rtl-sdr.com/about-rtl-sdr/", levelId: 'avanzado', iconComponent: HardDrive, iconColorClasses: "text-rose-500" },
  { id: 'gnuRadio', url: "https://www.gnuradio.org/", levelId: 'avanzado', iconComponent: Code2, iconColorClasses: "text-fuchsia-500" },
  { id: 'dsp', url: "https://www.dsprelated.com/", levelId: 'avanzado', iconComponent: BrainCircuit, iconColorClasses: "text-pink-500" }
];

const baseLevelStyles = {
  principiante: { style: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  intermedio: { style: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
  avanzado: { style: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' }
};

const baseCuriousFactsData = [
  { id: 'gpsDiario', iconComponent: MapPin, iconColorClasses: "text-blue-500", link: 'https://www.gps.gov/systems/gps/spanish/' },
  { id: 'velocidadISS', iconComponent: Rocket, iconColorClasses: "text-orange-500", link: 'https://www.nasa.gov/mission_pages/station/main/onthestation/facts_and_figures.html' },
  { id: 'basuraEspacial', iconComponent: PackageOpen, iconColorClasses: "text-gray-500", link: 'https://www.esa.int/Space_Safety/Space_Debris/Space_debris_by_the_numbers' },
  { id: 'satelitesMeteorologicos', iconComponent: LucideCloudSun, iconColorClasses: "text-sky-500", link: 'https://www.noaa.gov/education/resource-collections/satellite-NOAA-educations' },
  { id: 'televisionSatelital', iconComponent: Tv, iconColorClasses: "text-purple-500", link: 'https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis' },
  { id: 'primerSatelite', iconComponent: Zap, iconColorClasses: "text-yellow-500", link: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1957-001B' }
];


function ResourcesPage() {
  const { t } = useTranslation('resources');
  const [sectionsVisible, setSectionsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSectionsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Construct data with translations and local thumbnail paths
  const featuredLinksData = baseFeaturedLinksData.map(link => {
    const Icon = link.iconComponent;
    // Derive card styling from iconColorClasses (same as your previous logic)
    const cardBgColor = link.iconColorClasses.replace('text-', 'bg-').replace('-600', '-50').replace('-500', '-50');
    const cardDarkBgColor = link.iconColorClasses.replace('text-', 'dark:bg-').replace('-600', '-900/30').replace('-500', '-900/30');
    const cardBorderColor = link.iconColorClasses.replace('text-', 'border-').replace('-600', '-200').replace('-500', '-200');
    const cardDarkBorderColor = link.iconColorClasses.replace('text-', 'dark:border-').replace('-600', '-700/50').replace('-500', '-700/50');
    const cardHoverBorderColor = link.iconColorClasses.replace('text-', 'hover:border-').replace('-600', '-400').replace('-500', '-400');
    const cardDarkHoverBorderColor = link.iconColorClasses.replace('text-', 'dark:hover:border-').replace('-600', '-500').replace('-500', '-500');
    const cardClasses = `${cardBgColor} ${cardDarkBgColor} ${cardBorderColor} ${cardDarkBorderColor} ${cardHoverBorderColor} ${cardDarkHoverBorderColor}`;

    return {
      ...link,
      icon: <Icon size={32} className={link.iconColorClasses} />,
      title: t(`featuredLinks.${link.id}.title`),
      description: t(`featuredLinks.${link.id}.description`),
      thumbnail: link.localThumbnail, // Use the direct path from base data
      cardClasses: cardClasses,
    };
  });

  const linksOfInterestData = baseLinksOfInterestData.map(link => {
    const Icon = link.iconComponent;
    return {
      ...link,
      icon: <Icon size={20} className={`inline-block mr-2 ${link.iconColorClasses}`} />,
      title: t(`linksOfInterest.${link.id}.title`),
      description: t(`linksOfInterest.${link.id}.description`),
    };
  });

  const levelStyles = {
    principiante: { ...baseLevelStyles.principiante, label: t('levels.principiante') },
    intermedio: { ...baseLevelStyles.intermedio, label: t('levels.intermedio') },
    avanzado: { ...baseLevelStyles.avanzado, label: t('levels.avanzado') }
  };
  
  const curiousFactsData = baseCuriousFactsData.map(fact => {
    const Icon = fact.iconComponent;
    return {
      ...fact,
      icon: <Icon size={28} className={fact.iconColorClasses} />,
      title: t(`curiousFacts.${fact.id}.title`),
      text: t(`curiousFacts.${fact.id}.text`),
      linkText: t(`curiousFacts.${fact.id}.linkText`),
    };
  });

  const animatedSectionClasses = "transition-all duration-700 ease-out transform";

  const CuriousFactCard = ({ icon, title, text, link, linkText }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center h-full hover:shadow-xl transition-shadow duration-300">
      <div className="mb-4 p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-2">{title}</h4>
      <p className="text-sm text-slate-600 dark:text-slate-400 flex-grow mb-4">{text}</p>
      {link && linkText && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors duration-300"
        >
          {linkText}
          <Link2 size={16} className="ml-2" />
        </a>
      )}
    </div>
  );

  return (
    <div className="text-slate-800 dark:text-slate-200 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            {t('pageTitle')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
            {t('pageSubtitle')}
          </p>
        </section>

        {/* Featured Links Section - Simplified to use local thumbnails */}
        <section
          className={`mb-12 md:mb-16 ${animatedSectionClasses} ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: sectionsVisible ? '100ms' : '0ms' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8 flex items-center">
            <Star size={28} className="mr-3 text-amber-500 dark:text-amber-400" />
            {t('featuredSectionTitle')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLinksData.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center p-6 rounded-xl shadow-lg border ${link.cardClasses} dark:border-opacity-60 transition-all duration-300 group text-center transform hover:-translate-y-1.5 hover:shadow-2xl`}
              >
                <div className="w-full h-32 mb-4 rounded-md bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-600 shadow-sm">
                  {link.thumbnail ? (
                    <img
                      src={link.thumbnail} // Path from public folder, e.g., /thumbnails/nasa.png
                      alt={t('altText.thumbnailFor', { siteTitle: link.title })}
                      className="w-full h-full object-cover" // object-cover to fill, object-contain to fit
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop if fallback also fails
                        e.target.style.display = 'none'; // Hide broken image
                        // Optionally, show a placeholder text or generic icon if image fails
                        const fallbackPlaceholder = e.target.parentElement?.querySelector('.thumbnail-fallback-text');
                        if(fallbackPlaceholder) fallbackPlaceholder.style.display = 'flex';
                      }}
                    />
                  ) : (
                    // Fallback if no thumbnail is specified, or could be a generic icon
                    <div className="text-slate-500 text-xs p-2">{t('featuredLinks.noPreview', 'No preview')}</div>
                  )}
                   <div 
                        className="thumbnail-fallback-text w-full h-full items-center justify-center text-slate-500 text-xs"
                        style={{display: 'none'}} // Initially hidden, shown on error
                    >
                        {t('featuredLinks.previewErrorText', 'Preview N/A')}
                    </div>
                </div>

                <div className="mb-2">{link.icon}</div> {/* This is the Lucide icon for the category */}
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1.5">{link.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 flex-grow px-2">{link.description}</p>
                <ExternalLink size={18} className="mt-auto text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300" />
              </a>
            ))}
          </div>
        </section>

        {/* Learning Links Section (remains unchanged) */}
        <section
          className={`mb-12 md:mb-16 ${animatedSectionClasses} ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: sectionsVisible ? '300ms' : '0ms' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8 flex items-center">
            <BookOpen size={28} className="mr-3 text-slate-600 dark:text-slate-400" />
            {t('learningLinksSectionTitle')}
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {linksOfInterestData.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 group transform hover:-translate-y-1.5 h-full flex flex-col"
              >
                <h4 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-2 flex items-start">
                  <span className="mr-2 pt-0.5">{link.icon}</span>
                  <span className="flex-grow">{link.title}</span>
                  <ExternalLink size={18} className="ml-2 text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300 flex-shrink-0" />
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-grow">{link.description}</p>
                <div className="mt-auto pt-2">
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${levelStyles[link.levelId]?.style || ''}`}>
                    {levelStyles[link.levelId]?.label || link.levelId}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Curious Facts Section (remains unchanged) */}
        <section
          className={`${animatedSectionClasses} ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: sectionsVisible ? '500ms' : '0ms' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8 flex items-center">
            <Lightbulb size={28} className="mr-3 text-yellow-400 dark:text-yellow-300" />
            {t('curiousFactsSectionTitle')}
          </h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curiousFactsData.map((fact) => (
              <CuriousFactCard
                key={fact.id}
                icon={fact.icon}
                title={fact.title}
                text={fact.text}
                link={fact.link}
                linkText={fact.linkText}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default ResourcesPage;
