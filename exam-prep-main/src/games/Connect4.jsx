import { useState, useRef } from 'react';
import { recordWin } from '../pages/Dashboard';

// ================================================================
// 游戏：Connect 4（四子棋）
// 玩法：两个玩家轮流点击某列，棋子落到该列最底部空格
//       先连成 WIN_LENGTH 个（横/竖/斜）的玩家赢
// ================================================================
//
// ★ 考试时最常需要改的参数（全部在顶部）：
//
//   COLS        → 棋盘列数（默认10）
//   ROWS        → 棋盘行数（默认10）
//   WIN_LENGTH  → 连几个赢（默认4，改成3更容易赢）
//   CELL_SIZE   → 每个格子的大小（像素）
//   P1_COLOR    → 玩家1的棋子颜色
//   P2_COLOR    → 玩家2的棋子颜色
//
// ================================================================

// ---- 可改参数 -----------------------------------------------
const COLS       = 7;      // 棋盘列数
const ROWS       = 6;      // 棋盘行数
const WIN_LENGTH = 4;       // 连几个赢
const CELL_SIZE  = 50;      // 每个格子大小（像素）
const P1_COLOR   = 'red';  // 玩家1棋子颜色
const P2_COLOR   = 'yellow';   // 玩家2棋子颜色
// -------------------------------------------------------------

// 创建空棋盘：ROWS 行 × COLS 列，全部填 null（表示空格）
// 例：ROWS=3, COLS=3 → [[null,null,null],[null,null,null],[null,null,null]]
const empty = () => Array(ROWS).fill(null).map(() => Array(COLS).fill(null));

// 检查某个颜色（玩家）是否赢了
// board = 二维棋盘，color = 要检查的玩家（1 或 2）
function checkWin(board, color) {
  // 横向检查：从左到右，找连续 WIN_LENGTH 个相同颜色
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c <= COLS - WIN_LENGTH; c++)
      if (Array.from({ length: WIN_LENGTH }, (_, i) => board[r][c + i]).every(v => v === color))
        return true;

  // 纵向检查：从上到下
  for (let r = 0; r <= ROWS - WIN_LENGTH; r++)
    for (let c = 0; c < COLS; c++)
      if (Array.from({ length: WIN_LENGTH }, (_, i) => board[r + i][c]).every(v => v === color))
        return true;

  // 右斜检查：从左上到右下（↘方向）
  for (let r = 0; r <= ROWS - WIN_LENGTH; r++)
    for (let c = 0; c <= COLS - WIN_LENGTH; c++)
      if (Array.from({ length: WIN_LENGTH }, (_, i) => board[r + i][c + i]).every(v => v === color))
        return true;

  // 左斜检查：从右上到左下（↙方向）
  for (let r = 0; r <= ROWS - WIN_LENGTH; r++)
    for (let c = WIN_LENGTH - 1; c < COLS; c++)
      if (Array.from({ length: WIN_LENGTH }, (_, i) => board[r + i][c - i]).every(v => v === color))
        return true;

  return false; // 没有赢
}

// ================================================================
// 主组件
// ================================================================
export default function Connect4() {
  // board     → 二维棋盘数组，null=空，1=玩家1，2=玩家2
  // player    → 当前轮到的玩家（1 或 2）
  // winner    → 赢家（null=未结束，1=玩家1赢，2=玩家2赢）
  // animating → 胜利动画播放中（此时不能落子）
  // animFrame → 动画闪烁状态（true/false 交替，用于黑白闪烁效果）
  const [board,     setBoard]     = useState(empty());
  const [player,    setPlayer]    = useState(1);
  const [winner,    setWinner]    = useState(null);
  const [animating, setAnimating] = useState(false);
  const [animFrame, setAnimFrame] = useState(false);
  const intervalRef = useRef(null); // 用于存储定时器 id，方便清除

  // 重置游戏
  const reset = () => {
    setBoard(empty());
    setPlayer(1);
    setWinner(null);
    setAnimating(false);
    clearInterval(intervalRef.current); // 清除正在播放的动画定时器
  };

  // 玩家点击某列时触发（col = 被点击的列编号，从0开始）
  const dropCoin = (col) => {
    if (winner || animating) return; // 游戏结束或动画中，不响应

    // 从棋盘底部向上找该列第一个空格
    // 例：某列 [null, null, 1, 2] → 找到下标1（第2行）
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][col]) { row = r; break; }
    }
    if (row === -1) return; // 该列已满，不能再落子

    // 在找到的位置放上当前玩家的棋子
    const newBoard = board.map(r => [...r]); // 深拷贝棋盘（不能直接修改原数组）
    newBoard[row][col] = player;
    setBoard(newBoard);

    const color = player;
    if (checkWin(newBoard, color)) {
      // 胜利！播放闪烁动画（棋盘黑白交替闪3秒）
      setAnimating(true);
      let count = 0;
      intervalRef.current = setInterval(() => {
        setAnimFrame(f => !f); // 切换闪烁状态
        count++;
        if (count >= 6) { // 6次 × 0.5秒 = 3秒后结束动画
          clearInterval(intervalRef.current);
          setAnimating(false);
          setWinner(color);
          if (color === 1) recordWin(); // 玩家1赢才记分
        }
      }, 500);
    } else {
      // 没赢，换下一个玩家
      setPlayer(p => p === 1 ? 2 : 1);
    }
  };

  // 当前棋盘上已落子总数（用于显示步数）
  const totalMoves = board.flat().filter(Boolean).length;

  // ---- 渲染 ----
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: '60vh', gap: 16,
    }}>
      <p>Player {player}'s turn &nbsp;|&nbsp; Moves: {totalMoves}</p>

      {/* 棋盘区域（position:relative 用于放置胜利弹窗）*/}
      <div style={{ position: 'relative' }}>
        {/* 棋盘格子：COLS 列，每格 CELL_SIZE px */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
          {board.map((row, r) => row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => dropCoin(c)} // 点击任意格子 = 点击该列
              style={{
                width: CELL_SIZE, height: CELL_SIZE,
                border: '2px solid #333',
                boxSizing: 'border-box',
                // 动画中交替黑白；平时白色
                backgroundColor: animating ? (animFrame ? '#fff' : '#000') : '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: winner || animating ? 'default' : 'pointer',
              }}
            >
              {/* 有棋子且不在动画中 → 画圆形棋子 */}
              {cell && !animating && (
                <div style={{
                  width: CELL_SIZE - 14,
                  height: CELL_SIZE - 14,
                  borderRadius: '50%', // 圆形
                  backgroundColor: cell === 1 ? P1_COLOR : P2_COLOR,
                }} />
              )}
            </div>
          )))}
        </div>

        {/* 胜利提示框（绝对定位，出现在棋盘正中央）*/}
        {winner && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            backgroundColor: '#fff', border: '1px solid #333',
            width: 200, height: 60,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: '14pt' }}>
              Player {winner} wins!
            </span>
            <span style={{ fontSize: '0.8em' }}>
              {totalMoves} moves total
            </span>
          </div>
        )}
      </div>

      {/* 重置按钮 */}
      <button onClick={reset} style={{ padding: '8px 32px', cursor: 'pointer' }}>
        Reset
      </button>
    </div>
  );
}
