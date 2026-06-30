const FONT_LABELS = { normal: 'ふつう', large: '大きい', xlarge: '特大' }

function NavBtn({ icon, label, onClick, disabled, highlight }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center py-3 gap-1 flex-1 transition-opacity select-none ${
        disabled
          ? 'opacity-25 cursor-not-allowed'
          : 'active:opacity-50'
      } ${highlight ? 'text-sky-600' : 'text-gray-500'}`}
    >
      <span className="text-2xl leading-none">{icon}</span>
      <span className="text-xs font-bold leading-none">{label}</span>
    </button>
  )
}

export default function BottomNav({
  isHome,
  canGoBack,
  onHome,
  onBack,
  onNext,
  nextLabel,
  fontSizeMode,
  onToggleFontSize,
}) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white no-print"
      style={{ borderTop: '2px solid #e5e7eb', boxShadow: '0 -4px 16px rgba(0,0,0,0.08)' }}
    >
      <div className="max-w-2xl mx-auto flex" style={{ minHeight: '64px' }}>
        <NavBtn
          icon="🏠"
          label="ホーム"
          onClick={onHome}
          highlight={isHome}
        />
        <NavBtn
          icon="←"
          label="戻る"
          onClick={onBack}
          disabled={!canGoBack}
        />
        <NavBtn
          icon="→"
          label={nextLabel || '次へ'}
          onClick={onNext}
          disabled={!onNext}
          highlight={!!onNext}
        />
        <NavBtn
          icon="🔤"
          label={FONT_LABELS[fontSizeMode]}
          onClick={onToggleFontSize}
          highlight
        />
      </div>
    </nav>
  )
}
