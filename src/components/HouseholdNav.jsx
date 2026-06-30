import { useState } from 'react'
import { householdQuestions } from '../data/householdQuestions'
import { diagnoseHousehold, generateHouseholdPhrase } from '../utils/householdDiagnosis'
import { saveHousehold } from '../utils/storage'

const ISSUE_LEVEL_STYLE = {
  critical: 'bg-red-50 border-red-300 text-red-800',
  warn: 'bg-yellow-50 border-yellow-300 text-yellow-800',
  check: 'bg-blue-50 border-blue-200 text-blue-800',
  ok: 'bg-green-50 border-green-200 text-green-800',
  info: 'bg-gray-50 border-gray-200 text-gray-700',
}

const ISSUE_ICON = {
  critical: '🚨',
  warn: '⚠️',
  check: '✅',
  ok: '✅',
  info: 'ℹ️',
}

const PATTERN_CONFIG = {
  A: { label: 'A案：同居のまま申請', icon: '👨‍👩‍👴', color: 'bg-sky-50 text-sky-800 border-sky-300' },
  B: { label: 'B案：住民票上の世帯分離をして申請', icon: '📄', color: 'bg-yellow-50 text-yellow-800 border-yellow-300' },
  C: { label: 'C案：老夫婦のみ別居して申請', icon: '🏠', color: 'bg-teal-50 text-teal-800 border-teal-300' },
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
          : 'bg-white text-purple-700 border-purple-500 active:bg-purple-50'
      }`}
    >
      {copied ? '✅ コピーしました' : '📋 相談文をコピー'}
    </button>
  )
}

function IntroView({ onStart }) {
  return (
    <div className="pt-5 space-y-5">
      <div className="card">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🏘️</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-purple-800">世帯分離・同居相談ナビ</h2>
            <p className="text-sm text-gray-500 mt-0.5">同居・世帯分離・別居、どれが現実的かを整理</p>
          </div>
        </div>
        <p className="text-base text-gray-700 leading-relaxed">
          生活保護申請において「<strong className="text-purple-700">同居のまま申請</strong>」「<strong className="text-purple-700">住民票上の世帯分離をして申請</strong>」「<strong className="text-purple-700">老夫婦のみ別居して申請</strong>」の3パターンについて、あなたの状況からリスクと注意点を整理します。
        </p>
      </div>

      <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl">
        <p className="font-bold text-red-800 mb-2">⚠️ 重要な注意</p>
        <ul className="space-y-2">
          {[
            '住民票を分けるだけで生活保護が通るとは限りません',
            '生活保護では住民票でなく、実際の生活実態（食費・光熱費・通帳・食事・生活空間）が確認されます',
            '生活実態と異なる申告は不正受給とみなされるリスクがあります',
            '世帯分離や転居は、必ず福祉事務所へ事前相談してから進めてください',
          ].map((t, i) => (
            <li key={i} className="text-sm text-red-800 flex items-start gap-1.5">
              <span className="flex-shrink-0">・</span>{t}
            </li>
          ))}
        </ul>
      </div>

      <div className="card space-y-3">
        <p className="font-bold text-gray-800">このナビでわかること</p>
        {[
          { icon: '🏠', text: '3パターンの申請可能性とリスク比較' },
          { icon: '📋', text: '生活実態（食費・通帳・生活空間）の自己チェック' },
          { icon: '⚠️', text: '世帯分離が認められるための条件の整理' },
          { icon: '💬', text: '福祉事務所への世帯分離相談文の自動生成' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            <p className="text-base text-gray-700">{item.text}</p>
          </div>
        ))}
      </div>

      <button onClick={onStart} className="w-full py-5 text-xl font-bold rounded-2xl bg-purple-600 text-white active:bg-purple-700">
        相談内容の入力を始める →
      </button>
    </div>
  )
}

function QuestionnaireView({ onComplete, initialAnswers }) {
  const [answers, setAnswers] = useState(initialAnswers || {})
  const [currentIndex, setCurrentIndex] = useState(0)

  const visibleQuestions = householdQuestions.filter((q) => {
    if (q.showIf && !q.showIf(answers)) return false
    return true
  })

  const currentQ = visibleQuestions[currentIndex]
  const progress = Math.round((currentIndex / visibleQuestions.length) * 100)

  const handleAnswer = (qId, value) => setAnswers((prev) => ({ ...prev, [qId]: value }))

  const handleCheckbox = (qId, value, checked) => {
    setAnswers((prev) => {
      const current = Array.isArray(prev[qId]) ? prev[qId] : []
      if (checked) return { ...prev, [qId]: [...current, value] }
      return { ...prev, [qId]: current.filter((v) => v !== value) }
    })
  }

  const canProceed = () => {
    if (!currentQ) return false
    const val = answers[currentQ.id]
    if (currentQ.type === 'checkbox') return Array.isArray(val) && val.length > 0
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

  if (!currentQ) return null

  return (
    <div className="pt-5 space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>質問 {currentIndex + 1} / {visibleQuestions.length}</span>
          <span className="text-purple-600 font-medium">{currentQ.section}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="card">
        <p className="text-xl font-bold text-gray-800 leading-snug mb-2">{currentQ.question}</p>
        {currentQ.hint && <p className="text-sm text-gray-500 mb-4">{currentQ.hint}</p>}

        {currentQ.type === 'radio' && (
          <div className="space-y-2">
            {currentQ.options.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  answers[currentQ.id] === opt.value
                    ? 'bg-purple-50 border-purple-500 text-purple-800'
                    : 'border-gray-200 text-gray-700 hover:border-purple-300'
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
                  answers[currentQ.id] === opt.value ? 'border-purple-500 bg-purple-500' : 'border-gray-400'
                }`}>
                  {answers[currentQ.id] === opt.value && <span className="w-2 h-2 bg-white rounded-full" />}
                </span>
                <span className="text-base">{opt.label}</span>
              </label>
            ))}
          </div>
        )}

        {currentQ.type === 'checkbox' && (
          <div className="space-y-2">
            {currentQ.options.map((opt) => {
              const checked = Array.isArray(answers[currentQ.id]) && answers[currentQ.id].includes(opt.value)
              return (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    checked ? 'bg-purple-50 border-purple-500 text-purple-800' : 'border-gray-200 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => handleCheckbox(currentQ.id, opt.value, e.target.checked)}
                    className="sr-only"
                  />
                  <span className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                    checked ? 'border-purple-500 bg-purple-500' : 'border-gray-400'
                  }`}>
                    {checked && <span className="text-white text-xs font-bold">✓</span>}
                  </span>
                  <span className="text-base">{opt.label}</span>
                </label>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {currentIndex > 0 && (
          <button onClick={handleBack} className="flex-1 btn-secondary py-4 text-lg">← 戻る</button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex-1 py-4 text-lg font-bold rounded-2xl transition-all ${
            canProceed() ? 'bg-purple-600 text-white active:bg-purple-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentIndex < visibleQuestions.length - 1 ? '次へ →' : '結果を見る →'}
        </button>
      </div>
    </div>
  )
}

function PatternSection({ pattern, issues, isRecommended }) {
  const config = PATTERN_CONFIG[pattern]
  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${isRecommended ? 'border-purple-400' : 'border-gray-200'}`}>
      {isRecommended && (
        <div className="bg-purple-600 text-white text-center py-1.5 text-sm font-bold">
          ★ 福祉事務所への相談を特におすすめするパターン
        </div>
      )}
      <div className={`p-4 flex items-center gap-2 border-b ${config.color}`}>
        <span className="text-2xl">{config.icon}</span>
        <p className="font-bold text-base">{config.label}</p>
      </div>
      <div className="p-4 space-y-2">
        {issues.map((issue, i) => (
          <div key={i} className={`p-3 rounded-xl border text-sm leading-relaxed ${ISSUE_LEVEL_STYLE[issue.level]}`}>
            {ISSUE_ICON[issue.level]} {issue.text}
          </div>
        ))}
      </div>
    </div>
  )
}

// 生活実態スコア表示
function SeparationScoreCard({ answers }) {
  const items = [
    { label: '食費', key: 'foodSeparate', yes: 'yes', partial: 'partial' },
    { label: '家計・通帳', key: 'bankSeparate', yes: 'yes', partial: 'partial' },
    { label: '食事', key: 'mealSeparate', yes: 'yes', partial: 'partial' },
    { label: '生活空間', key: 'spaceSeparate', yes: 'yes', partial: 'partial' },
  ]

  const getSeparation = (key, yes, partial) => {
    const v = answers[key]
    if (v === yes) return 'separate'
    if (v === partial) return 'partial'
    return 'together'
  }

  const separateCount = items.filter(i => getSeparation(i.key, i.yes, i.partial) === 'separate').length

  return (
    <div className="card">
      <p className="font-bold text-purple-800 mb-3">生活実態チェック結果</p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {items.map((item) => {
          const status = getSeparation(item.key, item.yes, item.partial)
          return (
            <div key={item.key} className={`p-3 rounded-xl text-center text-sm font-medium ${
              status === 'separate' ? 'bg-green-100 text-green-700' :
              status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              <p className="text-xs mb-0.5">{item.label}</p>
              <p>{status === 'separate' ? '● 別' : status === 'partial' ? '△ 一部別' : '× 共用'}</p>
            </div>
          )
        })}
      </div>
      <div className={`p-3 rounded-xl text-center font-bold ${
        separateCount >= 3 ? 'bg-green-50 text-green-700' :
        separateCount >= 2 ? 'bg-yellow-50 text-yellow-700' :
        'bg-red-50 text-red-700'
      }`}>
        {separateCount >= 3
          ? '生活実態がある程度分かれています（ただし福祉事務所の判断が必要）'
          : separateCount >= 2
          ? '一部分かれていますが、さらに独立させる必要があります'
          : '生活実態が一体とみなされる可能性が高いです'}
      </div>
    </div>
  )
}

function ResultView({ answers, onRetry, navigate }) {
  const result = diagnoseHousehold(answers)
  const phrase = generateHouseholdPhrase(answers, result)

  return (
    <div className="pt-5 space-y-5">
      {/* Global warnings */}
      <div className="p-4 bg-red-50 border-2 border-red-300 rounded-2xl">
        <p className="font-bold text-red-800 mb-2">⚠️ 必ず確認してください</p>
        <ul className="space-y-1">
          {result.globalWarnings.map((w, i) => (
            <li key={i} className="text-sm text-red-800 flex items-start gap-1.5">
              <span className="flex-shrink-0">!</span>{w}
            </li>
          ))}
        </ul>
      </div>

      {/* Living situation check */}
      {result.hasFam && <SeparationScoreCard answers={answers} />}

      {/* Pattern A */}
      <PatternSection pattern="A" issues={result.issuesA} isRecommended={result.recommended === 'A'} />

      {/* Pattern B */}
      <PatternSection pattern="B" issues={result.issuesB} isRecommended={result.recommended === 'B'} />

      {/* Pattern C */}
      <PatternSection pattern="C" issues={result.issuesC} isRecommended={result.recommended === 'C'} />

      {/* Mandatory disclaimer */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl">
        <p className="text-sm text-amber-900 leading-relaxed font-medium">
          ⚠️ このナビの判定はあくまで目安です。生活保護の受給可否・世帯の扱いは、福祉事務所が実際の生活実態を調査した上で判断します。このアプリは行政判断を代替しません。
        </p>
      </div>

      {/* Consultation phrase */}
      <div className="card">
        <p className="font-bold text-purple-800 mb-3">📝 福祉事務所への世帯分離相談文</p>
        <div className="bg-purple-50 rounded-xl p-4 mb-3">
          <p className="text-base text-gray-800 leading-relaxed whitespace-pre-line">{phrase}</p>
        </div>
        <CopyButton text={phrase} />
        <p className="text-xs text-gray-400 mt-2">
          この文章をコピーして、福祉事務所の相談でご活用ください。
        </p>
      </div>

      {/* Navigation */}
      <div className="space-y-3">
        <button onClick={onRetry} className="w-full btn-secondary py-4 text-lg">入力内容を変えてやり直す</button>
        <button onClick={() => navigate('simulator')} className="w-full py-4 text-lg font-bold rounded-2xl border-2 border-indigo-500 text-indigo-700 bg-white active:bg-indigo-50 transition-all">
          暮らし方比較シミュレーターへ →
        </button>
        <button onClick={() => navigate('housing')} className="w-full py-4 text-lg font-bold rounded-2xl border-2 border-teal-500 text-teal-700 bg-white active:bg-teal-50 transition-all">
          住まい・転居相談ナビへ →
        </button>
      </div>
    </div>
  )
}

export default function HouseholdNav({ navigate, startView = 'intro', initialAnswers = null }) {
  const [view, setView] = useState(
    startView === 'questionnaire' || startView === 'result' ? startView : 'intro'
  )
  const [answers, setAnswers] = useState(initialAnswers)

  const handleStart = () => setView('questionnaire')
  const handleComplete = (a) => {
    setAnswers(a)
    saveHousehold(a)
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
      {view === 'questionnaire' && (
        <QuestionnaireView onComplete={handleComplete} initialAnswers={answers} />
      )}
      {view === 'result' && answers && (
        <ResultView answers={answers} onRetry={handleRetry} navigate={navigate} />
      )}
    </>
  )
}
