import { useState, useEffect } from "react"

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // 页面加载时自动执行这里的代码
    console.log('页面加载了！')
    setCount(99)
  }, [])  // ← 这个[]表示"只执行一次"
//类比： useState 是"数据箱子"，useEffect 是"页面一加载就自动运行的机器"。

    return (
    <div>
      <p>数字：{count}</p>
    </div>
  )
}

export default App


// 用法1：页面加载时执行一次（最常用）
//useEffect(() => {
  // fetch数据、读localStorage 放这里
//}, [])   // ← 空数组 = 只跑一次

// 用法2：某个数据变化时执行
//useEffect(() => {
  // count 每次变化都会跑这里
//}, [count])   // ← 监听 count

// 用法3：每次渲染都执行（很少用）
//useEffect(() => {
  // 每次页面更新都跑
// })   // ← 没有数组