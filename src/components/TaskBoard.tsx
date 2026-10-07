import { useAtomValue } from 'jotai'
import { tasksReadyAtom } from '../state/todo'
import FilterButtons from './FilterButtons'
import ResetButton from './ResetButton'
import TaskCount from './TaskCount'
import TodoForm from './TodoForm'
import TodoList from './TodoList'

function TaskBoard() {
  // 表示できる状態になるまで待つ（保存済みの編集があれば待たない）。
  // 取得中は外側の <Suspense> の fallback が、失敗したら <ErrorBoundary> の表示が出る
  useAtomValue(tasksReadyAtom)

  return (
    <>
      <TodoForm />
      <FilterButtons />
      <TodoList />
      <div className="mt-4 flex items-center justify-between">
        <TaskCount />
        <ResetButton />
      </div>
    </>
  )
}

export default TaskBoard