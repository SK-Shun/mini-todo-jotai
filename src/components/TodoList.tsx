import { useAtomValue } from 'jotai'
import { taskAtomsAtom, visibleCountAtom } from '../state/todo'
import TodoItem from './TodoItem'

function TodoList() {
  // 1件ごとの atom の配列。追加・削除では変わるが、チェックの切り替えでは変わらない
  const taskAtoms = useAtomValue(taskAtomsAtom)

  return (
    <>
      {/* 表示する行が1つもないとき（中身が空のとき）は、枠線ごと隠す */}
      <ul className="divide-y divide-slate-200 border-y border-slate-200 empty:hidden">
        {taskAtoms.map((taskAtom) => (
          <TodoItem key={`${taskAtom}`} taskAtom={taskAtom} />
        ))}
      </ul>
      <EmptyMessage />
    </>
  )
}

function EmptyMessage() {
  // 件数（数値）だけを読むので、件数が変わったときだけ再レンダリングされる
  const visibleCount = useAtomValue(visibleCountAtom)
  if (visibleCount > 0) return null
  return <p className="py-6 text-center text-sm text-slate-500">表示するタスクはありません</p>
}

export default TodoList