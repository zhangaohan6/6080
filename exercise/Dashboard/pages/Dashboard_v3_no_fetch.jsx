// ============================================================
// Dashboard 模板 V3 - 无fetch版（考试可能不需要fetch）
// 显示：Games won: X (reset)
// 初始值为0，纯localStorage
// ✏️ 考试修改：TEXT_COLOR / LABEL / INIT_VAL
// ============================================================
import { useState, useEffect } from 'react'

// ✏️ 改1：文字颜色
const TEXT_COLOR = 'red'

// ✏️ 改2：显示文字
const LABEL = 'Games won'

// ✏️ 改3：初始值（不需要fetch时直接写死）
const INIT_VAL = 0

export default function Dashboard() {
  const [score, setScore] = useState(INIT_VAL)

  useEffect(() => {
    const saved = localStorage.getItem('score')
    if (saved !== null) setScore(Number(saved))
  }, [])

  const recordWin = () => {
    const newScore = score + 1
    setScore(newScore)
    localStorage.setItem('score', newScore)
  }

  const handleReset = () => {
    localStorage.removeItem('score')
    setScore(INIT_VAL)
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
