import { useState } from 'react';
import { recordWin } from '../pages/Dashboard';

// ========================================================
// Slido — 滑块拼图（20年样题 / B类）
// 3×3 格子，8块 + 1空格，点击相邻块移动到空格位置
// 还原顺序 [1,2,3,4,5,6,7,8,空] 即为胜利
//
// 考试时修改：
//   SIZE      格子边长（通常3，即3×3）
//   CELL_SIZE 每格像素大小
//   BG_COLOR  块的背景色
// ========================================================

const SIZE = 3;
const CELL_SIZE = 120;
const BG_COLOR = '#4a90d9';

const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0]; // 0 代表空格

// 判断是否可解（逆序数奇偶性）
function isSolvable(tiles) {
  const arr = tiles.filter(t => t !== 0);
  let inv = 0;
  for (let i = 0; i < arr.length; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] > arr[j]) inv++;
  return inv % 2 === 0;
}

function newShuffle() {
  let tiles;
  do {
    tiles = [...SOLVED].sort(() => Math.random() - 0.5);
  } while (!isSolvable(tiles) || tiles.join('') === SOLVED.join(''));
  return tiles;
}

// 判断两个格子是否相邻（曼哈顿距离=1）
function isAdjacent(i, j) {
  const ri = Math.floor(i / SIZE), ci = i % SIZE;
  const rj = Math.floor(j / SIZE), cj = j % SIZE;
  return Math.abs(ri - rj) + Math.abs(ci - cj) === 1;
}

export default function Slido() {
  const [tiles, setTiles] = useState(newShuffle);
  const [moves, setMoves] = useState(0);

  const reset = () => { setTiles(newShuffle()); setMoves(0); };

  // SOLVE 按钮：直接还原（考试用，省去 A* 算法）
  const solve = () => { setTiles([...SOLVED]); };

  const handleClick = (i) => {
    const emptyIdx = tiles.indexOf(0);
    if (!isAdjacent(i, emptyIdx)) return;

    const next = [...tiles];
    [next[i], next[emptyIdx]] = [next[emptyIdx], next[i]];
    setTiles(next);
    setMoves(m => m + 1);

    if (next.join('') === SOLVED.join('')) {
      alert('Congratulations!');
      recordWin();
      reset();
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: '60vh', gap: 20,
    }}>
      <p style={{ fontSize: '1.1em' }}>Moves: {moves}</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${SIZE}, ${CELL_SIZE}px)`,
        gap: 4,
      }}>
        {tiles.map((tile, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              backgroundColor: tile === 0 ? '#eee' : BG_COLOR,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5em',
              fontWeight: 'bold',
              cursor: tile === 0 ? 'default' : 'pointer',
              borderRadius: 6,
              border: tile === 0 ? '2px dashed #ccc' : '2px solid #357abd',
              userSelect: 'none',
            }}
          >
            {tile !== 0 ? tile : ''}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={reset} style={{ padding: '10px 28px', fontSize: '1em', cursor: 'pointer' }}>
          RESET
        </button>
        <button onClick={solve} style={{ padding: '10px 28px', fontSize: '1em', cursor: 'pointer' }}>
          SOLVE
        </button>
      </div>
    </div>
  );
}
