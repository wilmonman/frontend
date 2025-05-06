// src/views/ResourcesPage.jsx
import React, { useState, useEffect } from 'react';
// Importar iconos
import {
  BookOpen, ExternalLink, Rocket, Wifi, Globe, Antenna, BrainCircuit, Database,
  MapPin, Gamepad2, Satellite, Radio, Star, Users, Code2, HardDrive, CalendarDays,
  BarChart3, Lightbulb, Zap, PackageOpen, Tv, Link2 // Link2 para el botón de enlace
} from 'lucide-react';

// Icono CloudSun (si no está en lucide-react por defecto, se puede crear un SVG simple o usar otro)
// Definido aquí para que esté disponible antes de su uso en curiousFactsData
const CloudSun = ({ size = 24, className = "" }) => (
  // Usando CalendarDays como placeholder, puedes reemplazarlo con un SVG de CloudSun si lo tienes
  // o si encuentras un icono adecuado en lucide-react (ej. Cloud, Sun) y los combinas.
  // Por simplicidad, mantendremos CalendarDays por ahora.
  <CalendarDays size={size} className={className} />
);

// --- Definiciones de Datos (Adaptadas y Ampliadas) ---

// Enlaces Destacados Temáticos (Conjunto Ampliado en Español)
const featuredLinksData = [
  {
    id: 'nasa',
    url: "https://www.nasa.gov/",
    icon: <Rocket size={32} className="text-red-600 dark:text-red-500" />,
    thumbnail: "https://placehold.co/80x80/FEF2F2/DC2626?text=NASA",
    title: "NASA Oficial",
    description: "Explora las misiones, investigaciones y descubrimientos de la agencia espacial de EE. UU.",
    bgColor: "bg-red-50 dark:bg-red-900/30", borderColor: "border-red-200 dark:border-red-700/50", hoverColor: "hover:border-red-400 dark:hover:border-red-500"
  },
  {
    id: 'esa',
    url: "https://www.esa.int/",
    icon: <Rocket size={32} className="text-blue-600 dark:text-blue-500" />,
    thumbnail: "https://placehold.co/80x80/EFF6FF/2563EB?text=ESA",
    title: "Agencia Espacial Europea (ESA)",
    description: "Descubre los proyectos y avances de la ESA en la exploración espacial y observación terrestre.",
    bgColor: "bg-blue-50 dark:bg-blue-900/30", borderColor: "border-blue-200 dark:border-blue-700/50", hoverColor: "hover:border-blue-400 dark:hover:border-blue-500"
  },
  {
    id: 'satnogsNetwork',
    url: "https://network.satnogs.org/",
    icon: <Users size={32} className="text-green-600 dark:text-green-500" />,
    thumbnail: "https://placehold.co/80x80/ECFDF5/059669?text=SatNOGS",
    title: "Red SatNOGS",
    description: "La red global de estaciones terrenas satelitales de código abierto. ¡Nuestra estación es parte de ella!",
    bgColor: "bg-green-50 dark:bg-green-900/30", borderColor: "border-green-200 dark:border-green-700/50", hoverColor: "hover:border-green-400 dark:hover:border-green-500"
  },
  {
    id: 'heavensAbove',
    url: "https://www.heavens-above.com/",
    icon: <Star size={32} className="text-yellow-500 dark:text-yellow-400" />,
    thumbnail: "https://placehold.co/80x80/FFFBEB/F59E0B?text=H-A",
    title: "Heavens-Above",
    description: "Predicciones precisas de pasos de satélites (incluida la ISS) visibles desde tu ubicación.",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/30", borderColor: "border-yellow-200 dark:border-yellow-700/50", hoverColor: "hover:border-yellow-400 dark:hover:border-yellow-500"
  },
  {
    id: 'stuffinspace',
    url: "http://stuffin.space/",
    icon: <Globe size={32} className="text-cyan-600 dark:text-cyan-500" />,
    thumbnail: "https://placehold.co/80x80/ECFEFF/0891B2?text=SiS",
    title: "Stuff in Space",
    description: "Visualización 3D en tiempo real de objetos orbitando la Tierra. ¡Impresionante!",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/30", borderColor: "border-cyan-200 dark:border-cyan-700/50", hoverColor: "hover:border-cyan-400 dark:hover:border-cyan-500"
  },
  {
    id: 'satnogsDb',
    url: "https://db.satnogs.org/",
    icon: <Database size={32} className="text-sky-600 dark:text-sky-500" />,
    thumbnail: "https://placehold.co/80x80/E0F2FE/0284C7?text=SatDB",
    title: "SatNOGS DB",
    description: "Base de datos colaborativa de satélites, transmisores y sus telemetrías.",
    bgColor: "bg-sky-50 dark:bg-sky-900/30", borderColor: "border-sky-200 dark:border-sky-700/50", hoverColor: "hover:border-sky-400 dark:hover:border-sky-500"
  },
  {
    id: 'n2yo',
    url: "https://www.n2yo.com/",
    icon: <MapPin size={32} className="text-purple-600 dark:text-purple-500" />,
    thumbnail: "https://placehold.co/80x80/F3E8FF/7E22CE?text=N2YO",
    title: "N2YO.com",
    description: "Seguimiento de satélites en tiempo real, predicciones de pasos y mucha más información orbital.",
    bgColor: "bg-purple-50 dark:bg-purple-900/30", borderColor: "border-purple-200 dark:border-purple-700/50", hoverColor: "hover:border-purple-400 dark:hover:border-purple-500"
  },
  {
    id: 'celestrak',
    url: "https://celestrak.org/",
    icon: <BarChart3 size={32} className="text-orange-600 dark:text-orange-500" />,
    thumbnail: "https://placehold.co/80x80/FFF7ED/EA580C?text=CelesTrak",
    title: "CelesTrak",
    description: "Fuente autorizada de datos orbitales (TLEs) y herramientas analíticas sobre objetos espaciales.",
    bgColor: "bg-orange-50 dark:bg-orange-900/30", borderColor: "border-orange-200 dark:border-orange-700/50", hoverColor: "hover:border-orange-400 dark:hover:border-orange-500"
  },
];

// Enlaces de Interés por Nivel (en Español)
const linksOfInterestData = [
  // Principiante
  { id: 'queEsUnSatelite', title: '¿Qué es un Satélite?', description: 'Una explicación sencilla de la NASA sobre los satélites y sus usos.', url: "https://spaceplace.nasa.gov/what-is-a-satellite/sp/", levelId: 'principiante', icon: <Lightbulb size={20} className="inline-block mr-2 text-yellow-500" /> },
  { id: 'scan', title: 'Comunicaciones y Navegación Espacial (SCaN)', description: 'Programa de la NASA para la infraestructura de comunicación espacial.', url: "https://www.nasa.gov/directorates/heo/scan/index.html", levelId: 'principiante', icon: <Rocket size={20} className="inline-block mr-2 text-indigo-500" /> },
  { id: 'arrl', title: 'ARRL', description: 'Asociación nacional de Radioaficionados en EE. UU. (recursos en inglés).', url: "http://www.arrl.org/", levelId: 'principiante', icon: <Radio size={20} className="inline-block mr-2 text-teal-500" /> },
  { id: 'amsat', title: 'AMSAT', description: 'Corporación de Satélites de Radioaficionados, coordina proyectos satelitales amateur.', url: "https://www.amsat.org/", levelId: 'principiante', icon: <Satellite size={20} className="inline-block mr-2 text-purple-500" /> },
  // Intermedio
  { id: 'tiposDeOrbitas', title: 'Tipos de Órbitas Satelitales', description: 'Aprende sobre las órbitas LEO, MEO, GEO y más (ESA Kids).', url: "https://www.esa.int/kids/es/Aprende/El_Universo/Satelites/Tipos_de_orbitas", levelId: 'intermedio', icon: <Globe size={20} className="inline-block mr-2 text-blue-500" /> },
  { id: 'comoFuncionanSats', title: '¿Cómo Funcionan los Satélites?', description: 'Una explicación de la tecnología satelital (HowStuffWorks, en inglés).', url: "https://science.howstuffworks.com/satellite.htm", levelId: 'intermedio', icon: <Satellite size={20} className="inline-block mr-2 text-sky-500" /> },
  { id: 'espectroRadio', title: 'Asignación del Espectro Radioeléctrico', description: 'Información sobre la asignación de frecuencias de radio (ANE Colombia).', url: "https://www.ane.gov.co/Paginas/Servicios/Cuadro-Nacional-de-Atribucion-de-Bandas-de-Frecuencias-(CNABF).aspx", levelId: 'intermedio', icon: <Wifi size={20} className="inline-block mr-2 text-amber-500" /> },
  { id: 'libreSpace', title: 'Libre Space Foundation', description: 'Fundación de código abierto que diseña tecnologías espaciales.', url: "https://libre.space/", levelId: 'intermedio', icon: <Users size={20} className="inline-block mr-2 text-lime-500" /> },
  // Avanzado
  { id: 'dsn', title: 'Red del Espacio Profundo (DSN)', description: 'Red internacional de antenas de la NASA para misiones interplanetarias.', url: "https://www.jpl.nasa.gov/missions/dsn/", levelId: 'avanzado', icon: <Rocket size={20} className="inline-block mr-2 text-indigo-700" /> },
  { id: 'sdrIntro', title: 'Introducción a SDR con RTL-SDR', description: 'Información sobre Radio Definida por Software de bajo costo (sitio en inglés).', url: "https://www.rtl-sdr.com/about-rtl-sdr/", levelId: 'avanzado', icon: <HardDrive size={20} className="inline-block mr-2 text-rose-500" /> },
  { id: 'gnuRadio', title: 'GNU Radio', description: 'Kit de herramientas de desarrollo de software libre para procesamiento de señales.', url: "https://www.gnuradio.org/", levelId: 'avanzado', icon: <Code2 size={20} className="inline-block mr-2 text-fuchsia-500" /> },
  { id: 'dsp', title: 'DSPRelated', description: 'Comunidad y recursos para Procesamiento Digital de Señales (en inglés).', url: "https://www.dsprelated.com/", levelId: 'avanzado', icon: <BrainCircuit size={20} className="inline-block mr-2 text-pink-500" /> }
];

// Estilos para los niveles (en Español)
const levelStyles = {
  principiante: { label: 'Principiante', style: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' },
  intermedio: { label: 'Intermedio', style: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' },
  avanzado: { label: 'Avanzado', style: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' }
};

// Datos para la sección de curiosidades con enlaces
const curiousFactsData = [
  {
    id: 'gpsDiario',
    icon: <MapPin size={28} className="text-blue-500" />,
    title: 'GPS: Tu Guía Espacial',
    text: '¿Sabías que el GPS de tu teléfono se conecta con al menos 4 satélites para saber dónde estás? ¡Hay una constelación de unos 30 satélites GPS orbitando la Tierra!',
    link: 'https://www.gps.gov/systems/gps/spanish/',
    linkText: 'Aprende más sobre GPS'
  },
  {
    id: 'velocidadISS',
    icon: <Rocket size={28} className="text-orange-500" />,
    title: '¡A Toda Velocidad!',
    text: 'La Estación Espacial Internacional (ISS) viaja a unos 28,000 km/h. ¡Eso es como ir de Bogotá a Medellín en menos de un minuto! Da una vuelta completa a la Tierra cada 90 minutos.',
    link: 'https://www.nasa.gov/mission_pages/station/main/onthestation/facts_and_figures.html',
    linkText: 'Datos de la ISS (NASA)'
  },
  {
    id: 'basuraEspacial',
    icon: <PackageOpen size={28} className="text-gray-500" />,
    title: 'Basura en el Espacio',
    text: 'Existen millones de pedazos de "basura espacial" orbitando la Tierra, desde satélites viejos hasta pequeñas piezas de cohetes. ¡Limpiar el espacio es un gran desafío!',
    link: 'https://www.esa.int/Space_Safety/Space_Debris/Space_debris_by_the_numbers',
    linkText: 'Basura espacial (ESA)'
  },
  {
    id: 'satelitesMeteorologicos',
    icon: <CloudSun size={28} className="text-sky-500" />,
    title: 'Vigilantes del Clima',
    text: 'Los satélites meteorológicos nos ayudan a predecir el tiempo, monitorear huracanes y estudiar el cambio climático, ¡todo desde cientos de kilómetros de altura!',
    link: 'https://www.noaa.gov/education/resource-collections/satellite-NOAA-educations', // NOAA es una buena fuente
    linkText: 'Satélites y clima (NOAA)'
  },
  {
    id: 'televisionSatelital',
    icon: <Tv size={28} className="text-purple-500" />,
    title: 'TV desde el Cielo',
    text: 'Muchos canales de televisión llegan a tu casa gracias a satélites geoestacionarios que parecen "flotar" fijos sobre un punto de la Tierra, a más de 35,000 km de altura.',
    link: 'https://www.sba.gov/business-guide/plan-your-business/market-research-competitive-analysis', // Ejemplo genérico, un enlace más específico sería ideal
    linkText: 'Cómo funciona la TV Satelital'
  },
  {
    id: 'primerSatelite',
    icon: <Zap size={28} className="text-yellow-500" />,
    title: 'El "Bip Bip" que Cambió el Mundo',
    text: 'El primer satélite artificial, Sputnik 1, lanzado en 1957, era una esfera metálica que solo emitía simples "bips" de radio, ¡pero inició la carrera espacial!',
    link: 'https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=1957-001B',
    linkText: 'Sobre el Sputnik 1 (NASA)'
  }
];
// --- Fin Definiciones de Datos ---

function ResourcesPage() {
  const [sectionsVisible, setSectionsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSectionsVisible(true);
    }, 100); // Pequeño retraso para permitir el renderizado inicial
    return () => clearTimeout(timer);
  }, []);

  const animatedSectionClasses = "transition-all duration-700 ease-out transform";

  // Componente para las tarjetas de datos curiosos
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

        {/* Encabezado de la Página */}
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Recursos y Enlaces
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
            Explora sitios web útiles, herramientas y materiales educativos relacionados con la comunicación satelital, la tecnología de radio y las ciencias espaciales.
          </p>
        </section>

        {/* --- Sección de Recursos Destacados --- */}
        <section
          className={`mb-12 md:mb-16 ${animatedSectionClasses} ${
            sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: sectionsVisible ? '100ms' : '0ms' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8 flex items-center">
            <Star size={28} className="mr-3 text-amber-500 dark:text-amber-400" />
            Recursos Destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredLinksData.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center p-6 rounded-xl shadow-lg border ${link.borderColor} ${link.bgColor} ${link.hoverColor} dark:border-opacity-60 transition-all duration-300 group text-center transform hover:-translate-y-1.5 hover:shadow-2xl`}
              >
                <img src={link.thumbnail} alt={link.title} className="w-20 h-20 mb-4 rounded-lg object-cover border-2 border-white dark:border-slate-600 shadow-md" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/80x80/94A3B8/FFFFFF?text=N/A"; }}/>
                <div className="mb-2">{link.icon}</div>
                <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1.5">{link.title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 flex-grow px-2">{link.description}</p>
                <ExternalLink size={18} className="mt-auto text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-300" />
              </a>
            ))}
          </div>
        </section>

        {/* --- Sección de Enlaces Generales --- */}
        <section
          className={`mb-12 md:mb-16 ${animatedSectionClasses} ${ 
            sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: sectionsVisible ? '300ms' : '0ms' }}
        >
           <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8 flex items-center">
            <BookOpen size={28} className="mr-3 text-slate-600 dark:text-slate-400" />
            Enlaces de Aprendizaje por Nivel
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
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${levelStyles[link.levelId].style}`}>
                    {levelStyles[link.levelId].label}
                  </span>
                </div>
              </a>
            ))}
           </div>
        </section>

        {/* --- NUEVA SECCIÓN: Datos Curiosos y El Espacio en tu Vida --- */}
        <section
          className={`${animatedSectionClasses} ${
            sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ transitionDelay: sectionsVisible ? '500ms' : '0ms' }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-200 mb-8 flex items-center">
            <Lightbulb size={28} className="mr-3 text-yellow-400 dark:text-yellow-300" />
            Datos Curiosos y El Espacio en tu Vida
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

      </div> {/* Fin max-w-7xl */}
    </div>
  );
}

export default ResourcesPage;
