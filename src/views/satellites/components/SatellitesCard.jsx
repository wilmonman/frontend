import React from 'react';
// Import necessary icons - Added Rocket and ExternalLink
import { CalendarDays, Building, CheckCircle, XCircle, HelpCircle, AlertTriangle, Hash, Rocket, ExternalLink } from 'lucide-react';

// --- Configuration ---
const SATNOGS_DB_MEDIA_URL = 'https://db.satnogs.org/media/'; // Base for satellite images
const SATNOGS_DB_SATELLITE_URL = 'https://db.satnogs.org/satellite/'; // Base for linking to satellite page
const PLACEHOLDER_SAT_IMAGE = 'https://placehold.co/150x150/e2e8f0/94a3b8?text=Satellite'; // Default placeholder
// --- End Configuration ---

// Helper function for formatting dates (only date part)
const formatDateOnly = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

// Function to get flag emoji from country code (ISO 3166-1 alpha-2)
function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Helper to get satellite status info
const getSatStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
        case 'alive': return { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', label: 'Alive' };
        case 'dead': return { icon: XCircle, color: 'text-red-600 dark:text-red-400', label: 'Dead' };
        case 'future': return { icon: CalendarDays, color: 'text-blue-600 dark:text-blue-400', label: 'Future' };
        case 're-entered': return { icon: AlertTriangle, color: 'text-orange-600 dark:text-orange-400', label: 'Re-entered' };
        default: return { icon: HelpCircle, color: 'text-slate-500 dark:text-slate-400', label: status || 'Unknown' };
    }
};


// Satellite Card Component
const SatelliteCard = ({ satellite }) => {
  if (!satellite) {
    return null; // Or a skeleton loader if preferred
  }

  const { name, norad_cat_id, image, status, launched, operator, countries, sat_id } = satellite;

  const satelliteImageUrl = image ? `${SATNOGS_DB_MEDIA_URL}${image}` : PLACEHOLDER_SAT_IMAGE;
  const satelliteDbUrl = sat_id ? `${SATNOGS_DB_SATELLITE_URL}${sat_id}/` : null;
  const statusInfo = getSatStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  const handleImageError = (e) => {
      if (e.target.src !== PLACEHOLDER_SAT_IMAGE) {
          console.warn(`Failed to load satellite image: ${satelliteImageUrl}. Using placeholder.`);
          e.target.src = PLACEHOLDER_SAT_IMAGE;
      }
      e.target.onerror = null; // Prevent infinite loop
  };

  const countryFlags = countries
      ? countries.split(',').map(code => getFlagEmoji(code.trim())).join(' ')
      : '';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-1 flex flex-col">
      {/* Image Section */}
      <div className="h-32 sm:h-40 w-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
         <img
            src={satelliteImageUrl}
            alt={name || 'Satellite'}
            className="w-full h-full object-cover" // Cover might look better here
            onError={handleImageError}
            loading="lazy"
         />
      </div>

      {/* Info Section */}
      <div className="p-4 flex-grow space-y-2.5">
        {/* Title and NORAD ID */}
        <div className="flex justify-between items-start">
             <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 mr-2" title={name}>
                 {name || 'Unnamed Satellite'}
             </h3>
             <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center flex-shrink-0" title={`NORAD ID: ${norad_cat_id}`}>
                 <Hash size={12} className="mr-0.5"/> {norad_cat_id}
             </div>
        </div>

        {/* Status and Launch Date */}
        <div className="flex flex-wrap justify-between items-center gap-2 text-xs">
             <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${statusInfo.color} bg-opacity-10 dark:bg-opacity-20 ${statusInfo.color.replace('text-', 'bg-').replace('600', '100').replace('500', '100').replace('700', '100')} dark:${statusInfo.color.replace('text-', 'bg-').replace('400', '900')}`}>
                 <StatusIcon size={12} className="mr-1" />
                 {statusInfo.label}
             </span>
             <div className="flex items-center text-slate-500 dark:text-slate-400" title={`Launched: ${formatDateOnly(launched)}`}>
                 {/* Use the imported Rocket icon */}
                 <Rocket size={12} className="mr-1 text-amber-500" />
                 Launched: {formatDateOnly(launched)}
             </div>
        </div>

        {/* Operator and Countries */}
        <div className="flex flex-wrap justify-between items-center gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center text-slate-500 dark:text-slate-400" title={`Operator: ${operator || 'N/A'}`}>
                <Building size={12} className="mr-1 text-cyan-500" />
                {operator || 'N/A'}
            </div>
            {countryFlags && (
                <div className="text-sm" title={`Countries: ${countries}`}>
                    {countryFlags}
                </div>
            )}
        </div>
      </div>

       {/* Footer Link */}
       {satelliteDbUrl && (
         <div className="px-4 py-1.5 border-t border-slate-100 dark:border-slate-700 text-right bg-slate-50 dark:bg-slate-700/50">
           <a
             href={satelliteDbUrl}
             target="_blank"
             rel="noopener noreferrer"
             title={`View ${name} on SatNOGS DB`}
             className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
           >
             View on DB <ExternalLink size={12} className="ml-1" /> {/* Use the imported ExternalLink icon */}
           </a>
         </div>
       )}
    </div>
  );
};

export default SatelliteCard;
