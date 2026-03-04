import './App.css'

function App() {
  return (
    <div>
      <nav className="navbar">
        <img src="https://picsum.photos/50" className="logo" />
        <div className="nav-links">
          <a href="/"><span className="full-text">Home</span><span className="short-text">H</span></a>
          <a href="/game1"><span className="full-text">Game1</span><span className="short-text">G1</span></a>
          <a href="/game2"><span className="full-text">Game2</span><span className="short-text">G2</span></a>
          <a href="/game3"><span className="full-text">Game3</span><span className="short-text">G3</span></a>
        </div>
      </nav>

      <nav className='navbar'>
        <img src="" alt="" />
        <div>
          <img src="" alt=""><span></span></img>
          <img src="" alt=""><span></span></img>
        </div>
      </nav>
      <div className="main-body">
        <p>这里是页面内容</p>
      </div>
    </div>
  )
}

export default App
