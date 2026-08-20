import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, Zap, Crown } from 'lucide-react'
import { GoogleGenAI, Type } from '@google/genai'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@store/useAppStore'
import { useNavigate } from 'react-router-dom'
import { WebApp } from '@utils/telegram'

interface AIPanelProps {
  open: boolean
  templateId: string | null
  templateImageUrl: string | null
  onApply: (texts: {text: string, x_percent: number, y_percent: number, font_size?: number, text_color?: string, stroke_color?: string}[]) => void
  onClose: () => void
}

export function AIPanel({ open, templateId, templateImageUrl, onApply, onClose }: AIPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { energy, proPlan, freeAiGenerationsUsed, consumeAiGeneration } = useAppStore()

  const freeLeft = Math.max(0, 2 - freeAiGenerationsUsed)
  const isFree = freeLeft > 0
  const hasProQuota = Boolean(
    proPlan &&
      (proPlan.aiGenerationsLimit === 'unlimited' ||
        proPlan.aiGenerationsUsed < proPlan.aiGenerationsLimit)
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
      
      let imagePart = null
      if (templateImageUrl) {
        try {
          const res = await fetch(templateImageUrl)
          const blob = await res.blob()
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.readAsDataURL(blob)
            reader.onloadend = () => resolve(reader.result as string)
          })
          const base64Data = base64.split(',')[1]
          let mimeType = blob.type
          if (!mimeType || mimeType === 'application/octet-stream') {
            mimeType = templateImageUrl.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg'
          }
          imagePart = {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          }
        } catch (e) {
          console.warn('Failed to fetch template image for AI', e)
        }
      }

      const contents = []
      if (imagePart) contents.push(imagePart)
      contents.push(`Template: ${cleanTemplateId}\nSubject: ${prompt}`)

      let responseText = null
      let lastError = null

      for (let i = 0; i < apiKeys.length; i++) {
        const apiKey = apiKeys[i]
        const ai = new GoogleGenAI({ apiKey })
        
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents as any,
            config: {
              systemInstruction: "You are an expert meme generator. You MUST combine the provided Template with the User's Subject.\n\nRULES:\n1. OBSERVE THE TEMPLATE: Look at the provided image. Find the natural blank spaces or intended text areas where text should go.\n2. THE JOKE: Write a FULL, funny joke that fits the template's structure based on the User's Subject. Keep it punchy (max 8 words per text box).\n3. PLACEMENT: For each text box, provide the x_percent and y_percent coordinates (0-100) of its center point relative to the image dimensions.\n4. STYLING: Suggest a font_size (15-35, default 25), text_color (hex, default #ffffff), and stroke_color (hex, default #000000). Use contrasting colors so text is readable against the image background at that location!\n5. OUTPUT: Output an array of objects.",
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  texts: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        text: { type: Type.STRING },
                        x_percent: { type: Type.NUMBER, description: '0-100 x coordinate for text center' },
                        y_percent: { type: Type.NUMBER, description: '0-100 y coordinate for text center' },
                        font_size: { type: Type.NUMBER, description: 'Integer between 15 and 35' },
                        text_color: { type: Type.STRING, description: 'Hex color code e.g. #ffffff' },
                        stroke_color: { type: Type.STRING, description: 'Hex color code e.g. #000000' }
                      },
                      required: ['text', 'x_percent', 'y_percent', 'font_size', 'text_color', 'stroke_color']
                    }
                  }
                },
                required: ['texts']
              }
            }
          })
          
          if (response.text) {
            responseText = response.text
            break
          }
        } catch (err: any) {
          lastError = err
          const errMsg = err?.message?.toLowerCase() || ''
          if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('rate limit') || errMsg.includes('exhausted')) {
            console.warn(`API Key ${i + 1} rate limited. Switching to next key if available...`)
            continue
          } else {
            break
          }
        }
      }

      if (responseText) {
        const result = JSON.parse(responseText)
        if (result.texts && Array.isArray(result.texts)) {
          try {
            WebApp?.HapticFeedback?.notificationOccurred?.('success')
          } catch {}
          onApply(result.texts)
          setPrompt('')
        } else {
          setError('Failed to generate text correctly. Try again.')
        }
      } else if (lastError) {
        const err = lastError as any
        console.error(err)
        const errMsg = err?.message || 'Unknown error'
        if (errMsg.toLowerCase().includes('429') || errMsg.toLowerCase().includes('quota') || errMsg.toLowerCase().includes('rate limit') || errMsg.toLowerCase().includes('exhausted')) {
          setError('All API keys are exhausted! Please wait 15 seconds and try again.')
        } else {
          setError(`Generation failed: ${errMsg}. Please check your API key or input.`)
        }
      } else {
        setError('No response from AI.')
      }
    } catch (err: any) {
      console.error(err)
      setError('An unexpected error occurred.')
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
            <div className="w-10 h-1 bg-white/25 rounded-full mx-auto mb-4" />

            {/* Title + close */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-bold text-[16px] flex items-center gap-2">
                <Sparkles size={18} className="text-violet-400" /> {t('editor.ai_generator')}
              </h3>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-[12px] bg-white/10 text-white font-bold text-[14px] hover:bg-white/15 active:scale-[0.97] transition-all cursor-pointer"
              >
                {t('editor.cancel')}
              </button>
            </div>

            {/* Daily Limit & Cost Banner */}
            <div className="mb-3.5 p-3 rounded-[16px] bg-white/[0.04] border border-white/8 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                {isFree ? (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[10px] bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Sparkles size={14} />
                    </div>
                    <div>
                      <div className="text-[12.5px] font-extrabold text-emerald-400 leading-tight">
                        {freeLeft}/2 Free Daily AI Generations
                      </div>
                      <div className="text-[10.5px] text-white/40 font-medium">
                        Resets daily • 5 ⚡ Energy after free limit
                      </div>
                    </div>
                  </div>
                ) : hasProQuota ? (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[10px] bg-[#f5a623]/15 border border-[#f5a623]/30 flex items-center justify-center text-[#f5a623] shrink-0">
                      <Crown size={14} />
                    </div>
                    <div>
                      <div className="text-[12.5px] font-extrabold text-[#f5a623] leading-tight">
                        {proPlan?.name}: {proPlan?.aiGenerationsLimit === 'unlimited' ? '∞ Unlimited' : `${Math.max(0, (proPlan?.aiGenerationsLimit as number) - (proPlan?.aiGenerationsUsed || 0))} Gens Left`}
                      </div>
                      <div className="text-[10.5px] text-white/40 font-medium">
                        {proPlan?.aiGenerationsLimit === 'unlimited' ? 'Unlimited AI Text Prompts' : `${proPlan?.aiGenerationsUsed} / ${proPlan?.aiGenerationsLimit} monthly quota used`}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-[10px] bg-[#2AABEE]/15 border border-[#2AABEE]/30 flex items-center justify-center text-[#2AABEE] shrink-0">
                      <Zap size={14} className="fill-[#2AABEE]/30" />
                    </div>
                    <div>
                      <div className="text-[12.5px] font-extrabold text-[#2AABEE] leading-tight">
                        Free limit reached • 5 ⚡ Energy
                      </div>
                      <div className="text-[10.5px] text-white/40 font-medium">
                        Balance: {energy.toLocaleString()} ⚡ Energy
                      </div>
                    </div>
                  </div>
                )}

                {hasProQuota && (
                  <span className="px-2 py-0.5 rounded-full bg-[#f5a623]/20 text-[#f5a623] font-black text-[9.5px] border border-[#f5a623]/30 shrink-0">
                    PRO
                  </span>
                )}

                {!isFree && !hasProQuota && energy < 5 && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      navigate('/shop', { state: { tab: 'energy' } })
                    }}
                    className="px-2.5 py-1 rounded-[10px] bg-[#229ED9]/20 border border-[#229ED9]/40 text-[#2AABEE] text-[11px] font-bold shrink-0 hover:bg-[#229ED9]/30"
                  >
                    + Buy
                  </button>
                )}
              </div>

              {/* Progress bar for Pro quota or Free limit */}
              {hasProQuota && proPlan?.aiGenerationsLimit !== 'unlimited' && (
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#f5a623] to-[#f8cd46]"
                    style={{
                      width: `${Math.min(100, Math.round(((proPlan?.aiGenerationsUsed || 0) / (proPlan?.aiGenerationsLimit as number)) * 100))}%`,
                    }}
                  />
                </div>
              )}

              {isFree && (
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mt-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                    style={{ width: `${(freeAiGenerationsUsed / 2) * 100}%` }}
                  />
                </div>
              )}
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
                  {t('editor.generating', 'Generating Meme...')}
                </>
              ) : isFree ? (
                <>
                  <Sparkles size={18} />
                  <span>Generate with AI (Free • {freeLeft} left)</span>
                </>
              ) : hasProQuota ? (
                <>
                  <Crown size={18} />
                  <span>Generate with AI (Pro Quota)</span>
                </>
              ) : energy >= 5 ? (
                <>
                  <Zap size={18} className="text-[#2AABEE] fill-[#2AABEE]/40" />
                  <span>Generate with AI (5 ⚡ Energy)</span>
                </>
              ) : (
                <>
                  <Zap size={18} className="text-white/40" />
                  <span>Insufficient Energy (5 ⚡ Required)</span>
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
