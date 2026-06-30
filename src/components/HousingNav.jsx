import { useState } from 'react'
import { housingQuestions } from '../data/housingQuestions'
import { diagnoseHousing, generateHousingPhrase } from '../utils/housingDiagnosis'

function shouldShow(q, answers) {
  if (q.skipIf && q.skipIf(answers)) return false
  if (q.showIf && !q.showIf(answers)) return false
  return true
}

function CopyButton({ text, label = 'コピーする' }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text) } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy}
      className={`w-full py-3 rounded-xl font-bold text-base transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-teal-600 text-white'}`}>
      {copied ? '✓ コピーしました' : `📋 ${label}`}
    </button>
  )
}

// ─── Questionnaire sub-view ───────────────────────────────────────────────
function QuestionnaireView({ answers, onAnswer, onComplete, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const visible = housingQuestions.filter((q) => shouldShow(q, answers))
  const current = visible[currentIndex]
  const total = visible.length
  const progress = Math.round((currentIndex / total) * 100)
  const isLast = currentIndex === visible.length - 1

  const currentAnswer = answers[current?.id]

  const handleRadio = (value) => {
    onAnswer((prev) => ({ ...prev, [current.id]: value }))
  }

  const handleCheckbox = (value) => {
    const cur = answers[current.id] || []
    const updated = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
    onAnswer((prev) => ({ ...prev, [current.id]: updated }))
  }

  const canProceed = () => {
    if (!current) return false
    if (current.type === 'radio') return !!answers[current.id]
    return true
  }

  const handleNext = () => {
    if (!canProceed()) return
    // Recompute visible after state update
    if (currentIndex < visible.length - 1) {
      setCurrentIndex(currentIndex + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      onComplete(answers)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      onBack()
    }
  }

  if (!current) return null

  return (
    <div className="pt-5 space-y-4">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>{current.section}</span>
          <span>{currentIndex + 1} / {total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-teal-600 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question card */}
      <div className="card">
        <p className="text-xl font-bold text-gray-800 leading-relaxed whitespace-pre-line">{current.question}</p>
        {current.hint && <p className="text-sm text-gray-500 mt-1">{current.hint}</p>}

        <div className="mt-4 space-y-2">
          {current.type === 'radio' && current.options.map((opt) => {
            const sel = currentAnswer === opt.value
            return (
              <button key={opt.value} onClick={() => handleRadio(opt.value)}
                className={`w-full text-left px-4 py-4 rounded-xl border-2 text-lg font-medium transition-colors
                  ${sel ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-teal-400'}`}>
                <span className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${sel ? 'border-white' : 'border-gray-400'}`}>
                    {sel && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </span>
                  {opt.label}
                </span>
              </button>
            )
          })}

          {current.type === 'checkbox' && current.options.map((opt) => {
            const sel = (currentAnswer || []).includes(opt.value)
            return (
              <button key={opt.value} onClick={() => handleCheckbox(opt.value)}
                className={`w-full text-left px-4 py-4 rounded-xl border-2 text-lg font-medium transition-colors
                  ${sel ? 'bg-teal-600 border-teal-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-teal-400'}`}>
                <span className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-lg border-2 flex-shrink-0 flex items-center justify-center ${sel ? 'border-white bg-white' : 'border-gray-400'}`}>
                    {sel && <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 12 12"><path d="M10 3L5 8.5 2 5.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                  {opt.label}
                </span>
              </button>
            )
          })}
        </div>

        {current.type === 'checkbox' && (
          <p className="text-sm text-gray-400 mt-3">※ 複数選択できます。該当するものをすべて選んでください。</p>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button onClick={handlePrev} className="flex-1 btn-secondary py-4 text-lg">← 戻る</button>
        <button onClick={handleNext} disabled={!canProceed()}
          className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-md transition-all
            ${canProceed() ? 'bg-teal-600 text-white active:scale-95' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
          {isLast ? '結果を見る →' : '次へ →'}
        </button>
      </div>
    </div>
  )
}

// ─── Result sub-view ──────────────────────────────────────────────────────
const LEVEL_STYLE = {
  critical: { card: 'bg-red-50 border-red-300',   text: 'text-red-800' },
  warning:  { card: 'bg-orange-50 border-orange-300', text: 'text-orange-800' },
  check:    { card: 'bg-blue-50 border-blue-200',  text: 'text-blue-800' },
  ok:       { card: 'bg-green-50 border-green-200', text: 'text-green-800' },
  info:     { card: 'bg-gray-50 border-gray-200',  text: 'text-gray-700' },
}

const URGENCY_CONFIG = {
  critical: { bar: 'bg-red-500',    border: 'border-red-400',    icon: '🚨', label: '至急、福祉事務所への相談が必要です' },
  warning:  { bar: 'bg-orange-500', border: 'border-orange-400', icon: '⚠️', label: '転居前に福祉事務所への確認が必要です' },
  ok:       { bar: 'bg-teal-500',   border: 'border-teal-400',   icon: '✅', label: '確認が必要な点があります' },
}

function ResultView({ result, answers, onRetry, navigate }) {
  const [showPhrase, setShowPhrase] = useState(false)
  const phrase = generateHousingPhrase(answers)
  const cfg = URGENCY_CONFIG[result.urgency]

  const checkItems = [
    '候補物件の家賃が住宅扶助の上限（地域別）に収まるか',
    '共益費・管理費が住宅扶助の対象か',
    '敷金・仲介手数料などの初期費用が認められるか（礼金は原則対象外）',
    '引っ越し費用が認められるか',
    '転居の理由が正当と認められるか',
    '契約前に福祉事務所の承認・確認が必要か',
    '高齢者・生活保護受給者向けの入居支援があるか',
  ]

  return (
    <div className="pt-5 space-y-5">
      {/* Urgency banner */}
      <div className={`rounded-2xl overflow-hidden border-2 ${cfg.border}`}>
        <div className={`${cfg.bar} text-white px-5 py-4 flex items-center gap-3`}>
          <span className="text-3xl">{cfg.icon}</span>
          <div>
            <p className="text-xs font-bold opacity-80 mb-0.5">住まい・転居診断</p>
            <p className="text-lg font-bold">{cfg.label}</p>
          </div>
        </div>
      </div>

      {/* Issues */}
      <div className="card">
        <h3 className="font-bold text-lg text-gray-800 mb-3">📊 確認・注意事項</h3>
        <div className="space-y-3">
          {result.issues.map((issue) => {
            const s = LEVEL_STYLE[issue.level] || LEVEL_STYLE.info
            return (
              <div key={issue.id} className={`rounded-xl border p-4 ${s.card}`}>
                <div className="flex items-start gap-2">
                  <span className="text-xl flex-shrink-0">{issue.icon}</span>
                  <div>
                    <p className={`font-bold text-base ${s.text}`}>{issue.title}</p>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">{issue.detail}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Important warning box */}
      <div className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-4">
        <p className="font-bold text-amber-800 mb-2">⚠️ 注意事項</p>
        <p className="text-sm text-amber-900 leading-relaxed">
          生活保護申請前に自己判断で契約・転居すると、家賃上限超過による自己負担、初期費用が認められないこと、
          申請不承認時の生活悪化につながる可能性があります。
          <strong>必ず契約前に福祉事務所へ確認してください。</strong>
        </p>
      </div>

      {/* Generated consultation phrase */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-800">💬 転居前相談で伝える文章</h3>
          <button onClick={() => setShowPhrase(!showPhrase)} className="text-teal-600 text-sm font-medium">
            {showPhrase ? '閉じる' : '表示する'}
          </button>
        </div>
        {showPhrase ? (
          <div className="space-y-3">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-base text-gray-800 leading-loose whitespace-pre-line">{phrase}</p>
            </div>
            <CopyButton text={phrase} label="相談文をコピーする" />
            <button onClick={() => window.print()}
              className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-bold text-base">
              🖨️ 印刷する
            </button>
            <p className="text-xs text-gray-400">※ 実際の状況に合わせて適宜修正してください</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            入力内容をもとに、福祉事務所の転居前相談で使える文章を自動生成します。
          </p>
        )}
      </div>

      {/* Checklist for welfare office */}
      <div className="card">
        <h3 className="font-bold text-lg text-gray-800 mb-3">📋 福祉事務所で確認すること</h3>
        <ul className="space-y-3">
          {checkItems.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-sm font-bold flex-shrink-0 flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-base text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
        <p className="text-xs text-gray-500 leading-relaxed">
          【免責事項】この診断結果は参考情報です。住宅扶助の上限額・初期費用の取り扱いは地域・状況により大きく異なります。必ず最寄りの福祉事務所にご確認ください。
        </p>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 no-print">
        <button onClick={() => navigate('questionnaire')} className="btn-primary w-full">
          📋 生活保護の申請診断を行う
        </button>
        <button onClick={() => navigate('phrases')} className="btn-secondary w-full">
          💬 窓口での伝え方を確認する
        </button>
        <button onClick={onRetry} className="w-full text-center text-gray-400 text-sm py-2 underline">
          住まい診断をやり直す
        </button>
      </div>
    </div>
  )
}

// ─── Intro sub-view ───────────────────────────────────────────────────────
function IntroView({ onStart, navigate }) {
  return (
    <div className="pt-5 space-y-5">
      <div className="card">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🏠</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-teal-800">住まい・転居相談ナビ</h2>
            <p className="text-sm text-gray-500 mt-0.5">転居前に確認すべきことを整理します</p>
          </div>
        </div>
        <p className="text-base text-gray-700 leading-relaxed">
          生活保護の申請に合わせて転居を考えている場合、先に物件を契約してしまうと、
          家賃が住宅扶助の上限を超えていたり、初期費用が認められなかったりする可能性があります。
        </p>
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
          <p className="text-sm text-orange-800 font-medium">
            ⚠️ 契約前に必ず福祉事務所で確認してください。このナビが確認すべき点を整理します。
          </p>
        </div>
      </div>

      {/* What this covers */}
      <div className="card">
        <h3 className="font-bold text-base text-gray-800 mb-3">このナビでわかること</h3>
        <ul className="space-y-3">
          {[
            { icon: '💴', text: '先に契約するのは危険かどうか' },
            { icon: '🏛️', text: '転居前に福祉事務所への確認が必要か' },
            { icon: '💰', text: '候補物件の家賃が住宅扶助の上限内か' },
            { icon: '📋', text: '共益費・管理費が住宅扶助の対象か' },
            { icon: '🔑', text: '敷金・礼金・初期費用が認められるか' },
            { icon: '🚚', text: '引っ越し費用が対象になるか' },
            { icon: '👴', text: '高齢者・生活保護受給者の入居で注意すること' },
            { icon: '📝', text: '福祉事務所への転居前相談文の自動生成' },
          ].map((item, i) => (
            <li key={i} className="flex items-center gap-3 text-base text-gray-700">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onStart}
        className="w-full py-5 rounded-2xl bg-teal-600 text-white font-bold text-xl shadow-md active:scale-95 transition-transform"
      >
        🏠 住まい診断を始める
      </button>

      {/* Key caution */}
      <div className="card border-l-4 border-red-400">
        <p className="font-bold text-red-800 mb-2">🚨 転居前に必ず確認！</p>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>・生活保護申請前または申請中に転居する場合、福祉事務所の事前確認が必要です</li>
          <li>・自己判断で先に契約すると、費用が認められない可能性があります</li>
          <li>・申請後に「家賃が高すぎる」と言われた場合、転居を求められることがあります</li>
          <li>・礼金は原則として生活保護の対象外です。礼金なし物件を優先しましょう</li>
        </ul>
      </div>

      <button onClick={() => navigate('knowledge')} className="btn-secondary w-full">
        📖 制度の基礎知識も確認する
      </button>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────
export default function HousingNav({ navigate }) {
  const [view, setView] = useState('intro')
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  const handleComplete = (finalAnswers) => {
    setResult(diagnoseHousing(finalAnswers))
    setView('result')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (view === 'questionnaire') {
    return (
      <QuestionnaireView
        answers={answers}
        onAnswer={setAnswers}
        onComplete={handleComplete}
        onBack={() => setView('intro')}
      />
    )
  }

  if (view === 'result') {
    return (
      <ResultView
        result={result}
        answers={answers}
        onRetry={() => { setAnswers({}); setResult(null); setView('questionnaire') }}
        navigate={navigate}
      />
    )
  }

  return <IntroView onStart={() => setView('questionnaire')} navigate={navigate} />
}
