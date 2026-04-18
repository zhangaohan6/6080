import { useState } from 'react'
import { recordWin } from './Dashboard'

// ============================================================
// 考试题目要求（数学游戏）：
// 1. 随机生成两个 1-20 的整数，运算符为 + 或 -
// 2. 用户用输入框填写答案，按 Enter 提交
// 3. 答对显示绿色"Correct!"，答错显示红色"Wrong!"
// 4. 连续答对 3 题算赢一局，调用 recordWin()，弹出 "You win!"
// ============================================================

// ✏️ 只改这两行
const OPERATORS = ['+', '-']
const MAX_WINS = 3

// 随机整数 1-20
function randInt() {
  return Math.floor(Math.random() * 20) + 1
}

// 计算正确答案
function calc(n1, op, n2) {
  if (op === '+') return n1 + n2
  if (op === '-') return n1 - n2
  if (op === '*') return n1 * n2
  if (op === '/') return n1 / n2
}

export default function Game1() {
  const [num1, setNum1]         = useState(randInt())
  const [num2, setNum2]         = useState(randInt())
  const [op, setOp]             = useState(OPERATORS[0])
  const [input, setInput]       = useState('')
  const [feedback, setFeedback] = useState('')  // 'correct' | 'wrong' | ''
  const [wins, setWins]         = useState(0)

  const newQuestion = () => {
    setNum1(randInt())
    setNum2(randInt())
    setOp(OPERATORS[Math.floor(Math.random() * OPERATORS.length)])
    setInput('')
    setFeedback('')
  }

  const handleKeyUp = (e) => {
    if (e.key !== 'Enter') return
    const answer = calc(num1, op, num2)
    if (Number(input) === answer) {
      // ✏️ 答对
      setFeedback('correct')
      const newWins = wins + 1
      setWins(newWins)
      if (newWins >= MAX_WINS) {
        alert('You win!')
        recordWin()
        setWins(0)
      }
      setTimeout(newQuestion, 500)
    } else {
      // ✏️ 答错
      setFeedback('wrong')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40, gap: 16 }}>
      <p style={{ fontSize: '2em' }}>
        {num1} {op} {num2} = <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyUp={handleKeyUp}
          style={{ width: 80, fontSize: '1em' }}
        />
      </p>
      {/* ✏️ 答对显示绿色，答错显示红色 */}
      {feedback === 'correct' && <p style={{ color: 'green', fontSize: '1.5em' }}>Correct!</p>}
      {feedback === 'wrong'   && <p style={{ color: 'red',   fontSize: '1.5em' }}>Wrong!</p>}
      <p>Progress: {wins} / {MAX_WINS}</p>
    </div>
  )
}
