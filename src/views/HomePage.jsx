// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// Import icons
import {
  Satellite, Radio, BookOpen, ExternalLink, Rocket, Wifi, Globe, Antenna, BrainCircuit,
  ChevronLeft, ChevronRight, MapPin, Image as ImageIcon, Network, Gamepad2, Users, Code2,
  LayoutDashboard
} from 'lucide-react';

// Define data structures with IDs and non-translatable info
const carouselItems = [
  { id: 'orbiting', src: "https://placehold.co/1200x400/003366/FFFFFF?text=Satellite+Orbiting+Earth" },
  { id: 'radioTower', src: "https://placehold.co/1200x400/660066/FFFFFF?text=Radio+Tower+Broadcasting" },
  { id: 'deepSpace', src: "https://placehold.co/1200x400/990000/FFFFFF?text=Deep+Space+Antenna" },
  { id: 'gps', src: "https://placehold.co/1200x400/006633/FFFFFF?text=Person+Using+GPS" }
];

const featuredLinksData = [
  {
    id: 'nasa',
    url: "https://www.nasa.gov/",
    icon: <Rocket size={32} className="text-red-600" />,
    thumbnail: "https://placehold.co/80x80/FEE2E2/DC2626?text=NASA",
    bgColor: "bg-red-50", borderColor: "border-red-200", hoverColor: "hover:border-red-400"
  },
  {
    id: 'stuffinspace',
    url: "http://stuffin.space/",
    icon: <Globe size={32} className="text-blue-600" />,
    thumbnail: "https://placehold.co/80x80/DBEAFE/2563EB?text=3D+Orbit",
    bgColor: "bg-blue-50", borderColor: "border-blue-200", hoverColor: "hover:border-blue-400"
  },
  {
    id: 'spotthestation',
    url: "https://spotthestation.nasa.gov/",
    icon: <MapPin size={32} className="text-green-600" />,
    thumbnail: "https://placehold.co/80x80/D1FAE5/059669?text=ISS",
    bgColor: "bg-green-50", borderColor: "border-green-200", hoverColor: "hover:border-green-400"
  },
  {
    id: 'dsngame',
    url: "https://spaceplace.nasa.gov/dsn-game/sp/",
    icon: <Gamepad2 size={32} className="text-purple-600" />,
    thumbnail: "https://placehold.co/80x80/F3E8FF/9333EA?text=Game",
    bgColor: "bg-purple-50", borderColor: "border-purple-200", hoverColor: "hover:border-purple-400"
  }
];

const linksOfInterestData = [
  { id: 'scan', url: "https://www.nasa.gov/directorates/heo/scan/index.html", levelId: 'beginner', icon: <Rocket size={20} className="inline-block mr-2 text-indigo-500" /> },
  { id: 'arrl', url: "http://www.arrl.org/", levelId: 'beginner', icon: <Radio size={20} className="inline-block mr-2 text-teal-500" /> },
  { id: 'whatisgps', url: "https://www.gps.gov/systems/gps/", levelId: 'beginner', icon: <Globe size={20} className="inline-block mr-2 text-blue-500" /> },
  { id: 'howsats', url: "https://science.howstuffworks.com/satellite.htm", levelId: 'intermediate', icon: <Satellite size={20} className="inline-block mr-2 text-sky-500" /> },
  { id: 'spectrum', url: "https://www.fcc.gov/engineering-technology/policy-and-rules-division/general/radio-spectrum-allocation", levelId: 'intermediate', icon: <Wifi size={20} className="inline-block mr-2 text-amber-500" /> },
  { id: 'antennas', url: "https://www.antenna-theory.com/", levelId: 'intermediate', icon: <Antenna size={20} className="inline-block mr-2 text-orange-500" /> },
  { id: 'dsn', url: "https://www.jpl.nasa.gov/missions/dsn/", levelId: 'advanced', icon: <Rocket size={20} className="inline-block mr-2 text-indigo-700" /> },
  { id: 'sdr', url: "https://www.rtl-sdr.com/about-rtl-sdr/", levelId: 'advanced', icon: <BookOpen size={20} className="inline-block mr-2 text-purple-500" /> },
  { id: 'dsp', url: "https://www.dsprelated.com/", levelId: 'advanced', icon: <BrainCircuit size={20} className="inline-block mr-2 text-pink-500" /> }
];

// Mapping level IDs to translation keys and styles
const levelStyles = {
  beginner: { key: 'levels.beginner', style: 'bg-green-100 text-green-800' },
  intermediate: { key: 'levels.intermediate', style: 'bg-yellow-100 text-yellow-800' },
  advanced: { key: 'levels.advanced', style: 'bg-red-100 text-red-800' }
};

function HomePage() {
  const { t } = useTranslation('home');

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Keep dependency array empty if nextImage doesn't depend on external state changing frequently

  return (
    <div className="text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* --- Title and Intro Text --- */}
        <section className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            {t('mainTitle')}
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            {t('introText')}
          </p>
        </section>

        {/* --- Image Carousel Section --- */}
        <section className="mb-12 relative w-full overflow-hidden rounded-lg shadow-lg" style={{ height: '400px' }}>
          <div className="w-full h-full">
            {carouselItems.map((item, index) => (
              <img
                key={item.id}
                src={item.src}
                alt={t(`carousel.${item.id}.alt`)}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x400/CCCCCC/FFFFFF?text=Image+Not+Available"; }}
              />
            ))}
          </div>
          {/* Caption */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-black bg-opacity-50 text-white text-center z-20">
            <p className="text-lg font-semibold">{t(`carousel.${carouselItems[currentImageIndex].id}.caption`)}</p>
          </div>
          {/* Prev/Next Buttons */}
          <button onClick={prevImage} aria-label={t('carousel.prevLabel')} className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors z-20"><ChevronLeft size={24} /></button>
          <button onClick={nextImage} aria-label={t('carousel.nextLabel')} className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors z-20"><ChevronRight size={24} /></button>
          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
             {carouselItems.map((item, index) => ( <button key={item.id} aria-label={t('carousel.goToLabel', { index: index + 1 })} onClick={() => setCurrentImageIndex(index)} className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-gray-400 bg-opacity-50'} hover:bg-white transition-colors`} /> ))}
          </div>
        </section>

        {/* --- Hero Section --- */}
        <section className="mb-12">
          <div className="text-center py-10 px-6 rounded-xl bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 shadow-md border border-indigo-200">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {t('hero.title')}
            </h2>
            <h3 className="text-xl md:text-2xl text-indigo-700 mb-6">
              {t('hero.subtitle')}
            </h3>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
              {t('hero.text')}
            </p>
          </div>
        </section>

        {/* --- Introduction Sections --- */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <article className="p-6 rounded-lg bg-white shadow border border-gray-100">
            <h3 className="text-2xl font-semibold text-sky-700 mb-3 flex items-center">
              <Satellite size={24} className="mr-3 text-sky-500" />
              {t('sections.satcom.title')}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t('sections.satcom.text')}
            </p>
          </article>
          <article className="p-6 rounded-lg bg-white shadow border border-gray-100">
            <h3 className="text-2xl font-semibold text-teal-700 mb-3 flex items-center">
              <Radio size={24} className="mr-3 text-teal-500" />
              {t('sections.radio.title')}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {t('sections.radio.text')}
            </p>
          </article>
        </section>

        {/* --- Satellite Imagery Section --- */}
        <section className="mb-12 p-6 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-100 shadow border border-cyan-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-cyan-800 mb-6 flex items-center justify-center">
            <ImageIcon size={28} className="mr-3 text-cyan-600" />
            {t('sections.imagery.title')}
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6 max-w-4xl mx-auto text-center">
            {t('sections.imagery.text')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="https://www.nesdis.noaa.gov/imagery-data/image-galleries" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 transition duration-300 shadow">
              {t('buttons.noaaGallery')}
              <ExternalLink size={18} className="ml-2" />
            </a>
            {/* Note: This internal link might need react-router-dom's Link component if it becomes an internal route */}
            <a href="/local-satellite-images" className="inline-flex items-center justify-center px-6 py-3 border border-cyan-600 text-base font-medium rounded-md text-cyan-700 bg-white hover:bg-cyan-50 transition duration-300 shadow">
              {t('buttons.localImages')}
              <MapPin size={18} className="ml-2" />
            </a>
          </div>
        </section>

        {/* --- Resources & Links Section --- */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
            <BookOpen size={28} className="mr-3 text-gray-700" />
            {t('sections.resources.title')}
          </h3>

          {/* --- Featured Links Grid --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {featuredLinksData.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center p-6 rounded-lg shadow-lg border ${link.borderColor} ${link.bgColor} ${link.hoverColor} transition-all duration-300 group text-center transform hover:-translate-y-1 hover:shadow-xl`}
              >
                <img src={link.thumbnail} alt={t(`featuredLinks.${link.id}.title`)} className="w-16 h-16 mb-3 rounded-md object-cover border border-gray-200 shadow-sm" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/CCCCCC/FFFFFF?text=N/A"; }}/>
                <div className="mb-2">{link.icon}</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">{t(`featuredLinks.${link.id}.title`)}</h4>
                <p className="text-sm text-gray-600 mb-3 flex-grow">{t(`featuredLinks.${link.id}.description`)}</p>
                <ExternalLink size={16} className="mt-auto text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" />
              </a>
            ))}
          </div>

          {/* --- Ground Station Dashboard Link Section --- */}
          <section className="mb-10 p-6 rounded-lg bg-gray-100 shadow border border-gray-200 text-center">
            <h4 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <LayoutDashboard size={26} className="mr-3 text-gray-600" />
              {t('sections.dashboard.title')}
            </h4>
            <p className="text-gray-600 leading-relaxed mb-5 max-w-2xl mx-auto">
               {t('sections.dashboard.text')}
            </p>
            {/* Note: This internal link should use react-router-dom's Link component */}
            <a href="/ground-station-dashboard" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-md">
               {t('buttons.accessDashboard')}
               <ExternalLink size={18} className="ml-2" /> {/* Consider removing/changing icon if internal */}
            </a>
          </section>

          {/* --- Regular Links Grid --- */}
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {linksOfInterestData.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white p-5 rounded-lg shadow-md border border-gray-100 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 group transform hover:-translate-y-1"
              >
                <h4 className="text-lg font-semibold text-indigo-800 mb-2 flex items-center">
                  {link.icon}
                  {t(`regularLinks.${link.id}.title`)}
                  <ExternalLink size={16} className="ml-auto text-gray-400 group-hover:text-indigo-500 transition-colors duration-300" />
                </h4>
                <p className="text-sm text-gray-600 mb-3">{t(`regularLinks.${link.id}.description`)}</p>
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${levelStyles[link.levelId].style}`}>
                  {t(levelStyles[link.levelId].key)}
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* --- SatNOGS Section --- */}
        <section className="mb-12 p-6 rounded-lg bg-green-50 shadow border border-green-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-green-800 mb-6 flex items-center justify-center">
            <Users size={28} className="mr-3 text-green-600" />
            {t('sections.satnogs.title')}
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6 max-w-4xl mx-auto text-center">
            {t('sections.satnogs.text')}
          </p>
          <div className="text-center">
            <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-300 shadow">
              {t('buttons.visitSatnogs')}
              <ExternalLink size={18} className="ml-2" />
            </a>
          </div>
        </section>

        {/* --- GNU Radio Section --- */}
        <section className="mb-12 p-6 rounded-lg bg-purple-50 shadow border border-purple-100">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-purple-800 mb-6 flex items-center justify-center">
            <Code2 size={28} className="mr-3 text-purple-600" />
            {t('sections.gnuradio.title')}
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6 max-w-4xl mx-auto text-center">
            {t('sections.gnuradio.text')}
          </p>
          <div className="text-center">
            <a href="https://www.gnuradio.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition duration-300 shadow">
              {t('buttons.exploreGnuradio')}
              <ExternalLink size={18} className="ml-2" />
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}

export default HomePage;
