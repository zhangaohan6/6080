import { useState, useEffect } from 'react';
import { recordWin } from '../pages/Dashboard';

// ================================================================
// 游戏：Blanko（填字游戏）
// 玩法：显示一个单词，随机挖掉几个字母，玩家填入正确字母赢
// ================================================================
//
// ★ 考试时最常需要改的参数（全部在顶部）：
//
//   WORDS         → 换成题目要求的单词列表
//   BLANK_COUNT   → 挖掉几个字母（默认3个）
//   WORD_LENGTH   → 每个单词显示几个格子（默认12）
//   CELL_SIZE     → 每个字母格子的大小（像素）
//
// ================================================================

// ---- 可改参数 -----------------------------------------------
// 单词列表：考试时换成题目给的单词，不够12个字符会自动补空格
const WORDS = [
  'JAVASCRIPT',
  'REACT',
  'FRONTEND'
];

const BLANK_COUNT = 2;   // 挖掉几个字母（考试可能要求不同数量）
const WORD_LENGTH = 12;  // 每个单词显示的总格子数（不够就补空格）
const CELL_SIZE   = 60;  // 每个格子的宽高（像素）
// -------------------------------------------------------------

// 把单词转成大写，并补空格到 WORD_LENGTH 个字符
// 例：'HELLO' → 'HELLO       '（共12个字符）
function padToLength(str) {
  return str.toUpperCase().padEnd(WORD_LENGTH, ' ');
}

// ================================================================
// 主组件
// ================================================================
export default function Blanko() {
  // word   → 当前单词拆成字母数组，例：['H','E','L','L','O',' ',' ',...]
  // blanks → 被挖空的位置下标，例：[2, 5, 9]
  // inputs → 玩家填入的字母，例：{2:'L', 5:'A'}（key=位置, value=字母）
  const [word,   setWord]   = useState([]);
  const [blanks, setBlanks] = useState([]);
  const [inputs, setInputs] = useState({});

  // 开始/重置一局游戏
  const startGame = () => {
    // 1. 随机选一个单词
    const raw = WORDS[Math.floor(Math.random() * WORDS.length)];

    // 2. 转成固定长度的字母数组
    //    例：'HELLO' → ['H','E','L','L','O',' ',' ',...] 共12个
    const chars = padToLength(raw).split('');

    // 3. 找出所有不是空格的位置（只有字母位置才能被挖空）
    const nonSpace = chars
      .map((c, i) => c !== ' ' ? i : -1)
      .filter(i => i !== -1);

    // 4. 随机打乱，取前 BLANK_COUNT 个位置作为空格
    const blankPos = nonSpace
      .sort(() => Math.random() - 0.5)
      .slice(0, BLANK_COUNT);

    setWord(chars);
    setBlanks(blankPos);
    setInputs({}); // 清空之前的输入
  };

  // 页面加载时自动开始游戏
  useEffect(() => { startGame(); }, []);

  // 当玩家在某个空格输入字母时触发
  // pos = 输入框所在位置（数组下标），val = 玩家输入的内容
  const handleInput = (pos, val) => {
    // 只保留第1个字符，且转大写（例：输入 'ab' → 只留 'A'）
    const newInputs = { ...inputs, [pos]: val.toUpperCase().slice(0, 1) };
    setInputs(newInputs);

    // 判断胜利：所有空格位置的输入都等于原单词对应字母？
    // blanks.every(b => ...) 意思是"每一个空格都满足条件"
    if (blanks.every(b => newInputs[b] === word[b])) {
      alert('Well done!!');
      recordWin(); // 通知 Dashboard 记录一次胜利
      startGame(); // 换下一个单词
    }
  };

  // ---- 渲染 ----
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: '60vh', gap: 24,
    }}>
      {/* 单词展示区：每个字符一个格子 */}
      <div style={{ display: 'flex' }}>
        {word.map((char, i) => (
          <div key={i} style={{
            width: CELL_SIZE, height: CELL_SIZE,
            border: '1px solid #333',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4em', fontWeight: 'bold',
          }}>
            {blanks.includes(i)
              // 被挖空的位置 → 显示输入框
              ? <input
                  value={inputs[i] || ''}
                  onChange={e => handleInput(i, e.target.value)}
                  maxLength={1}
                  style={{
                    width: CELL_SIZE - 16, height: CELL_SIZE - 16,
                    textAlign: 'center', fontSize: '1.2em',
                    border: 'none', outline: 'none',
                  }}
                />
              // 普通字母位置 → 直接显示（空格字符显示为空）
              : char === ' ' ? '' : char
            }
          </div>
        ))}
      </div>

      {/* 重置按钮 */}
      <button onClick={startGame} style={{ padding: '8px 32px', fontSize: '1em', cursor: 'pointer' }}>
        RESET
      </button>
    </div>
  );
}
