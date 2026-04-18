import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Game1 from './pages/Game1';
import Game2 from './pages/Game2';
import Game3 from './pages/Game3';
import Game2048       from './games/Game2048';
import Blanko         from './games/Blanko';
import CardMemory     from './games/CardMemory';
import Connect4       from './games/Connect4';
import GuessNumber    from './games/GuessNumber';
import MathOperators  from './games/MathOperators';
import MemorySequence from './games/MemorySequence';
import SpaceInvaders  from './games/SpaceInvaders';
import Tetro          from './games/Tetro';
import Slido          from './games/Slido';
import WhackAMole     from './games/WhackAMole';
import TicTacToe      from './games/TicTacToe';
import LightsOn       from './games/LightsOn';
import ReflexTyping   from './games/ReflexTyping';

// ========================================================
// 考试时修改这里的路由路径，例如：
//   / → /dashboard  或  /home
//   /game1 → /blanko  或  /game/math  等
// ========================================================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<Layout><Dashboard /></Layout>} />
        <Route path="/game1"         element={<Layout><Game1 /></Layout>} />
        <Route path="/game2"         element={<Layout><Game2 /></Layout>} />
        <Route path="/game3"         element={<Layout><Game3 /></Layout>} />
        <Route path="/2048"          element={<Layout><Game2048 /></Layout>} />
        <Route path="/blanko"        element={<Layout><Blanko /></Layout>} />
        <Route path="/cardmemory"    element={<Layout><CardMemory /></Layout>} />
        <Route path="/connect4"      element={<Layout><Connect4 /></Layout>} />
        <Route path="/guessnumber"   element={<Layout><GuessNumber /></Layout>} />
        <Route path="/math"          element={<Layout><MathOperators /></Layout>} />
        <Route path="/memoryseq"     element={<Layout><MemorySequence /></Layout>} />
        <Route path="/spaceinvaders" element={<Layout><SpaceInvaders /></Layout>} />
        <Route path="/tetro"         element={<Layout><Tetro /></Layout>} />
        <Route path="/slido"         element={<Layout><Slido /></Layout>} />
        <Route path="/whackamole"    element={<Layout><WhackAMole /></Layout>} />
        <Route path="/tictactoe"     element={<Layout><TicTacToe /></Layout>} />
        <Route path="/lightson"      element={<Layout><LightsOn /></Layout>} />
        <Route path="/reflextyping"  element={<Layout><ReflexTyping /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
