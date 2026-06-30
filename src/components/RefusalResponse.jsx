import { useState } from 'react'

const cases = [
  {
    id: 1,
    icon: '👨‍👩‍👧',
    title: '「同居家族がいるから無理」と言われた時',
    situation: '窓口で「同居の家族がいるので生活保護は受けられません」と言われた場合',
    response: `生活保護の申請意思があります。

同居家族がいることは承知していますが、世帯全体の生活実態、収入、病気、介護負担を含めて正式に審査していただきたいです。

同居家族がいることだけで申請不可とはならないと理解しています。正式な審査のために、申請書を提出したいので、申請書をください。`,
    notes: [
      '世帯の生活実態・収入を合わせて審査するよう求める',
      '「申請書をください」と明確に繰り返す',
      '断られた場合は「不支給決定通知書をください」と要求する',
    ],
  },
  {
    id: 2,
    icon: '👨‍👩‍👴',
    title: '「まず親族に頼ってください」と言われた時',
    situation: '「まず家族や親戚に援助をお願いしてください」と言われた場合',
    response: `親族への確認（扶養照会）があることは理解しています。

ただし、親族がいることだけで申請できないとは考えていません。現在の生活が困窮しており、親族からの継続的な援助を受けることが難しい状況です。

相談ではなく、正式に生活保護の申請をしたいです。申請書をください。`,
    notes: [
      '扶養照会は申請の条件ではない',
      '親族がいても申請できることを明確に伝える',
      '援助が難しい理由がある場合は後で説明する',
    ],
  },
  {
    id: 3,
    icon: '📄',
    title: '「書類がないと申請できない」と言われた時',
    situation: '「必要書類が揃っていないので申請できません」と言われた場合',
    response: `厚生労働省の案内では、必要書類がそろっていない場合でも生活保護の申請は可能と説明されています。

不足書類は後日提出いたしますので、まず申請書を受け付けてください。

申請書なしに申請を受け付けない対応は適切ではないと理解しています。申請書をください。`,
    notes: [
      '書類がなくても申請できることが厚労省の方針',
      '不足書類は後日提出でOKと伝える',
      '申請日さかのぼりのために今日申請することが重要',
    ],
  },
  {
    id: 4,
    icon: '💼',
    title: '「働けるから無理」と言われた時',
    situation: '「就労可能な年齢・状態なので、まず仕事を探してください」と言われた場合',
    response: `現在、仕事を探すことが困難な状況があります。

病気・障害・介護・高齢などの事情により、就労が難しい状態です。就労できない事情についても含めて、正式に審査していただきたいです。

生活が困窮しているため、申請書の交付をお願いします。`,
    notes: [
      '就労できない事情を具体的に伝える',
      '診断書や医師の意見があれば後日提出できる',
      '就労指導は申請後の話であり、申請自体は拒否できない',
    ],
  },
  {
    id: 5,
    icon: '🏠',
    title: '「持ち家があるから無理」と言われた時',
    situation: '「持ち家があるので生活保護は受けられません」と言われた場合',
    response: `持ち家がある場合でも、処分価値が低い場合や居住用の場合は申請できると理解しています。

まず正式な審査をしていただき、持ち家についての取り扱いは審査の中で判断していただきたいです。

申請書をください。審査の結果、問題があればその時点でご説明ください。`,
    notes: [
      '持ち家があっても申請できる場合がある',
      '居住用の持ち家は原則保有できる',
      '審査で判断するよう求める',
    ],
  },
  {
    id: 6,
    icon: '🚗',
    title: '「車があるから無理」と言われた時',
    situation: '「自動車を所有しているので申請できません」と言われた場合',
    response: `通院・介護のためにやむを得ず車が必要な状況です。

車の保有については審査の中で確認していただきたいです。まず正式な申請書を受け付けてください。

医療・介護上の必要性がある場合は車の保有が認められる場合があると理解しています。申請書をください。`,
    notes: [
      '通院・介護目的の車は例外として認められることがある',
      '公共交通機関が少ない地域では認められやすい',
      '審査で判断するよう求める',
    ],
  },
]

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
      className={`w-full py-3 rounded-xl font-bold text-base transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-sky-700 text-white'}`}
    >
      {copied ? '✓ コピーしました' : '📋 この返答文をコピーする'}
    </button>
  )
}

export default function RefusalResponse({ navigate }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="pt-5 space-y-5">
      {/* Header */}
      <div className="card border-l-4 border-orange-400">
        <h2 className="text-xl font-bold text-gray-800 mb-2">断られた時の対応</h2>
        <p className="text-base text-gray-600 leading-relaxed">
          窓口で断られても、諦めないでください。
          以下の返答文を使って、正式な申請を求めましょう。
        </p>
        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-xl">
          <p className="text-sm text-orange-800 font-medium">
            ⚖️ 申請書を渡さないことは「水際作戦」と呼ばれ、法律上問題のある行為です。
            「申請書をください」と繰り返し求める権利があります。
          </p>
        </div>
      </div>

      {/* Case list */}
      <div className="space-y-3">
        {cases.map((c) => {
          const isOpen = openId === c.id
          return (
            <div key={c.id} className="card">
              <button
                onClick={() => setOpenId(isOpen ? null : c.id)}
                className="w-full text-left"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl flex-shrink-0">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base text-gray-800">{c.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{c.situation}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform mt-0.5 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="mt-4 space-y-3">
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
                    <p className="text-xs text-sky-600 font-bold mb-2">💬 このように伝えましょう</p>
                    <p className="text-base text-sky-900 leading-loose whitespace-pre-line">{c.response}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-gray-700 mb-2">📌 ポイント</p>
                    <ul className="space-y-1">
                      {c.notes.map((note, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-sky-500 flex-shrink-0">▸</span>
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <CopyButton text={c.response} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Final escalation */}
      <div className="card bg-red-50 border border-red-200">
        <p className="font-bold text-red-800 text-base mb-2">🆘 それでも申請を受け付けてもらえない場合</p>
        <ul className="space-y-2 text-sm text-red-900">
          <li>・<strong>「不支給決定通知書をください」</strong>と書面での回答を求める</li>
          <li>・都道府県の審査請求窓口に申し立てる（決定から3か月以内）</li>
          <li>・生活保護問題対策全国会議・弁護士・NPOに相談する</li>
          <li>・「<strong>生活保護 無料相談</strong>＋お住まいの地域名」でNPOを検索</li>
        </ul>
      </div>

      <button
        onClick={() => navigate('knowledge')}
        className="btn-secondary w-full"
      >
        📖 制度の基礎知識を確認する
      </button>
    </div>
  )
}
