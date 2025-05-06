// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Ya importado
import { AlertTriangle } from 'lucide-react';

function NotFoundPage() {
  const { t } = useTranslation('notFound'); // <--- CAMBIAR AL NAMESPACE 'notFound'

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 py-10 text-slate-800 dark:text-slate-200">
      <AlertTriangle size={64} className="text-red-500 dark:text-red-400 mb-6" />

      <h1 className="text-6xl md:text-7xl font-bold text-red-500 dark:text-red-400 mb-4">404</h1>

      <h2 className="text-2xl md:text-3xl font-semibold text-slate-700 dark:text-slate-200 mb-4">
        {t('title')} {/* Usar la clave 'title' de notFound.json */}
      </h2>

      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
        {t('message')} {/* Usar la clave 'message' de notFound.json */}
      </p>

      <Link
        to="/"
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 transition duration-300 shadow-md"
      >
        {t('goHomeButton')} {/* Usar la clave 'goHomeButton' de notFound.json */}
      </Link>
    </div>
  );
}

export default NotFoundPage;
