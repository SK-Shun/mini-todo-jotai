import { useSetAtom } from 'jotai'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import LoadError from './components/LoadError'
import Loading from './components/Loading'
import TaskBoard from './components/TaskBoard'
import { fetchedTasksAtom } from './state/todo'

function App() {
  // fetchedTasksAtom に引数なしで書き込むと、API をもう一度呼ぶ（atomWithRefresh）
  const refreshTasks = useSetAtom(fetchedTasksAtom)

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-6 shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-slate-800">ミニTODO</h1>

        {/* 再試行ボタン → onReset で取り直してから、もう一度 TaskBoard を表示する */}
        <ErrorBoundary FallbackComponent={LoadError} onReset={() => refreshTasks()}>
          <Suspense fallback={<Loading />}>
            <TaskBoard />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  )
}

export default App