import { useState } from 'react'

function App() {
  const [num, setNum] = useState(0)
  //     ↑读    ↑写              ↑初始值
  //'' 是空字符串，因为我们存的是文字，不是数字。
  // 创建一个"变量箱子"
  // - text      = 读取里面的值
  // - setText   = 往里面放新值
  // - useState('')= 初始值是空字符串


  return (
    <div>
      <p>当前数字：{num}</p>
      <button onClick={() => setNum(num + 1)}>+1</button>
      <button onClick={() => setNum(num > 0 ? num - 1:0)}>-1</button>
      <button onClick={() => setNum(0)}>重置</button>
    </div>
  )
}

export default App



//固定格式
// 1. 创建数据
//const [xxx, setXxx] = useState(初始值)

// 2. 显示数据
//<p>{xxx}</p>

// 3. 修改数据
//<button onClick={() => setXxx(新值)}>按钮</button>

