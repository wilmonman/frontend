// src/services/observationService.js
import { fetchWithRetry } from '../api/ApiClient'; // Adjust path if needed

// Define the base API endpoint URL for observations
const OBSERVATIONS_API_BASE_URL = "https://uisstation.netlify.app/api/network/observations";

/**
 * Fetches observations based on provided query parameters.
 * @param {object} queryParams - An object containing query parameters (e.g., { ground_station: 810, limit: 20 }).
 * @returns {Promise<Array<object>>} A promise that resolves with an array of observation objects.
 * @throws {Error} Throws an error if the fetch fails after retries or the API returns an unexpected format.
 */
export const getObservations = async (queryParams = {}) => {
  // Ensure required parameters are present if necessary, or set defaults
  // Example: if (!queryParams.ground_station) { throw new Error("Ground station ID is required."); }

  const fetchedData = await fetchWithRetry(OBSERVATIONS_API_BASE_URL, queryParams);

  if (Array.isArray(fetchedData)) {
    return fetchedData;
  } else {
    console.error("Received unexpected data format from observations API:", fetchedData);
    throw new Error("Invalid data format received from the observations API.");
  }
};

// Add other observation-related API functions here if needed
// e.g., fetching a single observation by its ID
// export const getObservationById = async (obsId) => { ... }
