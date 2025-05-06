import React, { useState, useEffect, useCallback, useRef } from "react";
import { List, AlertCircle, Loader, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // <--- AÑADIR

import { fetchWithRetry } from "../../api/ApiClient";
import ObservationCard from "./components/ObservationsCard";

const OBSERVATIONS_API_BASE_URL = "https://uisstation.netlify.app/api/network/observations";
const TARGET_STATION_ID = 810;

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
            const cursorValue = url.searchParams.get('cursor');
            if (cursorValue && (rel === 'next' || rel === 'prev')) {
                links[rel] = cursorValue;
            }
        }
    });
    return links;
};

function ObservationsPage() {
  const { t } = useTranslation('observations'); // <--- USAR NAMESPACE
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [prevCursor, setPrevCursor] = useState(null);
  const [currentCursorForDisplay, setCurrentCursorForDisplay] = useState(null);

  const observationsCache = useRef({});

  const fetchObservationsData = useCallback(async (cursor = null, isManualRefresh = false) => {
    setError(null);
    const cacheKey = `station_${TARGET_STATION_ID}_cursor_${cursor || 'initial'}`;

    if (isManualRefresh) {
      setIsRefreshing(true);
      setLoading(true);
    } else {
      if (observationsCache.current[cacheKey]) {
        console.log(`Loading observations from IN-MEMORY CACHE for key: ${cacheKey}`);
        const cachedData = observationsCache.current[cacheKey];
        setObservations(cachedData.observations);
        setNextCursor(cachedData.nextCursor);
        setPrevCursor(cachedData.prevCursor);
        setLoading(false);
        setIsRefreshing(false);
        return;
      }
      setLoading(true);
      setIsRefreshing(false);
    }

    console.log(`Workspaceing API (ManualRefresh: ${isManualRefresh}) for key: ${cacheKey}...`);
    try {
      const queryParams = { ground_station: TARGET_STATION_ID };
      if (cursor) queryParams.cursor = cursor;

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
        setError(t('page.errorInvalidData'));
        setObservations([]);
        setNextCursor(null);
        setPrevCursor(null);
      }
    } catch (e) {
      console.error(`Failed to fetch observations:`, e);
      setError(t('page.errorFetching', { message: e.message }));
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [t]); // <--- AÑADIR t A DEPENDENCIAS

  useEffect(() => {
    setCurrentCursorForDisplay(null);
    fetchObservationsData(null, false);
  }, [fetchObservationsData]);

  const handleNextPage = () => {
    if (nextCursor && !loading && !isRefreshing) {
      setCurrentCursorForDisplay(nextCursor);
      fetchObservationsData(nextCursor, false);
    }
  };

  const handlePrevPage = () => {
    if (prevCursor && !loading && !isRefreshing) {
      setCurrentCursorForDisplay(prevCursor);
      fetchObservationsData(prevCursor, false);
    }
  };

  const handleRefresh = () => {
    if (loading || isRefreshing) return;
    console.log(`FORCE REFRESH for cursor: ${currentCursorForDisplay || 'initial'}`);
    const cacheKeyToClear = `station_${TARGET_STATION_ID}_cursor_${currentCursorForDisplay || 'initial'}`;
    if (observationsCache.current[cacheKeyToClear]) {
      delete observationsCache.current[cacheKeyToClear];
      console.log(`Cleared cache for key: ${cacheKeyToClear} before refresh.`);
    }
    fetchObservationsData(currentCursorForDisplay, true);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <List size={28} className="mr-3 text-blue-600 dark:text-blue-500" />
          {t('page.title')} <span className="text-lg font-normal text-slate-500 dark:text-slate-400 ml-2">({t('page.stationIdLabel')}: {TARGET_STATION_ID})</span>
        </h1>
        <button
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
          aria-label={t('page.refreshButtonAriaLabel')}
        >
          <RefreshCw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? t('page.refreshButtonLoading') : t('page.refreshButton')}
        </button>
      </div>

      {loading && !isRefreshing && (
        <div className="flex justify-center items-center p-10 text-slate-500 dark:text-slate-400">
          <Loader size={24} className="animate-spin mr-2" />
          {t('page.loadingMessage')}
        </div>
      )}

      {!loading && !isRefreshing && error && (
          <div className="p-6 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="font-semibold flex items-center justify-center"><AlertCircle size={20} className="mr-2"/> {t('page.errorTitle')}</p>
              <p>{error}</p>
          </div>
      )}

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
              {t('page.noObservationsFound')}
            </div>
          )}

          {(prevCursor || nextCursor) && (
            <div className="flex justify-center items-center space-x-4 pt-4">
              <button
                onClick={handlePrevPage}
                disabled={!prevCursor || loading || isRefreshing}
                className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
                aria-label={t('page.prevPageAriaLabel')}
              >
                <ChevronLeft size={16} className="mr-1" />
                {t('page.prevPageButton')}
              </button>
              <button
                onClick={handleNextPage}
                disabled={!nextCursor || loading || isRefreshing}
                className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
                aria-label={t('page.nextPageAriaLabel')}
              >
                {t('page.nextPageButton')}
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
