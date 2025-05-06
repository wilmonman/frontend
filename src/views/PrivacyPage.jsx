// src/views/PrivacyPage.jsx
import React from 'react';
// Removed: import { useTranslation, Trans } from 'react-i18next';
import { ShieldCheck, DatabaseZap, Cookie, Users, FileText, Info, Mail, ExternalLink, AlertTriangle } from 'lucide-react';
// If you use react-router-dom for navigation, uncomment this
// import { Link } from 'react-router-dom';

function PrivacyPage() {
  // Removed: const { t } = useTranslation('privacy');
  const lastUpdatedDate = "May 6, 2025"; // Example date, make this dynamic or update as needed

  return (
    <div className="text-slate-800 dark:text-slate-200 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Title */}
        <header className="mb-10 md:mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center justify-center">
            <FileText size={40} className="mr-3 text-blue-600 dark:text-blue-400" />
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Last Updated: {lastUpdatedDate}
          </p>
        </header>

        {/* Section: Our Commitment to Privacy */}
        <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <ShieldCheck size={24} className="mr-3 text-green-600 dark:text-green-400" />
            Our Commitment to Privacy
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Welcome to the UIS Satellite Ground Station web platform. Your privacy is important to us. This Privacy Policy explains how we handle information in relation to your use of our website and services.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We are committed to transparency and want you to understand our practices.
          </p>
        </section>

        {/* Section: Information We Do Not Collect */}
        <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <AlertTriangle size={24} className="mr-3 text-red-600 dark:text-red-400" />
            Information We Do Not Collect
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We do not collect, store, or process any Personally Identifiable Information (PII) from our users. You can browse our website and use its features without creating an account or providing any personal data such as your name, email address, phone number, or physical address.
          </p>
        </section>

        {/* Section: Data from External APIs (SatNOGS) */}
        <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <DatabaseZap size={24} className="mr-3 text-indigo-600 dark:text-indigo-400" />
            Data from External APIs (SatNOGS)
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Our platform displays data fetched from the SatNOGS (Satellite Networked Open Ground Station) network and potentially other public APIs. This data includes information about satellite observations, ground station statuses, telemetry data, and satellite orbital parameters.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            This data is publicly available and does not contain any personal information about you, the user of our website. The data is used solely to provide the informational and educational services offered by our platform.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            For more information on how SatNOGS handles data, please refer to the <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium inline-flex items-center">SatNOGS policies</a>.
            <ExternalLink size={14} className="inline-block ml-1 text-indigo-600 dark:text-indigo-400" />
          </p>
        </section>

        {/* Section: Cookies and Local Storage */}
        <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <Cookie size={24} className="mr-3 text-amber-600 dark:text-amber-400" />
            Cookies and Local Storage
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Our website does not use cookies for tracking users or collecting personal information. We may use browser local storage to save your display preferences (such as theme settings like light/dark mode) or to temporarily cache data fetched from APIs to improve performance and your browsing experience.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            This stored information is not personal and is confined to your browser. It is not transmitted to our servers for tracking purposes.
          </p>
        </section>

        {/* Section: Third-Party Services */}
        <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <Info size={24} className="mr-3 text-sky-600 dark:text-sky-400" />
            Third-Party Services
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
            Our website is hosted by a third-party hosting provider. This provider may collect standard server logs (e.g., IP addresses, browser type) for security and operational purposes, as per their own privacy policies. We do not have direct access to or control over these logs in a way that would identify individual users for our own tracking.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We do not employ third-party analytics services that track personal user data (e.g., Google Analytics). Any links to external websites are provided for informational purposes, and we are not responsible for the privacy practices of these external sites.
          </p>
        </section>

        {/* Section: Changes to This Privacy Policy */}
        <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center">
            <Info size={24} className="mr-3 text-gray-600 dark:text-gray-400" />
            Changes to This Privacy Policy
          </h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </section>
      </div>
    </div>
  );
}

export default PrivacyPage;
