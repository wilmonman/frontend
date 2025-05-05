// apiClient.js - Utility for fetching data with retries and query params

// --- Configuration Constants ---
const DEFAULT_RETRIES = 2; // Number of retries (total attempts = 1 + retries)
const DEFAULT_RETRY_DELAY_MS = 1500; // Wait time between retries in milliseconds

/**
 * Delays execution for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetches data from a URL with automatic retries on failure and optional query parameters.
 * Returns an object containing the parsed data and the response headers.
 *
 * @param {string} baseUrl - The base URL to fetch data from.
 * @param {object} [queryParams={}] - An object containing query parameters to append to the URL.
 * @param {object} [options={}] - Optional fetch options (e.g., headers, method).
 * @param {number} [retries=DEFAULT_RETRIES] - The maximum number of times to retry the fetch.
 * @param {number} [retryDelay=DEFAULT_RETRY_DELAY_MS] - The delay between retries in milliseconds.
 * @returns {Promise<{data: any, headers: Headers}>} A promise that resolves with an object containing the JSON data and the response Headers object.
 * @throws {Error} Throws an error if the fetch fails after all retries or if the response is not ok.
 */
export const fetchWithRetry = async (
  baseUrl,
  queryParams = {},
  options = {},
  retries = DEFAULT_RETRIES,
  retryDelay = DEFAULT_RETRY_DELAY_MS
) => {
  let lastError = null;
  let responseHeaders = null; // To store headers

  // --- Construct URL with Query Parameters ---
  const url = new URL(baseUrl);
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key] !== null && queryParams[key] !== undefined) {
        url.searchParams.append(key, queryParams[key]);
    }
  });
  const fullUrl = url.toString();
  // --- End URL Construction ---


  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retrying fetch for ${fullUrl}... Attempt ${attempt}/${retries}`);
      }

      const response = await fetch(fullUrl, options);
      responseHeaders = response.headers; // Store headers regardless of status initially

      if (!response.ok) {
        // Include status in the error for better context
        const errorBody = await response.text().catch(() => 'Could not read error body'); // Try to get error body
        throw new Error(`HTTP error! Status: ${response.status} for URL: ${fullUrl}. Body: ${errorBody}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          console.log(`Successfully fetched data from ${fullUrl}`);
          // Return data and headers on success
          return { data, headers: responseHeaders };
      } else {
          // Handle non-JSON response if necessary, e.g., return text
          console.warn(`Received non-JSON response from ${fullUrl}. Content-Type: ${contentType}`);
          const textData = await response.text();
          // Decide how to handle this - maybe return text data or throw specific error
          // For now, let's return text data along with headers
          // return { data: textData, headers: responseHeaders };
          // Or throw if JSON is strictly expected:
           throw new Error(`Expected JSON response but received Content-Type: ${contentType}`);
      }

    } catch (error) {
      lastError = error;
      console.error(`Fetch attempt ${attempt} failed for ${fullUrl}:`, error.message);

      if (attempt < retries) {
        await delay(retryDelay);
      }
    }
  }

  console.error(`Fetching failed after ${retries} retries for ${fullUrl}.`);
  // Throw the last encountered error. Attach headers if available.
  if (responseHeaders) {
      lastError.headers = responseHeaders;
  }
  throw lastError;
};
