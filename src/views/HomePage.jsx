// src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
// Assuming react-i18next is set up
import { useTranslation, Trans } from 'react-i18next'; // Added Trans
// Import icons from lucide-react - Keep necessary ones, remove unused
import {
  Satellite, Radio, BookOpen, ExternalLink, Rocket, Wifi, Globe, Antenna, BrainCircuit,
  ChevronLeft, ChevronRight, MapPin, Image as ImageIcon, Network, Users, Code2,
  LayoutDashboard, Info, Telescope // Added Info, Telescope
} from 'lucide-react';

// --- Data Definitions ---
// Carousel items remain
const carouselItems = [
  { id: 'orbiting', src: "https://placehold.co/1200x400/64748B/FFFFFF?text=Satellite+Orbiting+Earth" }, // slate-500
  { id: 'radioTower', src: "https://placehold.co/1200x400/7C3AED/FFFFFF?text=Radio+Tower+Broadcasting" }, // purple-500
  { id: 'deepSpace', src: "https://placehold.co/1200x400/1D4ED8/FFFFFF?text=Deep+Space+Antenna" }, // blue-700
  { id: 'gps', src: "https://placehold.co/1200x400/16A34A/FFFFFF?text=Ground+Station+Receiving" } // green-600
];
// --- End Data Definitions ---


function Home() {
  const { t } = useTranslation('home');

  // State for custom carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Carousel logic
  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  }, []);

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  // Carousel timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      nextImage();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextImage]);

  return (
    // Use theme colors for base text and background
    <div className="text-slate-800 dark:text-slate-200 font-sans">
      {/* Constrain content width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* --- Title and Intro Text --- */}
        <section className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            {t('mainTitle', 'UIS Satellite Ground Station')} {/* More specific title */}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
            {t('introText', 'Welcome to the official web platform for the SatNOGS ground station project at Universidad Industrial de Santander.')} {/* Updated intro */}
          </p>
        </section>

        {/* --- Image Carousel Section --- */}
        <section className="mb-12 relative w-full overflow-hidden rounded-lg shadow-lg" style={{ height: '400px' }}>
          {/* Image container */}
          <div className="w-full h-full">
            {carouselItems.map((item, index) => (
              <img
                key={item.id}
                src={item.src}
                alt={t(`carousel.${item.id}.alt`, `Carousel image ${index + 1}`)}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x400/94A3B8/FFFFFF?text=Image+Not+Available"; }}
              />
            ))}
          </div>
          {/* Caption */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 via-black/40 to-transparent text-white text-center z-20">
            <p className="text-lg font-semibold">{t(`carousel.${carouselItems[currentImageIndex].id}.caption`, `Slide ${currentImageIndex + 1}`)}</p>
          </div>
          {/* Prev/Next Buttons - Themed */}
          <button onClick={prevImage} aria-label={t('carousel.prevLabel', 'Previous image')} className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-slate-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors z-20"><ChevronLeft size={24} /></button>
          <button onClick={nextImage} aria-label={t('carousel.nextLabel', 'Next image')} className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-slate-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors z-20"><ChevronRight size={24} /></button>
          {/* Dots - Themed */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {carouselItems.map((item, index) => ( <button key={item.id} aria-label={t('carousel.goToLabel', { index: index + 1 })} onClick={() => setCurrentImageIndex(index)} className={`w-2.5 h-2.5 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-slate-400 bg-opacity-60 hover:bg-white/80'}`} /> ))}
          </div>
        </section>

        {/* --- NEW: Project Overview Section --- */}
        <section className="mb-12 p-6 md:p-8 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <Telescope size={28} className="mr-3 text-indigo-600 dark:text-indigo-400" />
            {t('overview.title', 'Project Overview')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                  {t('overview.p1', 'This initiative brings a fully operational satellite ground station to the UIS campus, connecting us to the global SatNOGS network. Our goal is to provide hands-on learning opportunities, enable participation in citizen science, and foster interest in space technology and radio communications.')}
              </p>
              <p>
                  {t('overview.p2', 'Explore this platform to view live data from our station, browse received satellite images and observations, learn about the satellites passing overhead, and discover resources to deepen your understanding of this exciting field.')}
              </p>
          </div>
           {/* Links to key pages */}
           <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                {/* TODO: Replace 'a' with 'Link' from react-router-dom */}
                <a href="/ground-station" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-300">
                   <LayoutDashboard size={16} className="mr-2" /> {t('buttons.dashboard', 'Station Dashboard')}
                </a>
                <a href="/observations" className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition duration-300">
                   <Satellite size={16} className="mr-2" /> {t('buttons.observations', 'View Observations')}
                </a>
                 <a href="/images" className="inline-flex items-center px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition duration-300">
                   <ImageIcon size={16} className="mr-2" /> {t('buttons.images', 'Browse Images')}
                </a>
           </div>
        </section>
        {/* --- End Project Overview Section --- */}


        {/* --- Introduction Sections (Satcom/Radio) --- */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <article className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-semibold text-sky-700 dark:text-sky-400 mb-3 flex items-center">
              <Satellite size={24} className="mr-3 text-sky-500" />
              {t('sections.satcom.title', 'Satellite Communication')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('sections.satcom.text', 'Satellites orbiting Earth act as relay stations, receiving signals from one point and transmitting them to another, enabling global communication, navigation, and observation.')}
            </p>
          </article>
          <article className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700">
            <h3 className="text-2xl font-semibold text-teal-700 dark:text-teal-400 mb-3 flex items-center">
              <Radio size={24} className="mr-3 text-teal-500" />
              {t('sections.radio.title', 'Radio Communication')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('sections.radio.text', 'Radio waves are a form of electromagnetic radiation used to transmit information wirelessly over long distances, forming the backbone of satellite communication and broadcasting.')}
            </p>
          </article>
        </section>

        {/* --- REMOVED Resources & Links Section --- */}
        {/* The Featured Links and General Links sections previously here have been removed */}


        {/* --- SatNOGS Section - Kept --- */}
        <section className="mb-12 p-6 rounded-lg bg-green-50 dark:bg-green-900/30 shadow border border-green-100 dark:border-green-800/50">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-green-800 dark:text-green-300 mb-6 flex items-center justify-center">
            <Users size={28} className="mr-3 text-green-600 dark:text-green-400" />
            {t('sections.satnogs.title', 'SatNOGS Network')}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 max-w-4xl mx-auto text-center">
             <Trans i18nKey="sections.satnogs.text" ns="home"
                 defaults="Our station is part of the global <link>SatNOGS network</link>, a community-driven, open-source project operating ground stations worldwide to track and receive data from satellites."
                 components={{ link: <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-green-700 dark:text-green-300 hover:underline font-medium" /> }}
             />
          </p>
          <div className="text-center">
            <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition duration-300 shadow">
              {t('buttons.visitSatnogs', 'Visit SatNOGS')}
              <ExternalLink size={18} className="ml-2" />
            </a>
          </div>
        </section>

        {/* --- GNU Radio Section - Kept --- */}
        <section className="mb-12 p-6 rounded-lg bg-purple-50 dark:bg-purple-900/30 shadow border border-purple-100 dark:border-purple-800/50">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-purple-800 dark:text-purple-300 mb-6 flex items-center justify-center">
            <Code2 size={28} className="mr-3 text-purple-600 dark:text-purple-400" />
            {t('sections.gnuradio.title', 'GNU Radio')}
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6 max-w-4xl mx-auto text-center">
            {t('sections.gnuradio.text', 'GNU Radio is a free & open-source software development toolkit that provides signal processing blocks to implement software radios, crucial for processing satellite signals.')}
          </p>
          <div className="text-center">
            <a href="https://www.gnuradio.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition duration-300 shadow">
              {t('buttons.exploreGnuradio', 'Explore GNU Radio')}
              <ExternalLink size={18} className="ml-2" />
            </a>
          </div>
        </section>

      </div> {/* End max-w-7xl */}
    </div>
  );
}

export default Home;
