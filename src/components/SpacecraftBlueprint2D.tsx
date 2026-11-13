import React, { useState } from 'react';
import { Grid, Layers, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import type { Artifact, BlueprintHotspot, BlueprintModelKey } from '../data/artifacts';
import { TRANSLATIONS, type Language, type UITranslations } from '../data/translations';

export type InspectionMode = 'blueprint' | 'xray' | 'weathering';

interface SpacecraftBlueprint2DProps {
  lang: Language;
  artifact: Artifact;
  activeHotspotId: string;
  onSelectHotspot: (hotspot: BlueprintHotspot) => void;
}

export const SpacecraftBlueprint2D: React.FC<SpacecraftBlueprint2DProps> = ({
  lang,
  artifact,
  activeHotspotId,
  onSelectHotspot,
}) => {
  const t = TRANSLATIONS[lang];
  const [mode, setMode] = useState<InspectionMode>('blueprint');
  const [showGrid, setShowGrid] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [weatherProgress, setWeatherProgress] = useState(75); // 0..100 (launch -> 2026)
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number } | null>(null);

  const activeHotspot =
    artifact.hotspots.find((h) => h.id === activeHotspotId) ?? artifact.hotspots[0];

  const currentYear = Math.round(
    artifact.launchYear + ((2026 - artifact.launchYear) * weatherProgress) / 100
  );

  const weatheringText =
    weatherProgress < 34
      ? artifact.weatheringStages.early
      : weatherProgress < 72
      ? artifact.weatheringStages.mid
      : artifact.weatheringStages.present;

  const dustOpacity = mode === 'weathering' ? (weatherProgress / 100) * 0.72 : 0;
  const isMars = artifact.body === 'mars';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 800);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 520);
    setCursorCoords({ x, y });
  };

  return (
    <div className="border border-white/10 bg-[#0D1015] rounded-lg overflow-hidden">
      {/* Top Workbench Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-b border-white/10 bg-[#11151C]">
        <div className="flex items-center gap-1 p-1 bg-[#090B0E] rounded-md border border-white/10">
          <button
            type="button"
            onClick={() => setMode('blueprint')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'blueprint'
                ? 'bg-[#D97736] text-[#090B0E]'
                : 'text-[#B5B0A6] hover:text-[#F3F0E8]'
            }`}
          >
            {t.blueprint2d.modeBlueprint}
          </button>
          <button
            type="button"
            onClick={() => setMode('xray')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'xray'
                ? 'bg-[#D97736] text-[#090B0E]'
                : 'text-[#B5B0A6] hover:text-[#F3F0E8]'
            }`}
          >
            {t.blueprint2d.modeXray}
          </button>
          <button
            type="button"
            onClick={() => setMode('weathering')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'weathering'
                ? 'bg-[#D97736] text-[#090B0E]'
                : 'text-[#B5B0A6] hover:text-[#F3F0E8]'
            }`}
          >
            {t.blueprint2d.modeWeathering}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowGrid((prev) => !prev)}
            aria-label={t.blueprint2d.grid}
            title={t.blueprint2d.grid}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              showGrid
                ? 'border-[#D97736]/60 text-[#F3F0E8] bg-[#D97736]/10'
                : 'border-white/10 text-[#9B978E] hover:text-[#F3F0E8]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{t.blueprint2d.grid}</span>
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, Number((z - 0.2).toFixed(1))))}
            disabled={zoom <= 1}
            aria-label={t.blueprint2d.zoomOutAria}
            className="p-1.5 rounded border border-white/10 text-[#B5B0A6] hover:text-[#F3F0E8] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono tabular-nums text-[#9B978E] min-w-[3.25rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.2).toFixed(1))))}
            disabled={zoom >= 1.6}
            aria-label={t.blueprint2d.zoomInAria}
            className="p-1.5 rounded border border-white/10 text-[#B5B0A6] hover:text-[#F3F0E8] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          {zoom !== 1 && (
            <button
              type="button"
              onClick={() => setZoom(1)}
              aria-label={t.blueprint2d.resetAria}
              className="p-1.5 rounded border border-white/10 text-[#B5B0A6] hover:text-[#F3F0E8] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main 2D Technical SVG Viewport */}
      <div
        className="relative aspect-[16/10] w-full overflow-hidden bg-[#080A0D] cursor-crosshair select-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCursorCoords(null)}
      >
        {/* Scaled Stage Container */}
        <div
          className="w-full h-full transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <svg
            viewBox="0 0 800 520"
            className="w-full h-full"
            role="img"
            aria-label={`${artifact.name} etkileşimli 2D teknik modeli`}
          >
            <defs>
              <pattern
                id="blueprint-grid-minor"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="rgba(243,240,232,0.04)"
                  strokeWidth="0.75"
                />
              </pattern>
              <pattern
                id="blueprint-grid-major"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <rect width="100" height="100" fill="url(#blueprint-grid-minor)" />
                <path
                  d="M 100 0 L 0 0 0 100"
                  fill="none"
                  stroke="rgba(243,240,232,0.09)"
                  strokeWidth="1"
                />
              </pattern>
              <radialGradient id="xray-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D97736" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#D97736" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="mars-dust-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B4532A" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#8C3B1E" stopOpacity="0.85" />
              </linearGradient>
              <linearGradient id="lunar-dust-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9B978E" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#52504A" stopOpacity="0.72" />
              </linearGradient>
            </defs>

            {/* Optional Technical Coordinate Grid */}
            {showGrid && (
              <rect width="800" height="520" fill="url(#blueprint-grid-major)" />
            )}

            {/* Horizon & Planetary Regolith Baseline */}
            <g opacity={mode === 'xray' ? 0.35 : 0.9}>
              <path
                d="M 40 432 Q 220 424 400 432 T 760 430"
                fill="none"
                stroke={isMars ? 'rgba(217,119,54,0.35)' : 'rgba(243,240,232,0.22)'}
                strokeWidth="1.25"
              />
              <line
                x1="40"
                y1="452"
                x2="760"
                y2="452"
                stroke="rgba(243,240,232,0.08)"
                strokeDasharray="4 6"
              />
            </g>

            {/* Dimension Ruler Left */}
            <g className="font-mono" fill="rgba(155,151,142,0.75)" fontSize="10">
              <line x1="56" y1="88" x2="56" y2="432" stroke="rgba(155,151,142,0.25)" />
              <line x1="50" y1="88" x2="62" y2="88" stroke="rgba(155,151,142,0.35)" />
              <line x1="50" y1="432" x2="62" y2="432" stroke="rgba(155,151,142,0.35)" />
              <text x="64" y="102" fontSize="9.5" letterSpacing="0.06em">
                {artifact.dimensions.split('·')[0].trim()}
              </text>
            </g>

            {/* Specific Craft 2D Vector Schematic */}
            <CraftVectorDrawing
              modelKey={artifact.modelKey}
              mode={mode}
              dustOpacity={dustOpacity}
              isMars={isMars}
              activeHotspotId={activeHotspot.id}
              labels={t.blueprint2d}
            />

            {/* Weathering Atmospheric & Surface Particles */}
            {mode === 'weathering' && (
              <g pointerEvents="none" opacity={Math.max(0.15, weatherProgress / 100)}>
                {/* Dust layer across ground and lower craft */}
                <path
                  d="M 110 432 Q 260 418 410 428 Q 570 438 690 432 L 690 450 L 110 450 Z"
                  fill={isMars ? 'url(#mars-dust-grad)' : 'url(#lunar-dust-grad)'}
                />
                {/* Fine micrometeorite / dust flecks */}
                {[
                  [195, 160], [260, 210], [320, 140], [450, 170], [530, 230],
                  [600, 180], [230, 310], [380, 285], [490, 325], [580, 295],
                  [305, 365], [440, 385], [545, 360],
                ].map(([cx, cy], idx) => (
                  <circle
                    key={idx}
                    cx={cx}
                    cy={cy}
                    r={idx % 3 === 0 ? 1.8 : 1.1}
                    fill={isMars ? '#E28A47' : '#D4D0C8'}
                    opacity={0.2 + (weatherProgress / 100) * 0.55}
                  />
                ))}
              </g>
            )}
          </svg>

          {/* Interactive Numbered Hotspots */}
          {artifact.hotspots.map((hotspot) => {
            const isSelected = hotspot.id === activeHotspot.id;
            return (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => onSelectHotspot(hotspot)}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                aria-label={`${hotspot.number}. ${hotspot.title}`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full font-mono text-xs font-semibold tabular-nums flex items-center justify-center transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#D97736] text-[#090B0E] ring-4 ring-[#D97736]/30 scale-110 z-20'
                    : 'bg-[#12161E]/90 text-[#F3F0E8] border border-white/30 hover:border-[#D97736] hover:text-[#E28A47] z-10'
                }`}
              >
                {hotspot.number}
              </button>
            );
          })}
        </div>

        {/* Corner Telemetry Overlay */}
        <div className="pointer-events-none absolute top-3 left-4 flex items-center gap-3 text-[11px] font-mono text-[#9B978E] tabular-nums">
          <span>{artifact.accessionId}</span>
          <span aria-hidden="true">·</span>
          <span>
            {mode === 'blueprint'
              ? t.blueprint2d.orthographicTag
              : mode === 'xray'
              ? t.blueprint2d.xrayTag
              : `${t.blueprint2d.weatheringTag} · ${currentYear}`}
          </span>
        </div>

        <div className="pointer-events-none absolute bottom-3 right-4 text-[11px] font-mono text-[#9B978E] tabular-nums">
          {cursorCoords ? `X:${cursorCoords.x} Y:${cursorCoords.y}` : artifact.coordinates}
        </div>
      </div>

      {/* Mode-Specific Interactive Sub-Bar */}
      {mode === 'weathering' && (
        <div className="px-5 py-4 border-t border-white/10 bg-[#10141B] space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <label htmlFor="weathering-slider" className="font-medium text-[#F3F0E8]">
              {t.blueprint2d.timeSliderLabel} ({artifact.launchYear} – 2026)
            </label>
            <span className="font-mono tabular-nums text-[#E28A47] font-semibold">
              {t.blueprint2d.selectedYearLabel(currentYear, currentYear - artifact.launchYear)}
            </span>
          </div>
          <input
            id="weathering-slider"
            type="range"
            min={0}
            max={100}
            value={weatherProgress}
            onChange={(e) => setWeatherProgress(Number(e.target.value))}
            className="w-full accent-[#D97736] cursor-pointer"
          />
          <p className="text-xs text-[#C7C2B8] leading-relaxed">{weatheringText}</p>
        </div>
      )}

      {mode === 'xray' && (
        <div className="px-5 py-3.5 border-t border-white/10 bg-[#10141B] flex items-start gap-3">
          <Layers className="w-4 h-4 text-[#E28A47] shrink-0 mt-0.5" />
          <p className="text-xs text-[#C7C2B8] leading-relaxed">
            <strong className="text-[#F3F0E8] font-medium">{t.blueprint2d.xrayNoteLabel}</strong>{' '}
            {artifact.xraySummary}
          </p>
        </div>
      )}

      {/* Selected Hotspot Narrative Detail Strip */}
      <div className="p-5 border-t border-white/10 bg-[#12161E]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#D97736] text-[#090B0E] font-mono text-xs font-semibold tabular-nums">
              {activeHotspot.number}
            </span>
            <h4 className="text-base font-semibold text-[#F3F0E8]">
              {activeHotspot.title}
            </h4>
          </div>
          <span className="text-xs font-mono text-[#9B978E]">
            {activeHotspot.partCode} · {activeHotspot.spec}
          </span>
        </div>
        <p className="text-sm text-[#D6D1C7] leading-relaxed">{activeHotspot.story}</p>

        {/* Quick Hotspot Selector Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3.5 border-t border-white/10">
          {artifact.hotspots.map((h) => {
            const active = h.id === activeHotspot.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => onSelectHotspot(h)}
                className={`px-3 py-1.5 text-xs rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-[#D97736] bg-[#D97736]/15 text-[#F3F0E8]'
                    : 'border-white/10 text-[#9B978E] hover:text-[#F3F0E8] hover:border-white/25'
                }`}
              >
                <span className="font-mono tabular-nums mr-1.5">{h.number}.</span>
                {h.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface CraftVectorProps {
  modelKey: BlueprintModelKey;
  mode: InspectionMode;
  dustOpacity: number;
  isMars: boolean;
  activeHotspotId: string;
  labels: UITranslations['blueprint2d'];
}

const CraftVectorDrawing: React.FC<CraftVectorProps> = ({
  modelKey,
  mode,
  dustOpacity,
  isMars,
  labels,
}) => {
  const isXray = mode === 'xray';
  const strokePrimary = isXray ? 'rgba(243,240,232,0.35)' : '#E7E2D8';
  const strokeSecondary = isXray ? 'rgba(243,240,232,0.2)' : 'rgba(231,226,216,0.55)';
  const accentStroke = '#E28A47';
  const shellFill = isXray ? 'rgba(217,119,54,0.04)' : 'rgba(255,255,255,0.03)';
  const dustColor = isMars ? '#B85028' : '#85827A';

  switch (modelKey) {
    case 'eagle':
      return (
        <g>
          {/* Ghost Ascent Stage Outline showing what flew away */}
          <g stroke="rgba(243,240,232,0.16)" strokeDasharray="5 5" fill="none">
            <polygon points="330,192 346,120 454,120 470,192" />
            <circle cx="382" cy="145" r="9" />
            <circle cx="418" cy="145" r="9" />
            <text
              x="400"
              y="108"
              textAnchor="middle"
              fill="rgba(155,151,142,0.55)"
              stroke="none"
              fontSize="10"
              className="font-mono"
            >
              {labels.ascentDeparted}
            </text>
          </g>

          {/* Left & Right Diagonal Landing Struts */}
          <g stroke={strokePrimary} strokeWidth="2" fill="none">
            {/* Left leg */}
            <line x1="295" y1="242" x2="184" y2="424" />
            <line x1="295" y1="278" x2="215" y2="375" stroke={strokeSecondary} />
            <line x1="305" y1="208" x2="225" y2="355" stroke={strokeSecondary} />
            <ellipse cx="182" cy="427" rx="34" ry="7" fill="rgba(226,138,71,0.12)" />

            {/* Right leg */}
            <line x1="505" y1="242" x2="616" y2="424" />
            <line x1="505" y1="278" x2="585" y2="375" stroke={strokeSecondary} />
            <line x1="495" y1="208" x2="575" y2="355" stroke={strokeSecondary} />
            <ellipse cx="618" cy="427" rx="34" ry="7" fill="rgba(226,138,71,0.12)" />

            {/* Front center leg + ladder */}
            <line x1="400" y1="268" x2="400" y2="430" />
            <ellipse cx="400" cy="432" rx="30" ry="6" fill="rgba(226,138,71,0.14)" />
            {/* Ladder rungs */}
            {[295, 315, 335, 355, 375, 395].map((y) => (
              <line key={y} x1="391" y1={y} x2="409" y2={y} stroke={accentStroke} strokeWidth="1.4" />
            ))}
            {/* Plaque plate */}
            <rect x="387" y="322" width="26" height="16" fill="rgba(226,138,71,0.22)" stroke={accentStroke} strokeWidth="1.2" />
          </g>

          {/* Octagonal Descent Stage Body */}
          <polygon
            points="300,204 500,204 522,226 522,306 500,322 300,322 278,306 278,226"
            fill={isXray ? shellFill : 'rgba(217,119,54,0.13)'}
            stroke={isXray ? strokePrimary : accentStroke}
            strokeWidth="2"
          />
          {/* Kapton foil facet lines */}
          <g stroke={isXray ? strokeSecondary : 'rgba(226,138,71,0.45)'} strokeWidth="1">
            <line x1="340" y1="204" x2="340" y2="322" />
            <line x1="460" y1="204" x2="460" y2="322" />
            <path d="M 340 242 L 372 260 L 340 288" fill="none" />
            <path d="M 460 232 L 430 270 L 460 302" fill="none" />
          </g>

          {/* Descent Engine Bell */}
          <path
            d="M 366 322 L 352 382 L 448 382 L 434 322 Z"
            fill="rgba(243,240,232,0.06)"
            stroke={strokePrimary}
            strokeWidth="1.8"
          />
          <ellipse cx="400" cy="382" rx="48" ry="6" fill="none" stroke={strokeSecondary} />

          {/* MESA / Discarded Gear on Lunar Surface */}
          <g stroke={strokeSecondary} strokeWidth="1.2" fill="rgba(243,240,232,0.05)">
            <rect x="524" y="255" width="38" height="44" />
            <rect x="530" y="405" width="24" height="22" />
            <rect x="562" y="414" width="18" height="14" />
          </g>

          {/* X-Ray Internal Tanks & Plumbing */}
          {isXray && (
            <g>
              <circle cx="332" cy="264" r="34" fill="url(#xray-glow)" stroke={accentStroke} strokeWidth="1.5" />
              <circle cx="468" cy="264" r="34" fill="url(#xray-glow)" stroke={accentStroke} strokeWidth="1.5" />
              <circle cx="400" cy="252" r="24" fill="url(#xray-glow)" stroke={accentStroke} strokeDasharray="3 3" />
              <rect x="378" y="284" width="44" height="28" fill="none" stroke="#F3F0E8" strokeWidth="1.2" />
              <text x="332" y="268" textAnchor="middle" fill="#F3F0E8" fontSize="9" className="font-mono">
                {labels.fuelLabel}
              </text>
              <text x="468" y="268" textAnchor="middle" fill="#F3F0E8" fontSize="9" className="font-mono">
                {labels.oxidizerLabel}
              </text>
            </g>
          )}

          {/* Weathering Overlay */}
          {dustOpacity > 0 && (
            <polygon
              points="300,204 500,204 522,226 522,306 500,322 300,322 278,306 278,226"
              fill={dustColor}
              opacity={dustOpacity * 0.55}
            />
          )}
        </g>
      );

    case 'lrv':
      return (
        <g>
          {/* Main Aluminum Chassis */}
          <polygon
            points="180,316 610,316 635,342 165,342"
            fill={shellFill}
            stroke={strokePrimary}
            strokeWidth="2"
          />
          <rect x="240" y="294" width="300" height="22" fill={shellFill} stroke={strokeSecondary} strokeWidth="1.5" />

          {/* Dual Tubular Seats */}
          <g stroke={strokePrimary} strokeWidth="1.8" fill="none">
            <path d="M 300 294 L 290 226 L 340 226" />
            <path d="M 366 294 L 356 226 L 406 226" />
            <line x1="296" y1="248" x2="342" y2="248" stroke={strokeSecondary} />
            <line x1="362" y1="248" x2="408" y2="248" stroke={strokeSecondary} />
          </g>

          {/* Front Console & RCA TV Camera */}
          <g stroke={strokePrimary} strokeWidth="1.6" fill={shellFill}>
            <line x1="468" y1="316" x2="462" y2="225" />
            <rect x="444" y="190" width="44" height="34" rx="3" stroke={accentStroke} />
            <circle cx="488" cy="207" r="7" fill="rgba(226,138,71,0.25)" stroke={accentStroke} />
          </g>

          {/* High-Gain Umbrella Dish Antenna */}
          <g stroke={accentStroke} strokeWidth="1.6" fill="none">
            <line x1="546" y1="316" x2="546" y2="148" stroke={strokePrimary} strokeWidth="2" />
            <path d="M 480 120 Q 546 184 612 120" fill="rgba(226,138,71,0.12)" />
            <line x1="480" y1="120" x2="612" y2="120" strokeDasharray="3 3" />
            <line x1="546" y1="148" x2="495" y2="125" strokeWidth="1" />
            <line x1="546" y1="148" x2="597" y2="125" strokeWidth="1" />
            <circle cx="546" cy="108" r="5" fill={accentStroke} />
          </g>

          {/* Wire-Mesh Wheels (Front & Rear) */}
          {[246, 542].map((cx) => (
            <g key={cx}>
              <path
                d={`M ${cx - 64} 338 Q ${cx} 298 ${cx + 64} 338`}
                fill="none"
                stroke={accentStroke}
                strokeWidth="2.4"
              />
              <circle cx={cx} cy="376" r="52" fill="rgba(243,240,232,0.03)" stroke={strokePrimary} strokeWidth="2.2" />
              <circle cx={cx} cy="376" r="34" fill="none" stroke={strokeSecondary} strokeDasharray="4 4" />
              <circle cx={cx} cy="376" r="14" fill="rgba(226,138,71,0.2)" stroke={accentStroke} />
              {[0, 45, 90, 135].map((ang) => (
                <line
                  key={ang}
                  x1={cx - 34 * Math.cos((ang * Math.PI) / 180)}
                  y1={376 - 34 * Math.sin((ang * Math.PI) / 180)}
                  x2={cx + 34 * Math.cos((ang * Math.PI) / 180)}
                  y2={376 + 34 * Math.sin((ang * Math.PI) / 180)}
                  stroke={strokeSecondary}
                  strokeWidth="1"
                />
              ))}
            </g>
          ))}

          {/* X-Ray Batteries & Wheel Hub Motors */}
          {isXray && (
            <g>
              <rect x="478" y="318" width="54" height="22" fill="url(#xray-glow)" stroke={accentStroke} strokeWidth="1.5" />
              <rect x="415" y="318" width="54" height="22" fill="url(#xray-glow)" stroke={accentStroke} strokeWidth="1.5" />
              <text x="474" y="362" textAnchor="middle" fill="#F3F0E8" fontSize="9" className="font-mono">
                {labels.lrvBatteries}
              </text>
              <circle cx="246" cy="376" r="18" fill="url(#xray-glow)" stroke={accentStroke} />
              <circle cx="542" cy="376" r="18" fill="url(#xray-glow)" stroke={accentStroke} />
            </g>
          )}

          {dustOpacity > 0 && (
            <rect x="170" y="300" width="460" height="45" fill={dustColor} opacity={dustOpacity * 0.45} />
          )}
        </g>
      );

    case 'surveyor':
      return (
        <g>
          {/* Crater Slope Ground Angle */}
          <line x1="110" y1="416" x2="690" y2="352" stroke="rgba(243,240,232,0.18)" strokeWidth="1.2" />

          {/* Vertical Solar Panel Mast */}
          <g stroke={strokePrimary} strokeWidth="2" fill={shellFill}>
            <line x1="396" y1="274" x2="396" y2="96" />
            <rect x="364" y="96" width="64" height="106" stroke={accentStroke} fill="rgba(226,138,71,0.12)" />
            {/* Solar cells grid */}
            <line x1="364" y1="130" x2="428" y2="130" stroke={strokeSecondary} strokeWidth="1" />
            <line x1="364" y1="166" x2="428" y2="166" stroke={strokeSecondary} strokeWidth="1" />
            <line x1="396" y1="96" x2="396" y2="202" stroke={strokeSecondary} strokeWidth="1" />
          </g>

          {/* Tubular Aluminum Tripod Frame */}
          <g stroke={strokePrimary} strokeWidth="2.2" fill="none">
            <polygon points="344,274 452,274 418,324 374,324" fill={shellFill} />
            {/* Left leg */}
            <line x1="344" y1="286" x2="232" y2="404" />
            <ellipse cx="232" cy="406" rx="24" ry="6" fill="rgba(243,240,232,0.1)" />
            {/* Center leg */}
            <line x1="398" y1="316" x2="398" y2="388" />
            <ellipse cx="398" cy="390" rx="22" ry="5" fill="rgba(243,240,232,0.1)" />
            {/* Right leg */}
            <line x1="452" y1="286" x2="548" y2="370" />
            <ellipse cx="548" cy="372" rx="24" ry="6" fill="rgba(243,240,232,0.1)" />
          </g>

          {/* Removed TV Camera Housing Silhouette */}
          <g>
            <rect
              x="432"
              y="206"
              width="36"
              height="48"
              stroke={accentStroke}
              strokeDasharray="4 3"
              fill="rgba(217,119,54,0.08)"
            />
            <text x="492" y="218" fill={accentStroke} fontSize="9.5" className="font-mono">
              {labels.takenByApollo12}
            </text>
          </g>

          {/* Soil Mechanics Pantograph Arm */}
          <g stroke={strokePrimary} strokeWidth="1.6" fill="none">
            <path d="M 452 290 L 510 274 L 552 308 L 598 294" />
            <path d="M 452 302 L 508 292 L 548 320 L 598 302" stroke={strokeSecondary} />
            <path d="M 598 290 L 618 298 L 604 316 L 590 304 Z" fill="rgba(226,138,71,0.22)" stroke={accentStroke} />
          </g>

          {isXray && (
            <g>
              <rect x="358" y="280" width="76" height="36" fill="url(#xray-glow)" stroke={accentStroke} />
              <circle cx="396" cy="330" r="16" fill="url(#xray-glow)" stroke={accentStroke} />
              <text x="396" y="302" textAnchor="middle" fill="#F3F0E8" fontSize="8.5" className="font-mono">
                VERNİER MOTOR + KÖPÜK KUTU
              </text>
            </g>
          )}

          {dustOpacity > 0 && (
            <polygon points="344,274 452,274 418,324 374,324" fill={dustColor} opacity={dustOpacity * 0.6} />
          )}
        </g>
      );

    case 'viking':
      return (
        <g>
          {/* High-Gain Dish Antenna */}
          <g stroke={strokePrimary} strokeWidth="2" fill="none">
            <line x1="354" y1="242" x2="354" y2="128" />
            <path
              d="M 288 118 Q 338 158 388 94"
              stroke={accentStroke}
              strokeWidth="2.5"
              fill="rgba(226,138,71,0.12)"
            />
            <line x1="338" y1="126" x2="318" y2="86" stroke={strokeSecondary} strokeWidth="1.2" />
            <circle cx="318" cy="86" r="4" fill={accentStroke} />
          </g>

          {/* Meteorology Mast & Cylindrical Cameras */}
          <g stroke={strokePrimary} strokeWidth="1.6" fill={shellFill}>
            <line x1="452" y1="242" x2="452" y2="148" />
            <circle cx="452" cy="148" r="7" stroke={accentStroke} />
            <rect x="388" y="214" width="18" height="28" />
            <rect x="424" y="214" width="18" height="28" />
          </g>

          {/* Main Hexagonal Body */}
          <polygon
            points="272,242 528,242 548,274 528,314 272,314 252,274"
            fill={shellFill}
            stroke={strokePrimary}
            strokeWidth="2.2"
          />

          {/* Twin SNAP-19 RTG Nuclear Cylinders */}
          {[226, 520].map((x, idx) => (
            <g key={x}>
              <rect
                x={idx === 0 ? 174 : 538}
                y="252"
                width="74"
                height="48"
                rx="4"
                fill="rgba(226,138,71,0.14)"
                stroke={accentStroke}
                strokeWidth="1.6"
              />
              {[0, 12, 24, 36, 48, 60].map((offset) => (
                <line
                  key={offset}
                  x1={(idx === 0 ? 180 : 544) + offset}
                  y1="252"
                  x2={(idx === 0 ? 180 : 544) + offset}
                  y2="300"
                  stroke={strokeSecondary}
                  strokeWidth="1"
                />
              ))}
            </g>
          ))}

          {/* Three Landing Legs */}
          <g stroke={strokePrimary} strokeWidth="2.2" fill="none">
            <line x1="278" y1="314" x2="218" y2="424" />
            <ellipse cx="218" cy="426" rx="26" ry="6" fill="rgba(243,240,232,0.08)" />
            <line x1="400" y1="314" x2="400" y2="424" />
            <ellipse cx="400" cy="426" rx="24" ry="5" fill="rgba(243,240,232,0.08)" />
            <line x1="522" y1="314" x2="582" y2="424" />
            <ellipse cx="582" cy="426" rx="26" ry="6" fill="rgba(243,240,232,0.08)" />
          </g>

          {/* Articulated Sample Arm */}
          <g stroke={accentStroke} strokeWidth="2" fill="none">
            <polyline points="528,266 606,232 652,276 628,314" />
            <path d="M 622 314 L 642 320 L 632 332 Z" fill="rgba(226,138,71,0.3)" />
          </g>

          {isXray && (
            <g>
              <rect x="305" y="254" width="190" height="48" fill="url(#xray-glow)" stroke={accentStroke} />
              <circle cx="211" cy="276" r="14" fill="url(#xray-glow)" stroke="#F3F0E8" />
              <circle cx="575" cy="276" r="14" fill="url(#xray-glow)" stroke="#F3F0E8" />
              <text x="400" y="282" textAnchor="middle" fill="#F3F0E8" fontSize="9.5" className="font-mono">
                {labels.vikingInternal}
              </text>
            </g>
          )}

          {dustOpacity > 0 && (
            <polygon
              points="272,242 528,242 548,274 528,314 272,314 252,274"
              fill={dustColor}
              opacity={dustOpacity * 0.65}
            />
          )}
        </g>
      );

    case 'sojourner':
      return (
        <g>
          {/* Flat Solar Panel Deck */}
          <polygon
            points="234,218 566,218 588,242 212,242"
            fill="rgba(226,138,71,0.16)"
            stroke={accentStroke}
            strokeWidth="2.2"
          />
          {/* Solar cell grid */}
          <g stroke={strokeSecondary} strokeWidth="0.9">
            {[280, 340, 400, 460, 520].map((x) => (
              <line key={x} x1={x} y1="218" x2={x} y2="242" />
            ))}
          </g>

          {/* Warm Electronics Box (WEB) */}
          <rect
            x="248"
            y="242"
            width="304"
            height="72"
            fill={shellFill}
            stroke={strokePrimary}
            strokeWidth="2"
          />

          {/* Stereo Hazard Cameras */}
          <rect x="526" y="252" width="22" height="16" stroke={strokePrimary} fill="rgba(243,240,232,0.1)" />
          <circle cx="532" cy="260" r="3" fill={accentStroke} />
          <circle cx="542" cy="260" r="3" fill={accentStroke} />

          {/* Rear APXS Sensor Arm */}
          <g stroke={accentStroke} strokeWidth="2" fill="rgba(226,138,71,0.2)">
            <line x1="248" y1="278" x2="188" y2="292" />
            <rect x="160" y="276" width="28" height="32" rx="3" />
          </g>

          {/* UHF Whip Antenna */}
          <line x1="564" y1="218" x2="612" y2="128" stroke={strokePrimary} strokeWidth="1.8" />
          <circle cx="612" cy="128" r="4" fill={accentStroke} />

          {/* Rocker-Bogie Suspension Linkage */}
          <g stroke={strokePrimary} strokeWidth="2.5" fill="none">
            <polyline points="264,376 332,290 400,376" />
            <polyline points="332,290 434,274 536,376" />
          </g>

          {/* 3 Visible Side Wheels */}
          {[264, 400, 536].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="376" r="44" fill="rgba(243,240,232,0.04)" stroke={strokePrimary} strokeWidth="2.4" />
              <circle cx={cx} cy="376" r="26" fill="none" stroke={strokeSecondary} />
              <circle cx={cx} cy="376" r="10" fill="rgba(226,138,71,0.28)" stroke={accentStroke} />
            </g>
          ))}

          {isXray && (
            <g>
              <rect x="278" y="254" width="218" height="48" fill="url(#xray-glow)" stroke={accentStroke} />
              <text x="387" y="282" textAnchor="middle" fill="#F3F0E8" fontSize="9.5" className="font-mono">
                {labels.sojournerInternal}
              </text>
            </g>
          )}

          {dustOpacity > 0 && (
            <polygon
              points="234,218 566,218 588,242 212,242"
              fill={dustColor}
              opacity={dustOpacity * 0.72}
            />
          )}
        </g>
      );

    case 'opportunity':
      return (
        <g>
          {/* High Pancam Mast & Head */}
          <g stroke={strokePrimary} strokeWidth="2.2" fill={shellFill}>
            <line x1="340" y1="242" x2="340" y2="108" />
            <rect x="296" y="76" width="88" height="32" rx="4" stroke={accentStroke} />
            <circle cx="316" cy="92" r="7" fill="rgba(226,138,71,0.28)" stroke={accentStroke} />
            <circle cx="364" cy="92" r="7" fill="rgba(226,138,71,0.28)" stroke={accentStroke} />
          </g>

          {/* High-Gain Dish */}
          <g stroke={strokePrimary} strokeWidth="1.6" fill="none">
            <line x1="454" y1="242" x2="466" y2="176" />
            <ellipse cx="476" cy="172" rx="28" ry="12" transform="rotate(-22 476 172)" stroke={accentStroke} />
          </g>

          {/* Triangular Solar Wings */}
          <polygon
            points="210,256 320,236 490,236 594,256 534,274 268,274"
            fill="rgba(226,138,71,0.13)"
            stroke={accentStroke}
            strokeWidth="2"
          />

          {/* Warm Electronics Body */}
          <polygon
            points="278,274 522,274 494,330 306,330"
            fill={shellFill}
            stroke={strokePrimary}
            strokeWidth="2"
          />

          {/* Front IDD Robotic Arm & RAT */}
          <g stroke={accentStroke} strokeWidth="2" fill="none">
            <polyline points="278,296 206,272 178,314 214,332" />
            <circle cx="216" cy="332" r="12" fill="rgba(226,138,71,0.22)" />
          </g>

          {/* Rocker-Bogie Suspension */}
          <g stroke={strokePrimary} strokeWidth="2.2" fill="none">
            <polyline points="270,390 342,320 404,390" />
            <polyline points="342,320 442,306 534,390" />
          </g>

          {/* 3 Visible Rugged Wheels */}
          {[270, 404, 534].map((cx) => (
            <g key={cx}>
              <circle cx={cx} cy="390" r="38" fill="rgba(243,240,232,0.04)" stroke={strokePrimary} strokeWidth="2.2" />
              <circle cx={cx} cy="390" r="22" fill="none" stroke={strokeSecondary} strokeDasharray="3 3" />
              <circle cx={cx} cy="390" r="8" fill="rgba(226,138,71,0.3)" stroke={accentStroke} />
            </g>
          ))}

          {isXray && (
            <g>
              <rect x="326" y="280" width="148" height="42" fill="url(#xray-glow)" stroke={accentStroke} />
              <text x="400" y="305" textAnchor="middle" fill="#F3F0E8" fontSize="9" className="font-mono">
                {labels.oppInternal}
              </text>
            </g>
          )}

          {dustOpacity > 0 && (
            <polygon
              points="210,256 320,236 490,236 594,256 534,274 268,274"
              fill={dustColor}
              opacity={dustOpacity * 0.78}
            />
          )}
        </g>
      );
  }
};
