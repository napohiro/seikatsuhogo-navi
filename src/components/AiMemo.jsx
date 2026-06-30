import { useState } from 'react'
import { generateAiMemo, MEMO_FIELDS } from '../utils/aiMemoLogic'

function CopyButton({ text, label = 'コピー', color = 'green' }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
      } else {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.focus()
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // ignore
    }
  }
  return (
    <button
      onClick={handleCopy}
      className={`text-sm px-3 py-1.5 rounded-lg border font-medium transition-all flex-shrink-0 ${
        copied
          ? 'bg-green-500 text-white border-green-500'
          : `bg-white text-${color}-700 border-${color}-400 active:bg-${color}-50`
      }`}
    >
      {copied ? '✅ コピー済' : `📋 ${label}`}
    </button>
  )
}

function SectionCard({ icon, title, colorClass, children, copyText }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <p className={`font-bold ${colorClass}`}>{title}</p>
        </div>
        {copyText && <CopyButton text={copyText} label="コピー" color="green" />}
      </div>
      {children}
    </div>
  )
}

export default function AiMemo({ navigate }) {
  const [inputs, setInputs] = useState({})
  const [result, setResult] = useState(null)
  const [activeSection, setActiveSection] = useState('questions')

  const handleChange = (id, value) => setInputs((prev) => ({ ...prev, [id]: value }))

  const hasAnyInput = MEMO_FIELDS.some((f) => inputs[f.id] && inputs[f.id].trim())

  const handleGenerate = () => {
    const memo = generateAiMemo(inputs)
    setResult(memo)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setResult(null)
    setInputs({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (result) {
    const allText = [
      `【状況整理メモ】\n${result.situation}`,
      `\n【福祉事務所に聞く質問リスト】\n${result.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`,
      `\n【窓口で伝える文章】\n${result.windowPhrase}`,
      `\n【注意すべきリスク】\n${result.risks.map((r) => `・${r}`).join('\n')}`,
      `\n【次にやること】\n${result.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    ].join('\n')

    const sections = [
      { id: 'situation', label: '状況整理', icon: '📋' },
      { id: 'questions', label: '質問リスト', icon: '❓' },
      { id: 'phrase', label: '伝える文章', icon: '💬' },
      { id: 'risks', label: 'リスク', icon: '⚠️' },
      { id: 'next', label: '次のステップ', icon: '✅' },
    ]

    return (
      <div className="pt-5 space-y-5">
        {/* Disclaimer */}
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl">
          <p className="text-sm text-amber-900 leading-relaxed font-medium">
            ⚠️ このメモはAIによる行政判断ではありません。生活保護の可否は福祉事務所が生活実態を確認して判断します。このメモは、相談内容を整理し、窓口で正しく伝えるための補助としてご活用ください。
          </p>
        </div>

        {/* Tab selector */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeSection === s.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 active:bg-gray-50'
                }`}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section content */}
        {activeSection === 'situation' && (
          <SectionCard icon="📋" title="状況整理メモ" colorClass="text-green-800" copyText={result.situation}>
            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">{result.situation || '（入力内容がありません）'}</p>
            </div>
          </SectionCard>
        )}

        {activeSection === 'questions' && (
          <SectionCard
            icon="❓"
            title="福祉事務所に聞く質問リスト"
            colorClass="text-blue-800"
            copyText={result.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
          >
            <div className="space-y-2">
              {result.questions.map((q, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-base text-gray-800 leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {activeSection === 'phrase' && (
          <SectionCard icon="💬" title="窓口で伝える文章" colorClass="text-purple-800" copyText={result.windowPhrase}>
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">{result.windowPhrase}</p>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              「申請書をください」と最後に必ず伝えましょう。
            </p>
          </SectionCard>
        )}

        {activeSection === 'risks' && (
          <SectionCard icon="⚠️" title="注意すべきリスク" colorClass="text-orange-800">
            <div className="space-y-2">
              {result.risks.map((r, i) => (
                <div key={i} className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-900 leading-relaxed flex items-start gap-2">
                  <span className="flex-shrink-0">⚠️</span>{r}
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {activeSection === 'next' && (
          <SectionCard
            icon="✅"
            title="次にやること"
            colorClass="text-teal-800"
            copyText={result.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}
          >
            <div className="space-y-2">
              {result.nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-teal-50 rounded-xl">
                  <span className="w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-base text-gray-800 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        )}

        {/* Full copy */}
        <div className="card">
          <p className="font-bold text-gray-700 mb-3">📄 全体をまとめてコピー</p>
          <CopyButton text={allText} label="全セクションをコピー" color="gray" />
          <p className="text-xs text-gray-400 mt-2">状況整理・質問・相談文・リスク・次のステップを一度にコピーします</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button onClick={handleReset} className="w-full btn-secondary py-4 text-lg">入力内容を変えてやり直す</button>
          <button onClick={() => navigate('questionnaire')} className="w-full btn-primary py-4 text-lg">
            かんたん診断でさらに詳しく調べる →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-5 space-y-5">
      <div className="card">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🤖</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-green-800">AI相談メモ</h2>
            <p className="text-sm text-gray-500 mt-0.5">状況を整理して、窓口で使える文章を作成</p>
          </div>
        </div>
        <p className="text-base text-gray-700 leading-relaxed">
          困っていること・家族構成・収入などを自由に入力すると、<strong className="text-green-700">福祉事務所への質問リスト・窓口で伝える文章・リスク・次のステップ</strong>を自動で作成します。
        </p>
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <p className="text-sm text-amber-800 leading-relaxed">
          ⚠️ このメモはAIによる行政判断ではありません。生活保護の可否は福祉事務所が判断します。相談内容を整理するための補助としてご利用ください。
        </p>
      </div>

      <div className="space-y-4">
        {MEMO_FIELDS.map((field) => (
          <div key={field.id} className="card">
            <label className="block">
              <p className="font-bold text-gray-800 mb-2">{field.label}</p>
              <textarea
                value={inputs[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                rows={field.rows}
                className="w-full p-4 border-2 border-gray-200 rounded-xl text-base leading-relaxed focus:outline-none focus:border-green-400 resize-none placeholder-gray-400"
              />
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={handleGenerate}
        disabled={!hasAnyInput}
        className={`w-full py-5 text-xl font-bold rounded-2xl transition-all ${
          hasAnyInput
            ? 'bg-green-600 text-white active:bg-green-700'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        相談メモを作成する →
      </button>

      {!hasAnyInput && (
        <p className="text-center text-sm text-gray-400">1つ以上の項目を入力すると、メモを作成できます</p>
      )}
    </div>
  )
}
