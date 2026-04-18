// ============================================================
// Dashboard 模板 V2 - 倒计版（22年格式）
// 显示：Games left to win: X (reset)
// 初始从URL获取，每赢一局 X-1，到0弹Congratulations
// ✏️ 考试修改：FETCH_URL / TEXT_COLOR / LABEL
// ============================================================
import { useState, useEffect } from 'react'

// ✏️ 改1：fetch地址
const FETCH_URL = 'https://jsonplaceholder.typicode.com/todos/1'

// ✏️ 改2：文字颜色
const TEXT_COLOR = 'blue'

// ✏️ 改3：显示文字
const LABEL = 'Games left to win'

export default function Dashboard() {
  const [score, setScore]     = useState(0)
  const [initVal, setInitVal] = useState(0) // 初始值，用于reset

  useEffect(() => {
    const saved = localStorage.getItem('score')
    const init  = localStorage.getItem('scoreInit')
    if (saved !== null) {
      setScore(Number(saved))
      setInitVal(Number(init))
    } else {
      fetch(FETCH_URL)
        .then(r => r.json())
        .then(data => {
          // ✏️ 改4：取哪个字段
          const val = data.score ?? data.id ?? 0
          setScore(val)
          setInitVal(val)
          localStorage.setItem('score', val)
          localStorage.setItem('scoreInit', val)
        })
    }
  }, [])

  // 每次游戏胜利调用这个
  const recordWin = () => {
    const newScore = score - 1
    setScore(newScore)
    localStorage.setItem('score', newScore)
    if (newScore <= 0) {
      // ✏️ 改5：到0时的提示
      alert('Congratulations!')
      handleReset()
    }
  }

  const handleReset = () => {
    localStorage.removeItem('score')
    localStorage.removeItem('scoreInit')
    setScore(initVal)
    localStorage.setItem('score', initVal)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', gap: 16 }}>
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
