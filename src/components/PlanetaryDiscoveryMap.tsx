import React, { useState } from 'react';
import { ArrowRight, Compass } from 'lucide-react';
import type { Artifact, CelestialBody } from '../data/artifacts';
import { TRANSLATIONS, type Language } from '../data/translations';

interface PlanetaryDiscoveryMapProps {
  lang: Language;
  artifacts: Artifact[];
  selectedArtifact: Artifact;
  onSelectArtifact: (artifact: Artifact, scrollToWorkshop?: boolean) => void;
}

export const PlanetaryDiscoveryMap: React.FC<PlanetaryDiscoveryMapProps> = ({
  lang,
  artifacts,
  selectedArtifact,
  onSelectArtifact,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeBody, setActiveBody] = useState<CelestialBody>(selectedArtifact.body);

  const visibleArtifacts = artifacts.filter((a) => a.body === activeBody);
  const highlighted =
    visibleArtifacts.find((a) => a.id === selectedArtifact.id) ?? visibleArtifacts[0];

  const handleBodyChange = (body: CelestialBody) => {
    setActiveBody(body);
    const firstOnBody = artifacts.find((a) => a.body === body);
    if (firstOnBody && selectedArtifact.body !== body) {
      onSelectArtifact(firstOnBody, false);
    }
  };

  return (
    <section id="harita" className="py-20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[#E28A47] mb-3">
              {t.map.kicker}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#F3F0E8]">
              {t.map.title}
            </h2>
            <p className="text-sm md:text-base text-[#B5B0A6] mt-2.5 max-w-2xl leading-relaxed">
              {t.map.desc}
            </p>
          </div>

          {/* Segmented Body Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[#12161E] border border-white/10 rounded-lg self-start">
            <button
              type="button"
              onClick={() => handleBodyChange('moon')}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeBody === 'moon'
                  ? 'bg-[#D97736] text-[#090B0E]'
                  : 'text-[#B5B0A6] hover:text-[#F3F0E8]'
              }`}
            >
              {t.map.moonTab}
            </button>
            <button
              type="button"
              onClick={() => handleBodyChange('mars')}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeBody === 'mars'
                  ? 'bg-[#D97736] text-[#090B0E]'
                  : 'text-[#B5B0A6] hover:text-[#F3F0E8]'
              }`}
            >
              {t.map.marsTab}
            </button>
          </div>
        </div>

        {/* Interactive Split Map & Telemetry Briefing */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* 2D Topographic Orbital Map */}
          <div className="lg:col-span-8 relative border border-white/10 bg-[#0D1015] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#11151C] text-xs font-mono text-[#9B978E]">
              <span>
                {activeBody === 'moon' ? t.map.moonProjection : t.map.marsProjection}
              </span>
              <span className="tabular-nums">
                {activeBody === 'moon' ? t.map.moonDistance : t.map.marsDistance}
              </span>
            </div>

            <div className="relative aspect-[16/10] w-full bg-[#080A0D] overflow-hidden">
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full"
                role="img"
                aria-label={
                  activeBody === 'moon'
                    ? 'Ay iniş alanları etkileşimli haritası'
                    : 'Mars iniş alanları etkileşimli haritası'
                }
              >
                <defs>
                  <radialGradient id="moon-sphere" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#26282D" />
                    <stop offset="72%" stopColor="#17191E" />
                    <stop offset="100%" stopColor="#0D0F13" />
                  </radialGradient>
                  <radialGradient id="mars-sphere" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3B1F16" />
                    <stop offset="72%" stopColor="#23120D" />
                    <stop offset="100%" stopColor="#120A08" />
                  </radialGradient>
                </defs>

                {/* Lat / Lon Coordinate Lines */}
                <g stroke="rgba(243,240,232,0.06)" strokeWidth="1" fill="none">
                  {[100, 200, 300, 400].map((y) => (
                    <line key={`h-${y}`} x1="0" y1={y} x2="800" y2={y} />
                  ))}
                  {[160, 320, 480, 640].map((x) => (
                    <line key={`v-${x}`} x1={x} y1="0" x2={x} y2="500" />
                  ))}
                </g>

                {activeBody === 'moon' ? (
                  <g>
                    {/* Lunar Disk Projection */}
                    <circle
                      cx="400"
                      cy="250"
                      r="208"
                      fill="url(#moon-sphere)"
                      stroke="rgba(243,240,232,0.16)"
                      strokeWidth="1.2"
                    />
                    {/* Mare Basins */}
                    <ellipse
                      cx="300"
                      cy="240"
                      rx="95"
                      ry="110"
                      fill="rgba(10,12,16,0.45)"
                      stroke="rgba(243,240,232,0.06)"
                    />
                    <ellipse
                      cx="475"
                      cy="220"
                      rx="65"
                      ry="58"
                      fill="rgba(10,12,16,0.42)"
                      stroke="rgba(243,240,232,0.06)"
                    />
                    <circle
                      cx="370"
                      cy="145"
                      r="46"
                      fill="rgba(10,12,16,0.38)"
                      stroke="rgba(243,240,232,0.06)"
                    />
                    {/* Selenographic Equator & Prime Meridian */}
                    <line
                      x1="192"
                      y1="250"
                      x2="608"
                      y2="250"
                      stroke="rgba(243,240,232,0.12)"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1="400"
                      y1="42"
                      x2="400"
                      y2="458"
                      stroke="rgba(243,240,232,0.12)"
                      strokeDasharray="4 4"
                    />
                    {/* Subtle Region Labels */}
                    <g fill="rgba(155,151,142,0.55)" fontSize="9.5" className="font-mono">
                      <text x="242" y="210">OCEANUS PROCELLARUM</text>
                      <text x="445" y="200">MARE TRANQUILLITATIS</text>
                      <text x="330" y="106">MARE IMBRIUM</text>
                    </g>
                  </g>
                ) : (
                  <g>
                    {/* Martian Mercator Terrain Contours */}
                    <rect
                      x="48"
                      y="38"
                      width="704"
                      height="424"
                      rx="6"
                      fill="url(#mars-sphere)"
                      stroke="rgba(217,119,54,0.22)"
                    />
                    {/* Topographic Basins & Valles Marineris */}
                    <path
                      d="M 110 250 Q 260 220 390 258 T 660 240"
                      fill="none"
                      stroke="rgba(226,138,71,0.24)"
                      strokeWidth="2.2"
                    />
                    <path
                      d="M 180 140 Q 320 110 470 160 T 680 145"
                      fill="none"
                      stroke="rgba(243,240,232,0.08)"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M 140 345 Q 320 390 520 330 T 690 360"
                      fill="none"
                      stroke="rgba(243,240,232,0.08)"
                      strokeWidth="1.2"
                    />
                    <ellipse
                      cx="545"
                      cy="285"
                      rx="72"
                      ry="44"
                      fill="rgba(12,6,4,0.35)"
                      stroke="rgba(226,138,71,0.16)"
                    />
                    <line
                      x1="48"
                      y1="250"
                      x2="752"
                      y2="250"
                      stroke="rgba(226,138,71,0.16)"
                      strokeDasharray="4 4"
                    />
                    <g fill="rgba(226,138,71,0.55)" fontSize="9.5" className="font-mono">
                      <text x="150" y="182">CHRYSE PLANITIA</text>
                      <text x="315" y="196">ARES VALLIS</text>
                      <text x="485" y="302">MERIDIANI PLANUM</text>
                      <text x="200" y="274">VALLES MARINERIS</text>
                    </g>
                  </g>
                )}
              </svg>

              {/* Interactive Landing Site Pins */}
              {visibleArtifacts.map((artifact) => {
                const isSelected = artifact.id === highlighted.id;
                return (
                  <button
                    key={artifact.id}
                    type="button"
                    onClick={() => onSelectArtifact(artifact, false)}
                    style={{
                      left: `${artifact.mapPosition.x}%`,
                      top: `${artifact.mapPosition.y}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                    aria-label={`${artifact.name} iniş noktasını seç`}
                  >
                    <span
                      className={`relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-150 ${
                        isSelected
                          ? 'bg-[#D97736] border-[#F3F0E8] text-[#090B0E] scale-110 shadow-lg'
                          : 'bg-[#12161E]/90 border-[#D97736]/70 text-[#F3F0E8] hover:scale-105 hover:border-[#F3F0E8]'
                      }`}
                    >
                      <span className="font-mono text-xs font-semibold tabular-nums">
                        {artifact.chapterNumber}
                      </span>
                    </span>
                    <span
                      className={`mt-1.5 block px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-colors ${
                        isSelected
                          ? 'bg-[#090B0E]/90 text-[#E28A47] border border-[#D97736]/40'
                          : 'bg-[#090B0E]/75 text-[#D6D1C7] group-hover:text-[#F3F0E8]'
                      }`}
                    >
                      {artifact.mission}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Site Telemetry & Quick Story Jump Card */}
          <div className="lg:col-span-4 border border-white/10 bg-[#12161E] rounded-lg p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-[#9B978E] pb-4 border-b border-white/10">
                <span>
                  {t.map.chapterPrefix} {highlighted.chapterNumber}
                </span>
                <span>{highlighted.accessionId}</span>
              </div>

              <h3 className="font-serif text-2xl font-medium text-[#F3F0E8] mt-5">
                {highlighted.name}
              </h3>
              <p className="text-xs font-mono text-[#E28A47] mt-1.5">
                {highlighted.siteName}
              </p>

              <p className="text-sm text-[#C7C2B8] leading-relaxed mt-4">
                {highlighted.subtitle}.{' '}
                {t.map.sinceText(highlighted.abandonedDate, highlighted.yearsSilent)}
              </p>

              {/* Environment Specification List */}
              <dl className="mt-6 pt-5 border-t border-white/10 space-y-3 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#9B978E]">{t.map.coordsLabel}</dt>
                  <dd className="font-mono tabular-nums text-[#F3F0E8] text-right">
                    {highlighted.coordinates}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#9B978E]">{t.map.tempLabel}</dt>
                  <dd className="font-mono tabular-nums text-[#F3F0E8]">
                    {highlighted.environment.tempRange}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#9B978E]">{t.map.delayLabel}</dt>
                  <dd className="font-mono tabular-nums text-[#F3F0E8]">
                    {highlighted.environment.signalDelay}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#9B978E]">{t.map.statusLabel}</dt>
                  <dd className="text-[#E28A47] font-medium">
                    {t.statusMap[highlighted.status]}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => onSelectArtifact(highlighted, true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-[#D97736] hover:bg-[#E28A47] text-[#090B0E] text-sm font-semibold transition-colors cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>{t.map.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
