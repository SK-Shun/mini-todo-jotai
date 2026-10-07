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

// 書き込み用atom：読み取りの値は持たず（第1引数は null）、操作だけを持つ
// 追加：今の一覧の末尾に新しいタスクを足した「新しい配列」をセットする
export const addTaskAtom = atom(null, (get, set, title: string) => {
  const newTask: Task = { id: Date.now(), title, completed: false }
  set(tasksAtom, [...get(tasksAtom), newTask])
})

// 削除：指定した id 以外を残す
export const deleteTaskAtom = atom(null, (get, set, id: number) => {
  set(
    tasksAtom,
    get(tasksAtom).filter((task) => task.id !== id),
  )
})

// 完了の切り替え：指定した id のタスクだけ、completed を反転したコピーに差し替える
export const toggleTaskAtom = atom(null, (get, set, id: number) => {
  set(
    tasksAtom,
    get(tasksAtom).map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    ),
  )
})