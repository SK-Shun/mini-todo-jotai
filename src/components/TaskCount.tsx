import { useAtomValue } from 'jotai'
import { activeCountAtom } from '../state/todo'

function TaskCount() {
  const activeCount = useAtomValue(activeCountAtom)
  return <p className="text-sm text-slate-600">未完了：{activeCount} 件</p>
}

export default TaskCount