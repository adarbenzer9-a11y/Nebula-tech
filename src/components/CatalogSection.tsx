import React, { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Artifact, ArtifactStatus, CelestialBody } from '../data/artifacts';
import { TRANSLATIONS, type Language } from '../data/translations';

interface CatalogSectionProps {
  lang: Language;
  artifacts: Artifact[];
  selectedArtifactId: string;
  onSelectArtifact: (artifact: Artifact, scrollToWorkshop?: boolean) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  lang,
  artifacts,
  selectedArtifactId,
  onSelectArtifact,
}) => {
  const t = TRANSLATIONS[lang];
  const [bodyFilter, setBodyFilter] = useState<'all' | CelestialBody>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | ArtifactStatus>('all');

  const filtered = useMemo(() => {
    return artifacts.filter((item) => {
      const matchBody = bodyFilter === 'all' || item.body === bodyFilter;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchBody && matchStatus;
    });
  }, [artifacts, bodyFilter, statusFilter]);

  return (
    <section id="koleksiyon" className="py-20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header & Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-[#E28A47] mb-3">
              {t.catalog.kicker}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#F3F0E8]">
              {t.catalog.title}
            </h2>
            <p className="text-sm md:text-base text-[#B5B0A6] mt-2.5 max-w-2xl leading-relaxed">
              {t.catalog.desc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Celestial Body Segmented Filter */}
            <div className="flex items-center gap-1 p-1 bg-[#12161E] border border-white/10 rounded-lg">
              {(
                [
                  { id: 'all', label: t.catalog.allTab },
                  { id: 'moon', label: t.catalog.moonTab },
                  { id: 'mars', label: t.catalog.marsTab },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBodyFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    bodyFilter === tab.id
                      ? 'bg-[#D97736] text-[#090B0E]'
                      : 'text-[#B5B0A6] hover:text-[#F3F0E8]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Segmented Filter */}
            <div className="flex items-center gap-1 p-1 bg-[#12161E] border border-white/10 rounded-lg">
              {(
                [
                  { id: 'all', label: t.catalog.allStatuses },
                  { id: 'Sessiz', label: t.statusMap['Sessiz'] },
                  { id: 'Yansıtıcı Aktif', label: t.statusMap['Yansıtıcı Aktif'] },
                  { id: 'Toz Altında', label: t.statusMap['Toz Altında'] },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-white/15 text-[#F3F0E8]'
                      : 'text-[#9B978E] hover:text-[#F3F0E8]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className="border border-white/10 bg-[#12161E] rounded-lg p-12 text-center">
            <p className="font-serif text-2xl text-[#F3F0E8]">
              {t.catalog.emptyTitle}
            </p>
            <p className="text-sm text-[#9B978E] mt-2">
              {t.catalog.emptyDesc}
            </p>
            <button
              type="button"
              onClick={() => {
                setBodyFilter('all');
                setStatusFilter('all');
              }}
              className="mt-5 px-4 py-2 text-xs font-medium bg-[#D97736] text-[#090B0E] rounded-md cursor-pointer"
            >
              {t.catalog.resetFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const isSelected = item.id === selectedArtifactId;
              return (
                <article
                  key={item.id}
                  className={`group border rounded-lg overflow-hidden bg-[#12161E] transition-colors flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#D97736]'
                      : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full bg-[#080A0D] overflow-hidden">
                      <img
                        src={item.heroImage}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#12161E] via-transparent to-black/25" />
                    </div>

                    <div className="p-5">
                      {/* Unboxed Metadata with Typographic Separators (Zero-Pill Rule) */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#9B978E] tabular-nums">
                        <span>{item.bodyLabel}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.launchYear}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#E28A47]">{t.statusMap[item.status]}</span>
                      </div>

                      <h3 className="font-serif text-2xl font-medium text-[#F3F0E8] mt-2.5">
                        {item.name}
                      </h3>
                      <p className="text-sm text-[#B5B0A6] mt-2 leading-relaxed line-clamp-2">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono tabular-nums text-[#9B978E]">
                      {item.massLeftKg} · {item.yearsSilent} {t.catalog.yearsSilentUnit}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectArtifact(item, true)}
                      className="inline-flex items-center gap-1 font-medium text-[#E28A47] hover:text-[#F3F0E8] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>
                        {isSelected ? t.catalog.currentlyInspecting : t.catalog.openStory}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
