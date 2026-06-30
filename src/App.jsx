import { useState, useEffect } from 'react'
import Header from './components/Header'
import Home from './components/Home'
import Questionnaire from './components/Questionnaire'
import Result from './components/Result'
import Checklist from './components/Checklist'
import PhraseGenerator from './components/PhraseGenerator'
import RefusalResponse from './components/RefusalResponse'
import Knowledge from './components/Knowledge'
import CaseStudy from './components/CaseStudy'
import HousingNav from './components/HousingNav'
import LivingSimulator from './components/LivingSimulator'
import HouseholdNav from './components/HouseholdNav'
import AiMemo from './components/AiMemo'
import ApplicationFlow from './components/ApplicationFlow'
import BottomNav from './components/BottomNav'
import ConfirmDialog from './components/ConfirmDialog'
import { loadAnswers, saveAnswers, loadResult, saveResult, clearAll } from './utils/storage'

const FONT_MODES = ['normal', 'large', 'xlarge']

// 「次へ」ボタンの遷移先マップ
const NEXT_PAGE_MAP = {
  home:      { page: 'questionnaire', label: 'かんたん診断' },
  flow:      { page: 'checklist',     label: 'チェックリスト' },
  result:    { page: 'checklist',     label: 'チェックリスト' },
  checklist: { page: 'phrases',       label: '窓口の伝え方' },
  knowledge: { page: 'case',          label: 'モデルケース' },
}

export default function App() {
  const [page, setPage] = useState('home')
  const [pageHistory, setPageHistory] = useState([])
  const [answers, setAnswers] = useState(() => loadAnswers() || {})
  const [result, setResult] = useState(() => loadResult() || null)
  const [fontSizeMode, setFontSizeMode] = useState(
    () => localStorage.getItem('shnavi_fontsize') || 'normal'
  )
  const [showReset, setShowReset] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    html.classList.remove('font-mode-normal', 'font-mode-large', 'font-mode-xlarge')
    html.classList.add(`font-mode-${fontSizeMode}`)
    localStorage.setItem('shnavi_fontsize', fontSizeMode)
  }, [fontSizeMode])

  const toggleFontSize = () => {
    const next = FONT_MODES[(FONT_MODES.indexOf(fontSizeMode) + 1) % FONT_MODES.length]
    setFontSizeMode(next)
  }

  const navigateHome = () => {
    setPageHistory([])
    setPage('home')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigate = (newPage) => {
    if (newPage === page) return
    if (newPage === 'home') { navigateHome(); return }
    setPageHistory((prev) => [...prev, page])
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateBack = () => {
    if (pageHistory.length === 0) return
    const prev = pageHistory[pageHistory.length - 1]
    setPageHistory((h) => h.slice(0, -1))
    setPage(prev)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAnswersComplete = (newAnswers, diagnosisResult) => {
    setAnswers(newAnswers)
    setResult(diagnosisResult)
    saveAnswers(newAnswers)
    saveResult(diagnosisResult)
    navigate('result')
  }

  const resetAllData = () => {
    clearAll()
    localStorage.removeItem('shnavi_flow_done')
    setAnswers({})
    setResult(null)
    setShowReset(false)
    navigateHome()
  }

  const nextPageInfo = NEXT_PAGE_MAP[page] || null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        page={page}
        navigate={navigate}
        fontSizeMode={fontSizeMode}
        onToggleFontSize={toggleFontSize}
        onResetRequest={() => setShowReset(true)}
      />

      <main className="max-w-2xl mx-auto px-4 pb-28">
        <div key={page} className="animate-fade-in">
          {page === 'home' && (
            <Home navigate={navigate} result={result} />
          )}
          {page === 'questionnaire' && (
            <Questionnaire
              onComplete={handleAnswersComplete}
              initialAnswers={answers}
              navigate={navigate}
            />
          )}
          {page === 'result' && (
            <Result result={result} answers={answers} navigate={navigate} />
          )}
          {page === 'checklist' && (
            <Checklist navigate={navigate} />
          )}
          {page === 'phrases' && (
            <PhraseGenerator answers={answers} navigate={navigate} />
          )}
          {page === 'refusal' && (
            <RefusalResponse navigate={navigate} />
          )}
          {page === 'knowledge' && (
            <Knowledge navigate={navigate} />
          )}
          {page === 'case' && (
            <CaseStudy navigate={navigate} />
          )}
          {page === 'housing' && (
            <HousingNav navigate={navigate} />
          )}
          {page === 'simulator' && (
            <LivingSimulator navigate={navigate} />
          )}
          {page === 'household' && (
            <HouseholdNav navigate={navigate} />
          )}
          {page === 'aimemo' && (
            <AiMemo navigate={navigate} />
          )}
          {page === 'flow' && (
            <ApplicationFlow navigate={navigate} />
          )}
        </div>
      </main>

      <BottomNav
        isHome={page === 'home'}
        canGoBack={pageHistory.length > 0}
        onHome={navigateHome}
        onBack={navigateBack}
        onNext={nextPageInfo ? () => navigate(nextPageInfo.page) : null}
        nextLabel={nextPageInfo?.label || '次へ'}
        fontSizeMode={fontSizeMode}
        onToggleFontSize={toggleFontSize}
      />

      {showReset && (
        <ConfirmDialog
          title="本当に初期化しますか？"
          message="入力した診断内容・チェックリスト・AI相談メモ・申請ステップの進捗がすべて削除されます。この操作は元に戻せません。"
          confirmLabel="はい、初期化する"
          cancelLabel="キャンセル"
          onConfirm={resetAllData}
          onCancel={() => setShowReset(false)}
          danger
        />
      )}
    </div>
  )
}
