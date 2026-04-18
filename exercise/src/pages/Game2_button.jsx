// ======================================
// 数学游戏 - 按钮版（22年格式）
// 显示：数字 [+][-][×][÷] 数字 = 数字
// 用户点击运算符按钮
// ======================================

import { useState, useEffect } from 'react'

// ✏️ 改1：考试时从题目复制这个数字列表
const NUMBERS = [
  [1, 2, 2],    // 1 ? 2 = 2   → 答案 *
  [3, 6, -3],   // 3 ? 6 = -3  → 答案 -
  [8, 3, 11],   // 8 ? 3 = 11  → 答案 +
  [9, 8, 17],
  [5, 4, 9],
]

const OPERATORS = ['+', '-', '*', '/']

function calc(num1, op, num2) {
  if (op === '+') return num1 + num2
  if (op === '-') return num1 - num2
  if (op === '*') return num1 * num2
  if (op === '/') return num1 / num2
}

let numIndex = 0

function Game2() {
  const [set, setSet] = useState(NUMBERS[0])

  const start = () => {
    setSet(NUMBERS[numIndex % NUMBERS.length])
    numIndex++
  }

  useEffect(() => { start() }, [])

  const [num1, num2, result] = set

  const handleOp = (op) => {
    if (Math.abs(calc(num1, op, num2) - result) < 0.001) {
      // ✏️ 改2：胜利文字
      alert('You won!')
      start()
    } else {
      // ✏️ 改3：失败文字
      alert('Incorrect, try again')
    }
  }

  const boxStyle = {
    width: 100, height: 100,
    // ✏️ 改4：方块颜色
    background: 'rgb(200,255,255)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.8em', fontWeight: 'bold',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20 }}>
      <h1>Math Game</h1>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <div style={boxStyle}>{num1}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* ✏️ 改5：按钮标签（考试按题目要求） */}
          {['+', '-', '×', '÷'].map((label, i) => (
            <button key={label} onClick={() => handleOp(OPERATORS[i])}
              style={{ padding: '4px 16px', fontSize: '1.2em', cursor: 'pointer' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={boxStyle}>{num2}</div>
        <div style={boxStyle}>=</div>
        <div style={boxStyle}>{result}</div>
      </div>
    </div>
  )
}

export default Game2
