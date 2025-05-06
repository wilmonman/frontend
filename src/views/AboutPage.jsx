// src/pages/AboutPage.jsx
import React from 'react';
import { useTranslation, Trans } from 'react-i18next'; // Import Trans component
// Import icons
import { Target, Satellite, Radio, Globe, Users, BookOpen, MapPin, GraduationCap, Github, BrainCircuit, Info } from 'lucide-react'; // Added BrainCircuit, Info

function AboutPage() {
  const { t } = useTranslation('about'); // Use the 'about' namespace

  // --- IMPORTANT: Replace with your actual GitHub Repo URL ---
  const githubRepoUrl = "YOUR_GITHUB_REPO_URL_HERE"; // Make sure this is set

  return (
    // Main container - Match HomePage width and add vertical padding
    <div className="text-gray-800 font-sans"> {/* Base font/color from HomePage */}
      <div className="max-w-6xl mx-auto py-12 px-4 md:px-8"> {/* Match max-width, add padding */}

        {/* Header Section - Match HomePage title style */}
        <section className="text-center mb-12 md:mb-16"> {/* Use section tag, increase bottom margin */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3"> {/* Match HomePage h1 */}
            {t('mainTitle')}
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-6"> {/* Match HomePage intro text style */}
            {t('subTitle')}
          </p>
          {/* Info Section - Slightly adjusted spacing/colors */}
          <div className="flex flex-wrap items-center justify-center text-sm text-gray-500 gap-x-6 gap-y-2 mb-6"> {/* Increased gap */}
             <div className="flex items-center">
               <GraduationCap size={18} className="mr-1.5 text-indigo-500" /> {/* Color consistent */}
               <span>{t('projectType')}</span>
             </div>
             {/* <span className="hidden md:inline">|</span> Optional separator */}
             <div className="flex items-center">
               <MapPin size={18} className="mr-1.5 text-red-500" /> {/* Color consistent */}
               <span>{t('location')}</span>
             </div>
          </div>
          {/* GitHub Link - Match HomePage primary button style (indigo) */}
          <div className="mt-5 flex justify-center">
              <a
                href={githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                // Match HomePage primary button style (like Access Dashboard)
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 shadow-md"
              >
                <Github size={18} className="mr-2" />
                {t('githubButton')}
              </a>
          </div>
        </section>

        {/* Objectives Section */}
        <div className="space-y-12"> {/* Increased spacing between objective sections */}

          {/* General Objective - Use a styled section like HomePage */}
          <section className="p-6 md:p-8 rounded-lg bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-md border border-indigo-100"> {/* Match Hero section gradient/style */}
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0 bg-indigo-100 text-indigo-600 p-4 rounded-full"> {/* Consistent icon circle */}
                <Target size={32} strokeWidth={2} /> {/* Slightly larger icon */}
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-indigo-800 mb-3"> {/* Adjusted title style */}
                    {t('generalObjective.title')}
                </h2>
                <p className="text-gray-700 leading-relaxed"> {/* Consistent paragraph style */}
                   {t('generalObjective.text')}
                </p>
              </div>
            </div>
          </section>

          {/* Specific Objectives - Use section, style title, match card style */}
          <section>
            {/* Match HomePage section title style */}
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 flex items-center justify-center">
              <Info size={28} className="mr-3 text-gray-700" /> {/* Added an icon */}
              {t('specificObjectives.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Objective Cards - Match HomePage link card style */}
              {/* Objective 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl hover:border-green-300 transition-all duration-300 group transform hover:-translate-y-1 text-center"> {/* Match card style, added text-center */}
                <div className="flex justify-center mb-4">
                   <div className="bg-green-100 text-green-600 p-3 rounded-full"> {/* Consistent icon circle */}
                      <Radio size={28} strokeWidth={2} />
                   </div>
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2"> {/* Color matches icon */}
                    {t('specificObjectives.build.title')}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed"> {/* Consistent description */}
                    {t('specificObjectives.build.text')}
                </p>
              </div>

              {/* Objective 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group transform hover:-translate-y-1 text-center"> {/* Match card style */}
                 <div className="flex justify-center mb-4">
                   <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
                      <Globe size={28} strokeWidth={2} />
                   </div>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-2"> {/* Color matches icon */}
                   {t('specificObjectives.web.title')}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                   {t('specificObjectives.web.text')}
                </p>
              </div>

              {/* Objective 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-xl hover:border-purple-300 transition-all duration-300 group transform hover:-translate-y-1 text-center"> {/* Match card style */}
                 <div className="flex justify-center mb-4">
                   <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                      <BookOpen size={28} strokeWidth={2} />
                   </div>
                </div>
                <h3 className="text-lg font-semibold text-purple-800 mb-2"> {/* Color matches icon */}
                   {t('specificObjectives.guide.title')}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                   {t('specificObjectives.guide.text')}
                </p>
              </div>

            </div>
          </section>

          {/* Technology & Vision Section - Style like other informational sections */}
          <section className="p-6 md:p-8 rounded-lg bg-gray-50 shadow border border-gray-100 text-center"> {/* Match style of SatNOGS/GNU Radio sections */}
             {/* Match section title style */}
             <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                 <BrainCircuit size={28} className="mr-3 text-gray-600" /> {/* Use relevant icon */}
                 {t('techVision.title')}
             </h2>
             {/* Slightly styled icons */}
             <div className="flex justify-center space-x-6 mb-6 text-gray-500">
                <Satellite size={28} className="text-sky-500" />
                <Radio size={28} className="text-teal-500" />
                <Users size={28} className="text-green-500" />
             </div>
             <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed"> {/* Consistent paragraph style */}
               {/* Use Trans component - styling for link is good */}
               <Trans i18nKey="techVision.text" ns="about">
                  Leveraging the power of the open-source <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-medium">SatNOGS network</a> and software-defined radio, this project aims to foster interest in space science and technology within our university community and beyond.
               </Trans>
             </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default AboutPage;
