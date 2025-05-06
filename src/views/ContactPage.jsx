// src/pages/ContactPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next'; // Import hook
// Import icons (Mail icon added for variety)
import { MapPin, Building, School, ExternalLink, Phone, Mail, Info } from 'lucide-react';

function Contact() { // Renamed component
  const { t } = useTranslation('contact'); // Use the 'contact' namespace

  // --- Keep specific data as variables or props ---
  // Use more theme-aligned placeholders if desired
  const uisImageUrl = "https://placehold.co/600x400/DBEAFE/1E3A8A?text=UIS+Campus"; // Blue theme
  const eisiImageUrl = "https://placehold.co/600x400/D1FAE5/065F46?text=EISI-E3T+Building"; // Green theme

  // These should ideally come from config or props, not hardcoded
  const uisPhoneNumber = "+57 (607) 6344000";
  const eisiPhoneNumber = "+57 (607) 6344000 Ext. 2316"; // Example extension
  const uisEmail = "correinstitucional@uis.edu.co"; // Example Email
  const eisiEmail = "eisi@uis.edu.co"; // Example Email
  // --- End specific data ---


  return (
    // Main container - Match standard layout
    <div className="text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto py-12 px-4 md:px-8"> {/* Match max-width, add padding */}

        {/* Header Section - Match standard header */}
        <section className="text-center mb-12 md:mb-16"> {/* Use section, increase bottom margin */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3"> {/* Match h1 style */}
            {t('mainTitle')}
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto"> {/* Match intro text style */}
            {t('subTitle')}
          </p>
        </section>

        {/* Main Content Area: Two Cards - Wrapped in section */}
        <section className="mb-12 md:mb-16">
            {/* Optional: Add a title for this section if needed */}
            {/* <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
              <Info size={28} className="mr-3 text-gray-700" />
              {t('contactPointsTitle')} // Example: Add this key to contact.json
            </h2> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Consistent gap */}

              {/* University (UIS) Card - Apply standard card styling */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1"> {/* Standard card styles + hover */}
                <div className="w-full h-52 overflow-hidden"> {/* Slightly taller image */}
                  <img
                    src={uisImageUrl}
                    alt={t('uis.alt')}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Added hover zoom effect
                    onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/e0e0e0/757575?text=${encodeURIComponent(t('imageUnavailable.uis'))}`; }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow"> {/* Increased padding */}
                  <div className="flex items-center mb-4"> {/* Increased margin */}
                    <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 p-3 rounded-full mr-4"> {/* Larger padding, margin */}
                      <Building size={24} strokeWidth={2} /> {/* Slightly larger icon */}
                    </div>
                    <h2 className="text-xl font-semibold text-indigo-800">{t('uis.title')}</h2> {/* Match color to icon */}
                  </div>
                  <p className="text-gray-600 mb-5 leading-relaxed text-sm"> {/* Consistent style, more margin */}
                    {t('uis.description')}
                  </p>
                  {/* Contact Details - Slightly larger icons/spacing */}
                  <div className="space-y-3 text-sm mb-5"> {/* Increased spacing */}
                    <div className="flex items-center text-gray-700">
                        <Phone size={18} className="mr-3 text-gray-500 flex-shrink-0" /> {/* Larger icon/margin */}
                        <span>{uisPhoneNumber}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                        <Mail size={18} className="mr-3 text-gray-500 flex-shrink-0" /> {/* Use Mail icon */}
                        <a href={`mailto:${uisEmail}`} className="hover:text-indigo-600 hover:underline">{uisEmail}</a> {/* Make email clickable */}
                    </div>
                  </div>
                  {/* Website Link - Consistent styling */}
                  <a
                    href="https://uis.edu.co/es/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200 group mt-auto text-sm font-medium" // Match style, added font-medium
                  >
                    <ExternalLink size={16} className="mr-1.5 text-gray-500 group-hover:text-indigo-600 flex-shrink-0 transition-colors" /> {/* Match style, added transition */}
                    <span>{t('uis.websiteLink')}</span>
                  </a>
                </div>
              </div>

              {/* School (EISI) Card - Apply standard card styling */}
              <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl hover:border-green-300 transition-all duration-300 transform hover:-translate-y-1"> {/* Standard card styles + hover */}
                <div className="w-full h-52 overflow-hidden"> {/* Slightly taller image */}
                  <img
                    src={eisiImageUrl}
                    alt={t('eisi.alt')}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" // Added hover zoom effect
                    onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/600x400/e0e0e0/757575?text=${encodeURIComponent(t('imageUnavailable.eisi'))}`; }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow"> {/* Increased padding */}
                  <div className="flex items-center mb-4"> {/* Increased margin */}
                    <div className="flex-shrink-0 bg-green-100 text-green-600 p-3 rounded-full mr-4"> {/* Larger padding, margin */}
                      <School size={24} strokeWidth={2} /> {/* Slightly larger icon */}
                    </div>
                    <h2 className="text-xl font-semibold text-green-800">{t('eisi.title')}</h2> {/* Match color to icon */}
                  </div>
                  <p className="text-gray-600 mb-5 leading-relaxed text-sm"> {/* Consistent style, more margin */}
                    {t('eisi.description')}
                  </p>
                  {/* Contact Details - Slightly larger icons/spacing */}
                  <div className="space-y-3 text-sm mb-5"> {/* Increased spacing */}
                      <div className="flex items-center text-gray-700">
                          <Phone size={18} className="mr-3 text-gray-500 flex-shrink-0" /> {/* Larger icon/margin */}
                          <span>{eisiPhoneNumber}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                          <Mail size={18} className="mr-3 text-gray-500 flex-shrink-0" /> {/* Use Mail icon */}
                          <a href={`mailto:${eisiEmail}`} className="hover:text-green-600 hover:underline">{eisiEmail}</a> {/* Make email clickable, match theme */}
                      </div>
                  </div>
                  {/* Website Link - Consistent styling */}
                  <a
                    href="https://e3t.uis.edu.co/eisi/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200 group mt-auto text-sm font-medium" // Match style
                  >
                    <ExternalLink size={16} className="mr-1.5 text-gray-500 group-hover:text-indigo-600 flex-shrink-0 transition-colors" /> {/* Match style */}
                    <span>{t('eisi.websiteLink')}</span>
                  </a>
                </div>
              </div>

            </div>
        </section>

        {/* Location Section - Styled as a standard section block */}
        <section className="p-6 md:p-8 rounded-lg bg-gray-50 shadow border border-gray-100 text-center"> {/* Standard section style */}
          {/* Standard section title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
            <MapPin size={28} className="mr-3 text-red-600" /> {/* Use color from theme */}
             {t('location.title')}
          </h2>
          <div className="text-gray-700 mb-1"> {/* Adjusted text color/margin */}
            {/* Location address line 1 */}
            <span>{t('location.address1')}</span>
          </div>
          <div className="text-sm text-gray-500">
             {/* Location address line 2 */}
            <p>{t('location.address2')}</p>
          </div>
           {/* Optional: Add a Google Maps Link/Embed Here */}
           <div className="mt-6">
             <a
                href="https://www.google.com/maps/place/Universidad+Industrial+de+Santander/@7.138609,-73.12228,17z/data=!3m1!4b1!4m6!3m5!1s0x8e681570811632e9:0xaa24c12750a41e9a!8m2!3d7.1386037!4d-73.1197051!16zL20vMDZrZ3Bi?entry=ttu" // Example Google Maps link
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-300 shadow-sm"
             >
                {t('location.mapButton')} {/* Add key: "View on Google Maps" */}
                <ExternalLink size={16} className="ml-2" />
             </a>
           </div>
        </section>

      </div>
    </div>
  );
}

export default Contact; // Ensure export matches filename if changed
