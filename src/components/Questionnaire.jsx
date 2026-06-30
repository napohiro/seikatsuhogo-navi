import { useState } from 'react'
import { questions } from '../data/questions'
import { diagnose } from '../utils/diagnosis'

function shouldShow(q, answers) {
  if (q.skipIf && q.skipIf(answers)) return false
  if (q.showIf && !q.showIf(answers)) return false
  return true
}

function getVisibleQuestions(answers) {
  return questions.filter((q) => shouldShow(q, answers))
}

export default function Questionnaire({ onComplete, initialAnswers, navigate }) {
  const [answers, setAnswers] = useState(initialAnswers || {})
  const [currentIndex, setCurrentIndex] = useState(0)

  const visible = getVisibleQuestions(answers)
  const current = visible[currentIndex]
  const total = visible.length
  const progress = Math.round(((currentIndex) / total) * 100)

  const isLastQuestion = currentIndex === visible.length - 1

  const handleTextChange = (value) => {
    setAnswers((prev) => ({ ...prev, [current.id]: value }))
  }

  const handleRadioChange = (value) => {
    const newAnswers = { ...answers, [current.id]: value }
    setAnswers(newAnswers)
  }

  const handleCheckboxChange = (value) => {
    const current_ = answers[current.id] || []
    const updated = current_.includes(value)
      ? current_.filter((v) => v !== value)
      : [...current_, value]
    setAnswers((prev) => ({ ...prev, [current.id]: updated }))
  }

  const canProceed = () => {
    if (!current) return false
    if (current.required === false) return true
    if (current.type === 'text') return true
    if (current.type === 'radio') return !!answers[current.id]
    if (current.type === 'checkbox') return true
    return true
  }

  const handleNext = () => {
    if (!canProceed()) return

    const newVisible = getVisibleQuestions(answers)

    if (currentIndex < newVisible.length - 1) {
      setCurrentIndex(currentIndex + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      const result = diagnose(answers)
      onComplete(answers, result)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (!current) return null

  const currentAnswer = answers[current.id]

  return (
    <div className="pt-5 space-y-4">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-500">
          <span>{current.section}</span>
          <span>{currentIndex + 1} / {total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-sky-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="card">
        <p className="text-xl font-bold text-gray-800 leading-relaxed whitespace-pre-line mb-1">
          {current.question}
        </p>
        {current.hint && (
          <p className="text-sm text-gray-500 mt-1 mb-3">{current.hint}</p>
        )}

        <div className="mt-4 space-y-2">
          {current.type === 'text' && (
            <input
              type="text"
              value={currentAnswer || ''}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={current.placeholder}
              className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-sky-500 bg-gray-50"
              autoFocus
            />
          )}

          {current.type === 'radio' && current.options.map((opt) => {
            const selected = currentAnswer === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => handleRadioChange(opt.value)}
                className={`w-full text-left px-4 py-4 rounded-xl border-2 text-lg font-medium transition-colors
                  ${selected
                    ? 'bg-sky-600 border-sky-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-sky-400'
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                    ${selected ? 'border-white' : 'border-gray-400'}`}
                  >
                    {selected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </span>
                  {opt.label}
                </span>
              </button>
            )
          })}

          {current.type === 'checkbox' && current.options.map((opt) => {
            const selected = (currentAnswer || []).includes(opt.value)
            return (
              <button
                key={opt.value}
                onClick={() => handleCheckboxChange(opt.value)}
                className={`w-full text-left px-4 py-4 rounded-xl border-2 text-lg font-medium transition-colors
                  ${selected
                    ? 'bg-sky-600 border-sky-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-sky-400'
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-lg border-2 flex-shrink-0 flex items-center justify-center
                    ${selected ? 'border-white bg-white' : 'border-gray-400'}`}
                  >
                    {selected && (
                      <svg className="w-3 h-3 text-sky-600" fill="currentColor" viewBox="0 0 12 12">
                        <path d="M10 3L5 8.5 2 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                    )}
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

      {/* Navigation buttons */}
      <div className="flex gap-3">
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="flex-1 btn-secondary py-4 text-lg"
          >
            ← 前の質問
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-md transition-all
            ${canProceed()
              ? 'bg-sky-700 text-white active:scale-95'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          {isLastQuestion ? '診断結果を見る →' : '次の質問 →'}
        </button>
      </div>

      {/* Skip option for optional questions */}
      {current.required === false && !currentAnswer && (
        <button
          onClick={handleNext}
          className="w-full text-center text-gray-400 text-base py-2 underline"
        >
          この質問をスキップする
        </button>
      )}

      {/* Cancel */}
      <button
        onClick={() => navigate('home')}
        className="w-full text-center text-gray-400 text-sm py-2"
      >
        中断してトップに戻る
      </button>
    </div>
  )
}
