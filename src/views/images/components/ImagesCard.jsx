import React from 'react';
// Import necessary icons
import { Satellite, Clock, CalendarCheck, Image as ImageIcon, ExternalLink, AlertTriangle, TowerControl, Hash } from 'lucide-react'; // Added TowerControl, Hash

// Placeholder image URL if demoddata is missing or fails
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=APT+Image';

// Helper function for formatting dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

// Image Card Component
const ImageCard = ({ observation }) => {
  if (!observation) {
    return null; // Don't render if no observation data
  }

  // Use demoddata[0].payload_demod for the image URL
  const imageUrl = (
        observation.demoddata &&
        Array.isArray(observation.demoddata) &&
        observation.demoddata.length > 0 &&
        observation.demoddata[0].payload_demod // Access the correct field
    ) ? observation.demoddata[0].payload_demod : PLACEHOLDER_IMAGE;

  const hasActualImage = imageUrl !== PLACEHOLDER_IMAGE;
  const observationUrl = `https://network.satnogs.org/observations/${observation.id}/`;

  const handleImageError = (e) => {
      if (e.target.src !== PLACEHOLDER_IMAGE) {
          console.warn(`Failed to load observation image: ${imageUrl}. Using placeholder.`);
          e.target.src = PLACEHOLDER_IMAGE;
      }
      e.target.onerror = null; // Prevent infinite loop
  };

  const satelliteName = observation.tle0 || 'Unknown Satellite';
  const stationIdentifier = observation.station_name || `ID: ${observation.ground_station}`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-1 flex flex-col">

       {/* --- Header: Station & Observation ID --- */}
       <div className="px-3 py-1.5 flex justify-between items-center text-xs border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300">
            <div className="flex items-center overflow-hidden mr-2" title={`Station: ${stationIdentifier}`}>
                <TowerControl size={12} className="mr-1 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                <span className="truncate">{stationIdentifier}</span>
            </div>
            <div className="flex items-center flex-shrink-0" title={`Observation ID: ${observation.id}`}>
                <Hash size={12} className="mr-0.5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
                <span>{observation.id}</span>
            </div>
       </div>
       {/* --- End Header --- */}

      {/* Image Section */}
      <div className="aspect-w-4 aspect-h-3 bg-slate-200 dark:bg-slate-700">
        <img
          src={imageUrl} // Use the correctly derived imageUrl
          alt={`APT image from ${satelliteName} observation ${observation.id}`}
          className="w-full h-full object-contain bg-black" // Use object-contain and black background for APT
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      {/* Info Section */}
      <div className="p-3 md:p-4 flex-grow"> {/* Slightly reduced padding */}
        {/* Satellite Info */}
        <div className="flex items-center space-x-2 mb-2">
          <Satellite size={16} className="text-slate-500 dark:text-slate-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate" title={satelliteName}>
            {satelliteName}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-1">({observation.norad_cat_id})</span>
          </span>
        </div>
        {/* Time Info */}
        <div className="flex items-center text-xs text-slate-600 dark:text-slate-300">
          <Clock size={14} className="mr-1.5 text-slate-500 flex-shrink-0" />
          <span className="font-medium mr-1 text-slate-700 dark:text-slate-200">Observed:</span> {formatDate(observation.start)}
        </div>
         {/* Warning if no actual image URL was provided */}
         {!hasActualImage && (
             <div className="mt-2 flex items-center text-xs text-amber-600 dark:text-amber-400">
                 <AlertTriangle size={14} className="mr-1 flex-shrink-0" />
                 Image data missing in observation.
             </div>
         )}
      </div>

      {/* Footer Link */}
      <div className="px-3 py-1.5 border-t border-slate-100 dark:border-slate-700 text-right bg-slate-50 dark:bg-slate-700/50"> {/* Slightly reduced padding */}
        <a
          href={observationUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View full observation details on SatNOGS Network"
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
        >
          View Observation <ExternalLink size={12} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default ImageCard;
