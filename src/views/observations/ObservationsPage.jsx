import React, { useState, useEffect, useCallback } from "react";
import { List, AlertCircle, Loader, ChevronLeft, ChevronRight } from 'lucide-react';

// Import the fetch utility
import { fetchWithRetry } from "../../api/ApiClient"; // Adjust path as needed
// Import the new card component
import ObservationCard from "./components/ObservationsCard"; // Adjust path as needed

// --- Configuration ---
const OBSERVATIONS_API_BASE_URL = "https://uisstation.netlify.app/api/network/observations";
const TARGET_STATION_ID = 810;
// --- End Configuration ---

/**
 * Parses the Link header to extract cursor values for next/prev pages.
 * Example Link header:
 * <https://.../?cursor=cD0yM...>; rel="next", <https://.../?cursor=cj0x...>; rel="prev"
 * @param {string | null} linkHeader - The value of the Link header.
 * @returns {{next: string | null, prev: string | null}} An object containing cursors.
 */
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
            const cursor = url.searchParams.get('cursor'); // Extract only the cursor value
            if (cursor && (rel === 'next' || rel === 'prev')) {
                links[rel] = cursor;
            }
        }
    });
    return links;
};


function ObservationsPage() {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for pagination cursors
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [currentCursor, setCurrentCursor] = useState(null); // Track the cursor used for the current view

  // --- Fetching Logic with Pagination ---
  // Accepts an optional cursor to fetch a specific page
  const fetchObservationsData = useCallback(async (cursor = null) => {
    setLoading(true);
    setError(null);
    setCurrentCursor(cursor); // Store the cursor being used for this fetch

    try {
      console.log(`Fetching observations for station ID: ${TARGET_STATION_ID} ${cursor ? `with cursor: ${cursor}` : ''}...`);
      const queryParams = {
        ground_station: TARGET_STATION_ID,
        // Add other fixed parameters if needed
        // ordering: '-start',
      };
      // Add the cursor to queryParams if provided
      if (cursor) {
        queryParams.cursor = cursor;
      }

      // Use fetchWithRetry and get data + headers
      const { data: fetchedData, headers } = await fetchWithRetry(OBSERVATIONS_API_BASE_URL, queryParams);

      if (Array.isArray(fetchedData)) {
        setObservations(fetchedData);
        // Parse the Link header to get pagination cursors
        const linkHeader = headers.get('Link');
        const links = parseLinkHeader(linkHeader);
        setNextCursor(links.next);
        setPrevCursor(links.prev);
        console.log(`Fetched ${fetchedData.length} observations. Next: ${links.next}, Prev: ${links.prev}`);
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
      setObservations([]); // Clear observations on error
      setNextCursor(null); // Clear cursors on error
      setPrevCursor(null);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array

  // --- Initial Load Effect ---
  useEffect(() => {
    // Fetch the first page initially (no cursor)
    fetchObservationsData(null);
  }, [fetchObservationsData]);

  // --- Handlers for Pagination ---
  const handleNextPage = () => {
    if (nextCursor) {
      fetchObservationsData(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (prevCursor) {
      fetchObservationsData(prevCursor);
    }
  };


  // --- Render Logic ---

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <List size={28} className="mr-3 text-blue-600 dark:text-blue-500" />
          Observations <span className="text-lg font-normal text-slate-500 dark:text-slate-400 ml-2">(Station ID: {TARGET_STATION_ID})</span>
        </h1>
        {/* Add Refresh Button? */}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-10 text-slate-500 dark:text-slate-400">
          <Loader size={24} className="animate-spin mr-2" />
          Loading observations...
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
         <div className="p-6 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
             <p className="font-semibold flex items-center justify-center"><AlertCircle size={20} className="mr-2"/> Error Loading Observations:</p>
             <p>{error}</p>
         </div>
      )}

      {/* Observation Cards Grid */}
      {!loading && !error && (
        <>
          {observations.length > 0 ? (
             // Use a grid layout for the cards
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {observations.map((obs) => (
                    <ObservationCard key={obs.id} observation={obs} />
                ))}
             </div>
          ) : (
            <div className="text-center p-6 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
              No observations found matching the criteria.
            </div>
          )}

          {/* Pagination Controls */}
          {(prevCursor || nextCursor) && (
             <div className="flex justify-center items-center space-x-4 pt-4">
                <button
                    onClick={handlePrevPage}
                    disabled={!prevCursor || loading}
                    className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
                    aria-label="Previous page"
                >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                </button>
                <button
                    onClick={handleNextPage}
                    disabled={!nextCursor || loading}
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
