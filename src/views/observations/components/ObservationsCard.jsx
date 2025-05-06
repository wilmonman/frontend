// src/views/observations/components/ObservationCard.jsx
import React, { useState, useEffect } from 'react';
// Importar iconos necesarios
import { 
    Satellite, Clock, Radio, CheckSquare, HelpCircle, XSquare, Hourglass, 
    ArrowUpRight, Tag, MapPin, AlertCircle, Compass, UserCircle, 
    ExternalLink, BarChartHorizontal, Rocket, Building, Globe as GlobeIcon, 
    Image as ImageIcon, Link as LinkIcon 
} from 'lucide-react';

// Importar la utilidad fetch - **Asegúrate que esta ruta es correcta para tu proyecto**
import { fetchWithRetry } from "../../../api/ApiClient"; // Ajusta la ruta si es diferente

// --- Configuración ---
const SATELLITE_API_BASE_URL = "https://uisstation.netlify.app/api/db/satellites";
const SATNOGS_DB_MEDIA_URL = 'https://db.satnogs.org/media/';
const SATNOGS_DB_SATELLITE_URL = 'https://db.satnogs.org/satellite/';
const PLACEHOLDER_SAT_IMAGE = 'https://placehold.co/150x150/e2e8f0/94a3b8?text=Satélite';
// --- Fin Configuración ---


// Funciones auxiliares
const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return 'N/D'; // No Disponible
  try {
    const options = {
        month: 'short', day: 'numeric', year: 'numeric',
        ...(includeTime && { hour: '2-digit', minute: '2-digit', hour12: true }) // Usar formato de 12 horas
    };
    return new Date(dateString).toLocaleString(navigator.language || 'es-CO', options);
  } catch (e) {
    return 'Fecha Inválida';
  }
};

// Mapeo de estados de observación a español y configuración visual
const getStatusInfo = (status) => {
    const statuses = {
        good: { icon: CheckSquare, color: 'text-green-700 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30', label: 'Buena' },
        bad: { icon: XSquare, color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', label: 'Mala' },
        failed: { icon: AlertCircle, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30', label: 'Fallida' },
        unknown: { icon: HelpCircle, color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700/30', label: 'Desconocida' },
        future: { icon: Hourglass, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', label: 'Futura' }
    };
    // Normalizar el estado de entrada a minúsculas para el mapeo
    const normalizedStatus = status?.toLowerCase();
    const defaultStatus = { icon: HelpCircle, color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700/30', label: status || 'N/D' };
    return statuses[normalizedStatus] || defaultStatus;
};


// Función para obtener el emoji de la bandera del país
function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}


// Componente ObservationCard
const ObservationCard = ({ observation }) => {
  const [satelliteDetails, setSatelliteDetails] = useState(null);
  const [satelliteLoading, setSatelliteLoading] = useState(false);
  const [satelliteError, setSatelliteError] = useState(null);

  // Obtener detalles del satélite
  useEffect(() => {
    if (!observation || !observation.norad_cat_id) {
      setSatelliteError("ID NORAD faltante en los datos de observación.");
      return;
    }
    let isMounted = true;
    const fetchSatelliteData = async () => {
      setSatelliteLoading(true);
      setSatelliteError(null);
      setSatelliteDetails(null); // Limpiar detalles previos
      try {
        const queryParams = { norad_cat_id: observation.norad_cat_id };
        const { data: fetchedData } = await fetchWithRetry(SATELLITE_API_BASE_URL, queryParams);
        if (isMounted) {
            if (Array.isArray(fetchedData) && fetchedData.length > 0) {
                setSatelliteDetails(fetchedData[0]);
            } else {
                console.warn(`No se encontraron detalles del satélite para el ID NORAD: ${observation.norad_cat_id}`);
                setSatelliteError(`Info. del satélite no encontrada.`); // Mensaje más amigable
            }
        }
      } catch (e) {
        console.error(`Fallo al obtener detalles del satélite:`, e);
        if (isMounted) setSatelliteError(`Error al cargar info. del satélite.`);
      } finally {
        if (isMounted) setSatelliteLoading(false);
      }
    };
    fetchSatelliteData();
    return () => { isMounted = false };
  }, [observation?.id, observation?.norad_cat_id]); // Depender de observation.id también para refetch si la observación cambia


  if (!observation) return null;

  const statusInfo = getStatusInfo(observation.vetted_status);
  const StatusIcon = statusInfo.icon;
  const hasDemodData = observation.demoddata && Array.isArray(observation.demoddata) && observation.demoddata.length > 0;
  const observationUrl = `https://network.satnogs.org/observations/${observation.id}/`;
  const satelliteDbUrl = satelliteDetails?.sat_id ? `${SATNOGS_DB_SATELLITE_URL}${satelliteDetails.sat_id}/` : null;

  const satelliteImageUrl = satelliteDetails?.image
    ? `${SATNOGS_DB_MEDIA_URL}${satelliteDetails.image}`
    : PLACEHOLDER_SAT_IMAGE;

  const handleImageError = (e) => {
      if (e.target.src !== PLACEHOLDER_SAT_IMAGE) { // Evitar bucle si el placeholder también falla
          console.warn(`Fallo al cargar imagen del satélite: ${e.target.src}. Usando placeholder.`);
          e.target.src = PLACEHOLDER_SAT_IMAGE;
      }
      e.target.onerror = null; // Prevenir bucles de error si el placeholder también falla
  };

  const countryFlags = satelliteDetails?.countries
      ? satelliteDetails.countries.split(',').map(code => getFlagEmoji(code.trim())).join(' ')
      : '';

  const satelliteName = satelliteDetails?.name || observation.tle0 || 'Satélite Desconocido';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-1 flex flex-col">

      {/* --- Encabezado: Nombre del Satélite y Estado de Observación --- */}
      <div className={`px-4 py-2.5 flex justify-between items-center border-b border-slate-200 dark:border-slate-600 ${statusInfo.bgColor} bg-opacity-10 dark:bg-opacity-20 flex-shrink-0`}>
          <div className="flex items-center space-x-2 overflow-hidden mr-2 min-w-0">
              <Satellite size={18} className="text-slate-600 dark:text-slate-300 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate" title={satelliteName}>
                  {satelliteName}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">({observation.norad_cat_id})</span>
              </span>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor} flex-shrink-0`}>
              <StatusIcon size={14} className="mr-1" />
              Estado: {statusInfo.label}
          </span>
      </div>
      {/* --- Fin Encabezado --- */}

      {/* --- Sección Superior: Imagen Izquierda, Detalles del Satélite Derecha --- */}
      <div className="flex flex-col sm:flex-row p-4 md:p-5 border-b border-slate-100 dark:border-slate-700">
          {/* Imagen */}
          <div className="w-full sm:w-24 h-24 md:w-28 md:h-28 rounded-md overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-600 flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
              {satelliteLoading ? (
                  <ImageIcon size={32} className="text-slate-400 dark:text-slate-500 animate-pulse" />
              ) : (
                  <img
                      src={satelliteImageUrl}
                      alt={satelliteName}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      loading="lazy"
                  />
              )}
          </div>
          {/* Detalles del Satélite */}
          <div className="flex-grow text-xs space-y-1.5">
              {satelliteLoading && <p className="text-slate-400 dark:text-slate-500">Cargando info. del satélite...</p>}
              {satelliteError && <p className="text-red-500 dark:text-red-400">{satelliteError}</p>}
              {satelliteDetails ? (
                  <>
                      <InfoItemDetail icon={Rocket} label="Lanzamiento" value={formatDate(satelliteDetails.launched, false)} iconColor="text-amber-500" />
                      <InfoItemDetail icon={Building} label="Operador" value={satelliteDetails.operator || 'N/D'} iconColor="text-cyan-500" />
                      {countryFlags && <InfoItemDetail icon={GlobeIcon} label="Países" value={countryFlags} iconColor="text-lime-500" />}
                      {satelliteDetails.status && <InfoItemDetail icon={satelliteDetails.status === 'alive' ? CheckSquare : XSquare} label="Estado Sat." value={satelliteDetails.status === 'alive' ? 'Activo' : 'Inactivo'} iconColor={satelliteDetails.status === 'alive' ? 'text-green-500' : 'text-red-500'} />}
                      {satelliteDbUrl && (
                          <div className="pt-1">
                              <a href={satelliteDbUrl} target="_blank" rel="noopener noreferrer" title="Ver satélite en SatNOGS DB" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center text-xs">
                                  <LinkIcon size={12} className="mr-1"/> Ver en DB SatNOGS
                              </a>
                          </div>
                      )}
                  </>
              ) : (
                  !satelliteLoading && !satelliteError && <p className="text-slate-400 dark:text-slate-500">Detalles del satélite no disponibles.</p>
              )}
          </div>
      </div>
      {/* --- Fin Sección Superior --- */}


      {/* --- Sección Inferior: Detalles de la Observación --- */}
      <div className="p-4 md:p-5 space-y-4 text-sm flex-grow">

          {/* Hora de Observación */}
          <div className="flex items-center text-slate-600 dark:text-slate-300">
              <Clock size={16} className="mr-2 text-slate-500 flex-shrink-0"/>
              <span className="font-medium mr-1.5 text-slate-700 dark:text-slate-200">Hora:</span> {formatDate(observation.start)} - {formatDate(observation.end, false)}
          </div>

          {/* Detalles del Paso */}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
              <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Detalles del Paso</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <InfoItemDetail icon={ArrowUpRight} label="Elev. Máx." value={`${observation.max_altitude?.toFixed(1) ?? 'N/D'}°`} iconColor="text-teal-500" />
                  <InfoItemDetail icon={Compass} label="Az. Salida" value={`${observation.rise_azimuth?.toFixed(1) ?? 'N/D'}°`} iconColor="text-orange-500" />
                  <InfoItemDetail icon={UserCircle} label="Observador" value={observation.observer || 'N/D'} iconColor="text-indigo-500" />
                  <InfoItemDetail icon={Compass} label="Az. Puesta" value={`${observation.set_azimuth?.toFixed(1) ?? 'N/D'}°`} iconColor="text-rose-500" />
              </div>
          </div>

          {/* Info del Transmisor */}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
              <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Transmisor</h5>
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Radio size={16} className="mr-2 text-blue-500 flex-shrink-0"/>
                  <span className="text-slate-800 dark:text-slate-100" title={observation.transmitter_description || ''}>
                      {observation.transmitter_mode || 'Modo Desconocido'}
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                          ({observation.observation_frequency ? `${(observation.observation_frequency / 1e6).toFixed(2)} MHz` : 'N/D'})
                      </span>
                  </span>
              </div>
          </div>

          {/* Info de la Estación */}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
              <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Estación</h5>
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <MapPin size={16} className="mr-2 text-purple-500 flex-shrink-0"/>
                  <span className="text-slate-800 dark:text-slate-100">{observation.station_name} ({observation.ground_station})</span>
              </div>
          </div>
      </div>
      {/* --- Fin Sección Inferior --- */}


      {/* Pie de página para enlaces */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-right flex justify-end space-x-3 flex-shrink-0 bg-slate-50 dark:bg-slate-700/50">
          {hasDemodData && (
              <a href={observationUrl} target="_blank" rel="noopener noreferrer" title="Ver detalles de observación y datos demodulados en SatNOGS Network" className="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 inline-flex items-center px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors">
                  <BarChartHorizontal size={12} className="mr-1"/> Datos Demod.
              </a>
          )}
          <a href={observationUrl} target="_blank" rel="noopener noreferrer" title="Ver detalles completos de la observación en SatNOGS Network" className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors">
              Ver en SatNOGS <ExternalLink size={12} className="ml-1"/>
          </a>
      </div>
    </div>
  );
};

// Componente InfoItemDetail actualizado para un tamaño de texto más pequeño por defecto
const InfoItemDetail = ({ icon: Icon, label, value, iconColor = "text-slate-500" }) => (
  <div className="flex items-center" title={`${label}: ${value}`}>
    <Icon size={12} className={`mr-1.5 flex-shrink-0 ${iconColor}`} />
    {/* Tamaño base text-xs */}
    <span className="text-xs text-slate-600 dark:text-slate-300 truncate">
      <strong className="font-medium text-slate-700 dark:text-slate-200">{label}:</strong> {value}
    </span>
  </div>
);


export default ObservationCard;
