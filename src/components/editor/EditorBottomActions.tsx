import { Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface EditorBottomActionsProps {
  onSave: () => void
}

export function EditorBottomActions({
  onSave,
}: EditorBottomActionsProps) {
  const { t } = useTranslation()

  return (
    <div className="px-4 pb-4 flex flex-col gap-2.5 shrink-0">
      <button
        onClick={onSave}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-[16px] bg-[#229ED9] text-white font-bold text-[16px] shadow-[0_4px_24px_rgba(34,158,217,0.4)] active:scale-[0.98] transition-transform"
      >
        <Save size={20} />
        {t('editor.save')}
      </button>
    </div>
  )
}
