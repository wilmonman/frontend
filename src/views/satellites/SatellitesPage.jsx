import React, { useState, useEffect, useCallback, useRef } from "react";
import { Satellite as SatelliteIcon, AlertCircle, Loader, ListChecks, RefreshCw } from 'lucide-react'; // Added RefreshCw

// Import the fetch utility
import { fetchWithRetry } from "../../api/ApiClient"; // Adjust path as needed
// Import the card component
import SatelliteCard from "./components/SatellitesCard"; // Adjust path as needed

// --- Configuration ---
const SATELLITE_API_BASE_URL = "https://uisstation.netlify.app/api/db/satellites";

const FACSAT_NORAD_IDS = [
    43721, // FACSAT 1
    56205, // FACSAT 2 (Chiribiquete)
];

const NOAA_NORAD_IDS = [
    25338, // NOAA 15
    28654, // NOAA 18
    33591, // NOAA 19
];

const OTHER_INTERESTING_NORAD_IDS = [
    25544, // ISS (ZARYA)
    57166, // METEOR-M 2-3
    7530,  // OSCAR 7 (AO-7)
    43137, // GOES 16 (GOES-R)
];

const ALL_OTHER_IDS = [...NOAA_NORAD_IDS, ...OTHER_INTERESTING_NORAD_IDS];
// Cache Keys
const CACHE_KEY_FACSAT = "facsat_satellite_data";
const CACHE_KEY_OTHER = "other_satellite_data";
// --- End Configuration ---


function SatellitesPage() {
  // State for satellite data
  const [facsatData, setFacsatData] = useState([]);
  const [otherSatData, setOtherSatData] = useState([]);
  const [loadingFacsat, setLoadingFacsat] = useState(true);
  const [loadingOther, setLoadingOther] = useState(true);
  const [errorFacsat, setErrorFacsat] = useState(null);
  const [errorOther, setErrorOther] = useState(null);

  // New states for refreshing individual sections
  const [isRefreshingFacsat, setIsRefreshingFacsat] = useState(false);
  const [isRefreshingOther, setIsRefreshingOther] = useState(false);

  // In-memory cache
  const satellitesCache = useRef({});

  // --- Fetching Logic ---
  const fetchSatelliteData = useCallback(
    async (
      ids,
      setData,
      setLoading,
      setErrorState, // Renamed from setError to avoid conflict
      setIsRefreshing,
      cacheKey,
      isManualRefresh = false
    ) => {
      setErrorState(null); // Clear previous errors for this section

      if (isManualRefresh) {
        setIsRefreshing(true);
        setLoading(true); // Force loading state for UI feedback
      } else {
        // Automatic fetch (initial load)
        if (satellitesCache.current[cacheKey]) {
          console.log(`Loading ${cacheKey} from IN-MEMORY CACHE...`);
          setData(satellitesCache.current[cacheKey]);
          setLoading(false);
          setIsRefreshing(false); // Ensure this is false if somehow set
          return;
        }
        // Cache miss for automatic fetch
        setLoading(true);
        setIsRefreshing(false); // Ensure this is false for initial load
      }

      if (!ids || ids.length === 0) {
        setData([]);
        setLoading(false);
        setIsRefreshing(false);
        return;
      }

      console.log(`Workspaceing API (ManualRefresh: ${isManualRefresh}) for ${cacheKey} - NORAD IDs: ${ids.join(',')}...`);

      try {
        const fetchPromises = ids.map(id =>
          fetchWithRetry(SATELLITE_API_BASE_URL, { norad_cat_id: id })
            .then(response => response.data) // Correctly extracts data from {data, headers}
            .catch(err => {
              console.error(`Initial fetch error for satellite ID ${id}:`, err);
              return { error: true, id: id, message: err.message }; // Error marker for this specific ID
            })
        );

        const results = await Promise.allSettled(fetchPromises);
        const fetchedSatellites = [];
        const errors = [];

        results.forEach((result, index) => {
          const requestedId = ids[index];
          if (result.status === 'fulfilled' && result.value && !result.value.error) {
            if (Array.isArray(result.value) && result.value.length > 0 && String(result.value[0].norad_cat_id) === String(requestedId)) {
              fetchedSatellites.push(result.value[0]);
            } else if (Array.isArray(result.value) && result.value.length === 0) {
              console.warn(`No satellite found via API for NORAD ID: ${requestedId}`);
              // errors.push(`No data for ID ${requestedId}`); // Optionally report "not found" as an error
            } else {
              console.warn(`Unexpected data format or ID mismatch for NORAD ID ${requestedId}:`, result.value);
              errors.push(`Data issue for ID ${requestedId}`);
            }
          } else {
            const errorMessage = result.reason?.message || result.value?.message || 'Unknown error';
            console.error(`Promise failed for NORAD ID ${requestedId}: ${errorMessage}`);
            errors.push(`Failed ID ${requestedId}`);
          }
        });

        setData(fetchedSatellites);
        satellitesCache.current[cacheKey] = fetchedSatellites; // Cache the successfully processed list
        console.log(`Cached ${fetchedSatellites.length} satellites for ${cacheKey} IN-MEMORY.`);

        if (errors.length > 0) {
          setErrorState(`Partial success with issues: ${errors.join('; ')}`);
        }
      } catch (e) { // Catch unexpected errors in the overall Promise.allSettled or processing
        console.error(`Overall unexpected error fetching ${cacheKey}:`, e);
        setErrorState(`An unexpected error occurred: ${e.message}`);
        // setData([]); // Optionally clear data on major failure
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [] // fetchWithRetry is imported, other dependencies are constants or state setters
  );

  // --- Initial Load Effect ---
  useEffect(() => {
    fetchSatelliteData(FACSAT_NORAD_IDS, setFacsatData, setLoadingFacsat, setErrorFacsat, setIsRefreshingFacsat, CACHE_KEY_FACSAT, false);
    fetchSatelliteData(ALL_OTHER_IDS, setOtherSatData, setLoadingOther, setErrorOther, setIsRefreshingOther, CACHE_KEY_OTHER, false);
  }, [fetchSatelliteData]);

  // --- Handlers for Force Refresh ---
  const handleRefreshFacsat = () => {
    if (loadingFacsat || isRefreshingFacsat) return; // Prevent multiple clicks if already busy
    console.log(`FORCE REFRESH for ${CACHE_KEY_FACSAT}`);
    if (satellitesCache.current[CACHE_KEY_FACSAT]) {
      delete satellitesCache.current[CACHE_KEY_FACSAT];
      console.log(`Cleared cache for ${CACHE_KEY_FACSAT}`);
    }
    fetchSatelliteData(FACSAT_NORAD_IDS, setFacsatData, setLoadingFacsat, setErrorFacsat, setIsRefreshingFacsat, CACHE_KEY_FACSAT, true);
  };

  const handleRefreshOther = () => {
    if (loadingOther || isRefreshingOther) return; // Prevent multiple clicks
    console.log(`FORCE REFRESH for ${CACHE_KEY_OTHER}`);
    if (satellitesCache.current[CACHE_KEY_OTHER]) {
      delete satellitesCache.current[CACHE_KEY_OTHER];
      console.log(`Cleared cache for ${CACHE_KEY_OTHER}`);
    }
    fetchSatelliteData(ALL_OTHER_IDS, setOtherSatData, setLoadingOther, setErrorOther, setIsRefreshingOther, CACHE_KEY_OTHER, true);
  };


  // --- Render Logic ---
  const renderSatelliteGrid = (satellites, isLoading, errorMsg, isRefreshingState, sectionTitleForLoading) => {
    // Show loader if it's the initial load (no data yet) OR if a manual refresh is in progress for this section
    const showSectionLoader = isLoading && (!satellites || satellites.length === 0 || isRefreshingState);

    return (
      <>
        {showSectionLoader ? (
          <div className="flex justify-center items-center p-6 text-slate-500 dark:text-slate-400">
            <Loader size={20} className="animate-spin mr-2" /> Loading {sectionTitleForLoading}...
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-4 mb-4 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="font-semibold flex items-center justify-center"><AlertCircle size={18} className="mr-2"/> Error:</p>
                <p className="text-sm">{errorMsg}</p>
                {satellites.length > 0 && <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">(Some data might be displayed below)</p>}
              </div>
            )}
            {satellites.length === 0 && !errorMsg && !isLoading && (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4">No satellites found in this category.</p>
            )}
            {satellites.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {satellites.map((sat) => (
                  <SatelliteCard key={sat.norad_cat_id} satellite={sat} />
                ))}
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <div className="p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <SatelliteIcon size={28} className="mr-3 text-blue-600 dark:text-blue-500" />
          Featured Satellites
        </h1>
      </div>

      {/* FACSAT Section */}
      <section className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg shadow">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200 flex items-center">
            <ListChecks size={24} className="mr-3 text-indigo-600 dark:text-indigo-400" />
            FACSAT Constellation
          </h2>
          <button
            onClick={handleRefreshFacsat}
            disabled={loadingFacsat || isRefreshingFacsat}
            className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition ease-in-out duration-150"
            aria-label="Refresh FACSAT data"
          >
            <RefreshCw size={14} className={`mr-1.5 ${isRefreshingFacsat ? 'animate-spin' : ''}`} />
            {isRefreshingFacsat ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {renderSatelliteGrid(facsatData, loadingFacsat, errorFacsat, isRefreshingFacsat, "FACSAT Constellation")}
      </section>

      {/* Other Satellites Section */}
      <section className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg shadow">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200 flex items-center">
            <ListChecks size={24} className="mr-3 text-teal-600 dark:text-teal-400" />
            NOAA & Other Satellites
          </h2>
          <button
            onClick={handleRefreshOther}
            disabled={loadingOther || isRefreshingOther}
            className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition ease-in-out duration-150"
            aria-label="Refresh Other Satellites data"
          >
            <RefreshCw size={14} className={`mr-1.5 ${isRefreshingOther ? 'animate-spin' : ''}`} />
            {isRefreshingOther ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {renderSatelliteGrid(otherSatData, loadingOther, errorOther, isRefreshingOther, "NOAA & Other Satellites")}
      </section>
    </div>
  );
}

export default SatellitesPage;