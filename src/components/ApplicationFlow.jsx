import { useState } from 'react'

const FLOW_STEPS = [
  {
    step: 1,
    title: '家族構成と収入を整理する',
    icon: '👨‍👩‍👴',
    desc: '世帯全員の収入・年金・資産をリストアップします。申請に必要な基礎情報です。',
    tips: [
      '世帯全員（夫婦・同居家族も含む）の月収・年金額を月単位で確認する',
      '預貯金・生命保険・土地・車など、すべての資産をリストアップする',
      '住民票で世帯全員の氏名と続柄を確認する',
      'このアプリの「かんたん診断」で状況を入力・整理できます',
    ],
    navId: 'questionnaire',
    navLabel: 'かんたん診断で確認する',
  },
  {
    step: 2,
    title: '病気・介護・就労困難の書類を集める',
    icon: '🏥',
    desc: '就労が難しい理由や健康状態を証明する書類を集めます。申請の重要な判断材料です。',
    tips: [
      '病気がある場合：主治医の診断書または意見書を依頼する',
      '要介護・要支援の場合：介護認定通知書・介護サービス利用票',
      '障害がある場合：障害者手帳・診断書',
      '高齢で就労困難な場合：年齢がわかる書類（年金証書・マイナンバーカード等）でも可',
    ],
    navId: 'checklist',
    navLabel: '申請準備チェックリストを確認する',
  },
  {
    step: 3,
    title: '家賃・住まいの状況を確認する',
    icon: '🏠',
    desc: '現在の住まいの状況と、転居を検討している場合の条件を整理します。',
    tips: [
      '現在の家賃・共益費の金額を確認する',
      '転居を検討中の場合：物件を契約する前に必ず住宅扶助の上限額を福祉事務所に確認する',
      '初期費用（敷金・礼金・引越し代）は一時扶助として申請できる場合がある',
      '高齢者可・生活保護可の物件を探す必要がある場合がある',
    ],
    warning: '転居先は申請前に必ず福祉事務所で確認してください。先に契約すると住宅扶助が受けられない場合があります。',
    navId: 'housing',
    navLabel: '住まい・転居相談ナビで確認する',
  },
  {
    step: 4,
    title: '福祉事務所へ事前相談する',
    icon: '🏢',
    desc: '申請書を提出する前に、生活状況を相談します。ここで断られても申請はできます。',
    tips: [
      '市区町村の「生活保護担当窓口（福祉事務所）」に電話または直接訪問する',
      '「生活保護を申請したい」と明確に伝える',
      '「相談だけ」で終わらせず、申請意思があれば「申請書をください」と伝える',
      'このアプリの「AI相談メモ」で相談文を事前に準備しておくとスムーズです',
    ],
    warning: '口頭で断られても、申請書を受け取る権利は法律で保障されています。「申請書の交付をお願いします」と伝えましょう。',
    navId: 'aimemo',
    navLabel: 'AI相談メモで相談文を準備する',
  },
  {
    step: 5,
    title: '申請書をもらって提出する',
    icon: '📝',
    desc: '窓口で申請書を受け取り、必要事項を記入して提出します。提出した日が申請日になります。',
    tips: [
      '「申請書をください」「申請したい」と明確に伝える',
      '申請書・同意書・資産申告書などに記入して提出する',
      '提出した日が申請日となり、保護が認められた場合の開始日に影響する',
      '書類が全部揃っていなくても、まず申請書を出すことが大切',
    ],
    navId: 'phrases',
    navLabel: '窓口での伝え方を確認する',
  },
  {
    step: 6,
    title: '申請後の家庭訪問・調査に対応する',
    icon: '🔍',
    desc: '申請後、ケースワーカーが自宅を訪問し、生活状況・収入・資産の調査を行います。',
    tips: [
      '原則14日以内（特別な事情がある場合は30日以内）に決定通知が届く',
      'ケースワーカーが自宅を訪問して生活状況を確認する',
      '収入・資産の書類の提出を求められる場合がある',
      '正直に、誠実に対応することが大切',
    ],
  },
  {
    step: 7,
    title: '決定通知を確認する',
    icon: '📬',
    desc: '保護開始または却下・保留の決定通知が届きます。内容をよく確認してください。',
    tips: [
      '「保護開始決定」が届いたら、担当ケースワーカーの連絡先を確認する',
      '保護費の内訳（生活費・住宅費・医療費など）を確認する',
      '収入申告義務・変更届出など、守るべきルールを必ず確認する',
      '不明な点はケースワーカーに積極的に質問してください',
    ],
  },
  {
    step: 8,
    title: '却下・保留の場合の対応',
    icon: '🛡️',
    desc: '却下・保留された場合でも、対応できる方法があります。諦めずに確認してください。',
    tips: [
      '通知書の却下理由を必ず確認する',
      '納得できない場合は「審査請求（不服申立て）」ができる（通知を受け取った翌日から3ヶ月以内）',
      '支援団体・法テラス・弁護士会に相談することもできる',
      '却下理由に対応できれば、再申請も可能',
    ],
    warning: '申請が却下されることは珍しくありません。諦めずに理由を確認して対応策を探してください。',
    navId: 'refusal',
    navLabel: '断られた時の対応を確認する',
  },
  {
    step: 9,
    title: '受給開始後にやること',
    icon: '✅',
    desc: '受給が始まったら、継続的に守るべきルールがあります。',
    tips: [
      '毎月または定期的に収入申告書を提出する（アルバイト等の収入も必ず申告）',
      '住所・世帯員の変更があった場合はすぐに福祉事務所へ届け出る',
      '担当ケースワーカーの訪問・面談に協力する',
      '病気・介護状態に変化があった場合も速やかに報告する',
    ],
  },
]

export default function ApplicationFlow({ navigate }) {
  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shnavi_flow_done') || '[]')
    } catch {
      return []
    }
  })
  const [expanded, setExpanded] = useState(null)

  const toggleDone = (step) => {
    const next = done.includes(step)
      ? done.filter((s) => s !== step)
      : [...done, step]
    setDone(next)
    localStorage.setItem('shnavi_flow_done', JSON.stringify(next))
  }

  const toggleExpand = (step) => setExpanded(expanded === step ? null : step)

  const doneCount = done.length
  const progress = Math.round((doneCount / FLOW_STEPS.length) * 100)

  return (
    <div className="pt-5 space-y-4">
      {/* Progress card */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-emerald-800 text-lg">申請の進み具合</p>
          <p className="text-base text-gray-500 font-medium">{doneCount} / {FLOW_STEPS.length} 完了</p>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        {doneCount > 0 && (
          <p className="text-base text-emerald-700 mt-2 font-medium">
            {doneCount === FLOW_STEPS.length
              ? '✅ 全ステップ完了！申請の準備が整っています。'
              : `${progress}% 進んでいます`}
          </p>
        )}
        <p className="text-sm text-gray-400 mt-1">各ステップをタップして詳細を確認し、完了したらチェックを入れてください</p>
      </div>

      {/* Step list */}
      {FLOW_STEPS.map((s) => {
        const isDone = done.includes(s.step)
        const isExpanded = expanded === s.step
        return (
          <div
            key={s.step}
            className={`rounded-2xl border-2 overflow-hidden transition-all ${
              isDone ? 'border-emerald-300' : 'border-gray-200'
            }`}
          >
            {/* Step header */}
            <button
              onClick={() => toggleExpand(s.step)}
              className={`w-full text-left p-4 flex items-center gap-4 ${isDone ? 'bg-emerald-50' : 'bg-white'}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xl ${
                isDone ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {isDone ? '✓' : s.step}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-lg leading-tight ${isDone ? 'text-emerald-800' : 'text-gray-800'}`}>
                  {s.title}
                </p>
                {!isExpanded && (
                  <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{s.desc}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-2xl">{s.icon}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Expanded */}
            {isExpanded && (
              <div className={`px-4 pb-5 space-y-4 ${isDone ? 'bg-emerald-50' : 'bg-white'}`}>
                <div className="h-px bg-gray-100" />
                <p className="text-base text-gray-700 leading-relaxed">{s.desc}</p>

                {s.warning && (
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl text-base text-amber-900 leading-relaxed">
                    ⚠️ {s.warning}
                  </div>
                )}

                <div className="space-y-3">
                  <p className="font-bold text-gray-600">やること</p>
                  {s.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-7 h-7 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-base text-gray-700 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>

                {s.navId && (
                  <button
                    onClick={() => navigate(s.navId)}
                    className="w-full py-4 px-4 bg-sky-50 border-2 border-sky-300 text-sky-800 font-bold rounded-xl text-base active:bg-sky-100 flex items-center justify-between"
                  >
                    <span>{s.navLabel}</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                <button
                  onClick={() => toggleDone(s.step)}
                  className={`w-full py-4 px-4 rounded-xl font-bold text-base border-2 transition-all ${
                    isDone
                      ? 'bg-white border-emerald-400 text-emerald-700'
                      : 'bg-emerald-500 border-emerald-500 text-white active:bg-emerald-600'
                  }`}
                >
                  {isDone ? '✓ 完了済み（タップで取り消す）' : 'このステップを完了にする ✓'}
                </button>
              </div>
            )}
          </div>
        )
      })}

      {/* Reset */}
      {doneCount > 0 && (
        <button
          onClick={() => {
            setDone([])
            localStorage.removeItem('shnavi_flow_done')
          }}
          className="w-full text-center text-sm text-gray-400 underline py-2"
        >
          完了マークをすべてリセットする
        </button>
      )}

      {/* Navigate to questionnaire */}
      <button
        onClick={() => navigate('questionnaire')}
        className="w-full btn-primary py-5 text-xl"
      >
        かんたん診断を始める →
      </button>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
        <p className="text-xs text-gray-500 leading-relaxed">
          このガイドは生活保護申請の一般的な流れを示したものです。実際の手続きや必要書類は自治体によって異なります。最終的な判断は福祉事務所が行います。
        </p>
      </div>
    </div>
  )
}
