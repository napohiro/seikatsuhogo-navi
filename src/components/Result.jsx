import { useState } from 'react'
import { getRequiredDocuments, generatePhrase } from '../utils/diagnosis'

const STATUS_CONFIG = {
  A: {
    message: '早めに福祉事務所へ相談することをおすすめします',
    detail: '生活に困っているサインが複数あります。できるだけ早く相談しましょう。',
    headerBg: 'bg-orange-500',
    detailBg: 'bg-orange-50',
    detailText: 'text-orange-800',
    badgeBg: 'bg-orange-500',
    icon: '🚨',
  },
  B: {
    message: '福祉事務所に相談できる状態です',
    detail: '生活保護の申請を検討できます。まずは窓口へ相談しましょう。',
    headerBg: 'bg-sky-600',
    detailBg: 'bg-sky-50',
    detailText: 'text-sky-800',
    badgeBg: 'bg-sky-600',
    icon: '📋',
  },
  C: {
    message: 'もう少し状況を整理してみましょう',
    detail: '不安な場合は、福祉事務所に相談するだけでも大丈夫です。',
    headerBg: 'bg-teal-600',
    detailBg: 'bg-teal-50',
    detailText: 'text-teal-800',
    badgeBg: 'bg-teal-600',
    icon: '🔍',
  },
}

const NEXT_STEPS = {
  A: [
    '年金額がわかるものを用意する（年金振込通知書など）',
    '病院の診察券・お薬手帳を用意する',
    '銀行の通帳を用意する（直近2〜3か月分）',
    '印鑑を持っていく（認印でOK）',
    '福祉事務所に電話して「申請したい」と伝える',
    '窓口で「生活保護を申請したい」とはっきり伝える',
  ],
  B: [
    '年金額がわかるものを用意する',
    '病院の診察券・お薬手帳を用意する',
    '銀行の通帳を用意する（直近2〜3か月分）',
    '印鑑を持っていく（認印でOK）',
    '福祉事務所で「申請を希望します」と伝える',
  ],
  C: [
    '状況を整理して、何が不足しているか確認する',
    '福祉事務所や相談窓口に相談してみる',
    '生活状況が悪化した場合は、すぐに申請を検討する',
  ],
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }
  return (
    <button
      onClick={handleCopy}
      className={`w-full py-3 rounded-xl font-bold text-base transition-colors ${
        copied ? 'bg-green-500 text-white' : 'bg-sky-700 text-white active:opacity-80'
      }`}
    >
      {copied ? '✓ コピーしました' : '📋 コピーする'}
    </button>
  )
}

export default function Result({ result, answers, navigate }) {
  const [showReasons, setShowReasons] = useState(false)
  const [showPhrase, setShowPhrase] = useState(false)

  if (!result) {
    return (
      <div className="pt-10 text-center space-y-5">
        <p className="text-xl text-gray-500">診断結果がありません</p>
        <button
          onClick={() => navigate('questionnaire')}
          className="btn-primary w-full"
        >
          診断を始める
        </button>
      </div>
    )
  }

  const cfg = STATUS_CONFIG[result.grade]
  const steps = NEXT_STEPS[result.grade]
  const phrase = generatePhrase(answers)

  return (
    <div className="pt-5 space-y-5 pb-6">

      {/* Status banner */}
      <div className="rounded-2xl overflow-hidden shadow-sm">
        <div className={`${cfg.headerBg} text-white px-5 py-5`}>
          <div className="flex items-start gap-3">
            <span className="text-4xl flex-shrink-0">{cfg.icon}</span>
            <div>
              <p className="text-xs font-bold text-white opacity-70 mb-1 uppercase tracking-wide">あなたの状況</p>
              <p className="text-xl font-bold leading-snug">{cfg.message}</p>
            </div>
          </div>
        </div>
        <div className={`${cfg.detailBg} px-5 py-3`}>
          <p className={`text-base ${cfg.detailText} leading-relaxed`}>{cfg.detail}</p>
        </div>
      </div>

      {/* Next steps — primary content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-xl font-bold text-gray-800 mb-4">次にすること</h2>
        <ol className="space-y-4">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className={`w-8 h-8 rounded-full ${cfg.badgeBg} text-white text-base font-bold flex-shrink-0 flex items-center justify-center`}
              >
                {i + 1}
              </span>
              <span className="text-base text-gray-700 pt-0.5 leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Key action button */}
      <button
        onClick={() => navigate('checklist')}
        className="btn-primary w-full"
        style={{ minHeight: '64px' }}
      >
        📂 申請の準備を始める →
      </button>

      {/* Phrase for welfare office */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <button
          onClick={() => setShowPhrase(!showPhrase)}
          className="w-full flex items-center justify-between"
        >
          <span className="text-lg font-bold text-gray-800">💬 窓口で言う言葉を確認する</span>
          <span className="text-sky-600 text-base font-medium ml-3 flex-shrink-0">
            {showPhrase ? '閉じる ▲' : '表示する ▼'}
          </span>
        </button>

        {showPhrase && (
          <div className="mt-4 space-y-3">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-base text-gray-800 leading-loose whitespace-pre-line">{phrase}</p>
            </div>
            <CopyButton text={phrase} />
            <p className="text-xs text-gray-400">
              ※ 実際の状況に合わせて修正してください。
            </p>
          </div>
        )}
      </div>

      {/* Collapsible reasons */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <button
          onClick={() => setShowReasons(!showReasons)}
          className="w-full flex items-center justify-between"
        >
          <span className="text-lg font-bold text-gray-800">📊 判断の根拠を見る</span>
          <span className="text-gray-500 text-base ml-3 flex-shrink-0">
            {showReasons ? '閉じる ▲' : 'くわしく見る ▼'}
          </span>
        </button>

        {showReasons && (
          <div className="mt-4 space-y-2">
            {result.reasons.map((r, i) => (
              <div key={i} className="flex items-start gap-2 text-base py-1">
                <span className="flex-shrink-0 mt-0.5">
                  {r.level === 'urgent' ? '🔴' : r.level === 'concern' ? '🟡' : '⚪'}
                </span>
                <span className={
                  r.level === 'urgent'
                    ? 'text-orange-700 font-medium'
                    : r.level === 'concern'
                    ? 'text-sky-700'
                    : 'text-gray-600'
                }>
                  {r.text}
                </span>
              </div>
            ))}
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
              ※ この診断は参考情報です。最終的な判断は福祉事務所が行います。
            </p>
          </div>
        )}
      </div>

      {/* Other action buttons */}
      <div className="space-y-3 no-print">
        <button onClick={() => navigate('refusal')} className="btn-secondary w-full">
          🛡️ 断られた時の対応を確認する
        </button>
        <button
          onClick={() => window.print()}
          className="w-full py-4 rounded-xl border-2 border-gray-300 text-gray-600 font-bold text-lg"
          style={{ minHeight: '60px' }}
        >
          🖨️ この結果を印刷する
        </button>
        <button
          onClick={() => navigate('questionnaire')}
          className="w-full text-center text-gray-400 text-base py-3 underline"
        >
          診断をやり直す
        </button>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
        <p className="text-xs text-gray-500 leading-relaxed">
          【免責事項】この診断結果は参考情報であり、生活保護の受給を保証するものではありません。最終的な判断は各自治体の福祉事務所が行います。緊急の場合は直ちに福祉事務所へご相談ください。
        </p>
      </div>
    </div>
  )
}
