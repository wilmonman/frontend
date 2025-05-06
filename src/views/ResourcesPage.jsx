// src/pages/ResourcesPage.jsx
import React from 'react';
// Assuming react-i18next is set up for potential future translations
import { useTranslation } from 'react-i18next';
// Import icons
import {
  BookOpen, ExternalLink, Rocket, Wifi, Globe, Antenna, BrainCircuit, Database,
  MapPin, Gamepad2, Satellite, Radio, Star, Users, Code2, HardDrive // Added Database, Users, Code2, HardDrive
} from 'lucide-react';

// --- Data Definitions (Adapted from HomePage example) ---
// Theme-adapted featured links (Expanded Set)
const featuredLinksData = [
  {
    id: 'nasa',
    url: "https://www.nasa.gov/",
    icon: <Rocket size={32} className="text-red-600 dark:text-red-500" />,
    thumbnail: "https://placehold.co/80x80/FEF2F2/DC2626?text=NASA",
    title: "NASA", // Added explicit title
    description: "Explore NASA's missions, research, and discoveries.", // Added explicit description
    bgColor: "bg-red-50 dark:bg-red-900/30", borderColor: "border-red-100 dark:border-red-800/50", hoverColor: "hover:border-red-400 dark:hover:border-red-600"
  },
  {
    id: 'satnogsNetwork', // Changed ID to be more specific
    url: "https://network.satnogs.org/",
    icon: <Users size={32} className="text-green-600 dark:text-green-500" />,
    thumbnail: "https://placehold.co/80x80/ECFDF5/059669?text=SatNOGS",
    title: "SatNOGS Network",
    description: "The global network of satellite ground stations.",
    bgColor: "bg-green-50 dark:bg-green-900/30", borderColor: "border-green-100 dark:border-green-800/50", hoverColor: "hover:border-green-400 dark:hover:border-green-600"
  },
   {
    id: 'satnogsDb', // Added SatNOGS DB
    url: "https://db.satnogs.org/",
    icon: <Database size={32} className="text-sky-600 dark:text-sky-500" />,
    thumbnail: "https://placehold.co/80x80/E0F2FE/0891B2?text=SatDB",
    title: "SatNOGS DB",
    description: "A crowd-sourced database for satellites and transmitters.",
    bgColor: "bg-sky-50 dark:bg-sky-900/30", borderColor: "border-sky-100 dark:border-sky-800/50", hoverColor: "hover:border-sky-400 dark:hover:border-sky-600"
  },
  {
    id: 'stuffinspace',
    url: "http://stuffin.space/",
    icon: <Globe size={32} className="text-blue-600 dark:text-blue-500" />,
    thumbnail: "https://placehold.co/80x80/EFF6FF/2563EB?text=3D+Orbit",
    title: "Stuff in Space",
    description: "Real-time 3D visualization of objects orbiting Earth.",
    bgColor: "bg-blue-50 dark:bg-blue-900/30", borderColor: "border-blue-100 dark:border-blue-800/50", hoverColor: "hover:border-blue-400 dark:hover:border-blue-600"
  },
  // Removed spotthestation and dsn game for brevity, can be added back or moved below
];

// Theme-adapted regular links (Expanded Set)
const linksOfInterestData = [
  // Beginner
  { id: 'scan', title: 'Space Communications and Navigation (SCaN)', description: 'NASA\'s program for space communication infrastructure.', url: "https://www.nasa.gov/directorates/heo/scan/index.html", levelId: 'beginner', icon: <Rocket size={20} className="inline-block mr-2 text-indigo-500" /> },
  { id: 'arrl', title: 'ARRL', description: 'The national association for Amateur Radio in the US.', url: "http://www.arrl.org/", levelId: 'beginner', icon: <Radio size={20} className="inline-block mr-2 text-teal-500" /> },
  { id: 'whatisgps', title: 'What is GPS?', description: 'Official U.S. government information about the Global Positioning System (GPS).', url: "https://www.gps.gov/systems/gps/", levelId: 'beginner', icon: <Globe size={20} className="inline-block mr-2 text-blue-500" /> },
  { id: 'amsat', title: 'AMSAT', description: 'Radio Amateur Satellite Corporation, coordinating amateur radio satellite projects.', url: "https://www.amsat.org/", levelId: 'beginner', icon: <Satellite size={20} className="inline-block mr-2 text-purple-500" /> },
  // Intermediate
  { id: 'howsats', title: 'How Satellites Work', description: 'An explanation of satellite technology from HowStuffWorks.', url: "https://science.howstuffworks.com/satellite.htm", levelId: 'intermediate', icon: <Satellite size={20} className="inline-block mr-2 text-sky-500" /> },
  { id: 'spectrum', title: 'Radio Spectrum Allocation', description: 'Information from the FCC about radio frequency allocation.', url: "https://www.fcc.gov/engineering-technology/policy-and-rules-division/general/radio-spectrum-allocation", levelId: 'intermediate', icon: <Wifi size={20} className="inline-block mr-2 text-amber-500" /> },
  { id: 'antennas', title: 'Antenna Theory', description: 'A comprehensive online resource about antenna theory.', url: "https://www.antenna-theory.com/", levelId: 'intermediate', icon: <Antenna size={20} className="inline-block mr-2 text-orange-500" /> },
  { id: 'libreSpace', title: 'Libre Space Foundation', description: 'An open-source foundation designing space technologies.', url: "https://libre.space/", levelId: 'intermediate', icon: <Users size={20} className="inline-block mr-2 text-lime-500" /> },
  // Advanced
  { id: 'dsn', title: 'Deep Space Network (DSN)', description: 'NASA\'s international network of antennas that supports interplanetary spacecraft missions.', url: "https://www.jpl.nasa.gov/missions/dsn/", levelId: 'advanced', icon: <Rocket size={20} className="inline-block mr-2 text-indigo-700" /> },
  { id: 'sdr', title: 'RTL-SDR', description: 'Information about low-cost Software Defined Radio using DVB-T tuners.', url: "https://www.rtl-sdr.com/about-rtl-sdr/", levelId: 'advanced', icon: <HardDrive size={20} className="inline-block mr-2 text-rose-500" /> }, // Changed icon
  { id: 'gnuRadio', title: 'GNU Radio', description: 'Free & open-source software development toolkit for signal processing.', url: "https://www.gnuradio.org/", levelId: 'advanced', icon: <Code2 size={20} className="inline-block mr-2 text-fuchsia-500" /> }, // Changed icon
  { id: 'dsp', title: 'DSPRelated', description: 'Community and resources for Digital Signal Processing.', url: "https://www.dsprelated.com/", levelId: 'advanced', icon: <BrainCircuit size={20} className="inline-block mr-2 text-pink-500" /> }
];

// Theme-adapted level styles
const levelStyles = {
  beginner: { label: 'Beginner', style: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  intermediate: { label: 'Intermediate', style: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
  advanced: { label: 'Advanced', style: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' }
};
// --- End Data Definitions ---


function ResourcesPage() {
  // Using dummy t function if i18n is not fully set up for this page yet
  const { t } = useTranslation('resources') || { t: (key, fallback) => fallback || key };

  return (
    // Main container - Use theme colors
    <div className="text-slate-800 dark:text-slate-200 font-sans">
      {/* Constrain content width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Header Section - Themed */}
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            {t('mainTitle', 'Resources & Links')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
            {t('subTitle', 'Explore useful websites, tools, and educational materials related to satellite communication, radio technology, and space science.')}
          </p>
        </section>

        {/* --- Featured Links Section --- */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
            <Star size={24} className="mr-3 text-amber-500 dark:text-amber-400" />
            {t('featuredTitle', 'Featured Resources')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLinksData.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                // Consistent card styling with theme adaptation
                className={`flex flex-col items-center p-6 rounded-lg shadow-lg border ${link.borderColor} ${link.bgColor} ${link.hoverColor} dark:border-opacity-50 transition-all duration-300 group text-center transform hover:-translate-y-1 hover:shadow-xl`}
              >
                <img src={link.thumbnail} alt={link.title} className="w-16 h-16 mb-3 rounded-md object-cover border border-slate-200 dark:border-slate-700 shadow-sm" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/94A3B8/FFFFFF?text=N/A"; }}/>
                <div className="mb-2">{link.icon}</div>
                {/* Use title/description from data */}
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">{link.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 flex-grow">{link.description}</p>
                <ExternalLink size={16} className="mt-auto text-slate-400 group-hover:text-indigo-500 transition-colors duration-300" />
              </a>
            ))}
          </div>
        </section>

        {/* --- General Links Section --- */}
        <section>
           <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center">
            <BookOpen size={24} className="mr-3 text-slate-600 dark:text-slate-400" />
            {t('generalLinksTitle', 'Learning Links by Level')}
          </h2>
           <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {linksOfInterestData.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                // Consistent card styling
                className="block bg-white dark:bg-slate-800 p-5 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 group transform hover:-translate-y-1"
              >
                <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-300 mb-2 flex items-center">
                  {link.icon}
                  {/* Use title from data directly */}
                  {link.title}
                  <ExternalLink size={16} className="ml-auto text-slate-400 group-hover:text-indigo-500 transition-colors duration-300 flex-shrink-0" />
                </h4>
                {/* Use description from data directly */}
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{link.description}</p>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${levelStyles[link.levelId].style}`}>
                  {/* Use label from levelStyles */}
                  {levelStyles[link.levelId].label}
                </span>
              </a>
            ))}
          </div>
        </section>

      </div> {/* End max-w-7xl */}
    </div>
  );
}

export default ResourcesPage;
