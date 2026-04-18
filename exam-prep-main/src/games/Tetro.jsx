import { useState, useEffect, useRef, useCallback } from 'react';
import { recordWin } from '../pages/Dashboard';

// ========================================================
// Tetro — 简化版俄罗斯方块（20年样题）
// 10列 x 12行，三种形状，每秒下落一格
// 横向满行变绿，5行绿 → 赢；超过第8行 → 输
// 考试时修改：COLS / ROWS / WIN_ROWS / TICK_MS
// ========================================================

const COLS = 10;
const ROWS = 12;
const WIN_ROWS = 5;    // 几行变绿算赢
const LOSE_ROW = 7;    // 超过第几行算输（0-indexed，从顶部算）
const TICK_MS = 1000;  // 下落间隔

// 形状定义：每个形状是占据的 [row, col] 偏移列表（相对左上角）
const SHAPES = [
  [[0,0],[0,1],[1,0],[1,1]], // 2x2
  [[0,0],[1,0]],             // 2x1 竖条
  [[0,0]],                   // 1x1
];

const emptyBoard = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

function canPlace(board, shape, row, col) {
  return shape.every(([dr, dc]) => {
    const r = row + dr, c = col + dc;
    return r >= 0 && r < ROWS && c >= 0 && c < COLS && !board[r][c];
  });
}

function placeShape(board, shape, row, col, color) {
  const next = board.map(r => [...r]);
  shape.forEach(([dr, dc]) => { next[row + dr][col + dc] = color; });
  return next;
}

export default function Tetro() {
  const [board, setBoard]       = useState(emptyBoard);
  const [active, setActive]     = useState(null); // { shape, row, col }
  const [started, setStarted]   = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [greenRows, setGreenRows] = useState(0);
  const boardRef  = useRef(null);
  const tickRef   = useRef(null);
  const stateRef  = useRef({ board: emptyBoard(), active: null });

  const spawnBlock = useCallback((currentBoard) => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const col   = 0;
    const row   = 0;
    if (!canPlace(currentBoard, shape, row, col)) {
      // 无法放置 → 游戏结束
      alert('Failed');
      const fresh = emptyBoard();
      setBoard(fresh);
      setGreenRows(0);
      setStarted(false);
      setActive(null);
      stateRef.current = { board: fresh, active: null };
      return;
    }
    const next = { shape, row, col };
    stateRef.current.active = next;
    setActive(next);
  }, []);

  const lockAndSpawn = useCallback((board, shape, row, col) => {
    let next = placeShape(board, shape, row, col, 'block');

    // 检查满行
    let filled = 0;
    next = next.map(r => {
      if (r.every(c => c !== null)) { filled++; return r.map(() => 'green'); }
      return r;
    });

    const totalGreen = next.flat().filter(c => c === 'green').length / COLS;
    setGreenRows(totalGreen);
    stateRef.current.board = next;
    setBoard(next);

    // 检查超出高度 → 输
    const hasBlockAbove = next.slice(0, LOSE_ROW).some(r => r.some(c => c === 'block'));
    if (hasBlockAbove) {
      alert('Failed');
      const fresh = emptyBoard();
      setBoard(fresh);
      setGreenRows(0);
      setStarted(false);
      setActive(null);
      stateRef.current = { board: fresh, active: null };
      clearInterval(tickRef.current);
      return;
    }

    // 检查赢
    if (totalGreen >= WIN_ROWS) {
      alert('Congrats!');
      recordWin();
      const fresh = emptyBoard();
      setBoard(fresh);
      setGreenRows(0);
      setStarted(false);
      setActive(null);
      stateRef.current = { board: fresh, active: null };
      clearInterval(tickRef.current);
      return;
    }

    spawnBlock(next);
  }, [spawnBlock]);

  // 定时下落
  const startTick = useCallback(() => {
    clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      const { board, active } = stateRef.current;
      if (!active) return;
      const { shape, row, col } = active;
      if (canPlace(board, shape, row + 1, col)) {
        const next = { shape, row: row + 1, col };
        stateRef.current.active = next;
        setActive(next);
      } else {
        lockAndSpawn(board, shape, row, col);
      }
    }, TICK_MS);
  }, [lockAndSpawn]);

  // 点击棋盘开始游戏
  const handleBoardClick = () => {
    if (started) return;
    setStarted(true);
    const fresh = emptyBoard();
    stateRef.current.board = fresh;
    setBoard(fresh);
    spawnBlock(fresh);
    startTick();
  };

  // 键盘左右移动
  useEffect(() => {
    const handleKey = (e) => {
      if (!started) return;
      const { board, active } = stateRef.current;
      if (!active) return;
      const { shape, row, col } = active;
      let newCol = col;
      if (e.key === 'ArrowLeft')  newCol = col - 1;
      if (e.key === 'ArrowRight') newCol = col + 1;
      if (newCol !== col && canPlace(board, shape, row, newCol)) {
        const next = { shape, row, col: newCol };
        stateRef.current.active = next;
        setActive(next);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [started]);

  useEffect(() => () => clearInterval(tickRef.current), []);

  // 渲染：把 active 方块叠加到 board 上
  const displayBoard = active
    ? placeShape(board, active.shape, active.row, active.col, 'active')
    : board;

  const cellColor = (val) => {
    if (val === 'green')  return 'rgb(0,255,0)';
    if (val === 'block')  return '#666';
    if (val === 'active') return 'tomato';
    return 'transparent';
  };

  return (
    <div style={{ display:'flex', flexDirection:'column' }}>
      <div
        ref={boardRef}
        onClick={handleBoardClick}
        tabIndex={0}
        style={{
          display:'grid',
          gridTemplateColumns:`repeat(${COLS}, 1fr)`,
          margin:'20px 20px 100px 20px',
          border:'1px solid #333',
          cursor: started ? 'default' : 'pointer',
          outline:'none',
        }}
      >
        {displayBoard.map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} style={{
            aspectRatio:'1',
            border:'1px solid #333333',
            backgroundColor: cellColor(cell),
            boxSizing:'border-box',
          }} />
        )))}
      </div>
      {!started && <p style={{ textAlign:'center', color:'#555' }}>点击棋盘开始游戏</p>}
      <button onClick={() => {
        clearInterval(tickRef.current);
        const fresh = emptyBoard();
        stateRef.current = { board: fresh, active: null };
        setBoard(fresh);
        setActive(null);
        setStarted(false);
        setGreenRows(0);
      }} style={{ margin:'0 20px', padding:'8px', cursor:'pointer' }}>
        Reset
      </button>
    </div>
  );
}
