import { useState } from 'react'
import { simulatorQuestions } from '../data/simulatorQuestions'
import { simulate, generateComparisonPhrase } from '../utils/simulatorLogic'

const POSSIBILITY_CONFIG = {
  high: {
    label: '申請できる可能性が高い',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    icon: '🔴',
  },
  mid: {
    label: '申請できる可能性あり（要確認）',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: '🟡',
  },
  low: {
    label: '申請が難しい可能性あり',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    icon: '⚪',
  },
}

const ISSUE_LEVEL_STYLE = {
  critical: 'bg-red-50 border-red-300 text-red-800',
  warn: 'bg-yellow-50 border-yellow-300 text-yellow-800',
  caution: 'bg-orange-50 border-orange-200 text-orange-800',
  check: 'bg-blue-50 border-blue-200 text-blue-800',
  ok: 'bg-green-50 border-green-200 text-green-800',
  info: 'bg-gray-50 border-gray-200 text-gray-700',
}

const ISSUE_ICON = {
  critical: '🚨',
  warn: '⚠️',
  caution: '⚠️',
  check: '✅',
  ok: '✅',
  info: 'ℹ️',
}

function CopyButton({ text }) {
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
      className={`w-full py-3 px-4 rounded-xl font-bold text-base border-2 transition-all ${
        copied
          ? 'bg-green-500 text-white border-green-500'
          : 'bg-white text-indigo-700 border-indigo-500 active:bg-indigo-50'
      }`}
    >
      {copied ? '✅ コピーしました' : '📋 比較相談文をコピー'}
    </button>
  )
}

function IntroView({ onStart }) {
  return (
    <div className="pt-5 space-y-5">
      <div className="card">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">⚖️</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-indigo-800">暮らし方比較シミュレーター</h2>
            <p className="text-sm text-gray-500 mt-0.5">同居vs別居、どちらが現実的かを確認</p>
          </div>
        </div>
        <p className="text-base text-gray-700 leading-relaxed">
          生活保護を申請する際に、<strong className="text-indigo-700">「家族と同居する（A案）」</strong>と
          <strong className="text-indigo-700">「老夫婦のみで別居する（B案）」</strong>のどちらが現実的かを、
          収入・家賃・家族状況をもとに比較します。
        </p>
      </div>

      <div className="card space-y-3">
        <p className="font-bold text-gray-800">このシミュレーターでわかること</p>
        {[
          { icon: '💰', text: '各パターンの収入と最低生活費の比較' },
          { icon: '🏠', text: '転居先の家賃が住宅扶助の上限内かの確認' },
          { icon: '⚠️', text: '各パターンのリスクと注意点' },
          { icon: '💬', text: '福祉事務所で使える比較相談文の自動生成' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            <p className="text-base text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <p className="text-sm text-amber-800 font-medium leading-relaxed">
          ⚠️ このシミュレーターの金額はあくまで目安です。実際の生活保護費は地域・年齢・世帯人数・家賃・収入・資産・病気・介護状況によって異なります。最終判断は福祉事務所が行います。
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full btn-primary py-5 text-xl"
      >
        シミュレーションを始める →
      </button>
    </div>
  )
}

function QuestionnaireView({ onComplete }) {
  const [answers, setAnswers] = useState({})
  const [currentIndex, setCurrentIndex] = useState(0)

  const visibleQuestions = simulatorQuestions.filter((q) => {
    if (q.showIf && !q.showIf(answers)) return false
    return true
  })

  const currentQ = visibleQuestions[currentIndex]
  const progress = Math.round(((currentIndex) / visibleQuestions.length) * 100)

  const handleAnswer = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }))
  }

  const handleCheckbox = (qId, value, checked) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[qId]) ? prev[qId] : []
      if (checked) return { ...prev, [qId]: [...current, value] }
      return { ...prev, [qId]: current.filter((v) => v !== value) }
    })
  }

  const canProceed = () => {
    if (!currentQ) return false
    if (currentQ.required === false) return true
    const val = answers[currentQ.id]
    if (currentQ.type === 'checkbox') return Array.isArray(val) && val.length > 0
    if (currentQ.type === 'text') return true
    return !!val
  }

  const handleNext = () => {
    if (currentIndex < visibleQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      onComplete(answers)
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSkip = () => {
    if (currentIndex < visibleQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      onComplete(answers)
    }
  }

  if (!currentQ) return null

  return (
    <div className="pt-5 space-y-4">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>質問 {currentIndex + 1} / {visibleQuestions.length}</span>
          <span className="text-indigo-600 font-medium">{currentQ.section}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card">
        <p className="text-xl font-bold text-gray-800 leading-snug mb-2">
          {currentQ.question}
        </p>
        {currentQ.hint && (
          <p className="text-sm text-gray-500 mb-4">{currentQ.hint}</p>
        )}

        {/* Radio */}
        {currentQ.type === 'radio' && (
          <div className="space-y-2">
            {currentQ.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[currentQ.id] === opt.value
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-800'
                    : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                }`}
              >
                <input
                  type="radio"
                  name={currentQ.id}
                  value={opt.value}
                  checked={answers[currentQ.id] === opt.value}
                  onChange={() => handleAnswer(currentQ.id, opt.value)}
                  className="sr-only"
                />
                <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                  answers[currentQ.id] === opt.value ? 'border-indigo-500 bg-indigo-500' : 'border-gray-400'
                }`}>
                  {answers[currentQ.id] === opt.value && (
                    <span className="w-2 h-2 bg-white rounded-full" />
                  )}
                </span>
                <span className="text-base">{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {/* Checkbox */}
        {currentQ.type === 'checkbox' && (
          <div className="space-y-2">
            {currentQ.options.map((opt) => {
              const checked = Array.isArray(answers[currentQ.id]) && answers[currentQ.id].includes(opt.value)
              return (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    checked
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-800'
                      : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => handleCheckbox(currentQ.id, opt.value, e.target.checked)}
                    className="sr-only"
                  />
                  <span className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                    checked ? 'border-indigo-500 bg-indigo-500' : 'border-gray-400'
                  }`}>
                    {checked && <span className="text-white text-xs font-bold">✓</span>}
                  </span>
                  <span className="text-base">{opt.label}</span>
                </label>
              )
            })}
          </div>
        )}

        {/* Text */}
        {currentQ.type === 'text' && (
          <input
            type="text"
            value={answers[currentQ.id] || ''}
            onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
            placeholder={currentQ.placeholder || ''}
            className="w-full p-4 border-2 border-gray-200 rounded-xl text-base focus:outline-none focus:border-indigo-400"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentIndex > 0 && (
          <button
            onClick={handleBack}
            className="flex-1 btn-secondary py-4 text-lg"
          >
            ← 戻る
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex-1 py-4 text-lg font-bold rounded-2xl transition-all ${
            canProceed()
              ? 'bg-indigo-600 text-white active:bg-indigo-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentIndex < visibleQuestions.length - 1 ? '次へ →' : '結果を見る →'}
        </button>
      </div>

      {currentQ.required === false && (
        <button
          onClick={handleSkip}
          className="w-full text-center text-sm text-gray-500 underline py-2"
        >
          スキップする
        </button>
      )}
    </div>
  )
}

function PatternCard({ title, icon, color, result: pat, isRecommended }) {
  const pc = POSSIBILITY_CONFIG[pat.possibility]
  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${isRecommended ? 'border-indigo-400' : 'border-gray-200'}`}>
      {isRecommended && (
        <div className="bg-indigo-600 text-white text-center py-1.5 text-sm font-bold">
          ★ こちらの方が現実的な可能性あり
        </div>
      )}
      <div className={`p-4 ${color}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <p className="font-bold text-lg">{title}</p>
        </div>
        <p className="text-sm opacity-80 mt-0.5">{pat.householdSize}人世帯</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Possibility badge */}
        <div className={`p-3 rounded-xl border text-center font-bold text-base ${pc.color}`}>
          {pc.icon} {pc.label}
        </div>

        {/* Issues */}
        {[...pat.issues, ...pat.warnings].length > 0 && (
          <div className="space-y-2">
            {[...pat.issues, ...pat.warnings].map((issue, i) => (
              <div key={i} className={`p-3 rounded-xl border text-sm leading-relaxed ${ISSUE_LEVEL_STYLE[issue.level]}`}>
                {ISSUE_ICON[issue.level]} {issue.text}
              </div>
            ))}
          </div>
        )}

        {/* Pros */}
        <div>
          <p className="font-bold text-green-700 mb-2">メリット</p>
          <ul className="space-y-1">
            {pat.pros.map((p, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div>
          <p className="font-bold text-orange-700 mb-2">デメリット</p>
          <ul className="space-y-1">
            {pat.cons.map((c, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                <span className="text-orange-400 flex-shrink-0 mt-0.5">✗</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div>
          <p className="font-bold text-red-700 mb-2">申請上のリスク・注意点</p>
          <ul className="space-y-1">
            {pat.risks.map((r, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                <span className="text-red-400 flex-shrink-0 mt-0.5">!</span>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function ResultView({ answers, onRetry, navigate }) {
  const result = simulate(answers)
  const phrase = generateComparisonPhrase(answers, result)

  const recB = result.patternB.possibility === 'high' && result.patternA.possibility !== 'high'
  const recA = result.patternA.possibility === 'high' && !recB

  return (
    <div className="pt-5 space-y-5">
      <div className="card border-l-4 border-indigo-400">
        <p className="font-bold text-indigo-800 text-lg mb-3">シミュレーション結果</p>

        {/* Summary table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left text-gray-600 font-medium"></th>
                <th className="p-2 text-center text-indigo-700 font-bold">A案（同居）</th>
                <th className="p-2 text-center text-violet-700 font-bold">B案（別居）</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-2 text-gray-600">世帯人数</td>
                <td className="p-2 text-center font-medium">{result.patternA.householdSize}人</td>
                <td className="p-2 text-center font-medium">{result.patternB.householdSize}人</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2 text-gray-600">世帯月収（目安）</td>
                <td className="p-2 text-center font-medium">約{Math.round(result.patternA.totalIncome / 10000)}万円</td>
                <td className="p-2 text-center font-medium">約{Math.round(result.patternB.totalIncome / 10000)}万円</td>
              </tr>
              <tr>
                <td className="p-2 text-gray-600">最低生活費（目安）</td>
                <td className="p-2 text-center font-medium">約{Math.round(result.patternA.minLiving / 10000)}万円</td>
                <td className="p-2 text-center font-medium">約{Math.round(result.patternB.minLiving / 10000)}万円</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="p-2 text-gray-600">不足額（目安）</td>
                <td className={`p-2 text-center font-bold ${result.patternA.incomeGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {result.patternA.incomeGap > 0 ? `▲${Math.round(result.patternA.incomeGap / 10000)}万円` : '不足なし'}
                </td>
                <td className={`p-2 text-center font-bold ${result.patternB.incomeGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {result.patternB.incomeGap > 0 ? `▲${Math.round(result.patternB.incomeGap / 10000)}万円` : '不足なし'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-gray-400 mt-2">※ 最低生活費は地域・年齢・世帯状況によって異なります。目安としてご利用ください。</p>
      </div>

      {/* Pattern A */}
      <PatternCard
        title="A案：家族と同居"
        icon="👨‍👩‍👴"
        color="bg-indigo-50 text-indigo-800"
        result={result.patternA}
        isRecommended={recA}
      />

      {/* Pattern B */}
      <PatternCard
        title="B案：老夫婦のみ別居"
        icon="🏠"
        color="bg-violet-50 text-violet-800"
        result={result.patternB}
        isRecommended={recB}
      />

      {/* Mandatory disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl">
        <p className="text-sm text-amber-900 leading-relaxed font-medium">
          ⚠️ 生活保護費は地域、年齢、世帯人数、家賃、収入、資産、病気、介護状況によって変わります。このアプリの金額は目安であり、最終判断は福祉事務所が行います。
        </p>
      </div>

      {/* Comparison phrase */}
      <div className="card">
        <p className="font-bold text-indigo-800 mb-3">📝 福祉事務所への比較相談文</p>
        <div className="bg-indigo-50 rounded-xl p-4 mb-3">
          <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">{phrase}</p>
        </div>
        <CopyButton text={phrase} />
        <p className="text-xs text-gray-400 mt-2">
          この文章をコピーして、福祉事務所での相談の際にご活用ください。
        </p>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full btn-secondary py-4 text-lg"
        >
          入力内容を変えてやり直す
        </button>
        <button
          onClick={() => navigate('questionnaire')}
          className="w-full btn-primary py-4 text-lg"
        >
          生活保護かんたん診断へ →
        </button>
        <button
          onClick={() => navigate('housing')}
          className="w-full py-4 text-lg font-bold rounded-2xl border-2 border-teal-500 text-teal-700 bg-white active:bg-teal-50 transition-all"
        >
          住まい・転居相談ナビへ →
        </button>
      </div>
    </div>
  )
}

export default function LivingSimulator({ navigate }) {
  const [view, setView] = useState('intro')
  const [answers, setAnswers] = useState(null)

  const handleStart = () => setView('questionnaire')
  const handleComplete = (a) => {
    setAnswers(a)
    setView('result')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const handleRetry = () => {
    setView('questionnaire')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {view === 'intro' && <IntroView onStart={handleStart} />}
      {view === 'questionnaire' && <QuestionnaireView onComplete={handleComplete} />}
      {view === 'result' && answers && (
        <ResultView answers={answers} onRetry={handleRetry} navigate={navigate} />
      )}
    </>
  )
}
