import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="text-center py-10">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        {/* Example translation key: t('notFound.title', 'Page Not Found') */}
        Page Not Found
      </h2>
      <p className="text-gray-500 mb-6">
        {/* Example translation key: t('notFound.message', 'Sorry, the page you are looking for does not exist.') */}
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
      >
        {/* Example translation key: t('notFound.goHome', 'Go Home') */}
        Go Home
      </Link>
    </div>
  );
}

export default NotFoundPage;