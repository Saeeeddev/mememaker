import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, Zap, Crown, X } from 'lucide-react'
import { GoogleGenAI, Type } from '@google/genai'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@store/useAppStore'
import { WebApp } from '@utils/telegram'

interface AIPanelProps {
  open: boolean
  templateId: string | null
  templateImageUrl: string | null
  onApply: (texts: {text: string, x_percent: number, y_percent: number, font_size?: number, text_color?: string, stroke_color?: string}[]) => void
  onClose: () => void
}

export function AIPanel({ open, templateId, templateImageUrl: _templateImageUrl, onApply, onClose }: AIPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()

  const { energy, proPlan, freeAiGenerationsUsed, consumeAiGeneration } = useAppStore()

  const freeLeft = Math.max(0, 2 - freeAiGenerationsUsed)
  const isFree = freeLeft > 0
  const hasProQuota = Boolean(
    proPlan &&
      (proPlan.aiGenerationsLimit === 'unlimited' ||
        (typeof proPlan.aiGenerationsLimit === 'number' &&
          proPlan.aiGenerationsUsed < proPlan.aiGenerationsLimit))
  )

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setError(null)

    // Check & consume generation quota or 5 Energy
    const quotaResult = consumeAiGeneration()
    if (!quotaResult.success) {
      setError(quotaResult.error || 'Insufficient Energy. 5 ⚡ Energy required.')
      try {
        WebApp?.HapticFeedback?.notificationOccurred?.('error')
      } catch {}
      return
    }

    setIsLoading(true)
    try {
      const apiKeyString = import.meta.env.VITE_GEMINI_API_KEY
      if (!apiKeyString) {
        setError('AI generation is currently unavailable. Please try again later.')
        setIsLoading(false)
        return
      }
      const apiKeys = apiKeyString.split(',').map((k: string) => k.trim()).filter(Boolean)

      const cleanTemplateId = (templateId || 'Unknown Meme').replace(/-/g, ' ')
      const systemInstruction = `
You are a witty, creative meme generator.
The user wants to make a meme based on the template: "${cleanTemplateId}".
Their prompt/idea is: "${prompt}".

Generate appropriate meme text captions with their layout positions.
- Usually memes have top text and bottom text, or 1-3 captions.
- Position coordinates (x_percent, y_percent) are 0-100 from top-left.
  - Typical Top Text: y_percent = 5-15, x_percent = 50 (centered)
  - Typical Bottom Text: y_percent = 80-90, x_percent = 50 (centered)
- Keep captions punchy, funny, and relevant to the user's prompt and template.
- Capitalize appropriately (standard meme format is ALL CAPS for impact text).
`

      let responseText = ''
      let lastError = null

      for (const key of apiKeys) {
        try {
          const ai = new GoogleGenAI({ apiKey: key })
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  captions: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING, description: 'The caption text string' },
                        x_percent: { type: Type.NUMBER, description: 'X position 0-100 (50 for center)' },
                        y_percent: { type: Type.NUMBER, description: 'Y position 0-100' },
                      },
                      required: ['text', 'x_percent', 'y_percent'],
                    },
                  },
                },
                required: ['captions'],
              },
            },
          })

          if (response.text) {
            responseText = response.text
            break
          }
        } catch (err) {
          lastError = err
          console.warn('API Key failed, trying next...', err)
        }
      }

      if (!responseText) {
        throw lastError || new Error('All AI API keys failed.')
      }

      const parsed = JSON.parse(responseText)
      if (parsed.captions && Array.isArray(parsed.captions) && parsed.captions.length > 0) {
        onApply(parsed.captions)
        onClose()
      } else {
        setError('Could not generate meme captions. Please try another prompt.')
      }
    } catch (err: any) {
      console.error('AI Meme Generation Error:', err)
      setError(err?.message || 'Failed to generate meme text. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (typeof document === 'undefined') return null

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
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100]"
          />

          {/* Panel Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 bg-[#111113] rounded-t-[32px] border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.85)] z-[100] px-3.5 pt-3.5 pb-[calc(2rem+env(safe-area-inset-bottom))]"
          >
            {/* Handle */}
            <div className="w-[44px] h-1 bg-white/25 rounded-full mx-auto mb-3 shrink-0" />

            {/* Title, AI Balance, and Close */}
            <div className="flex items-center justify-between gap-2 mb-3.5">
              <h3 className="text-white font-extrabold text-[16.5px] flex items-center gap-2 shrink-0">
                <Sparkles size={18} className="text-violet-400" /> {t('editor.ai_generator', 'AI Meme Text')}
              </h3>

              <div className="flex items-center gap-2 min-w-0">
                {/* AI Balance pill only */}
                <div
                  className={`h-8 px-2.5 rounded-[10px] border flex items-center gap-1.5 shadow-sm shrink-0 ${
                    isFree
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : hasProQuota
                        ? 'bg-[#A358DF]/15 border-[#A358DF]/40 text-[#A358DF]'
                        : 'bg-[#2AABEE]/15 border-[#2AABEE]/40 text-[#2AABEE]'
                  }`}
                >
                  {isFree || hasProQuota ? (
                    <Sparkles size={13} />
                  ) : (
                    <Zap size={13} className="text-[#2AABEE] fill-[#2AABEE]/30" />
                  )}
                  <span className="font-extrabold text-[11.5px]">
                    {isFree
                      ? t('editor.ai_balance_count', { count: freeLeft, defaultValue: `${freeLeft} AI Balance` })
                      : hasProQuota
                        ? (proPlan?.aiGenerationsLimit === 'unlimited' ? t('editor.unlimited_ai', '∞ Unlimited') : t('editor.ai_quota_left', { count: Math.max(0, ((proPlan?.aiGenerationsLimit as number) || 0) - (proPlan?.aiGenerationsUsed || 0)), defaultValue: `${Math.max(0, ((proPlan?.aiGenerationsLimit as number) || 0) - (proPlan?.aiGenerationsUsed || 0))} AI Balance` }))
                        : t('editor.per_generation', '5 ⚡ / Generation')}
                  </span>
                </div>

                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Prompt input */}
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={3}
              placeholder={t('editor.ai_placeholder', 'Describe your joke or meme topic...')}
              className="w-full bg-[#1c1c1e] border border-white/10 rounded-[14px] px-3.5 py-3 text-white text-[14px] font-medium placeholder-white/25 outline-none resize-none mb-3 focus:border-violet-500/50 transition-colors"
            />
            
            {error && (
              <p className="text-red-400 text-[12.5px] font-semibold mb-3 bg-red-500/10 p-2.5 rounded-[12px] border border-red-500/20">
                {error}
              </p>
            )}

            <button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim() || (!isFree && !hasProQuota && energy < 5)}
              className="w-full py-3.5 rounded-[16px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black text-[15px] shadow-[0_8px_24px_rgba(124,58,237,0.35)] hover:from-violet-500 hover:to-indigo-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t('editor.generating', 'Generating...')}</span>
                </>
              ) : isFree ? (
                <>
                  <Sparkles size={18} />
                  <span>{t('editor.generate_ai_free', { count: freeLeft, defaultValue: `Generate with AI (Free • ${freeLeft} left)` })}</span>
                </>
              ) : hasProQuota ? (
                <>
                  <Crown size={18} />
                  <span>{t('editor.generate_ai_pro', 'Generate with AI (Pro Quota)')}</span>
                </>
              ) : energy >= 5 ? (
                <>
                  <Zap size={18} className="text-[#2AABEE] fill-[#2AABEE]/40" />
                  <span>{t('editor.generate_ai_energy', 'Generate with AI (5 ⚡ Energy)')}</span>
                </>
              ) : (
                <>
                  <Zap size={18} className="text-white/40" />
                  <span>{t('editor.insufficient_energy', 'Insufficient Energy (5 ⚡ Required)')}</span>
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
