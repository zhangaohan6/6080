import { useState, useEffect, useRef } from 'react';
import { recordWin } from '../pages/Dashboard';

// ========================================================
// 打地鼠 Whack-a-Mole（中概率考题）
// 3×3 网格，地鼠随机出现，限时内点击得分
// 达到目标分数赢
//
// 考试时修改：
//   GRID      格子数（默认9 = 3×3）
//   GAME_TIME 游戏时长(秒)
//   MOLE_TIME 地鼠显示时间(ms)
//   WIN_SCORE 赢所需分数
// ========================================================

const GRID = 9; // ✏️ 格子数（3×3=9，4×4=16）
const GRID_COLS = 3; // ✏️ 每行几个（3×3就是3）
const GAME_TIME = 20;  // ✏️ 游戏时长（秒）
const MOLE_TIME = 600; // ✏️ 地鼠出现时间（ms）
const WIN_SCORE = 5;  // ✏️ 赢所需分数

export default function WhackAMole() {
  const [mole, setMole]       = useState(-1);   // 当前地鼠位置
  const [score, setScore]     = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [running, setRunning] = useState(false);
  const moleRef   = useRef(null);
  const timerRef  = useRef(null);

  const start = () => {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
    setMole(-1);
    clearInterval(moleRef.current);
    clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!running) return;

    // 倒计时
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { stop(); return 0; }
        return t - 1;
      });
    }, 1000);

    // 地鼠出没
    const showMole = () => {
      const pos = Math.floor(Math.random() * GRID);
      setMole(pos);
      setTimeout(() => setMole(-1), MOLE_TIME);
    };
    showMole();
    moleRef.current = setInterval(showMole, MOLE_TIME + 200);

    return () => { clearInterval(moleRef.current); clearInterval(timerRef.current); };
  }, [running]);

  const handleClick = (i) => {
    if (!running || mole !== i) return;
    setMole(-1);
    setScore(s => {
      const next = s + 1;
      if (next >= WIN_SCORE) {
        alert('Congratulations!');
        recordWin();
        stop();
      }
      return next;
    });
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: '60vh', gap: 16,
    }}>
      <div style={{ display: 'flex', gap: 40, fontSize: '1.2em' }}>
        <span>Score: <strong>{score}</strong></span>
        <span>Time: <strong>{timeLeft}s</strong></span>
        <span>Goal: <strong>{WIN_SCORE}</strong></span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_COLS}, 110px)`,
        gap: 8,
      }}>
        {Array.from({ length: GRID }, (_, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: 110, height: 110,
              backgroundColor: mole === i ? '#8B4513' : '#90EE90',
              border: '3px solid #5a8a5a',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5em',
              cursor: running && mole === i ? 'pointer' : 'default',
              userSelect: 'none',
              transition: 'background-color 0.1s',
            }}
          >
            {mole === i ? '🐹' : ''}
          </div>
        ))}
      </div>

      {!running
        ? <button onClick={start} style={{ padding: '10px 32px', fontSize: '1.1em', cursor: 'pointer' }}>
            Start
          </button>
        : <button onClick={stop} style={{ padding: '10px 32px', fontSize: '1.1em', cursor: 'pointer' }}>
            Stop
          </button>
      }
    </div>
  );
}
