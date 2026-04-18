import { useState, useEffect, useRef, useCallback } from 'react';
import { recordWin } from './Dashboard';

// ========================================================
// C类游戏模板：动作 / 网格控制
// 历年例子：Tetro（俄罗斯方块）、Space Invaders（射击）、Connect 4（落子）
//
// 这里以 Space Invaders 为基础（最典型的键盘控制游戏）
// 核心：setInterval 驱动游戏循环 + keydown 控制移动
// ========================================================

const BOARD_SIZE = 500;
const SHOOTER_SIZE = 10;
const ENEMY_SIZE = 20;
const ENEMY_MARGIN = 15;
const ENEMY_COLS = 10;
const ENEMY_ROWS = 2;
const MOVE_STEP = 5;

const initEnemies = () => {
  const enemies = [];
  for (let row = 0; row < ENEMY_ROWS; row++) {
    for (let col = 0; col < ENEMY_COLS; col++) {
      enemies.push({
        id: row * ENEMY_COLS + col,
        x: col * (ENEMY_SIZE + ENEMY_MARGIN) + ENEMY_MARGIN,
        y: row * (ENEMY_SIZE + ENEMY_MARGIN) + ENEMY_MARGIN,
        alive: true,
      });
    }
  }
  return enemies;
};

export default function Game3() {
  const [shooterX, setShooterX] = useState(0);
  const [enemies, setEnemies] = useState(initEnemies);
  const [gameOver, setGameOver] = useState(false);
  const boardRef = useRef(null);

  const reset = () => {
    setShooterX(0);
    setEnemies(initEnemies());
    setGameOver(false);
  };

  // 键盘控制
  const handleKey = useCallback((e) => {
    if (gameOver) return;

    if (e.key === 'ArrowLeft') {
      setShooterX(x => Math.max(0, x - MOVE_STEP));
    }
    if (e.key === 'ArrowRight') {
      setShooterX(x => Math.min(BOARD_SIZE - SHOOTER_SIZE, x + MOVE_STEP));
    }
    if (e.key === ' ') {
      e.preventDefault();
      // 射击：消灭垂直对齐的敌人
      setShooterX(currentX => {
        setEnemies(prev =>
          prev.map(en => {
            if (!en.alive) return en;
            const overlap = en.x < currentX + SHOOTER_SIZE && en.x + ENEMY_SIZE > currentX;
            return overlap ? { ...en, alive: false } : en;
          })
        );
        return currentX;
      });
    }
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // 检测胜利
  useEffect(() => {
    if (enemies.length > 0 && enemies.every(e => !e.alive)) {
      alert('You win!');
      recordWin();
      reset();
    }
  }, [enemies]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '60vh',
      gap: 20,
    }}>
      <h2>Game 3</h2>
      <p style={{ color: '#555', fontSize: '0.9em' }}>
        ← → 移动 &nbsp;|&nbsp; 空格键射击
      </p>

      {/* 游戏区域 */}
      <div
        ref={boardRef}
        tabIndex={0}
        style={{
          width: BOARD_SIZE,
          height: BOARD_SIZE,
          border: '1px solid black',
          position: 'relative',
          outline: 'none',
          backgroundColor: '#fff',
        }}
        onKeyDown={handleKey}
      >
        {/* 敌人 */}
        {enemies.filter(e => e.alive).map(en => (
          <div key={en.id} style={{
            position: 'absolute',
            left: en.x,
            top: en.y,
            width: ENEMY_SIZE,
            height: ENEMY_SIZE,
            backgroundColor: '#000',
          }} />
        ))}

        {/* 射手（左下角） */}
        <div style={{
          position: 'absolute',
          left: shooterX,
          bottom: 0,
          width: SHOOTER_SIZE,
          height: SHOOTER_SIZE,
          backgroundColor: 'red',
        }} />
      </div>

      <button onClick={reset}>Reset</button>
    </div>
  );
}
