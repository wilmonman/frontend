import React from 'react'; 
import { Routes, Route, Outlet } from 'react-router-dom';

// Layout Components 
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Views Import
import HomePage from './views/HomePage';
import Contact from './views/ContactPage';
import AboutPage from './views/AboutPage';
import ResourcesPage from './views/ResourcesPage';
import GroundStationPage from './views/GroundStation/GroundStationPage';
import ObservationsPage from './views/observations/ObservationsPage';
import ImagesPage from './views/images/ImagesPage';
import SatellitesPage from './views/satellites/SatellitesPage';
import NotFound from './views/NotFoundPage';
// import Privacy from './views/Privacy';
// import Docs from './views/Docs';

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
                <Route path="contact" element={<Contact />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="ground-station" element={<GroundStationPage />} />
                <Route path="observations" element={<ObservationsPage />} />
                <Route path="images" element={<ImagesPage />} />
                <Route path="satellites" element={<SatellitesPage />} />
                {/* <Route path="privacy" element={<Privacy />} /> */}
                {/* <Route path="docs" element={<Docs />} /> */}

                {/* Catch-all route for 404 Not Found pages */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}

export default App;
