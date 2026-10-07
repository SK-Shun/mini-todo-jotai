import { useSetAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { fetchTasks } from './api/todos'
import FilterButtons from './components/FilterButtons'
import TaskCount from './components/TaskCount'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import { tasksAtom } from './state/todo'
import type { Task } from './types/todo'

function App() {
  // タスクの配列は atom に置く。読み書きの形は useState と同じ
  const setTasks = useSetAtom(tasksAtom)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  // 再試行ボタンで1増やす。useEffect の依存配列に入れて、変わったら取得し直す
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    // この回の通信を途中で止めるための道具
    const controller = new AbortController()

    const loadTasks = async () => {
      try {
        const fetchedTasks = await fetchTasks(controller.signal)
        setTasks(fetchedTasks)
      } catch (error) {
        // クリーンアップで止めた通信はエラーとして扱わない
        if (controller.signal.aborted) return
        const message = error instanceof Error ? error.message : String(error)
        setErrorMessage(`サンプルタスクを読み込めませんでした（${message}）`)
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    loadTasks()

    // クリーンアップ：次に effect を実行する前と、画面から消えるときに呼ばれる
    return () => {
      controller.abort()
    }
  }, [reloadKey, setTasks])

  // 再試行：表示を「通信中」に戻し、reloadKey を変えて effect をもう一度動かす
  const retry = () => {
    setIsLoading(true)
    setErrorMessage(null)
    setReloadKey(reloadKey + 1)
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">ミニTODO</h1>

        <TodoForm disabled={isLoading} />

        <FilterButtons />

        {errorMessage && (
          <div
            role="alert"
            className="mb-4 flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={retry}
              className="shrink-0 cursor-pointer rounded-md border border-red-300 bg-white px-3 py-1 font-medium hover:bg-red-100"
            >
              再試行
            </button>
          </div>
        )}

        {isLoading ? (
          <p role="status" className="flex items-center justify-center gap-2 py-6 text-sm text-slate-500">
            <span className="size-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
            読み込み中…
          </p>
        ) : (
          <>
            <TodoList />
            <TaskCount />
          </>
        )}
      </div>
    </main>
  )
}

export default App