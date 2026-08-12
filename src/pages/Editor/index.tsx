import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Upload, Check } from 'lucide-react'
import { useAppStore } from '@store/useAppStore'
import {
  EditorTopBar,
  EditorCanvas,
  EditorBottomActions,
  TextEditPanel,
  useFabricCanvas,
  BOT_TOKEN,
  BLANK_IMAGE,
  type MemeTemplate,
  type TextEditState,
  type SelectableObj,
} from '@components/editor'
import starsIcon from '@assets/icons/stars.png'

/* ─── Fabric loaded via CDN in index.html ─── */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fabric: any
  }
}

interface DrawSettings {
  color: string
  width: number
  opacity: number
}

const PER_PAGE = 20
const DEFAULT_DRAW: DrawSettings = { color: '#ef4444', width: 6, opacity: 1 }

// ─────────────────────────────────────
// Editor Page
// ─────────────────────────────────────
export function Editor() {
  const { openTopup } = useAppStore()

  // "pick" shows template picker overlay, "edit" shows full-screen editor
  const [step, setStep] = useState<'pick' | 'edit'>('edit')
  const [selectedSrc, setSelectedSrc] = useState<string | null>(null)

  // ── Template picker state ──
  const [memes, setMemes] = useState<MemeTemplate[]>([])
  const [filtered, setFiltered] = useState<MemeTemplate[]>([])
  const [page, setPage] = useState(1)
  const [searchQ, setSearchQ] = useState('')
  const [memesLoading, setMemesLoading] = useState(false)
  const [pickerSelectedSrc, setPickerSelectedSrc] = useState<string | null>(null)

  // ── Canvas / editor state ──
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<unknown>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addImageInputRef = useRef<HTMLInputElement>(null)
  const [canvasKey, setCanvasKey] = useState(0)
  const [hasSelected, setHasSelected] = useState(false)
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [drawSettings, setDrawSettings] = useState<DrawSettings>(DEFAULT_DRAW)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [textEdit, setTextEdit] = useState<TextEditState>({
    text: '',
    fontFamily: 'Impact',
    fontSize: 40,
    textColor: '#ffffff',
    strokeColor: '#000000',
  })

  // ── Fetch meme templates (lazy — only when picker is opened) ──
  function loadMemes() {
    if (memes.length > 0) return
    setMemesLoading(true)
    fetch('https://api.imgflip.com/get_memes')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setMemes(d.data.memes)
          setFiltered(d.data.memes)
        }
      })
      .catch(() => {})
      .finally(() => setMemesLoading(false))
  }

  // ── Search filter ──
  useEffect(() => {
    const q = searchQ.toLowerCase()
    setFiltered(memes.filter(m => m.name.toLowerCase().includes(q)))
    setPage(1)
  }, [searchQ, memes])

  const visibleMemes = filtered.slice(0, page * PER_PAGE)
  const hasMore = visibleMemes.length < filtered.length

  // ── Sync draw settings to Fabric brush ──
  useEffect(() => {
    const fc = fabricRef.current as any
    if (!fc) return
    if (fc.freeDrawingBrush) {
      fc.freeDrawingBrush.color = drawSettings.color
      fc.freeDrawingBrush.width = drawSettings.width
      fc.freeDrawingBrush.opacity = drawSettings.opacity
    }
  }, [drawSettings, isDrawingMode])

  // ── Go to editor with a chosen template ──
  const goToEdit = useCallback((src: string) => {
    setSelectedSrc(src)
    setCanvasKey(k => k + 1)
    setStep('edit')
    setPickerSelectedSrc(null)
    setIsDrawingMode(false)
  }, [])

  // ── Fabric init ──
  useFabricCanvas({
    step,
    canvasKey,
    selectedSrc,
    canvasRef,
    fabricRef,
    onSelectionCreated: onSel,
    onSelectionCleared: () => {
      setHasSelected(false)
      setShowEditPanel(false)
    },
  })

  function onSel(e: { selected: SelectableObj[] }) {
    const obj = e.selected?.[0]
    if (obj?.type === 'text') {
      setHasSelected(true)
      setTextEdit({
        text: obj.text ?? '',
        fontFamily: obj.fontFamily ?? 'Impact',
        fontSize: obj.fontSize ?? 40,
        textColor: obj.fill ?? '#ffffff',
        strokeColor: obj.stroke ?? '#000000',
      })
    }
  }

  function addText() {
    if (!fabricRef.current) return
    const fc = fabricRef.current as any
    const fabric = window.fabric
    const text = new fabric.Text('Your Text', {
      left: fc.width / 2,
      top: fc.height / 2,
      fontFamily: 'Impact',
      fill: '#ffffff',
      fontSize: 40,
      fontWeight: 'bold',
      stroke: '#000000',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      paintFirst: 'stroke',
    })
    fc.add(text)
    fc.setActiveObject(text)
    setHasSelected(true)
    setTextEdit({ text: 'Your Text', fontFamily: 'Impact', fontSize: 40, textColor: '#ffffff', strokeColor: '#000000' })
    setShowEditPanel(true)
  }

  function applyTextEdit(patch: Partial<TextEditState>) {
    const next = { ...textEdit, ...patch }
    setTextEdit(next)
    const fc = fabricRef.current as any
    if (!fc) return
    const active = fc.getActiveObject() as any
    if (!active || active.type !== 'text') return
    if (patch.text !== undefined) active.set('text', patch.text)
    if (patch.fontFamily !== undefined) active.set('fontFamily', patch.fontFamily)
    if (patch.fontSize !== undefined) active.set('fontSize', patch.fontSize)
    if (patch.textColor !== undefined) active.set('fill', patch.textColor)
    if (patch.strokeColor !== undefined) active.set('stroke', patch.strokeColor)
    fc.renderAll()
  }

  function deleteSelected() {
    const fc = fabricRef.current as any
    if (!fc) return
    const active = fc.getActiveObject()
    if (active && active.name !== 'watermark') {
      fc.remove(active)
      fc.discardActiveObject()
      fc.renderAll()
    }
    setHasSelected(false)
    setShowEditPanel(false)
  }

  function toggleDraw() {
    const fc = fabricRef.current as any
    if (!fc) return
    const next = !isDrawingMode
    fc.isDrawingMode = next
    if (next && fc.freeDrawingBrush) {
      fc.freeDrawingBrush.color = drawSettings.color
      fc.freeDrawingBrush.width = drawSettings.width
    }
    setIsDrawingMode(next)
    if (next) setHasSelected(false)
  }

  function updateDrawSettings(patch: Partial<DrawSettings>) {
    setDrawSettings(prev => {
      const next = { ...prev, ...patch }
      const fc = fabricRef.current as any
      if (fc?.freeDrawingBrush) {
        if (patch.color !== undefined) fc.freeDrawingBrush.color = patch.color
        if (patch.width !== undefined) fc.freeDrawingBrush.width = patch.width
      }
      return next
    })
  }

  function sendToBot() {
    const fc = fabricRef.current as any
    if (!fc) return
    fc.isDrawingMode = false
    setIsDrawingMode(false)
    fc.discardActiveObject()
    fc.renderAll()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tg = (window as any).Telegram?.WebApp
    const chatId = tg?.initDataUnsafe?.user?.id
    if (!chatId) { alert('Please open inside Telegram'); return }
    const dataURL = fc.toDataURL({ format: 'png', quality: 1, multiplier: 3 })
    fetch(dataURL)
      .then(r => r.blob())
      .then(blob => {
        const fd = new FormData()
        fd.append('chat_id', String(chatId))
        fd.append('photo', blob, 'meme.png')
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { method: 'POST', body: fd })
          .then(() => tg?.close())
      })
  }

  function shareImage() {
    const fc = fabricRef.current as any
    if (!fc) return
    fc.isDrawingMode = false
    fc.discardActiveObject()
    fc.renderAll()
    const dataURL = fc.toDataURL({ format: 'png', quality: 1, multiplier: 3 })
    fetch(dataURL)
      .then(r => r.blob())
      .then(async blob => {
        const file = new File([blob], 'meme.png', { type: 'image/png' })
        if (navigator.canShare?.({ files: [file] })) {
          navigator.share({ files: [file] })
        }
      })
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      if (ev.target?.result) goToEdit(ev.target.result as string)
    }
    reader.readAsDataURL(file)
  }

  function handleAddImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !fabricRef.current) return
    const fc = fabricRef.current as any
    const fabric = window.fabric
    const reader = new FileReader()
    reader.onload = ev => {
      const src = ev.target?.result as string
      if (!src) return
      fabric.Image.fromURL(src, (img: any) => {
        img.scaleToWidth(fc.width / 2)
        img.set({ left: fc.width / 4, top: fc.height / 4 })
        fc.add(img)
        fc.setActiveObject(img)
        fc.renderAll()
      })
    }
    reader.readAsDataURL(file)
  }

  function openPicker() {
    loadMemes()
    setStep('pick')
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FULL-SCREEN EDITOR  (shown first — step === 'edit')
  // Matches the profile page dark aesthetic: bg-black, rounded panels, etc.
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col bg-black -mx-4 -mt-4 relative" style={{ height: 'calc(100dvh - 80px)' }}>
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      <input ref={addImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleAddImageUpload} />

      {/* ── If no template chosen yet — show a "Choose Template" prompt in the canvas area ── */}
      {!selectedSrc ? (
        <>
          {/* Top bar — exit exits the editor page (go back to home via nav) */}
          <EditorTopBar
            onExit={openPicker}
            onAddImage={() => fileInputRef.current?.click()}
            onChangeTemplate={openPicker}
          />

          {/* Empty canvas placeholder */}
          <div className="flex-1 px-4 py-2 flex">
            <div className="flex-1 rounded-[18px] border-2 border-dashed border-white/15 bg-[#0e0e10] flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-[18px] bg-[#1c1c1e] border border-white/10 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white/50 font-semibold text-[15px] mb-1">No template selected</p>
                <p className="text-white/25 text-[12px]">Choose a meme template to start editing</p>
              </div>
              <button
                onClick={openPicker}
                className="px-6 py-2.5 rounded-[12px] bg-[#229ED9] text-white font-bold text-[13px] shadow-[0_4px_16px_rgba(34,158,217,0.35)] active:scale-[0.97] transition-transform"
              >
                Choose Template
              </button>
            </div>
            {/* Spacer matching the side toolbar width */}
            <div className="w-[56px] ml-2" />
          </div>

          {/* Disabled bottom actions */}
          <EditorBottomActions
            hasSelected={false}
            onAddText={() => {}}
            onEditText={() => {}}
            onDeleteSelected={() => {}}
            onSendToBot={sendToBot}
            onShare={shareImage}
            onGenerateAI={() => {}}
          />
        </>
      ) : (
        <>
          {/* ── Top bar ── */}
          <EditorTopBar
            onExit={openPicker}
            onAddImage={() => addImageInputRef.current?.click()}
            onChangeTemplate={openPicker}
          />

          {/* ── Canvas + side toolbar (flex-1 fills all space between top and bottom) ── */}
          <EditorCanvas
            canvasKey={canvasKey}
            canvasRef={canvasRef}
            isDrawingMode={isDrawingMode}
            drawSettings={drawSettings}
            onToggleDraw={toggleDraw}
            onUpdateDrawSettings={updateDrawSettings}
            onRotate={() => {
              const fc = fabricRef.current as any
              if (!fc) return
              const active = fc.getActiveObject()
              if (active) {
                active.set('angle', ((active.angle ?? 0) + 15) % 360)
                fc.renderAll()
              }
            }}
            onCrop={() => {}}
          />

          {/* ── Bottom actions ── */}
          <EditorBottomActions
            hasSelected={hasSelected}
            onAddText={addText}
            onEditText={() => setShowEditPanel(true)}
            onDeleteSelected={deleteSelected}
            onSendToBot={sendToBot}
            onShare={shareImage}
            onGenerateAI={() => {}}
          />
        </>
      )}

      {/* ── Text Edit Bottom Sheet ── */}
      <TextEditPanel
        open={showEditPanel}
        textEdit={textEdit}
        onApply={applyTextEdit}
        onClose={() => setShowEditPanel(false)}
      />

      {/* ════════════════════════════════════════════════════════════
          TEMPLATE PICKER OVERLAY
          Slides up over the editor when step === 'pick'
          Matches profile page aesthetics: dark header, content sheet
      ════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {step === 'pick' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="absolute inset-0 bg-black z-50 flex flex-col"
          >
            {/* ── Hero header — profile-page style ── */}
            <div className="relative overflow-hidden pt-6 pb-8 text-center bg-[#151820]">
              {/* Subtle gradient backdrop */}
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,158,217,0.25) 0%, transparent 70%)',
                }}
              />
              <div className="relative z-10">
                <h1 className="text-white font-bold text-[22px] mb-1">Meme Zone 🎭</h1>
                <p className="text-white/40 text-[13px]">Pick a template or upload your own</p>
              </div>

              {/* Stars balance pill — top right */}
              <button
                onClick={() => openTopup('stars')}
                className="absolute top-5 right-4 flex items-center gap-1.5 bg-[#1c1c1e] border border-white/10 rounded-full px-3 py-1.5"
              >
                <span className="text-white font-bold text-[13px]">0</span>
                <img src={starsIcon} alt="Stars" className="w-4 h-4" />
              </button>

              {/* Upload button */}
              <div className="relative z-10 px-4 mt-5">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[14px] bg-white/8 border border-dashed border-white/20 text-white/70 hover:border-[#229ED9]/60 hover:text-[#229ED9] transition-all text-[13px] font-semibold"
                >
                  <Upload size={16} />
                  Upload from Gallery
                </button>
              </div>
            </div>

            {/* ── Content sheet — matches profile page ── */}
            <div className="bg-black -mt-3.5 rounded-t-[22px] relative z-10 flex-1 flex flex-col overflow-hidden">
              {/* Drag handle */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-4 shrink-0" />

              {/* Search */}
              <div className="px-4 mb-3 shrink-0">
                <div className="flex items-center gap-2.5 bg-[#1c1c1e] rounded-[13px] px-3 py-2.5 border border-white/8">
                  <Search size={15} className="text-white/40 shrink-0" />
                  <input
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Search meme templates..."
                    className="flex-1 bg-transparent text-white text-[14px] placeholder-white/30 outline-none"
                  />
                </div>
              </div>

              {/* Grid — scrollable */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                {memesLoading ? (
                  <div className="grid grid-cols-3 gap-2.5">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-[12px] bg-[#1c1c1e] animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2.5">
                      {/* Blank */}
                      <button
                        onClick={() => setPickerSelectedSrc(prev => prev === BLANK_IMAGE ? null : BLANK_IMAGE)}
                        className={`relative aspect-square rounded-[12px] overflow-hidden border-2 transition-all bg-white/90 flex items-center justify-center ${
                          pickerSelectedSrc === BLANK_IMAGE
                            ? 'border-[#229ED9] shadow-[0_0_0_3px_rgba(34,158,217,0.25)]'
                            : 'border-transparent'
                        }`}
                      >
                        <span className="text-black/30 font-bold text-xs">BLANK</span>
                        {pickerSelectedSrc === BLANK_IMAGE && (
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
                          onClick={() => setPickerSelectedSrc(prev => prev === meme.url ? null : meme.url)}
                          className={`relative aspect-square rounded-[12px] overflow-hidden border-2 transition-all ${
                            pickerSelectedSrc === meme.url
                              ? 'border-[#229ED9] shadow-[0_0_0_3px_rgba(34,158,217,0.25)]'
                              : 'border-transparent'
                          }`}
                        >
                          <img src={meme.url} alt={meme.name} className="w-full h-full object-cover" crossOrigin="anonymous" loading="lazy" />
                          {pickerSelectedSrc === meme.url && (
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
                        className="w-full mt-4 py-3 rounded-[13px] bg-[#1c1c1e] border border-white/10 text-white/60 text-[13px] font-semibold hover:bg-white/8 transition-colors"
                      >
                        Load more
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Floating "Use Template" button */}
              <AnimatePresence>
                {pickerSelectedSrc && (
                  <motion.div
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 80, opacity: 0 }}
                    className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-2 bg-gradient-to-t from-black via-black/80 to-transparent"
                  >
                    <button
                      onClick={() => pickerSelectedSrc && goToEdit(pickerSelectedSrc)}
                      className="w-full py-3.5 rounded-[16px] bg-[#229ED9] text-white font-bold text-[15px] shadow-[0_8px_24px_rgba(34,158,217,0.4)] active:scale-[0.98] transition-transform"
                    >
                      Use This Template →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Close picker — no template selected */}
              {!pickerSelectedSrc && (
                <div className="px-4 pb-4 shrink-0">
                  <button
                    onClick={() => setStep('edit')}
                    className="w-full py-3 rounded-[14px] bg-[#1c1c1e] border border-white/10 text-white/50 text-[14px] font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Editor
