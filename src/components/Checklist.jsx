import { useState } from 'react'
import { saveChecklist, loadChecklist } from '../utils/storage'

const CHECKLIST_ITEMS = [
  {
    id: 'id_doc',
    category: '本人確認',
    label: '本人確認書類',
    note: 'マイナンバーカード・運転免許証・健康保険証・パスポートなど',
    required: true,
  },
  {
    id: 'insurance_card',
    category: '本人確認',
    label: '健康保険証',
    note: '国民健康保険・社会保険など',
    required: true,
  },
  {
    id: 'care_card',
    category: '介護',
    label: '介護保険証',
    note: '65歳以上または要介護認定を受けている方',
    required: false,
  },
  {
    id: 'pension_doc',
    category: '収入',
    label: '年金額がわかるもの',
    note: '年金振込通知書・年金決定通知書',
    required: false,
  },
  {
    id: 'bankbook',
    category: '資産',
    label: '通帳（世帯全員分）',
    note: '直近2〜3か月の入出金がわかるもの',
    required: true,
  },
  {
    id: 'payslip',
    category: '収入',
    label: '給与明細',
    note: '就労中の方：直近3か月分',
    required: false,
  },
  {
    id: 'lease',
    category: '住居',
    label: '家賃契約書（賃貸の場合）',
    note: '賃貸借契約書・家賃領収書',
    required: false,
  },
  {
    id: 'utility_bill',
    category: '生活費',
    label: '公共料金の請求書',
    note: '電気・ガス・水道の請求書・領収書',
    required: false,
  },
  {
    id: 'clinic_card',
    category: '医療',
    label: '医療機関の診察券',
    note: '通院中の病院・クリニックの診察券',
    required: false,
  },
  {
    id: 'diagnosis',
    category: '医療',
    label: '診断書または病名がわかる書類',
    note: '医師の診断書・紹介状・退院証明書など',
    required: false,
  },
  {
    id: 'medicine_book',
    category: '医療',
    label: 'お薬手帳',
    note: '服薬中の薬がわかるもの',
    required: false,
  },
  {
    id: 'care_cert',
    category: '介護',
    label: '要介護認定通知書',
    note: '要支援・要介護の認定を受けている方',
    required: false,
  },
  {
    id: 'debt_doc',
    category: '借金',
    label: '借金・滞納がわかる書類',
    note: 'クレジット明細・督促状・借用書など',
    required: false,
  },
  {
    id: 'household_memo',
    category: '生活費',
    label: '家計メモ',
    note: '毎月の収入・支出をざっくりまとめたもの（手書きでOK）',
    required: false,
  },
  {
    id: 'seal',
    category: '手続き',
    label: '印鑑',
    note: '認印で可（シャチハタでも可能な場合あり）',
    required: true,
  },
  {
    id: 'phrase',
    category: '準備',
    label: '窓口で伝える文章',
    note: 'このアプリの「窓口での伝え方」で作成できます',
    required: false,
  },
]

const categories = [...new Set(CHECKLIST_ITEMS.map((i) => i.category))]

export default function Checklist({ navigate }) {
  const [checked, setChecked] = useState(() => loadChecklist() || {})

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] }
    setChecked(next)
    saveChecklist(next)
  }

  const checkedCount = Object.values(checked).filter(Boolean).length
  const total = CHECKLIST_ITEMS.length
  const requiredTotal = CHECKLIST_ITEMS.filter((i) => i.required).length
  const requiredChecked = CHECKLIST_ITEMS.filter((i) => i.required && checked[i.id]).length

  return (
    <div className="pt-5 space-y-5 pb-6">
      {/* Header card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-xl font-bold text-gray-800 mb-1">申請の準備リスト</h2>
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          書類が全部そろっていなくても申請できます。後日提出でも大丈夫です。
        </p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-base">
            <span className="text-gray-600">準備できたもの</span>
            <span className="font-bold text-sky-700">{checkedCount} / {total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-sky-600 h-4 rounded-full transition-all"
              style={{ width: `${Math.round((checkedCount / total) * 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-500">
            必須書類：{requiredChecked} / {requiredTotal} 準備済み
          </p>
        </div>
      </div>

      {/* Checklist by category */}
      {categories.map((cat) => {
        const items = CHECKLIST_ITEMS.filter((i) => i.category === cat)
        return (
          <div key={cat} className="space-y-2">
            <h3 className="text-base font-bold text-gray-500 px-1 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-sky-500 rounded-full inline-block" />
              {cat}
            </h3>
            {items.map((item) => {
              const done = !!checked[item.id]
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  className={`w-full text-left rounded-2xl border-2 transition-all flex items-center gap-4 px-5 py-4 ${
                    done
                      ? 'bg-green-50 border-green-400'
                      : 'bg-white border-gray-200 active:border-sky-300'
                  }`}
                  style={{ minHeight: '72px' }}
                >
                  {/* Status badge */}
                  <span
                    className={`flex-shrink-0 text-sm font-bold px-3 py-1.5 rounded-xl whitespace-nowrap ${
                      done
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {done ? 'できた ✓' : 'まだ'}
                  </span>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-base font-medium leading-snug ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {item.label}
                      </span>
                      {item.required && (
                        <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-lg flex-shrink-0">
                          必須
                        </span>
                      )}
                    </div>
                    {item.note && (
                      <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{item.note}</p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )
      })}

      {/* Tips */}
      <div className="bg-sky-50 border-l-4 border-sky-500 rounded-2xl p-5">
        <p className="font-bold text-sky-800 mb-3">💡 申請するときのポイント</p>
        <ul className="space-y-2 text-base text-gray-700 leading-relaxed">
          <li>・書類が足りなくても「申請書をください」と必ず言いましょう</li>
          <li>・足りない書類は後で持ってきてもOKです</li>
          <li>・「書類がないと申請できない」と言われたら断れます</li>
        </ul>
      </div>

      <button
        onClick={() => navigate('phrases')}
        className="btn-primary w-full"
        style={{ minHeight: '64px' }}
      >
        💬 窓口で言う言葉を確認する →
      </button>

      <button
        onClick={() => window.print()}
        className="w-full py-4 rounded-xl border-2 border-gray-300 text-gray-600 font-bold text-lg"
        style={{ minHeight: '60px' }}
      >
        🖨️ リストを印刷する
      </button>
    </div>
  )
}
