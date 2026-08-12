import { createPortal } from 'react-dom'
import { Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FONTS, type TextEditState } from './types'

interface TextEditPanelProps {
  open: boolean
  textEdit: TextEditState
  onApply: (patch: Partial<TextEditState>) => void
  onClose: () => void
}

export function TextEditPanel({ open, textEdit, onApply, onClose }: TextEditPanelProps) {
  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white/60 hover:bg-white/15 transition-colors"
              >
                <Check size={16} />
              </button>
            </div>

            {/* Text input */}
            <textarea
              value={textEdit.text}
              onChange={e => onApply({ text: e.target.value })}
              rows={2}
              placeholder="Type your text..."
              className="w-full bg-[#1c1c1e] border border-white/10 rounded-[14px] px-3.5 py-3 text-white text-[15px] font-semibold placeholder-white/25 outline-none resize-none mb-4 focus:border-[#229ED9]/50 transition-colors"
            />

            {/* Font family */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-[13px] font-semibold">Font</span>
              <select
                value={textEdit.fontFamily}
                onChange={e => onApply({ fontFamily: e.target.value })}
                className="bg-[#1c1c1e] border border-white/10 rounded-[10px] px-3 py-1.5 text-white text-[13px] outline-none focus:border-[#229ED9]/50 transition-colors"
              >
                {FONTS.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </div>

            {/* Font size */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/60 text-[13px] font-semibold">
                Size <span className="text-white ml-1">{textEdit.fontSize}px</span>
              </span>
              <input
                type="range"
                min={15}
                max={150}
                value={textEdit.fontSize}
                onChange={e => onApply({ fontSize: parseInt(e.target.value) })}
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
                    onChange={e => onApply({ textColor: e.target.value })}
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
                    onChange={e => onApply({ strokeColor: e.target.value })}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </div>
                <span className="text-white/70 text-[12.5px] font-semibold">Stroke</span>
              </label>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
