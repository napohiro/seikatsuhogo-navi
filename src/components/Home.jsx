import { welfareOffices } from '../data/localData'
import { GlossaryTerm, GlossaryList } from './GlossaryTooltip'

const GRADE_COLORS = {
  A: 'bg-orange-50 border-orange-400 text-orange-700',
  B: 'bg-sky-50 border-sky-400 text-sky-700',
  C: 'bg-teal-50 border-teal-400 text-teal-700',
}
const GRADE_LABELS = {
  A: '申請を急いだ方がよい',
  B: '申請可能性あり',
  C: '追加確認が必要',
}

const CATEGORIES = [
  {
    id: 'check',
    emoji: '🔍',
    label: 'まず確認する',
    desc: '申請可能性・同居・世帯分離を確認する',
    headerBg: 'bg-sky-600',
    bodyBg: 'bg-sky-50',
    mainBtn: 'bg-sky-600 text-white',
    subBtn: 'bg-white text-sky-800 border border-sky-200',
    subDesc: 'text-sky-600',
    items: [
      { id: 'questionnaire', icon: '📋', label: 'かんたん診断', desc: '申請可能性を今すぐ確認', main: true },
      { id: 'simulator', icon: '⚖️', label: '暮らし方比較シミュレーター', desc: '同居・別居パターンを比較' },
      { id: 'household', icon: '🏘️', label: '世帯分離・同居相談ナビ', desc: '世帯分離・別居の3パターンを整理' },
    ],
  },
  {
    id: 'prepare',
    emoji: '📂',
    label: '申請の準備をする',
    desc: '書類・ステップ・窓口対応を準備する',
    headerBg: 'bg-emerald-600',
    bodyBg: 'bg-emerald-50',
    mainBtn: 'bg-emerald-600 text-white',
    subBtn: 'bg-white text-emerald-800 border border-emerald-200',
    subDesc: 'text-emerald-600',
    items: [
      { id: 'flow', icon: '📍', label: '申請ステップガイド', desc: '今日やること・次にやることを確認', main: true },
      { id: 'checklist', icon: '✅', label: '申請準備チェックリスト', desc: '必要書類の準備状況を確認' },
      { id: 'housing', icon: '🏠', label: '住まい・転居相談ナビ', desc: '家賃・初期費用・住宅扶助の確認' },
      { id: 'refusal', icon: '🛡️', label: '断られた時の対応', desc: '窓口で断られた時の返答文' },
    ],
  },
  {
    id: 'consult',
    emoji: '💬',
    label: '相談文を作る',
    desc: '福祉事務所に伝える文章を自動作成',
    headerBg: 'bg-violet-600',
    bodyBg: 'bg-violet-50',
    mainBtn: 'bg-violet-600 text-white',
    subBtn: 'bg-white text-violet-800 border border-violet-200',
    subDesc: 'text-violet-600',
    items: [
      { id: 'aimemo', icon: '🤖', label: 'AI相談メモ', desc: '状況を整理して質問リスト・相談文を作成', main: true },
      { id: 'phrases', icon: '💬', label: '窓口での伝え方', desc: '申請時に使える文章をコピー' },
    ],
  },
  {
    id: 'learn',
    emoji: '📖',
    label: 'もっと知る',
    desc: '制度の仕組みとモデルケースを学ぶ',
    headerBg: 'bg-slate-500',
    bodyBg: 'bg-slate-50',
    mainBtn: 'bg-slate-500 text-white',
    subBtn: 'bg-white text-slate-700 border border-slate-200',
    subDesc: 'text-slate-500',
    items: [
      { id: 'knowledge', icon: '📖', label: '制度の基礎知識', desc: '生活保護制度をわかりやすく解説' },
      { id: 'case', icon: '👨‍👩‍👴', label: 'モデルケースで学ぶ', desc: '高齢夫婦のモデル診断と申請アドバイス' },
    ],
  },
]

function CategorySection({ cat, navigate }) {
  return (
    <div>
      <div className={`${cat.headerBg} rounded-t-2xl px-5 py-4`}>
        <p className="font-bold text-xl text-white">
          {cat.emoji} {cat.label}
        </p>
        <p className="text-sm text-white opacity-80 mt-0.5">{cat.desc}</p>
      </div>
      <div className={`${cat.bodyBg} rounded-b-2xl px-3 pb-3 pt-2 space-y-2`}>
        {cat.items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.id)}
            className={`w-full text-left p-4 rounded-xl shadow-sm flex items-center gap-4 active:opacity-80 transition-opacity ${
              item.main ? cat.mainBtn : cat.subBtn
            }`}
          >
            <span className="text-2xl flex-shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-lg leading-tight">{item.label}</p>
              <p className={`text-sm mt-0.5 ${item.main ? 'opacity-75' : cat.subDesc}`}>
                {item.desc}
              </p>
            </div>
            <svg className="w-5 h-5 flex-shrink-0 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function Home({ navigate, result }) {
  const sampleOffice = welfareOffices[0]

  return (
    <div className="pt-5 space-y-6 pb-6">

      {/* Rights banner — 最重要メッセージ */}
      <div className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)' }}>
        <p className="text-white font-bold text-lg leading-snug">🤝 生活保護は</p>
        <p className="text-white font-bold text-2xl mt-1 leading-tight">
          誰でも申請する権利があります
        </p>
        <p className="text-sky-100 text-sm mt-3 leading-relaxed">
          申請を断られた場合でも、申請書を受け取る権利は法律で保障されています。
          「申請書をください」と伝えましょう。
        </p>
      </div>

      {/* Intro */}
      <div className="card">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">🤝</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-sky-800">生活困窮サポートナビ</h2>
            <p className="text-sm text-gray-500 mt-0.5">生活保護の申請準備をわかりやすくサポート</p>
          </div>
        </div>
        <p className="text-base text-gray-700 leading-relaxed">
          生活保護は、生活に困っている人が使える公的な制度です。
          このアプリは、<strong className="text-sky-700">申請の準備・書類の整理・窓口で伝える文章</strong>を
          わかりやすくサポートします。
        </p>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800 font-medium">
            🏠 緊急の場合（住む場所・食事・医療に困っている）は、すぐに自治体の福祉事務所へ相談してください。
          </p>
        </div>
      </div>

      {/* Saved result */}
      {result && (
        <button
          onClick={() => navigate('result')}
          className={`w-full text-left p-5 rounded-2xl border-2 ${GRADE_COLORS[result.grade]} shadow-sm`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">前回の診断結果</p>
              <p className="text-xl font-bold mt-0.5">{GRADE_LABELS[result.grade]}</p>
            </div>
            <svg className="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      )}

      {/* Category sections */}
      {CATEGORIES.map((cat) => (
        <CategorySection key={cat.id} cat={cat} navigate={navigate} />
      ))}

      {/* Important notice */}
      <div className="card border-l-4 border-sky-500">
        <p className="font-bold text-sky-800 mb-3 text-lg">申請するときの大切なひとこと</p>
        <div className="bg-sky-50 rounded-xl p-5">
          <p className="text-base font-bold text-sky-900 leading-snug">
            「相談したい」ではなく<br />
            <span className="text-2xl text-sky-700">「申請したい」</span><br />
            と明確に伝えましょう
          </p>
        </div>
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">
          申請書を受け取る権利はすべての人にあります。窓口で断られても、
          <strong>「申請書の交付をお願いします」</strong>と伝えてください。
        </p>
      </div>

      {/* Local office sample */}
      <div className="card">
        <p className="font-bold text-gray-700 mb-3">📍 地域の福祉事務所（サンプル：{sampleOffice.municipality}）</p>
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <p className="font-bold text-gray-800">{sampleOffice.officeName}</p>
          <div className="flex items-center gap-2">
            <span className="text-base">📞</span>
            <p className="text-base text-gray-700">{sampleOffice.phone}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">🕐</span>
            <p className="text-sm text-gray-600">{sampleOffice.officeHours}</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-base flex-shrink-0">📌</span>
            <p className="text-sm text-gray-600">{sampleOffice.address}</p>
          </div>
          <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800">
              💡 <GlossaryTerm term="住宅扶助">{sampleOffice.housingAllowanceNote}</GlossaryTerm>
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">※ 地域別情報は順次追加予定。最新情報は各自治体へご確認ください。</p>
      </div>

      {/* Glossary */}
      <div className="card">
        <p className="font-bold text-gray-700 mb-3">💡 難しい言葉の説明</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {['扶養照会', '世帯分離', '住宅扶助', '最低生活費', 'ケースワーカー'].map((term) => (
            <GlossaryTerm key={term} term={term}>
              <span className="text-sm bg-sky-50 border border-sky-200 text-sky-700 px-3 py-1.5 rounded-xl font-medium">
                {term}
              </span>
            </GlossaryTerm>
          ))}
        </div>
        <GlossaryList />
      </div>

      {/* Input history */}
      <div className="card border-l-4 border-indigo-400">
        <p className="font-bold text-indigo-800 mb-2 text-lg">📝 入力内容の確認・修正</p>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          以前に入力した診断・シミュレーション・AI相談メモなどの内容を確認したり、修正したりできます。
        </p>
        <button
          onClick={() => navigate('history')}
          className="w-full py-5 bg-indigo-600 text-white font-bold rounded-2xl text-lg active:bg-indigo-700 transition-colors"
        >
          📋 入力内容を確認・修正する
        </button>
      </div>

      {/* Privacy */}
      <div className="p-4 bg-gray-100 rounded-2xl">
        <p className="text-sm text-gray-600 flex items-start gap-2">
          <span className="text-lg flex-shrink-0">🔒</span>
          <span>入力した情報はこの端末のみに保存され、外部サーバーには一切送信されません。</span>
        </p>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
        <p className="text-xs text-gray-500 leading-relaxed">
          【免責事項】このアプリは行政判断を代替しません。生活保護を不正に受けるためのものではなく、正当な申請権を守るための整理支援アプリです。住民票上の世帯分離だけでなく、実際の生活実態が重要です。申請を断られた場合でも、申請意思があるなら申請書の交付を求める権利があります。生活保護の最終的な受給可否は、各自治体の福祉事務所が法律に基づいて判断します。
        </p>
      </div>
    </div>
  )
}
