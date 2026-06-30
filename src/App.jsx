import { useState } from 'react'
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
import { loadAnswers, saveAnswers, loadResult, saveResult } from './utils/storage'

export default function App() {
  const [page, setPage] = useState('home')
  const [answers, setAnswers] = useState(() => loadAnswers() || {})
  const [result, setResult] = useState(() => loadResult() || null)

  const navigate = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAnswersComplete = (newAnswers, diagnosisResult) => {
    setAnswers(newAnswers)
    setResult(diagnosisResult)
    saveAnswers(newAnswers)
    saveResult(diagnosisResult)
    navigate('result')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header page={page} navigate={navigate} />
      <main className="max-w-2xl mx-auto px-4 pb-20">
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
      </main>

      {/* Fixed footer disclaimer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 py-2 px-4 text-center no-print">
        <p className="text-xs text-gray-500">
          このアプリは行政判断を代替しません。入力情報は端末内にのみ保存されます。
        </p>
      </div>
    </div>
  )
}
