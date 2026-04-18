import { useState, useEffect } from 'react'

// ============================================================
// 考试题目要求：
// 1. 从 http://localhost:5001/api/score 获取初始分数
//    返回格式：{ "score": 5 }
// 2. 显示："Games won: X  (reset)"
// 3. 文字颜色：blue
// 4. reset 按钮点击后分数归0，清除localStorage
// ============================================================

// ✏️ 改这里
const FETCH_URL = 'http://localhost:5001/api/score'
const TEXT_COLOR = 'blue'
const LABEL = 'Game won'

// Game1.jsx 会调用这个函数通知Dashboard加分
export const recordWin = () => {
  const current = Number(localStorage.getItem('score') || 0)
  localStorage.setItem('score', current + 1)
  window.dispatchEvent(new Event('scoreUpdate'))
}

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
        setScore(data.lives)
        localStorage.setItem('score', data.lives)
      })
  }

   // ✏️ 加这个：监听Game1调用recordWin后的刷新信号
  const onUpdate = () => setScore(Number(localStorage.getItem('score') || 0))
  window.addEventListener('scoreUpdate', onUpdate)
  return () => window.removeEventListener('scoreUpdate', onUpdate)

}, [])

  const handleReset = () => {
  localStorage.removeItem('score')
  setScore(0)
}

  return (
  <div>
    <p style={{ color: TEXT_COLOR, fontSize: '1.5em' }}>
      {LABEL}: {score}
      <button onClick={handleReset} style={{ marginLeft: 8 }}>(reset)</button>
    </p>
  </div>
)

}
