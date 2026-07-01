export default function Header({ page, navigate, fontSizeMode, onToggleFontSize, onResetRequest }) {
  const isHome = page === 'home'

  const pageTitles = {
    home:          '生活困窮サポートナビ',
    questionnaire: 'かんたん診断',
    result:        '診断結果',
    checklist:     '申請準備チェックリスト',
    phrases:       '窓口で伝える文章',
    refusal:       '断られた時の対応',
    knowledge:     '制度の基礎知識',
    case:          'モデルケースで学ぶ',
    housing:       '住まい・転居相談ナビ',
    simulator:     '暮らし方比較シミュレーター',
    household:     '世帯分離・同居相談ナビ',
    aimemo:        'AI相談メモ',
    flow:          '申請ステップガイド',
    familysupport: '家族・支援者向け',
    history:       '入力内容の確認・修正',
  }

  return (
    <div className="sticky top-0 z-50 no-print">
      <header className="bg-sky-700 text-white shadow-md">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3" style={{ minHeight: '56px' }}>
          {/* 左：戻るボタン（サブページのみ） */}
          {!isHome && (
            <button
              onClick={() => navigate('home')}
              className="p-2 rounded-xl hover:bg-sky-600 active:bg-sky-800 transition-colors flex-shrink-0"
              aria-label="トップページへ戻る"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* 中央：ページタイトル */}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg leading-tight truncate">
              {pageTitles[page] || '生活困窮サポートナビ'}
            </h1>
            {isHome && (
              <p className="text-sky-200 text-xs">申請準備をわかりやすくサポート</p>
            )}
          </div>

          {/* 右：設定ボタン */}
          <button
            onClick={onResetRequest}
            className="p-2 rounded-xl hover:bg-sky-600 active:bg-sky-800 transition-colors flex-shrink-0"
            aria-label="設定・データ初期化"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>
      </header>
    </div>
  )
}
