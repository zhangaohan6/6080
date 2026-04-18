import { useState, useEffect } from 'react';

// ========================================================
// 考试时修改：
//   SCORE_URL → 题目给的 JSON 地址（格式永远是 {"score": 5}）
//   MODE      → 'won'  显示 "Games won: X"（计数向上）
//               'left' 显示 "Games left: X"（计数向下）
//   TEXT_COLOR → 题目指定颜色，历年有 red / blue
//   NAV_HINT  → 提示文字，改成题目要求的
// ========================================================

const SCORE_URL = 'http://cgi.cse.unsw.edu.au/~cs6080/data/score.json'; // ← 改这里
const MODE = 'won';       // 'won' | 'left'
const TEXT_COLOR = 'red'; // 'red' | 'blue'
const NAV_HINT = 'Please choose an option from the navbar.';

// ========================================================
// 公用函数：游戏页面赢了之后调用这个函数
// 在游戏组件里：import { recordWin } from '../pages/Dashboard';
// 然后 recordWin();
// ========================================================
export function recordWin() {
  const prev = parseInt(localStorage.getItem('gamesWon') || '0');
  localStorage.setItem('gamesWon', prev + 1);
}

export default function Dashboard() {
  const [gamesWon, setGamesWon] = useState(0);
  const [target, setTarget] = useState(5);

  const fetchTarget = () => {
    fetch(SCORE_URL)
      .then(r => r.json())
      .then(data => {
        setTarget(data.score);
        localStorage.setItem('examTarget', String(data.score));
      })
      .catch(() => {
        // 网络失败时用默认值 5
        setTarget(5);
        localStorage.setItem('examTarget', '5');
      });
  };

  useEffect(() => {
    // 读取已存的值
    const storedWon = localStorage.getItem('gamesWon');
    if (storedWon !== null) setGamesWon(parseInt(storedWon));

    const storedTarget = localStorage.getItem('examTarget');
    if (storedTarget !== null) {
      setTarget(parseInt(storedTarget));
    } else {
      // 第一次加载：从 URL 获取
      fetchTarget();
    }

    // 监听其他页面更新 localStorage（游戏赢了后返回 dashboard）
    const onStorage = () => {
      const w = localStorage.getItem('gamesWon');
      if (w !== null) setGamesWon(parseInt(w));
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // 每次进入 dashboard 刷新 gamesWon（单标签页也能更新）
  useEffect(() => {
    const w = localStorage.getItem('gamesWon');
    if (w !== null) setGamesWon(parseInt(w));
  });

  const reset = () => {
    localStorage.removeItem('gamesWon');
    localStorage.removeItem('examTarget');
    setGamesWon(0);
    fetchTarget();
  };

  const remaining = Math.max(0, target - gamesWon);

  // 赢了所有游戏时弹出 alert（22年有此要求）
  useEffect(() => {
    if (gamesWon >= target && target > 0) {
      alert('Congratulations!');
      reset();
    }
  }, [gamesWon, target]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '60vh',
    }}>
      <p style={{ color: TEXT_COLOR, fontSize: '2em', textAlign: 'center' }}>
        {NAV_HINT}
      </p>

      <p style={{ fontSize: '1.2em' }}>
        {MODE === 'won'
          ? <>Games won: <strong>{gamesWon}</strong></>
          : <>Games left to win: <strong>{remaining}</strong></>
        }
        {' '}
        <button onClick={reset} style={{ cursor: 'pointer' }}>(reset)</button>
      </p>
    </div>
  );
}
