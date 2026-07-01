const FEATURES = [
  {
    id: 'simulator',
    icon: '⚖️',
    label: '暮らし方を比べる',
    desc: '同居・別居でお金がどう変わるか比較します',
  },
  {
    id: 'household',
    icon: '🏘️',
    label: '同居・世帯分離を整理する',
    desc: '娘さんと同居している場合などのパターンを確認します',
  },
  {
    id: 'aimemo',
    icon: '📝',
    label: 'AI相談メモを作る',
    desc: '状況を整理して、窓口用のメモを自動で作ります',
  },
  {
    id: 'knowledge',
    icon: '📖',
    label: '制度のことを知る',
    desc: '生活保護の仕組みをわかりやすく説明します',
  },
  {
    id: 'case',
    icon: '👴',
    label: '具体例で学ぶ',
    desc: '高齢夫婦の申請例を見てみます',
  },
  {
    id: 'housing',
    icon: '🏠',
    label: '家賃・転居を確認する',
    desc: '家賃の上限や引越しについて確認します',
  },
  {
    id: 'refusal',
    icon: '🛡️',
    label: '断られた時の対応',
    desc: '窓口で断られた時の返答を確認します',
  },
  {
    id: 'phrases',
    icon: '💬',
    label: '窓口で言う言葉を確認する',
    desc: '申請時に使える文章を確認・コピーできます',
  },
]

export default function FamilySupportHub({ navigate }) {
  return (
    <div className="pt-5 space-y-5 pb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">家族・支援者向け</h2>
        <p className="text-base text-gray-500 mt-1 leading-relaxed">
          同居・別居・世帯分離など、くわしい内容を確認できます
        </p>
      </div>

      <div className="space-y-3">
        {FEATURES.map((f) => (
          <button
            key={f.id}
            onClick={() => navigate(f.id)}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl px-5 py-4 text-left flex items-center gap-4 active:bg-gray-50 active:border-sky-300 transition-colors"
            style={{ minHeight: '72px' }}
          >
            <span className="text-3xl flex-shrink-0">{f.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-bold text-gray-800 leading-snug">{f.label}</p>
              <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
            </div>
            <svg className="w-5 h-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-2xl p-4">
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          難しい言葉は各ページの「くわしく見る」で確認できます
        </p>
      </div>
    </div>
  )
}
