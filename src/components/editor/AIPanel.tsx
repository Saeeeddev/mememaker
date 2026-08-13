import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2 } from 'lucide-react'
import { GoogleGenAI, Type } from '@google/genai'

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

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)
    setError(null)
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setError('AI generation is currently unavailable. Please try again later.');
        setIsLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const cleanTemplateId = (templateId || 'Unknown Meme').replace(/-/g, ' ');
      
      let imagePart = null;
      if (templateImageUrl) {
        try {
          const res = await fetch(templateImageUrl);
          const blob = await res.blob();
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result as string);
          });
          const base64Data = base64.split(',')[1];
          imagePart = {
            inlineData: {
              data: base64Data,
              mimeType: blob.type
            }
          };
        } catch (e) {
          console.warn("Failed to fetch template image for AI", e);
        }
      }

      const contents = [];
      if (imagePart) contents.push(imagePart);
      contents.push(`Template: ${cleanTemplateId}\nSubject: ${prompt}`);

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: contents as any,
        config: {
          systemInstruction: "You are an expert meme generator. You MUST combine the provided Template with the User's Subject.\n\nRULES:\n1. OBSERVE THE TEMPLATE: Look at the provided image. Find the natural blank spaces or intended text areas where text should go.\n2. THE JOKE: Write a FULL, funny joke that fits the template's structure based on the User's Subject. Keep it punchy (max 8 words per text box).\n3. PLACEMENT: For each text box, provide the x_percent and y_percent coordinates (0-100) of its center point relative to the image dimensions.\n4. STYLING: Suggest a font_size (15-35, default 25), text_color (hex, default #ffffff), and stroke_color (hex, default #000000). Use contrasting colors so text is readable against the image background at that location!\n5. OUTPUT: Output an array of objects.",
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
                    x_percent: { type: Type.NUMBER, description: "0-100 x coordinate for text center" },
                    y_percent: { type: Type.NUMBER, description: "0-100 y coordinate for text center" },
                    font_size: { type: Type.NUMBER, description: "Integer between 15 and 35" },
                    text_color: { type: Type.STRING, description: "Hex color code e.g. #ffffff" },
                    stroke_color: { type: Type.STRING, description: "Hex color code e.g. #000000" }
                  },
                  required: ["text", "x_percent", "y_percent", "font_size", "text_color", "stroke_color"]
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
