// src/views/PrivacyPage.jsx
import React from 'react';
import { useTranslation, Trans } from 'react-i18next'; // <--- AÑADIR useTranslation y Trans
import { ShieldCheck, DatabaseZap, Cookie, FileText, Info, ExternalLink, AlertTriangle } from 'lucide-react';
// Si usas react-router-dom para navegación, Links, etc.
// import { Link } from 'react-router-dom';

function PrivacyPage() {
  const { t, i18n } = useTranslation('privacy'); // <--- USAR EL NAMESPACE 'privacy'
  
  // Formatear la fecha según el idioma actual.
  // El valor 'May 6, 2025' se usará como base para la interpolación,
  // pero el formato real de la fecha debe gestionarse con más cuidado para una i18n completa de fechas.
  // Para este ejemplo, simplemente pasaremos la cadena.
  // Una mejor práctica sería usar `new Date()` y formatearla.
  // Dado que la fecha en el código original es una cadena fija, la usaremos.
  // Y ya que hoy es 6 de Mayo de 2025 según el sistema, esta fecha coincide.
  const lastUpdatedDateString = "May 6, 2025"; // Mantén la fecha base como en tu código
  
  // Para una mejor i18n de fechas, podrías hacer esto:
  const lastUpdatedDateObject = new Date(2025, 4, 6); // Mes es 0-indexado (4 = Mayo)
  const formattedDate = new Intl.DateTimeFormat(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(lastUpdatedDateObject);


  return (
    <div className="text-slate-800 dark:text-slate-200 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="mb-10 md:mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center justify-center">
            <FileText size={40} className="mr-3 text-blue-600 dark:text-blue-400" />
            {t('pageTitle')}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t('lastUpdated', { date: formattedDate })}
          </p>
        </header>

        <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <ShieldCheck size={24} className="mr-3 text-green-600 dark:text-green-400" />
            {t('commitment.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            {t('commitment.paragraph1')}
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('commitment.paragraph2')}
          </p>
        </section>

        <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <AlertTriangle size={24} className="mr-3 text-red-600 dark:text-red-400" />
            {t('informationNotCollected.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('informationNotCollected.paragraph1')}
          </p>
        </section>

        <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <DatabaseZap size={24} className="mr-3 text-indigo-600 dark:text-indigo-400" />
            {t('externalApiData.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            {t('externalApiData.paragraph1')}
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            {t('externalApiData.paragraph2')}
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            <Trans i18nKey="privacy:externalApiData.paragraph3"
                   components={{ 
                     1: <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center" />
                   }}
            />
            <ExternalLink size={14} className="inline-block ml-1 text-indigo-600 dark:text-indigo-400" />
          </p>
        </section>

        <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <Cookie size={24} className="mr-3 text-amber-600 dark:text-amber-400" />
            {t('cookiesLocalStorage.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            {t('cookiesLocalStorage.paragraph1')}
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('cookiesLocalStorage.paragraph2')}
          </p>
        </section>

        <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <Info size={24} className="mr-3 text-sky-600 dark:text-sky-400" />
            {t('thirdPartyServices.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            {t('thirdPartyServices.paragraph1')}
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('thirdPartyServices.paragraph2')}
          </p>
        </section>

        <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <Info size={24} className="mr-3 text-gray-600 dark:text-gray-400" />
            {t('policyChanges.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('policyChanges.paragraph1')}
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPage;
