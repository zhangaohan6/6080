import { useState, useEffect } from 'react';
import { recordWin } from '../pages/Dashboard';

// ========================================================
// 数学运算游戏（21年 Random Operators / 22年 Operation Blanks）
//
// MODE = 'input'  → 显示算式，用户输入答案（21年格式）
// MODE = 'button' → 显示三个数，用户按运算符按钮（22年格式）
//
// 考试时修改：
//   MODE         切换两种模式
//   NUMBERS      22年格式用固定数字列表
//   OPERATORS    考试可能只用 + - × ÷ 四种（去掉 %）
// ========================================================

const MODE = 'input'; // 'input' | 'button'

const OPERATORS = ['+', '-', '*', '/'];

// 22年格式的固定数字列表（考试时从题目复制）
const NUMBERS = [
  [1, 2, 2],   // num1, num2, result → 即 1 ? 2 = 2  答案是 *
  [3, 6, -3],
  [8, 3, 11],
  [9, 8, 17],
  [5, 4, 9],
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calc(a, op, b) {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  if (op === '*') return a * b;
  if (op === '/') return b !== 0 ? a / b : null;
  return null;
}

// ---- MODE: input ----
function InputMode() {
  const [num1, setNum1] = useState(1);
  const [num2, setNum2] = useState(1);
  const [op, setOp]     = useState('+');
  const [answer, setAnswer] = useState('');

  const start = () => {
    setNum1(randomInt(1, 50));
    setNum2(randomInt(1, 50));
    setOp(OPERATORS[Math.floor(Math.random() * OPERATORS.length)]);
    setAnswer('');
  };

  useEffect(() => { start(); }, []);

  const correct = calc(num1, op, num2);
  const correctStr = correct !== null
    ? (Number.isInteger(correct) ? String(correct) : correct.toFixed(1))
    : null;

  const handleKeyUp = (e) => {
    if (correctStr && e.target.value === correctStr) {
      alert('Congratulations!');
      recordWin();
      start();
    }
  };

  const boxStyle = {
    width:100, height:100,
    background:'linear-gradient(to right, #abcabc, #cbacbd)',
    display:'flex', alignItems:'center', justifyContent:'center',
    color:'#333', fontSize:'1.5em',
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', minHeight:'60vh', gap:20 }}>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <div style={boxStyle}>{num1}</div>
        <div style={boxStyle}>{op === '*' ? '×' : op === '/' ? '÷' : op}</div>
        <div style={boxStyle}>{num2}</div>
        <div style={boxStyle}>=</div>
        <div style={{ ...boxStyle, background:'#fff', border:'1px solid #ccc' }}>
          <input
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyUp={handleKeyUp}
            style={{ width:70, textAlign:'center', fontSize:'1.2em', border:'none', outline:'none' }}
          />
        </div>
      </div>
      <button onClick={start} style={{ padding:'8px 32px', cursor:'pointer' }}>Reset</button>
    </div>
  );
}

// ---- MODE: button ----
let numIndex = 0;

function ButtonMode() {
  const [set, setSet] = useState(NUMBERS[0]);

  const start = () => {
    setSet(NUMBERS[numIndex % NUMBERS.length]);
    numIndex++;
  };

  useEffect(() => { start(); }, []);

  const [num1, num2, result] = set;

  const handleOp = (op) => {
    if (Math.abs(calc(num1, op, num2) - result) < 0.001) {
      alert('You won!');
      recordWin();
      start();
    } else {
      alert('Incorrect, try again');
    }
  };

  const boxStyle = {
    width:100, height:100,
    display:'flex', alignItems:'center', justifyContent:'center',
    background:'rgb(200,255,255)', fontSize:'1.8em', fontWeight:'bold',
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', minHeight:'60vh', gap:20 }}>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <div style={boxStyle}>{num1}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          {['+', '-', '×', '÷'].map((label, i) => (
            <button key={label} onClick={() => handleOp(OPERATORS[i])}
              style={{ padding:'4px 16px', fontSize:'1.2em', cursor:'pointer' }}>
              {label}
            </button>
          ))}
        </div>
        <div style={boxStyle}>{num2}</div>
        <div style={boxStyle}>=</div>
        <div style={boxStyle}>{result}</div>
      </div>
    </div>
  );
}

export default function MathOperators() {
  return MODE === 'input' ? <InputMode /> : <ButtonMode />;
}
