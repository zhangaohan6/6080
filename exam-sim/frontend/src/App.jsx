import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Game1 from './pages/Game1'

// ============================================================
// 考试题目要求：
// 1. 导航栏有两个链接：Home (/home) 和 Math Game (/mathgame)
// 2. 导航栏背景色：black，文字颜色：white
// ============================================================

function App() {
  return (
    <BrowserRouter>
      {/* ✏️ 改这里：路径名、显示文字、样式 */}
      {/* ⚠️ 规律：to= 和 path= 必须一致，而且都用小写+无空格 */}
      <nav style={{ backgroundColor: 'black', display: 'flex', gap: 16, padding: 12 }}>
        <Link to="/home" style={{ color: 'white' }}>Home</Link>
        <Link to="/mathgame" style={{ color: 'white' }}>Math Game</Link>
      </nav>

      <div style={{ padding: 16 }}>
        <Routes>
          {/* ✏️ 改这里：路径名 */}
          <Route path="/home" element={<Dashboard />} />
          <Route path="/mathgame" element={<Game1 />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
