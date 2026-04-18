import { useState, useEffect, useRef } from 'react';
import { recordWin } from './Dashboard';

// ========================================================
// B类游戏模板：记忆 / 序列
// 历年例子：Memorisation（点格子）、Flashing Memory（A/B/C/D）
//
// 核心逻辑：
//   1. 生成随机序列 [0,2,1,3,...]
//   2. 依次"闪烁"展示给用户
//   3. 用户点击，对比顺序
//   4. 全对 → 进入下一关；错了 → 重来
// ========================================================

const STAGES = 5;   // 最多几关（历年都是5关）
const FLASH_TIME = 500;  // 每格闪烁 ms

export default function Game2() {
  const [stage, setStage] = useState(1);         // 当前关卡（1~5）
  const [sequence, setSequence] = useState([]);  // 正确序列
  const [userInput, setUserInput] = useState([]); // 用户已点击
  const [flashing, setFlashing] = useState(null); // 当前高亮格子
  const [disabled, setDisabled] = useState(true); // 是否允许点击
  const [cells] = useState(Array.from({ length: 16 }, (_, i) => i)); // 4x4 = 16格

  const generateSequence = (len) => {
    return Array.from({ length: len }, () => Math.floor(Math.random() * 16));
  };

  const playSequence = async (seq) => {
    setDisabled(true);
    for (const idx of seq) {
      setFlashing(idx);
      await new Promise(r => setTimeout(r, FLASH_TIME));
      setFlashing(null);
      await new Promise(r => setTimeout(r, 200));
    }
    setDisabled(false);
  };

  const startStage = async (s) => {
    const seq = generateSequence(s);
    setSequence(seq);
    setUserInput([]);
    await playSequence(seq);
  };

  useEffect(() => {
    startStage(stage);
  }, []);

  const handleCellClick = async (idx) => {
    if (disabled) return;

    const newInput = [...userInput, idx];
    setUserInput(newInput);

    const pos = newInput.length - 1;
    if (newInput[pos] !== sequence[pos]) {
      // 错误：所有格子闪红
      setDisabled(true);
      setFlashing('error');
      await new Promise(r => setTimeout(r, FLASH_TIME));
      setFlashing(null);
      setUserInput([]);
      await playSequence(sequence);
      return;
    }

    if (newInput.length === sequence.length) {
      if (stage >= STAGES) {
        alert('Congratulations!');
        recordWin();
        setStage(1);
        await startStage(1);
      } else {
        const next = stage + 1;
        setStage(next);
        await startStage(next);
      }
    }
  };

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
      <h2>Game 2 — Stage {stage} / {STAGES}</h2>

      {/* 4x4 格子 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 80px)',
        gridTemplateRows: 'repeat(4, 80px)',
        gap: 0,
      }}>
        {cells.map(i => {
          const isFlash = flashing === i;
          const isError = flashing === 'error';
          return (
            <div
              key={i}
              onClick={() => handleCellClick(i)}
              style={{
                width: 80,
                height: 80,
                border: '1px solid rgb(255,255,0)',
                backgroundColor: isError ? 'red' : isFlash ? '#999' : 'white',
                cursor: disabled ? 'default' : 'pointer',
                boxSizing: 'border-box',
              }}
            />
          );
        })}
      </div>

      <button onClick={() => { setStage(1); startStage(1); }}>Reset</button>
    </div>
  );
}
