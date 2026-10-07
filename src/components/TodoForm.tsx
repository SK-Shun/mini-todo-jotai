import { useSetAtom } from 'jotai'
import { useState, type SubmitEvent } from 'react'
import { addTaskAtom } from '../state/todo'

function TodoForm() {
  // 入力中の文字列はこのコンポーネントだけが使うので、useState のままにする
  const [title, setTitle] = useState('')
  // 書き込み用atomを呼ぶ関数だけを受け取る（値は読まない）
  const addTask = useSetAtom(addTaskAtom)

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault() // フォーム送信によるページの再読み込みを止める
    const trimmed = title.trim()
    if (trimmed === '') return
    addTask(trimmed) // 書き込み用atomを実行する
    setTitle('') // 入力欄を空に戻す
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <label htmlFor="new-task" className="sr-only">
        新しいタスク
      </label>
      <input
        id="new-task"
        className="todo-form__input"
        type="text"
        placeholder="やることを入力"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button
        className="todo-form__button"
        type="submit"
        disabled={title.trim() === ''}
      >
        追加
      </button>
    </form>
  )
}

export default TodoForm