import { useState } from 'react';
import { recordWin } from '../pages/Dashboard';

// ================================================================
// 游戏：猜数字（Guess the Number）
// 玩法：系统随机生成一个数字，玩家输入猜测，系统提示"太大/太小"
//       猜对了赢，可以限制最多猜几次
// ================================================================
//
// ★ 考试时最常需要改的参数（全部在顶部）：
//
//   MIN         → 数字范围最小值（默认1）
//   MAX         → 数字范围最大值（默认100）
//   MAX_TRIES   → 最多猜几次（0 = 无限次）
//
// ================================================================

// ---- 可改参数 -----------------------------------------------
const MIN       = 1;    // 数字范围下限
const MAX       = 200;  // 数字范围上限
const MAX_TRIES = 7;    // 最多几次机会（0 = 不限次数）
// -------------------------------------------------------------

// ================================================================
// 主组件
// ================================================================
export default function GuessNumber() {
  // answer     → 本局答案（只生成一次，用函数初始化避免每次渲染重新生成）
  //              Math.floor(Math.random() * (MAX - MIN + 1)) + MIN
  //              例：MIN=1, MAX=100 → 随机整数 1~100
  const [answer] = useState(() => Math.floor(Math.random() * (MAX - MIN + 1)) + MIN);

  // input      → 输入框当前内容（字符串）
  // hint       → 提示文字（太大/太小/正确）
  // tries      → 已猜次数
  // won        → 是否已经猜对（猜对后禁用输入框和按钮）
  // forceReset → 用于强制整个组件重新挂载（实现真正的重置，重新生成答案）
  // useState 固定格式：const [读取值, 写入函数] = useState(初始值)
  //   读取值    → 直接用变量名，例如 hint、input
  //   写入函数  → 用 setXxx(...) 更新，React 自动重新渲染
  const [input,      setInput]      = useState('');
  const [hint,       setHint]       = useState(''); // hint 读取  setHint(...) 写入
  const [tries,      setTries]      = useState(0);
  const [won,        setWon]        = useState(false);
  const [, forceReset] = useState(0); // 用数字自增触发重新挂载
//const [xxx, setXxx] = useState(初始值)
       //↑读       ↑写


  // 重置游戏：让整个组件重新挂载（answer 会重新随机生成）
  const reset = () => forceReset(n => n + 1);

  // 处理猜测逻辑（点击按钮或按 Enter 时触发）
  const handleGuess = () => {
    const num = parseInt(input); // 把输入字符串转成整数
    if (isNaN(num)) {
      // 输入不是数字
      setHint('Please enter a valid number');
      return;
    }

    const newTries = tries + 1;
    setTries(newTries);
    setInput(''); // 清空输入框，方便继续输入

    if (num === answer) {
      // ✅ 猜对了！
      setHint(`Correct! You got it in ${newTries} tries!`);
      setWon(true);
      alert('Congratulations!');
      recordWin(); // 通知 Dashboard 记录一次胜利
      return;
    }

    // 判断次数是否用完（MAX_TRIES > 0 才有次数限制）
    if (MAX_TRIES > 0 && newTries >= MAX_TRIES) {
      setHint(`Game over! The answer was ${answer}.`);
      return;
    }

    // ❌ 猜错了，给提示
    // num < answer → 猜的数太小，提示往大猜
    // num > answer → 猜的数太大，提示往小猜
    setHint(num < answer ? `📈 Too low! ${MAX_TRIES - newTries} guesses left.` : `📉 Too high! ${MAX_TRIES - newTries} guesses left.`);
  };

  // ---- 渲染 ----
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: '60vh', gap: 20,
    }}>
      <h2>Guess the Number</h2>

      {/* 提示范围 */}
      <p style={{ color: '#555' }}>
        I'm thinking of a number between {MIN} and {MAX}
        {MAX_TRIES > 0 && ` (max ${MAX_TRIES} tries)`}
      </p>

      {/* 输入区域：输入框 + 猜测按钮 */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="number"
          value={input}
          onChange={e => setInput(e.target.value)}
          // 按 Enter 键 = 点击 Guess 按钮
          onKeyDown={e => e.key === 'Enter' && !won && handleGuess()}
          placeholder={`${MIN} - ${MAX}`}
          disabled={won} // 猜对后禁用输入
          style={{
            padding: '8px 12px', fontSize: '1.2em',
            width: 120, textAlign: 'center',
          }}
        />
        <button
          onClick={handleGuess}
          disabled={won} // 猜对后禁用按钮
          style={{
            padding: '8px 24px', fontSize: '1em',
            cursor: won ? 'default' : 'pointer',
          }}
        >
          Guess
        </button>
      </div>

      {/* 提示文字（太大/太小/猜对了）
          color 用嵌套三元（代替 if-else）：
            won                    → 'green'
            hint 含 'Too high'     → 'red'
            hint 含 'Too low'      → 'blue'
            其他                   → '#333'
          格式：条件1 ? A : 条件2 ? B : 条件3 ? C : D */}
      {hint && (
        <p style={{ fontSize: '1.2em', color: won ? 'green' : hint.includes('Too high') ? 'red' : hint.includes('Too low') ? 'blue' : '#333' }}>
          {hint}
        </p>
      )}

      {/* 已猜次数 */}
      <p style={{ color: '#999' }}>Attempts: {tries}</p>

      {/* 重置按钮（重新生成答案）*/}
      <button onClick={reset} style={{ padding: '8px 24px', cursor: 'pointer' }}>
        New Game
      </button>
    </div>
  );
}
