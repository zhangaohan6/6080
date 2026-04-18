// ======================================
// 数学游戏 - 输入框版（21年格式）
// 显示：数字 运算符 数字 = [输入框]
// 用户打字输入答案
// ======================================

import { useState, useEffect } from 'react'

// ✏️ 改1：运算符种类
const OPERATORS = ['+', '-', '*', '/']

// ✏️ 改2：数字范围
function randomInt() {
  return Math.floor(Math.random() * 50) + 1
}

function calc(num1, op, num2) {
  if (op === '+') return num1 + num2
  if (op === '-') return num1 - num2
  if (op === '*') return num1 * num2
  if (op === '/') return num1 / num2
}

// ✏️ 改3：几关才算赢
const MAX_WINS = 5

function Game2() {
  const [num1, setNum1]     = useState(1)
  const [num2, setNum2]     = useState(1)
  const [op, setOp]         = useState('+')
  const [answer, setAnswer] = useState('')
  const [wins, setWins]     = useState(0)

  const newQuestion = () => {
    setNum1(randomInt())
    setNum2(randomInt())
    setOp(OPERATORS[Math.floor(Math.random() * OPERATORS.length)])
    setAnswer('')
  }

  useEffect(() => { newQuestion() }, [])

  const correct = calc(num1, op, num2)
  const correctStr = Number.isInteger(correct)
    ? String(correct)
    : correct.toFixed(1)

  const handleKeyUp = (e) => {
    if (e.target.value === correctStr) {
      const newWins = wins + 1
      setWins(newWins)
      if (newWins >= MAX_WINS) {
        // ✏️ 改4：胜利文字
        alert('You Win!')
        setWins(0)
      } else {
        alert(`Correct! ${newWins}/${MAX_WINS}`)
      }
      newQuestion()
    }
  }

  const opDisplay = op === '*' ? '×' : op === '/' ? '÷' : op

  const boxStyle = {
    width: 100, height: 100,
    // ✏️ 改5：方块颜色
    background: 'linear-gradient(to right, #abcabc, #cbacbd)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#333', fontSize: '1.5em',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20 }}>
      <h1>Math Game</h1>
      <p>Progress: {wins} / {MAX_WINS}</p>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={boxStyle}>{num1}</div>
        <div style={boxStyle}>{opDisplay}</div>
        <div style={boxStyle}>{num2}</div>
        <div style={boxStyle}>=</div>
        <div style={{ ...boxStyle, background: '#fff', border: '1px solid #ccc' }}>
          <input
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyUp={handleKeyUp}
            style={{ width: 70, textAlign: 'center', fontSize: '1.2em', border: 'none', outline: 'none' }}
          />
        </div>
      </div>
      <button onClick={newQuestion} style={{ padding: '8px 32px', cursor: 'pointer' }}>Reset</button>
    </div>
  )
}

export default Game2
