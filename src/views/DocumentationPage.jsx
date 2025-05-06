// src/views/DocumentationPage.jsx
import React from 'react';
// Removed: import { useTranslation, Trans } from 'react-i18next';
import { BookOpen, HelpCircle, Satellite, Radio, MapPin, ImageIcon as ImgIcon, Network, ListChecks, Lightbulb, ExternalLink, Info, Telescope, Users, Code2, Activity, Clock } from 'lucide-react';
// If you use react-router-dom for navigation, uncomment this
// import { Link } from 'react-router-dom';

function DocumentationPage() {
  // Removed: const { t } = useTranslation('documentation');

  const Section = ({ title, icon, children }) => (
    <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-5 flex items-center">
        {icon && React.cloneElement(icon, { size: 28, className: "mr-3 text-blue-600 dark:text-blue-400" })}
        {title}
      </h2>
      <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
        {children}
      </div>
    </section>
  );

  const SubSection = ({ title, icon, children }) => (
    <article className="mt-6 p-4 rounded-md bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center">
            {icon && React.cloneElement(icon, { size: 22, className: "mr-2 text-sky-600 dark:text-sky-400" })}
            {title}
        </h3>
        <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-2 text-sm md:text-base">
            {children}
        </div>
    </article>
  );


  return (
    <div className="text-slate-800 dark:text-slate-200 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Title */}
        <header className="mb-10 md:mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center justify-center">
            <BookOpen size={40} className="mr-3 text-blue-600 dark:text-blue-400" />
            Documentation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Understanding our platform and the data from SatNOGS.
          </p>
        </header>

        <Section title="Introduction & Overview" icon={<Info />}>
          <p>
            This platform serves as a window into the operations of the UIS Satellite Ground Station and the broader SatNOGS network. Our aim is to provide accessible data and visualizations related to satellite tracking and radio communications.
          </p>
          <p>
            All data presented here is sourced primarily from the <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center">SatNOGS network</a> (Satellite Networked Open Ground Station), a global, open-source project. SatNOGS consists of a network of volunteer-run ground stations that track and receive data from various satellites.
            <ExternalLink size={14} className="inline-block ml-1 text-blue-600 dark:text-blue-400" />
          </p>
          <p>
            This documentation will guide you through the different sections of our website, explain the types of data you can find, and help you understand its significance.
          </p>
        </Section>

        <Section title="Platform Features & Data Explained" icon={<Telescope />}>
          <p>
            Our website is organized into several key sections, each providing different insights into satellite operations and data:
          </p>

          <SubSection title="Ground Station Dashboard" icon={<MapPin />}>
            <p>This page provides an overview of our local ground station's status, current activity, and key performance indicators. You might find information about the station's location, antenna configuration, and recent operational history.</p>
            <p>Look for details on upcoming satellite passes scheduled for our station and its connectivity to the SatNOGS network.</p>
          </SubSection>

          <SubSection title="Observations Log" icon={<Satellite />}>
            <p>Here you can browse a log of satellite observations. Each observation represents an attempt by a ground station (ours or others in the network) to receive data from a satellite during a specific pass.</p>
            <p>Key data points include the satellite name, observation time, ground station used, frequency, and the outcome of the observation (e.g., successful data reception, signal strength). You may also find links to "waterfall" plots (visual representations of radio signals) or demodulated data.</p>
          </SubSection>

          <SubSection title="Satellite Images" icon={<ImgIcon />}>
            <p>This section showcases images received from weather satellites (like NOAA APT) or other imaging satellites. These images are typically decoded from the raw radio signals captured during an observation.</p>
            <p>You can view the images and often find details about the satellite, the time of capture, and the ground station that received the signal.</p>
          </SubSection>

          <SubSection title="Satellite Database" icon={<Network />}>
            <p>Explore information about various satellites tracked by the SatNOGS network. This includes details like NORAD ID, common name, mission objectives, and orbital parameters (TLEs - Two-Line Elements).</p>
            <p>Understanding TLEs helps predict satellite passes and is crucial for tracking.</p>
          </SubSection>
        </Section>

        <Section title="Understanding SatNOGS Data" icon={<Users />}>
          <p>
            SatNOGS data is rich and varied. Here are some common concepts:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Observation:</strong> A scheduled attempt to receive signals from a satellite during a specific overhead pass.</li>
            <li><strong>Waterfall Plot:</strong> A visual representation of radio frequency strength over time, allowing identification of signals.</li>
            <li><strong>Payload/Demodulated Data:</strong> The actual information transmitted by the satellite, extracted from the radio signal (e.g., images, telemetry).</li>
            <li><strong>TLE (Two-Line Elements):</strong> A data format encoding the orbital elements of an Earth-orbiting object, used to predict its path.</li>
          </ul>
           <p className="mt-4">
            For in-depth information, the <a href="https://wiki.satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center">SatNOGS Wiki</a> is an excellent resource.
            <ExternalLink size={14} className="inline-block ml-1 text-blue-600 dark:text-blue-400" />
          </p>
        </Section>

        <Section title="Data Freshness & Limitations" icon={<Clock />}>
          <p>
            The data displayed on our platform is fetched from the SatNOGS network. While we strive to present up-to-date information, there might be delays based on the SatNOGS database update frequency and our own caching mechanisms.
          </p>
          <p>
            The accuracy of observations and satellite data depends on the contributions of the global SatNOGS community and the operational status of individual ground stations and satellites.
          </p>
        </Section>

        <Section title="Frequently Asked Questions (FAQ)" icon={<HelpCircle />}>
          <SubSection title="Where does this data come from?">
             <p>
                Primarily from the <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">SatNOGS network</a>, an open-source, community-driven project. Some satellite orbital data (TLEs) may be sourced from public repositories like CelesTrak.
             </p>
          </SubSection>
          <SubSection title="How often is the data updated?">
            <p>Data is typically updated regularly, but the exact frequency can vary. We aim to refresh data from SatNOGS multiple times a day.</p>
          </SubSection>
          <SubSection title="Can I download the data?">
            <p>Currently, direct bulk download from our platform is not supported. However, much of the raw data is available through the SatNOGS network itself. We provide links to relevant SatNOGS resources where possible.</p>
          </SubSection>
           <SubSection title="How can I contribute to SatNOGS?">
            <p>
                SatNOGS welcomes contributions! You can learn more about building a ground station, contributing software, or helping with documentation on the <a href="https://community.libre.space/c/satnogs/10" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center">SatNOGS community page</a>.
                <ExternalLink size={14} className="inline-block ml-1 text-blue-600 dark:text-blue-400" />
            </p>
          </SubSection>
        </Section>

        <Section title="Brief Glossary" icon={<ListChecks />}>
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
                <li><strong>API:</strong> Application Programming Interface. A way for different software programs to communicate with each other.</li>
                <li><strong>APT (Automatic Picture Transmission):</strong> A system used by some weather satellites (e.g., NOAA) to transmit analog images.</li>
                <li><strong>Ground Station:</strong> A terrestrial radio station designed for extraterrestrial telecommunication with spacecraft, or reception of radio waves from astronomical radio sources.</li>
                <li><strong>LEO (Low Earth Orbit):</strong> An orbit around Earth with an altitude typically between 160 kilometers (99 mi) and 2,000 kilometers (1,200 mi).</li>
                <li><strong>NORAD ID (Satellite Catalog Number):</strong> A unique sequential 5-digit number assigned by NORAD to all artificial satellites.</li>
                <li><strong>SDR (Software-Defined Radio):</strong> A radio communication system where components that have been typically implemented in hardware (e.g. mixers, filters, amplifiers, modulators/demodulators, detectors, etc.) are instead implemented by means of software on a personal computer or embedded system.</li>
            </ul>
        </Section>


        <Section title="Contact & Feedback" icon={<Lightbulb />}>
          <p>
            Have questions, suggestions, or want to report an issue? We'd love to hear from you!
            {/* Replace with your actual contact link */}
            {/* Example using Link from react-router-dom:
            <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium ml-1">
              Please visit our Contact Page.
            </Link>
            */}
             <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium ml-1">
              Please visit our Contact Page.
            </a>
          </p>
        </Section>

      </div>
    </div>
  );
}

export default DocumentationPage;
