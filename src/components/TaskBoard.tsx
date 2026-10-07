import { useAtomValue } from 'jotai'
import { fetchedTasksAtom } from '../state/todo'
import FilterButtons from './FilterButtons'
import TaskCount from './TaskCount'
import TodoForm from './TodoForm'
import TodoList from './TodoList'

function TaskBoard() {
  // API の取得が終わるまで待つ。
  // 取得中は外側の <Suspense> の fallback が、失敗したら <ErrorBoundary> の表示が出る
  useAtomValue(fetchedTasksAtom)

  return (
    <>
      <TodoForm />
      <FilterButtons />
      <TodoList />
      <TaskCount />
    </>
  )
}

export default TaskBoard