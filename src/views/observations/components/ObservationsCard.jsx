import React from 'react';
// Import necessary icons, including AlertCircle
import { Satellite, Clock, Radio, CheckSquare, HelpCircle, XSquare, Hourglass, CalendarCheck, CalendarX, ArrowRight, Tag, MapPin, Maximize, AlertCircle } from 'lucide-react';

// Helper functions (can be shared in a utils file)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    // More concise format for cards
    return new Date(dateString).toLocaleString(undefined, {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
        case 'good': return { icon: CheckSquare, color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30', label: 'Good' };
        case 'bad': return { icon: XSquare, color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', label: 'Bad' };
        // Ensure AlertCircle is used here now that it's imported
        case 'failed': return { icon: AlertCircle, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/30', label: 'Failed' };
        case 'unknown': return { icon: HelpCircle, color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700/30', label: 'Unknown' };
        case 'future': return { icon: Hourglass, color: 'text-blue-500 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/30', label: 'Future' };
        default: return { icon: HelpCircle, color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700/30', label: status || 'N/A' };
    }
};

// Observation Card Component
const ObservationCard = ({ observation }) => {
  if (!observation) {
    return null; // Don't render anything if no observation data
  }

  const statusInfo = getStatusInfo(observation.vetted_status); // Use vetted_status for display
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 overflow-hidden transition hover:shadow-md">
      {/* Header section */}
      <div className={`px-4 py-2 flex justify-between items-center border-b border-slate-200 dark:border-slate-700 ${statusInfo.bgColor} bg-opacity-50`}>
         <div className="flex items-center space-x-2 overflow-hidden mr-2"> {/* Added overflow hidden */}
             <Satellite size={16} className="text-slate-600 dark:text-slate-300 flex-shrink-0" /> {/* Added flex-shrink-0 */}
             <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate"> {/* Added truncate */}
                 {observation.tle0 || 'Unknown Satellite'} ({observation.norad_cat_id})
             </span>
         </div>
         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color} ${statusInfo.bgColor} flex-shrink-0`}> {/* Added flex-shrink-0 */}
            <StatusIcon size={12} className="mr-1" />
            {statusInfo.label}
        </span>
      </div>

      {/* Body section */}
      <div className="p-4 space-y-3">
        {/* Time Info */}
        <div className="flex flex-col sm:flex-row justify-between text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center mb-1 sm:mb-0">
                <CalendarCheck size={14} className="mr-1.5 text-green-500"/>
                <span className="font-medium mr-1">Start:</span> {formatDate(observation.start)}
            </div>
            <div className="flex items-center">
                <CalendarX size={14} className="mr-1.5 text-red-500"/>
                <span className="font-medium mr-1">End:</span> {formatDate(observation.end)}
            </div>
        </div>

        {/* Transmitter Info */}
        <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700 pt-2">
            <Radio size={14} className="mr-1.5 text-blue-500"/>
            <span className="font-medium mr-1">Transmitter:</span>
            <span title={observation.transmitter_description || ''}>
                {observation.transmitter_mode || 'Unknown Mode'} ({observation.observation_frequency ? `${(observation.observation_frequency / 1e6).toFixed(2)} MHz` : 'N/A'})
            </span>
        </div>

         {/* Station Info */}
         <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
             <MapPin size={12} className="mr-1.5"/>
             <span className="font-medium mr-1">Station:</span> {observation.station_name} ({observation.ground_station})
         </div>

         {/* Optional: Add link to details or other actions */}
         {/* <div className="text-right pt-2">
             <a href="#" className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center">
                 View Details <ArrowRight size={12} className="ml-1"/>
             </a>
         </div> */}
      </div>
    </div>
  );
};

export default ObservationCard;
