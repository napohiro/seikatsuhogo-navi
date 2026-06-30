import { useState, useCallback } from 'react'
import {
  loadAnswers, loadAnswersAt, loadResult,
  loadChecklist, loadChecklistAt,
  loadSimulator, loadHousehold, loadAiMemo,
  clearSimulator, clearHousehold, clearAiMemo,
  formatUpdatedAt,
  saveAnswers, saveResult, saveChecklist,
} from '../utils/storage'
import ConfirmDialog from './ConfirmDialog'

// チェックリスト総数
const CHECKLIST_TOTAL = 16

const GRADE_LABELS = {
  A: '申請を急いだ方がよい',
  B: '申請可能性あり',
  C: '追加確認が必要',
}

function StatusBadge({ hasData }) {
  if (hasData) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
        入力済み
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-sm font-bold text-gray-400 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full">
      <span className="w-2 h-2 bg-gray-300 rounded-full" />
      未入力
    </span>
  )
}

function HistoryCard({ icon, title, color, hasData, updatedAt, summary, onView, onEdit, onReset, emptyLabel = '入力する' }) {
  return (
    <div className="card space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl`}>
            {icon}
          </div>
          <div>
            <p className="font-bold text-gray-800 text-lg leading-tight">{title}</p>
            {hasData && updatedAt && (
              <p className="text-sm text-gray-400 mt-0.5">最終入力：{updatedAt}</p>
            )}
            {!hasData && (
              <p className="text-sm text-gray-400 mt-0.5">まだ入力されていません</p>
            )}
          </div>
        </div>
        <StatusBadge hasData={hasData} />
      </div>

      {/* Summary */}
      {hasData && summary && (
        <div className="bg-gray-50 rounded-xl p-4">
          {summary}
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-2">
        {hasData ? (
          <>
            {onView && (
              <button
                onClick={onView}
                className="w-full py-4 bg-sky-600 text-white font-bold rounded-2xl text-base active:bg-sky-700 transition-colors"
              >
                📄 内容を見る
              </button>
            )}
            <button
              onClick={onEdit}
              className="w-full py-4 bg-white text-sky-700 border-2 border-sky-600 font-bold rounded-2xl text-base active:bg-sky-50 transition-colors"
            >
              ✏️ 修正する
            </button>
            <button
              onClick={onReset}
              className="w-full py-4 bg-white text-red-600 border-2 border-red-400 font-bold rounded-2xl text-base active:bg-red-50 transition-colors"
            >
              🗑️ この項目をリセット
            </button>
          </>
        ) : (
          <button
            onClick={onEdit}
            className="w-full py-4 bg-sky-600 text-white font-bold rounded-2xl text-base active:bg-sky-700 transition-colors"
          >
            ✍️ {emptyLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default function HistoryView({ navigate, navigateWithParams }) {
  const [refresh, setRefresh] = useState(0)
  const [resetTarget, setResetTarget] = useState(null) // { label, onConfirm }

  const load = useCallback(() => ({
    answers: loadAnswers(),
    result: loadResult(),
    answersAt: loadAnswersAt(),
    checklist: loadChecklist(),
    checklistAt: loadChecklistAt(),
    simulator: loadSimulator(),
    household: loadHousehold(),
    aimemo: loadAiMemo(),
  }), [refresh]) // eslint-disable-line react-hooks/exhaustive-deps

  const data = load()

  const doReset = (clearFn) => {
    clearFn()
    setRefresh((r) => r + 1)
    setResetTarget(null)
  }

  const askReset = (label, clearFn) => {
    setResetTarget({ label, onConfirm: () => doReset(clearFn) })
  }

  const checkedCount = data.checklist
    ? Object.values(data.checklist).filter(Boolean).length
    : 0

  return (
    <div className="pt-5 space-y-5">
      {/* Header card */}
      <div className="card">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl">
            📝
          </div>
          <div>
            <h2 className="text-xl font-bold text-indigo-800">入力履歴・修正</h2>
            <p className="text-sm text-gray-500 mt-0.5">入力した内容の確認・修正・削除ができます</p>
          </div>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-amber-800 leading-relaxed">
            💡 「修正する」を押すと、以前の入力内容がそのまま表示され、変更できます。保存し直すと上書きされます。
          </p>
        </div>
      </div>

      {/* Card 1: かんたん診断 */}
      <HistoryCard
        icon="📋"
        title="かんたん診断"
        color="bg-sky-100"
        hasData={!!data.answers}
        updatedAt={formatUpdatedAt(data.answersAt)}
        summary={
          data.result ? (
            <div>
              <p className="text-sm text-gray-500 mb-1">診断結果</p>
              <p className="font-bold text-gray-800 text-base">{GRADE_LABELS[data.result.grade] || '―'}</p>
            </div>
          ) : null
        }
        onView={() => navigate('result')}
        onEdit={() => navigate('questionnaire')}
        onReset={() => askReset('かんたん診断', () => {
          saveAnswers({})
          saveResult(null)
          localStorage.removeItem('shnavi_answers')
          localStorage.removeItem('shnavi_result')
          localStorage.removeItem('shnavi_answers_at')
        })}
      />

      {/* Card 2: 暮らし方比較シミュレーター */}
      <HistoryCard
        icon="⚖️"
        title="暮らし方比較シミュレーター"
        color="bg-indigo-100"
        hasData={!!data.simulator}
        updatedAt={formatUpdatedAt(data.simulator?.updatedAt)}
        summary={
          data.simulator ? (
            <p className="text-sm text-gray-600">回答データが保存されています</p>
          ) : null
        }
        onEdit={() =>
          navigateWithParams('simulator', {
            startView: 'questionnaire',
            initialAnswers: data.simulator?.answers || null,
          })
        }
        onView={() =>
          navigateWithParams('simulator', {
            startView: 'result',
            initialAnswers: data.simulator?.answers || null,
          })
        }
        onReset={() => askReset('暮らし方比較シミュレーター', clearSimulator)}
        emptyLabel="入力する"
      />

      {/* Card 3: 世帯分離・同居相談ナビ */}
      <HistoryCard
        icon="🏘️"
        title="世帯分離・同居相談ナビ"
        color="bg-purple-100"
        hasData={!!data.household}
        updatedAt={formatUpdatedAt(data.household?.updatedAt)}
        summary={
          data.household ? (
            <p className="text-sm text-gray-600">回答データが保存されています</p>
          ) : null
        }
        onEdit={() =>
          navigateWithParams('household', {
            startView: 'questionnaire',
            initialAnswers: data.household?.answers || null,
          })
        }
        onView={() =>
          navigateWithParams('household', {
            startView: 'result',
            initialAnswers: data.household?.answers || null,
          })
        }
        onReset={() => askReset('世帯分離・同居相談ナビ', clearHousehold)}
        emptyLabel="入力する"
      />

      {/* Card 4: AI相談メモ */}
      <HistoryCard
        icon="🤖"
        title="AI相談メモ"
        color="bg-emerald-100"
        hasData={!!data.aimemo}
        updatedAt={formatUpdatedAt(data.aimemo?.updatedAt)}
        summary={
          data.aimemo?.inputs ? (
            <div className="space-y-1">
              {Object.entries(data.aimemo.inputs)
                .filter(([, v]) => v && v.trim())
                .slice(0, 3)
                .map(([k, v]) => (
                  <p key={k} className="text-sm text-gray-700 leading-snug line-clamp-1">
                    <span className="text-gray-400">・</span>
                    {v.slice(0, 40)}{v.length > 40 ? '…' : ''}
                  </p>
                ))
              }
            </div>
          ) : null
        }
        onEdit={() =>
          navigateWithParams('aimemo', {
            startView: 'inputs',
            initialInputs: data.aimemo?.inputs || null,
          })
        }
        onReset={() => askReset('AI相談メモ', clearAiMemo)}
        emptyLabel="入力する"
      />

      {/* Card 5: チェックリスト */}
      <HistoryCard
        icon="✅"
        title="申請準備チェックリスト"
        color="bg-teal-100"
        hasData={checkedCount > 0}
        updatedAt={formatUpdatedAt(data.checklistAt)}
        summary={
          checkedCount > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">準備できた書類</p>
                <p className="font-bold text-teal-700">{checkedCount} / {CHECKLIST_TOTAL}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-teal-500 h-3 rounded-full transition-all"
                  style={{ width: `${Math.round((checkedCount / CHECKLIST_TOTAL) * 100)}%` }}
                />
              </div>
            </div>
          ) : null
        }
        onView={() => navigate('checklist')}
        onEdit={() => navigate('checklist')}
        onReset={() => askReset('チェックリスト', () => {
          saveChecklist({})
          localStorage.removeItem('shnavi_checklist')
          localStorage.removeItem('shnavi_checklist_at')
        })}
        emptyLabel="入力する"
      />

      {/* Back to top */}
      <button
        onClick={() => navigate('home')}
        className="w-full py-4 rounded-2xl border-2 border-gray-300 text-gray-600 font-bold text-base active:bg-gray-100"
      >
        🏠 トップページへ戻る
      </button>

      {/* Confirm dialog */}
      {resetTarget && (
        <ConfirmDialog
          title="入力内容を削除しますか？"
          message={`「${resetTarget.label}」の入力内容を削除します。あとから元に戻せません。`}
          confirmLabel="削除する"
          cancelLabel="キャンセル"
          onConfirm={resetTarget.onConfirm}
          onCancel={() => setResetTarget(null)}
          danger
        />
      )}
    </div>
  )
}
