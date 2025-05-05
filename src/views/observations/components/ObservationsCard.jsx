import React, { useState, useEffect } from 'react';
// Import necessary icons
import { Satellite, Clock, Radio, CheckSquare, HelpCircle, XSquare, Hourglass, CalendarCheck, CalendarX, ArrowUpRight, Tag, MapPin, Maximize, AlertCircle, Compass, UserCircle, ExternalLink, BarChartHorizontal, Rocket, Building, Globe as GlobeIcon, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

// Import the fetch utility - **Ensure this path is correct for your project structure**
import { fetchWithRetry } from "../../../api/ApiClient"; // Adjust path as needed if it's different

// --- Configuration ---
const SATELLITE_API_BASE_URL = "https://uisstation.netlify.app/api/db/satellites";
const SATNOGS_DB_MEDIA_URL = 'https://db.satnogs.org/media/';
const SATNOGS_DB_SATELLITE_URL = 'https://db.satnogs.org/satellite/';
const PLACEHOLDER_SAT_IMAGE = 'https://placehold.co/150x150/e2e8f0/94a3b8?text=Satellite'; // Back to square placeholder
// --- End Configuration ---


// Helper functions
const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return 'N/A';
  try {
    const options = {
        month: 'short', day: 'numeric', year: 'numeric',
        ...(includeTime && { hour: '2-digit', minute: '2-digit' })
    };
    return new Date(dateString).toLocaleString(undefined, options);
  } catch (e) {
    return 'Invalid Date';
  }
};

const getStatusInfo = (status) => {
    const statuses = {
        good: { icon: CheckSquare, color: 'text-green-700 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30', label: 'Good' },
        bad: { icon: XSquare, color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', label: 'Bad' },
        failed: { icon: AlertCircle, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30', label: 'Failed' },
        unknown: { icon: HelpCircle, color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700/30', label: 'Unknown' },
        future: { icon: Hourglass, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', label: 'Future' }
    };
    const defaultStatus = { icon: HelpCircle, color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700/30', label: status || 'N/A' };
    return statuses[status?.toLowerCase()] || defaultStatus;
};

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return '';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}


// Observation Card Component
const ObservationCard = ({ observation }) => {
  const [satelliteDetails, setSatelliteDetails] = useState(null);
  const [satelliteLoading, setSatelliteLoading] = useState(false);
  const [satelliteError, setSatelliteError] = useState(null);

  // Fetch satellite details
  useEffect(() => {
    if (!observation || !observation.norad_cat_id) {
      setSatelliteError("Missing NORAD ID in observation data.");
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
                console.warn(`No satellite details found for NORAD ID: ${observation.norad_cat_id}`);
            }
        }
      } catch (e) {
        console.error(`Failed to fetch satellite details:`, e);
        if (isMounted) setSatelliteError(`Failed to load satellite info.`);
      } finally {
        if (isMounted) setSatelliteLoading(false);
      }
    };
    fetchSatelliteData();
    return () => { isMounted = false };
  }, [observation?.id, observation?.norad_cat_id]);


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
      if (e.target.src !== PLACEHOLDER_SAT_IMAGE) {
          console.warn(`Failed to load satellite image: ${e.target.src}. Using placeholder.`);
          e.target.src = PLACEHOLDER_SAT_IMAGE;
      }
      e.target.onerror = null;
  };

  const countryFlags = satelliteDetails?.countries
      ? satelliteDetails.countries.split(',').map(code => getFlagEmoji(code.trim())).join(' ')
      : '';

  const satelliteName = satelliteDetails?.name || observation.tle0 || 'Unknown Satellite';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200 ease-in-out hover:-translate-y-1 flex flex-col">

      {/* --- Header: Satellite Name & Observation Status --- */}
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
            {statusInfo.label} Status
        </span>
      </div>
      {/* --- End Header --- */}

      {/* --- Top Section: Image Left, Satellite Details Right --- */}
      <div className="flex flex-col sm:flex-row p-4 md:p-5 border-b border-slate-100 dark:border-slate-700">
          {/* Image */}
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
          {/* Satellite Details */}
          <div className="flex-grow text-xs space-y-1.5">
              {satelliteLoading && <p className="text-slate-400 dark:text-slate-500">Loading satellite info...</p>}
              {satelliteError && <p className="text-red-500 dark:text-red-400">Error loading satellite info.</p>}
              {satelliteDetails ? (
                  <>
                      <InfoItemDetail icon={Rocket} label="Launched" value={formatDate(satelliteDetails.launched, false)} iconColor="text-amber-500" />
                      <InfoItemDetail icon={Building} label="Operator" value={satelliteDetails.operator || 'N/A'} iconColor="text-cyan-500" />
                      {countryFlags && <InfoItemDetail icon={GlobeIcon} label="Countries" value={countryFlags} iconColor="text-lime-500" />}
                      {satelliteDetails.status && <InfoItemDetail icon={satelliteDetails.status === 'alive' ? CheckSquare : XSquare} label="Status" value={satelliteDetails.status} iconColor={satelliteDetails.status === 'alive' ? 'text-green-500' : 'text-red-500'} />}
                      {satelliteDbUrl && (
                           <div className="pt-1">
                               <a href={satelliteDbUrl} target="_blank" rel="noopener noreferrer" title="View satellite on SatNOGS DB" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center">
                                   <LinkIcon size={12} className="mr-1"/> View on DB
                               </a>
                           </div>
                      )}
                  </>
              ) : (
                  !satelliteLoading && !satelliteError && <p className="text-slate-400 dark:text-slate-500">Satellite details not available.</p>
              )}
          </div>
      </div>
      {/* --- End Top Section --- */}


      {/* --- Bottom Section: Observation Details --- */}
      <div className="p-4 md:p-5 space-y-4 text-sm flex-grow">

          {/* Observation Time */}
          <div className="flex items-center text-slate-600 dark:text-slate-300">
              <Clock size={16} className="mr-2 text-slate-500 flex-shrink-0"/>
              <span className="font-medium mr-1.5 text-slate-700 dark:text-slate-200">Time:</span> {formatDate(observation.start)} - {formatDate(observation.end, false)}
          </div>

          {/* Pass Details */}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
              <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Pass Details</h5>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                   <InfoItemDetail icon={ArrowUpRight} label="Max Elev." value={`${observation.max_altitude?.toFixed(1) ?? 'N/A'}°`} iconColor="text-teal-500" />
                   <InfoItemDetail icon={Compass} label="Rise Az." value={`${observation.rise_azimuth?.toFixed(1) ?? 'N/A'}°`} iconColor="text-orange-500" />
                   <InfoItemDetail icon={UserCircle} label="Observer" value={observation.observer || 'N/A'} iconColor="text-indigo-500" />
                   <InfoItemDetail icon={Compass} label="Set Az." value={`${observation.set_azimuth?.toFixed(1) ?? 'N/A'}°`} iconColor="text-rose-500" />
              </div>
          </div>

          {/* Transmitter Info */}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
               <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Transmitter</h5>
               <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Radio size={16} className="mr-2 text-blue-500 flex-shrink-0"/>
                  <span className="text-slate-800 dark:text-slate-100" title={observation.transmitter_description || ''}>
                      {observation.transmitter_mode || 'Unknown Mode'}
                      <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                          ({observation.observation_frequency ? `${(observation.observation_frequency / 1e6).toFixed(2)} MHz` : 'N/A'})
                      </span>
                  </span>
              </div>
          </div>

          {/* Station Info */}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-3">
              <h5 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Station</h5>
              <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <MapPin size={16} className="mr-2 text-purple-500 flex-shrink-0"/>
                  <span className="text-slate-800 dark:text-slate-100">{observation.station_name} ({observation.ground_station})</span>
              </div>
          </div>
      </div>
      {/* --- End Bottom Section --- */}


       {/* Footer section for links */}
       <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-right flex justify-end space-x-3 flex-shrink-0 bg-slate-50 dark:bg-slate-700/50">
            {hasDemodData && (
                 <a href={observationUrl} target="_blank" rel="noopener noreferrer" title="View observation details and demodulated data on SatNOGS Network" className="text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 inline-flex items-center px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors">
                     <BarChartHorizontal size={12} className="mr-1"/> Demod Data
                 </a>
            )}
             <a href={observationUrl} target="_blank" rel="noopener noreferrer" title="View full observation details on SatNOGS Network" className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors">
                 View on SatNOGS <ExternalLink size={12} className="ml-1"/>
             </a>
       </div>
    </div>
  );
};

// Updated InfoItemDetail for smaller text size by default
const InfoItemDetail = ({ icon: Icon, label, value, iconColor = "text-slate-500" }) => (
  <div className="flex items-center" title={`${label}: ${value}`}>
    <Icon size={12} className={`mr-1.5 flex-shrink-0 ${iconColor}`} />
    {/* Base size text-xs */}
    <span className="text-xs text-slate-600 dark:text-slate-300 truncate">
      <span className="font-medium text-slate-700 dark:text-slate-200">{label}:</span> {value}
    </span>
  </div>
);


export default ObservationCard;
