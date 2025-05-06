// src/views/DocumentationPage.jsx
import React from 'react';
import { useTranslation, Trans } from 'react-i18next'; // <--- AÑADIR useTranslation y Trans
import { BookOpen, HelpCircle, Satellite, Radio, MapPin, ImageIcon as ImgIcon, Network, ListChecks, Lightbulb, ExternalLink, Info, Telescope, Users, Code2, Activity, Clock } from 'lucide-react';
// Si usas react-router-dom para navegación, descomenta esto
// import { Link } from 'react-router-dom';

function DocumentationPage() {
  const { t } = useTranslation('documentation'); // <--- USAR EL NAMESPACE 'documentation'

  // Section y SubSection no necesitan 't' directamente si el 'title' y 'children' ya vienen traducidos.
  const Section = ({ title, icon, children }) => (
    <section className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow border border-slate-200 dark:border-slate-700 mb-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100 mb-5 flex items-center">
        {icon && React.cloneElement(icon, { size: 28, className: "mr-3 text-blue-600 dark:text-blue-400" })}
        {title} {/* El título se pasará ya traducido */}
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
            {title} {/* El título se pasará ya traducido */}
        </h3>
        <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-2 text-sm md:text-base">
            {children}
        </div>
    </article>
  );

  return (
    <div className="text-slate-800 dark:text-slate-200 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <header className="mb-10 md:mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center justify-center">
            <BookOpen size={40} className="mr-3 text-blue-600 dark:text-blue-400" />
            {t('pageTitle')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {t('pageSubtitle')}
          </p>
        </header>

        <Section title={t('introduction.title')} icon={<Info />}>
          <p>{t('introduction.paragraph1')}</p>
          <p>
            <Trans i18nKey="introduction.paragraph2" ns="documentation"
                   components={{ 
                     1: <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center" />,
                     2: <ExternalLink size={14} className="inline-block ml-1 text-blue-600 dark:text-blue-400" />
                   }}
            />
          </p>
          <p>{t('introduction.paragraph3')}</p>
        </Section>

        <Section title={t('platformFeatures.title')} icon={<Telescope />}>
          <p>{t('platformFeatures.intro')}</p>
          <SubSection title={t('platformFeatures.groundStation.title')} icon={<MapPin />}>
            <p>{t('platformFeatures.groundStation.paragraph1')}</p>
            <p>{t('platformFeatures.groundStation.paragraph2')}</p>
          </SubSection>
          <SubSection title={t('platformFeatures.observationsLog.title')} icon={<Satellite />}>
            <p>{t('platformFeatures.observationsLog.paragraph1')}</p>
            <p>{t('platformFeatures.observationsLog.paragraph2')}</p>
          </SubSection>
          <SubSection title={t('platformFeatures.satelliteImages.title')} icon={<ImgIcon />}>
            <p>{t('platformFeatures.satelliteImages.paragraph1')}</p>
            <p>{t('platformFeatures.satelliteImages.paragraph2')}</p>
          </SubSection>
          <SubSection title={t('platformFeatures.satelliteDatabase.title')} icon={<Network />}>
            <p>{t('platformFeatures.satelliteDatabase.paragraph1')}</p>
            <p>{t('platformFeatures.satelliteDatabase.paragraph2')}</p>
          </SubSection>
        </Section>

        <Section title={t('understandingSatnogsData.title')} icon={<Users />}>
          <p>{t('understandingSatnogsData.intro')}</p>
          <ul className="list-disc list-inside space-y-2">
            {/* Usar Trans para los ítems con <strong> */}
            <li><Trans i18nKey="understandingSatnogsData.item1" ns="documentation" components={{ strong: <strong /> }} /></li>
            <li><Trans i18nKey="understandingSatnogsData.item2" ns="documentation" components={{ strong: <strong /> }} /></li>
            <li><Trans i18nKey="understandingSatnogsData.item3" ns="documentation" components={{ strong: <strong /> }} /></li>
            <li><Trans i18nKey="understandingSatnogsData.item4" ns="documentation" components={{ strong: <strong /> }} /></li>
          </ul>
          <p className="mt-4">
            <Trans i18nKey="understandingSatnogsData.wikiLink" ns="documentation"
                   components={{ 
                     1: <a href="https://wiki.satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center" />,
                     2: <ExternalLink size={14} className="inline-block ml-1 text-blue-600 dark:text-blue-400" />
                   }}
            />
          </p>
        </Section>

        <Section title={t('dataFreshness.title')} icon={<Clock />}>
          <p>{t('dataFreshness.paragraph1')}</p>
          <p>{t('dataFreshness.paragraph2')}</p>
        </Section>

        <Section title={t('faq.title')} icon={<HelpCircle />}>
          <SubSection title={t('faq.q1_title')}>
            <p>
                <Trans i18nKey="faq.q1_answer" ns="documentation"
                    components={{ 1: <a href="https://satnogs.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium" /> }}
                />
            </p>
          </SubSection>
          <SubSection title={t('faq.q2_title')}>
            <p>{t('faq.q2_answer')}</p>
          </SubSection>
          <SubSection title={t('faq.q3_title')}>
            <p>{t('faq.q3_answer')}</p>
          </SubSection>
          <SubSection title={t('faq.q4_title')}>
            <p>
                <Trans i18nKey="faq.q4_answer" ns="documentation"
                    components={{ 
                        1: <a href="https://community.libre.space/c/satnogs/10" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center" />,
                        2: <ExternalLink size={14} className="inline-block ml-1 text-blue-600 dark:text-blue-400" />
                    }}
                />
            </p>
          </SubSection>
        </Section>

        <Section title={t('glossary.title')} icon={<ListChecks />}>
            <ul className="list-disc list-inside space-y-1 text-sm md:text-base">
                <li><Trans i18nKey="glossary.api" ns="documentation" components={{ strong: <strong /> }} /></li>
                <li><Trans i18nKey="glossary.apt" ns="documentation" components={{ strong: <strong /> }} /></li>
                <li><Trans i18nKey="glossary.groundStation" ns="documentation" components={{ strong: <strong /> }} /></li>
                <li><Trans i18nKey="glossary.leo" ns="documentation" components={{ strong: <strong /> }} /></li>
                <li><Trans i18nKey="glossary.noradId" ns="documentation" components={{ strong: <strong /> }} /></li>
                <li><Trans i18nKey="glossary.sdr" ns="documentation" components={{ strong: <strong /> }} /></li>
            </ul>
        </Section>

        <Section title={t('contactFeedback.title')} icon={<Lightbulb />}>
          <p>
            <Trans i18nKey="contactFeedback.paragraph1" ns="documentation"
                components={{ 1: <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium ml-1" /> }}
                // Si usas React Router Link, el componente sería:
                // components={{ 1: <Link to="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium ml-1" /> }}
            />
          </p>
        </Section>

      </div>
    </div>
  );
}

export default DocumentationPage;
