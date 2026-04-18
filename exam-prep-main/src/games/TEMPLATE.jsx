import { useState, useEffect } from 'react';
import { recordWin } from '../pages/Dashboard';

// ================================================================
// 游戏模版结构（考试时复制这个文件改）
// ================================================================
//
// ★ 考试时最常需要改的参数（全部放顶部）：
//
//   PARAM_1  → 说明
//   PARAM_2  → 说明
//
// ================================================================

// ---- 可改参数（顶部常量区）------------------------------------
const PARAM_1 = 10;      // 例：格子数、回合数、时间限制
const PARAM_2 = 'red';   // 例：颜色、提示文字
// ------------------------------------------------------------


// ================================================================
// 主组件
// ================================================================
export default function TemplateGame() {

  // ============================================================
  // ① state 声明区
  //    所有需要"记住"的数据都在这里
  //    格式：const [读取值, 写入函数] = useState(初始值)
  //    读取：直接用变量名（如 score、won）
  //    写入：调用 setXxx(新值) → React 自动重新渲染
  // ============================================================
  const [score,  setScore]  = useState(0);       // 数字类：初始值 0
  const [won,    setWon]    = useState(false);    // 布尔类：初始值 false
  const [msg,    setMsg]    = useState('');       // 字符串类：初始值 ''
  const [items,  setItems]  = useState([]);       // 数组类：初始值 []


  // ============================================================
  // ② useEffect 区（可选）
  //    页面加载时自动执行一次，常用于初始化游戏
  //    格式：useEffect(() => { 要执行的代码 }, []);
  //    依赖数组 [] 为空 → 只在组件挂载时执行一次
  // ============================================================
  useEffect(() => {
    startGame(); // 页面加载时自动开始
  }, []);


  // ============================================================
  // ③ 函数区
  //    所有游戏逻辑在这里
  //    常见函数：startGame / reset / handleClick / handleXxx
  // ============================================================

  // reset / startGame：重置所有 state 到初始值
  // 注意：有几个 state 就要重置几个！
  const reset = () => {
    setScore(0);
    setWon(false);
    setMsg('');
    setItems([]);
  };

  const startGame = () => {
    // 初始化逻辑...
    reset();
  };

  // handleXxx：响应用户操作（点击/输入等）
  const handleClick = (id) => {
    // 1. 更新数据
    const newScore = score + 1;
    setScore(newScore);

    // 2. 判断胜利
    if (newScore >= PARAM_1) {
      setWon(true);
      setMsg('Congratulations!');
      alert('Congratulations!');
      recordWin();       // 通知 Dashboard 记一次胜利
      reset();
    }
  };


  // ============================================================
  // ④ 渲染区 return (...)
  //    把数据变成页面
  //    {变量名}         → 显示数据
  //    onClick={函数名} → 绑定点击事件
  //    条件渲染：{条件 && <元素 />} 或 {条件 ? A : B}
  //    嵌套三元颜色：won ? 'green' : msg.includes('xx') ? 'red' : '#333'
  // ============================================================
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: '60vh', gap: 16,
    }}>

      {/* 分数 / 状态显示 */}
      <p>Score: {score}</p>

      {/* 条件渲染：只有 msg 不为空才显示 */}
      {msg && (
        <p style={{ color: won ? 'green' : '#333' }}>{msg}</p>
      )}

      {/* 游戏主体区域（格子、棋盘、输入框等） */}
      <div onClick={() => handleClick(0)}>
        {/* 游戏内容 */}
      </div>

      {/* 重置按钮 */}
      <button onClick={reset} style={{ padding: '8px 32px', cursor: 'pointer' }}>
        Reset
      </button>

    </div>
  );
}
