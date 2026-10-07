function Loading() {
  return (
    <p role="status" className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
      <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
      読み込み中…
    </p>
  )
}

export default Loading