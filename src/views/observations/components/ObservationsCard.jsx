import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // <--- AÑADIR
import { 
    Satellite, Clock, Radio, CheckSquare, HelpCircle, XSquare, Hourglass, 
    ArrowUpRight, Tag, MapPin, AlertCircle, Compass, UserCircle, 
    ExternalLink, BarChartHorizontal, Rocket, Building, Globe as GlobeIcon, 
    Image as ImageIcon, Link as LinkIcon 
} from 'lucide-react';
import { fetchWithRetry } from "../../../api/ApiClient";

const SATELLITE_API_BASE_URL = "https://uisstation.netlify.app/api/db/satellites";
const SATNOGS_DB_MEDIA_URL = 'https://db.satnogs.org/media/';
const SATNOGS_DB_SATELLITE_URL = 'https://db.satnogs.org/satellite/';

const ObservationCard = ({ observation }) => {
  const { t, i18n } = useTranslation('observations'); // <--- USAR NAMESPACE

  // --- Definición de funciones y objetos que usan t() DENTRO del componente ---
  const formatDate = (dateString, includeTime = true) => {
    if (!dateString) return t('card.dataNotAvailable');
    try {
      const options = {
          month: 'short', day: 'numeric', year: 'numeric',
          ...(includeTime && { hour: '2-digit', minute: '2-digit', hour12: true })
      };
      return new Date(dateString).toLocaleString(i18n.language, options);
    } catch (e) {
      return t('card.invalidDate');
    }
  };

  const getStatusInfo = (status) => {
    const statuses = {
        good: { icon: CheckSquare, color: 'text-green-700 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30', label: t('card.statusLabels.good') },
        bad: { icon: XSquare, color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', label: t('card.statusLabels.bad') },
        failed: { icon: AlertCircle, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30', label: t('card.statusLabels.failed') },
        unknown: { icon: HelpCircle, color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700/30', label: t('card.statusLabels.unknown') },
        future: { icon: Hourglass, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', label: t('card.statusLabels.future') }
    };
    const normalizedStatus = status?.toLowerCase();
    const defaultStatusLabel = status || t('card.dataNotAvailable');
    const defaultStatusInfo = { icon: HelpCircle, color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700/30', label: defaultStatusLabel };
    return statuses[normalizedStatus] || defaultStatusInfo;
  };
  // --- Fin funciones y objetos que usan t() ---

  const [satelliteDetails, setSatelliteDetails] = useState(null);
  const [satelliteLoading, setSatelliteLoading] = useState(false);
  const [satelliteError, setSatelliteError] = useState(null);

  useEffect(() => {
    if (!observation || !observation.norad_cat_id) {
      setSatelliteError(t('card.missingNoradId'));
      return;
    }
    let isMounted = true;
    const fetchSatelliteData = async () => {
      setSatelliteLoading(true);
      setSatelliteError(null);
      setSatelliteDetails(null);
      try {
        const queryParams = { norad_cat_id: observation.norad_cat_id };
        const { data: fetchedData } = await fetchWithRetry(SATELLITE_API_BASE_URL, queryParams);
        if (isMounted) {
            if (Array.isArray(fetchedData) && fetchedData.length > 0) {
                setSatelliteDetails(fetchedData[0]);
            } else {
                console.warn(`No se encontraron detalles del satélite para el ID NORAD: ${observation.norad_cat_id}`);
                setSatelliteError(t('card.satelliteInfoNotFound'));
            }
        }
      } catch (e) {
        console.error(`Fallo al obtener detalles del satélite:`, e);
        if (isMounted) setSatelliteError(t('card.errorLoadingSatelliteInfo'));
      } finally {
        if (isMounted) setSatelliteLoading(false);
      }
    };
    fetchSatelliteData();
    return () => { isMounted = false };
  }, [observation?.id, observation?.norad_cat_id, t]); // <--- AÑADIR t a dependencias

  if (!observation) return null;

  const statusInfo = getStatusInfo(observation.vetted_status);
  const StatusIcon = statusInfo.icon;
  const hasDemodData = observation.demoddata && Array.isArray(observation.demoddata) && observation.demoddata.length > 0;
  const observationUrl = `https://network.satnogs.org/observations/${observation.id}/`;
  const satelliteDbUrl = satelliteDetails?.sat_id ? `${SATNOGS_DB_SATELLITE_URL}${satelliteDetails.sat_id}/` : null;
  
  const satelliteName = satelliteDetails?.name || observation.tle0 || t('card.unknownSatellite');
  const placeholderSatImageText = encodeURIComponent(t('card.satelliteImagePlaceholderText'));
  const PLACEHOLDER_SAT_IMAGE = `https://placehold.co/150x150/e2e8f0/94a3b8?text=${placeholderSatImageText}`;

  const satelliteImageUrl = satelliteDetails?.image
    ? `${SATNOGS_DB_MEDIA_URL}${satelliteDetails.image}`
    : PLACEHOLDER_SAT_IMAGE;
  
  const handleImageError = (e) => {
    if (e.target.src !== PLACEHOLDER_SAT_IMAGE) {
        console.warn(`Fallo al cargar imagen del satélite: ${e.target.src}. Usando placeholder.`);
        e.target.src = PLACEHOLDER_SAT_IMAGE;
    }
    e.target.onerror = null;
  };

  const getFlagEmoji = (countryCode) => { // getFlagEmoji no necesita t()
    if (!countryCode || countryCode.length !== 2) return '';
    const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  const countryFlags = satelliteDetails?.countries
    ? satelliteDetails.countries.split(',').map(code => getFlagEmoji(code.trim())).join(' ')
    : '';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-1 flex flex-col">
      <div className={`px-4 py-2.5 flex justify-between items-center border-b border-slate-200 dark:border-slate-600 ${statusInfo.bgColor} bg-opacity-10 dark:bg-opacity-20 flex-shrink-0`}>
          <div className="flex items-center space-x-2 overflow-hidden mr-2 min-w-0">
              <Satellite size={18} className="text-slate-600 dark:text-slate-300 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate" title={satelliteName}>
                  {satelliteName}
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">({t('card.noradIdLabel')}: {observation.norad_cat_id})</span>
              </span>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor} flex-shrink-0`}>
              <StatusIcon size={14} className="mr-1" />
              {t('card.statusLabel')}: {statusInfo.label}
          </span>
      </div>

      <div className="flex flex-col sm:flex-row p-4 md:p-5 border-b border-slate-100 dark:border-slate-700">
          <div className="w-full sm:w-24 h-24 md:w-28 md:h-28 rounded-md overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-600 flex items-center justify-center mb-3 sm:mb-0 sm:mr-4">
              {satelliteLoading ? (
                  <ImageIcon size={32} className="text-slate-400 dark:text-slate-500 animate-pulse" />
              ) : (
                  <img
                      src={satelliteImageUrl}
                      alt={t('card.satelliteImageAlt', { satelliteName })}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                      loading="lazy"
                  />
              )}
          </div>
          <div className="flex-grow text-xs space-y-1.5">
              {satelliteLoading && <p className="text-slate-400 dark:text-slate-500">{t('card.loadingSatelliteInfo')}</p>}
              {satelliteError && <p className="text-red-500 dark:text-red-400">{satelliteError}</p>}
              {satelliteDetails ? (
                  <>
                      <InfoItemDetail icon={Rocket} label={t('card.launchLabel')} value={formatDate(satelliteDetails.launched, false)} iconColor="text-amber-500" />
                      <InfoItemDetail icon={Building} label={t('card.operatorLabel')} value={satelliteDetails.operator || t('card.dataNotAvailable')} iconColor="text-cyan-500" />
                      {countryFlags && <InfoItemDetail icon={GlobeIcon} label={t('card.countriesLabel')} value={countryFlags} iconColor="text-lime-500" />}
                      {satelliteDetails.status && <InfoItemDetail icon={satelliteDetails.status === 'alive' ? CheckSquare : XSquare} label={t('card.satelliteStatusLabel')} value={satelliteDetails.status === 'alive' ? t('card.statusActive') : t('card.statusInactive')} iconColor={satelliteDetails.status === 'alive' ? 'text-green-500' : 'text-red-500'} />}
                      {satelliteDbUrl && (
                          <div className="pt-1">
                              <a href={satelliteDbUrl} target="_blank" rel="noopener noreferrer" title={t('card.viewInSatnogsDb')} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center text-xs">
                                  <LinkIcon size={12} className="mr-1"/> {t('card.viewInSatnogsDb')}
                              </a>
                          </div>
                      )}
                  </>
              ) : (
                  !satelliteLoading && !satelliteError && <p className="text-slate-400 dark:text-slate-500">{t('card.satelliteDetailsNotAvailable')}</p>
              )}
          </div>
      </div>

      <div className="p-4 md:p-5 space-y-4 text-sm flex-grow">
          <div className="flex items-center text-slate-600 dark:text-slate-300">
              <Clock size={16} className="mr-2 text-slate-500 flex-shrink-0"/>
              <span className="font-medium mr-1.5 text-slate-700 dark:text-slate-200">{t('card.observationTimeLabel')}:</span> {formatDate(observation.start)} - {formatDate(observation.end, false)}
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
              <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('card.passDetailsTitle')}</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                  <InfoItemDetail icon={ArrowUpRight} label={t('card.maxElevationLabel')} value={`${observation.max_altitude?.toFixed(1) ?? t('card.dataNotAvailable')}°`} iconColor="text-teal-500" />
                  <InfoItemDetail icon={Compass} label={t('card.riseAzimuthLabel')} value={`${observation.rise_azimuth?.toFixed(1) ?? t('card.dataNotAvailable')}°`} iconColor="text-orange-500" />
                  <InfoItemDetail icon={UserCircle} label={t('card.observerLabel')} value={observation.observer || t('card.dataNotAvailable')} iconColor="text-indigo-500" />
                  <InfoItemDetail icon={Compass} label={t('card.setAzimuthLabel')} value={`${observation.set_azimuth?.toFixed(1) ?? t('card.dataNotAvailable')}°`} iconColor="text-rose-500" />
              </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
              <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('card.transmitterTitle')}</h5>
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Radio size={16} className="mr-2 text-blue-500 flex-shrink-0"/>
                  <span className="text-slate-800 dark:text-slate-100" title={observation.transmitter_description || ''}>
                      {observation.transmitter_mode || t('card.unknownMode')}
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                          ({observation.observation_frequency ? `${(observation.observation_frequency / 1e6).toFixed(2)} MHz` : t('card.dataNotAvailable')})
                      </span>
                  </span>
              </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
              <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">{t('card.stationTitle')}</h5>
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <MapPin size={16} className="mr-2 text-purple-500 flex-shrink-0"/>
                  <span className="text-slate-800 dark:text-slate-100">{observation.station_name} ({observation.ground_station})</span>
              </div>
          </div>
      </div>

      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-right flex justify-end space-x-3 flex-shrink-0 bg-slate-50 dark:bg-slate-700/50">
          {hasDemodData && (
              <a href={observationUrl} target="_blank" rel="noopener noreferrer" title={t('card.demodDataTitle')} className="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 inline-flex items-center px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors">
                  <BarChartHorizontal size={12} className="mr-1"/> {t('card.demodDataLink')}
              </a>
          )}
          <a href={observationUrl} target="_blank" rel="noopener noreferrer" title={t('card.viewInSatnogsNetworkTitle')} className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors">
              {t('card.viewInSatnogsNetwork')} <ExternalLink size={12} className="ml-1"/>
          </a>
      </div>
    </div>
  );
};

const InfoItemDetail = ({ icon: Icon, label, value, iconColor = "text-slate-500" }) => (
  <div className="flex items-center" title={`${label}: ${value}`}> {/* El title aquí usa el label ya traducido */}
    <Icon size={12} className={`mr-1.5 flex-shrink-0 ${iconColor}`} />
    <span className="text-xs text-slate-600 dark:text-slate-300 truncate">
      <strong className="font-medium text-slate-700 dark:text-slate-200">{label}:</strong> {value}
    </span>
  </div>
);

export default ObservationCard;