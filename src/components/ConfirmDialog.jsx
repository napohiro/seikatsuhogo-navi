export default function ConfirmDialog({ title, message, confirmLabel = 'はい、初期化する', cancelLabel = 'キャンセル', onConfirm, onCancel, danger = true }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-5">
      <div
        className="absolute inset-0 bg-black/60 animate-fade-in"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fade-in">
        <p className="text-xl font-bold text-gray-800 mb-3 leading-snug">{title}</p>
        <p className="text-base text-gray-600 leading-relaxed mb-7">{message}</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onConfirm}
            className={`w-full py-5 rounded-2xl font-bold text-lg ${
              danger ? 'bg-red-500 text-white active:bg-red-600' : 'bg-sky-600 text-white active:bg-sky-700'
            }`}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-5 rounded-2xl border-2 border-gray-300 text-gray-700 font-bold text-lg bg-white active:bg-gray-50"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
