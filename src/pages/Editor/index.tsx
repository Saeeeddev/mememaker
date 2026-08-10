import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Upload, ChevronLeft, Type, Trash2, Pencil, Check, Share2, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Fabric loaded via CDN in index.html (already present in editorref) ─── */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fabric: any
  }
}

const BOT_TOKEN = '8482663049:AAE9Mt6bLJQ4_SS5P36PvY3RblbkpOdB-mU'

// --- Types ---
interface MemeTemplate {
  id: string
  name: string
  url: string
}

interface TextEditState {
  text: string
  fontFamily: string
  fontSize: number
  textColor: string
  strokeColor: string
}

type Step = 'pick' | 'edit'

// --- Font options ---
const FONTS = [
  { value: 'Impact', label: 'Impact (Classic)' },
  { value: 'Lalezar', label: 'Lalezar (Bold FA)' },
  { value: 'Vazirmatn', label: 'Vazirmatn (Readable)' },
  { value: 'Poppins', label: 'Poppins (Modern)' },
]

const PER_PAGE = 20

// --- Editor Page ---
export function Editor() {
  const [step, setStep] = useState<Step>('pick')

  // Step 1 state
  const [memes, setMemes] = useState<MemeTemplate[]>([])
  const [filtered, setFiltered] = useState<MemeTemplate[]>([])
  const [page, setPage] = useState(1)
  const [searchQ, setSearchQ] = useState('')
  const [selectedSrc, setSelectedSrc] = useState<string | null>(null)
  const [memesLoading, setMemesLoading] = useState(true)

  // Step 2 state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<unknown>(null)
  const [canvasKey, setCanvasKey] = useState(0)  // bumped on every step-2 entry to force fresh <canvas>
  const [hasSelected, setHasSelected] = useState(false)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [textEdit, setTextEdit] = useState<TextEditState>({
    text: '',
    fontFamily: 'Impact',
    fontSize: 40,
    textColor: '#ffffff',
    strokeColor: '#000000',
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
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
  }, [])

  // Search filter
  useEffect(() => {
    const q = searchQ.toLowerCase()
    const result = memes.filter(m => m.name.toLowerCase().includes(q))
    setFiltered(result)
    setPage(1)
  }, [searchQ, memes])

  const visibleMemes = filtered.slice(0, page * PER_PAGE)
  const hasMore = visibleMemes.length < filtered.length

  // ── Go to step 2 ──
  const goToEdit = useCallback((src: string) => {
    setSelectedSrc(src)
    setCanvasKey(k => k + 1)   // force fresh <canvas> DOM node
    setStep('edit')
  }, [])

  // ── Init Fabric canvas ──
  useEffect(() => {
    if (step !== 'edit' || !selectedSrc) return

    // Defer by one tick so React has committed the new <canvas> DOM node
    const initTimer = setTimeout(() => {
      if (!canvasRef.current || !window.fabric) return

      const fabric = window.fabric

      // Dispose any previous instance
      if (fabricRef.current) {
        try { (fabricRef.current as any).dispose() } catch (_) {}
        fabricRef.current = null
      }

      const fc = new fabric.Canvas(canvasRef.current)
      fabricRef.current = fc

      const wrapper = canvasRef.current.parentElement
      const w = wrapper ? wrapper.clientWidth : 320

      fabric.Image.fromURL(
        selectedSrc,
        (img: { width: number; height: number }) => {
          const scale = w / img.width
          fc.setWidth(w)
          fc.setHeight(img.height * scale)
          fc.setBackgroundImage(img, fc.renderAll.bind(fc), {
            scaleX: scale,
            scaleY: scale,
            originX: 'left',
            originY: 'top',
            crossOrigin: 'anonymous',
          })

          // Watermark
          const wm = new fabric.Text('@creat_meme_bot', {
            left: w - 10,
            top: img.height * scale - 10,
            fontFamily: 'Poppins',
            fontSize: 14,
            fill: 'rgba(255,255,255,0.7)',
            stroke: 'rgba(0,0,0,0.9)',
            strokeWidth: 3,
            paintFirst: 'stroke',
            originX: 'right',
            originY: 'bottom',
            selectable: false,
            evented: false,
            fontWeight: 'bold',
            name: 'watermark',
          })
          fc.add(wm)
        },
        { crossOrigin: 'anonymous' }
      )

      fc.on('selection:created', onSel)
      fc.on('selection:updated', onSel)
      fc.on('selection:cleared', () => {
        setHasSelected(false)
        setShowEditPanel(false)
      })

      // Keep watermark on top
      fc.on('object:added', (e: { target: { name: string } }) => {
        if (e.target?.name !== 'watermark') {
          const objs = fc.getObjects()
          for (const o of objs) {
            if (o.name === 'watermark') { o.bringToFront(); break }
          }
        }
      })
    }, 0)

    return () => {
      clearTimeout(initTimer)
      if (fabricRef.current) {
        try { (fabricRef.current as any).dispose() } catch (_) {}
        fabricRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasKey, step, selectedSrc])

  function onSel(e: { selected: { type: string; text?: string; fontFamily?: string; fontSize?: number; fill?: string; stroke?: string }[] }) {
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
    const fc = fabricRef.current as unknown as { width: number; height: number; add: (o: unknown) => void; setActiveObject: (o: unknown) => unknown }
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

  function openEditPanel() {
    setShowEditPanel(true)
  }

  function applyTextEdit(patch: Partial<TextEditState>) {
    const next = { ...textEdit, ...patch }
    setTextEdit(next)
    const fc = fabricRef.current as unknown as { getActiveObject: () => unknown; renderAll: () => void } | null
    if (!fc) return
    const active = fc.getActiveObject() as { type: string; set: (k: string, v: unknown) => void } | null
    if (!active || active.type !== 'text') return
    if (patch.text !== undefined) active.set('text', patch.text)
    if (patch.fontFamily !== undefined) active.set('fontFamily', patch.fontFamily)
    if (patch.fontSize !== undefined) active.set('fontSize', patch.fontSize)
    if (patch.textColor !== undefined) active.set('fill', patch.textColor)
    if (patch.strokeColor !== undefined) active.set('stroke', patch.strokeColor)
    fc.renderAll()
  }

  function deleteSelected() {
    const fc = fabricRef.current as unknown as { getActiveObject: () => { name?: string } | null; remove: (o: unknown) => void; discardActiveObject: () => void; renderAll: () => void } | null
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

  function sendToBot() {
    const fc = fabricRef.current as unknown as { discardActiveObject: () => void; renderAll: () => void; toDataURL: (opts: object) => string } | null
    if (!fc) return
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
    const fc = fabricRef.current as unknown as { discardActiveObject: () => void; renderAll: () => void; toDataURL: (opts: object) => string } | null
    if (!fc) return
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


  // ─────────────────────────────────────
  // STEP 1 — Pick template
  // ─────────────────────────────────────
  if (step === 'pick') {
    return (
      <div className="flex flex-col min-h-[calc(100dvh-100px)] bg-black -mx-4 -mt-4">
        {/* Header */}
        <div className="px-4 pt-5 pb-3">
          <h1 className="text-white font-bold text-[22px] mb-0.5">Meme Zone <span className="text-2xl"></span></h1>
          <p className="text-white/40 text-[13px]">Pick a template or upload your own image</p>
        </div>

        {/* Upload button */}
        <div className="px-4 mb-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
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
                onClick={() => selectedSrc && goToEdit(selectedSrc)}
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

  // ─────────────────────────────────────
  // STEP 2 — Edit canvas
  // ─────────────────────────────────────
  return (
    <div className="flex flex-col min-h-[calc(100dvh-100px)] bg-black -mx-4 -mt-4 relative">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <button
          onClick={() => { 
            setStep('pick')
            setSelectedSrc(null)
            setHasSelected(false)
            setShowEditPanel(false)
            // Dispose canvas immediately when leaving editor
            if (fabricRef.current) {
              try { (fabricRef.current as any).dispose() } catch (_) {}
              fabricRef.current = null
            }
          }}
          className="w-9 h-9 rounded-full bg-[#141416] border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#1c1c1e] transition-colors shrink-0"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <h1 className="text-white font-bold text-[18px] leading-tight">Edit Meme ✍️</h1>
          <p className="text-white/40 text-[12px]">Tap canvas to select, use toolbar below</p>
        </div>
      </div>

      {/* Canvas */}
      <div className="px-4">
        <div key={canvasKey} className="w-full rounded-[16px] overflow-hidden border border-white/10 bg-[#141416]">
          <canvas ref={canvasRef} />
        </div>
      </div>

      {/* Floating toolbar */}
      <div className="px-4 mt-3">
        <div className="flex items-center gap-2 bg-[#141416] rounded-[16px] p-2 border border-white/8">
          {!hasSelected ? (
            <button
              onClick={addText}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] bg-[#229ED9] text-white font-bold text-[14px] active:scale-[0.97] transition-transform"
            >
              <Type size={17} />
              Add Text
            </button>
          ) : (
            <>
              <button
                onClick={openEditPanel}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] bg-[#3b82f6] text-white font-semibold text-[13px] active:scale-[0.97] transition-transform"
              >
                <Pencil size={15} />
                Edit
              </button>
              <button
                onClick={deleteSelected}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[12px] bg-red-500/15 text-red-400 font-semibold text-[13px] border border-red-500/20 active:scale-[0.97] transition-transform"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 mt-3 flex gap-2.5">
        <button
          onClick={sendToBot}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] bg-[#229ED9] text-white font-bold text-[14px] shadow-[0_4px_16px_rgba(34,158,217,0.35)] active:scale-[0.98] transition-transform"
        >
          <Send size={16} />
          Send to Bot
        </button>
        <button
          onClick={shareImage}
          className="w-12 flex items-center justify-center rounded-[14px] bg-[#141416] border border-white/10 text-white/60 hover:bg-[#1c1c1e] transition-colors active:scale-[0.97]"
        >
          <Share2 size={17} />
        </button>
      </div>

      {/* ── Text Edit Bottom Sheet ── */}
      <AnimatePresence>
        {showEditPanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditPanel(false)}
              className="fixed inset-0 bg-black/40 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed bottom-0 left-0 right-0 bg-[#111113] rounded-t-[28px] border-t border-white/10 z-50 px-5 pt-4 pb-10"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-white/25 rounded-full mx-auto mb-5" />

              {/* Title + close */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-[16px]">Edit Text ✍️</h3>
                <button
                  onClick={() => setShowEditPanel(false)}
                  className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/60 hover:bg-white/15 transition-colors"
                >
                  <Check size={16} />
                </button>
              </div>

              {/* Text input */}
              <textarea
                value={textEdit.text}
                onChange={e => applyTextEdit({ text: e.target.value })}
                rows={2}
                placeholder="Type your text..."
                className="w-full bg-[#1c1c1e] border border-white/10 rounded-[14px] px-3.5 py-3 text-white text-[15px] font-semibold placeholder-white/25 outline-none resize-none mb-4 focus:border-[#229ED9]/50 transition-colors"
              />

              {/* Font family */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/60 text-[13px] font-semibold">Font</span>
                <select
                  value={textEdit.fontFamily}
                  onChange={e => applyTextEdit({ fontFamily: e.target.value })}
                  className="bg-[#1c1c1e] border border-white/10 rounded-[10px] px-3 py-1.5 text-white text-[13px] outline-none focus:border-[#229ED9]/50 transition-colors"
                >
                  {FONTS.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              {/* Font size */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60 text-[13px] font-semibold">Size <span className="text-white ml-1">{textEdit.fontSize}px</span></span>
                <input
                  type="range"
                  min={15}
                  max={150}
                  value={textEdit.fontSize}
                  onChange={e => applyTextEdit({ fontSize: parseInt(e.target.value) })}
                  className="w-[55%] accent-[#229ED9]"
                />
              </div>

              {/* Colors */}
              <div className="flex items-center gap-4 bg-[#1c1c1e] rounded-[14px] p-3.5">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/20 shadow-md relative overflow-hidden"
                    style={{ backgroundColor: textEdit.textColor }}
                  >
                    <input
                      type="color"
                      value={textEdit.textColor}
                      onChange={e => applyTextEdit({ textColor: e.target.value })}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <span className="text-white/70 text-[12.5px] font-semibold">Text Color</span>
                </label>

                <div className="w-px h-6 bg-white/10" />

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-white/20 shadow-md relative overflow-hidden"
                    style={{ backgroundColor: textEdit.strokeColor }}
                  >
                    <input
                      type="color"
                      value={textEdit.strokeColor}
                      onChange={e => applyTextEdit({ strokeColor: e.target.value })}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                  <span className="text-white/70 text-[12.5px] font-semibold">Stroke</span>
                </label>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Editor
