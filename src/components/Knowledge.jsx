import { useState } from 'react'
import { knowledgeItems } from '../data/knowledge'

export default function Knowledge({ navigate }) {
  const [openId, setOpenId] = useState(null)

  return (
    <div className="pt-5 space-y-4">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-2">制度の基礎知識</h2>
        <p className="text-sm text-gray-500">
          生活保護制度について、よくある疑問をわかりやすく解説します。
        </p>
      </div>

      <div className="space-y-3">
        {knowledgeItems.map((item) => {
          const isOpen = openId === item.id
          return (
            <div key={item.id} className="card">
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full text-left"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.summary}</p>
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
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Key facts */}
      <div className="card bg-sky-50 border border-sky-200">
        <h3 className="font-bold text-sky-800 text-base mb-3">📌 必ず覚えておくこと</h3>
        <div className="space-y-3">
          {[
            { icon: '✊', text: '生活保護の申請は権利です。誰でも申請できます。' },
            { icon: '📄', text: '書類が全部なくても申請できます。後日提出でOKです。' },
            { icon: '👨‍👩‍👧', text: '家族がいても申請できます。世帯全体の状況で判断されます。' },
            { icon: '💴', text: '年金があっても申請できます。差額が支給されます。' },
            { icon: '🏥', text: '医療費・介護費も生活保護でカバーされます。' },
          ].map((fact, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">{fact.icon}</span>
              <p className="text-base text-sky-800">{fact.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* External reference */}
      <div className="card border border-gray-200">
        <p className="font-bold text-gray-700 mb-2">📎 公式情報</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          生活保護制度の公式情報は厚生労働省のウェブサイトをご確認ください。
          「厚生労働省 生活保護」で検索してください。
        </p>
        <p className="text-xs text-gray-400 mt-2">
          ※ このアプリは厚生労働省の公式サービスではありません。
        </p>
      </div>

      <button
        onClick={() => navigate('case')}
        className="btn-secondary w-full"
      >
        👨‍👩‍👴 モデルケースで学ぶ
      </button>
    </div>
  )
}
