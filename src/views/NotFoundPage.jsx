// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation
import { useTranslation } from 'react-i18next'; // Use translation if needed
import { AlertTriangle } from 'lucide-react'; // Import an icon

function NotFoundPage() {
  // You might want a key in app.json for 404 messages
  const { t } = useTranslation('app'); // Assuming 'app' namespace for general messages

  return (
    // Main container - Center content vertically and horizontally, add padding
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 py-10 text-slate-800 dark:text-slate-200"> {/* Adjust min-height based on header/footer */}
      {/* Icon */}
      <AlertTriangle size={64} className="text-red-500 dark:text-red-400 mb-6" />

      {/* 404 Title */}
      <h1 className="text-6xl md:text-7xl font-bold text-red-500 dark:text-red-400 mb-4">404</h1>

      {/* Page Not Found Subtitle */}
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
        {/* Example translation key: t('notFound.title', 'Page Not Found') */}
        {t('notFound.title', 'Page Not Found')}
      </h2>

      {/* Message */}
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
        {/* Example translation key: t('notFound.message', 'Sorry, the page you are looking for does not exist.') */}
        {t('notFound.message', 'Sorry, the page you are looking for does not exist or may have been moved.')}
      </p>

      {/* Go Home Button - Themed */}
      <Link
        to="/" // Link to the home page
        // Use primary button style consistent with other pages
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-300 shadow-md"
      >
        {/* Example translation key: t('notFound.goHome', 'Go Home') */}
        {t('notFound.goHome', 'Go Home')}
      </Link>
    </div>
  );
}

export default NotFoundPage;
