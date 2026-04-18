import { useState, useEffect } from 'react';
import { recordWin } from './Dashboard';

// ========================================================
// A类游戏模板：填空 / 数学运算
// 历年例子：Blanko（填单词）、Random Operators（算式填答案）、Operation Blanks（按运算符按钮）
// ========================================================

export default function Game1() {
  const [value, setValue] = useState('');
  const [answer, setAnswer] = useState(null);

  const startGame = () => {
    // TODO: 生成随机题目，设置 answer
    setValue('');
  };

  useEffect(() => {
    startGame();
  }, []);

  const checkAnswer = (input) => {
    if (String(input) === String(answer)) {
      alert('Correct!');
      recordWin();
      startGame();
    }
  };

  // 输入框版（Random Operators 类）
  const handleKeyUp = (e) => {
    checkAnswer(e.target.value);
  };

  // 按钮版（Operation Blanks 类）
  const handleButton = (op) => {
    checkAnswer(op);
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
      <h2>Game 1</h2>

      {/* 展示区域（改成题目要求的样式）*/}
      <div style={{ display: 'flex', gap: 10 }}>
        {/* 例：5个方块排一行 */}
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{
            width: 100,
            height: 100,
            background: 'linear-gradient(to right, #abcabc, #cbacbd)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#333',
            fontSize: '1.5em',
          }}>
            {i === 5
              ? <input
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyUp={handleKeyUp}
                  style={{ width: 50, textAlign: 'center' }}
                />
              : `?`
            }
          </div>
        ))}
      </div>

      <button onClick={startGame}>Reset</button>
    </div>
  );
}
