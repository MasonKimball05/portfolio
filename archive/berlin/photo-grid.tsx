"use client"

import { useState, useEffect, useCallback } from "react"

interface PhotoGridProps {
  photos: string[]
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const open = lightboxIndex !== null

  const close = useCallback(() => setLightboxIndex(null), [])
  const prev = useCallback(() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), [])
  const next = useCallback(
    () => setLightboxIndex((i) => (i !== null && i < photos.length - 1 ? i + 1 : i)),
    [photos.length]
  )

  // Keyboard navigation + scroll lock
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", handler)
    return () => {
      window.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [open, close, prev, next])

  if (photos.length === 0) return null

  return (
    <>
      {/* Photo grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
        {photos.map((src, i) => {
          const isFeatured = i === 0 && photos.length >= 3
          return (
            <button
              key={i}
              onClick={() => setLightboxIndex(i)}
              className={[
                "block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring group",
                isFeatured ? "col-span-2 row-span-2" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ aspectRatio: "1 / 1" }}
              aria-label={`View photo ${i + 1}`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover transition-opacity duration-150 group-hover:opacity-85"
              />
            </button>
          )
        })}
      </div>

      {/* Lightbox */}
      {open && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors text-sm font-mono p-2"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/50 text-xs font-mono">
            {lightboxIndex + 1} / {photos.length}
          </div>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 text-white/60 hover:text-white transition-colors text-2xl p-3 select-none"
              aria-label="Previous photo"
            >
              ←
            </button>
          )}

          {/* Image */}
          <img
            src={photos[lightboxIndex]}
            alt=""
            className="max-h-[90vh] max-w-[90vw] object-contain select-none"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
          />

          {/* Next */}
          {lightboxIndex < photos.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 text-white/60 hover:text-white transition-colors text-2xl p-3 select-none"
              aria-label="Next photo"
            >
              →
            </button>
          )}
        </div>
      )}
    </>
  )
}
