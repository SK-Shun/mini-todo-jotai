import { useAtom } from 'jotai'
import { filterAtom } from '../state/todo'
import type { Filter } from '../types/todo'

// ボタンの値と表示名。配列にしておくと map でまとめて描ける
const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'active', label: '未完了' },
  { value: 'completed', label: '完了' },
]

function FilterButtons() {
  // useState と同じ形で、atom の値と更新関数を受け取る
  const [current, setFilter] = useAtom(filterAtom)

  return (
    <div className="mb-4 flex gap-2" role="group" aria-label="絞り込み">
      {FILTER_OPTIONS.map((option) => {
        const isActive = option.value === current
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => setFilter(option.value)}
            className={`cursor-pointer rounded-full px-3 py-1 text-sm font-medium ${
              isActive
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default FilterButtons