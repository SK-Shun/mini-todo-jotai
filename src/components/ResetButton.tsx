import { useSetAtom } from 'jotai'
import { resetTasksAtom } from '../state/todo'

function ResetButton() {
  const resetTasks = useSetAtom(resetTasksAtom)

  return (
    <button
      type="button"
      onClick={() => resetTasks()}
      className="cursor-pointer rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
    >
      サンプルに戻す
    </button>
  )
}

export default ResetButton