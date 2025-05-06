import React, { useState, useEffect, useCallback, useRef } from "react";
import { Image as ImageIconOrg, AlertCircle, Loader, ChevronLeft, ChevronRight, CloudOff, User as UserIcon, Users as UsersIcon, RefreshCw, X as XIcon } from 'lucide-react'; // Added XIcon for close
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { fetchWithRetry } from "../../api/ApiClient";
import ImageCard from "./components/ImagesCard";

// --- Configuration ---
const OBSERVATIONS_API_BASE_URL = "https://uisstation.netlify.app/api/network/observations";
const MY_STATION_ID = 810;
const TARGET_NORAD_ID = 33591; // NOAA 19
const TARGET_VETTED_STATUS_STRING = "good";
const TARGET_TRANSMITTER_MODE = "APT";

const CACHE_KEY_MY_STATION_IMAGES = `my_station_${MY_STATION_ID}_noaa${TARGET_NORAD_ID}_apt_images`;
const CACHE_KEY_OTHER_STATIONS_IMAGES_PREFIX = `other_stations_noaa${TARGET_NORAD_ID}_apt_images_cursor_`;

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

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

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState('');
  const [lightboxImageAlt, setLightboxImageAlt] = useState('');


  const openLightbox = (imageUrl, altText = "Enlarged satellite image") => {
    setLightboxImageUrl(imageUrl);
    setLightboxImageAlt(altText);
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
      const queryParams = {
        ground_station: MY_STATION_ID,
        satellite__norad_cat_id: TARGET_NORAD_ID,
        vetted_status: TARGET_VETTED_STATUS_STRING,
        transmitter_mode: TARGET_TRANSMITTER_MODE,
        ordering: '-start',
      };
      const { data: fetchedData } = await fetchWithRetry(OBSERVATIONS_API_BASE_URL, queryParams);

      if (Array.isArray(fetchedData)) {
        let validImages = filterValidImageData(fetchedData);
        validImages.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
        setMyStationObservations(validImages);
        imagesCache.current[cacheKey] = validImages;
      } else {
        throw new Error("Invalid data format received for my station.");
      }
    } catch (e) {
      setMyStationError(`Failed to load images: ${e.message}`);
      setMyStationObservations([]);
    } finally {
      setMyStationLoading(false);
      setIsRefreshingMyStation(false);
    }
  }, []);

  const fetchOtherStationsData = useCallback(async (cursor = null, isManualRefresh = false) => {
    const cacheKey = `${CACHE_KEY_OTHER_STATIONS_IMAGES_PREFIX}${cursor || 'initial'}`;
    setOtherError(null);

    if (isManualRefresh) {
      setIsRefreshingOtherStations(true);
      setOtherLoading(true);
    } else {
      if (imagesCache.current[cacheKey]) {
        const cachedPageData = imagesCache.current[cacheKey];
        setOtherObservations(cachedPageData.observations);
        setOtherNextCursor(cachedPageData.nextCursor);
        setOtherPrevCursor(cachedPageData.prevCursor);
        setOtherLoading(false);
        setIsRefreshingOtherStations(false);
        return;
      }
      setOtherLoading(true);
      setIsRefreshingOtherStations(false);
    }

    try {
      const queryParams = {
        satellite__norad_cat_id: TARGET_NORAD_ID,
        vetted_status: TARGET_VETTED_STATUS_STRING,
        transmitter_mode: TARGET_TRANSMITTER_MODE,
        ordering: '-start',
      };
      if (cursor) queryParams.cursor = cursor;

      const { data: fetchedData, headers } = await fetchWithRetry(OBSERVATIONS_API_BASE_URL, queryParams);

      if (Array.isArray(fetchedData)) {
        let validImages = filterValidImageData(fetchedData);
        validImages.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
        
        const linkHeader = headers.get('Link');
        const links = parseLinkHeader(linkHeader);

        setOtherObservations(validImages);
        setOtherNextCursor(links.next);
        setOtherPrevCursor(links.prev);

        imagesCache.current[cacheKey] = {
          observations: validImages,
          nextCursor: links.next,
          prevCursor: links.prev,
        };
      } else {
        throw new Error("Invalid data format received for other stations.");
      }
    } catch (e) {
      setOtherError(`Failed to load images: ${e.message}`);
      setOtherObservations([]);
      setOtherNextCursor(null);
      setOtherPrevCursor(null);
    } finally {
      setOtherLoading(false);
      setIsRefreshingOtherStations(false);
    }
  }, []);

  useEffect(() => {
    fetchMyStationData(false);
    setOtherCurrentCursor(null);
    fetchOtherStationsData(null, false);
  }, [fetchMyStationData, fetchOtherStationsData]);

  const handleRefreshMyStation = () => {
    if (myStationLoading || isRefreshingMyStation) return;
    if (imagesCache.current[CACHE_KEY_MY_STATION_IMAGES]) {
      delete imagesCache.current[CACHE_KEY_MY_STATION_IMAGES];
    }
    fetchMyStationData(true);
  };

  const handleRefreshOtherStations = () => {
    if (otherLoading || isRefreshingOtherStations) return;
    const cacheKeyToClear = `${CACHE_KEY_OTHER_STATIONS_IMAGES_PREFIX}${otherCurrentCursor || 'initial'}`;
    if (imagesCache.current[cacheKeyToClear]) {
      delete imagesCache.current[cacheKeyToClear];
    }
    fetchOtherStationsData(otherCurrentCursor, true);
  };

  const handleOtherNextPage = () => {
    if (otherNextCursor && !otherLoading && !isRefreshingOtherStations) {
      setOtherCurrentCursor(otherNextCursor);
      fetchOtherStationsData(otherNextCursor, false);
    }
  };

  const handleOtherPrevPage = () => {
    if (otherPrevCursor && !otherLoading && !isRefreshingOtherStations) {
      setOtherCurrentCursor(otherPrevCursor);
      fetchOtherStationsData(otherPrevCursor, false);
    }
  };

  const renderGridSection = (
    title,
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
          {title}
        </h2>
        <button
          onClick={onRefreshHandler}
          disabled={isLoading || isRefreshingState}
          className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition ease-in-out duration-150"
          aria-label={`Refresh ${title} images`}
        >
          <RefreshCw size={14} className={`mr-1.5 ${isRefreshingState ? 'animate-spin' : ''}`} />
          {isRefreshingState ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {(isLoading && (!observations || observations.length === 0 || isRefreshingState)) ? (
        <div className="flex justify-center items-center p-6 text-slate-500 dark:text-slate-400">
          <Loader size={20} className="animate-spin mr-2" /> Loading images...
        </div>
      ) : (
        <>
          {errorMsg && (
            <div className="p-4 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="font-semibold flex items-center justify-center"><AlertCircle size={18} className="mr-2"/> Error:</p>
              <p className="text-sm">{errorMsg}</p>
              {observations.length > 0 && <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">(Some data might be displayed below)</p>}
            </div>
          )}
          {!errorMsg && observations.length === 0 && (
            <div className="text-center p-6 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex flex-col items-center">
              <CloudOff size={28} className="mb-2 text-slate-400 dark:text-slate-500" />
              No relevant images found in this section.
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
    <> {/* Use Fragment to wrap page content and lightbox */}
      <div className="p-4 md:p-6 space-y-8">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
            <ImageIconOrg size={28} className="mr-3 text-blue-600 dark:text-blue-500" />
            NOAA 19 APT Images
          </h1>
        </div>

        <section key="myStationCarousel" className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-lg shadow">
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-200 flex items-center">
              <UserIcon size={24} className="mr-3 text-blue-600 dark:text-blue-500" />
              My Station ({MY_STATION_ID}) - Latest Images
            </h2>
            <button
              onClick={handleRefreshMyStation}
              disabled={myStationLoading || isRefreshingMyStation}
              className="inline-flex items-center px-2.5 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition ease-in-out duration-150"
              aria-label="Refresh My Station images"
            >
              <RefreshCw size={14} className={`mr-1.5 ${isRefreshingMyStation ? 'animate-spin' : ''}`} />
              {isRefreshingMyStation ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {(myStationLoading && !isRefreshingMyStation && myStationObservations.length === 0) ? (
            <div className="flex justify-center items-center p-6 text-slate-500 dark:text-slate-400">
              <Loader size={20} className="animate-spin mr-2" /> Loading images...
            </div>
          ) : !myStationLoading && myStationError ? (
            <div className="p-4 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="font-semibold flex items-center justify-center"><AlertCircle size={18} className="mr-2"/> Error:</p>
              <p className="text-sm">{myStationError}</p>
            </div>
          ) : !myStationLoading && !myStationError && myStationObservations.length > 0 ? (
            <Carousel
              showArrows={true}
              showStatus={false} // Usually cleaner without status for auto-playing images
              showThumbs={false}
              infiniteLoop={myStationObservations.length > 1}
              useKeyboardArrows={true}
              autoPlay={true} // Enable auto-advance
              interval={5000} // Interval in ms (e.g., 5 seconds)
              stopOnHover={true} // Pause auto-play on hover
              className="my-station-image-carousel rounded-lg overflow-hidden bg-black/50 dark:bg-black/70"
            >
              {myStationObservations.map((obs) => {
                const imgUrl = obs.demoddata[0].payload_demod;
                const altText = `NOAA 19 APT from Obs ID ${obs.id} - My Station`;
                return (
                  <div key={obs.id} onClick={() => openLightbox(imgUrl, altText)} className="cursor-pointer">
                    <img
                      src={imgUrl}
                      alt={altText}
                      className="max-h-[70vh] w-auto object-contain mx-auto"
                    />
                    <p className="legend bg-black/50 text-white p-1 text-xs">
                      Observed: {formatDate(obs.start)}
                    </p>
                  </div>
                );
              })}
            </Carousel>
          ) : (
            !myStationLoading && !myStationError && myStationObservations.length === 0 && (
              <div className="text-center p-6 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700 flex flex-col items-center">
                <CloudOff size={28} className="mb-2 text-slate-400 dark:text-slate-500" />
                No relevant images found for your station.
              </div>
            )
          )}
        </section>

        {renderGridSection(
          "Other Stations - NOAA 19 APT Images",
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
              aria-label="Previous page (Other Stations)"
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </button>
            <button
              onClick={handleOtherNextPage}
              disabled={!otherNextCursor || otherLoading || isRefreshingOtherStations}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
              aria-label="Next page (Other Stations)"
            >
              Next <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[1000] p-4 backdrop-blur-sm" // Increased z-index
          onClick={closeLightbox} // Close on backdrop click
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
              aria-label="Close lightbox"
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
