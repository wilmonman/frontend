import React from 'react';
import { useTranslation } from 'react-i18next'; // <--- AÑADIR
import { MapPin, Radio, CheckCircle, XCircle, BarChart, Clock, Antenna, User, Tag, CloudLightning, Satellite, CalendarDays, Info as InfoIconLucide } from 'lucide-react';
import { ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Mover formatDate y formatFrequency DENTRO o hacer que t sea accesible
// Aquí las muevo dentro para simplicidad con el hook useTranslation

const GroundStationCard = ({ station }) => {
  const { t, i18n } = useTranslation('groundStation'); // <--- USAR NAMESPACE

  const formatDate = (dateString) => {
    if (!dateString) return t('card.dataNotAvailable');
    try {
      return new Date(dateString).toLocaleString(i18n.language, { // Usar idioma de i18next
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return t('card.invalidDate');
    }
  };

  const formatFrequency = (freq) => {
    if (!freq || isNaN(freq)) return t('card.dataNotAvailable');
    return (freq / 1_000_000).toFixed(1) + ' MHz';
  }

  // statusInfoMap se define aquí para usar t()
  const statusInfoMap = {
    Online: { label: t('card.status.online'), color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
    Offline: { label: t('card.status.offline'), color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
    Testing: { label: t('card.status.testing'), color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', icon: CloudLightning },
    Unknown: { label: t('card.status.unknown'), color: 'text-slate-500 dark:text-slate-400', bgColor: 'bg-slate-100 dark:bg-slate-700/30', icon: InfoIconLucide }
  };

  if (!station) {
    return (
      <div className="p-6 text-center text-slate-500 dark:text-slate-400 border border-dashed border-slate-300 dark:border-slate-600 rounded-lg animate-pulse">
        {t('card.waitingForData')}
      </div>
    );
  }

  const successRateData = [{ name: 'Success', value: station.success_rate || 0 }]; // 'Success' no es visible, no necesita t()
  const currentStatusConfig = statusInfoMap[station.status] || statusInfoMap.Unknown;
  const StatusIcon = currentStatusConfig.icon;
  const position = station.lat && station.lng ? [station.lat, station.lng] : null;

  const placeholderText = encodeURIComponent(t('card.imagePlaceholderText'));
  const placeholderImageUrl = `https://placehold.co/400x400/e2e8f0/94a3b8?text=${placeholderText}`;
  const satnogsBaseUrl = 'https://network.satnogs.org';
  let imageUrl = station.image
    ? (station.image.startsWith('/') ? `${satnogsBaseUrl}${station.image}` : station.image)
    : placeholderImageUrl;

  const handleImageError = (e) => {
    console.warn(`Fallo al cargar imagen de la estación: ${imageUrl}. Usando placeholder.`);
    e.target.onerror = null;
    e.target.src = placeholderImageUrl;
  };

  const stationNameOrDefault = station.name || t('card.unnamedStation');
  const imageAltText = t('card.imageAlt', { stationName: station.name || t('card.defaultStationName') });

  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 bg-slate-100 dark:bg-slate-700">
        <img
            src={imageUrl}
            alt={imageAltText}
            className="w-full h-48 md:h-full object-cover"
            onError={handleImageError}
            loading="lazy"
        />
      </div>
      <div className="flex-grow p-5 md:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="flex items-center mb-3 sm:mb-0">
            <Radio size={32} className="text-blue-600 dark:text-blue-500 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-50 mb-0.5">{stationNameOrDefault}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('page.stationIdLabel')}: {station.id}</p> {/* Reutilizando clave de page */}
            </div>
          </div>
          <div className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${currentStatusConfig.color} ${currentStatusConfig.bgColor} flex-shrink-0 mt-2 sm:mt-0`}>
            <StatusIcon size={16} className="mr-1.5" />
            {currentStatusConfig.label}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
            <div className="space-y-3 text-sm">
                <h3 className="text-base font-semibold text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-600 pb-1 mb-2">{t('card.detailsTitle')}</h3>
                <InfoItem icon={MapPin} label={t('card.locationLabel')} value={`${station.lat ? station.lat.toFixed(3) : t('card.dataNotAvailable')}, ${station.lng ? station.lng.toFixed(3) : t('card.dataNotAvailable')} (${station.qthlocator || t('card.dataNotAvailable')})`} />
                <InfoItem icon={Satellite} label={t('card.altitudeLabel')} value={`${station.altitude != null ? station.altitude + ' ' + t('card.altitudeUnit') : t('card.dataNotAvailable')}`} />
                <InfoItem icon={User} label={t('card.ownerLabel')} value={station.owner || t('card.dataNotAvailable')} />
                <InfoItem icon={Tag} label={t('card.clientVersionLabel')} value={station.client_version || t('card.dataNotAvailable')} />
                <InfoItem icon={CalendarDays} label={t('card.createdLabel')} value={formatDate(station.created)} />
                <InfoItem icon={Clock} label={t('card.lastSeenLabel')} value={formatDate(station.last_seen)} />
                {station.description && <InfoItem icon={InfoIconLucide} label={t('card.descriptionLabel')} value={station.description} className="pt-1"/>}
            </div>

            <div className="space-y-5">
                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                  <h3 className="text-base font-semibold mb-3 text-slate-600 dark:text-slate-300 flex items-center">
                      <BarChart size={16} className="mr-2 text-indigo-500"/> {t('card.performanceStatsTitle')}
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-4">
                      <div className="text-center">
                          <div style={{ width: '100px', height: 100 }}>
                            <ResponsiveContainer>
                                <RadialBarChart innerRadius="70%" outerRadius="100%" data={successRateData} startAngle={90} endAngle={-270}>
                                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                                  <RadialBar background={{ fill: 'rgba(100, 116, 139, 0.2)' }} dataKey="value" angleAxisId={0} fill="rgb(99, 102, 241)" cornerRadius={10} />
                                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold fill-current text-slate-700 dark:text-slate-200">
                                      {`${station.success_rate}%`}
                                  </text>
                                </RadialBarChart>
                            </ResponsiveContainer>
                          </div>
                          <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mt-1">{t('card.successRateLabel')}</p>
                      </div>
                      <div className="text-sm space-y-2 text-center sm:text-left">
                          <p className="font-medium text-slate-700 dark:text-slate-200">{t('card.observationsLabel')}</p>
                          <div className="flex items-center justify-center sm:justify-start">
                            <BarChart size={14} className="mr-1.5 text-slate-500 dark:text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-300">{t('card.totalLabel')}: <strong className="text-slate-800 dark:text-slate-100">{station.observations?.toLocaleString() ?? t('card.dataNotAvailable')}</strong></span>
                          </div>
                          <div className="flex items-center justify-center sm:justify-start">
                            <Clock size={14} className="mr-1.5 text-slate-500 dark:text-slate-400" />
                            <span className="text-slate-600 dark:text-slate-300">{t('card.futureLabel')}: <strong className="text-slate-800 dark:text-slate-100">{station.future_observations?.toLocaleString() ?? t('card.dataNotAvailable')}</strong></span>
                          </div>
                      </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
                  <h3 className="text-base font-semibold mb-3 text-slate-600 dark:text-slate-300 flex items-center">
                    <Antenna size={16} className="mr-2 text-teal-500"/> {t('card.antennaConfigTitle')}
                  </h3>
                  {station.antenna && station.antenna.length > 0 ? (
                    <ul className="space-y-2 text-sm">
                      {station.antenna.map((ant, index) => (
                        <li key={index} className="border-b border-slate-200/60 dark:border-slate-600/60 pb-1.5 last:border-b-0 last:pb-0">
                          <p className="font-medium text-slate-700 dark:text-slate-200">{ant.antenna_type_name} ({ant.band})</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                              {t('card.frequencyLabel')}: {formatFrequency(ant.frequency)} - {formatFrequency(ant.frequency_max)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('card.noAntennaInfo')}</p>
                  )}
                </div>
            </div>
        </div>

        {position && (
          <div className="pt-4">
              <h3 className="text-base font-semibold text-slate-600 dark:text-slate-300 mb-2 flex items-center">
                <MapPin size={16} className="mr-2 text-rose-500"/> {t('card.locationMapTitle')}
              </h3>
            <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 h-80 shadow-inner">
              <MapContainer center={position} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }} className="z-0">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    {station.name || t('card.unnamedStation')} <br /> {station.lat}, {station.lng}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-start ${className}`}>
    <Icon size={16} className="text-blue-500 dark:text-blue-400 mr-2.5 mt-0.5 flex-shrink-0" />
    <div>
      <span className="font-medium text-sm text-slate-600 dark:text-slate-300">{label}:</span>{' '}
      <span className="text-sm text-slate-800 dark:text-slate-100 break-all">{value}</span>
    </div>
  </div>
);

export default GroundStationCard; 
