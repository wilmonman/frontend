import React, { useState, useEffect, useCallback, useRef } from "react";
import { Image as ImageIconOrg, AlertCircle, Loader, ChevronLeft, ChevronRight, CloudOff, User as UserIcon, Users as UsersIcon, RefreshCw, X as XIcon } from 'lucide-react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useTranslation } from 'react-i18next'; // <--- AÑADIR

import { fetchWithRetry } from "../../api/ApiClient";
import ImageCard from "./components/ImagesCard";

const OBSERVATIONS_API_BASE_URL = "https://uisstation.netlify.app/api/network/observations";
const MY_STATION_ID = 810;
const TARGET_NORAD_ID = 33591;
const TARGET_VETTED_STATUS_STRING = "good";
const TARGET_TRANSMITTER_MODE = "APT";

const CACHE_KEY_MY_STATION_IMAGES = `my_station_${MY_STATION_ID}_noaa${TARGET_NORAD_ID}_apt_images`;
const CACHE_KEY_OTHER_STATIONS_IMAGES_PREFIX = `other_stations_noaa${TARGET_NORAD_ID}_apt_images_cursor_`;

// Mover formatDate dentro del componente o pasar 't'
// Aquí se moverá dentro para usar el hook useTranslation

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
            const cursor = url.searchParams.get('cursor');
            if (cursor && (rel === 'next' || rel === 'prev')) links[rel] = cursor;
        }
    });
    return links;
};

function ImagesPage() {
  const { t, i18n } = useTranslation('images'); // <--- USAR NAMESPACE

  const formatDate = useCallback((dateString) => { // useCallback para evitar redefiniciones innecesarias
    if (!dateString) return t('common.dataNotAvailable');
    try {
      return new Date(dateString).toLocaleString(i18n.language, { // Usar i18n.language
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return t('common.invalidDate');
    }
  }, [t, i18n.language]);

  const [myStationObservations, setMyStationObservations] = useState([]);
  const [myStationLoading, setMyStationLoading] = useState(true);
  const [myStationError, setMyStationError] = useState(null);
  const [isRefreshingMyStation, setIsRefreshingMyStation] = useState(false);

  const [otherObservations, setOtherObservations] = useState([]);
  const [otherLoading, setOtherLoading] = useState(true);
  const [otherError, setOtherError] = useState(null);
  const [isRefreshingOtherStations, setIsRefreshingOtherStations] = useState(false);
  const [otherNextCursor, setOtherNextCursor] = useState(null);
  const [otherPrevCursor, setOtherPrevCursor] = useState(null);
  const [otherCurrentCursor, setOtherCurrentCursor] = useState(null);

  const imagesCache = useRef({});

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState('');
  const [lightboxImageAlt, setLightboxImageAlt] = useState('');

  const openLightbox = (imageUrl, altText) => { // altText vendrá traducido desde ImageCard
    setLightboxImageUrl(imageUrl);
    setLightboxImageAlt(altText || t('page.lightboxDefaultAlt'));
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImageUrl('');
    setLightboxImageAlt('');
  };

  const filterValidImageData = (observations) => {
    return observations.filter(obs =>
      obs.demoddata &&
      Array.isArray(obs.demoddata) &&
      obs.demoddata.length > 0 &&
      obs.demoddata[0].payload_demod
    );
  };

  const fetchMyStationData = useCallback(async (isManualRefresh = false) => {
    const cacheKey = CACHE_KEY_MY_STATION_IMAGES;
    setMyStationError(null);
    if (isManualRefresh) {
      setIsRefreshingMyStation(true);
      setMyStationLoading(true);
    } else {
      if (imagesCache.current[cacheKey]) {
        setMyStationObservations(imagesCache.current[cacheKey]);
        setMyStationLoading(false);
        setIsRefreshingMyStation(false);
        return;
      }
      setMyStationLoading(true);
      setIsRefreshingMyStation(false);
    }
    try {
      const queryParams = { /* ... */ }; // Sin cambios en queryParams
        // ... (lógica de fetch sin cambios, excepto mensajes de error)
        // Dentro del fetch, cuando se setea el error:
        // throw new Error(t('page.errorInvalidDataMyStation'));
        // } catch (e) {
        //  setMyStationError(t('page.errorLoading', { message: e.message }));
        // ...
        // --- (Esto es solo un ejemplo, la lógica de fetch es larga y se omite por brevedad) ---
        // --- Asegúrate de que todos los setError usen t() ---
      const { data: fetchedData } = await fetchWithRetry(OBSERVATIONS_API_BASE_URL, {
        ground_station: MY_STATION_ID,
        satellite__norad_cat_id: TARGET_NORAD_ID,
        vetted_status: TARGET_VETTED_STATUS_STRING,
        transmitter_mode: TARGET_TRANSMITTER_MODE,
        ordering: '-start',
      });
      if (Array.isArray(fetchedData)) {
        let validImages = filterValidImageData(fetchedData);
        validImages.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
        setMyStationObservations(validImages);
        imagesCache.current[cacheKey] = validImages;
      } else {
        throw new Error(t('page.errorInvalidDataMyStation'));
      }
    } catch (e) {
      setMyStationError(t('page.errorLoading', { message: e.message }));
      setMyStationObservations([]);
    } finally {
      setMyStationLoading(false);
      setIsRefreshingMyStation(false);
    }
  }, [t]); // <-- AÑADIR t

  const fetchOtherStationsData = useCallback(async (cursor = null, isManualRefresh = false) => {
    const cacheKey = `${CACHE_KEY_OTHER_STATIONS_IMAGES_PREFIX}${cursor || 'initial'}`;
    setOtherError(null);
    if (isManualRefresh) {
      setIsRefreshingOtherStations(true);
      setOtherLoading(true);
    } else {
      if (imagesCache.current[cacheKey]) { /* ... */ } // Lógica de caché sin cambios
      setOtherLoading(true);
      setIsRefreshingOtherStations(false);
    }
    try {
      const queryParams = { /* ... */ }; // Sin cambios en queryParams
      // ... (lógica de fetch sin cambios, excepto mensajes de error)
      // Dentro del fetch, cuando se setea el error:
      // throw new Error(t('page.errorInvalidDataOtherStations'));
      // } catch (e) {
      //  setOtherError(t('page.errorLoading', { message: e.message }));
      // ...
      // --- (Esto es solo un ejemplo, la lógica de fetch es larga y se omite por brevedad) ---
      // --- Asegúrate de que todos los setError usen t() ---
      const { data: fetchedData, headers } = await fetchWithRetry(OBSERVATIONS_API_BASE_URL, {
        satellite__norad_cat_id: TARGET_NORAD_ID,
        vetted_status: TARGET_VETTED_STATUS_STRING,
        transmitter_mode: TARGET_TRANSMITTER_MODE,
        ordering: '-start',
        ...(cursor && { cursor }),
      });
      if (Array.isArray(fetchedData)) {
        let validImages = filterValidImageData(fetchedData);
        validImages.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
        const linkHeader = headers.get('Link');
        const links = parseLinkHeader(linkHeader);
        setOtherObservations(validImages);
        setOtherNextCursor(links.next);
        setOtherPrevCursor(links.prev);
        imagesCache.current[cacheKey] = { observations: validImages, nextCursor: links.next, prevCursor: links.prev };
      } else {
        throw new Error(t('page.errorInvalidDataOtherStations'));
      }
    } catch (e) {
      setOtherError(t('page.errorLoading', { message: e.message }));
      setOtherObservations([]);
      setOtherNextCursor(null);
      setOtherPrevCursor(null);
    } finally {
      setOtherLoading(false);
      setIsRefreshingOtherStations(false);
    }
  }, [t]); // <-- AÑADIR t

  useEffect(() => {
    fetchMyStationData(false);
    setOtherCurrentCursor(null);
    fetchOtherStationsData(null, false);
  }, [fetchMyStationData, fetchOtherStationsData]);

  const handleRefreshMyStation = () => { /* ... */ }; // Sin cambios de i18n
  const handleRefreshOtherStations = () => { /* ... */ }; // Sin cambios de i18n
  const handleOtherNextPage = () => { /* ... */ }; // Sin cambios de i18n
  const handleOtherPrevPage = () => { /* ... */ }; // Sin cambios de i18n

  const renderGridSection = (
    titleKey, // Cambiado a clave de traducción
    icon,
    observations,
    isLoading,
    errorMsg,
    isRefreshingState,
    onRefreshHandler,
    gridColsClass = "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
    sectionKey
  ) => (
    <section key={sectionKey} className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg shadow">
      <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
        <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200 flex items-center">
          {React.createElement(icon, { size: 24, className: "mr-3 text-blue-600 dark:text-blue-500" })}
          {t(titleKey)} {/* Usar t() con la clave */}
        </h2>
        <button
          onClick={onRefreshHandler}
          disabled={isLoading || isRefreshingState}
          className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition ease-in-out duration-150"
          aria-label={t(sectionKey === "myStationCarousel" ? 'page.myStationRefreshAriaLabel' : 'page.otherStationsRefreshAriaLabel')}
        >
          <RefreshCw size={14} className={`mr-1.5 ${isRefreshingState ? 'animate-spin' : ''}`} />
          {isRefreshingState ? t('page.refreshingButton') : t('page.refreshButton')}
        </button>
      </div>
      {(isLoading && (!observations || observations.length === 0 || isRefreshingState)) ? (
        <div className="flex justify-center items-center p-6 text-slate-500 dark:text-slate-400">
          <Loader size={20} className="animate-spin mr-2" /> {t('page.loadingImages')}
        </div>
      ) : (
        <>
          {errorMsg && (
            <div className="p-4 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="font-semibold flex items-center justify-center"><AlertCircle size={18} className="mr-2"/> {t('page.errorTitle')}</p>
              <p className="text-sm">{errorMsg}</p>
              {observations.length > 0 && <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">{t('page.someDataDisplayedBelow')}</p>}
            </div>
          )}
          {!errorMsg && observations.length === 0 && (
            <div className="text-center p-6 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex flex-col items-center">
              <CloudOff size={28} className="mb-2 text-slate-400 dark:text-slate-500" />
              {sectionKey === "myStationCarousel" ? t('page.myStationNoImages') : t('page.otherStationsNoImages')}
            </div>
          )}
          {observations.length > 0 && (
            <div className={`grid grid-cols-1 ${gridColsClass} gap-4`}>
              {observations.map((obs) => (
                <ImageCard key={obs.id} observation={obs} onImageClick={openLightbox} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );

  return (
    <>
      <div className="p-4 md:p-6 space-y-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <ImageIconOrg size={28} className="mr-3 text-blue-600 dark:text-blue-500" />
            {t('page.mainTitle')}
          </h1>
        </div>

        <section key="myStationCarousel" className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg shadow">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200 flex items-center">
              <UserIcon size={24} className="mr-3 text-blue-600 dark:text-blue-500" />
              {t('page.myStationSectionTitle', { stationId: MY_STATION_ID })}
            </h2>
            <button
              onClick={handleRefreshMyStation}
              disabled={myStationLoading || isRefreshingMyStation}
              className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition ease-in-out duration-150"
              aria-label={t('page.myStationRefreshAriaLabel')}
            >
              <RefreshCw size={14} className={`mr-1.5 ${isRefreshingMyStation ? 'animate-spin' : ''}`} />
              {isRefreshingMyStation ? t('page.refreshingButton') : t('page.refreshButton')}
            </button>
          </div>

          {(myStationLoading && !isRefreshingMyStation && myStationObservations.length === 0) ? (
            <div className="flex justify-center items-center p-6 text-slate-500 dark:text-slate-400">
              <Loader size={20} className="animate-spin mr-2" /> {t('page.loadingImages')}
            </div>
          ) : !myStationLoading && myStationError ? (
            <div className="p-4 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="font-semibold flex items-center justify-center"><AlertCircle size={18} className="mr-2"/> {t('page.errorTitle')}</p>
              <p className="text-sm">{myStationError}</p>
            </div>
          ) : !myStationLoading && !myStationError && myStationObservations.length > 0 ? (
            <Carousel
              showArrows={true} showStatus={false} showThumbs={false}
              infiniteLoop={myStationObservations.length > 1}
              useKeyboardArrows={true} autoPlay={true} interval={5000} stopOnHover={true}
              className="my-station-image-carousel rounded-lg overflow-hidden bg-black/50 dark:bg-black/70"
            >
              {myStationObservations.map((obs) => {
                const imgUrl = obs.demoddata[0].payload_demod;
                const altText = t('card.imageAltText', { satelliteName: (obs.tle0 || t('card.unknownSatellite')), obsId: obs.id });
                return (
                  <div key={obs.id} onClick={() => openLightbox(imgUrl, altText)} className="cursor-pointer">
                    <img src={imgUrl} alt={altText} className="max-h-[70vh] w-auto object-contain mx-auto" />
                    <p className="legend bg-black/50 text-white p-1 text-xs">
                      {t('card.observedLabel')}: {formatDate(obs.start)}
                    </p>
                  </div>
                );
              })}
            </Carousel>
          ) : (
            !myStationLoading && !myStationError && myStationObservations.length === 0 && (
              <div className="text-center p-6 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                <CloudOff size={28} className="mb-2 text-slate-400 dark:text-slate-500" />
                {t('page.myStationNoImages')}
              </div>
            )
          )}
        </section>

        {renderGridSection(
          "page.otherStationsSectionTitle", // Clave de traducción para el título
          UsersIcon,
          otherObservations,
          otherLoading,
          otherError,
          isRefreshingOtherStations,
          handleRefreshOtherStations,
          "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
          "otherStationsGrid"
        )}

        {!otherLoading && !isRefreshingOtherStations && !otherError && (otherPrevCursor || otherNextCursor) && (
          <div className="flex justify-center items-center space-x-4 pt-4 border-t border-slate-200 dark:border-slate-700 mt-6">
            <button
              onClick={handleOtherPrevPage}
              disabled={!otherPrevCursor || otherLoading || isRefreshingOtherStations}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
              aria-label={t('page.prevPageAriaLabel')}
            >
              <ChevronLeft size={16} className="mr-1" /> {t('page.prevPageButton')}
            </button>
            <button
              onClick={handleOtherNextPage}
              disabled={!otherNextCursor || otherLoading || isRefreshingOtherStations}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
              aria-label={t('page.nextPageAriaLabel')}
            >
              {t('page.nextPageButton')} <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div className="relative max-w-[95vw] max-h-[95vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={lightboxImageUrl}
              alt={lightboxImageAlt}
              className="block max-w-full max-h-full object-contain shadow-2xl rounded-md"
            />
            <button
              onClick={closeLightbox}
              className="absolute -top-2 -right-2 mt-2 mr-2 text-white bg-slate-700 hover:bg-slate-600 rounded-full p-1.5 shadow-lg"
              aria-label={t('page.lightboxCloseAriaLabel')}
            >
              <XIcon size={20} />
            </button>
              {lightboxImageAlt && <p className="text-center text-xs text-slate-300 mt-2 p-1 bg-black/50 rounded-b-md">{lightboxImageAlt}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default ImagesPage;
