import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Game1 from './pages/Game1'
import Game2 from './pages/Game2'
import Game3 from './pages/Game3'
import './App.css'

function App() {
  return (
    <BrowserRouter>

      {/* ── 导航栏 ── 考试改：颜色/高度/文字/路径 ── */}
      <nav className="navbar">
        <img src="https://picsum.photos/50" className="logo" />
        <div className="nav-links">
          <Link to="/">
            <span className="full-text">Home</span>        {/* ← 改文字 */}
            <span className="short-text">H</span>          {/* ← 改缩写 */}
          </Link>
          <Link to="/game1">                               {/* ← 改路径 */}
            <span className="full-text">Game1</span>       {/* ← 改文字 */}
            <span className="short-text">G1</span>         {/* ← 改缩写 */}
          </Link>
          <Link to="/game2">
            <span className="full-text">Game2</span>
            <span className="short-text">G2</span>
          </Link>
          <Link to="/game3">
            <span className="full-text">Game3</span>
            <span className="short-text">G3</span>
          </Link>
        </div>
      </nav>

      {/* ── 页面内容区域 ── */}
      <div className="main-body">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/game1" element={<Game1 />} />      {/* ← 改路径 */}
          <Route path="/game2" element={<Game2 />} />
          <Route path="/game3" element={<Game3 />} />
        </Routes>
      </div>

    </BrowserRouter>
  )
}

export default App
