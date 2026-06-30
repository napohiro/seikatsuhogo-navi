import { useState } from 'react'

const GLOSSARY = {
  扶養照会: '福祉事務所が申請者の親族（子ども・兄弟など）に「この人を経済的に支援できますか？」と確認する書類のことです。法律上の強制義務ではなく、支援できない場合は断ることができます。',
  世帯分離: '同じ住所に住んでいる家族と、住民票上の「世帯」を別々に分けることです。ただし生活保護では、住民票だけでなく実際の生活実態（食費・光熱費・通帳・生活空間など）が確認されます。',
  住宅扶助: '生活保護受給中に支払われる家賃の補助です。上限額は地域・世帯人数によって異なります。転居前に必ず福祉事務所で上限額を確認することが大切です。',
  生活扶助: '食費・日用品費などの日常生活に必要な費用を補助するものです。年齢・世帯人数・地域によって金額が異なります。',
  医療扶助: '生活保護受給中の医療費を国が負担する制度です。指定医療機関での診療が対象になります。医療費の自己負担がなくなります。',
  介護扶助: '生活保護受給中に介護サービスを利用する際の費用を補助する制度です。介護認定を受けている場合に適用されます。',
  最低生活費: '生活保護の判断基準となる、その世帯が生活するために必要な最低限の費用のことです。収入がこれを下回る場合に保護が受けられる可能性があります。',
  ケースワーカー: '福祉事務所が担当する支援員です。生活保護が始まったら定期的に自宅訪問・面談を行い、生活状況を確認します。困ったことがあれば相談できます。',
  一時扶助: '生活保護受給者が一時的に特別な費用が必要になった場合に支給される補助です。引越し費用・布団・医療器具などが対象になる場合があります。',
  審査請求: '生活保護の申請が却下された場合に、その決定に不服があるときに異議を申し立てる手続きのことです。決定通知を受け取った翌日から3ヶ月以内に申し立てができます。',
}

export function GlossaryTerm({ term, children }) {
  const [open, setOpen] = useState(false)
  const desc = GLOSSARY[term]
  if (!desc) return <>{children || term}</>

  return (
    <>
      <span className="inline-flex items-center gap-1 flex-wrap">
        <span>{children || term}</span>
        <button
          onClick={(e) => { e.stopPropagation(); setOpen(true) }}
          className="inline-flex items-center justify-center w-6 h-6 bg-sky-100 text-sky-700 rounded-full text-xs font-bold flex-shrink-0 active:bg-sky-200"
          aria-label={`${term}の説明を見る`}
        >
          ？
        </button>
      </span>

      {open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-5 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💡</span>
              <p className="font-bold text-sky-800 text-xl">「{term}」とは？</p>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">{desc}</p>
            <button
              onClick={() => setOpen(false)}
              className="w-full mt-6 py-5 bg-sky-600 text-white font-bold rounded-2xl text-lg active:bg-sky-700"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// 用語辞典を一覧表示するパネル（オプション）
export function GlossaryList() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-sky-600 underline font-medium"
      >
        💡 用語集を見る
      </button>

      {open && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-5 animate-fade-in">
          <div className="absolute inset-0 bg-black/60" onClick={() => { setOpen(false); setSelected(null) }} />
          <div className="relative bg-white rounded-3xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <p className="font-bold text-xl text-gray-800">💡 用語集</p>
              <p className="text-sm text-gray-500 mt-0.5">難しい言葉を分かりやすく説明します</p>
            </div>

            {selected ? (
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <p className="font-bold text-sky-800 text-xl">「{selected}」とは？</p>
                <p className="text-base text-gray-700 leading-relaxed">{GLOSSARY[selected]}</p>
                <button
                  onClick={() => setSelected(null)}
                  className="w-full py-4 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold text-base"
                >
                  ← 用語一覧に戻る
                </button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {Object.keys(GLOSSARY).map((term) => (
                  <button
                    key={term}
                    onClick={() => setSelected(term)}
                    className="w-full text-left p-4 bg-sky-50 border border-sky-100 rounded-xl font-bold text-sky-800 text-base active:bg-sky-100 flex items-center justify-between"
                  >
                    {term}
                    <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>
            )}

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => { setOpen(false); setSelected(null) }}
                className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl text-base active:bg-gray-200"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
