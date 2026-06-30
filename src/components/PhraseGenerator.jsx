import { useState } from 'react'
import { generatePhrase } from '../utils/diagnosis'

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
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
    <button
      onClick={handleCopy}
      className={`px-5 py-3 rounded-xl font-bold text-base transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-sky-700 text-white'}`}
    >
      {copied ? '✓ コピー済み！' : '📋 文章をコピーする'}
    </button>
  )
}

export default function PhraseGenerator({ answers, navigate }) {
  const hasAnswers = answers && Object.keys(answers).length > 0
  const phrase = hasAnswers ? generatePhrase(answers) : null

  const fixedPhrases = [
    {
      scene: '最初に窓口へ行ったとき',
      phrase: '生活保護の申請をしたいです。申請書をください。',
    },
    {
      scene: '「まず相談を」と言われたとき',
      phrase: '相談ではなく、申請をしたいです。申請書の交付をお願いします。',
    },
    {
      scene: '「書類がないと申請できない」と言われたとき',
      phrase: '必要書類がそろっていない場合でも申請できると確認しています。不足書類は後日提出しますので、まず申請書を受け付けてください。',
    },
    {
      scene: '「同居家族がいるから無理」と言われたとき',
      phrase: '同居家族がいることは承知していますが、世帯の生活実態・収入・病気・介護負担を含めて正式に審査していただきたいです。申請書をください。',
    },
    {
      scene: '「親族に頼ってください」と言われたとき',
      phrase: '親族への確認があることは理解しています。ただし、親族がいることだけで申請できないとは考えていません。現在の生活が困窮しているため、正式に申請したいです。',
    },
  ]

  return (
    <div className="pt-5 space-y-5">
      {/* Personalized phrase */}
      {phrase ? (
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">✨</span>
            <h2 className="text-xl font-bold text-sky-800">あなた専用の申請文</h2>
          </div>
          <p className="text-sm text-gray-500 mb-3">診断結果をもとに自動生成しました。実際の状況に合わせて修正してください。</p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-3">
            <p className="text-base text-gray-800 leading-loose whitespace-pre-line">{phrase}</p>
          </div>
          <div className="flex flex-col gap-2">
            <CopyButton text={phrase} />
            <button
              onClick={() => window.print()}
              className="px-5 py-3 rounded-xl font-bold text-base border-2 border-gray-300 text-gray-600"
            >
              🖨️ 印刷する
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            ※ この文章はあくまで参考です。窓口の状況に合わせて適宜変更してください。
          </p>
        </div>
      ) : (
        <div className="card text-center space-y-4 py-8">
          <p className="text-xl">📋</p>
          <p className="text-lg font-bold text-gray-700">診断を先に行うと、あなた専用の申請文が作成されます</p>
          <button onClick={() => navigate('questionnaire')} className="btn-primary">
            かんたん診断を始める
          </button>
        </div>
      )}

      {/* Fixed phrases */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 px-1">場面別・すぐに使える返答文</h2>

        {fixedPhrases.map((item, i) => (
          <PhraseCard key={i} scene={item.scene} phrase={item.phrase} />
        ))}
      </div>

      {/* Key phrase highlight */}
      <div className="card border-2 border-sky-500">
        <p className="font-bold text-sky-800 text-lg mb-3">最重要のひとこと</p>
        <div className="bg-sky-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-sky-700">
            「申請書をください」
          </p>
        </div>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          何を言われても、最終的にはこの一言を繰り返しましょう。申請書を渡すことを拒否することは、福祉事務所には法律上できません。
        </p>
      </div>

      <div className="card bg-amber-50 border border-amber-200">
        <p className="font-bold text-amber-800 mb-2">📞 電話での相談窓口</p>
        <ul className="text-sm text-amber-900 space-y-1">
          <li>・<strong>生活保護の申請先</strong>：市区町村の福祉事務所（役所）</li>
          <li>・<strong>生活困窮者自立支援</strong>：住んでいる市区町村の相談窓口</li>
          <li>・<strong>NPO無料相談</strong>：「生活保護 無料相談 ＋地域名」で検索</li>
        </ul>
      </div>
    </div>
  )
}

function PhraseCard({ scene, phrase }) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phrase)
    } catch {
      const el = document.createElement('textarea')
      el.value = phrase
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between gap-2"
      >
        <p className="text-base font-bold text-gray-800">📍 {scene}</p>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
            <p className="text-base text-sky-900 leading-relaxed">{phrase}</p>
          </div>
          <button
            onClick={handleCopy}
            className={`w-full py-3 rounded-xl font-bold text-base transition-colors
              ${copied ? 'bg-green-500 text-white' : 'bg-sky-700 text-white'}`}
          >
            {copied ? '✓ コピーしました' : '📋 コピーする'}
          </button>
        </div>
      )}
    </div>
  )
}
