// src/pages/AboutPage.jsx
import React from 'react';
// Assuming react-i18next is set up
import { useTranslation, Trans } from 'react-i18next';
// Import icons
import { Target, Satellite, Radio, Globe, Users, BookOpen, MapPin, GraduationCap, Github, BrainCircuit, Info, ExternalLink } from 'lucide-react';

function AboutPage() {
  const { t } = useTranslation('about'); // Use the 'about' namespace

  // --- IMPORTANT: Replace with your actual GitHub Repo URL ---
  const githubRepoUrl = "https://github.com/your-repo/your-project"; // Replace this!

  // Check if the URL is still the placeholder
  const isGithubUrlPlaceholder = githubRepoUrl === "YOUR_GITHUB_REPO_URL_HERE";


  return (
    // Main container - Use theme colors
    <div className="text-slate-800 dark:text-slate-200 font-sans">
      {/* Constrain content width and add padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Header Section - Themed */}
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            {t('mainTitle', 'About This Project')} {/* Added default */}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-4xl mx-auto mb-6">
            {t('subTitle', 'Learn more about the goals, technology, and vision behind this satellite ground station project.')} {/* Added default */}
          </p>
          {/* Info Section - Themed */}
          <div className="flex flex-wrap items-center justify-center text-sm text-slate-500 dark:text-slate-400 gap-x-6 gap-y-2 mb-6">
            <div className="flex items-center">
              <GraduationCap size={18} className="mr-1.5 text-indigo-500 dark:text-indigo-400" />
              <span>{t('projectType', 'University Project')}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={18} className="mr-1.5 text-red-500 dark:text-red-400" />
              <span>{t('location', 'UIS, Bucaramanga')}</span>
            </div>
          </div>
          {/* GitHub Link - Themed Button */}
          <div className="mt-5 flex justify-center">
            <a
              href={isGithubUrlPlaceholder ? "#" : githubRepoUrl} // Link to '#' if placeholder
              target={isGithubUrlPlaceholder ? "_self" : "_blank"}
              rel="noopener noreferrer"
              // Themed primary button style
              className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition duration-300 shadow-md ${
                isGithubUrlPlaceholder
                ? 'bg-slate-400 cursor-not-allowed' // Disabled style
                : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600' // Enabled style
              }`}
              // Add disabled attribute if URL is placeholder
              {...(isGithubUrlPlaceholder && { 'aria-disabled': true, onClick: (e) => e.preventDefault() })}
              title={isGithubUrlPlaceholder ? "GitHub URL not configured" : "View project on GitHub"}
            >
              <Github size={18} className="mr-2" />
              {t('githubButton', 'View on GitHub')}
            </a>
          </div>
           {isGithubUrlPlaceholder && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-2">Note: GitHub repository URL needs to be configured in the code.</p>
            )}
        </section>

        {/* Objectives Section */}
        <div className="space-y-12">

          {/* General Objective - Themed Section */}
          <section className="p-6 md:p-8 rounded-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 shadow-md border border-blue-100 dark:border-blue-800/50">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-4 rounded-full">
                <Target size={32} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-indigo-800 dark:text-indigo-300 mb-3">
                   {t('generalObjective.title', 'General Objective')}
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                   {t('generalObjective.text', 'Develop and implement a functional satellite ground station integrated with the SatNOGS network, accompanied by a web platform for monitoring, data visualization, and educational outreach.')}
                </p>
              </div>
            </div>
          </section>

          {/* Specific Objectives - Themed Section and Cards */}
          <section>
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-200 mb-8 flex items-center justify-center">
              <Info size={28} className="mr-3 text-slate-700 dark:text-slate-300" />
              {t('specificObjectives.title', 'Specific Objectives')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Objective Cards - Themed */}
              {/* Objective 1 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 group transform hover:-translate-y-1 text-center">
                <div className="flex justify-center mb-4">
                   <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full">
                     <Radio size={28} strokeWidth={2} />
                   </div>
                </div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                   {t('specificObjectives.build.title', 'Build & Integrate')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                   {t('specificObjectives.build.text', 'Assemble the ground station hardware and integrate it with the SatNOGS network for automated satellite tracking and data reception.')}
                </p>
              </div>

              {/* Objective 2 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 group transform hover:-translate-y-1 text-center">
                 <div className="flex justify-center mb-4">
                   <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-full">
                     <Globe size={28} strokeWidth={2} />
                   </div>
                 </div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                   {t('specificObjectives.web.title', 'Develop Web Platform')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                   {t('specificObjectives.web.text', 'Create a user-friendly website to display station status, received observations, satellite images, and relevant project information.')}
                </p>
              </div>

              {/* Objective 3 */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 group transform hover:-translate-y-1 text-center">
                 <div className="flex justify-center mb-4">
                   <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-full">
                     <BookOpen size={28} strokeWidth={2} />
                   </div>
                 </div>
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">
                   {t('specificObjectives.guide.title', 'Educate & Document')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                   {t('specificObjectives.guide.text', 'Provide documentation and resources to educate users about satellite communication, radio technology, and the project itself.')}
                </p>
              </div>

            </div>
          </section>

          {/* Technology & Vision Section - Themed */}
          <section className="p-6 md:p-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 shadow border border-slate-100 dark:border-slate-700 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center justify-center">
                  <BrainCircuit size={28} className="mr-3 text-slate-600 dark:text-slate-400" />
                  {t('techVision.title', 'Technology & Vision')}
              </h2>
              <div className="flex justify-center space-x-6 mb-6 text-slate-500 dark:text-slate-400">
                  <Satellite size={28} className="text-sky-500" />
                  <Radio size={28} className="text-teal-500" />
                  <Users size={28} className="text-green-500" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                  {/* Use Trans component for embedded link */}
                  <Trans i18nKey="techVision.text" ns="about"
                         defaults="Leveraging the power of the open-source <satnogsLink>SatNOGS network</satnogsLink> and software-defined radio, this project aims to foster interest in space science and technology within our university community and beyond."
                         components={{ satnogsLink: <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium" /> }}
                  />
              </p>
          </section>

        </div>
      </div>
    </div>
  );
}

export default AboutPage;
