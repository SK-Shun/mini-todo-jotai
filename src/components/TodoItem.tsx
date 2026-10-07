import { useSetAtom } from 'jotai'
import { deleteTaskAtom, toggleTaskAtom } from '../state/todo'
import type { Task } from '../types/todo'

type TodoItemProps = {
  task: Task
}

function TodoItem({ task }: TodoItemProps) {
  const toggleTask = useSetAtom(toggleTaskAtom)
  const deleteTask = useSetAtom(deleteTaskAtom)
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