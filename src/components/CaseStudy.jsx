import { useState } from 'react'

const CASE_PHRASE = `生活保護の申請を希望します。

現在、脳梗塞・心筋梗塞・脊椎狭窄症などの病気があり、就労が困難な状態です。

収入は夫の年金が月約3万円程度で、妻には年金収入がありません。

現在は娘と同居していますが、娘自身も仕事や介護の負担が大きく、両親を継続的に扶養できる状況ではありません。

生活費・医療費・住居費の負担が厳しく、今後の生活維持が困難です。

相談ではなく、生活保護の申請をしたいです。申請書の交付をお願いします。`

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
      className={`px-5 py-3 rounded-xl font-bold text-base w-full transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-sky-700 text-white'}`}
    >
      {copied ? '✓ コピーしました' : '📋 この申請文をコピーする'}
    </button>
  )
}

export default function CaseStudy({ navigate }) {
  const [showPhrase, setShowPhrase] = useState(false)

  return (
    <div className="pt-5 space-y-5">
      {/* Header */}
      <div className="card border-l-4 border-teal-500">
        <h2 className="text-xl font-bold text-gray-800 mb-1">モデルケースで学ぶ</h2>
        <p className="text-sm text-gray-500">
          実際によくある状況を参考に、申請の流れをシミュレーションします。
        </p>
      </div>

      {/* Case description */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">👨‍👩‍👴</span>
          <div>
            <h3 className="font-bold text-lg text-gray-800">ケース：高齢夫婦のモデル</h3>
            <p className="text-sm text-gray-500">80代夫婦、娘と同居</p>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { label: '夫', detail: '80代　脳梗塞・心筋梗塞・脊椎狭窄症', icon: '👴' },
            { label: '妻', detail: '80代　年金なし、介護が必要', icon: '👵' },
            { label: '月収入', detail: '夫の年金：月約3万円のみ', icon: '💴' },
            { label: '同居', detail: '娘（病院勤務）と3人暮らし', icon: '👩' },
            { label: '娘の状況', detail: '介護・生活のダブル負担で余裕なし', icon: '⚕️' },
            { label: '検討中', detail: '親夫婦だけの別居（転居）も検討', icon: '🏠' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <span className="text-sm text-gray-500 font-medium">{item.label}</span>
                <p className="text-base text-gray-800">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Diagnosis result for this case */}
      <div className="bg-orange-50 border-2 border-orange-400 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="text-xs text-orange-600 font-bold">このケースの判定</p>
            <p className="text-xl font-bold text-orange-700">申請を急いだ方がよい</p>
          </div>
        </div>
        <ul className="space-y-1 text-sm text-orange-800">
          <li>🔴 収入（月3万円）が最低生活費を大きく下回っています</li>
          <li>🔴 夫に就労困難な複数の病気があります</li>
          <li>🔴 妻に収入がなく、介護が必要な状態です</li>
          <li>🟡 同居の娘から継続的な扶養が難しい状況です</li>
        </ul>
      </div>

      {/* Advice */}
      <div className="card">
        <h3 className="font-bold text-lg text-gray-800 mb-3">💡 このケースへのアドバイス</h3>
        <div className="space-y-4 text-base text-gray-700 leading-relaxed">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="font-bold text-blue-800 mb-1">同居の娘さんについて</p>
            <p>
              同居している娘さんの収入や生活実態は確認される可能性があります。
              ただし、娘さんがいることだけで申請不可とは限りません。
            </p>
          </div>

          <div className="bg-teal-50 rounded-xl p-4">
            <p className="font-bold text-teal-800 mb-1">整理しておくこと</p>
            <ul className="space-y-1">
              <li>▸ 娘さんが継続的に扶養できない事情（仕事・介護負担など）</li>
              <li>▸ 夫の病気・就労不能の状態</li>
              <li>▸ 妻の介護状態・収入がない理由</li>
              <li>▸ 夫の年金3万円だけでは生活できないこと</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl p-4">
            <p className="font-bold text-amber-800 mb-1">別居を検討している場合</p>
            <p>
              別居する場合は、転居前に住宅扶助の上限や初期費用（敷金・礼金など）の扱いを
              福祉事務所に確認してください。
              転居後に申請すると、住宅費用の負担が大きくなる場合があります。
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-bold text-gray-800 mb-1">申請のタイミング</p>
            <p>
              今の生活状況（収入3万円のみ、複数の重病）は申請要件を満たしている可能性が高いです。
              娘さんや別居の問題が解決する前でも、正式な申請を行い、審査を受けることが重要です。
            </p>
          </div>
        </div>
      </div>

      {/* Sample phrase */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-800">💬 このケースの申請文例</h3>
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
              <p className="text-base text-gray-800 leading-loose whitespace-pre-line">{CASE_PHRASE}</p>
            </div>
            <CopyButton text={CASE_PHRASE} />
            <p className="text-xs text-gray-400">※ 実際の状況に合わせて修正してください</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">「表示する」をタップして確認できます</p>
        )}
      </div>

      {/* Required docs for this case */}
      <div className="card">
        <h3 className="font-bold text-lg text-gray-800 mb-3">📄 このケースで準備する書類</h3>
        <div className="space-y-2 text-base text-gray-700">
          {[
            { label: '夫婦それぞれの本人確認書類', note: 'マイナンバーカード・健康保険証など', must: true },
            { label: '夫の年金振込通知書', note: '受け取っている年金額がわかるもの', must: true },
            { label: '夫婦の通帳（直近2〜3か月）', note: '収入・残高の確認用', must: true },
            { label: '夫の診察券・診断書', note: '病名・就労制限がわかるもの', must: false },
            { label: 'お薬手帳', note: '服薬中の薬の確認', must: false },
            { label: '賃貸契約書（賃貸の場合）', note: '別居後の申請なら必須', must: false },
            { label: '印鑑', note: '認印で可', must: true },
          ].map((doc, i) => (
            <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-100 last:border-0">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5
                ${doc.must ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}
              >
                {doc.must ? '必須' : '推奨'}
              </span>
              <div>
                <p className="font-medium text-gray-800">{doc.label}</p>
                <p className="text-sm text-gray-500">{doc.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
        <p className="text-xs text-gray-500 leading-relaxed">
          このモデルケースは参考情報です。実際の申請可否は各自治体の福祉事務所が個別に判断します。状況が類似している場合も、必ず窓口でご相談ください。
        </p>
      </div>

      <button onClick={() => navigate('questionnaire')} className="btn-primary w-full">
        📋 自分の状況で診断する
      </button>
    </div>
  )
}
