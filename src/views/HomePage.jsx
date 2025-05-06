// src/views/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next'; // <--- IMPORTAR useTranslation y Trans
import {
  Satellite, Radio, ExternalLink, ChevronLeft, ChevronRight,
  Image as ImageIcon, Network, Users, Code2, LayoutDashboard, Telescope,
  Compass, BookOpen, Info, UsersRound, Lightbulb, Cpu, Globe
} from 'lucide-react';

// Las fuentes de las imágenes del carrusel pueden permanecer, ya que solo traduciremos 'alt' y 'caption'
const carouselImageDefinitions = [
  { id: 'orbiting', src: "/images/orbit.gif", translationBaseKey: "carousel.item1" },
  { id: 'radioSignals', src: "/images/sat.gif", translationBaseKey: "carousel.item2" },
  { id: 'groundStationDish', src: "/images/planet.gif", translationBaseKey: "carousel.item3" },
  { id: 'earthObservation', src: "/images/antenna.gif", translationBaseKey: "carousel.item4" }
];

function HomePage() {
  const { t } = useTranslation('home'); // <--- Especificar el namespace 'home'

  // Construir los ítems del carrusel con textos traducidos
  const carouselItems = carouselImageDefinitions.map(itemDef => ({
    id: itemDef.id,
    src: itemDef.src,
    alt: t(`${itemDef.translationBaseKey}.alt`),
    caption: t(`${itemDef.translationBaseKey}.caption`)
  }));

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [sectionsVisible, setSectionsVisible] = useState(false);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === carouselItems.length - 1 ? 0 : prevIndex + 1
    );
  }, [carouselItems.length]);

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const carouselTimer = setInterval(nextImage, 5000);
    const sectionsTimer = setTimeout(() => setSectionsVisible(true), 100);
    return () => {
      clearInterval(carouselTimer);
      clearTimeout(sectionsTimer);
    };
  }, [nextImage]);

  const animatedSectionClasses = "transition-all duration-700 ease-out transform";
  const currentCarouselItem = carouselItems[currentImageIndex] || { alt: '', caption: ''}; // Fallback

  return (
    <div className="text-slate-800 dark:text-slate-200 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <section className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            {t('pageTitle')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            {t('introText')}
          </p>
        </section>

        <section className="mb-12 relative w-full overflow-hidden rounded-lg shadow-2xl" style={{ height: '400px' }}>
          <div className="w-full h-full">
            {carouselItems.map((item, index) => (
              <img
                key={item.id}
                src={item.src}
                alt={item.alt}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/1200x400/94A3B8/FFFFFF?text=${t('imageNotAvailable')}`; }}
              />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/70 via-black/50 to-transparent text-white text-center z-20">
            <p className="text-xl font-semibold">{currentCarouselItem.caption}</p>
          </div>
          <button 
            onClick={prevImage} 
            aria-label={t('carousel.prevButtonLabel')} 
            className="absolute top-1/2 left-3 md:left-5 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 transition-all duration-300 z-20">
            <ChevronLeft size={28} />
          </button>
          <button 
            onClick={nextImage} 
            aria-label={t('carousel.nextButtonLabel')}
            className="absolute top-1/2 right-3 md:right-5 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 transition-all duration-300 z-20">
            <ChevronRight size={28} />
          </button>
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2.5 z-20">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                aria-label={t('carousel.slideButtonLabel', { slideNumber: index + 1 })}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-slate-300 bg-opacity-60 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </section>

        {/* --- Sección de Resumen del Proyecto --- */}
        <section
          className={`mb-12 p-6 md:p-8 rounded-lg ${animatedSectionClasses} ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: sectionsVisible ? '100ms' : '0ms' }}
        >
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <Telescope size={32} className="mr-3 text-indigo-600 dark:text-indigo-400" />
            {t('projectSummarySection.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-slate-700 dark:text-slate-300 leading-relaxed">
            <div>
              <p className="mb-4">
                <Trans i18nKey="projectSummarySection.paragraph1" ns="home">
                  Esta iniciativa implementa un modelo funcional de una estación terrena en el campus de la UIS, basada en radio definida por software (SDR) y conectada a la red global SatNOGS. Nuestro objetivo principal es servir como una <strong>herramienta de divulgación científica</strong>, ofreciendo oportunidades de aprendizaje práctico y fomentando el interés en la tecnología espacial y las radiocomunicaciones.
                </Trans>
              </p>
              <p>
                {t('projectSummarySection.paragraph2')}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">{t('projectSummarySection.keyObjectivesTitle')}</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                <li>{t('projectSummarySection.objective1')}</li>
                <li>{t('projectSummarySection.objective2')}</li>
                <li>{t('projectSummarySection.objective3')}</li>
                <li>{t('projectSummarySection.objective4')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- NUEVA SECCIÓN: Conectando con el Cosmos --- */}
        <section
          className={`mb-12 p-6 md:p-8 rounded-lg ${animatedSectionClasses} ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: sectionsVisible ? '250ms' : '0ms' }}
        >
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <Globe size={32} className="mr-3 text-teal-600 dark:text-teal-400" />
            {t('connectingCosmosSection.title')}
          </h2>
          <div className="grid md:grid-cols-1 gap-6 text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              <Trans i18nKey="connectingCosmosSection.paragraph1" ns="home"
                components={{ 1: <strong className="text-teal-700 dark:text-teal-300" />, 3: <strong className="text-teal-700 dark:text-teal-300" />, 5: <strong className="text-teal-700 dark:text-teal-300" />, 7: <strong className="text-teal-700 dark:text-teal-300" /> }}
              >
                Los satélites son mucho más que simples puntos de luz en el cielo nocturno. Son nuestros ojos y oídos en el espacio, desempeñando roles cruciales en nuestro día a día. Desde facilitar las comunicaciones globales (como internet y televisión), permitir la navegación precisa (GPS), hasta monitorear el clima y nuestro medio ambiente.
              </Trans>
            </p>
            <p>
              {t('connectingCosmosSection.paragraph2')}
            </p>
          </div>
        </section>

        {/* --- Sección ¿Qué Puedes Explorar? --- */}
        <section
          className={`mb-12 p-6 md:p-8 rounded-lg ${animatedSectionClasses} ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: sectionsVisible ? '400ms' : '0ms' }}
        >
          <h2 className="text-3xl font-bold text-sky-800 dark:text-sky-200 mb-8 text-center flex items-center justify-center">
            <Compass size={32} className="mr-3" />
            {t('whatToExploreSection.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<LayoutDashboard size={24} />}
              title={t('whatToExploreSection.stationPanelCard.title')}
              description={t('whatToExploreSection.stationPanelCard.description')}
              linkTo="/ground-station"
            />
            <FeatureCard
              icon={<Satellite size={24} />}
              title={t('whatToExploreSection.observationsCard.title')}
              description={t('whatToExploreSection.observationsCard.description')}
              linkTo="/observations"
            />
            <FeatureCard
              icon={<ImageIcon size={24} />}
              title={t('whatToExploreSection.satelliteImagesCard.title')}
              description={t('whatToExploreSection.satelliteImagesCard.description')}
              linkTo="/images"
            />
            <FeatureCard
              icon={<Network size={24} />}
              title={t('whatToExploreSection.satelliteInfoCard.title')}
              description={t('whatToExploreSection.satelliteInfoCard.description')}
              linkTo="/satellites"
            />
          </div>
        </section>

        {/* --- Sección La Tecnología Detrás --- */}
        <section
          className={`mb-12 p-6 md:p-8 rounded-lg ${animatedSectionClasses} ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: sectionsVisible ? '550ms' : '0ms' }}
        >
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <Info size={32} className="mr-3 text-green-600 dark:text-green-400" />
            {t('technologyUsedSection.title')}
          </h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                <Users size={28} className="mr-3 text-green-600 dark:text-green-400" />
                {t('technologyUsedSection.satnogsNetworkArticle.title')}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                 <Trans i18nKey="technologyUsedSection.satnogsNetworkArticle.description" ns="home"
                    components={{ 1: <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-green-700 dark:text-green-300 hover:underline font-medium" /> }}
                 >
                    Nuestra estación es un miembro orgulloso de la red global SatNOGS. SatNOGS (Satellite Networked Open Ground Station) es un proyecto de código abierto impulsado por la comunidad que opera estaciones terrenas en todo el mundo. Este esfuerzo colaborativo permite un seguimiento exhaustivo y la recepción de datos de multitud de satélites, haciendo accesible la observación espacial.
                 </Trans>
              </p>
              <div className="text-center md:text-left">
                <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition duration-300 shadow">
                  {t('technologyUsedSection.satnogsNetworkArticle.buttonText')}
                  <ExternalLink size={18} className="ml-2" />
                </a>
              </div>
            </article>
            
            <article className="p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                <Code2 size={28} className="mr-3 text-purple-600 dark:text-purple-400" />
                {t('technologyUsedSection.gnuRadioArticle.title')}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {t('technologyUsedSection.gnuRadioArticle.description')}
              </p>
              <div className="text-center md:text-left">
                <a href="https://www.gnuradio.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition duration-300 shadow">
                  {t('technologyUsedSection.gnuRadioArticle.buttonText')}
                  <ExternalLink size={18} className="ml-2" />
                </a>
              </div>
            </article>

            <article className="p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-cyan-800 dark:text-cyan-300 mb-3 flex items-center">
                <Cpu size={28} className="mr-3 text-cyan-600 dark:text-cyan-400" />
                {t('technologyUsedSection.sdrArticle.title')}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                {t('technologyUsedSection.sdrArticle.description')}
              </p>
            </article>
          </div>
        </section>

        {/* --- Sección Aprende Más e Involúcrate --- */}
        <section
          className={`mb-12 p-6 md:p-8 rounded-lg ${animatedSectionClasses} ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{ transitionDelay: sectionsVisible ? '700ms' : '0ms' }}
        >
          <h2 className="text-3xl font-bold text-indigo-800 dark:text-indigo-200 mb-8 text-center flex items-center justify-center">
            <Lightbulb size={32} className="mr-3" />
            {t('learnMoreSection.title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            <InfoCard
              icon={<BookOpen size={36} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />}
              title={t('learnMoreSection.documentationCard.title')}
              description={t('learnMoreSection.documentationCard.description')}
              linkTo="/docs"
              linkText={t('learnMoreSection.documentationCard.linkText')}
            />
            <InfoCard
              icon={<UsersRound size={36} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />}
              title={t('learnMoreSection.aboutUsCard.title')}
              description={t('learnMoreSection.aboutUsCard.description')}
              linkTo="/about"
              linkText={t('learnMoreSection.aboutUsCard.linkText')}
            />
            <InfoCard
              icon={<Radio size={36} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />}
              title={t('learnMoreSection.educationalResourcesCard.title')}
              description={t('learnMoreSection.educationalResourcesCard.description')}
              linkTo="/resources"
              linkText={t('learnMoreSection.educationalResourcesCard.linkText')}
            />
          </div>
        </section>

      </div> {/* Fin max-w-7xl */}
    </div>
  );
}

// --- Componentes Auxiliares ---
// No necesitan cambios ya que reciben el texto traducido como props.
const FeatureCard = ({ icon, title, description, linkTo }) => (
  <Link
    to={linkTo}
    className="block p-6 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors duration-300 transform hover:-translate-y-1 group border border-slate-200 dark:border-slate-700 hover:shadow-lg"
  >
    <div className="flex items-center justify-center mb-4 w-14 h-14 rounded-full bg-sky-100 dark:bg-sky-800 group-hover:bg-sky-200 dark:group-hover:bg-sky-700 transition-colors duration-300 mx-auto">
      {React.cloneElement(icon, { className: "text-sky-600 dark:text-sky-400", size: 28 })}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-center text-slate-800 dark:text-slate-100">{title}</h3>
    <p className="text-sm text-center text-slate-600 dark:text-slate-400">{description}</p>
  </Link>
);

const InfoCard = ({ icon, title, description, linkTo, linkText }) => (
  <div className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
    {icon}
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm flex-grow">{description}</p>
    <Link
      to={linkTo}
      className="inline-block mt-auto px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-300"
    >
      {linkText}
    </Link>
  </div>
);

export default HomePage;
