import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'

interface AIPanelProps {
  open: boolean
  templateId: string | null
  onApply: (topText: string, bottomText: string) => void
  onClose: () => void
}

export function AIPanel({ open, templateId, onApply, onClose }: AIPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      // Keep rules extremely short to fit in 300 char limit!
      const userPrompt = prompt.trim().substring(0, 200)
      const prefix = templateId ? `Meme: "${templateId}". Subject: ` : 'Subject: '
      const suffix = templateId ? ` (Rule: If 1-text meme, leave bottom_text empty)` : ''
      const finalPrompt = `${prefix}${userPrompt}${suffix}`

      const res = await fetch('https://justmeme.wtf/api/v1/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt })
      })
      const data = await res.json()
      if (data.success && typeof data.top_text === 'string' && typeof data.bottom_text === 'string') {
        onApply(data.top_text, data.bottom_text)
        setPrompt('')
      } else {
        setError(data.error || 'Failed to generate text. Ensure your words are appropriate and try again.')
      }
    } catch (err) {
      setError('Generation failed. Maybe your words are not appropriate, or there is a network issue.')
    } finally {
      setIsLoading(false)
    }
  }

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 bg-[#111113] rounded-t-[28px] border-t border-white/10 z-[61] px-5 pt-4 pb-10"
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-white/25 rounded-full mx-auto mb-5" />

            {/* Title + close */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-[16px] flex items-center gap-2">
                <Sparkles size={18} className="text-violet-400" /> AI Generator
              </h3>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-[12px] bg-white/10 text-white font-bold text-[14px] hover:bg-white/15 active:scale-[0.97] transition-all"
              >
                Cancel
              </button>
            </div>
            
            <p className="text-white/50 text-[13px] mb-4 leading-relaxed">
              Type what you want the meme to be about, and our AI will write the perfect text for you!
            </p>

            {/* Prompt input */}
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={3}
              placeholder="e.g. When you finally fix a bug after 3 hours but create 5 new ones..."
              className="w-full bg-[#1c1c1e] border border-white/10 rounded-[14px] px-3.5 py-3 text-white text-[14px] font-medium placeholder-white/25 outline-none resize-none mb-4 focus:border-violet-500/50 transition-colors"
            />
            
            {error && <p className="text-red-400 text-[13px] font-semibold mb-4">{error}</p>}

            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full py-3.5 rounded-[16px] bg-violet-600 text-white font-bold text-[15px] shadow-[0_8px_24px_rgba(124,58,237,0.3)] hover:bg-violet-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate Meme Text
                </>
              )}
            </button>

          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}
