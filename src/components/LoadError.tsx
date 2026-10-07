import type { FallbackProps } from 'react-error-boundary'

// ErrorBoundary がエラーを受け止めたときに、代わりに表示する部品
function LoadError({ error, resetErrorBoundary }: FallbackProps) {
  const message = error instanceof Error ? error.message : String(error)

  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <span>サンプルタスクを読み込めませんでした（{message}）</span>
      <button
        type="button"
        onClick={resetErrorBoundary}
        className="shrink-0 cursor-pointer rounded-md border border-red-300 bg-white px-3 py-1 font-medium hover:bg-red-100"
      >
        再試行
      </button>
    </div>
  )
}

export default LoadError