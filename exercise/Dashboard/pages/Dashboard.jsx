import { useState, useEffect } from 'react'

function Dashboard() {

  // ── 1. 数据箱子 ──────────────────────────────
  const [score, setScore] = useState(0)


  // ── 2. 页面加载：读存档 or fetch ──────────────
  useEffect(() => {
    const saved = localStorage.getItem('score') // ← 改键名
    if (saved !== null) {
      setScore(Number(saved))
    } else {
      fetch('题目给的URL')                       // ← 改URL
        .then(r => r.json())
        .then(data => {
          setScore(data.score)                  // ← 改字段名
          localStorage.setItem('score', data.score)
        })
    }
  }, [])


  // ── 3. 赢了一局：+1 并存档 ───────────────────
  const handleWin = () => {
    const newScore = score + 1
    setScore(newScore)
    localStorage.setItem('score', newScore)
  }


  // ── 4. 重置 ──────────────────────────────────
  const handleReset = () => {
    localStorage.removeItem('score')
    setScore(0)
  }


  // ── 5. 页面显示 ──────────────────────────────
  return (
    <div>
      <p>Games won: {score}</p>                 {/* ← 改文字 */}
      <button onClick={handleReset}>(reset)</button>
    </div>
  )
}

export default Dashboard
