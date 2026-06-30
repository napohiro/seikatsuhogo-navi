const gradeColors = {
  A: 'bg-orange-50 border-orange-400 text-orange-700',
  B: 'bg-blue-50 border-blue-400 text-blue-700',
  C: 'bg-teal-50 border-teal-400 text-teal-700',
}

const gradeLabels = {
  A: '申請を急いだ方がよい',
  B: '申請可能性あり',
  C: '追加確認が必要',
}

export default function Home({ navigate, result }) {
  const menuItems = [
    {
      id: 'questionnaire',
      icon: '📋',
      label: 'かんたん診断を始める',
      desc: '生活状況を入力して、申請可能性を確認',
      color: 'bg-sky-700 text-white',
      main: true,
    },
    {
      id: 'checklist',
      icon: '✅',
      label: '申請準備チェックリスト',
      desc: '必要書類の準備状況を確認',
      color: 'bg-white text-sky-700 border-2 border-sky-700',
    },
    {
      id: 'phrases',
      icon: '💬',
      label: '窓口での伝え方',
      desc: '窓口で使える文章を確認・コピー',
      color: 'bg-white text-teal-700 border-2 border-teal-600',
    },
    {
      id: 'refusal',
      icon: '🛡️',
      label: '断られた時の対応',
      desc: '窓口で断られた時の返答文',
      color: 'bg-white text-orange-700 border-2 border-orange-500',
    },
    {
      id: 'knowledge',
      icon: '📖',
      label: '制度の基礎知識',
      desc: '生活保護制度をわかりやすく解説',
      color: 'bg-white text-gray-700 border-2 border-gray-400',
    },
    {
      id: 'housing',
      icon: '🏠',
      label: '住まい・転居相談ナビ',
      desc: '転居前に確認すべき家賃・初期費用・手順を整理',
      color: 'bg-white text-teal-700 border-2 border-teal-500',
    },
    {
      id: 'simulator',
      icon: '⚖️',
      label: '暮らし方比較シミュレーター',
      desc: '同居vs別居、どちらの申請パターンが現実的かを比較',
      color: 'bg-white text-indigo-700 border-2 border-indigo-500',
    },
    {
      id: 'household',
      icon: '🏘️',
      label: '世帯分離・同居相談ナビ',
      desc: '世帯分離・同居・別居の3パターンのリスクと注意点を整理',
      color: 'bg-white text-purple-700 border-2 border-purple-500',
    },
    {
      id: 'aimemo',
      icon: '🤖',
      label: 'AI相談メモ',
      desc: '状況を入力するだけで質問リスト・相談文・次のステップを作成',
      color: 'bg-white text-green-700 border-2 border-green-500',
    },
    {
      id: 'case',
      icon: '👨‍👩‍👴',
      label: 'モデルケースで学ぶ',
      desc: '高齢夫婦のモデル診断と申請アドバイス',
      color: 'bg-white text-gray-700 border-2 border-gray-400',
    },
  ]

  return (
    <div className="pt-5 space-y-5">
      {/* Main intro card */}
      <div className="card">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">🤝</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-sky-800">生活保護申請ナビとは</h2>
            <p className="text-sm text-gray-500 mt-0.5">あなたの準備を無料でサポートします</p>
          </div>
        </div>
        <p className="text-base text-gray-700 leading-relaxed">
          生活保護は、生活に困った人が使える公的制度です。
          このアプリは、生活保護を受けられるかを断定するものではありません。
          <strong className="text-sky-700">あなたの生活状況を整理し、申請に必要な準備と窓口で伝える内容</strong>
          をわかりやすく案内します。
        </p>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800 font-medium">
            🏠 緊急の場合（住む場所・食事・医療に困っている）は、すぐに自治体の福祉事務所へ相談してください。
          </p>
        </div>
      </div>

      {/* Saved result banner */}
      {result && (
        <button
          onClick={() => navigate('result')}
          className={`w-full text-left p-4 rounded-2xl border-2 ${gradeColors[result.grade]} shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">前回の診断結果</p>
              <p className="text-lg font-bold mt-0.5">
                {gradeLabels[result.grade]}
              </p>
            </div>
            <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      )}

      {/* Navigation menu */}
      <div className="space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`w-full text-left p-4 rounded-2xl shadow-sm flex items-center gap-4 ${item.color} ${item.main ? 'shadow-md' : ''}`}
          >
            <span className="text-3xl flex-shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg leading-tight">{item.label}</p>
              <p className={`text-sm mt-0.5 ${item.main ? 'text-sky-100' : 'text-gray-500'}`}>
                {item.desc}
              </p>
            </div>
            <svg className={`w-5 h-5 flex-shrink-0 ${item.main ? 'text-sky-200' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      {/* Important notice */}
      <div className="card border-l-4 border-sky-500">
        <p className="font-bold text-sky-800 mb-2">窓口での大切なひとこと</p>
        <div className="bg-sky-50 rounded-xl p-4">
          <p className="text-base font-bold text-sky-900">
            「相談したい」ではなく<br />
            <span className="text-xl text-sky-700">「申請したい」</span><br />
            と明確に伝えましょう
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          申請書を受け取る権利はすべての人にあります。「相談」だけで終わらせず、「申請書の交付をお願いします」と伝えてください。
        </p>
      </div>

      {/* Privacy notice */}
      <div className="p-4 bg-gray-100 rounded-2xl">
        <p className="text-sm text-gray-600 flex items-start gap-2">
          <span className="text-base flex-shrink-0">🔒</span>
          <span>入力した情報はこの端末のみに保存され、外部サーバーには一切送信されません。</span>
        </p>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
        <p className="text-xs text-gray-500 leading-relaxed">
          【免責事項】このアプリは行政判断を代替しません。生活保護の最終的な受給可否は、各自治体の福祉事務所が法律に基づいて判断します。本アプリの診断結果は参考情報であり、受給を保証するものではありません。緊急の場合はすぐに福祉事務所へご相談ください。
        </p>
      </div>
    </div>
  )
}
