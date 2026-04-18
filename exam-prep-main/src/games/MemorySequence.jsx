import { useState, useEffect } from 'react';
import { recordWin } from '../pages/Dashboard';

// ========================================================
// 记忆序列游戏（21年 Memorisation / 22年 Flashing Memory）
//
// MODE = 'grid'    → 4x4格子闪烁，用户点格子（21年）
// MODE = 'buttons' → A/B/C/D四个按钮闪烁（22年）
//
// 考试时修改：
//   MODE        切换两种模式
//   GRID_SIZE   格子数（默认16 = 4x4）
//   MAX_STAGE   最多几关（通常是5）
//   FLASH_MS    每次闪烁持续毫秒
// ========================================================

const MODE = 'button'; // 'grid' | 'buttons'
const GRID_SIZE = 9; // 4x4
const MAX_STAGE = 5;
const FLASH_MS = 500;

// ---- MODE: grid ----
function GridMode() {
  const [stage, setStage]       = useState(1);
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [flashing, setFlashing]   = useState(null); // cell index | 'error'
  const [disabled, setDisabled]   = useState(true);

  const playSequence = async (seq) => {
    setDisabled(true);
    for (const idx of seq) {
      setFlashing(idx);
      await new Promise(r => setTimeout(r, FLASH_MS));
      setFlashing(null);
      await new Promise(r => setTimeout(r, 200));
    }
    setDisabled(false);
  };

  const startStage = async (s) => {
    const seq = Array.from({ length: s }, () => Math.floor(Math.random() * GRID_SIZE));
    setSequence(seq);
    setUserInput([]);
    await playSequence(seq);
  };

  useEffect(() => { startStage(1); }, []);

  const handleClick = async (idx) => {
    if (disabled) return;
    const newInput = [...userInput, idx];
    setUserInput(newInput);
    const pos = newInput.length - 1;

    if (newInput[pos] !== sequence[pos]) {
      setDisabled(true);
      setFlashing('error');
      await new Promise(r => setTimeout(r, FLASH_MS));
      setFlashing(null);
      setUserInput([]);
      await playSequence(sequence);
      return;
    }

    if (newInput.length === sequence.length) {
      if (stage >= MAX_STAGE) {
        alert('Congratulations!');
        recordWin();
        setStage(1);
        startStage(1);
      } else {
        const next = stage + 1;
        setStage(next);
        startStage(next);
      }
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', minHeight:'60vh', gap:16 }}>
      <p>Stage {stage} / {MAX_STAGE}</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 80px)', gridTemplateRows:'repeat(4, 80px)' }}>
        {Array.from({ length: GRID_SIZE }, (_, i) => {
          const isFlash = flashing === i;
          const isError = flashing === 'error';
          return (
            <div key={i} onClick={() => handleClick(i)} style={{
              width:80, height:80,
              border:'1px solid rgb(255,255,0)',
              backgroundColor: isError ? 'red' : isFlash ? '#999' : 'white',
              cursor: disabled ? 'default' : 'pointer',
              boxSizing:'border-box',
            }} />
          );
        })}
      </div>
      <button onClick={() => { setStage(1); startStage(1); }}>Reset</button>
    </div>
  );
}

// ---- MODE: buttons (A/B/C/D) ----
const LABELS = ['A', 'B', 'C', 'D'];

function ButtonsMode() {
  const [stage, setStage]         = useState(1);
  const [sequence, setSequence]   = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [instruction, setInstruction] = useState('');
  const [disabled, setDisabled]   = useState(true);
  const [gameOver, setGameOver]   = useState(false);

  const playSequence = async (seq) => {
    setDisabled(true);
    for (const idx of seq) {
      setInstruction(LABELS[idx]);
      await new Promise(r => setTimeout(r, 1000));
      setInstruction('');
      await new Promise(r => setTimeout(r, 300));
    }
    setDisabled(false);
  };

  const startStage = async (s) => {
    const seq = Array.from({ length: s }, () => Math.floor(Math.random() * 4));
    setSequence(seq);
    setUserInput([]);
    setGameOver(false);
    await playSequence(seq);
  };

  useEffect(() => { startStage(1); }, []);

  const handleButton = async (idx) => {
    if (disabled || gameOver) return;
    const newInput = [...userInput, idx];
    setUserInput(newInput);
    const pos = newInput.length - 1;

    if (newInput[pos] !== sequence[pos]) {
      setGameOver(true);
      alert('Game over! Starting again...');
      setStage(1);
      startStage(1);
      return;
    }

    if (newInput.length === sequence.length) {
      if (stage >= MAX_STAGE) {
        alert('Congratulations!');
        recordWin();
        setStage(1);
        startStage(1);
      } else {
        const next = stage + 1;
        setStage(next);
        startStage(next);
      }
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', minHeight:'60vh' }}>
      {/* 上半部分：4个按钮 */}
      <div style={{ flex:1, display:'flex' }}>
        {LABELS.map((label, i) => (
          <button key={label} onClick={() => handleButton(i)} disabled={disabled} style={{
            flex:1, fontSize:'2em', fontWeight:'bold',
            cursor: disabled ? 'default' : 'pointer',
            border:'1px solid #ccc',
          }}>
            {label}
          </button>
        ))}
      </div>
      {/* 下半部分：instruction box */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{
          width:20, height:20,
          backgroundColor:'#cccccc',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'0.8em',
        }}>
          {instruction}
        </div>
      </div>
    </div>
  );
}

export default function MemorySequence() {
  return MODE === 'grid' ? <GridMode /> : <ButtonsMode />;
}
