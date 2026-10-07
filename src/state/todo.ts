import { atom } from 'jotai'
import { atomWithRefresh, unwrap } from 'jotai/utils'
import { fetchTasks } from '../api/todos'
import type { Filter, Task } from '../types/todo'

// 絞り込みの選択状態。初期値は「すべて」
export const filterAtom = atom<Filter>('all')

// API から取得するサンプルタスク（非同期atom）
// 初めて読まれたときに1回だけ通信し、結果（Promise）は store に保存される。
// この atom に引数なしで書き込む（refresh する）と、もう一度通信する
export const fetchedTasksAtom = atomWithRefresh((_get, { signal }) => fetchTasks(signal))

// 取得結果を、Promise ではなく普通の配列として読むための atom
// 取得中は空配列。unwrap は Promise の完了を待たずに今の値を返す
const fetchedTasksValueAtom = unwrap(fetchedTasksAtom, (prev) => prev ?? [])

// 画面で編集したタスク。まだ一度も編集していなければ null
export const editedTasksAtom = atom<Task[] | null>(null)

// 画面に出すタスクの一覧。編集済みならその配列、まだなら API の結果
export const tasksAtom = atom((get) => get(editedTasksAtom) ?? get(fetchedTasksValueAtom))

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
// 結果は editedTasksAtom に入れる。一度でも編集すると、以降は API の結果より優先される
// 追加：今の一覧の末尾に新しいタスクを足した「新しい配列」をセットする
export const addTaskAtom = atom(null, (get, set, title: string) => {
  const newTask: Task = { id: Date.now(), title, completed: false }
  set(editedTasksAtom, [...get(tasksAtom), newTask])
})

// 削除：指定した id 以外を残す
export const deleteTaskAtom = atom(null, (get, set, id: number) => {
  set(
    editedTasksAtom,
    get(tasksAtom).filter((task) => task.id !== id),
  )
})

// 完了の切り替え：指定した id のタスクだけ、completed を反転したコピーに差し替える
export const toggleTaskAtom = atom(null, (get, set, id: number) => {
  set(
    editedTasksAtom,
    get(tasksAtom).map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    ),
  )
})