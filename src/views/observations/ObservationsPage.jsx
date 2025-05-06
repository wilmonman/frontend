import React, { useState, useEffect, useCallback, useRef } from "react";
// Make sure to import RefreshCw if you haven't already for other pages
import { List, AlertCircle, Loader, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

// Import the fetch utility
import { fetchWithRetry } from "../../api/ApiClient"; // Adjust path as needed
// Import the new card component
import ObservationCard from "./components/ObservationsCard"; // Adjust path as needed

// --- Configuration ---
const OBSERVATIONS_API_BASE_URL = "https://uisstation.netlify.app/api/network/observations";
const TARGET_STATION_ID = 810;
// --- End Configuration ---

const parseLinkHeader = (linkHeader) => {
    const links = { next: null, prev: null };
    if (!linkHeader) {
        return links;
    }
    const parts = linkHeader.split(',');
    parts.forEach(part => {
        const section = part.split(';');
        if (section.length < 2) return;
        const urlMatch = section[0].match(/<(.+)>/);
        const relMatch = section[1].match(/rel="(.+)"/);
        if (urlMatch && relMatch) {
            const url = new URL(urlMatch[1]);
            const rel = relMatch[1];
            const cursorValue = url.searchParams.get('cursor');
            if (cursorValue && (rel === 'next' || rel === 'prev')) {
                links[rel] = cursorValue;
            }
        }
    });
    return links;
};

function ObservationsPage() {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false); // New state for refresh action
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [currentCursorForDisplay, setCurrentCursorForDisplay] = useState(null);

  const observationsCache = useRef({});

  const fetchObservationsData = useCallback(async (cursor = null, isManualRefresh = false) => {
    setError(null);
    // currentCursorForDisplay is set by the calling function (useEffect, handleNextPage, handlePrevPage, handleRefresh)

    const cacheKey = `station_${TARGET_STATION_ID}_cursor_${cursor || 'initial'}`;

    if (isManualRefresh) {
      setIsRefreshing(true); // For button state
      setLoading(true);     // For general loading indicator, as we are forcing an API call
    } else {
      // Automatic fetch (initial or pagination)
      if (observationsCache.current[cacheKey]) {
        console.log(`Loading observations from IN-MEMORY CACHE for key: ${cacheKey}`);
        const cachedData = observationsCache.current[cacheKey];
        setObservations(cachedData.observations);
        setNextCursor(cachedData.nextCursor);
        setPrevCursor(cachedData.prevCursor);
        // currentCursorForDisplay is already set by the caller
        setLoading(false);
        setIsRefreshing(false); // Ensure this is reset if a previous refresh was interrupted
        return;
      }
      // Cache miss for automatic fetch
      setLoading(true);
      // isRefreshing should be false here already, but ensure it.
      setIsRefreshing(false);
    }

    console.log(`Workspaceing API (ManualRefresh: ${isManualRefresh}) for key: ${cacheKey}...`);

    try {
      const queryParams = {
        ground_station: TARGET_STATION_ID,
      };
      if (cursor) {
        queryParams.cursor = cursor;
      }

      const { data: fetchedData, headers } = await fetchWithRetry(OBSERVATIONS_API_BASE_URL, queryParams);

      if (Array.isArray(fetchedData)) {
        const linkHeader = headers.get('Link');
        const links = parseLinkHeader(linkHeader);

        observationsCache.current[cacheKey] = {
          observations: fetchedData,
          nextCursor: links.next,
          prevCursor: links.prev,
        };
        console.log(`Cached observations IN-MEMORY for key: ${cacheKey}`);

        setObservations(fetchedData);
        setNextCursor(links.next);
        setPrevCursor(links.prev);
        console.log(`Workspaceed ${fetchedData.length} observations. Next: ${links.next}, Prev: ${links.prev}`);
      } else {
        console.error("Received unexpected data format from observations API:", fetchedData);
        setError("Invalid data format received from the server.");
        setObservations([]);
        setNextCursor(null);
        setPrevCursor(null);
      }
    } catch (e) {
      console.error(`Failed to fetch observations:`, e);
      setError(`Failed to load observations: ${e.message}`);
      // Potentially clear data on error, or leave stale data
      // setObservations([]);
      // setNextCursor(null);
      // setPrevCursor(null);
    } finally {
      setLoading(false);
      setIsRefreshing(false); // Always reset both states in finally
    }
  }, []); // Empty dependency array as TARGET_STATION_ID is constant and cache is a ref.

  // --- Initial Load Effect ---
  useEffect(() => {
    setCurrentCursorForDisplay(null); // Set initial cursor for display
    fetchObservationsData(null, false); // isManualRefresh is false for initial load
  }, [fetchObservationsData]);


  // --- Handlers for Pagination ---
  const handleNextPage = () => {
    if (nextCursor && !loading && !isRefreshing) { // Prevent action if already loading/refreshing
      setCurrentCursorForDisplay(nextCursor);
      fetchObservationsData(nextCursor, false);
    }
  };

  const handlePrevPage = () => {
    if (prevCursor && !loading && !isRefreshing) { // Prevent action if already loading/refreshing
      setCurrentCursorForDisplay(prevCursor);
      fetchObservationsData(prevCursor, false);
    }
  };

  // --- Handler for Force Refresh ---
  const handleRefresh = () => {
    if (loading || isRefreshing) return; // Don't allow refresh if already busy

    console.log(`FORCE REFRESH for cursor: ${currentCursorForDisplay || 'initial'}`);
    const cacheKeyToClear = `station_${TARGET_STATION_ID}_cursor_${currentCursorForDisplay || 'initial'}`;
    if (observationsCache.current[cacheKeyToClear]) {
      delete observationsCache.current[cacheKeyToClear];
      console.log(`Cleared cache for key: ${cacheKeyToClear} before refresh.`);
    }
    // currentCursorForDisplay is already set to the cursor of the page we want to refresh
    fetchObservationsData(currentCursorForDisplay, true); // true for isManualRefresh
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <List size={28} className="mr-3 text-blue-600 dark:text-blue-500" />
          Observations <span className="text-lg font-normal text-slate-500 dark:text-slate-400 ml-2">(Station ID: {TARGET_STATION_ID})</span>
        </h1>
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          disabled={loading || isRefreshing} // Disable if any loading operation is in progress
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
          aria-label="Refresh observations data"
        >
          <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Loading State (General page loading) */}
      {loading && !isRefreshing && ( // Show general loader only if not a manual refresh action causing the load
        <div className="flex justify-center items-center p-10 text-slate-500 dark:text-slate-400">
          <Loader size={24} className="animate-spin mr-2" />
          Loading observations...
        </div>
      )}

      {/* Error State */}
      {/* Show error if not loading/refreshing and error exists */}
      {!loading && !isRefreshing && error && (
          <div className="p-6 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="font-semibold flex items-center justify-center"><AlertCircle size={20} className="mr-2"/> Error Loading Observations:</p>
              <p>{error}</p>
          </div>
      )}

      {/* Observation Cards Grid */}
      {/* Show data if not loading/refreshing and no error */}
      {!loading && !isRefreshing && !error && (
        <>
          {observations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {observations.map((obs) => (
                <ObservationCard key={obs.id} observation={obs} />
              ))}
            </div>
          ) : (
            <div className="text-center p-6 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
              No observations found matching the criteria for this page.
            </div>
          )}

          {/* Pagination Controls */}
          {(prevCursor || nextCursor) && (
            <div className="flex justify-center items-center space-x-4 pt-4">
              <button
                onClick={handlePrevPage}
                disabled={!prevCursor || loading || isRefreshing} // Disable if busy
                className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={!nextCursor || loading || isRefreshing} // Disable if busy
                className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
                aria-label="Next page"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ObservationsPage;
