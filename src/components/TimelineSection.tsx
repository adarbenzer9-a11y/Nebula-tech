import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Artifact } from '../data/artifacts';
import { TRANSLATIONS, type Language } from '../data/translations';

interface TimelineSectionProps {
  lang: Language;
  artifacts: Artifact[];
  selectedArtifactId: string;
  onSelectArtifact: (artifact: Artifact, scrollToWorkshop?: boolean) => void;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({
  lang,
  artifacts,
  selectedArtifactId,
  onSelectArtifact,
}) => {
  const t = TRANSLATIONS[lang];
  const sorted = [...artifacts].sort((a, b) => a.launchYear - b.launchYear);

  return (
    <section id="kronoloji" className="py-20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-[#E28A47] mb-3">
            {t.timeline.kicker}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-[#F3F0E8]">
            {t.timeline.title}
          </h2>
          <p className="text-sm md:text-base text-[#B5B0A6] mt-2.5 max-w-2xl leading-relaxed">
            {t.timeline.desc}
          </p>
        </div>

        <div className="divide-y divide-white/10 border-t border-b border-white/10">
          {sorted.map((item) => {
            const isCurrent = item.id === selectedArtifactId;
            return (
              <div
                key={item.id}
                className={`py-6 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center transition-colors ${
                  isCurrent ? 'bg-[#12161E]/80 -mx-4 px-4 rounded' : ''
                }`}
              >
                <div className="md:col-span-2 flex items-baseline gap-3">
                  <span className="font-mono text-2xl font-semibold tabular-nums text-[#E28A47]">
                    {item.launchYear}
                  </span>
                  <span className="text-xs font-mono text-[#9B978E]">{item.bodyLabel}</span>
                </div>

                <div className="md:col-span-4">
                  <h3 className="font-serif text-2xl font-medium text-[#F3F0E8]">
                    {item.name}
                  </h3>
                  <p className="text-xs font-mono text-[#9B978E] mt-1">{item.siteName}</p>
                </div>

                <div className="md:col-span-4">
                  <p className="text-sm text-[#C7C2B8] leading-relaxed">{item.subtitle}</p>
                  <p className="text-xs font-mono text-[#9B978E] mt-1.5">
                    {t.timeline.lastContact}: {item.abandonedDate}
                  </p>
                </div>

                <div className="md:col-span-2 flex md:justify-end">
                  <button
                    type="button"
                    onClick={() => onSelectArtifact(item, true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded border border-white/15 text-[#F3F0E8] hover:border-[#D97736] hover:text-[#E28A47] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>{t.timeline.goToChapter}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
