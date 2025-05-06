// src/pages/AboutPage.jsx
import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Target, Satellite, Radio, Globe, Users, BookOpen, MapPin, GraduationCap, Github, BrainCircuit, Info, ExternalLink } from 'lucide-react';

function AboutPage() {
  const { t } = useTranslation('about');

  // --- IMPORTANT: Replace with your actual GitHub Repo URL ---
  const githubRepoUrl = "https://github.com/your-repo/your-project"; // ¡Reemplaza esto!
  // Para pruebas, puedes dejarlo así o cambiarlo a tu URL real.
  // const githubRepoUrl = "YOUR_GITHUB_REPO_URL_HERE";


  // Verifica si la URL sigue siendo el placeholder
  const isGithubUrlPlaceholder = githubRepoUrl === "YOUR_GITHUB_REPO_URL_HERE" || githubRepoUrl === "https://github.com/your-repo/your-project";


  return (
    <div className="text-slate-800 dark:text-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            {t('mainTitle')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-4xl mx-auto mb-6">
            {t('subTitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center text-sm text-slate-500 dark:text-slate-400 gap-x-6 gap-y-2 mb-6">
            <div className="flex items-center">
              <GraduationCap size={18} className="mr-1.5 text-indigo-500 dark:text-indigo-400" />
              <span>{t('projectType')}</span>
            </div>
            <div className="flex items-center">
              <MapPin size={18} className="mr-1.5 text-red-500 dark:text-red-400" />
              <span>{t('location')}</span>
            </div>
          </div>
          <div className="mt-5 flex justify-center">
            <a
              href={isGithubUrlPlaceholder ? "#" : githubRepoUrl}
              target={isGithubUrlPlaceholder ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition duration-300 shadow-md ${
                isGithubUrlPlaceholder
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600'
              }`}
              {...(isGithubUrlPlaceholder && { 'aria-disabled': true, onClick: (e) => e.preventDefault() })}
              title={isGithubUrlPlaceholder ? t('githubButtonTitleDisabled') : t('githubButtonTitleEnabled')}
            >
              <Github size={18} className="mr-2" />
              {t('githubButton')}
            </a>
          </div>
            {isGithubUrlPlaceholder && (
                <p className="text-xs text-red-500 dark:text-red-400 mt-2">
                    {t('githubRepoNotConfiguredNote')}
                </p>
            )}
        </section>

        <div className="space-y-12">
          <section className="p-6 md:p-8 rounded-lg bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 shadow-md border border-blue-100 dark:border-blue-800/50">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 p-4 rounded-full">
                <Target size={32} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-indigo-800 dark:text-indigo-300 mb-3">
                  {t('generalObjective.title')}
                </h2>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {t('generalObjective.text')}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-200 mb-8 flex items-center justify-center">
              <Info size={28} className="mr-3 text-slate-700 dark:text-slate-300" />
              {t('specificObjectives.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-green-300 dark:hover:border-green-600 transition-all duration-300 group transform hover:-translate-y-1 text-center">
                <div className="flex justify-center mb-4">
                    <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-full">
                      <Radio size={28} strokeWidth={2} />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                  {t('specificObjectives.build.title')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t('specificObjectives.build.text')}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 group transform hover:-translate-y-1 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-full">
                      <Globe size={28} strokeWidth={2} />
                    </div>
                  </div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  {t('specificObjectives.web.title')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t('specificObjectives.web.text')}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 group transform hover:-translate-y-1 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 p-3 rounded-full">
                      <BookOpen size={28} strokeWidth={2} />
                    </div>
                  </div>
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-300 mb-2">
                  {t('specificObjectives.guide.title')}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {t('specificObjectives.guide.text')}
                </p>
              </div>
            </div>
          </section>

          <section className="p-6 md:p-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 shadow border border-slate-100 dark:border-slate-700 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center justify-center">
                  <BrainCircuit size={28} className="mr-3 text-slate-600 dark:text-slate-400" />
                  {t('techVision.title')}
              </h2>
              <div className="flex justify-center space-x-6 mb-6 text-slate-500 dark:text-slate-400">
                  <Satellite size={28} className="text-sky-500" />
                  <Radio size={28} className="text-teal-500" />
                  <Users size={28} className="text-green-500" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                <Trans i18nKey="techVision.text" ns="about"
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
