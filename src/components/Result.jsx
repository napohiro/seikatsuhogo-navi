import { useState } from 'react'
import { getRequiredDocuments, generatePhrase } from '../utils/diagnosis'

const GRADE_CONFIG = {
  A: {
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-400',
    headerBg: 'bg-orange-500',
    badge: 'bg-orange-500',
    label: '申請を急いだ方がよい状況です',
    sublabel: '生活に困窮しているサインが複数あります。できるだけ早く福祉事務所へ行きましょう。',
    icon: '🚨',
  },
  B: {
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    headerBg: 'bg-blue-600',
    badge: 'bg-blue-600',
    label: '申請可能性があります',
    sublabel: '生活保護の申請を検討できる状況です。福祉事務所に相談し、正式に申請することをお勧めします。',
    icon: '📝',
  },
  C: {
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-400',
    headerBg: 'bg-teal-600',
    badge: 'bg-teal-600',
    label: '追加確認が必要です',
    sublabel: '現状では確認が必要な点があります。状況が変化した場合や不安がある場合は、福祉事務所へ相談することをお勧めします。',
    icon: '🔍',
  },
}

const LEVEL_ICONS = { urgent: '🔴', concern: '🟡', check: '⚪' }

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
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-sky-700 text-white hover:bg-sky-600'}`}
    >
      {copied ? '✓ コピー済み' : '📋 コピーする'}
    </button>
  )
}

export default function Result({ result, answers, navigate }) {
  const [showPhrase, setShowPhrase] = useState(false)

  if (!result) {
    return (
      <div className="pt-10 text-center space-y-4">
        <p className="text-xl text-gray-500">診断結果がありません</p>
        <button onClick={() => navigate('questionnaire')} className="btn-primary">
          診断を始める
        </button>
      </div>
    )
  }

  const cfg = GRADE_CONFIG[result.grade]
  const docs = getRequiredDocuments(answers)
  const phrase = generatePhrase(answers)

  const nextSteps = {
    A: [
      '今すぐ最寄りの福祉事務所（市区町村の役所）へ行く',
      '「生活保護の申請をしたい」と窓口で明確に伝える',
      '申請書を受け取り、その場で記入・提出する',
      '書類が不足している場合も申請は可能（後日提出でOK）',
      '申請当日から保護が始まります（遡及あり）',
    ],
    B: [
      '最寄りの福祉事務所（市区町村の役所）に相談に行く',
      '「生活保護の申請を希望します」と明確に伝える',
      '申請書を受け取り、記入・提出する',
      '必要書類を確認し、準備を進める',
      '審査結果は原則14日以内に通知されます',
    ],
    C: [
      '状況を整理し、何が不足しているか確認する',
      '福祉事務所や相談窓口に相談してみる',
      '生活状況が悪化した場合は、すぐに申請を検討する',
      '制度の基礎知識を確認しておく',
    ],
  }

  return (
    <div className="pt-5 space-y-5">
      {/* Grade banner */}
      <div className={`rounded-2xl overflow-hidden border-2 ${cfg.border}`}>
        <div className={`${cfg.headerBg} text-white px-5 py-4`}>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{cfg.icon}</span>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white bg-opacity-30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  診断結果
                </span>
              </div>
              <h2 className="text-xl font-bold leading-tight">{cfg.label}</h2>
            </div>
          </div>
        </div>
        <div className={`${cfg.bg} px-5 py-4`}>
          <p className={`text-base ${cfg.color} leading-relaxed`}>{cfg.sublabel}</p>
        </div>
      </div>

      {/* Important notice for A */}
      {result.grade === 'A' && (
        <div className="bg-orange-50 border-2 border-orange-400 rounded-2xl p-4">
          <p className="font-bold text-orange-800 text-base">
            🏛️ 今すぐ行動できます
          </p>
          <p className="text-orange-700 text-sm mt-1">
            福祉事務所は市区町村の役所内にあります。「生活保護の窓口はどこですか？」と聞けば案内してもらえます。
          </p>
        </div>
      )}

      {/* Reasons */}
      <div className="card">
        <h3 className="font-bold text-lg text-gray-800 mb-3">📊 診断の根拠</h3>
        <div className="space-y-2">
          {result.reasons.map((r, i) => (
            <div key={i} className="flex items-start gap-2 text-base">
              <span className="flex-shrink-0 mt-0.5">{LEVEL_ICONS[r.level]}</span>
              <span className={r.level === 'urgent' ? 'text-orange-700 font-medium' : r.level === 'concern' ? 'text-blue-700' : 'text-gray-600'}>
                {r.text}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 leading-relaxed">
          ※ この診断は参考情報です。最終的な受給可否は福祉事務所が判断します。
          最低生活費の目安は地域・世帯構成により異なります。
        </p>
      </div>

      {/* Next steps */}
      <div className="card">
        <h3 className="font-bold text-lg text-gray-800 mb-3">📌 次にやること</h3>
        <ol className="space-y-3">
          {nextSteps[result.grade].map((step, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={`w-7 h-7 rounded-full ${cfg.badge} text-white text-sm font-bold flex-shrink-0 flex items-center justify-center`}>
                {i + 1}
              </span>
              <span className="text-base text-gray-700 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Phrase for welfare office */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-800">💬 窓口で伝える文章</h3>
          <button
            onClick={() => setShowPhrase(!showPhrase)}
            className="text-sky-600 text-sm font-medium"
          >
            {showPhrase ? '閉じる' : '表示する'}
          </button>
        </div>

        {showPhrase ? (
          <div className="space-y-3">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-base text-gray-800 leading-loose whitespace-pre-line">{phrase}</p>
            </div>
            <div className="flex justify-end">
              <CopyButton text={phrase} />
            </div>
            <p className="text-xs text-gray-400">
              ※ 実際の状況に合わせて適宜修正してください。
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            入力内容をもとに、窓口で使える申請文を自動生成します。
          </p>
        )}
      </div>

      {/* Required documents */}
      <div className="card">
        <h3 className="font-bold text-lg text-gray-800 mb-3">📄 準備しておくと良い書類</h3>
        <p className="text-sm text-gray-500 mb-3">書類が揃っていなくても申請できます。後日提出も可能です。</p>
        <div className="space-y-2">
          {docs.map((doc, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
              <span className={`text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 mt-0.5
                ${doc.category === '必須' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
              >
                {doc.category}
              </span>
              <div>
                <p className="text-base text-gray-800 font-medium">{doc.label}</p>
                {doc.note && <p className="text-sm text-gray-500">{doc.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 no-print">
        <button onClick={() => navigate('checklist')} className="btn-secondary w-full">
          ✅ チェックリストで準備状況を管理する
        </button>
        <button onClick={() => navigate('phrases')} className="btn-secondary w-full">
          💬 窓口で伝える文章をもっと確認する
        </button>
        <button onClick={() => navigate('refusal')} className="btn-secondary w-full">
          🛡️ 断られた時の対応を確認する
        </button>
        <button
          onClick={() => window.print()}
          className="w-full py-4 rounded-xl border-2 border-gray-300 text-gray-600 font-bold text-lg"
        >
          🖨️ この結果を印刷する
        </button>
        <button
          onClick={() => navigate('questionnaire')}
          className="w-full text-center text-gray-400 text-sm py-2 underline"
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
