import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import LoadingSpinner from './components/ui/LoadingSpinner';
import App from './App';

import './i18n';
import './index.css';
import 'leaflet/dist/leaflet.css';

const spinner = (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 transition-opacity duration-300 opacity-100" >
    <div className="mt-4"> 
      <LoadingSpinner />
    </div>
    {/* Optional: Add loading text */}
    <p className="mt-2 text-sm">Loading...</p> 
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap with Suspense for async loading of translations */}
    <Suspense fallback={spinner}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>  
  </React.StrictMode>
);
