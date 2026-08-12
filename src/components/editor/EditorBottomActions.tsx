import { Type, Trash2, Pencil, Send, Share2, Sparkles } from 'lucide-react'

interface EditorBottomActionsProps {
  hasSelected: boolean
  onAddText: () => void
  onEditText: () => void
  onDeleteSelected: () => void
  onSendToBot: () => void
  onShare: () => void
  onGenerateAI: () => void
}

export function EditorBottomActions({
  hasSelected,
  onAddText,
  onEditText,
  onDeleteSelected,
  onSendToBot,
  onShare,
  onGenerateAI,
}: EditorBottomActionsProps) {
  return (
    <div className="px-4 pb-4 flex flex-col gap-2.5 shrink-0">
      {/* ── Row 1: AI generate + text tool ── */}
      <div className="flex items-center gap-2 bg-[#1c1c1e] rounded-[16px] p-2 border border-white/8 min-h-[52px]">
        {/* AI Generate — "coming soon" */}
        <button
          onClick={onGenerateAI}
          className="relative flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-[11px] bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/20 text-violet-300 font-semibold text-[12px] hover:from-violet-600/30 hover:to-indigo-600/30 transition-all active:scale-[0.97] shrink-0"
          aria-label="Generate meme text with AI (coming soon)"
        >
          <Sparkles size={14} className="text-violet-400" />
          <span>AI</span>
          <span className="absolute -top-1.5 -right-1.5 bg-violet-500 text-white text-[7px] font-bold px-1 py-0.5 rounded-full leading-none">
            SOON
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 shrink-0" />

        {/* Text tool */}
        {!hasSelected ? (
          <button
            onClick={onAddText}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[11px] bg-[#229ED9] text-white font-bold text-[14px] active:scale-[0.97] transition-transform"
          >
            <Type size={16} />
            Add Text
          </button>
        ) : (
          <>
            <button
              onClick={onEditText}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[11px] bg-[#3b82f6] text-white font-semibold text-[13px] active:scale-[0.97] transition-transform"
            >
              <Pencil size={14} />
              Edit Text
            </button>
            <button
              onClick={onDeleteSelected}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[11px] bg-red-500/15 text-red-400 font-semibold text-[13px] border border-red-500/20 active:scale-[0.97] transition-transform"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </>
        )}
      </div>

      {/* ── Row 2: Finish buttons ── */}
      <div className="flex gap-2.5">
        <button
          onClick={onSendToBot}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[14px] bg-[#10b981] text-white font-bold text-[14px] shadow-[0_4px_20px_rgba(16,185,129,0.4)] active:scale-[0.98] transition-transform"
        >
          <Send size={16} />
          Send to Bot
        </button>
        <button
          onClick={onShare}
          className="w-12 flex items-center justify-center rounded-[14px] bg-[#1c1c1e] border border-white/10 text-white/60 hover:bg-white/10 hover:text-white transition-colors active:scale-[0.97]"
          aria-label="Share"
        >
          <Share2 size={17} />
        </button>
      </div>
    </div>
  )
}
