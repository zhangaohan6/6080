import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

// ========================================================
// 考试时根据题目修改：
//   NAV_LINKS  → 改链接路径和文字
//   NAV_SHORT  → 改缩写文字（屏幕变窄时用）
//   HEADER_BG  → 改背景色（题目会给颜色值）
//   FOOTER_BG  → 改 footer 背景色
//
// 导航位置变体：
//   顶部 header → 用本文件默认版本（最常见，20年样题格式）
//   底部 navbar → 把 header 改为 footer 风格，position: fixed bottom: 0
//   右侧 sidebar → 改为竖向排列，fixed right: 0，full height
// ========================================================

const NAV_LINKS = [
  { to: '/',      full: 'Home',   short: 'H' },
  { to: '/game1', full: 'Game 1', short: 'G1' },
  { to: '/game2', full: 'Game 2', short: 'G2' },
  { to: '/game3', full: 'Game 3', short: 'G3' },
];

const HEADER_HEIGHT = 80;  // px，题目会指定
const FOOTER_HEIGHT = 50;  // px，题目会指定
const HEADER_BG = '#eeeeee';
const FOOTER_BG = '#999999';

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div style={{ margin: 0 }}>
      {/* ===== HEADER / NAV ===== */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: HEADER_HEIGHT,
        backgroundColor: HEADER_BG,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        zIndex: 1000,
      }}>
        {/* Logo — 考试时换成题目提供的图片路径 */}
        <img
          src="/logo.png"
          alt="logo"
          style={{ width: 50, height: 50, margin: 15 }}
          onError={e => { e.target.style.display = 'none'; }}
        />

        {/* 导航链接 */}
        <nav className="nav-links" style={{ marginRight: 20 }}>
          {NAV_LINKS.map((link, i) => (
            <span key={link.to}>
              <Link
                to={link.to}
                style={{
                  color: location.pathname === link.to ? '#000' : '#555',
                  fontWeight: location.pathname === link.to ? 'bold' : 'normal',
                  textDecoration: 'none',
                }}
              >
                <span className="nav-full">{link.full}</span>
                <span className="nav-short">{link.short}</span>
              </Link>
              {i < NAV_LINKS.length - 1 && <span style={{ margin: '0 8px' }}>|</span>}
            </span>
          ))}
        </nav>
      </header>

      {/* ===== MAIN BODY ===== */}
      <main style={{
        marginTop: HEADER_HEIGHT,
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px - ${FOOTER_HEIGHT}px)`,
        boxSizing: 'border-box',
      }}>
        {children}
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{
        width: '100%',
        height: FOOTER_HEIGHT,
        backgroundColor: FOOTER_BG,
      }} />
    </div>
  );
}
