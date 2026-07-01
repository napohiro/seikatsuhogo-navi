const FONT_LABELS = { normal: 'ふつう', large: '大きく', xlarge: '特大' }

export default function Home({ navigate, result, onResetRequest, fontSizeMode, onToggleFontSize }) {
  return (
    <div className="pt-5 space-y-5 pb-6">

      {/* App intro */}
      <div className="text-center pb-1">
        <p className="text-xl font-bold text-gray-800 leading-snug">生活のことでお困りの方へ</p>
        <p className="text-base text-gray-500 mt-1 leading-relaxed">
          次にすることをいっしょに確認します
        </p>
      </div>

      {/* 3 main big buttons */}
      <div className="space-y-4">
        <button
          onClick={() => navigate('questionnaire')}
          style={{ minHeight: '80px' }}
          className="w-full bg-sky-600 text-white rounded-2xl px-5 py-5 text-left shadow-md active:opacity-90 transition-opacity flex items-start gap-4"
        >
          <span className="text-3xl flex-shrink-0 mt-0.5">🔍</span>
          <div>
            <p className="text-xl font-bold leading-snug">いま困っていることを確認する</p>
            <p className="text-sm text-sky-100 mt-1 leading-relaxed">
              生活状況を答えて、次にすることを確認します
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate('flow')}
          style={{ minHeight: '80px' }}
          className="w-full bg-sky-600 text-white rounded-2xl px-5 py-5 text-left shadow-md active:opacity-90 transition-opacity flex items-start gap-4"
        >
          <span className="text-3xl flex-shrink-0 mt-0.5">📂</span>
          <div>
            <p className="text-xl font-bold leading-snug">申請の準備をする</p>
            <p className="text-sm text-sky-100 mt-1 leading-relaxed">
              必要なもの・窓口で言うことを確認します
            </p>
          </div>
        </button>

        <button
          onClick={() => navigate('familysupport')}
          style={{ minHeight: '80px' }}
          className="w-full bg-sky-600 text-white rounded-2xl px-5 py-5 text-left shadow-md active:opacity-90 transition-opacity flex items-start gap-4"
        >
          <span className="text-3xl flex-shrink-0 mt-0.5">👨‍👩‍👧</span>
          <div>
            <p className="text-xl font-bold leading-snug">家族・支援者向け</p>
            <p className="text-sm text-sky-100 mt-1 leading-relaxed">
              娘さんと同居している場合など、くわしく確認します
            </p>
          </div>
        </button>
      </div>

      {/* Previous result shortcut */}
      {result && (
        <button
          onClick={() => navigate('result')}
          className="w-full bg-amber-50 border-2 border-amber-400 rounded-2xl px-5 py-4 text-left active:opacity-80 flex items-center gap-3"
          style={{ minHeight: '64px' }}
        >
          <span className="text-2xl flex-shrink-0">📋</span>
          <div className="flex-1">
            <p className="text-base font-bold text-amber-800">前回の診断結果を見る</p>
            <p className="text-sm text-amber-600 mt-0.5">タップして確認できます</p>
          </div>
          <svg className="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Rights reminder */}
      <div className="bg-sky-700 rounded-2xl p-5 text-center">
        <p className="text-white font-bold text-lg leading-snug">生活保護は、誰でも申請できます</p>
        <p className="text-sky-200 text-sm mt-2 leading-relaxed">
          断られても「申請書をください」と言う権利があります
        </p>
      </div>

      {/* Small secondary buttons */}
      <div className="space-y-3">
        <p className="text-sm text-gray-400 text-center font-medium">その他の操作</p>

        <button
          onClick={() => navigate('history')}
          className="w-full border-2 border-gray-300 text-gray-700 rounded-2xl py-4 px-5 text-base font-medium active:opacity-70 transition-opacity"
          style={{ minHeight: '60px' }}
        >
          入力内容を確認・修正する
        </button>

        <button
          onClick={onToggleFontSize}
          className="w-full border-2 border-gray-300 text-gray-700 rounded-2xl py-4 px-5 text-base font-medium active:opacity-70 transition-opacity"
          style={{ minHeight: '60px' }}
        >
          文字を大きくする（現在：{FONT_LABELS[fontSizeMode] || 'ふつう'}）
        </button>

        <button
          onClick={onResetRequest}
          className="w-full border-2 border-red-200 text-red-600 rounded-2xl py-4 px-5 text-base font-medium active:opacity-70 transition-opacity"
          style={{ minHeight: '60px' }}
        >
          データを初期化する
        </button>
      </div>

      {/* Privacy notice */}
      <p className="text-xs text-gray-400 text-center pb-2 leading-relaxed">
        🔒 入力した情報はこの端末のみに保存されます
      </p>
    </div>
  )
}
