import React, { useState, useEffect, useCallback, useRef } from "react";
import { Satellite as SatelliteIcon, AlertCircle, Loader, ListChecks, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // <--- AÑADIR

import { fetchWithRetry } from "../../api/ApiClient";
import SatelliteCard from "./components/SatellitesCard";

const SATELLITE_API_BASE_URL = "https://uisstation.netlify.app/api/db/satellites";
const FACSAT_NORAD_IDS = [43721, 56205];
const NOAA_NORAD_IDS = [25338, 28654, 33591];
const OTHER_INTERESTING_NORAD_IDS = [25544, 57166, 7530, 43137];
const ALL_OTHER_IDS = [...NOAA_NORAD_IDS, ...OTHER_INTERESTING_NORAD_IDS];
const CACHE_KEY_FACSAT = "facsat_satellite_data";
const CACHE_KEY_OTHER = "other_satellite_data";

function SatellitesPage() {
  const { t } = useTranslation('satellites'); // <--- USAR NAMESPACE

  const [facsatData, setFacsatData] = useState([]);
  const [otherSatData, setOtherSatData] = useState([]);
  const [loadingFacsat, setLoadingFacsat] = useState(true);
  const [loadingOther, setLoadingOther] = useState(true);
  const [errorFacsat, setErrorFacsat] = useState(null);
  const [errorOther, setErrorOther] = useState(null);
  const [isRefreshingFacsat, setIsRefreshingFacsat] = useState(false);
  const [isRefreshingOther, setIsRefreshingOther] = useState(false);
  const satellitesCache = useRef({});

  const fetchSatelliteData = useCallback(
    async (
      ids, setData, setLoading, setErrorState, setIsRefreshing, cacheKey, isManualRefresh = false
    ) => {
      setErrorState(null);
      if (isManualRefresh) {
        setIsRefreshing(true);
        setLoading(true);
      } else {
        if (satellitesCache.current[cacheKey]) {
          console.log(`Loading ${cacheKey} from IN-MEMORY CACHE...`);
          setData(satellitesCache.current[cacheKey]);
          setLoading(false);
          setIsRefreshing(false);
          return;
        }
        setLoading(true);
        setIsRefreshing(false);
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
            .then(response => response.data)
            .catch(err => {
              console.error(`Initial fetch error for satellite ID ${id}:`, err);
              return { error: true, id: id, message: err.message };
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
              errors.push(t('page.errorNoDataForId', { id: requestedId }));
            } else {
              console.warn(`Unexpected data format or ID mismatch for NORAD ID ${requestedId}:`, result.value);
              errors.push(t('page.errorDataIssueForId', { id: requestedId }));
            }
          } else {
            const errorMessage = result.reason?.message || result.value?.message || 'Unknown error';
            console.error(`Promise failed for NORAD ID ${requestedId}: ${errorMessage}`);
            errors.push(t('page.errorFailedId', {id: requestedId}));
          }
        });
        setData(fetchedSatellites);
        satellitesCache.current[cacheKey] = fetchedSatellites;
        console.log(`Cached ${fetchedSatellites.length} satellites for ${cacheKey} IN-MEMORY.`);
        if (errors.length > 0) {
          setErrorState(t('page.errorPartialSuccess', {issues: errors.join('; ')}));
        }
      } catch (e) {
        console.error(`Overall unexpected error fetching ${cacheKey}:`, e);
        setErrorState(t('page.errorUnexpected', {message: e.message}));
      } finally {
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [t] // <--- AÑADIR t a dependencias
  );

  useEffect(() => {
    fetchSatelliteData(FACSAT_NORAD_IDS, setFacsatData, setLoadingFacsat, setErrorFacsat, setIsRefreshingFacsat, CACHE_KEY_FACSAT, false);
    fetchSatelliteData(ALL_OTHER_IDS, setOtherSatData, setLoadingOther, setErrorOther, setIsRefreshingOther, CACHE_KEY_OTHER, false);
  }, [fetchSatelliteData]);

  const handleRefreshFacsat = () => {
    if (loadingFacsat || isRefreshingFacsat) return;
    console.log(`FORCE REFRESH for ${CACHE_KEY_FACSAT}`);
    if (satellitesCache.current[CACHE_KEY_FACSAT]) {
      delete satellitesCache.current[CACHE_KEY_FACSAT];
      console.log(`Cleared cache for ${CACHE_KEY_FACSAT}`);
    }
    fetchSatelliteData(FACSAT_NORAD_IDS, setFacsatData, setLoadingFacsat, setErrorFacsat, setIsRefreshingFacsat, CACHE_KEY_FACSAT, true);
  };

  const handleRefreshOther = () => {
    if (loadingOther || isRefreshingOther) return;
    console.log(`FORCE REFRESH for ${CACHE_KEY_OTHER}`);
    if (satellitesCache.current[CACHE_KEY_OTHER]) {
      delete satellitesCache.current[CACHE_KEY_OTHER];
      console.log(`Cleared cache for ${CACHE_KEY_OTHER}`);
    }
    fetchSatelliteData(ALL_OTHER_IDS, setOtherSatData, setLoadingOther, setErrorOther, setIsRefreshingOther, CACHE_KEY_OTHER, true);
  };

  const renderSatelliteGrid = (satellites, isLoading, errorMsg, isRefreshingState, sectionTitleKeyForLoading) => {
    const showSectionLoader = isLoading && (!satellites || satellites.length === 0 || isRefreshingState);
    return (
      <>
        {showSectionLoader ? (
          <div className="flex justify-center items-center p-6 text-slate-500 dark:text-slate-400">
            <Loader size={20} className="animate-spin mr-2" /> 
            {t('page.loadingSection', {sectionTitleForLoading: t(sectionTitleKeyForLoading)})}
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-4 mb-4 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                <p className="font-semibold flex items-center justify-center"><AlertCircle size={18} className="mr-2"/> {t('page.errorTitle')}</p>
                <p className="text-sm">{errorMsg}</p>
                {satellites.length > 0 && <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">{t('page.someDataDisplayedBelow')}</p>}
              </div>
            )}
            {satellites.length === 0 && !errorMsg && !isLoading && (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4">{t('page.noSatellitesFound')}</p>
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
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
          <SatelliteIcon size={28} className="mr-3 text-blue-600 dark:text-blue-500" />
          {t('page.mainTitle')}
        </h1>
      </div>

      <section className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg shadow">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200 flex items-center">
            <ListChecks size={24} className="mr-3 text-indigo-600 dark:text-indigo-400" />
            {t('page.facsatSectionTitle')}
          </h2>
          <button
            onClick={handleRefreshFacsat}
            disabled={loadingFacsat || isRefreshingFacsat}
            className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition ease-in-out duration-150"
            aria-label={t('page.facsatRefreshAriaLabel')}
          >
            <RefreshCw size={14} className={`mr-1.5 ${isRefreshingFacsat ? 'animate-spin' : ''}`} />
            {isRefreshingFacsat ? t('page.refreshingButton') : t('page.refreshButton')}
          </button>
        </div>
        {renderSatelliteGrid(facsatData, loadingFacsat, errorFacsat, isRefreshingFacsat, "page.facsatSectionTitle")}
      </section>

      <section className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg shadow">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200 flex items-center">
            <ListChecks size={24} className="mr-3 text-teal-600 dark:text-teal-400" />
            {t('page.otherSectionTitle')}
          </h2>
          <button
            onClick={handleRefreshOther}
            disabled={loadingOther || isRefreshingOther}
            className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition ease-in-out duration-150"
            aria-label={t('page.otherRefreshAriaLabel')}
          >
            <RefreshCw size={14} className={`mr-1.5 ${isRefreshingOther ? 'animate-spin' : ''}`} />
            {isRefreshingOther ? t('page.refreshingButton') : t('page.refreshButton')}
          </button>
        </div>
        {renderSatelliteGrid(otherSatData, loadingOther, errorOther, isRefreshingOther, "page.otherSectionTitle")}
      </section>
    </div>
  );
}

export default SatellitesPage;
