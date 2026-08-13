import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Upload, Check, RotateCw, Crop, Pencil, X, Type, Sparkles, Undo2, Edit2, ChevronLeft, ChevronRight, Loader2, Trash2, Minus, Plus } from 'lucide-react'
import {
  EditorTopBar,
  EditorCanvas,
  EditorBottomActions,
  TextEditPanel,
  useFabricCanvas,
  LayersPanel,
  AIPanel,
  BOT_TOKEN,
  BLANK_IMAGE,
  type MemeTemplate,
  type TextEditState,
  type SelectableObj,
} from '@components/editor'

const DRAW_COLORS = [
  '#ffffff', '#000000', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#3b82f6', '#a855f7',
  '#ec4899', '#06b6d4',
]

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
// Helpers
// ─────────────────────────────────────
async function getResizedImageURL(file: File, maxDim = 1920): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      let { width, height } = img
      if (width > maxDim || height > maxDim) {
        const scale = Math.min(maxDim / width, maxDim / height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          if (blob) resolve(URL.createObjectURL(blob))
          else resolve(img.src)
        }, file.type || 'image/jpeg', 0.9)
      } else {
        resolve(img.src)
      }
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

// ─────────────────────────────────────
// Editor Page
// ─────────────────────────────────────
export function Editor() {
  // "pick" shows template picker overlay, "edit" shows full-screen editor
  const [step, setStep] = useState<'pick' | 'edit'>('edit')
  const [selectedSrc, setSelectedSrc] = useState<string | null>(null)

  // ── Template picker state ──
  const [memes, setMemes] = useState<MemeTemplate[]>([])
  const [filtered, setFiltered] = useState<MemeTemplate[]>([])
  const [page, setPage] = useState(1)
  const [searchQ, setSearchQ] = useState('')
  const [memesLoading, setMemesLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [pickerSelectedSrc, setPickerSelectedSrc] = useState<string | null>(null)
  
  // ── Trending picker state ──
  const [pickerTab, setPickerTab] = useState<'all' | 'trending'>('all')
  const [trendingMemes, setTrendingMemes] = useState<MemeTemplate[]>([])
  const [trendingLoading, setTrendingLoading] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fabricRef = useRef<unknown>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addImageInputRef = useRef<HTMLInputElement>(null)
  const [canvasKey, setCanvasKey] = useState(0)
  const [hasSelected, setHasSelected] = useState(false)
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [drawSettings, setDrawSettings] = useState<DrawSettings>(DEFAULT_DRAW)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [showLayersPanel, setShowLayersPanel] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isFullScreenPanelOpen, setIsFullScreenPanelOpen] = useState(false)
  const [isCropping, setIsCropping] = useState(false)
  const [showDrawSettings, setShowDrawSettings] = useState(false)
  const [isPickerReady, setIsPickerReady] = useState(false)
  const [isTemplateApplying, setIsTemplateApplying] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [textEdit, setTextEdit] = useState<TextEditState>({
    text: '',
    fontFamily: 'Impact',
    fontSize: 40,
    textColor: '#ffffff',
    strokeColor: '#000000',
  })

  // ── History (Undo/Redo) ──
  const historyRef = useRef<{ json: any; width: number; height: number }[]>([])
  const historyIndex = useRef<number>(-1)
  const isHistoryProcessing = useRef(false)
  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const saveHistory = useCallback(() => {
    if (isHistoryProcessing.current) return
    const fc = fabricRef.current as any
    if (!fc) return
    
    const json = fc.toJSON(['name', 'selectable', 'evented', 'visible', 'lockMovementX', 'lockMovementY'])
    const state = { json, width: fc.width, height: fc.height }
    
    historyRef.current = historyRef.current.slice(0, historyIndex.current + 1)
    historyRef.current.push(state)
    historyIndex.current = historyRef.current.length - 1
    
    setCanUndo(historyIndex.current > 0)
    setCanRedo(false)
  }, [])

  const undo = useCallback(() => {
    if (historyIndex.current > 0) {
      setIsCropping(false)
      isHistoryProcessing.current = true
      historyIndex.current--
      loadHistoryState(historyRef.current[historyIndex.current])
    }
  }, [])

  const redo = useCallback(() => {
    if (historyIndex.current < historyRef.current.length - 1) {
      setIsCropping(false)
      isHistoryProcessing.current = true
      historyIndex.current++
      loadHistoryState(historyRef.current[historyIndex.current])
    }
  }, [])

  function loadHistoryState(state: any) {
    const fc = fabricRef.current as any
    if (!fc || !state) return
    fc.clear()
    fc.setDimensions({ width: state.width, height: state.height })
    fc.loadFromJSON(state.json, () => {
      fc.renderAll()
      setCanUndo(historyIndex.current > 0)
      setCanRedo(historyIndex.current < historyRef.current.length - 1)
      isHistoryProcessing.current = false
    })
  }

  // ── Disable screen capture if possible ──
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp
    if (tg?.disableScreenCapture) {
      tg.disableScreenCapture()
    }
    return () => {
      if (tg?.enableScreenCapture) {
        tg.enableScreenCapture()
      }
    }
  }, [])

  // ── Fetch meme templates (lazy — only when picker is opened) ──
  function loadMemes() {
    if (memes.length > 0) return
    setMemesLoading(true)
    fetch('https://justmeme.wtf/api/v1/templates?limit=100')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setMemes(d.templates)
          setFiltered(d.templates)
        }
      })
      .catch(() => {})
      .finally(() => setMemesLoading(false))
  }

  // ── Fetch trending memes (lazy — only when trending tab is opened) ──
  useEffect(() => {
    if (pickerTab === 'trending' && trendingMemes.length === 0) {
      setTrendingLoading(true)
      fetch('https://justmeme.wtf/api/v1/trending')
        .then(r => r.json())
        .then(d => {
          if (d.success) {
            setTrendingMemes(d.trending)
          }
        })
        .catch(() => {})
        .finally(() => setTrendingLoading(false))
    }
  }, [pickerTab, trendingMemes.length])

  // ── Search filter (Client-side for <2 chars, Server-side for >= 2 chars) ──
  useEffect(() => {
    const q = searchQ.trim().toLowerCase()
    setPage(1)
    
    if (q.length < 2) {
      setFiltered(memes.filter(m => m.name.toLowerCase().includes(q)))
      setIsSearching(false)
      return
    }

    let isActive = true
    setIsSearching(true)
    
    const timer = setTimeout(() => {
      fetch(`https://justmeme.wtf/api/v1/templates/search?q=${encodeURIComponent(q)}`)
        .then(r => r.json())
        .then(d => {
          if (!isActive) return
          if (d.success) {
            setFiltered(d.templates)
          } else {
            setFiltered([])
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isActive) setIsSearching(false)
        })
    }, 400) // debounce

    return () => {
      isActive = false
      clearTimeout(timer)
    }
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

  const handleClearDrawings = useCallback(() => {
    const fc = fabricRef.current as any
    if (!fc) return
    saveHistory()
    const paths = fc.getObjects().filter((o: any) => o.type === 'path' && o.name !== 'cropRect')
    if (paths.length > 0) {
      paths.forEach((p: any) => fc.remove(p))
      fc.requestRenderAll()
    }
  }, [saveHistory])

  // ── AI Generate Implementation ──
  const handleAIGenerate = useCallback((topText: string, bottomText: string) => {
    const fc = fabricRef.current as any
    const fabric = window.fabric
    if (!fc || !fabric) return

    saveHistory()

    const createText = (text: string, yPos: number, isTop: boolean, originY: 'top' | 'bottom' | 'center') => {
      const maxW = fc.width * 0.96;
      
      const textObj = new fabric.Textbox(text.toUpperCase(), {
        left: fc.width / 2,
        top: yPos,
        width: maxW,
        fontFamily: 'Impact',
        fontSize: Math.min(fc.width * 0.12, 45), // Responsive font size
        fill: '#ffffff',
        stroke: '#000000',
        strokeWidth: 2,
        originX: 'center',
        originY: originY,
        textAlign: 'center',
        cornerColor: '#229ED9',
        cornerStrokeColor: '#ffffff',
        borderColor: '#229ED9',
        transparentCorners: false,
        name: `text-${Date.now()}-${isTop ? 'top' : 'bottom'}`,
      })
      fc.add(textObj)
    }

    if (topText && bottomText) {
      // Standard two-text meme
      createText(topText, fc.height * 0.05, true, 'top')
      createText(bottomText, fc.height * 0.95, false, 'bottom')
    } else if (topText && !bottomText) {
      // One-text meme, start it in the center so the user can easily drag it into position (e.g. a sign)
      createText(topText, fc.height * 0.5, true, 'center')
    } else if (!topText && bottomText) {
      createText(bottomText, fc.height * 0.5, false, 'center')
    }

    fc.renderAll()
    setShowAIPanel(false)
    if (isFullScreen) {
      setIsFullScreenPanelOpen(false)
    }
  }, [saveHistory, isFullScreen])

  // ── Go to editor with a chosen template ──
  const goToEdit = useCallback((src: string) => {
    setIsTemplateApplying(true)
    
    // Allow UI to paint the loading spinner first
    setTimeout(() => {
      setStep('edit') // Trigger the slide-down animation
      setIsDrawingMode(false)
      
      // Wait for the slide-down animation to finish before blocking main thread with Fabric
      setTimeout(() => {
        setSelectedSrc(src)
        setCanvasKey(k => k + 1)
        setPickerSelectedSrc(null)
        setIsTemplateApplying(false)
      }, 350)
    }, 50)
  }, [])

  // ── Fabric init ──
  useFabricCanvas({
    step,
    canvasKey,
    selectedSrc,
    canvasRef,
    containerRef,
    fabricRef,
    onSelectionCreated: onSel,
    onSelectionCleared: () => {
      setHasSelected(false)
      setShowEditPanel(false)
    },
    onSaveHistory: saveHistory,
  })

  function onSel(e: { selected: SelectableObj[] }) {
    const obj = e.selected?.[0]
    if (obj && (obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox')) {
      setHasSelected(true)
      setTextEdit({
        text: obj.text ?? '',
        fontFamily: obj.fontFamily ?? 'Impact',
        fontSize: obj.fontSize ?? 40,
        textColor: obj.fill ?? '#ffffff',
        strokeColor: obj.stroke ?? '#000000',
      })
    } else {
      setHasSelected(false)
    }
  }

  function addText() {
    if (!fabricRef.current) return
    const fc = fabricRef.current as any
    if (isCropping) cancelCrop()
    if (isDrawingMode) {
      setIsDrawingMode(false)
      fc.isDrawingMode = false
    }
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

  function handleRotate() {
    const fc = fabricRef.current as any
    const container = containerRef.current
    if (!fc || !container) return
    const active = fc.getActiveObject()
    if (active && active.name !== 'cropRect' && active.name !== 'watermark') {
      const currentAngle = (active.angle || 0)
      active.set('angle', (currentAngle + 90) % 360)
      active.setCoords()
      fc.requestRenderAll()
      saveHistory()
      return
    }

    const bg = fc.backgroundImage
    if (bg) {
      const currentAngle = (bg.angle || 0)
      const newAngle = (currentAngle + 90) % 360
      
      const isSideways = newAngle === 90 || newAngle === 270
      const rawW = bg.width
      const rawH = bg.height
      
      const activeW = isSideways ? rawH : rawW
      const activeH = isSideways ? rawW : rawH
      
      const maxW = Math.max(100, container.clientWidth - 16)
      const maxH = Math.max(100, container.clientHeight - 16)
      
      const scale = Math.min(maxW / activeW, maxH / activeH)
      const finalW = Math.round(activeW * scale)
      const finalH = Math.round(activeH * scale)
      
      const oldW = fc.width
      
      fc.setDimensions({ width: finalW, height: finalH })
      
      bg.set({
        angle: newAngle,
        scaleX: scale,
        scaleY: scale,
        originX: 'center',
        originY: 'center',
        left: finalW / 2,
        top: finalH / 2
      })
      
      const rescaleFactor = finalW / oldW
      fc.getObjects().forEach((o: any) => {
        o.left *= rescaleFactor
        o.top *= rescaleFactor
        o.scaleX = (o.scaleX || 1) * rescaleFactor
        o.scaleY = (o.scaleY || 1) * rescaleFactor
        o.setCoords()
      })
      
      fc.renderAll()
      saveHistory()
    }
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
    saveHistory()
  }

  function deleteText() {
    const fc = fabricRef.current as any
    if (!fc) return
    const active = fc.getActiveObject()
    if (active && active.type === 'text') {
      fc.remove(active)
      fc.discardActiveObject()
      fc.renderAll()
      setShowEditPanel(false)
      setHasSelected(false)
      saveHistory()
    }
  }



  function toggleCrop() {
    const fc = fabricRef.current as any
    if (!fc) return
    if (!isCropping) {
      if (isDrawingMode) {
        setIsDrawingMode(false)
        fc.isDrawingMode = false
      }
      setShowEditPanel(false)
      fc.discardActiveObject()
      setIsCropping(true)
      const cropRect = new (window as any).fabric.Rect({
        fill: 'rgba(0,0,0,0)',
        stroke: '#229ED9',
        strokeWidth: 3,
        strokeDashArray: [10, 5],
        width: fc.width * 0.8,
        height: fc.height * 0.8,
        left: fc.width * 0.1,
        top: fc.height * 0.1,
        cornerColor: '#229ED9',
        cornerSize: 16,
        transparentCorners: false,
        name: 'cropRect'
      })
      fc.add(cropRect)
      fc.setActiveObject(cropRect)
      fc.renderAll()
    } else {
      cancelCrop()
    }
  }

  function cancelCrop() {
    setIsCropping(false)
    const fc = fabricRef.current as any
    if (!fc) return
    const cropRect = fc.getObjects().find((o: any) => o.name === 'cropRect')
    if (cropRect) fc.remove(cropRect)
    fc.renderAll()
  }

  function confirmCrop() {
    const fc = fabricRef.current as any
    if (!fc) return
    const cropRect = fc.getObjects().find((o: any) => o.name === 'cropRect')
    if (!cropRect) return

    let cropX = cropRect.left
    let cropY = cropRect.top
    let cropW = cropRect.getScaledWidth()
    let cropH = cropRect.getScaledHeight()

    cropX = Math.max(0, cropX)
    cropY = Math.max(0, cropY)
    if (cropX + cropW > fc.width) cropW = fc.width - cropX
    if (cropY + cropH > fc.height) cropH = fc.height - cropY

    fc.remove(cropRect)

    const hiddenObjs: any[] = []
    fc.getObjects().forEach((o: any) => {
      if (o.visible) {
        o.visible = false
        hiddenObjs.push(o)
      }
    })
    fc.renderAll()

    const croppedData = fc.toDataURL({
      left: cropX,
      top: cropY,
      width: cropW,
      height: cropH,
      format: 'png',
      multiplier: 2
    })

    ;(window as any).fabric.Image.fromURL(croppedData, (newBg: any) => {
      hiddenObjs.forEach(o => {
        o.left -= cropX
        o.top -= cropY
        o.visible = true
        o.setCoords()
      })

      const container = containerRef.current
      if (container) {
        const maxW = Math.max(100, container.clientWidth - 16)
        const maxH = Math.max(100, container.clientHeight - 16)
        
        const rawW = newBg.width / 2
        const rawH = newBg.height / 2
        
        const scale = Math.min(maxW / rawW, maxH / rawH)
        const finalW = Math.round(rawW * scale)
        const finalH = Math.round(rawH * scale)
        
        const rescaleFactor = finalW / cropW
        hiddenObjs.forEach(o => {
          o.left *= rescaleFactor
          o.top *= rescaleFactor
          o.scaleX = (o.scaleX || 1) * rescaleFactor
          o.scaleY = (o.scaleY || 1) * rescaleFactor
          o.setCoords()
        })

        fc.setDimensions({ width: finalW, height: finalH })
        
        fc.setBackgroundImage(newBg, fc.renderAll.bind(fc), {
          originX: 'center',
          originY: 'center',
          left: finalW / 2,
          top: finalH / 2,
          scaleX: scale / 2,
          scaleY: scale / 2
        })
      }

      setIsCropping(false)
      fc.renderAll()
      saveHistory()
    })
  }

  function toggleDraw() {
    const fc = fabricRef.current as any
    if (!fc) return
    const next = !isDrawingMode
    fc.isDrawingMode = next
    if (next) {
      if (fc.freeDrawingBrush) {
        fc.freeDrawingBrush.color = drawSettings.color
        fc.freeDrawingBrush.width = drawSettings.width
      }
      if (isCropping) cancelCrop()
      setShowEditPanel(false)
      fc.discardActiveObject()
      setHasSelected(false)
    }
    setIsDrawingMode(next)
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

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const src = await getResizedImageURL(file)
      goToEdit(src)
    } catch (err) {
      console.error('Failed to load image', err)
    }
  }

  async function handleAddImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !fabricRef.current) return
    const fc = fabricRef.current as any
    const fabric = window.fabric
    try {
      const src = await getResizedImageURL(file)
      fabric.Image.fromURL(src, (img: any) => {
        img.scaleToWidth(fc.width / 2)
        img.set({ 
          originX: 'center',
          originY: 'center',
          left: fc.width / 2, 
          top: fc.height / 2 
        })
        fc.add(img)
        fc.setActiveObject(img)
        fc.renderAll()
        saveHistory()
      })
    } catch (err) {
      console.error('Failed to add image', err)
    }
  }

  function openPicker() {
    setIsPickerReady(false)
    setStep('pick')
    setTimeout(() => {
      loadMemes()
      setIsPickerReady(true)
    }, 300)
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FULL-SCREEN EDITOR  (shown first — step === 'edit')
  // Matches the profile page dark aesthetic: bg-black, rounded panels, etc.
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col bg-black -mx-4 -mt-4 relative select-none [&_*]:select-none" style={{ height: 'calc(100dvh - 80px)', WebkitTouchCallout: 'none' }}>
      {/* Hidden file inputs */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      <input ref={addImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleAddImageUpload} />

      {/* ── If no template chosen yet — show a "Choose Template" prompt in the canvas area ── */}
      {!selectedSrc ? (
        <div className="flex flex-col h-full bg-[#0e0e10]">
          <EditorTopBar
            onAddImage={() => addImageInputRef.current?.click()}
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

          <EditorBottomActions
            onSave={() => {}}
          />
        </div>
      ) : (
        <>
          {/* ── Top bar ── */}
          {!isFullScreen && (
            <EditorTopBar
              onAddImage={() => addImageInputRef.current?.click()}
              onChangeTemplate={openPicker}
            />
          )}

          {/* ── Canvas + side toolbar (flex-1 fills all space between top and bottom) ── */}
          <div className={`relative flex-1 flex flex-col min-h-0 min-w-0 ${isFullScreen ? 'fixed inset-0 z-50 bg-black overflow-hidden' : ''}`}>
            <EditorCanvas
              isFullScreen={isFullScreen}
              onToggleFullScreen={() => setIsFullScreen(prev => !prev)}
              canvasKey={canvasKey}
              canvasRef={canvasRef}
              containerRef={containerRef}
              isDrawingMode={isDrawingMode}
              onToggleDraw={toggleDraw}
              onRotate={handleRotate}
              onCrop={toggleCrop}
              onToggleLayers={() => setShowLayersPanel(p => !p)}
              onAddText={addText}
              onEditText={() => {
                if (isCropping) cancelCrop()
                if (isDrawingMode) {
                  setIsDrawingMode(false)
                  const fc = fabricRef.current as any
                  if (fc) fc.isDrawingMode = false
                }
                setShowEditPanel(true)
              }}
              onGenerateAI={() => {
                if (isCropping) cancelCrop()
                setShowAIPanel(true)
              }}
              hasSelected={hasSelected}
              onUndo={undo}
              onRedo={redo}
              canUndo={canUndo}
              canRedo={canRedo}
            />

            <LayersPanel
              isOpen={showLayersPanel}
              onClose={() => setShowLayersPanel(false)}
              fabricRef={fabricRef}
              isFullScreen={isFullScreen}
            />



            {/* ── Full Screen Close Button (Top Right) ── */}
            <AnimatePresence>
              {isFullScreen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-[calc(env(safe-area-inset-top)+16px)] right-4 z-[51]"
                >
                  <button
                    onClick={() => { setIsFullScreen(false); setIsFullScreenPanelOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 text-white shadow-lg active:scale-95 transition-all"
                  >
                    <X size={16} />
                    <span className="text-[12px] font-bold">Close Full Screen</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Full Screen Right Panel Backdrop ── */}
            {isFullScreen && isFullScreenPanelOpen && (
              <div className="absolute inset-0 z-40" onClick={() => setIsFullScreenPanelOpen(false)} />
            )}

            {/* ── Full Screen Right Panel ── */}
            <AnimatePresence>
              {isFullScreen && (
                <motion.div 
                  className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center z-50"
                  initial={{ x: 180, opacity: 0 }}
                  animate={{ x: isFullScreenPanelOpen ? 0 : 180, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                  {/* Toggle handle */}
                  <button 
                    onClick={() => setIsFullScreenPanelOpen(!isFullScreenPanelOpen)}
                    className="w-6 h-12 bg-[#1c1c1e]/90 backdrop-blur-md border border-white/10 border-r-0 rounded-l-xl flex items-center justify-center shadow-[-4px_0_16px_rgba(0,0,0,0.3)] hover:bg-[#252528] transition-colors text-white/60 hover:text-white"
                  >
                    {isFullScreenPanelOpen ? <ChevronRight size={16} strokeWidth={2.5} /> : <ChevronLeft size={16} strokeWidth={2.5} />}
                  </button>

                  {/* Panel Content */}
                  <div className="w-[180px] bg-[#1c1c1e]/95 backdrop-blur-xl border-y border-l border-white/10 rounded-l-2xl h-auto py-2 shadow-[-8px_0_32px_rgba(0,0,0,0.5)]">
                    <div className="w-[180px] flex flex-col gap-1 px-2">
                      <button onClick={() => { setIsFullScreenPanelOpen(false); openPicker(); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/80 transition-colors text-[13px] font-semibold">
                        <Search size={16} /> Change Template
                      </button>
                      <button onClick={() => { setIsFullScreenPanelOpen(false); addImageInputRef.current?.click(); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/80 transition-colors text-[13px] font-semibold">
                        <Upload size={16} /> Add Image
                      </button>
                      <button onClick={() => { setIsFullScreenPanelOpen(false); undo(); }} disabled={!canUndo} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors text-[13px] font-semibold ${canUndo ? 'hover:bg-white/10 text-white/80' : 'text-white/30 cursor-not-allowed'}`}>
                        <Undo2 size={16} /> Undo
                      </button>
                      <button 
                        onClick={() => { 
                          if (hasSelected) {
                            if (isDrawingMode) toggleDraw(); 
                            setShowEditPanel(true); 
                          } else {
                            addText();
                          }
                          setIsFullScreenPanelOpen(false);
                        }} 
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/80 transition-colors text-[13px] font-semibold"
                      >
                        {hasSelected ? <Edit2 size={16} className="text-[#3b82f6]" /> : <Type size={16} />}
                        Text Editor
                      </button>
                      <button onClick={handleRotate} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/80 transition-colors text-[13px] font-semibold">
                        <RotateCw size={16} /> Rotate
                      </button>
                      <button onClick={() => { setIsFullScreenPanelOpen(false); toggleCrop(); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-white/10 text-white/80 transition-colors text-[13px] font-semibold">
                        <Crop size={16} /> Crop
                      </button>
                      <button onClick={() => { setIsFullScreenPanelOpen(false); toggleDraw(); }} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-colors text-[13px] font-semibold ${isDrawingMode ? 'bg-[#229ED9]/20 text-[#229ED9]' : 'hover:bg-white/10 text-white/80'}`}>
                        <Pencil size={16} /> Draw
                      </button>
                      <button onClick={() => { setIsFullScreenPanelOpen(false); setShowAIPanel(true); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-violet-500/10 text-violet-400 transition-colors text-[13px] font-semibold">
                        <Sparkles size={16} /> AI Generate
                      </button>
                      
                      <div className="h-px bg-white/10 my-1 mx-2" />
                      
                      <button onClick={() => { setIsFullScreen(false); setIsFullScreenPanelOpen(false); }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-[13px] font-semibold mt-1">
                        <X size={16} /> Close Full Screen
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Bottom actions (or Crop actions) ── */}
          <AnimatePresence mode="wait">
            {isCropping ? (
              <motion.div
                key="crop-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`${isFullScreen ? 'absolute bottom-8 left-0 right-0 z-50 bg-[#111113]/95 backdrop-blur-xl border-t border-white/10 pt-3 pb-safe' : 'pt-2'} px-4 pb-4 flex gap-3`}
              >
                <button
                  onClick={cancelCrop}
                  className="flex-1 py-3 rounded-[14px] bg-[#1c1c1e] text-white font-bold text-[14px] border border-white/10 hover:bg-[#252528] active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmCrop}
                  className="flex-1 py-3 rounded-[14px] bg-[#229ED9] text-white font-bold text-[14px] shadow-[0_4px_24px_rgba(34,158,217,0.4)] hover:bg-[#2ab6f6] active:scale-[0.98] transition-all"
                >
                  Confirm Crop
                </button>
              </motion.div>
            ) : isDrawingMode ? (
              <motion.div
                key="draw-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`${isFullScreen ? 'absolute bottom-8 left-0 right-0 z-[55] bg-[#111113]/95 backdrop-blur-xl border-t border-white/10 pt-3 pb-safe' : 'pt-2'} px-4 pb-4 flex gap-3`}
              >
                <button
                  onClick={toggleDraw}
                  className="flex-1 py-3 rounded-[14px] bg-[#1c1c1e] text-white font-bold text-[14px] border border-white/10 hover:bg-[#252528] active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowDrawSettings(true)}
                  className="flex-1 py-3 rounded-[14px] bg-[#229ED9] text-white font-bold text-[14px] shadow-[0_4px_24px_rgba(34,158,217,0.4)] hover:bg-[#2ab6f6] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Pencil size={16} /> Brush Settings
                </button>
              </motion.div>
            ) : (
              !isFullScreen && (
                <motion.div key="bottom-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <EditorBottomActions onSave={sendToBot} />
                </motion.div>
              )
            )}
          </AnimatePresence>
        </>
      )}

      {/* ── Draw Settings Popup ── */}
      <AnimatePresence>
        {showDrawSettings && isDrawingMode && (
          <>
            <div 
              className="absolute inset-0 z-[60]" 
              onClick={() => setShowDrawSettings(false)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.18 }}
              className={`absolute bottom-24 right-4 z-[65] bg-[#15161a]/95 backdrop-blur-xl border border-white/15 rounded-[22px] p-4 w-64 shadow-[0_16px_40px_rgba(0,0,0,0.6)]`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Pencil size={15} className="text-[#229ED9]" />
                  <span className="text-white font-bold text-[13px]">Brush Settings</span>
                </div>
                <button
                  onClick={() => setShowDrawSettings(false)}
                  className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>

              {/* Color swatches */}
              <div className="mb-3.5">
                <span className="text-white/50 text-[11px] font-semibold mb-2 block">Brush Color</span>
                <div className="grid grid-cols-5 gap-1.5 mb-2">
                  {DRAW_COLORS.map(c => (
                    <button
                      key={c}
                      onClick={() => updateDrawSettings({ color: c })}
                      className={`w-7 h-7 rounded-full border-2 transition-all active:scale-90 ${
                        drawSettings.color === c
                          ? 'border-white scale-110 shadow-lg'
                          : 'border-transparent hover:border-white/40'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                {/* Custom color input */}
                <div className="flex items-center justify-between bg-white/5 rounded-[10px] px-2.5 py-1.5 border border-white/8">
                  <span className="text-white/60 text-[11px] font-semibold">Custom Color</span>
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white/20 relative overflow-hidden"
                    style={{ backgroundColor: drawSettings.color }}
                  >
                    <input
                      type="color"
                      value={drawSettings.color}
                      onChange={e => updateDrawSettings({ color: e.target.value })}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Brush width / size */}
              <div className="mb-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/50 text-[11px] font-semibold">Brush Size</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white text-[11px] font-bold">{drawSettings.width}px</span>
                    <div
                      className="rounded-full bg-white transition-all border border-black/30"
                      style={{
                        width: Math.min(18, Math.max(4, drawSettings.width / 2)),
                        height: Math.min(18, Math.max(4, drawSettings.width / 2)),
                        backgroundColor: drawSettings.color,
                        opacity: drawSettings.opacity,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateDrawSettings({ width: Math.max(1, drawSettings.width - 2) })}
                    className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors shrink-0"
                  >
                    <Minus size={10} />
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    value={drawSettings.width}
                    onChange={e => updateDrawSettings({ width: parseInt(e.target.value) })}
                    className="flex-1 accent-[#229ED9]"
                  />
                  <button
                    onClick={() => updateDrawSettings({ width: Math.min(50, drawSettings.width + 2) })}
                    className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors shrink-0"
                  >
                    <Plus size={10} />
                  </button>
                </div>
              </div>

              {/* Opacity */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white/50 text-[11px] font-semibold">Opacity</span>
                  <span className="text-white text-[11px] font-bold">{Math.round(drawSettings.opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={Math.round(drawSettings.opacity * 100)}
                  onChange={e => updateDrawSettings({ opacity: parseInt(e.target.value) / 100 })}
                  className="w-full accent-[#229ED9]"
                />
              </div>

              {/* Eraser / Undo Tools */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => undo()}
                  disabled={!canUndo}
                  className={`flex items-center gap-1.5 text-[12px] font-bold transition-colors ${canUndo ? 'text-white hover:text-white' : 'text-white/30 cursor-not-allowed'}`}
                >
                  <Undo2 size={14} /> Undo Stroke
                </button>
                <button
                  onClick={() => handleClearDrawings()}
                  className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors text-[12px] font-bold"
                >
                  <Trash2 size={14} /> Clear All
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Text Edit Bottom Sheet ── */}
      <TextEditPanel
        open={showEditPanel}
        textEdit={textEdit}
        onApply={applyTextEdit}
        onDelete={deleteText}
        onClose={() => setShowEditPanel(false)}
      />

      {/* ── AI Generation Panel ── */}
      <AIPanel
        open={showAIPanel}
        templateId={selectedSrc ? new URL(selectedSrc).pathname.split('/').pop()?.split('.')[0] || 'meme' : 'meme'}
        onApply={handleAIGenerate}
        onClose={() => setShowAIPanel(false)}
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
            {/* ── Content sheet — matches profile page ── */}
            <div className="bg-black relative z-10 flex-1 flex flex-col overflow-hidden mt-12 rounded-t-[28px] border-t border-white/10">
              {/* Drag handle */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-4 mb-4 shrink-0" />
              
              {/* Header & Cancel */}
              <div className="flex items-center justify-between px-5 mb-5">
                <div>
                  <h1 className="text-white font-bold text-[20px] mb-0.5">Meme Zone</h1>
                  <p className="text-white/40 text-[12px]">Pick a template or upload your own</p>
                </div>
                <button
                  onClick={() => setStep('edit')}
                  className="px-3.5 py-1.5 rounded-[10px] bg-red-500/15 text-red-400 font-semibold text-[13px] border border-red-500/20 active:scale-[0.97] transition-all"
                >
                  Cancel
                </button>
              </div>

              {/* Upload button */}
              <div className="px-5 mb-4 shrink-0">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-[14px] bg-white/5 border border-dashed border-white/15 text-white/70 hover:border-[#229ED9]/60 hover:text-[#229ED9] transition-all text-[14px] font-semibold"
                >
                  <Upload size={18} />
                  Upload from Gallery
                </button>
              </div>

              {/* Search */}
              <div className="px-4 mb-3 shrink-0">
                <div className="flex items-center gap-2.5 bg-[#1c1c1e] rounded-[13px] px-3 py-2.5 border border-white/8">
                  <Search size={15} className="text-white/40 shrink-0" />
                  <input
                    value={searchQ}
                    onChange={e => { setSearchQ(e.target.value); setPickerTab('all'); }}
                    placeholder="Search meme templates..."
                    className="flex-1 bg-transparent text-white text-[14px] placeholder-white/30 outline-none"
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 px-5 mb-3 border-b border-white/10 shrink-0">
                <button 
                  onClick={() => setPickerTab('all')}
                  className={`pb-2.5 text-[14px] font-semibold transition-colors relative ${pickerTab === 'all' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                >
                  All
                  {pickerTab === 'all' && <motion.div layoutId="pickerTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#229ED9]" />}
                </button>
                <button 
                  onClick={() => setPickerTab('trending')}
                  className={`pb-2.5 text-[14px] font-semibold transition-colors relative ${pickerTab === 'trending' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                >
                  Trending
                  {pickerTab === 'trending' && <motion.div layoutId="pickerTabLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#229ED9]" />}
                </button>
              </div>

              {/* Grid — scrollable */}
              <div className="flex-1 overflow-y-auto px-4 pb-4">
                {(!isPickerReady || (pickerTab === 'all' ? memesLoading || isSearching : trendingLoading)) ? (
                  <div className="grid grid-cols-3 gap-2.5">
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-[12px] bg-[#1c1c1e] animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2.5">
                      {/* Blank (Only in All tab) */}
                      {pickerTab === 'all' && (
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
                      )}

                      {(pickerTab === 'all' ? visibleMemes : trendingMemes).map(meme => (
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

                    {pickerTab === 'all' && hasMore && (
                      <button
                        onClick={() => setPage(p => p + 1)}
                        className="w-full mt-4 py-3 rounded-[13px] bg-[#1c1c1e] border border-white/10 text-white/60 text-[13px] font-semibold hover:bg-white/8 transition-colors"
                      >
                        Load more
                      </button>
                    )}

                    {pickerTab === 'all' && !hasMore && !isSearching && searchQ.length === 0 && (
                      <div className="w-full mt-8 pb-4 flex flex-col items-center justify-center text-center">
                        <Search size={22} className="text-white/20 mb-2" />
                        <p className="text-white/40 text-[12px] leading-relaxed max-w-[200px]">
                          Can't find it?<br/>Use the search bar above to explore 2000+ templates!
                        </p>
                      </div>
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
                      onClick={() => !isTemplateApplying && pickerSelectedSrc && goToEdit(pickerSelectedSrc)}
                      className="w-full py-3.5 rounded-[16px] bg-[#229ED9] text-white font-bold text-[15px] shadow-[0_8px_24px_rgba(34,158,217,0.4)] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                    >
                      {isTemplateApplying ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Preparing...
                        </>
                      ) : (
                        'Use This Template →'
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Close picker — no template selected */}
              {!pickerSelectedSrc && (
                <div className="h-4 shrink-0" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Editor
