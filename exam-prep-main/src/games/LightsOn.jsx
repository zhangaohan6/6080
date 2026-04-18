import { useState } from 'react';
import { recordWin } from '../pages/Dashboard';

// ========================================================
// Lights On（exercise 原题，高概率）
// 5×5 格子，点击一格 → 该格及上下左右全部翻转
// 目标：所有灯全部关闭（全为 false）
//
// 考试时修改：
//   SIZE       格子边长（默认5）
//   WIN_STATE  true = 全亮赢 / false = 全灭赢
// ========================================================

const SIZE = 5;
const WIN_STATE = false; // false = 全灭赢（Lights Out 经典规则）

function randomBoard() {
  return Array(SIZE * SIZE).fill(null).map(() => Math.random() > 0.5);
}

function getAdjacent(i) {
  const r = Math.floor(i / SIZE), c = i % SIZE;
  const adj = [i];
  if (r > 0)        adj.push(i - SIZE);
  if (r < SIZE - 1) adj.push(i + SIZE);
  if (c > 0)        adj.push(i - 1);
  if (c < SIZE - 1) adj.push(i + 1);
  return adj;
}

export default function LightsOn() {
  const [lights, setLights] = useState(randomBoard);
  const [moves, setMoves]   = useState(0);

  const reset = () => { setLights(randomBoard()); setMoves(0); };

  const handleClick = (i) => {
    const adj = getAdjacent(i);
    const next = [...lights];
    adj.forEach(idx => { next[idx] = !next[idx]; });
    setLights(next);
    setMoves(m => m + 1);

    if (next.every(l => l === WIN_STATE)) {
      alert('Congratulations! You won!');
      recordWin();
      reset();
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', minHeight:'60vh', gap:16 }}>
      <h2>Lights On</h2>
      <p>Goal: turn {WIN_STATE ? 'ON' : 'OFF'} all lights &nbsp;|&nbsp; Moves: <strong>{moves}</strong></p>

      <div style={{ display:'grid', gridTemplateColumns:`repeat(${SIZE}, 80px)`, gap:4 }}>
        {lights.map((on, i) => (
          <div key={i} onClick={() => handleClick(i)} style={{
            width:80, height:80,
            backgroundColor: on ? '#FFD700' : '#333',
            border:'2px solid #555',
            borderRadius:8,
            cursor:'pointer',
            transition:'background-color 0.15s',
          }} />
        ))}
      </div>

      <button onClick={reset} style={{ padding:'8px 32px', fontSize:'1em', cursor:'pointer' }}>Reset</button>
    </div>
  );
}
