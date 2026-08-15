import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Lock, Unlock, Layers as LayersIcon, X, ChevronUp, ChevronDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LayersPanelProps {
  isOpen: boolean
  onClose: () => void
  fabricRef: React.MutableRefObject<any>
  isFullScreen?: boolean
}

interface LayerItem {
  id: string
  name: string
  visible: boolean
  locked: boolean
  type: string
  preview?: string
  obj: any
  isBackground: boolean
}

export function LayersPanel({ isOpen, onClose, fabricRef, isFullScreen }: LayersPanelProps) {
  const [layers, setLayers] = useState<LayerItem[]>([])
  const [selectedObj, setSelectedObj] = useState<any>(null)
  const { t } = useTranslation()

  const refreshLayers = () => {
    const fc = fabricRef.current
    if (!fc) return
    const objs = fc.getObjects()
    const bgImage = fc.backgroundImage

    const newLayers: LayerItem[] = []

    // Background Layer at the top
    if (bgImage) {
      newLayers.push({
        id: 'bg',
        name: t('editor.background'),
        visible: true,
        locked: true,
        type: 'image',
        preview: bgImage.getSrc?.() || '',
        obj: bgImage,
        isBackground: true,
      })
    }

    // Canvas Objects (reversed to show top layers first)
    for (let i = objs.length - 1; i >= 0; i--) {
      const obj = objs[i]
      if (obj.name === 'watermark' || obj.name === 'cropRect') continue // Hide watermark & crop area
      
      const isText = obj.type && obj.type.toLowerCase().includes('text')
      let name = isText ? obj.text : (obj.type === 'path' ? t('editor.drawing') : t('editor.image'))
      if (name?.length > 15) name = name.substring(0, 15) + '...'

      newLayers.push({
        id: obj.id || `layer-${i}`,
        name: name || (isText ? t('editor.text') : t('editor.layer')),
        visible: obj.visible !== false,
        locked: !obj.selectable,
        type: obj.type,
        preview: obj.type === 'image' ? obj.getSrc?.() : undefined,
        obj: obj,
        isBackground: false,
      })
    }

    setLayers(newLayers)
    setSelectedObj(fc.getActiveObject())
  }

  useEffect(() => {
    if (!isOpen) return
    refreshLayers()

    const fc = fabricRef.current
    if (!fc) return

    const handleUpdate = () => refreshLayers()

    fc.on('object:added', handleUpdate)
    fc.on('object:removed', handleUpdate)
    fc.on('object:modified', handleUpdate)
    fc.on('selection:created', handleUpdate)
    fc.on('selection:updated', handleUpdate)
    fc.on('selection:cleared', handleUpdate)

    return () => {
      fc.off('object:added', handleUpdate)
      fc.off('object:removed', handleUpdate)
      fc.off('object:modified', handleUpdate)
      fc.off('selection:created', handleUpdate)
      fc.off('selection:updated', handleUpdate)
      fc.off('selection:cleared', handleUpdate)
    }
  }, [isOpen, fabricRef])

  const toggleVisibility = (layer: LayerItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (layer.isBackground) return
    layer.obj.set({ visible: !layer.visible })
    fabricRef.current?.renderAll()
    refreshLayers()
  }

  const toggleLock = (layer: LayerItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (layer.isBackground) return
    const newSelectable = layer.locked // If it was locked, make it selectable (true).
    layer.obj.set({ selectable: newSelectable, evented: newSelectable })
    if (!newSelectable && fabricRef.current?.getActiveObject() === layer.obj) {
      fabricRef.current.discardActiveObject()
    }
    fabricRef.current?.renderAll()
    refreshLayers()
  }

  const selectLayer = (layer: LayerItem) => {
    if (layer.isBackground || layer.locked) return
    fabricRef.current?.setActiveObject(layer.obj)
    fabricRef.current?.renderAll()
  }

  const moveLayerUp = (layer: LayerItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (layer.isBackground) return
    const fc = fabricRef.current
    if (!fc) return

    fc.bringForward(layer.obj)
    
    // Ensure watermark stays on top
    const objs = fc.getObjects()
    for (const o of objs) {
      if (o.name === 'watermark') {
        fc.bringToFront(o)
        break
      }
    }
    
    fc.renderAll()
    refreshLayers()
  }

  const moveLayerDown = (layer: LayerItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (layer.isBackground) return
    const fc = fabricRef.current
    if (!fc) return

    fc.sendBackwards(layer.obj)
    
    fc.renderAll()
    refreshLayers()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="absolute inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`absolute ${isFullScreen ? 'bottom-4' : 'top-4'} right-4 z-50 w-56 bg-[#1a1c23]/95 backdrop-blur-xl border border-white/10 rounded-[20px] overflow-hidden flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-h-[70vh]`}
          >
            {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
            <div className="flex items-center gap-2">
              <LayersIcon size={16} className="text-white" />
              <span className="text-white font-bold text-[14px]">{t('editor.layers')}</span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X size={16} strokeWidth={3} />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {layers.map((layer, idx) => {
              const isSelected = selectedObj === layer.obj
              return (
                <div
                  key={layer.id + idx}
                  onClick={() => selectLayer(layer)}
                  className={`relative flex flex-col gap-2 p-2.5 rounded-[12px] border-2 transition-colors cursor-pointer ${
                    isSelected ? 'border-pink-500 bg-pink-500/10' : 'border-transparent bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleVisibility(layer, e)}
                        className={`text-white/60 hover:text-white transition-colors ${layer.isBackground ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={layer.isBackground}
                      >
                        {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      
                      <button
                        onClick={(e) => toggleLock(layer, e)}
                        className={`text-white/60 hover:text-white transition-colors ${layer.isBackground ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={layer.isBackground}
                      >
                        {layer.locked ? <Lock size={16} /> : <Unlock size={16} />}
                      </button>
                    </div>

                    {!layer.isBackground && (
                      <div className="flex items-center gap-1 bg-white/5 rounded-md p-0.5">
                        <button
                          onClick={(e) => moveLayerUp(layer, e)}
                          className="text-white/40 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
                          disabled={idx === 0}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={(e) => moveLayerDown(layer, e)}
                          className="text-white/40 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
                          disabled={idx === layers.length - (layers.some(l => l.isBackground) ? 2 : 1)}
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="h-16 rounded-[8px] bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden overflow-hidden relative">
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px' }} />
                    {layer.preview ? (
                      <img src={layer.preview} className="w-full h-full object-contain relative z-10" alt={layer.name} />
                    ) : layer.type?.toLowerCase().includes('text') ? (
                      <span className="text-white font-bold text-center text-[13px] relative z-10 p-2 break-all line-clamp-2 leading-tight flex items-center justify-center h-full w-full">{layer.name}</span>
                    ) : (
                      <span className="text-white/50 text-xs font-semibold relative z-10 flex items-center justify-center h-full w-full">{layer.name}</span>
                    )}
                  </div>
                  
                  {layer.isBackground && (
                    <span className="text-white/80 font-semibold text-[11px] text-center mt-1">{t('editor.background')}</span>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
