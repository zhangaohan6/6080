用具体数值模拟，假设题目要求初始分数从API获取，每赢一局+1：

第一次打开页面（localStorage 是空的）

1. useEffect 运行
2. localStorage.getItem('score') → 返回 null（没有存档）
3. 进入 else，发送 fetch 请求
4. API 返回 {"score": 5}
5. setScore(5)        → 页面显示：Games won: 5
6. localStorage.setItem('score', 5) → 本地存了 '5'
刷新页面

1. useEffect 运行
2. localStorage.getItem('score') → 返回 '5'（有存档！）
3. 进入 if，setScore(Number('5')) → Number把字符串'5'变成数字5
4. 页面显示：Games won: 5
5. 没有发fetch请求（省流量）
赢了一局，点"赢一局"

1. handleWin() 运行
2. newScore = 5 + 1 = 6
3. setScore(6)        → 页面显示：Games won: 6
4. localStorage.setItem('score', 6) → 本地更新为 '6'
再刷新页面

1. useEffect 运行
2. localStorage.getItem('score') → 返回 '6'
3. setScore(6) → 页面显示：Games won: 6
   （分数没丢！）
点重置

1. handleReset() 运行
2. localStorage.removeItem('score') → 本地存档删掉
3. setScore(0) → 页面显示：Games won: 0
重置后再刷新

1. useEffect 运行
2. localStorage.getItem('score') → 返回 null（存档没了）
3. 重新 fetch API → 返回 {"score": 5}
4. 页面显示：Games won: 5（回到初始值）



import { useState, useEffect } from 'react'

function App() {

  // ══════════════════════════════════════
  // 1. 创建数据箱子
  // ══════════════════════════════════════
  const [score, setScore] = useState(0)
  // 考试里名字可能叫 gamesWon / gamesLeft / count
  // 初始值写0，真正的值会在useEffect里被覆盖

  //const [名字, set名字] = useState(初始值)
        //↓      ↓
       //读取    修改
//所以考试里你可以随便取名：


//const [count, setCount] = useState(0)
//const [wins, setWins] = useState(0)
//const [games, setGames] = useState(0)
// 都是一样的，只是名字不同

  // ══════════════════════════════════════
  // 2. 页面加载：读存档 or 网络获取
  // ══════════════════════════════════════
  useEffect(() => {

    const saved = localStorage.getItem('score')
    // 'score' 是存档的键名，你可以自己取名

    if (saved !== null) {
      // 有存档 → 直接用存档的值
      setScore(Number(saved))

    } else {
      // 没存档 → 去网络取初始值
      fetch('题目给的URL')
      //   ↑ 去网络取
        .then(r => r.json())
      //            ↑ 转成JS对象
        .then(data => {
          setScore(data.score)
      //              ↑ 显示
          // data.score 看题目JSON格式，字段名可能不同
          localStorage.setItem('score', data.score)
                                       //↑ 同时存入localStorage
          // 存进本地，下次刷新直接用
        })
    }

  }, []) // 空数组 = 只执行一次


  // ══════════════════════════════════════
  // 3. 赢了一局：分数+1 并存档
  // ══════════════════════════════════════
  const handleWin = () => {
    const newScore = score + 1
    setScore(newScore)
    localStorage.setItem('score', newScore)
  }
  // 考试里其他游戏赢了，调用这个函数就行


  // ══════════════════════════════════════
  // 4. 重置：清存档 + 归零
  // ══════════════════════════════════════
  const handleReset = () => {
    localStorage.removeItem('score')
    setScore(0)
  }


  // ══════════════════════════════════════
  // 5. 页面显示
  // ══════════════════════════════════════
  return (
    <div>
      <p>Games won: {score}</p>
      <button onClick={handleReset}>(reset)</button>

      {/* 测试用，考试删掉 */}
      <button onClick={handleWin}>模拟赢一局</button>
    </div>
  )
}

export default App


//考试时只需要改这4个地方

//① fetch('这里换成题目给的URL')
//② data.score  → 换成题目JSON的字段名
//③ 'score'     → localStorage的键名（随便取）
//④ Games won   → 换成题目要求的显示文字

//流程图（背这个）

//页面加载
  //└─→ localStorage 有值？
        //├─ 有 → 直接显示
        //└─ 没有 → fetch API → 存localStorage → 显示

//点重置
  //└─→ 删localStorage → score归零

//赢一局
  //└─→ score+1 → 存localStorage
//把这个代码手打一遍，保存跑通，明天我们就开始写导航栏。