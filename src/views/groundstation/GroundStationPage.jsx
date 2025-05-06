// src/views/groundstation/GroundStationPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw } from 'lucide-react';

// Importar la utilidad fetch
import { fetchWithRetry } from "../../api/ApiClient"; // Ajusta la ruta según sea necesario

// Importar el componente de la tarjeta
import GroundStationCard from "./components/GroundStationCard"; // Ajusta la ruta según sea necesario

// --- Configuración ---
const STATIONS_API_BASE_URL = "https://uisstation.netlify.app/api/network/stations";
const TARGET_STATION_ID = 810;
const LOCAL_STORAGE_BASE_KEY = "groundStationData_";
// --- Fin Configuración ---

function GroundStationPage() {
  const [stationData, setStationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pageVisible, setPageVisible] = useState(false); // Estado para la animación

  const localStorageKey = `${LOCAL_STORAGE_BASE_KEY}${TARGET_STATION_ID}`;

  const fetchAndCacheStationData = useCallback(async (isManualRefresh = false) => {
    setError(null);

    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      if (!localStorage.getItem(localStorageKey)) {
        setLoading(true);
      }
    }

    try {
      console.log(`Consultando datos de la estación para ID fijo: ${TARGET_STATION_ID}... (Actualización Manual: ${isManualRefresh})`);
      const queryParams = { id: TARGET_STATION_ID };
    
      const { data: stationDataArray } = await fetchWithRetry(STATIONS_API_BASE_URL, queryParams);
    
      if (Array.isArray(stationDataArray) && stationDataArray.length === 1) {
        const theStation = stationDataArray[0];
        localStorage.setItem(localStorageKey, JSON.stringify(theStation));
        setStationData(theStation);
        console.log(`Datos de la estación para ID ${TARGET_STATION_ID} obtenidos y cacheados:`, theStation);
      } else if (Array.isArray(stationDataArray) && stationDataArray.length === 0) {
        setError(`No se encontró ninguna estación con el ID: ${TARGET_STATION_ID}`);
        setStationData(null);
        localStorage.removeItem(localStorageKey);
      } else {
        console.error("Formato de datos o longitud del array inesperados desde la API. stationDataArray:", stationDataArray);
        setError("Formato de datos inválido o número inesperado de estaciones recibidas.");
        setStationData(null);
        localStorage.removeItem(localStorageKey);
      }
    } catch (e) {
      console.error(`Fallo al obtener datos de la estación para ID ${TARGET_STATION_ID}:`, e);
      setError(`Fallo al cargar datos de la estación: ${e.message}`);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [localStorageKey]);

  useEffect(() => {
    console.log(`GroundStationPage montado para ID fijo: ${TARGET_STATION_ID}. Verificando caché...`);
    const cachedDataString = localStorage.getItem(localStorageKey);

    if (cachedDataString) {
      try {
        const cachedStation = JSON.parse(cachedDataString);
        setStationData(cachedStation);
        setLoading(false);
        console.log(`Datos de la estación para ID ${TARGET_STATION_ID} cargados desde caché:`, cachedStation);
      } catch (e) {
        console.error(`Fallo al parsear datos cacheados para ID ${TARGET_STATION_ID}:`, e);
        localStorage.removeItem(localStorageKey);
        fetchAndCacheStationData(false);
      }
    } else {
      console.log(`No hay datos en caché para ID ${TARGET_STATION_ID}. Obteniendo datos iniciales...`);
      fetchAndCacheStationData(false);
    }
  }, [localStorageKey, fetchAndCacheStationData]);

  // Efecto para la animación de entrada de la página
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageVisible(true);
    }, 50); // Pequeño retraso para asegurar que los estilos iniciales se apliquen
    return () => clearTimeout(timer);
  }, []);

  const animatedPageClasses = "transition-all duration-700 ease-out transform";

  if (loading && !stationData && !error) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
        Cargando datos de la Estación Terrena para ID: {TARGET_STATION_ID}...
      </div>
    );
  }

  const showProminentError = error && !isRefreshing;

  return (
    <div 
      className={`p-4 md:p-6 space-y-4 ${animatedPageClasses} ${
        pageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
          Panel de Estación Terrena <span className="text-lg font-normal text-slate-500 dark:text-slate-400">(ID: {TARGET_STATION_ID})</span>
        </h1>
        <button
          onClick={() => fetchAndCacheStationData(true)}
          disabled={isRefreshing || loading}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
          aria-label="Actualizar datos de la estación"
        >
          <RefreshCw size={16} className={`mr-2 ${(isRefreshing || (loading && !stationData)) ? 'animate-spin' : ''}`} />
          {(isRefreshing || (loading && !stationData)) ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      {showProminentError && (
        <div className="p-6 text-center text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-lg">
          <p className="font-semibold">Error al cargar datos para la Estación ID {TARGET_STATION_ID}:</p>
          <p>{error}</p>
          {stationData && <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">Mostrando los últimos datos conocidos.</p>}
        </div>
      )}

      {error && isRefreshing && stationData && (
        <div className="p-3 text-sm text-center text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-lg">
          <strong>Falló la actualización:</strong> {error}. Mostrando últimos datos cargados.
        </div>
      )}

      {stationData ? (
        <GroundStationCard station={stationData} />
      ) : (
        !loading && !showProminentError && (
          <div className="p-6 text-center text-slate-500 dark:text-slate-400">
            No hay información disponible para la Estación ID: {TARGET_STATION_ID}.
          </div>
        )
      )}
    </div>
  );
}

export default GroundStationPage;
