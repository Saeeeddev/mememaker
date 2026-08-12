import { Search, Upload, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BLANK_IMAGE, type MemeTemplate } from './types'

const PER_PAGE = 20

interface TemplatPickerProps {
  memes: MemeTemplate[]
  filtered: MemeTemplate[]
  page: number
  setPage: (cb: (p: number) => number) => void
  searchQ: string
  setSearchQ: (q: string) => void
  selectedSrc: string | null
  setSelectedSrc: (cb: (prev: string | null) => string | null) => void
  memesLoading: boolean
  onNext: (src: string) => void
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  starsCount?: number
  onOpenTopup: () => void
}

export function TemplatePicker({
  memes,
  filtered,
  page,
  setPage,
  searchQ,
  setSearchQ,
  selectedSrc,
  setSelectedSrc,
  memesLoading,
  onNext,
  onFileUpload,
  fileInputRef,
  starsCount = 0,
  onOpenTopup,
}: TemplatPickerProps) {
  const visibleMemes = filtered.slice(0, page * PER_PAGE)
  const hasMore = visibleMemes.length < filtered.length

  // silence unused warning
  void memes

  return (
    <div className="flex flex-col min-h-[calc(100dvh-100px)] bg-black -mx-4 -mt-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div>
          <h1 className="text-white font-bold text-[22px] mb-0.5">Meme Zone </h1>
          <p className="text-white/40 text-[13px]">Pick a template or upload your own image</p>
        </div>
        <button
          onClick={onOpenTopup}
          className="flex items-center gap-1.5 bg-[#141416] border border-white/10 rounded-full px-3 py-1.5 hover:bg-[#1c1c1e] transition-colors shrink-0"
        >
          <span className="text-white font-bold text-[14px]">{starsCount}</span>
        </button>
      </div>

      {/* Upload button */}
      <div className="px-4 mb-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2.5 py-3 rounded-[16px] bg-[#1a1a1d] border border-dashed border-white/20 text-white/70 hover:border-[#229ED9]/60 hover:text-[#229ED9] transition-all text-[14px] font-semibold"
        >
          <Upload size={18} />
          Upload from Gallery
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2.5 bg-[#141416] rounded-[14px] px-3 py-2.5 border border-white/8">
          <Search size={16} className="text-white/40 shrink-0" />
          <input
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search meme templates..."
            className="flex-1 bg-transparent text-white text-[14px] placeholder-white/30 outline-none"
          />
        </div>
      </div>

      {/* Gallery grid */}
      <div className="px-4 flex-1">
        {memesLoading ? (
          <div className="grid grid-cols-3 gap-2.5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-[12px] bg-[#141416] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Blank Template */}
              <button
                onClick={() => setSelectedSrc(prev => prev === BLANK_IMAGE ? null : BLANK_IMAGE)}
                className={`relative aspect-square rounded-[12px] overflow-hidden border-2 transition-all bg-white flex items-center justify-center ${
                  selectedSrc === BLANK_IMAGE
                    ? 'border-[#229ED9] shadow-[0_0_0_3px_rgba(34,158,217,0.25)]'
                    : 'border-transparent'
                }`}
              >
                <span className="text-black/30 font-bold text-sm">BLANK</span>
                {selectedSrc === BLANK_IMAGE && (
                  <div className="absolute inset-0 bg-[#229ED9]/20 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-[#229ED9] flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  </div>
                )}
              </button>

              {visibleMemes.map(meme => (
                <button
                  key={meme.id}
                  onClick={() => setSelectedSrc(prev => prev === meme.url ? null : meme.url)}
                  className={`relative aspect-square rounded-[12px] overflow-hidden border-2 transition-all ${
                    selectedSrc === meme.url
                      ? 'border-[#229ED9] shadow-[0_0_0_3px_rgba(34,158,217,0.25)]'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={meme.url}
                    alt={meme.name}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                    loading="lazy"
                  />
                  {selectedSrc === meme.url && (
                    <div className="absolute inset-0 bg-[#229ED9]/20 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-[#229ED9] flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {hasMore && (
              <button
                onClick={() => setPage(p => p + 1)}
                className="w-full mt-4 py-3 rounded-[14px] bg-[#141416] border border-white/10 text-white/60 text-[13px] font-semibold hover:bg-[#1c1c1e] transition-colors"
              >
                Load more
              </button>
            )}
          </>
        )}
      </div>

      {/* Next button — fixed at bottom */}
      <AnimatePresence>
        {selectedSrc && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-[88px] left-0 right-0 px-4 z-40"
          >
            <button
              onClick={() => selectedSrc && onNext(selectedSrc)}
              className="w-full py-3.5 rounded-[16px] bg-[#229ED9] text-white font-bold text-[15px] shadow-[0_8px_24px_rgba(34,158,217,0.4)] active:scale-[0.98] transition-transform"
            >
              Next Step →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
