// src/services/stationService.js
import { fetchWithRetry } from '../api/ApiClient'; // Adjust path if needed

// Define the base API endpoint URL for stations
const STATIONS_API_BASE_URL = "https://uisstation.netlify.app/api/network/stations";

/**
 * Fetches a specific ground station by its ID.
 * @param {number | string} id - The ID of the ground station to fetch.
 * @returns {Promise<object | null>} A promise that resolves with the station object if found (usually the first element of the returned array), or null if not found/error.
 * @throws {Error} Throws an error if the fetch fails after retries or the API returns an unexpected format.
 */
export const getStationById = async (id) => {
  if (!id) {
    throw new Error("Station ID is required to fetch station data.");
  }

  const queryParams = { id: id };
  const fetchedData = await fetchWithRetry(STATIONS_API_BASE_URL, queryParams);

  // API often returns an array even when querying by ID
  if (Array.isArray(fetchedData) && fetchedData.length === 1) {
    return fetchedData[0]; // Return the single station object
  } else if (Array.isArray(fetchedData) && fetchedData.length === 0) {
    // Handle case where the ID was not found
    console.warn(`No station found with ID: ${id}`);
    return null; // Indicate not found
  } else {
    // Handle unexpected format
    console.error("Received unexpected data format when fetching station by ID:", fetchedData);
    throw new Error("Invalid data format received from the station API.");
  }
};

/**
 * Fetches a list of all ground stations (use with caution, might be large).
 * Add pagination parameters if needed.
 * @returns {Promise<Array<object>>} A promise that resolves with an array of station objects.
 */
export const getAllStations = async (queryParams = {}) => {
    // Example: Add default limit or allow passing pagination params
    // const params = { limit: 100, ...queryParams };
    const fetchedData = await fetchWithRetry(STATIONS_API_BASE_URL, queryParams);
    if (Array.isArray(fetchedData)) {
        return fetchedData;
    } else {
        console.error("Received unexpected data format when fetching all stations:", fetchedData);
        throw new Error("Invalid data format received from the station API.");
    }
};

// Add other station-related API functions here if needed
