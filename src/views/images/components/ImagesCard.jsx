import React from 'react';
import { useTranslation } from 'react-i18next'; // <--- AÑADIR
import { Satellite, Clock, ExternalLink, AlertTriangle, TowerControl, Hash } from 'lucide-react';

// Mover formatDate dentro del componente o pasar 't'
// Aquí se moverá dentro para usar el hook useTranslation

const ImageCard = ({ observation, onImageClick }) => {
  const { t, i18n } = useTranslation('images'); // <--- USAR NAMESPACE

  const formatDate = (dateString) => { // Definir dentro para acceso a t e i18n
    if (!dateString) return t('common.dataNotAvailable');
    try {
      return new Date(dateString).toLocaleString(i18n.language, { // Usar i18n.language
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return t('common.invalidDate');
    }
  };
  
  const placeholderImageText = encodeURIComponent(t('card.imagePlaceholderText'));
  const PLACEHOLDER_IMAGE = `https://placehold.co/600x400/e2e8f0/94a3b8?text=${placeholderImageText}`;


  if (!observation) {
    return null;
  }

  const imageUrl = (
    observation.demoddata &&
    Array.isArray(observation.demoddata) &&
    observation.demoddata.length > 0 &&
    observation.demoddata[0].payload_demod
  ) ? observation.demoddata[0].payload_demod : PLACEHOLDER_IMAGE;

  const hasActualImage = imageUrl !== PLACEHOLDER_IMAGE;
  const observationUrl = `https://network.satnogs.org/observations/${observation.id}/`;

  const handleImageError = (e) => {
    if (e.target.src !== PLACEHOLDER_IMAGE) {
      console.warn(`Failed to load observation image: ${imageUrl}. Using placeholder.`);
      e.target.src = PLACEHOLDER_IMAGE;
    }
    e.target.onerror = null;
  };

  const satelliteName = observation.tle0 || t('card.unknownSatellite');
  const stationIdentifier = observation.station_name || `${t('page.stationIdLabel')}: ${observation.ground_station}`;
  const imageAltText = t('card.imageAltText', { satelliteName, obsId: observation.id });

  const handleCardImageClick = () => {
    if (hasActualImage && onImageClick) {
      onImageClick(imageUrl, imageAltText); // Pasar altText ya traducido
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-1 flex flex-col">
      <div className="px-3 py-1.5 flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
        <div className="flex items-center overflow-hidden mr-2" title={`${t('card.stationLabel')}: ${stationIdentifier}`}>
          <TowerControl size={12} className="mr-1 flex-shrink-0 text-slate-500 dark:text-slate-400" />
          <span className="truncate">{stationIdentifier}</span>
        </div>
        <div className="flex items-center flex-shrink-0" title={`${t('card.obsIdLabel')}: ${observation.id}`}>
          <Hash size={12} className="mr-0.5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
          <span>{observation.id}</span>
        </div>
      </div>

      <div
        className="aspect-w-16 aspect-h-9 bg-black/80 dark:bg-black cursor-pointer group"
        onClick={handleCardImageClick}
      >
        <img
          src={imageUrl}
          alt={imageAltText}
          className="w-full h-full object-contain group-hover:opacity-90 transition-opacity"
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      <div className="p-3 md:p-4 flex-grow">
        <div className="flex items-center space-x-2 mb-2">
          <Satellite size={16} className="text-slate-500 dark:text-slate-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate" title={satelliteName}>
            {satelliteName}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">({observation.norad_cat_id})</span>
          </span>
        </div>
        <div className="flex items-center text-xs text-slate-600 dark:text-slate-300">
          <Clock size={14} className="mr-1.5 text-slate-500 flex-shrink-0" />
          <span className="font-medium mr-1 text-slate-700 dark:text-slate-200">{t('card.observedLabel')}:</span> {formatDate(observation.start)}
        </div>
        {!hasActualImage && (
          <div className="mt-2 flex items-center text-xs text-amber-600 dark:text-amber-400">
            <AlertTriangle size={14} className="mr-1 flex-shrink-0" />
            {t('card.imageDataMissing')}
          </div>
        )}
      </div>

      <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-700 text-right bg-slate-50 dark:bg-slate-700/50">
        <a
          href={observationUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={t('card.viewObservationTitle')}
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
        >
          {t('card.viewObservationLink')} <ExternalLink size={12} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default ImageCard;
