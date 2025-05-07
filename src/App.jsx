import React from 'react'; 
import { Routes, Route, Outlet } from 'react-router-dom';

// Layout Components 
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Views Import
import HomePage from './views/HomePage';
import ContactPage from './views/ContactPage';
import AboutPage from './views/AboutPage';
import ResourcesPage from './views/resources/ResourcesPage'; // Changed
import GroundStationPage from './views/groundstation/GroundStationPage';
import ObservationsPage from './views/observations/ObservationsPage';
import ImagesPage from './views/images/ImagesPage';
import SatellitesPage from './views/satellites/SatellitesPage';
import NotFoundPage from './views/NotFoundPage';
import PrivacyPage from './views/PrivacyPage';
import DocumentationPage from './views/DocumentationPage';

import './App.css'; 

// --- Main Layout Component ---
function MainLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-inter transition-colors duration-300">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

// --- App Component ---
function App() {
    return (
        <Routes>
            {/* Routes using the MainLayout */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} /> {/* Home page at '/' */}
                <Route path="about" element={<AboutPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="ground-station" element={<GroundStationPage />} />
                <Route path="observations" element={<ObservationsPage />} />
                <Route path="images" element={<ImagesPage />} />
                <Route path="satellites" element={<SatellitesPage />} />
                <Route path="privacy" element={<PrivacyPage />} /> 
                <Route path="docs" element={<DocumentationPage />} />

                {/* Catch-all route for 404 Not Found pages */}
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
