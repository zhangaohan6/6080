import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Game1 from './pages/Game1'
import Game2 from './pages/Game2'
import DashV1 from '../Dashboard/pages/Dashboard_v1_count_up'
import DashV2 from '../Dashboard/pages/Dashboard_v2_count_down'
import DashV3 from '../Dashboard/pages/Dashboard_v3_no_fetch'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <img src="https://picsum.photos/50" className="log" />
        <div className="nav-link">
          <Link to="/">Home</Link>
          <Link to="/game1">Game1</Link>
          <Link to="/game2">Game2</Link>
          <Link to="/dash1">Dash-V1(+1)</Link>
          <Link to="/dash2">Dash-V2(-1)</Link>
          <Link to="/dash3">Dash-V3(无fetch)</Link>
        </div>
      </nav>

      <div className="main-body">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/game1" element={<Game1 />} />
          <Route path="/game2" element={<Game2 />} />
          <Route path="/dash1" element={<DashV1 />} />
          <Route path="/dash2" element={<DashV2 />} />
          <Route path="/dash3" element={<DashV3 />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

//src/
//├── App.jsx        ← 总控制（路由+导航）
//├── App.css        ← 全局样式
//├── main.jsx       ← 启动文件（不用动）
//└── pages/         ← 页面文件夹
    //├── Dashboard.jsx
    //├── Game1.jsx
    //├── Game2.jsx
    //└── Game3.jsx