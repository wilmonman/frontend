import React from 'react';
import { useTranslation } from 'react-i18next'; // <--- AÑADIR
import { CalendarDays, Building, CheckCircle, XCircle, HelpCircle, AlertTriangle, Hash, Rocket, ExternalLink } from 'lucide-react';

const SATNOGS_DB_MEDIA_URL = 'https://db.satnogs.org/media/';
const SATNOGS_DB_SATELLITE_URL = 'https://db.satnogs.org/satellite/';

const SatelliteCard = ({ satellite }) => {
  const { t, i18n } = useTranslation('satellites'); // <--- USAR NAMESPACE

  const formatDateOnly = (dateString) => {
    if (!dateString) return t('common.dataNotAvailable');
    try {
      return new Date(dateString).toLocaleDateString(i18n.language, { // Usar i18n.language
        month: 'short', day: 'numeric', year: 'numeric',
      });
    } catch (e) {
      return t('common.invalidDate');
    }
  };

  const getFlagEmoji = (countryCode) => { // No necesita t()
    if (!countryCode || countryCode.length !== 2) return '';
    const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  const getSatStatusInfo = (status) => {
    const lowerStatus = status?.toLowerCase();
    switch (lowerStatus) {
      case 'alive': return { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', label: t('card.status.alive') };
      case 'dead': return { icon: XCircle, color: 'text-red-600 dark:text-red-400', label: t('card.status.dead') };
      case 'future': return { icon: CalendarDays, color: 'text-blue-600 dark:text-blue-400', label: t('card.status.future') };
      case 're-entered': return { icon: AlertTriangle, color: 'text-orange-600 dark:text-orange-400', label: t('card.status.reEntered') };
      default: return { icon: HelpCircle, color: 'text-slate-500 dark:text-slate-400', label: status || t('card.status.unknown') };
    }
  };
  
  const placeholderImageText = encodeURIComponent(t('card.imagePlaceholderText'));
  const PLACEHOLDER_SAT_IMAGE = `https://placehold.co/150x150/e2e8f0/94a3b8?text=${placeholderImageText}`;

  if (!satellite) {
    return null;
  }

  const { name, norad_cat_id, image, status, launched, operator, countries, sat_id } = satellite;
  const satelliteNameOrDefault = name || t('card.unnamedSatellite');
  const satelliteImageUrl = image ? `${SATNOGS_DB_MEDIA_URL}${image}` : PLACEHOLDER_SAT_IMAGE;
  const satelliteDbUrl = sat_id ? `${SATNOGS_DB_SATELLITE_URL}${sat_id}/` : null;
  const statusInfo = getSatStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  const handleImageError = (e) => {
    if (e.target.src !== PLACEHOLDER_SAT_IMAGE) {
      console.warn(`Failed to load satellite image: ${satelliteImageUrl}. Using placeholder.`);
      e.target.src = PLACEHOLDER_SAT_IMAGE;
    }
    e.target.onerror = null;
  };

  const countryFlags = countries
    ? countries.split(',').map(code => getFlagEmoji(code.trim())).join(' ')
    : '';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-1 flex flex-col">
      <div className="h-32 sm:h-40 w-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
         <img
            src={satelliteImageUrl}
            alt={t('card.imageAlt', { satelliteName: satelliteNameOrDefault })}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
         />
      </div>

      <div className="p-4 flex-grow space-y-2.5">
        <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mr-2" title={satelliteNameOrDefault}>
                {satelliteNameOrDefault}
            </h3>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center flex-shrink-0" title={t('card.noradIdTitle', {noradId: norad_cat_id })}>
                <Hash size={12} className="mr-0.5"/> {norad_cat_id}
            </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${statusInfo.color} bg-opacity-10 dark:bg-opacity-20 ${statusInfo.color.replace('text-', 'bg-').replace('600', '100').replace('500', '100').replace('700', '100')} dark:${statusInfo.color.replace('text-', 'bg-').replace('400', '900')}`} title={t('card.statusLabel')}>
                <StatusIcon size={12} className="mr-1" />
                {statusInfo.label}
            </span>
            <div className="flex items-center text-slate-500 dark:text-slate-400" title={t('card.launchedTitle', { date: formatDateOnly(launched) })}>
                <Rocket size={12} className="mr-1 text-amber-500" />
                {t('card.launchedLabel')}: {formatDateOnly(launched)}
            </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center text-slate-500 dark:text-slate-400" title={t('card.operatorTitle', { operator: operator || t('common.dataNotAvailable') })}>
                <Building size={12} className="mr-1 text-cyan-500" />
                {operator || t('common.dataNotAvailable')}
            </div>
            {countryFlags && (
                <div className="text-sm" title={t('card.countriesTitle', { countries })}>
                    {countryFlags}
                </div>
            )}
        </div>
      </div>

      {satelliteDbUrl && (
       <div className="px-4 py-1.5 border-t border-slate-100 dark:border-slate-700 text-right bg-slate-50 dark:bg-slate-700/50">
         <a
           href={satelliteDbUrl}
           target="_blank"
           rel="noopener noreferrer"
           title={t('card.viewOnDbTitle', { satelliteName: satelliteNameOrDefault })}
           className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
         >
           {t('card.viewOnDbLink')} <ExternalLink size={12} className="ml-1" />
         </a>
       </div>
      )}
    </div>
  );
};

export default SatelliteCard;
