// ============================================================
// Dashboard 模板 V1 - 累加版（最常见）
// 显示：Games won: X (reset)
// 每赢一局 X+1，localStorage持久化
// ✏️ 考试修改：FETCH_URL / TEXT_COLOR / LABEL
// ============================================================
import { useState, useEffect } from 'react'

// ✏️ 改1：fetch地址（考试时换成题目给的URL）
const FETCH_URL = 'https://jsonplaceholder.typicode.com/todos/1'

// ✏️ 改2：文字颜色
const TEXT_COLOR = 'blue'

// ✏️ 改3：显示文字
const LABEL = 'Games won'

export default function Dashboard() {
  const [score, setScore] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('score')
    if (saved !== null) {
      setScore(Number(saved))
    } else {
      fetch(FETCH_URL)
        .then(r => r.json())
        .then(data => {
          // ✏️ 改4：从返回数据里取哪个字段（题目给的格式）
          const val = data.score ?? data.id ?? 0
          setScore(val)
          localStorage.setItem('score', val)
        })
    }
  }, [])

  // 每次游戏胜利调用这个
  const recordWin = () => {
    const newScore = score + 1
    setScore(newScore)
    localStorage.setItem('score', newScore)
  }

  const handleReset = () => {
    localStorage.removeItem('score')
    setScore(0)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 16 }}>
      {/* ✏️ 改5：提示文字 */}
      <p style={{ color: TEXT_COLOR, fontSize: '2em' }}>
        Please choose an option from the navbar.
      </p>
      <p style={{ fontSize: '1.5em' }}>
        {LABEL}: {score}
        <button onClick={handleReset} style={{ marginLeft: 8, cursor: 'pointer' }}>(reset)</button>
      </p>
    </div>
  )
}
