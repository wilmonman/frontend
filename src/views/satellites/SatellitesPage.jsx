import React, { useState, useEffect, useCallback } from "react";
import { Satellite as SatelliteIcon, AlertCircle, Loader, ListChecks } from 'lucide-react';

// Import the fetch utility
import { fetchWithRetry } from "../../api/ApiClient"; // Adjust path as needed
// Import the card component
import SatelliteCard from "./components/SatellitesCard"; // Adjust path as needed

// --- Configuration ---
const SATELLITE_API_BASE_URL = "https://uisstation.netlify.app/api/db/satellites";

// Curated list of NORAD IDs
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
    7530,  // OSCAR 7 (AO-7)
    43137, // GOES 16 (GOES-R)
];

const ALL_OTHER_IDS = [...NOAA_NORAD_IDS, ...OTHER_INTERESTING_NORAD_IDS];
// --- End Configuration ---


function SatellitesPage() {
  // State for satellite data
  const [facsatData, setFacsatData] = useState([]);
  const [otherSatData, setOtherSatData] = useState([]);
  const [loadingFacsat, setLoadingFacsat] = useState(true);
  const [loadingOther, setLoadingOther] = useState(true);
  const [errorFacsat, setErrorFacsat] = useState(null);
  const [errorOther, setErrorOther] = useState(null);

  // --- Fetching Logic ---
  // Refactored to fetch IDs individually using Promise.allSettled
  const fetchSatelliteData = useCallback(async (ids, setData, setLoading, setError) => {
    setLoading(true);
    setError(null);
    if (!ids || ids.length === 0) {
        setData([]);
        setLoading(false);
        return;
    }

    try {
      console.log(`Fetching satellite data individually for NORAD IDs: ${ids.join(',')}...`);

      // Create an array of fetch promises, one for each ID
      const fetchPromises = ids.map(id =>
        fetchWithRetry(SATELLITE_API_BASE_URL, { norad_cat_id: id })
          // We only need the 'data' part from fetchWithRetry's result
          .then(response => response.data)
          // Handle potential errors within each promise to avoid Promise.all failing early
          // Map successful fetches to the data array, errors to null or an error object
          .catch(err => {
              console.error(`Failed to fetch satellite ID ${id}:`, err);
              return { error: true, id: id, message: err.message }; // Return an error marker
          })
      );

      // Wait for all promises to settle (either resolve or reject)
      const results = await Promise.allSettled(fetchPromises);

      // Process the results
      const fetchedSatellites = [];
      const errors = [];
      results.forEach((result, index) => {
        const requestedId = ids[index]; // Get the ID corresponding to this result
        if (result.status === 'fulfilled' && result.value && !result.value.error) {
          // The API returns an array, even for a single ID.
          // Check if the array contains data and the NORAD ID matches the request.
          if (Array.isArray(result.value) && result.value.length > 0 && result.value[0].norad_cat_id === requestedId) {
            fetchedSatellites.push(result.value[0]); // Add the satellite object
          } else if (Array.isArray(result.value) && result.value.length === 0) {
             console.warn(`No satellite found for NORAD ID: ${requestedId}`);
             // Optionally add a specific "not found" marker if needed
          } else {
             console.warn(`Unexpected data format or ID mismatch for NORAD ID ${requestedId}:`, result.value);
             errors.push(`Unexpected data for ID ${requestedId}`);
          }
        } else {
          // Handle rejected promises or promises that resolved with our error marker
          const errorMessage = result.reason?.message || result.value?.message || 'Unknown error';
          console.error(`Promise failed for NORAD ID ${requestedId}: ${errorMessage}`);
          errors.push(`Failed to load ID ${requestedId}`);
        }
      });

      // Set the successfully fetched data
      setData(fetchedSatellites);

      // If there were any errors during the fetches, set the error state
      if (errors.length > 0) {
          setError(`Errors occurred: ${errors.join('; ')}`);
      }

      console.log(`Finished fetching satellites for IDs: ${ids.join(',')}. Found: ${fetchedSatellites.length}, Errors: ${errors.length}`);

    } catch (e) {
      // Catch unexpected errors in the overall process
      console.error(`Unexpected error fetching satellite data for IDs ${ids.join(',')}:`, e);
      setError(`An unexpected error occurred: ${e.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []); // fetchWithRetry is assumed stable, no component state dependencies here

  // --- Initial Load Effect ---
  useEffect(() => {
    fetchSatelliteData(FACSAT_NORAD_IDS, setFacsatData, setLoadingFacsat, setErrorFacsat);
    fetchSatelliteData(ALL_OTHER_IDS, setOtherSatData, setLoadingOther, setErrorOther);
  }, [fetchSatelliteData]);


  // --- Render Logic ---
  const renderSatelliteGrid = (satellites, loading, error) => {
     if (loading) {
         return (
             <div className="flex justify-center items-center p-6 text-slate-500 dark:text-slate-400">
               <Loader size={20} className="animate-spin mr-2" /> Loading satellites...
             </div>
         );
     }
     // Display error, but still show any data that might have loaded successfully before the error
     const hasData = satellites.length > 0;

     return (
         <>
            {error && (
                 <div className="p-4 mb-4 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
                     <p className="font-semibold flex items-center justify-center"><AlertCircle size={18} className="mr-2"/> Error:</p>
                     <p className="text-sm">{error}</p>
                     {hasData && <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">(Some data might be displayed below)</p>}
                 </div>
            )}
            {!hasData && !error && (
                 <p className="text-slate-500 dark:text-slate-400 text-center py-4">No satellites found in this category.</p>
            )}
            {hasData && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {satellites.map((sat) => (
                        <SatelliteCard key={sat.norad_cat_id} satellite={sat} />
                    ))}
                </div>
            )}
         </>
     );
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <SatelliteIcon size={28} className="mr-3 text-blue-600 dark:text-blue-500" />
          Featured Satellites
        </h1>
      </div>

      {/* FACSAT Section */}
      <div className="space-y-3">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200 flex items-center border-b border-slate-200 dark:border-slate-700 pb-2">
             <ListChecks size={24} className="mr-3 text-indigo-600 dark:text-indigo-400" />
             FACSAT Constellation
          </h2>
          {renderSatelliteGrid(facsatData, loadingFacsat, errorFacsat)}
      </div>

      {/* Other Satellites Section */}
       <div className="space-y-3">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200 flex items-center border-b border-slate-200 dark:border-slate-700 pb-2">
             <ListChecks size={24} className="mr-3 text-teal-600 dark:text-teal-400" />
             NOAA & Other Satellites
          </h2>
          {renderSatelliteGrid(otherSatData, loadingOther, errorOther)}
      </div>

    </div>
  );
}

export default SatellitesPage;
