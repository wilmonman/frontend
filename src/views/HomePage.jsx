// src/views/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'; // Importar Link para navegación interna
import {
  Satellite, Radio, ExternalLink, ChevronLeft, ChevronRight,
  Image as ImageIcon, Network, Users, Code2, LayoutDashboard, Telescope,
  Compass, BookOpen, Info, UsersRound, Lightbulb, Cpu, Globe
} from 'lucide-react';

// --- Definiciones de Datos ---
// Carrusel de imágenes con textos en español
const carouselItems = [
  { id: 'orbiting', src: "https://placehold.co/1200x400/64748B/FFFFFF?text=Satélite+Orbitando+la+Tierra", alt: "Satélite Orbitando la Tierra", caption: "Siguiendo Satélites en Tiempo Real" },
  { id: 'radioSignals', src: "https://placehold.co/1200x400/7C3AED/FFFFFF?text=Señales+de+Radio+desde+el+Espacio", alt: "Visualización de Señales de Radio desde el Espacio", caption: "Decodificando Señales del Cosmos" },
  { id: 'groundStationDish', src: "https://placehold.co/1200x400/1D4ED8/FFFFFF?text=Antena+de+Estación+Terrena", alt: "Antena de Estación Terrena Apuntando al Cielo", caption: "Nuestra Ventana al Universo" },
  { id: 'earthObservation', src: "https://placehold.co/1200x400/16A34A/FFFFFF?text=Imagen+de+Observación+Terrestre", alt: "Imagen Satelital de la Tierra", caption: "Observando la Tierra desde Arriba" }
];
// --- Fin Definiciones de Datos ---


function HomePage() {
  // Estado para el carrusel personalizado
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Estado para controlar la visibilidad y animación de las secciones
  const [sectionsVisible, setSectionsVisible] = useState(false);

  // Lógica del carrusel
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

  // Efecto de temporizador para el carrusel y animación de secciones
  useEffect(() => {
    const carouselTimer = setInterval(() => {
      nextImage();
    }, 5000); // Cambiar imagen cada 5 segundos

    // Activar la animación de las secciones después de un breve retraso
    const sectionsTimer = setTimeout(() => {
      setSectionsVisible(true);
    }, 100); // Retraso pequeño para permitir el renderizado inicial

    return () => {
      clearInterval(carouselTimer); // Limpiar temporizador del carrusel
      clearTimeout(sectionsTimer); // Limpiar temporizador de secciones
    };
  }, [nextImage]); // nextImage se incluye si su lógica depende de props o estado

  // Clases base para las secciones animadas
  const animatedSectionClasses = "transition-all duration-700 ease-out transform";

  return (
    <div className="text-slate-800 dark:text-slate-200 font-sans overflow-x-hidden"> {/* Evitar scroll horizontal por transformaciones iniciales */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* --- Título y Texto Introductorio --- */}
        {/* Esta sección podría tener su propia animación si se desea, pero se mantiene estática por ahora */}
        <section className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Estación Terrena Satelital UIS
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            ¡Explora el cosmos desde la UIS! Te damos la bienvenida a la plataforma oficial del proyecto SatNOGS, tu puerta de entrada al fascinante mundo de la comunicación satelital y la ciencia abierta.
          </p>
        </section>

        {/* --- Sección del Carrusel de Imágenes --- */}
        {/* El carrusel se mantiene sin la animación de "aparecer desde abajo" para que sea visible inmediatamente */}
        <section className="mb-12 relative w-full overflow-hidden rounded-lg shadow-2xl" style={{ height: '400px' }}>
          <div className="w-full h-full">
            {carouselItems.map((item, index) => (
              <img
                key={item.id}
                src={item.src}
                alt={item.alt}
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/1200x400/94A3B8/FFFFFF?text=Imagen+No+Disponible"; }}
              />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/70 via-black/50 to-transparent text-white text-center z-20">
            <p className="text-xl font-semibold">{carouselItems[currentImageIndex].caption}</p>
          </div>
          <button onClick={prevImage} aria-label="Imagen anterior" className="absolute top-1/2 left-3 md:left-5 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 transition-all duration-300 z-20"><ChevronLeft size={28} /></button>
          <button onClick={nextImage} aria-label="Siguiente imagen" className="absolute top-1/2 right-3 md:right-5 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-3 rounded-full hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 transition-all duration-300 z-20"><ChevronRight size={28} /></button>
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2.5 z-20">
            {carouselItems.map((_, index) => (
              <button
                key={index}
                aria-label={`Ir a la diapositiva ${index + 1}`}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-125' : 'bg-slate-300 bg-opacity-60 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </section>

        {/* --- Sección de Resumen del Proyecto --- */}
        <section
          className={`mb-12 p-6 md:p-8 rounded-lg ${animatedSectionClasses} ${
            sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: sectionsVisible ? '100ms' : '0ms' }}
        >
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <Telescope size={32} className="mr-3 text-indigo-600 dark:text-indigo-400" />
            Acerca de Nuestro Proyecto
          </h2>
          <div className="grid md:grid-cols-2 gap-8 text-slate-700 dark:text-slate-300 leading-relaxed">
            <div>
              <p className="mb-4">
                Esta iniciativa implementa un modelo funcional de una estación terrena en el campus de la UIS, basada en radio definida por software (SDR) y conectada a la red global SatNOGS. Nuestro objetivo principal es servir como una <strong>herramienta de divulgación científica</strong>, ofreciendo oportunidades de aprendizaje práctico y fomentando el interés en la tecnología espacial y las radiocomunicaciones.
              </p>
              <p>
                Buscamos ser un recurso valioso para la investigación, la enseñanza y la difusión del conocimiento científico, permitiendo a la comunidad universitaria y al público en general interactuar con el fascinante mundo de los satélites.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3">Objetivos Clave:</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                <li>Desarrollar una estación terrena SDR funcional integrada a SatNOGS.</li>
                <li>Difundir información y observaciones de forma lúdica e interactiva a través de esta plataforma web.</li>
                <li>Fomentar la participación en ciencia ciudadana y la exploración académica.</li>
                <li>Servir como herramienta educativa y de investigación en comunicaciones satelitales.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- NUEVA SECCIÓN: Conectando con el Cosmos --- */}
        <section
          className={`mb-12 p-6 md:p-8 rounded-lg ${animatedSectionClasses} ${
            sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: sectionsVisible ? '250ms' : '0ms' }} // Retraso mayor para esta sección
        >
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <Globe size={32} className="mr-3 text-teal-600 dark:text-teal-400" />
            Conectando con el Cosmos: La Aventura Satelital
          </h2>
          <div className="grid md:grid-cols-1 gap-6 text-slate-700 dark:text-slate-300 leading-relaxed">
            <p>
              Los satélites son mucho más que simples puntos de luz en el cielo nocturno. Son nuestros ojos y oídos en el espacio, desempeñando roles cruciales en nuestro día a día. Desde facilitar las <strong className="text-teal-700 dark:text-teal-300">comunicaciones globales</strong> (como internet y televisión), permitir la <strong className="text-teal-700 dark:text-teal-300">navegación precisa</strong> (GPS), hasta monitorear el <strong className="text-teal-700 dark:text-teal-300">clima</strong> y nuestro <strong className="text-teal-700 dark:text-teal-300">medio ambiente</strong>.
            </p>
            <p>
              Algunos satélites nos observan de cerca en órbitas bajas (LEO), capturando imágenes detalladas de la Tierra, mientras que otros se sitúan en órbitas más lejanas (GEO) para cubrir vastas regiones con sus señales. Nuestra estación terrena en la UIS es una ventana a este universo de tecnología, permitiéndonos explorar estas maravillas, entender su funcionamiento y participar activamente en su seguimiento.
            </p>
          </div>
        </section>

        {/* --- Sección ¿Qué Puedes Explorar? --- */}
        <section
          className={`mb-12 p-6 md:p-8 rounded-lg ${animatedSectionClasses} ${
            sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: sectionsVisible ? '400ms' : '0ms' }}
        >
          <h2 className="text-3xl font-bold text-sky-800 dark:text-sky-200 mb-8 text-center flex items-center justify-center">
            <Compass size={32} className="mr-3" />
            ¿Qué Puedes Explorar?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<LayoutDashboard size={24} />}
              title="Panel de Estación"
              description="Observa el estado en vivo y la actividad de nuestra estación terrena."
              linkTo="/ground-station"
            />
            <FeatureCard
              icon={<Satellite size={24} />}
              title="Observaciones"
              description="Navega por los datos recibidos de diversos satélites."
              linkTo="/observations"
            />
            <FeatureCard
              icon={<ImageIcon size={24} />}
              title="Imágenes Satelitales"
              description="Visualiza imágenes de la Tierra capturadas por satélites meteorológicos."
              linkTo="/images"
            />
            <FeatureCard
              icon={<Network size={24} />}
              title="Info de Satélites"
              description="Aprende sobre los diferentes satélites que rastreamos."
              linkTo="/satellites"
            />
          </div>
        </section>

        {/* --- Sección La Tecnología Detrás --- */}
        <section
          className={`mb-12 p-6 md:p-8 rounded-lg ${animatedSectionClasses} ${
            sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: sectionsVisible ? '550ms' : '0ms' }}
        >
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center">
            <Info size={32} className="mr-3 text-green-600 dark:text-green-400" />
            La Tecnología que Usamos
          </h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Los artículos internos también se beneficiarán de la animación de la sección padre */}
            <article className="p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center">
                <Users size={28} className="mr-3 text-green-600 dark:text-green-400" />
                Red SatNOGS
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                Nuestra estación es un miembro orgulloso de la red global <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-green-700 dark:text-green-300 hover:underline font-medium">SatNOGS</a>. SatNOGS (Satellite Networked Open Ground Station) es un proyecto de código abierto impulsado por la comunidad que opera estaciones terrenas en todo el mundo. Este esfuerzo colaborativo permite un seguimiento exhaustivo y la recepción de datos de multitud de satélites, haciendo accesible la observación espacial.
              </p>
              <div className="text-center md:text-left">
                <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition duration-300 shadow">
                  Visita SatNOGS
                  <ExternalLink size={18} className="ml-2" />
                </a>
              </div>
            </article>
            
            <article className="p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center">
                <Code2 size={28} className="mr-3 text-purple-600 dark:text-purple-400" />
                GNU Radio
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                GNU Radio es un potente kit de herramientas de desarrollo de software, libre y de código abierto. Proporciona los bloques de procesamiento de señales necesarios para implementar radios definidas por software (SDR). Esta tecnología es crucial para nuestra estación terrena, permitiéndonos procesar y decodificar de forma flexible las complejas señales de radio recibidas de los satélites.
              </p>
              <div className="text-center md:text-left">
                <a href="https://www.gnuradio.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition duration-300 shadow">
                  Explora GNU Radio
                  <ExternalLink size={18} className="ml-2" />
                </a>
              </div>
            </article>

            <article className="p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-cyan-800 dark:text-cyan-300 mb-3 flex items-center">
                <Cpu size={28} className="mr-3 text-cyan-600 dark:text-cyan-400" />
                Radio Definida por Software (SDR)
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                La Radio Definida por Software es una tecnología de radiocomunicación donde los componentes tradicionalmente implementados en hardware (mezcladores, filtros, amplificadores, etc.) se realizan mediante software en un computador. Esto ofrece una enorme flexibilidad, permitiendo a nuestra estación adaptarse a diferentes tipos de señales y satélites con solo cambiar el software.
              </p>
            </article>
          </div>
        </section>

        {/* --- Sección Aprende Más e Involúcrate --- */}
        <section
          className={`mb-12 p-6 md:p-8 rounded-lg ${animatedSectionClasses} ${
            sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: sectionsVisible ? '700ms' : '0ms' }}
        >
          <h2 className="text-3xl font-bold text-indigo-800 dark:text-indigo-200 mb-8 text-center flex items-center justify-center">
            <Lightbulb size={32} className="mr-3" />
            Aprende Más e Involúcrate
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
            <InfoCard
              icon={<BookOpen size={36} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />}
              title="Nuestra Documentación"
              description="Profundiza en cómo funciona nuestra plataforma y los datos que presentamos."
              linkTo="/docs"
              linkText="Leer Documentación"
            />
            <InfoCard
              icon={<UsersRound size={36} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />}
              title="Sobre Nosotros"
              description="Conoce más sobre el equipo de la Estación Terrena UIS y nuestra misión."
              linkTo="/about"
              linkText="Conoce al Equipo"
            />
            <InfoCard
              icon={<Radio size={36} className="text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />}
              title="Recursos Educativos"
              description="Encuentra enlaces y materiales útiles para expandir tu conocimiento."
              linkTo="/resources"
              linkText="Explorar Recursos"
            />
          </div>
        </section>

      </div> {/* Fin max-w-7xl */}
    </div>
  );
}

// Componente Auxiliar para Tarjetas de Características
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

// Componente Auxiliar para Tarjetas de Información
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
