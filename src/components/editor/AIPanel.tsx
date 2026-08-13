import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { GoogleGenAI, Type } from '@google/genai'

export interface AITextConfig {
  text: string;
  topPercent: number;
  leftPercent: number;
  widthPercent: number;
  fontSizePercent: number;
  color: string;
  strokeColor: string;
}

interface AIPanelProps {
  open: boolean
  templateId: string | null
  onApply: (texts: AITextConfig[]) => void
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
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setError('Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.');
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: `Template Name/ID: ${templateId || 'Unknown Meme'}\nUser Request: ${prompt}`,
        config: {
          systemInstruction: "You are an expert meme creator. You know the exact visual layout of every meme template. Generate funny, relevant, and CONCISE (short) text. CRITICAL RULE: Use your knowledge of the template to determine exactly how many text boxes it requires. For EACH text box, you MUST specify its exact center position (topPercent, leftPercent), its width (widthPercent), its font size relative to canvas width (fontSizePercent, usually 8-15), and appropriate hex colors.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              texts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    topPercent: { type: Type.NUMBER, description: "Y center position from 0 to 100" },
                    leftPercent: { type: Type.NUMBER, description: "X center position from 0 to 100" },
                    widthPercent: { type: Type.NUMBER, description: "Width of text box from 10 to 100" },
                    fontSizePercent: { type: Type.NUMBER, description: "Font size relative to canvas width (e.g. 10)" },
                    color: { type: Type.STRING, description: "Hex color (usually #ffffff or #000000)" },
                    strokeColor: { type: Type.STRING, description: "Hex color for text outline" }
                  },
                  required: ["text", "topPercent", "leftPercent", "widthPercent", "fontSizePercent", "color", "strokeColor"]
                }
              }
            },
            required: ["texts"]
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        if (result.texts && Array.isArray(result.texts)) {
          onApply(result.texts);
          setPrompt('');
        } else {
          setError('Failed to generate text correctly. Try again.');
        }
      } else {
        setError('No response from AI.');
      }
    } catch (err) {
      console.error(err);
      setError('Generation failed. Ensure your words are appropriate, or check your API key.');
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
