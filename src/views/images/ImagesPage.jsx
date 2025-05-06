import React, { useState, useEffect, useCallback } from "react";
import { Image as ImageIcon, AlertCircle, Loader, ChevronLeft, ChevronRight, CloudOff, User as UserIcon, Users as UsersIcon } from 'lucide-react'; // Added UserIcon, UsersIcon

// Import the fetch utility
import { fetchWithRetry } from "../../api/ApiClient"; // Adjust path as needed
// Import the new card component
import ImageCard from "./components/ImagesCard"; // Adjust path as needed

// --- Configuration ---
const OBSERVATIONS_API_BASE_URL = "https://uisstation.netlify.app/api/network/observations";
const MY_STATION_ID = 810; // Your specific station ID
const TARGET_NORAD_ID = 33591; // Specifically NOAA 19
const TARGET_VETTED_STATUS_STRING = "good"; // Use string "good"
const TARGET_TRANSMITTER_MODE = "APT"; // Specifically APT mode
// --- End Configuration ---

// Pagination parser (same as before)
const parseLinkHeader = (linkHeader) => {
    const links = { next: null, prev: null };
    if (!linkHeader) return links;
    const parts = linkHeader.split(',');
    parts.forEach(part => {
        const section = part.split(';');
        if (section.length < 2) return;
        const urlMatch = section[0].match(/<(.+)>/);
        const relMatch = section[1].match(/rel="(.+)"/);
        if (urlMatch && relMatch) {
            const url = new URL(urlMatch[1]);
            const rel = relMatch[1];
            const cursor = url.searchParams.get('cursor');
            if (cursor && (rel === 'next' || rel === 'prev')) links[rel] = cursor;
        }
    });
    return links;
};


function ImagesPage() {
  // State for "My Station" observations
  const [myStationObservations, setMyStationObservations] = useState([]);
  const [myStationLoading, setMyStationLoading] = useState(true);
  const [myStationError, setMyStationError] = useState(null);
  // Note: Pagination for "My Station" is omitted for simplicity, assuming fewer results

  // State for "Other Stations" observations
  const [otherObservations, setOtherObservations] = useState([]);
  const [otherLoading, setOtherLoading] = useState(true);
  const [otherError, setOtherError] = useState(null);
  const [otherNextCursor, setOtherNextCursor] = useState(null);
  const [otherPrevCursor, setOtherPrevCursor] = useState(null);
  const [otherCurrentCursor, setOtherCurrentCursor] = useState(null);


  // --- Client-side filter for valid demod data ---
  const filterValidImageData = (observations) => {
      return observations.filter(obs =>
          obs.demoddata &&
          Array.isArray(obs.demoddata) &&
          obs.demoddata.length > 0 &&
          obs.demoddata[0].payload_demod
      );
  };

  // --- Fetching Logic for MY Station ---
  const fetchMyStationData = useCallback(async () => {
    setMyStationLoading(true);
    setMyStationError(null);
    try {
      console.log(`Fetching NOAA 19 APT images for MY station ID: ${MY_STATION_ID}...`);
      const queryParams = {
        ground_station: MY_STATION_ID, // Specific station
        satellite__norad_cat_id: TARGET_NORAD_ID,
        vetted_status: TARGET_VETTED_STATUS_STRING,
        transmitter_mode: TARGET_TRANSMITTER_MODE,
        // ordering: '-start', // Optional
        // limit: 12, // Optional: Limit results if needed
      };
      // Fetch without expecting headers for this one (no pagination needed yet)
      const { data: fetchedData } = await fetchWithRetry(OBSERVATIONS_API_BASE_URL, queryParams);

      if (Array.isArray(fetchedData)) {
        setMyStationObservations(filterValidImageData(fetchedData));
        console.log(`Fetched ${fetchedData.length} obs for my station. Found ${filterValidImageData(fetchedData).length} valid images.`);
      } else {
        throw new Error("Invalid data format received.");
      }
    } catch (e) {
      console.error(`Failed to fetch my station observations:`, e);
      setMyStationError(`Failed to load images: ${e.message}`);
      setMyStationObservations([]);
    } finally {
      setMyStationLoading(false);
    }
  }, []); // Empty dependency array

  // --- Fetching Logic for OTHER Stations ---
  const fetchOtherStationsData = useCallback(async (cursor = null) => {
    setOtherLoading(true);
    setOtherError(null);
    setOtherCurrentCursor(cursor);
    try {
      console.log(`Fetching NOAA 19 APT images for OTHER stations ${cursor ? `with cursor: ${cursor}` : ''}...`);
      const queryParams = {
        // NO ground_station parameter
        satellite__norad_cat_id: TARGET_NORAD_ID,
        vetted_status: TARGET_VETTED_STATUS_STRING,
        transmitter_mode: TARGET_TRANSMITTER_MODE,
        // ordering: '-start', // Optional
      };
      if (cursor) queryParams.cursor = cursor;

      const { data: fetchedData, headers } = await fetchWithRetry(OBSERVATIONS_API_BASE_URL, queryParams);

      if (Array.isArray(fetchedData)) {
        setOtherObservations(filterValidImageData(fetchedData));
        const linkHeader = headers.get('Link');
        const links = parseLinkHeader(linkHeader);
        setOtherNextCursor(links.next);
        setOtherPrevCursor(links.prev);
        console.log(`Fetched ${fetchedData.length} obs for other stations. Found ${filterValidImageData(fetchedData).length} valid images. Next: ${links.next}, Prev: ${links.prev}`);
      } else {
         throw new Error("Invalid data format received.");
      }
    } catch (e) {
      console.error(`Failed to fetch other stations observations:`, e);
      setOtherError(`Failed to load images: ${e.message}`);
      setOtherObservations([]);
      setOtherNextCursor(null);
      setOtherPrevCursor(null);
    } finally {
      setOtherLoading(false);
    }
  }, []); // Empty dependency array

  // --- Initial Load Effects ---
  useEffect(() => {
    fetchMyStationData();
    fetchOtherStationsData(null);
  }, [fetchMyStationData, fetchOtherStationsData]); // Run both fetches on mount

  // --- Handlers for OTHER Stations Pagination ---
  const handleOtherNextPage = () => {
    if (otherNextCursor) fetchOtherStationsData(otherNextCursor);
  };
  const handleOtherPrevPage = () => {
    if (otherPrevCursor) fetchOtherStationsData(otherPrevCursor);
  };


  // --- Render Logic ---
  const renderSection = (title, icon, observations, loading, error, gridColsClass = "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4") => (
     <div className="space-y-3">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200 flex items-center border-b border-slate-200 dark:border-slate-700 pb-2">
           {React.createElement(icon, { size: 24, className: "mr-3 text-blue-600 dark:text-blue-500" })}
           {title}
        </h2>
        {loading && (
            <div className="flex justify-center items-center p-6 text-slate-500 dark:text-slate-400">
              <Loader size={20} className="animate-spin mr-2" /> Loading...
            </div>
        )}
        {!loading && error && (
             <div className="p-4 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
                 <p className="font-semibold flex items-center justify-center"><AlertCircle size={18} className="mr-2"/> Error:</p>
                 <p className="text-sm">{error}</p>
             </div>
        )}
        {!loading && !error && (
            <>
              {observations.length > 0 ? (
                 <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
                    {observations.map((obs) => (
                        <ImageCard key={obs.id} observation={obs} />
                    ))}
                 </div>
              ) : (
                <div className="text-center p-6 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                    <CloudOff size={28} className="mb-2 text-slate-400 dark:text-slate-500" />
                  No relevant images found in this section.
                </div>
              )}
            </>
        )}
     </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6"> {/* Increased spacing between sections */}
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <ImageIcon size={28} className="mr-3 text-blue-600 dark:text-blue-500" />
          NOAA 19 APT Images
        </h1>
      </div>

      {/* My Station Section */}
      {renderSection(
          `My Station (${MY_STATION_ID})`,
          UserIcon,
          myStationObservations,
          myStationLoading,
          myStationError,
          "sm:grid-cols-2 md:grid-cols-3" // Fewer columns for "smaller" card appearance relative to width
      )}

       {/* Other Stations Section */}
       {renderSection(
           "Other Stations",
           UsersIcon,
           otherObservations,
           otherLoading,
           otherError,
           "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" // More columns
       )}

       {/* Pagination Controls for Other Stations */}
       {!otherLoading && !otherError && (otherPrevCursor || otherNextCursor) && (
             <div className="flex justify-center items-center space-x-4 pt-4 border-t border-slate-200 dark:border-slate-700 mt-6">
                <button
                    onClick={handleOtherPrevPage}
                    disabled={!otherPrevCursor || otherLoading}
                    className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
                    aria-label="Previous page (Other Stations)"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                </button>
                <button
                    onClick={handleOtherNextPage}
                    disabled={!otherNextCursor || otherLoading}
                    className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
                    aria-label="Next page (Other Stations)"
                >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                </button>
             </div>
       )}
    </div>
  );
}

export default ImagesPage;
