import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Globe, Radio } from 'lucide-react';
import { ARTIFACTS, HERO_IMAGE_PATH, type Artifact, type BlueprintHotspot } from './data/artifacts';
import { getLocalizedArtifact } from './data/artifactsEn';
import { TRANSLATIONS, type Language } from './data/translations';
import { PlanetaryDiscoveryMap } from './components/PlanetaryDiscoveryMap';
import { SpacecraftBlueprint2D } from './components/SpacecraftBlueprint2D';
import { SpacecraftViewer3D } from './components/SpacecraftViewer3D';
import { ArchivalPhotoLightbox } from './components/ArchivalPhotoLightbox';
import { CatalogSection } from './components/CatalogSection';
import { TimelineSection } from './components/TimelineSection';

export default function App() {
  const [lang, setLang] = useState<Language>('tr');
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>(ARTIFACTS[0].id);
  const [activeHotspotId, setActiveHotspotId] = useState<string>(ARTIFACTS[0].hotspots[0].id);
  const [modelDimension, setModelDimension] = useState<'3d' | '2d'>('3d');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroImgError, setHeroImgError] = useState(false);

  const t = TRANSLATIONS[lang];

  const localizedArtifacts = useMemo(
    () => ARTIFACTS.map((item) => getLocalizedArtifact(item, lang)),
    [lang]
  );

  const selectedArtifact = useMemo(
    () =>
      localizedArtifacts.find((item) => item.id === selectedArtifactId) ??
      localizedArtifacts[0],
    [localizedArtifacts, selectedArtifactId]
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = TRANSLATIONS[lang].docTitle;
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / total) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectArtifact = (artifact: Artifact, scrollToWorkshop = true) => {
    setSelectedArtifactId(artifact.id);
    setActiveHotspotId(artifact.hotspots[0].id);
    if (scrollToWorkshop) {
      const el = document.getElementById('atolye');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const currentIndex = localizedArtifacts.findIndex((a) => a.id === selectedArtifact.id);
  const prevArtifact =
    localizedArtifacts[(currentIndex - 1 + localizedArtifacts.length) % localizedArtifacts.length];
  const nextArtifact = localizedArtifacts[(currentIndex + 1) % localizedArtifacts.length];

  const handleStartStory = () => {
    handleSelectArtifact(localizedArtifacts[0], true);
  };

  const handleToggleLanguage = () => {
    setLang((prev) => (prev === 'tr' ? 'en' : 'tr'));
  };

  return (
    <div className="min-h-screen bg-[#090B0E] text-[#F3F0E8] flex flex-col">
      {/* Three-Zone Top Bar */}
      <header className="sticky top-0 z-40 bg-[#090B0E]/92 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#giris"
            className="font-serif text-xl md:text-2xl font-medium tracking-tight text-[#F3F0E8] whitespace-nowrap shrink-0"
          >
            {t.brand}
          </a>

          {/* Zone 2: 4 Single-line Navigation Links */}
          <nav
            aria-label={lang === 'tr' ? 'Ana gezinme' : 'Main navigation'}
            className="hidden md:flex items-center gap-7 text-sm text-[#B5B0A6]"
          >
            <a
              href="#harita"
              className="hover:text-[#F3F0E8] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.map}
            </a>
            <a
              href="#atolye"
              className="hover:text-[#F3F0E8] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.studio}
            </a>
            <a
              href="#koleksiyon"
              className="hover:text-[#F3F0E8] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.catalog}
            </a>
            <a
              href="#kronoloji"
              className="hover:text-[#F3F0E8] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.timeline}
            </a>
          </nav>

          {/* Zone 3: Language Switch Button & Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleLanguage}
              aria-label={t.switchLangAria}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md border border-white/15 text-[#F3F0E8] hover:border-[#D97736] hover:text-[#E28A47] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.switchLangLabel}</span>
            </button>
            <button
              type="button"
              onClick={handleStartStory}
              className="px-4 py-2 text-xs font-semibold rounded-md bg-[#D97736] hover:bg-[#E28A47] text-[#090B0E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.startStory}
            </button>
          </div>
        </div>

        {/* Reading Depth Hairline Progress Bar */}
        <div className="h-[2px] w-full bg-white/5" aria-hidden="true">
          <div
            className="h-full bg-[#D97736] transition-[width] duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Exhibition Opening */}
        <section
          id="giris"
          className="relative border-b border-white/10 overflow-hidden"
        >
          <div className="relative min-h-[78vh] flex items-end">
            {/* Full-Bleed Archival Backdrop */}
            {!heroImgError ? (
              <img
                src={HERO_IMAGE_PATH}
                alt={t.hero.title}
                referrerPolicy="no-referrer"
                onError={() => setHeroImgError(true)}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1B1F27] via-[#0E1117] to-[#090B0E]" />
            )}

            {/* Measured Multi-Stop Scrim for Guaranteed WCAG AA Legibility */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-[#090B0E] via-[#090B0E]/75 to-[#090B0E]/35"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#090B0E]/90 via-[#090B0E]/55 to-transparent"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-16 md:py-24">
              <div className="max-w-2xl">
                <p className="text-xs font-mono uppercase tracking-widest text-[#E28A47] mb-4">
                  {t.hero.kicker}
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#F3F0E8] leading-[1.08] tracking-tight">
                  {t.hero.title}
                </h1>
                <p className="text-base md:text-lg text-[#D6D1C7] mt-5 leading-relaxed max-w-xl">
                  {t.hero.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#harita"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-md bg-[#D97736] hover:bg-[#E28A47] text-[#090B0E] text-sm font-semibold transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>{t.hero.cta}</span>
                    <ArrowDown className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Column Exhibition Overview Strip Below Hero */}
          <div className="bg-[#0D1015] border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              <div className="pt-2 lg:pt-0 lg:pr-6">
                <p className="text-xs font-mono text-[#9B978E]">{t.hero.stats.scopeLabel}</p>
                <p className="font-serif text-2xl font-medium text-[#F3F0E8] mt-1 tabular-nums">
                  {t.hero.stats.scopeValue}
                </p>
                <p className="text-xs text-[#B5B0A6] mt-0.5">{t.hero.stats.scopeDesc}</p>
              </div>
              <div className="pt-2 lg:pt-0 lg:px-6">
                <p className="text-xs font-mono text-[#9B978E]">
                  {t.hero.stats.inventoryLabel}
                </p>
                <p className="font-serif text-2xl font-medium text-[#F3F0E8] mt-1 tabular-nums">
                  {t.hero.stats.inventoryValue}
                </p>
                <p className="text-xs text-[#B5B0A6] mt-0.5">{t.hero.stats.inventoryDesc}</p>
              </div>
              <div className="pt-4 lg:pt-0 lg:px-6">
                <p className="text-xs font-mono text-[#9B978E]">{t.hero.stats.spanLabel}</p>
                <p className="font-serif text-2xl font-medium text-[#F3F0E8] mt-1 tabular-nums">
                  {t.hero.stats.spanValue}
                </p>
                <p className="text-xs text-[#B5B0A6] mt-0.5">{t.hero.stats.spanDesc}</p>
              </div>
              <div className="pt-4 lg:pt-0 lg:pl-6">
                <p className="text-xs font-mono text-[#9B978E]">
                  {t.hero.stats.distanceLabel}
                </p>
                <p className="font-serif text-2xl font-medium text-[#F3F0E8] mt-1 tabular-nums">
                  {t.hero.stats.distanceValue}
                </p>
                <p className="text-xs text-[#B5B0A6] mt-0.5">{t.hero.stats.distanceDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Interactive Planetary Landing Sites Map */}
        <PlanetaryDiscoveryMap
          lang={lang}
          artifacts={localizedArtifacts}
          selectedArtifact={selectedArtifact}
          onSelectArtifact={handleSelectArtifact}
        />

        {/* Section 2: Immersive Narrative Story & Interactive 3D / 2D Workshop */}
        <section id="atolye" className="py-20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6">
            {/* Chapter Rail Switcher */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 mb-12 border-b border-white/10">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#E28A47] mb-2">
                  {t.workshop.kicker}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#9B978E]">
                  <span>
                    {t.workshop.chapterOf} {selectedArtifact.chapterNumber} / 06
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedArtifact.bodyLabel.toUpperCase()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedArtifact.accessionId}</span>
                </div>
              </div>

              {/* Direct Chapter Selector Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#12161E] border border-white/10 rounded-lg">
                {localizedArtifacts.map((item) => {
                  const active = item.id === selectedArtifact.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectArtifact(item, false)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#D97736] text-[#090B0E]'
                          : 'text-[#B5B0A6] hover:text-[#F3F0E8]'
                      }`}
                    >
                      <span className="font-mono tabular-nums mr-1.5">
                        {item.chapterNumber}.
                      </span>
                      {item.mission.split('(')[0].trim()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tier 1: Literary Editorial Story + Archival Photography Lightbox */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
              {/* Narrative Essay Column */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#F3F0E8] leading-[1.12]">
                    {selectedArtifact.name}
                  </h2>
                  <p className="font-serif italic text-lg md:text-xl text-[#C7C2B8] mt-2.5">
                    {selectedArtifact.subtitle}
                  </p>
                </div>

                <div className="border-t border-white/10 pt-6 space-y-5 max-w-prose">
                  <p className="drop-cap text-base text-[#E7E2D8] leading-[1.8]">
                    {selectedArtifact.storyOpening}
                  </p>
                  <p className="text-base text-[#D6D1C7] leading-[1.8]">
                    {selectedArtifact.storyContinuation}
                  </p>
                </div>

                {/* Curatorial Pull Quote (Top/Bottom hairline dividers, no left bar) */}
                <blockquote className="py-6 my-6 border-t border-b border-white/15">
                  <p className="font-serif italic text-2xl text-[#F3F0E8] leading-snug">
                    {selectedArtifact.pullQuote}
                  </p>
                  <footer className="text-xs font-mono text-[#9B978E] mt-3">
                    — {selectedArtifact.pullQuoteAttribution}
                  </footer>
                </blockquote>

                {/* Final Recorded Transmission Box */}
                <div className="border border-white/10 bg-[#12161E] rounded-lg p-5">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-[#E28A47] mb-2">
                    <span className="inline-flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5" />
                      <span>{t.workshop.finalTxTitle}</span>
                    </span>
                    <span className="tabular-nums text-[#9B978E]">
                      {selectedArtifact.finalTransmission.timestamp}
                    </span>
                  </div>
                  <p className="font-mono text-sm text-[#F3F0E8] leading-relaxed">
                    {selectedArtifact.finalTransmission.message}
                  </p>
                  <p className="text-xs text-[#9B978E] mt-2 leading-relaxed">
                    {selectedArtifact.finalTransmission.context}
                  </p>
                </div>
              </div>

              {/* Archival Photograph & Accession Metadata Column */}
              <div className="lg:col-span-6 space-y-6">
                <ArchivalPhotoLightbox lang={lang} artifact={selectedArtifact} />

                {/* Museum Accession Definition List */}
                <div className="border border-white/10 bg-[#12161E] rounded-lg p-5">
                  <h3 className="text-xs font-mono uppercase tracking-widest text-[#9B978E] pb-3 border-b border-white/10">
                    {t.workshop.accessionTitle}
                  </h3>
                  <dl className="divide-y divide-white/10 text-xs mt-1">
                    <div className="py-2.5 flex justify-between gap-4">
                      <dt className="text-[#9B978E]">{t.workshop.siteLabel}</dt>
                      <dd className="text-[#F3F0E8] text-right font-medium">
                        {selectedArtifact.siteName}
                      </dd>
                    </div>
                    <div className="py-2.5 flex justify-between gap-4">
                      <dt className="text-[#9B978E]">{t.workshop.abandonedLabel}</dt>
                      <dd className="font-mono tabular-nums text-[#F3F0E8] text-right">
                        {selectedArtifact.abandonedDate}
                      </dd>
                    </div>
                    <div className="py-2.5 flex justify-between gap-4">
                      <dt className="text-[#9B978E]">{t.workshop.massLabel}</dt>
                      <dd className="font-mono tabular-nums text-[#F3F0E8]">
                        {selectedArtifact.massLeftKg}
                      </dd>
                    </div>
                    <div className="py-2.5 flex justify-between gap-4">
                      <dt className="text-[#9B978E]">{t.workshop.dimensionsLabel}</dt>
                      <dd className="font-mono tabular-nums text-[#F3F0E8] text-right">
                        {selectedArtifact.dimensions}
                      </dd>
                    </div>
                    <div className="py-2.5 flex justify-between gap-4">
                      <dt className="text-[#9B978E]">{t.workshop.statusNoteLabel}</dt>
                      <dd className="text-[#E28A47] text-right max-w-xs">
                        {selectedArtifact.statusNote}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            {/* Tier 2: Interactive 3D & 2D Model Workbench */}
            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-medium text-[#F3F0E8]">
                    {t.workshop.modelTitle}
                  </h3>
                  <p className="text-sm text-[#B5B0A6] mt-1 max-w-2xl">
                    {modelDimension === '3d' ? t.workshop.modelDesc3d : t.workshop.modelDesc2d}
                  </p>
                </div>

                {/* Dimension Switcher: 3D vs 2D */}
                <div className="flex items-center gap-1 p-1 bg-[#12161E] border border-white/10 rounded-lg self-start">
                  <button
                    type="button"
                    onClick={() => setModelDimension('3d')}
                    className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      modelDimension === '3d'
                        ? 'bg-[#D97736] text-[#090B0E]'
                        : 'text-[#B5B0A6] hover:text-[#F3F0E8]'
                    }`}
                  >
                    {t.workshop.tab3d}
                  </button>
                  <button
                    type="button"
                    onClick={() => setModelDimension('2d')}
                    className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      modelDimension === '2d'
                        ? 'bg-[#D97736] text-[#090B0E]'
                        : 'text-[#B5B0A6] hover:text-[#F3F0E8]'
                    }`}
                  >
                    {t.workshop.tab2d}
                  </button>
                </div>
              </div>

              {modelDimension === '3d' ? (
                <SpacecraftViewer3D
                  lang={lang}
                  artifact={selectedArtifact}
                  activeHotspotId={activeHotspotId}
                  onSelectHotspot={(hotspot: BlueprintHotspot) =>
                    setActiveHotspotId(hotspot.id)
                  }
                />
              ) : (
                <SpacecraftBlueprint2D
                  lang={lang}
                  artifact={selectedArtifact}
                  activeHotspotId={activeHotspotId}
                  onSelectHotspot={(hotspot: BlueprintHotspot) =>
                    setActiveHotspotId(hotspot.id)
                  }
                />
              )}

              {/* Sequential Story Navigation */}
              <div className="pt-6 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectArtifact(prevArtifact, true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-white/15 text-xs font-medium text-[#F3F0E8] hover:border-[#D97736] hover:text-[#E28A47] transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>
                    {t.workshop.prevPrefix}: {prevArtifact.chapterNumber}. {prevArtifact.name}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectArtifact(nextArtifact, true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#12161E] border border-[#D97736]/50 text-xs font-medium text-[#F3F0E8] hover:bg-[#D97736] hover:text-[#090B0E] transition-colors cursor-pointer"
                >
                  <span>
                    {t.workshop.nextPrefix}: {nextArtifact.chapterNumber}. {nextArtifact.name}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Filterable Archival Catalog */}
        <CatalogSection
          lang={lang}
          artifacts={localizedArtifacts}
          selectedArtifactId={selectedArtifact.id}
          onSelectArtifact={handleSelectArtifact}
        />

        {/* Section 4: Chronological Timeline */}
        <TimelineSection
          lang={lang}
          artifacts={localizedArtifacts}
          selectedArtifactId={selectedArtifact.id}
          onSelectArtifact={handleSelectArtifact}
        />
      </main>

      {/* Quiet Curatorial Footer */}
      <footer className="bg-[#07090C] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-serif text-xl text-[#F3F0E8]">{t.brand}</p>
            <p className="text-xs text-[#9B978E] mt-1">{t.footer.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#9B978E]">
            <a href="#giris" className="hover:text-[#F3F0E8] transition-colors">
              {t.footer.top}
            </a>
            <a href="#harita" className="hover:text-[#F3F0E8] transition-colors">
              {t.footer.map}
            </a>
            <a href="#atolye" className="hover:text-[#F3F0E8] transition-colors">
              {t.footer.studio}
            </a>
            <a href="#koleksiyon" className="hover:text-[#F3F0E8] transition-colors">
              {t.footer.catalog}
            </a>
            <a href="#kronoloji" className="hover:text-[#F3F0E8] transition-colors">
              {t.footer.timeline}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
