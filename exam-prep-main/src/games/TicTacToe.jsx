import { useState, useEffect } from 'react';
import { recordWin } from '../pages/Dashboard';

// ========================================================
// 井字棋 Tic-Tac-Toe（exercise 原题，高概率）
// 3×3 格子，X 和 O 轮流，四种胜利条件
// 胜利格子变绿，localStorage 记录胜场
// ========================================================

const WIN_LINES = [
  [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15], // 横
  [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15], // 纵
  [0, 5, 10, 15], [3, 6, 9, 12],         // 斜
];

function checkWinner(cells) {
  for (const [a, b, c] of WIN_LINES) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c])
      return { winner: cells[a], line: [a, b, c] };
  }
  return null;
}

export default function TicTacToe() {
  // ============ ① state 声明区 ============
  const [cells, setCells] = useState(Array(16).fill(null));
  const [isX, setIsX] = useState(true);
  const [result, setResult] = useState(null); // { winner, line }
  const [winsX, setWinsX] = useState(() => parseInt(localStorage.getItem('ttt_X') || '0'));
  const [winsO, setWinsO] = useState(() => parseInt(localStorage.getItem('ttt_O') || '0'));
  const [moves, setMoves] = useState(0); // ✅ 已加：总回合数

  // ============ ② reset 函数区（重置所有 state）============
  // ⚠️ 还缺 setMoves(0)，加在这里
  const reset = () => { setCells(Array(16).fill(null)); setIsX(true); setResult(null); setMoves(0);};

  // ============ ③ handleClick 函数区（每次落子时触发）============
  const handleClick = (i) => {
    if (cells[i] || result) return;
    const next = [...cells];
    next[i] = isX ? 'X' : 'O';
    setCells(next);
    setMoves(m => m + 1); // ✅ 已加：每落子一次 +1
    setIsX(x => !x);

    const res = checkWinner(next);
    if (res) {
      setResult(res);
      // 更新 localStorage 胜场
      const key = `ttt_${res.winner}`;
      const newCount = parseInt(localStorage.getItem(key) || '0') + 1;
      localStorage.setItem(key, newCount);
      if (res.winner === 'X') { setWinsX(newCount); recordWin(); }
      else setWinsO(newCount);
    } else if (next.every(c => c)) {
      setResult({ winner: null, line: [] }); // 平局
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '60vh', gap: 16 }}>
      <div style={{ display: 'flex', gap: 40, fontSize: '1.1em' }}>
        <span>Player X wins: <strong>{winsX}</strong></span>
        <span>Player O wins: <strong>{winsO}</strong></span>
      </div>

      {result
        ? <p style={{ fontSize: '1.4em', color: 'green' }}>
          {result.winner ? `${result.winner} wins!` : "It's a draw!"}
        </p>
        : <p style={{ fontSize: '1.2em' }}>Player <strong>{isX ? 'X' : 'O'}</strong>'s turn</p>
      }

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 100px)', gap: 4 }}>
        {cells.map((cell, i) => {
          const isWinCell = result?.line?.includes(i);
          return (
            <div key={i} onClick={() => handleClick(i)} style={{
              width: 100, height: 100,
              backgroundColor: isWinCell ? 'orange' : '#f0f0f0',
              border: '2px solid #333',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5em', fontWeight: 'bold',
              color: isWinCell ? 'white' : cell === 'X' ? '#1976d2' : '#d32f2f',
              cursor: cell || result ? 'default' : 'pointer',
            }}>
              {cell}
            </div>
          );
        })}
      </div>

      {/* ============ ④ 渲染区：新增显示内容放这里 ============ */}

      <p>Total moves: {moves}</p>
      <button onClick={reset} style={{ padding: '8px 32px', fontSize: '1em', cursor: 'pointer' }}>Reset</button>
    </div>
  );
}
