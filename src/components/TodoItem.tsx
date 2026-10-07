import { useAtomValue, useSetAtom, type Atom } from 'jotai'
import { deleteTaskAtom, filterAtom, matchesFilter, toggleTaskAtom } from '../state/todo'
import type { Task } from '../types/todo'

type TodoItemProps = {
  taskAtom: Atom<Task>
}

function TodoItem({ taskAtom }: TodoItemProps) {
  // 自分の1件だけを読む。ほかのタスクが変わっても、この行は再レンダリングされない
  const task = useAtomValue(taskAtom)
  const filter = useAtomValue(filterAtom)
  const toggleTask = useSetAtom(toggleTaskAtom)
  const deleteTask = useSetAtom(deleteTaskAtom)

  // 絞り込み条件に合わない行は何も描かない（フックはすべてこれより上で呼ぶ）
  if (!matchesFilter(task, filter)) return null

  // 分割代入：task.id・task.title・task.completed を同名の変数に取り出す
  const { id, title, completed } = task

  return (
    <li className="flex items-center gap-3 py-3">
      <input
        id={`task-${id}`}
        type="checkbox"
        className="size-4 accent-blue-600"
        checked={completed}
        onChange={() => toggleTask(id)}
      />
      <label
        htmlFor={`task-${id}`}
        className={`flex-1 ${completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}
      >
        {title}
      </label>
      <button
        type="button"
        className="rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50"
        aria-label={`「${title}」を削除`}
        onClick={() => deleteTask(id)}
      >
        削除
      </button>
    </li>
  )
}

export default TodoItem