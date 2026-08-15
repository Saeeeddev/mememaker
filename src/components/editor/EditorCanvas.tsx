import { useRef, useEffect } from 'react'
import { RotateCw, Crop, Pencil, Layers as LayersIcon, Type, Sparkles, Maximize, Edit2, Undo2, Redo2 } from 'lucide-react'
import watermarkSrc from '../../assets/images/WaterMarkSmallOne.webp'
import { useTranslation } from 'react-i18next'

/* Fabric loaded via CDN in index.html */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fabric: any
  }
}

export interface SelectableObj {
  type: string
  text?: string
  fontFamily?: string
  fontSize?: number
  fill?: string
  stroke?: string
}

export interface DrawSettings {
  color: string
  width: number
  opacity: number
}

interface EditorCanvasProps {
  canvasKey: number
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  isDrawingMode: boolean
  onToggleDraw: () => void
  onRotate?: () => void
  onCrop?: () => void
  onToggleLayers?: () => void
  onAddText?: () => void
  onEditText?: () => void
  onGenerateAI?: () => void
  hasSelected?: boolean
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
  isFullScreen?: boolean
  onToggleFullScreen?: () => void
}

/** Converts Hex / RGB + opacity into RGBA string for Fabric freeDrawingBrush */
export function colorToRgba(color: string, opacity: number): string {
  if (!color) return `rgba(239, 68, 68, ${opacity})`
  if (color.startsWith('rgba')) {
    return color.replace(/rgba?\(([^)]+)\)/, (_, p1) => {
      const parts = p1.split(',').map((s: string) => s.trim())
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${opacity})`
    })
  }
  if (color.startsWith('rgb')) {
    const matches = color.match(/\d+/g)
    if (matches && matches.length >= 3) {
      return `rgba(${matches[0]}, ${matches[1]}, ${matches[2]}, ${opacity})`
    }
  }
  let hex = color.replace('#', '')
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('')
  }
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
  return color
}

export function EditorCanvas({
  canvasKey,
  canvasRef,
  containerRef,
  isDrawingMode,
  onToggleDraw,
  onRotate,
  onCrop,
  onToggleLayers,
  onAddText,
  onEditText,
  onGenerateAI,
  hasSelected,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isFullScreen,
  onToggleFullScreen,
}: EditorCanvasProps) {
  const { t } = useTranslation()

  // When draw mode toggles, also open settings if turning on
  const handleToggleDraw = () => {
    onToggleDraw()
  }

  return (
    <div className="flex-1 flex gap-2 px-4 py-2 min-h-0 min-w-0 relative overflow-hidden">
      {/* Main canvas holder container — measures actual available width & height */}
      <div
        ref={containerRef}
        key={canvasKey}
        className="flex-1 rounded-[18px] overflow-hidden border border-white/10 bg-[#0e0e10] flex items-center justify-center relative min-h-0 min-w-0 shadow-inner"
      >
        <canvas ref={canvasRef} className="block shadow-2xl rounded-sm" />



        {/* Floating Controls (Top Left) */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {/* Layers Button */}
          <button
            onClick={onToggleLayers}
            className="w-10 h-10 rounded-[12px] bg-[#1c1c1e]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all shadow-lg active:scale-95"
          >
            <LayersIcon size={18} />
          </button>

          {/* Undo/Redo Box */}
          <div className="flex items-center h-10 rounded-[12px] bg-[#1c1c1e]/80 backdrop-blur-md border border-white/10 shadow-lg px-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`w-9 h-8 rounded-[8px] flex items-center justify-center transition-all ${
                canUndo 
                  ? 'text-white/80 hover:bg-white/20 hover:text-white active:scale-95' 
                  : 'text-white/20 cursor-not-allowed'
              }`}
            >
              <Undo2 size={16} />
            </button>
            <div className="w-px h-5 bg-white/10 mx-0.5" />
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`w-9 h-8 rounded-[8px] flex items-center justify-center transition-all ${
                canRedo 
                  ? 'text-white/80 hover:bg-white/20 hover:text-white active:scale-95' 
                  : 'text-white/20 cursor-not-allowed'
              }`}
            >
              <Redo2 size={16} />
            </button>
          </div>
        </div>

        {/* Floating Full Size Button (Bottom Right) */}
        {!isFullScreen && (
          <button
            onClick={onToggleFullScreen}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-[12px] bg-[#1c1c1e]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all shadow-lg active:scale-95 z-40"
          >
            <Maximize size={18} />
          </button>
        )}
      </div>

      {/* Vertical side toolbar */}
      {!isFullScreen && (
        <div className="flex flex-col gap-2 w-12 shrink-0">
        {/* Draw button */}
        <button
          onClick={handleToggleDraw}
          title={t('editor.draw')}
          className={`relative w-12 h-12 rounded-[14px] flex flex-col items-center justify-center gap-0.5 transition-all active:scale-[0.95] border ${
            isDrawingMode
              ? 'bg-[#229ED9]/25 border-[#229ED9]/60 text-[#229ED9] shadow-[0_0_12px_rgba(34,158,217,0.3)]'
              : 'bg-[#1c1c1e] border-white/10 text-white/60 hover:bg-[#252528] hover:text-white/90 hover:border-white/20'
          }`}
        >
          <Pencil size={17} />
          <span className={`text-[8px] font-semibold tracking-wide ${isDrawingMode ? 'text-[#229ED9]' : 'text-white/40'}`}>{t('editor.draw')}</span>
          {isDrawingMode && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#229ED9] shadow-[0_0_6px_#229ED9]" />
          )}
        </button>

        {/* Rotate button */}
        <button
          onClick={onRotate}
          title={t('editor.rotate')}
          className="w-12 h-12 rounded-[14px] bg-[#1c1c1e] border border-white/10 flex flex-col items-center justify-center gap-0.5 text-white/60 hover:bg-[#252528] hover:text-white/90 hover:border-white/20 active:scale-[0.95] transition-all"
        >
          <RotateCw size={17} />
          <span className="text-[8px] font-semibold tracking-wide text-white/40">{t('editor.rotate')}</span>
        </button>

        {/* Crop button */}
        <button
          onClick={onCrop}
          title={t('editor.crop')}
          className="w-12 h-12 rounded-[14px] bg-[#1c1c1e] border border-white/10 flex flex-col items-center justify-center gap-0.5 text-white/60 hover:bg-[#252528] hover:text-white/90 hover:border-white/20 active:scale-[0.95] transition-all"
        >
          <Crop size={17} />
          <span className="text-[8px] font-semibold tracking-wide text-white/40">{t('editor.crop')}</span>
        </button>

        {/* Text button */}
        <button
          onClick={hasSelected ? onEditText : onAddText}
          title={hasSelected ? t('editor.edit') : t('editor.text')}
          className="w-12 h-12 rounded-[14px] bg-[#1c1c1e] border border-white/10 flex flex-col items-center justify-center gap-0.5 text-white/60 hover:bg-[#252528] hover:text-white/90 hover:border-white/20 active:scale-[0.95] transition-all"
        >
          {hasSelected ? <Edit2 size={17} className="text-[#3b82f6]" /> : <Type size={17} />}
          <span className={`text-[8px] font-semibold tracking-wide ${hasSelected ? 'text-[#3b82f6]' : 'text-white/40'}`}>
            {hasSelected ? t('editor.edit') : t('editor.text')}
          </span>
        </button>

        {/* AI Generate button */}
        <button
          onClick={onGenerateAI}
          title={t('editor.ai')}
          className="relative w-12 h-12 rounded-[14px] bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/20 flex flex-col items-center justify-center gap-0.5 text-violet-400 hover:from-violet-600/20 hover:to-indigo-600/20 hover:text-violet-300 hover:border-violet-500/40 active:scale-[0.95] transition-all"
        >
          <Sparkles size={17} />
          <span className="text-[8px] font-semibold tracking-wide">{t('editor.ai')}</span>
          <span className="absolute -top-1 -right-1 bg-violet-500 text-white text-[6px] font-bold px-1 rounded-sm">
           
          </span>
        </button>
      </div>
      )}
    </div>
  )
}

/* ──────────────────────────────────────────────────────────
   Fabric initialisation hook — robust canvas sizing
────────────────────────────────────────────────────────── */

export function applyWatermark(fc: any, width: number, height: number, callback?: () => void) {
  const existing = fc.getObjects().find((o: any) => o.name === 'watermark');
  if (existing) {
    fc.remove(existing);
  }

  window.fabric.Image.fromURL(
    watermarkSrc,
    (wmImg: any) => {
      if (!wmImg || !wmImg.width) {
        console.error('Failed to load watermark image', wmImg);
        if (callback) callback();
        return;
      }
      wmImg.set({
        left: width / 2,
        top: height / 2,
        originX: 'center',
        originY: 'center',
        scaleX: width / wmImg.width,
        scaleY: height / wmImg.height,
        selectable: false,
        evented: false,
        name: 'watermark',
        opacity: 1
      });
      fc.add(wmImg);
      wmImg.bringToFront();
      fc.renderAll();
      if (callback) callback();
    },
    { crossOrigin: 'anonymous' }
  );
}

export function useFabricCanvas({
  step,
  canvasKey,
  selectedSrc,
  canvasRef,
  containerRef,
  fabricRef,
  drawSettings,
  onSelectionCreated,
  onSelectionCleared,
  onSaveHistory,
  onEditText,
}: {
  step: string
  canvasKey: number
  selectedSrc: string | null
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  containerRef: React.RefObject<HTMLDivElement | null>
  fabricRef: React.MutableRefObject<unknown>
  drawSettings?: DrawSettings
  onSelectionCreated: (e: { selected: SelectableObj[] }) => void
  onSelectionCleared: () => void
  onSaveHistory?: () => void
  onEditText?: () => void
}) {
  const onSelRef = useRef(onSelectionCreated)
  onSelRef.current = onSelectionCreated
  const onClearRef = useRef(onSelectionCleared)
  onClearRef.current = onSelectionCleared
  const onEditRef = useRef(onEditText)
  onEditRef.current = onEditText

  useEffect(() => {
    if (step !== 'edit' || !selectedSrc) return

    let animationFrameId: number

    const initCanvas = () => {
      if (!canvasRef.current || !containerRef.current || !window.fabric) return
      const fabric = window.fabric
      const container = containerRef.current

      // --- CUSTOM CONTROLS OVERRIDE ---
      if (!fabric.Object.prototype.customiseDone) {
        fabric.Object.prototype.customiseDone = true
        
        fabric.Object.prototype.set({
          transparentCorners: false,
          borderColor: 'rgba(255,255,255,0.8)',
          cornerSize: 28,
          padding: 10,
          cornerStyle: 'circle',
          borderDashArray: undefined
        })

        const deleteSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        const rotateSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>`
        const scaleSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M9 21H3v-6"></path><path d="M21 3l-7 7"></path><path d="M3 21l7-7"></path></svg>`
        const editSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23333" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`

        const deleteImg = new Image(); deleteImg.src = deleteSvg
        const rotateImg = new Image(); rotateImg.src = rotateSvg
        const scaleImg = new Image(); scaleImg.src = scaleSvg
        const editImg = new Image(); editImg.src = editSvg

        function renderIcon(icon: HTMLImageElement) {
          return function(this: any, ctx: CanvasRenderingContext2D, left: number, top: number) {
            const size = this.cornerSize || 28
            ctx.save()
            ctx.translate(left, top)
            
            ctx.shadowColor = 'rgba(0,0,0,0.15)'
            ctx.shadowBlur = 4
            ctx.shadowOffsetY = 1
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            ctx.arc(0, 0, size/2, 0, 2 * Math.PI, false)
            ctx.fill()
            
            ctx.shadowColor = 'transparent'
            ctx.strokeStyle = 'rgba(0,0,0,0.1)'
            ctx.lineWidth = 1
            ctx.stroke()

            if (icon && icon.complete) {
              const iconSize = size * 0.55
              ctx.drawImage(icon, -iconSize/2, -iconSize/2, iconSize, iconSize)
            }
            ctx.restore()
          }
        }

        function renderCircle(this: any, ctx: CanvasRenderingContext2D, left: number, top: number) {
          const size = this.cornerSize || 28
          ctx.save()
          ctx.translate(left, top)
          
          ctx.fillStyle = '#ffffff'
          ctx.shadowColor = 'rgba(0,0,0,0.15)'
          ctx.shadowBlur = 4
          ctx.shadowOffsetY = 1
          ctx.beginPath()
          ctx.arc(0, 0, size/4, 0, 2 * Math.PI, false)
          ctx.fill()
          
          ctx.shadowColor = 'transparent'
          ctx.strokeStyle = 'rgba(0,0,0,0.1)'
          ctx.lineWidth = 1
          ctx.stroke()
          ctx.restore()
        }

        const customControls = Object.assign({}, fabric.Object.prototype.controls)
        
        if (customControls.tl) {
          customControls.tl = new fabric.Control({
            ...customControls.tl,
            render: renderIcon(deleteImg),
            actionHandler: () => false,
            mouseUpHandler: (_eventData: any, transform: any) => {
              const target = transform.target
              const canvas = target.canvas
              canvas.remove(target)
              canvas.requestRenderAll()
              return true
            },
            cursorStyle: 'pointer'
          })
        }
        
        if (customControls.tr) {
          customControls.tr = new fabric.Control({
            ...customControls.tr,
            render: renderIcon(rotateImg),
            actionHandler: fabric.controlsUtils.rotationWithSnapping,
            cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
            actionName: 'rotate'
          })
        }
        
        if (customControls.br) {
          customControls.br = new fabric.Control({
            ...customControls.br,
            render: renderIcon(scaleImg)
          })
        }
        
        customControls.bl = new fabric.Control({
          x: -0.5,
          y: 0.5,
          render: renderIcon(editImg),
          actionHandler: () => false,
          mouseUpHandler: (_eventData: any, transform: any) => {
            const target = transform.target
            if (target.type === 'textbox' || target.type === 'i-text' || target.type === 'text') {
              target.canvas.fire('custom:edit_clicked', { target })
            }
            return true
          },
          cursorStyle: 'pointer'
        })
        
        delete customControls.mtr
        
        ;['mt', 'mb', 'ml', 'mr'].forEach(c => {
          if (customControls[c]) {
            customControls[c] = new fabric.Control({
              ...customControls[c],
              render: renderCircle
            })
          }
        })

        fabric.Text.prototype.controls = customControls
        if (fabric.IText) fabric.IText.prototype.controls = customControls
        if (fabric.Textbox) fabric.Textbox.prototype.controls = customControls
        fabric.Image.prototype.controls = customControls
      }
      // --- END CUSTOM CONTROLS ---

      // Dispose existing fabric instance if present
      if (fabricRef.current) {
        try { (fabricRef.current as any).dispose() } catch (_) {}
        fabricRef.current = null
      }

      // Measure exact container inner dimensions
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      if (containerWidth <= 0 || containerHeight <= 0) {
        animationFrameId = requestAnimationFrame(initCanvas)
        return
      }

      const fc = new fabric.Canvas(canvasRef.current, {
        selection: true,
        preserveObjectStacking: true,
      })
      fabricRef.current = fc

      // Apply initial brush color & width if drawing brush exists
      if (fc.freeDrawingBrush && drawSettings) {
        fc.freeDrawingBrush.color = colorToRgba(drawSettings.color, drawSettings.opacity)
        fc.freeDrawingBrush.width = drawSettings.width
      }

      fabric.Image.fromURL(
        selectedSrc,
        (img: { width: number; height: number }) => {
          if (!img || !img.width || !img.height) return

          // Fill container while maintaining aspect ratio, leaving slight padding
          const maxW = Math.max(100, containerWidth - 16)
          const maxH = Math.max(100, containerHeight - 16)

          const scale = Math.min(maxW / img.width, maxH / img.height)
          const finalW = Math.round(img.width * scale)
          const finalH = Math.round(img.height * scale)

          fc.setDimensions({ width: finalW, height: finalH })

          fc.setBackgroundImage(
            img,
            fc.renderAll.bind(fc),
            {
              scaleX: scale,
              scaleY: scale,
              originX: 'left',
              originY: 'top',
              crossOrigin: 'anonymous',
            }
          )

          // Add watermark image
          applyWatermark(fc, finalW, finalH, () => {
            if (onSaveHistory) onSaveHistory();
          });
        },
        { crossOrigin: 'anonymous' }
      )

      fc.on('selection:created', (e: any) => onSelRef.current(e))
      fc.on('selection:updated', (e: any) => onSelRef.current(e))
      fc.on('selection:cleared', () => onClearRef.current())
      fc.on('custom:edit_clicked', () => {
        if (onEditRef.current) onEditRef.current()
      })

      fc.on('path:created', (e: any) => {
        if (e.path) {
          e.path.set({ selectable: false, evented: false })
        }
        if (onSaveHistory) onSaveHistory()
      })

      fc.on('object:modified', (e: any) => {
        if (e.target?.name === 'cropRect') return;
        if (onSaveHistory) onSaveHistory()
      })

      fc.on('object:added', (e: { target: { name: string } }) => {
        if (e.target?.name !== 'watermark' && e.target?.name !== 'cropRect') {
          const objs = fc.getObjects()
          for (const o of objs) {
            if (o.name === 'watermark') { o.bringToFront(); break }
          }
          // Do not save history when cropRect is added
          if (onSaveHistory) onSaveHistory()
        }
      })

      fc.on('object:removed', (e: { target: { name: string } }) => {
        // Do not save history when cropRect is removed
        if (e.target?.name !== 'cropRect' && onSaveHistory) {
          onSaveHistory()
        }
      })

    }

    const timer = setTimeout(initCanvas, 40)

    return () => {
      clearTimeout(timer)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      if (fabricRef.current) {
        try { (fabricRef.current as any).dispose() } catch (_) {}
        fabricRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasKey, step, selectedSrc])
}

