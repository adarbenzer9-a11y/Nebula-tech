import React, { useEffect, useState } from 'react';
import { Camera, Crosshair, Maximize2, X } from 'lucide-react';
import type { Artifact } from '../data/artifacts';
import { TRANSLATIONS, type Language } from '../data/translations';

interface ArchivalPhotoLightboxProps {
  lang: Language;
  artifact: Artifact;
}

export const ArchivalPhotoLightbox: React.FC<ArchivalPhotoLightboxProps> = ({
  lang,
  artifact,
}) => {
  const t = TRANSLATIONS[lang];
  const [showFiducials, setShowFiducials] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [artifact.id]);

  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isModalOpen]);

  return (
    <>
      <figure className="border border-white/10 bg-[#0D1015] rounded-lg overflow-hidden">
        {/* Archival Film Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-[#11151C]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#B5B0A6]">
            <span>{artifact.photoCatalogId}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#9B978E]">{artifact.launchYear}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFiducials((prev) => !prev)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showFiducials
                  ? 'border-[#D97736]/60 text-[#F3F0E8] bg-[#D97736]/10'
                  : 'border-white/10 text-[#9B978E] hover:text-[#F3F0E8]'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span>{t.photo.fiducials}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              aria-label={t.photo.enlargeAria}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border border-white/10 text-[#B5B0A6] hover:text-[#F3F0E8] hover:border-white/25 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{t.photo.enlarge}</span>
            </button>
          </div>
        </div>

        {/* Photograph Canvas with Optional Reseau Crosses */}
        <div className="relative aspect-[4/3] w-full bg-[#07080B] overflow-hidden group">
          {!imageError ? (
            <img
              src={artifact.heroImage}
              alt={`${artifact.name} — ${artifact.photoCatalogId} arşiv fotoğrafı`}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              onClick={() => setIsModalOpen(true)}
              className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#141820] to-[#090B0E]">
              <Camera className="w-8 h-8 text-[#9B978E] mb-3" />
              <p className="text-sm font-medium text-[#F3F0E8]">{artifact.name}</p>
              <p className="text-xs font-mono text-[#9B978E] mt-1">{artifact.photoCatalogId}</p>
            </div>
          )}

          {/* Subtle Archival Vignette */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />

          {/* NASA Hasselblad Reseau Fiducial Crosses Overlay */}
          {showFiducials && (
            <svg
              viewBox="0 0 400 300"
              className="pointer-events-none absolute inset-0 w-full h-full opacity-55"
              aria-hidden="true"
            >
              {[80, 160, 240, 320].map((cx) =>
                [75, 150, 225].map((cy) => (
                  <g key={`${cx}-${cy}`} stroke="rgba(243,240,232,0.55)" strokeWidth="0.9">
                    <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} />
                    <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} />
                  </g>
                ))
              )}
            </svg>
          )}

          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-[#E7E2D8]/85">
            <span>{artifact.photoCamera}</span>
          </div>
        </div>

        {/* Curatorial Figure Caption */}
        <figcaption className="px-4 py-3.5 text-xs font-serif italic text-[#C7C2B8] leading-relaxed border-t border-white/10 bg-[#10141B]">
          {artifact.photoCaption}
        </figcaption>
      </figure>

      {/* Fullscreen Archival Lightbox Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${artifact.name} arşiv fotoğrafı büyütülmüş görünüm`}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#0D1015] border border-white/15 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <div className="text-xs font-mono text-[#B5B0A6]">
                {artifact.photoCatalogId} · {artifact.siteName}
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label={t.photo.closeAria}
                className="p-1.5 rounded text-[#B5B0A6] hover:text-[#F3F0E8] hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="relative bg-black max-h-[75vh] overflow-hidden flex items-center justify-center">
              {!imageError ? (
                <img
                  src={artifact.heroImage}
                  alt={artifact.name}
                  referrerPolicy="no-referrer"
                  className="max-h-[75vh] w-auto object-contain"
                />
              ) : (
                <div className="py-24 text-center text-[#9B978E] text-sm">
                  {t.photo.loadError}
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t border-white/10 bg-[#11151C] flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm font-serif italic text-[#D6D1C7] max-w-3xl">
                {artifact.photoCaption}
              </p>
              <span className="text-xs font-mono text-[#9B978E]">{artifact.coordinates}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
