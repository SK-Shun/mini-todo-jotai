import { atom } from 'jotai'
import type { Filter, Task } from '../types/todo'

// 絞り込みの選択状態。初期値は「すべて」
export const filterAtom = atom<Filter>('all')

// タスクの一覧（APIからの取得は、まだ App の useEffect が行う）
export const tasksAtom = atom<Task[]>([])

// 絞り込み条件に合うタスクだけを返す（引数と戻り値に型を付けた関数）
export function filterTasks(tasks: Task[], filter: Filter): Task[] {
  switch (filter) {
    case 'active':
      return tasks.filter((task) => !task.completed)
    case 'completed':
      return tasks.filter((task) => task.completed)
    case 'all':
      return tasks
  }
}

// 派生atom：画面に出すタスク。tasksAtom か filterAtom が変わると計算し直される
export const visibleTasksAtom = atom((get) => filterTasks(get(tasksAtom), get(filterAtom)))

// 派生atom：未完了の件数
export const activeCountAtom = atom((get) => get(tasksAtom).filter((task) => !task.completed).length)