import { useState, useEffect, useCallback } from 'react';
import { recordWin } from '../pages/Dashboard';

// ========================================================
// Space Invaders（22年）
// 500x500 画布，红色射手（左下），黑色敌人（顶部2行）
// ← → 移动射手，空格键射击（消灭同列所有敌人）
// 考试时修改：BOARD / ENEMY_* / MOVE_STEP
// ========================================================

const BOARD = 500;
const SHOOTER_W = 10;
const SHOOTER_H = 10;
const ENEMY_SIZE = 20;
const ENEMY_MARGIN = 15;
const ENEMY_COLS = 10;
const ENEMY_ROWS = 2;
const MOVE_STEP = 1; // 每次移动 px

const initEnemies = () => {
  const list = [];
  for (let row = 0; row < ENEMY_ROWS; row++) {
    for (let col = 0; col < ENEMY_COLS; col++) {
      list.push({
        id: row * ENEMY_COLS + col,
        x: col * (ENEMY_SIZE + ENEMY_MARGIN) + ENEMY_MARGIN,
        y: row * (ENEMY_SIZE + ENEMY_MARGIN) + ENEMY_MARGIN,
        alive: true,
      });
    }
  }
  return list;
};

export default function SpaceInvaders() {
  const [shooterX, setShooterX] = useState(0);
  const [enemies, setEnemies]   = useState(initEnemies);

  const reset = () => {
    setShooterX(0);
    setEnemies(initEnemies());
  };

  const shoot = useCallback((currentX) => {
    setEnemies(prev => {
      const next = prev.map(en => {
        if (!en.alive) return en;
        const overlap = en.x < currentX + SHOOTER_W && en.x + ENEMY_SIZE > currentX;
        return overlap ? { ...en, alive: false } : en;
      });
      return next;
    });
  }, []);

  // 检测胜利
  useEffect(() => {
    if (enemies.length > 0 && enemies.every(e => !e.alive)) {
      alert('You win!');
      recordWin();
      reset();
    }
  }, [enemies]);

  useEffect(() => {
    let x = 0;
    const handleKey = (e) => {
      if (e.key === 'ArrowLeft') {
        setShooterX(prev => {
          x = Math.max(0, prev - MOVE_STEP);
          return x;
        });
      }
      if (e.key === 'ArrowRight') {
        setShooterX(prev => {
          x = Math.min(BOARD - SHOOTER_W, prev + MOVE_STEP);
          return x;
        });
      }
      if (e.key === ' ') {
        e.preventDefault();
        setShooterX(prev => { shoot(prev); return prev; });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [shoot]);

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', minHeight:'60vh', gap:16 }}>
      <p style={{ color:'#555', fontSize:'0.9em' }}>← → 移动 &nbsp;|&nbsp; 空格键射击</p>

      <div style={{ width:BOARD, height:BOARD, border:'1px solid black', position:'relative', backgroundColor:'#fff' }}>
        {enemies.filter(e => e.alive).map(en => (
          <div key={en.id} style={{
            position:'absolute', left:en.x, top:en.y,
            width:ENEMY_SIZE, height:ENEMY_SIZE,
            backgroundColor:'#000',
          }} />
        ))}
        <div style={{
          position:'absolute', left:shooterX, bottom:0,
          width:SHOOTER_W, height:SHOOTER_H,
          backgroundColor:'red',
        }} />
      </div>

      <button onClick={reset} style={{ padding:'8px 32px', cursor:'pointer' }}>Reset</button>
    </div>
  );
}
