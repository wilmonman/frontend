// src/pages/ContactPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next'; // Ya importado
import { MapPin, Building, School, ExternalLink, Phone, Mail } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// Asegúrate de que el CSS de Leaflet se importe globalmente en tu app
// ej., import 'leaflet/dist/leaflet.css'; en App.js o index.js

function ContactPage() {
  const { t } = useTranslation('contact'); // Usar el namespace 'contact'

  // --- Data (URLs e información no textual) ---
  const uisImageUrl = "https://placehold.co/600x400/475569/FFFFFF?text=UIS+Campus";
  const eisiImageUrl = "https://placehold.co/600x400/10B981/FFFFFF?text=EISI-E3T+Building";

  const uisPhoneNumber = "+57 (607) 6344000";
  const eisiPhoneNumber = "+57 (607) 6344000 Ext. 2316"; // Los números de teléfono generalmente no se traducen
  const uisEmail = "correinstitucional@uis.edu.co";
  const eisiEmail = "eisi@uis.edu.co"; // Los correos electrónicos generalmente no se traducen

  const uisCoordinates = [7.1383, -73.1227];
  const mapZoomLevel = 15;
  // El enlace de Google Maps podría ser diferente por región si es muy específico, pero uno general funciona bien.
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${uisCoordinates[0]},${uisCoordinates[1]}`;


  return (
    <div className="text-slate-800 dark:text-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            {t('mainTitle')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-4xl mx-auto">
            {t('subTitle')}
          </p>
        </section>

        <section className="mb-12 md:mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* University (UIS) Card */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col group hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-full h-52 overflow-hidden">
                  <img
                    src={uisImageUrl}
                    alt={t('uis.alt')}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/94A3B8/FFFFFF?text=${encodeURIComponent(t('imageUnavailable.uis'))}`; }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-3 rounded-full mr-4">
                      <Building size={24} strokeWidth={2} />
                    </div>
                    <h2 className="text-xl font-semibold text-indigo-800 dark:text-indigo-300">{t('uis.title')}</h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-5 leading-relaxed text-sm">
                    {t('uis.description')}
                  </p>
                  <div className="space-y-3 text-sm mb-5">
                    <div className="flex items-center text-slate-700 dark:text-slate-200">
                      <Phone size={18} className="mr-3 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                      <span>{uisPhoneNumber}</span>
                    </div>
                    <div className="flex items-center text-slate-700 dark:text-slate-200">
                      <Mail size={18} className="mr-3 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                      <a href={`mailto:${uisEmail}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline">{uisEmail}</a>
                    </div>
                  </div>
                  <a
                    href="https://uis.edu.co/es/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors duration-200 group mt-auto text-sm font-medium"
                  >
                    <ExternalLink size={16} className="mr-1.5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
                    <span>{t('uis.websiteLink')}</span>
                  </a>
                </div>
              </div>

              {/* School (EISI) Card */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col group hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-full h-52 overflow-hidden">
                  <img
                    src={eisiImageUrl}
                    alt={t('eisi.alt')}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/94A3B8/FFFFFF?text=${encodeURIComponent(t('imageUnavailable.eisi'))}`; }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full mr-4">
                      <School size={24} strokeWidth={2} />
                    </div>
                    <h2 className="text-xl font-semibold text-green-800 dark:text-green-300">{t('eisi.title')}</h2>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-5 leading-relaxed text-sm">
                    {t('eisi.description')}
                  </p>
                  <div className="space-y-3 text-sm mb-5">
                      <div className="flex items-center text-slate-700 dark:text-slate-200">
                        <Phone size={18} className="mr-3 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                        <span>{eisiPhoneNumber}</span>
                      </div>
                      <div className="flex items-center text-slate-700 dark:text-slate-200">
                        <Mail size={18} className="mr-3 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                        <a href={`mailto:${eisiEmail}`} className="hover:text-green-600 dark:hover:text-green-400 hover:underline">{eisiEmail}</a>
                      </div>
                  </div>
                  <a
                    href="https://e3t.uis.edu.co/eisi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition-colors duration-200 group mt-auto text-sm font-medium"
                  >
                    <ExternalLink size={16} className="mr-1.5 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
                    <span>{t('eisi.websiteLink')}</span>
                  </a>
                </div>
              </div>

            </div>
        </section>

        <section className="p-6 md:p-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 shadow border border-slate-100 dark:border-slate-700 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center justify-center">
            <MapPin size={28} className="mr-3 text-red-600 dark:text-red-500" />
             {t('location.title')}
          </h2>
          <div className="text-slate-700 dark:text-slate-200 mb-1">
            <span>{t('location.address1')}</span>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            <p>{t('location.address2')}</p>
          </div>

          <div className="h-80 w-full max-w-4xl mx-auto rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 shadow-inner mb-6">
             <MapContainer
                center={uisCoordinates}
                zoom={mapZoomLevel}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
             >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={uisCoordinates}>
                  <Popup>
                    <div dangerouslySetInnerHTML={{ __html: t('location.mapPopup') }} />
                  </Popup>
                </Marker>
             </MapContainer>
          </div>

           <div className="mt-6">
             <a
               href={googleMapsLink}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center justify-center px-5 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition duration-300 shadow-sm"
             >
               {t('location.mapButton')}
               <ExternalLink size={16} className="ml-2" />
             </a>
           </div>
        </section>

      </div>
    </div>
  );
}

export default ContactPage;
