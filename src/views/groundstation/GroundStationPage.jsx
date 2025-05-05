import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw } from 'lucide-react';

// Import the fetch utility
import { fetchWithRetry } from "../../api/ApiClient"; // Adjust path as needed

// Import the card component
import GroundStationCard from "./components/GroundStationCard"; // Adjust path as needed

// --- Configuration ---
// Define the base API endpoint URL
const STATIONS_API_BASE_URL = "https://uisstation.netlify.app/api/network/stations";
// Define the target Station ID as a constant
const TARGET_STATION_ID = 810;
// Define the base key for localStorage (will append ID)
const LOCAL_STORAGE_BASE_KEY = "groundStationData_";
// --- End Configuration ---

function GroundStationPage() {
  // State remains the same
  const [stationData, setStationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Derive the specific localStorage key using the constant ID
  const localStorageKey = `${LOCAL_STORAGE_BASE_KEY}${TARGET_STATION_ID}`;

  // --- Fetching and Caching Logic ---
  // useCallback now has a stable dependency array [] as the ID is constant
  const fetchAndCacheStationData = useCallback(async (isManualRefresh = false) => {
    setError(null);

    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
       if (!localStorage.getItem(localStorageKey)) {
           setLoading(true);
       }
    }

    try {
      console.log(`Fetching station data for fixed ID: ${TARGET_STATION_ID}... (Manual Refresh: ${isManualRefresh})`);
      // Pass the TARGET_STATION_ID as a query parameter
      const queryParams = { id: TARGET_STATION_ID };
      const fetchedData = await fetchWithRetry(STATIONS_API_BASE_URL, queryParams);

      if (Array.isArray(fetchedData) && fetchedData.length === 1) {
        const theStation = fetchedData[0];
        localStorage.setItem(localStorageKey, JSON.stringify(theStation));
        setStationData(theStation);
        console.log(`Station data for ID ${TARGET_STATION_ID} fetched and cached:`, theStation);
      } else if (Array.isArray(fetchedData) && fetchedData.length === 0) {
        setError(`No station found with ID: ${TARGET_STATION_ID}`);
        setStationData(null);
        localStorage.removeItem(localStorageKey);
      } else {
        setError("Invalid data format received from the server.");
        setStationData(null);
        localStorage.removeItem(localStorageKey);
      }
    } catch (e) {
      console.error(`Failed to fetch station data for ID ${TARGET_STATION_ID}:`, e);
      setError(`Failed to load station data: ${e.message}`);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  // Empty dependency array [] because TARGET_STATION_ID and localStorageKey are derived from constants/stable values within the component scope
  }, [localStorageKey]);

  // --- Initial Load Effect ---
  // Runs only once on component mount
  useEffect(() => {
    console.log(`GroundStationPage mounted for fixed ID: ${TARGET_STATION_ID}. Checking cache...`);
    const cachedDataString = localStorage.getItem(localStorageKey);

    if (cachedDataString) {
      try {
        const cachedStation = JSON.parse(cachedDataString);
        setStationData(cachedStation);
        setLoading(false);
        console.log(`Loaded station data for ID ${TARGET_STATION_ID} from cache:`, cachedStation);
      } catch (e) {
        console.error(`Failed to parse cached data for ID ${TARGET_STATION_ID}:`, e);
        localStorage.removeItem(localStorageKey);
        fetchAndCacheStationData(false); // Fetch if cache is corrupted
      }
    } else {
      // No data in cache for this ID, fetch it
      console.log(`No data in cache for ID ${TARGET_STATION_ID}. Fetching initial data...`);
      fetchAndCacheStationData(false);
    }
    // fetchAndCacheStationData has stable reference due to useCallback([])
  }, [localStorageKey, fetchAndCacheStationData]); // Depend on localStorageKey and the stable fetch function


  // --- Render Logic ---

  // Initial loading message
  if (loading && !stationData && !error) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        Loading Ground Station data for ID: {TARGET_STATION_ID}...
      </div>
    );
  }

  const showProminentError = error && !isRefreshing;

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
          Ground Station Dashboard <span className="text-lg font-normal text-slate-500 dark:text-slate-400">(ID: {TARGET_STATION_ID})</span>
        </h1>
        <button
          onClick={() => fetchAndCacheStationData(true)} // Manual refresh
          disabled={isRefreshing || loading}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
          aria-label="Refresh station data"
        >
          <RefreshCw size={16} className={`mr-2 ${(isRefreshing || (loading && !stationData)) ? 'animate-spin' : ''}`} />
          {(isRefreshing || (loading && !stationData)) ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Prominent Error Display */}
      {showProminentError && (
         <div className="p-6 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
             <p className="font-semibold">Error loading data for Station ID {TARGET_STATION_ID}:</p>
             <p>{error}</p>
             {stationData && <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">Displaying last known data.</p>}
         </div>
      )}

      {/* Inline Error on Refresh Failure */}
      {error && isRefreshing && stationData && (
         <div className="p-3 text-sm text-center text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-700 rounded-lg">
              <strong>Refresh failed:</strong> {error}. Displaying last loaded data.
         </div>
      )}

      {/* Render the card */}
      {stationData ? (
        <GroundStationCard station={stationData} />
      ) : (
        // Show only if no data, not loading, and no prominent error
        !loading && !showProminentError && (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">
            No information available for Station ID: {TARGET_STATION_ID}.
            </div>
        )
      )}
    </div>
  );
}

export default GroundStationPage;
