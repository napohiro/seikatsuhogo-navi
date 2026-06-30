const FONT_LABELS = { normal: 'ふつう', large: '大きい', xlarge: '特大' }

export default function Header({ page, navigate, fontSizeMode = 'normal', onToggleFontSize }) {
  const isHome = page === 'home'

  const pageTitles = {
    home: '生活保護申請ナビ',
    questionnaire: 'かんたん診断',
    result: '診断結果',
    checklist: '申請準備チェックリスト',
    phrases: '窓口で伝える文章',
    refusal: '断られた時の対応',
    knowledge: '制度の基礎知識',
    case: 'モデルケースで学ぶ',
    housing: '住まい・転居相談ナビ',
    simulator: '暮らし方比較シミュレーター',
    household: '世帯分離・同居相談ナビ',
    aimemo: 'AI相談メモ',
    flow: '申請ステップガイド',
  }

  return (
    <div className="sticky top-0 z-50 no-print">
      {/* Main header bar */}
      <header className="bg-sky-700 text-white shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          {!isHome && (
            <button
              onClick={() => navigate('home')}
              className="p-2 rounded-lg hover:bg-sky-600 active:bg-sky-800 transition-colors flex-shrink-0"
              aria-label="トップページへ戻る"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {isHome && (
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sky-700 font-bold text-sm">護</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg leading-tight truncate">
              {pageTitles[page] || '生活保護申請ナビ'}
            </h1>
            {isHome && (
              <p className="text-sky-200 text-xs">申請準備をわかりやすくナビゲート</p>
            )}
          </div>
        </div>
      </header>

      {/* Font size bar — always visible below header */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="max-w-2xl mx-auto px-3 py-2">
          <button
            onClick={onToggleFontSize}
            className="w-full flex items-center justify-between bg-gray-50 border-2 border-sky-300 rounded-xl px-4 py-3 active:bg-sky-50 transition-colors"
            aria-label={`文字サイズを変更する（現在：${FONT_LABELS[fontSizeMode]}）`}
          >
            <span className="font-bold text-sky-800 text-base">🔤 文字を大きくする</span>
            <span className="text-sm font-bold text-white bg-sky-600 px-3 py-1 rounded-lg">
              現在：{FONT_LABELS[fontSizeMode]}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
