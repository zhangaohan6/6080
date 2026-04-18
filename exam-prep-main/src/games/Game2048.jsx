import { useState, useEffect, useCallback } from 'react';
import { recordWin } from '../pages/Dashboard';

// ================================================================
// 游戏：2048
// 玩法：方向键滑动，相同数字合并，合并出 2048 获胜
// ================================================================
//
// ★ 考试时最常需要改的参数（全部在顶部）：
//
//   SIZE        → 棋盘大小（4 = 4×4，5 = 5×5）
//   WIN_TARGET  → 赢的数字（默认 2048，改成 512 可以更容易赢）
//   CELL_SIZE   → 每个格子的像素大小（默认 100px）
//   NEW_TILE_4_CHANCE → 新出现 4 的概率（默认 10%）
//
// ================================================================

// ---- 可改参数 -----------------------------------------------
const SIZE = 4;              // 棋盘边长（4 = 4×4格，改5就变5×5）
const WIN_TARGET = 2048;     // 达到这个数字就赢（改小更容易赢）
const CELL_SIZE = 100;       // 每个格子的宽高（像素）
const CELL_GAP = 8;          // 格子之间的间距（像素）
const NEW_TILE_4_CHANCE = 0.1; // 新格子是4的概率（0.1 = 10%）
// -------------------------------------------------------------

// 空棋盘：长度为 SIZE×SIZE 的数组，全填 0
// 例如 SIZE=4 → [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0]
const empty = () => Array(SIZE * SIZE).fill(0);

// 随机在一个空格子里放一个新数字（2 或 4）
function addRandom(cells) {
  // 找出所有值为 0 的格子的下标
  const empties = cells.map((v, i) => v === 0 ? i : -1).filter(i => i !== -1);
  if (empties.length === 0) return cells; // 没有空格，直接返回
  // 随机选一个空格子
  const idx = empties[Math.floor(Math.random() * empties.length)];
  const next = [...cells];
  // 90% 概率放 2，10% 概率放 4
  next[idx] = Math.random() < (1 - NEW_TILE_4_CHANCE) ? 2 : 4;
  return next;
}

// ---- 核心滑动算法 ----
// slideRow：把一行数字向左滑动并合并
// 例：[2, 0, 2, 4] → [4, 4, 0, 0]
// 例：[2, 2, 2, 2] → [4, 4, 0, 0]（每次只合并一次）
function slideRow(row) {
  // 1. 去掉所有 0，把非零数字挤到左边
  const filtered = row.filter(v => v !== 0);
  const merged = [];
  let i = 0;
  while (i < filtered.length) {
    // 2. 如果相邻两个相等，合并（乘2），跳过两个
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      i += 2;
    } else {
      // 3. 不相等，直接放入
      merged.push(filtered[i]);
      i++;
    }
  }
  // 4. 右边补 0，凑够 SIZE 个
  while (merged.length < SIZE) merged.push(0);
  return merged;
}

// slide：把整个棋盘向某个方向滑动
// dir = 'left' | 'right' | 'up' | 'down'
function slide(cells, dir) {
  // 先把一维数组转成二维（SIZE 行 × SIZE 列）
  let grid = [];
  for (let r = 0; r < SIZE; r++)
    grid.push(cells.slice(r * SIZE, r * SIZE + SIZE));

  if (dir === 'left') {
    // 每行直接向左滑
    grid = grid.map(slideRow);

  } else if (dir === 'right') {
    // 每行翻转 → 向左滑 → 再翻转回来
    grid = grid.map(r => slideRow([...r].reverse()).reverse());

  } else if (dir === 'up') {
    // 转置矩阵（行列互换）→ 向左滑 → 转置回来
    let t = Array.from({ length: SIZE }, (_, c) => grid.map(r => r[c]));
    t = t.map(slideRow);
    grid = Array.from({ length: SIZE }, (_, r) => t.map(col => col[r]));

  } else if (dir === 'down') {
    // 转置 + 翻转 → 向左滑 → 翻转 + 转置回来
    let t = Array.from({ length: SIZE }, (_, c) => grid.map(r => r[c]).reverse());
    t = t.map(slideRow);
    t = t.map(r => r.reverse());
    grid = Array.from({ length: SIZE }, (_, r) => t.map(col => col[r]));
  }

  // 转回一维数组
  return grid.flat();
}

// ---- 格子颜色表 ----
// key = 格子上的数字，value = 背景颜色
// 考试时可以直接改颜色，或者整体换成一种颜色
const CELL_COLORS = {
  0:    '#ccc0b3', // 空格子（灰）
  2:    '#eee4da', // 浅米色
  4:    '#ede0c8',
  8:    '#f2b179', // 开始变橙色
  16:   '#f59563',
  32:   '#f67c5f',
  64:   '#f65e3b',
  128:  '#edcf72', // 变黄色
  256:  '#edcc61',
  512:  '#edc850',
  1024: '#edc53f',
  2048: '#edc22e', // 金色 = 赢了
};

// ================================================================
// 组件主体
// ================================================================
export default function Game2048() {
  // 初始化：放两个随机数字
  const init = () => addRandom(addRandom(empty()));

  const [cells, setCells] = useState(init); // 棋盘数据（一维数组）
  const [won, setWon] = useState(false);    // 是否已经赢了

  // 重置游戏
  const reset = () => { setCells(init()); setWon(false); };

  // 处理键盘事件
  const handleKey = useCallback((e) => {
    // 把按键名映射到方向字符串
    const dirs = {
      ArrowLeft:  'left',
      ArrowRight: 'right',
      ArrowUp:    'up',
      ArrowDown:  'down',
    };
    const dir = dirs[e.key];
    if (!dir) return;           // 不是方向键，忽略
    e.preventDefault();         // 阻止页面滚动

    setCells(prev => {
      const next = slide(prev, dir);          // 滑动后的新棋盘
      if (next.join() === prev.join()) return prev; // 没有任何格子移动，不更新

      const withNew = addRandom(next);        // 随机加一个新格子

      // 判断是否获胜（出现 WIN_TARGET）
      if (withNew.includes(WIN_TARGET) && !won) {
        setWon(true);
        recordWin(); // 通知 Dashboard 记录一次胜利
      }
      return withNew;
    });
  }, [won]);

  // 绑定/解绑键盘事件
  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // ---- 渲染 ----
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '60vh',
      gap: 16,
    }}>
      {/* 标题 */}
      <h2 style={{ fontSize: '2em', fontWeight: 'bold' }}>2048</h2>
      <p style={{ color: '#555' }}>Use arrow keys to slide tiles</p>

      {/* 棋盘：用 CSS Grid 排列 SIZE×SIZE 个格子 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${SIZE}, ${CELL_SIZE}px)`, // SIZE 列，每列 CELL_SIZE px
        gap: CELL_GAP,
        backgroundColor: '#bbada0', // 棋盘背景色
        padding: CELL_GAP,
        borderRadius: 8,
      }}>
        {cells.map((val, i) => (
          <div key={i} style={{
            width:  CELL_SIZE,
            height: CELL_SIZE,
            // 有对应颜色就用，否则用深色（数字超大时）
            backgroundColor: CELL_COLORS[val] || '#3c3a32',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // 数字越大字体越小，避免超出格子
            fontSize: val >= 1000 ? '1.5em' : '2em',
            fontWeight: 'bold',
            // 小数字用深色文字，大数字用白色文字
            color: val <= 4 ? '#776e65' : '#fff',
          }}>
            {/* 0 显示为空，其他显示数字 */}
            {val !== 0 ? val : ''}
          </div>
        ))}
      </div>

      {/* 重置按钮 */}
      <button
        onClick={reset}
        style={{ padding: '8px 32px', fontSize: '1em', cursor: 'pointer' }}
      >
        New Game
      </button>
    </div>
  );
}
