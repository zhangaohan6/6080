import { useState, useEffect, useRef } from 'react';
import { recordWin } from '../pages/Dashboard';

// ========================================================
// 反应打字 Reflex Typing（exercise 原题，高概率）
// 显示随机单词，用户尽快输入，记录用时
// 输入正确 → 记录时间 → 下一个单词
//
// 考试时修改：WORDS 换成题目给的词汇列表
// ========================================================

const WORDS = [
  'apple', 'banana', 'cherry', 'dragon', 'elephant',
  'forest', 'guitar', 'harbour', 'island', 'jungle',
  'kitten', 'lemon', 'mango', 'notebook', 'orange',
  'parrot', 'queen', 'rabbit', 'sunset', 'tiger',
];

export default function ReflexTyping() {
  const [word, setWord]       = useState('');
  const [input, setInput]     = useState('');
  const [startTime, setStart] = useState(null);
  const [elapsed, setElapsed] = useState(null); // ms
  const [history, setHistory] = useState([]);   // [{word, ms}]
  const inputRef = useRef(null);

  const nextWord = () => {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(w);
    setInput('');
    setStart(Date.now());
    setElapsed(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  useEffect(() => { nextWord(); }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setInput(val);

    if (val === word) {
      const ms = Date.now() - startTime;
      setElapsed(ms);
      setHistory(h => [...h, { word, ms }]);
      recordWin();
      alert(`Correct! Time: ${(ms / 1000).toFixed(2)}s`);
      nextWord();
    } else if (val.length >= word.length && val !== word) {
      // 输入错误且长度足够 → 清空（bonus feature）
      setInput('');
    }
  };

  const avg = history.length
    ? (history.reduce((s, h) => s + h.ms, 0) / history.length / 1000).toFixed(2)
    : null;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', minHeight:'60vh', gap:24 }}>
      <h2>Reflex Typing</h2>

      {/* 目标单词 */}
      <div style={{
        fontSize:'3em', fontWeight:'bold', letterSpacing:4,
        padding:'20px 40px', backgroundColor:'#f5f5f5',
        border:'2px solid #ccc', borderRadius:8, minWidth:300, textAlign:'center',
      }}>
        {word}
      </div>

      {/* 输入框 */}
      <input
        ref={inputRef}
        value={input}
        onChange={handleChange}
        placeholder="Type the word..."
        style={{ padding:'12px 20px', fontSize:'1.5em', width:300, textAlign:'center', borderRadius:6, border:'2px solid #999' }}
      />

      {/* 统计 */}
      <div style={{ color:'#555', fontSize:'0.95em' }}>
        Words completed: {history.length}
        {avg && ` | Average: ${avg}s`}
      </div>

      <button onClick={nextWord} style={{ padding:'8px 32px', cursor:'pointer' }}>Skip</button>
    </div>
  );
}
