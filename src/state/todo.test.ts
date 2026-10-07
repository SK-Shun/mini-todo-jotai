import { createStore } from 'jotai'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Task } from '../types/todo'
import {
  activeCountAtom,
  addTaskAtom,
  deleteTaskAtom,
  editedTasksAtom,
  fetchedTasksAtom,
  filterAtom,
  filterTasks,
  matchesFilter,
  resetTasksAtom,
  tasksAtom,
  taskAtomsAtom,
  tasksReadyAtom,
  toggleTaskAtom,
  visibleTasksAtom,
} from './todo'

const STORAGE_KEY = 'mini-todo-jotai:tasks'

const sampleTasks: Task[] = [
  { id: 1, title: '牛乳を買う', completed: false },
  { id: 2, title: 'Viteをインストールする', completed: true },
  { id: 3, title: 'Reactのドキュメントを読む', completed: false },
]

// DummyJSON と同じ形のレスポンスを返す、偽物の fetch を作る
function mockFetch(status: number, body: unknown) {
  const fetchMock = vi.fn(async () => new Response(JSON.stringify(body), { status }))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('filterTasks（ただの関数）', () => {
  it('未完了だけを返す', () => {
    expect(filterTasks(sampleTasks, 'active').map((task) => task.id)).toEqual([1, 3])
  })

  it('完了だけを返す', () => {
    expect(filterTasks(sampleTasks, 'completed').map((task) => task.id)).toEqual([2])
  })

  it('すべてなら同じ配列をそのまま返す', () => {
    expect(filterTasks(sampleTasks, 'all')).toBe(sampleTasks)
  })

  it('matchesFilter は1件ずつ判定する', () => {
    expect(matchesFilter(sampleTasks[0], 'active')).toBe(true)
    expect(matchesFilter(sampleTasks[0], 'completed')).toBe(false)
    expect(matchesFilter(sampleTasks[1], 'all')).toBe(true)
  })
})

describe('タスクの操作（store を使った atom のテスト）', () => {
  // テストごとに新しい store を作り、ほかのテストの影響を受けないようにする
  let store: ReturnType<typeof createStore>

  beforeEach(() => {
    store = createStore()
    store.set(editedTasksAtom, sampleTasks)
  })

  it('追加すると、末尾に未完了のタスクが入る', () => {
    store.set(addTaskAtom, '洗濯する')

    const tasks = store.get(tasksAtom)
    expect(tasks).toHaveLength(4)
    expect(tasks.at(-1)).toMatchObject({ title: '洗濯する', completed: false })
  })

  it('切り替えると completed が反転し、未完了の件数も変わる', () => {
    expect(store.get(activeCountAtom)).toBe(2)

    store.set(toggleTaskAtom, 1)

    expect(store.get(tasksAtom).find((task) => task.id === 1)?.completed).toBe(true)
    expect(store.get(activeCountAtom)).toBe(1)
  })

  it('削除すると、指定した id のタスクだけが消える', () => {
    store.set(deleteTaskAtom, 2)
    expect(store.get(tasksAtom).map((task) => task.id)).toEqual([1, 3])
  })

  it('絞り込みを変えると、表示する一覧が変わる', () => {
    store.set(filterAtom, 'completed')
    expect(store.get(visibleTasksAtom).map((task) => task.id)).toEqual([2])
  })

  it('元の配列は書き換えない（不変性）', () => {
    store.set(toggleTaskAtom, 1)
    expect(sampleTasks[0].completed).toBe(false)
  })

  it('編集は localStorage に JSON で保存される', () => {
    store.set(toggleTaskAtom, 1)

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Task[]
    expect(saved[0]).toEqual({ id: 1, title: '牛乳を買う', completed: true })
  })

  it('1件切り替えても、1件ごとの atom の配列は同じものが返る（splitAtom）', () => {
    const before = store.get(taskAtomsAtom)
    store.set(toggleTaskAtom, 1)
    const after = store.get(taskAtomsAtom)

    expect(after).toBe(before)
    expect(store.get(after[0]).completed).toBe(true)
  })

  it('追加すると、1件ごとの atom の配列は新しくなる', () => {
    const before = store.get(taskAtomsAtom)
    store.set(addTaskAtom, '洗濯する')

    expect(store.get(taskAtomsAtom)).not.toBe(before)
    expect(store.get(taskAtomsAtom)).toHaveLength(4)
  })

  it('サンプルに戻すと、保存が消える', () => {
    store.set(resetTasksAtom)
    expect(store.get(editedTasksAtom)).toBeNull()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})

describe('API からの取得（fetch を偽物に差し替えたテスト）', () => {
  it('取得した JSON を Task の形に変換する', async () => {
    mockFetch(200, {
      todos: [{ id: 1, todo: 'Memorize a poem', completed: true, userId: 13 }],
      total: 1,
      skip: 0,
      limit: 10,
    })
    const store = createStore()
    // 画面と同じように、先に購読しておく（unwrap は Promise を見つけてから、結果を少し遅れて反映する）
    const unsubscribe = store.sub(tasksAtom, () => {})

    await store.get(tasksReadyAtom)

    expect(store.get(tasksAtom)).toEqual([{ id: 1, title: 'Memorize a poem', completed: true }])
    unsubscribe()
  })

  it('HTTP エラーなら、ステータスを含むエラーになる', async () => {
    mockFetch(500, {})
    const store = createStore()

    await expect(store.get(fetchedTasksAtom)).rejects.toThrow('HTTP 500')
  })

  it('保存済みの編集があれば、通信しない', async () => {
    const fetchMock = mockFetch(200, { todos: [] })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleTasks))
    // getOnInit は atom を作るとき（ファイルを読み込んだとき）に localStorage を読む。
    // ページの再読み込みと同じ状態にするため、todo.ts を読み込み直す
    vi.resetModules()
    const todo = await import('./todo')
    const store = createStore()

    expect(store.get(todo.tasksReadyAtom)).toBe(true)
    expect(store.get(todo.tasksAtom)).toHaveLength(3)
    expect(fetchMock).not.toHaveBeenCalled()
  })
})