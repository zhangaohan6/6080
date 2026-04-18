import { useState, useEffect } from 'react';
import { recordWin } from '../pages/Dashboard';

// ================================================================
// 游戏：翻牌配对（Memory Cards）
// 玩法：点击翻开两张牌，图案相同则消除，全部消除赢
// ================================================================
//
// ★ 考试时最常需要改的参数（全部在顶部）：
//
//   SYMBOLS       → 牌面内容（字母/数字/emoji 均可，有几个就有几对）
//   FLIP_DELAY    → 不匹配时多久自动翻回（毫秒，默认800ms）
//   CARD_SIZE     → 每张牌的大小（像素）
//   COLS          → 每行放几张牌（默认4列，4×4=16张=8对）
//
// ★ 改成 emoji 的例子：
//   const SYMBOLS = ['🍎','🍌','🍇','🍓','🍒','🍑','🥝','🍋'];
//
// ================================================================

// ---- 可改参数 -----------------------------------------------
// 牌面内容：有几个元素就有几对牌（8个 → 8对 → 16张）
const SYMBOLS   = ['1', '2', '3', '4', '5', '6', '7', '8'];
const FLIP_DELAY = 1000; // 不匹配时多久翻回（毫秒）
const CARD_SIZE  = 80;  // 每张牌的宽高（像素）
const COLS       = 4;   // 每行几张（SYMBOLS.length * 2 张牌排成几列）
// -------------------------------------------------------------

// 初始化所有牌
// 每个 symbol 出现两次（配对），随机打乱顺序
// 每张牌有：id（唯一编号）、symbol（图案）、flipped（是否翻开）、matched（是否已配对消除）
function createCards() {
  const pairs = [...SYMBOLS, ...SYMBOLS]; // 每个 symbol 复制两份
  return pairs
    .sort(() => Math.random() - 0.5)      // 随机打乱
    .map((symbol, i) => ({
      id: i,
      symbol,
      flipped: false,  // 默认背面朝上（未翻开）
      matched: false,  // 默认未配对
    }));
}

// ================================================================
// 主组件
// ================================================================
export default function CardMemory() {
  // cards    → 所有牌的数据数组
  // selected → 当前已翻开但未判断的牌 id 列表（最多2个）
  // locked   → 是否锁定点击（在判断配对期间禁止再翻牌）
  const [cards,    setCards]    = useState(createCards);
  const [selected, setSelected] = useState([]);
  const [locked,   setLocked]   = useState(false);

  // 重置游戏：重新生成一副牌
  const reset = () => {
    setCards(createCards());
    setSelected([]);
    setLocked(false);
  };

  // 点击某张牌时触发
  // id = 被点击的牌的编号
  const handleClick = (id) => {
    // 正在判断配对期间，不响应点击
    if (locked) return;

    const card = cards.find(c => c.id === id);
    // 已经翻开的牌、已配对消除的牌、已选中的牌 → 不响应
    if (card.flipped || card.matched) return;
    if (selected.includes(id)) return;

    // 翻开这张牌：把它的 flipped 改为 true
    const newSelected = [...selected, id];
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c));
    setSelected(newSelected);

    // 翻开了第2张牌 → 开始判断是否配对
    if (newSelected.length === 2) {
      setLocked(true); // 锁定，防止在判断期间再翻牌

      const [id1, id2] = newSelected;
      const c1 = cards.find(c => c.id === id1);
      const c2 = cards.find(c => c.id === id2);

      if (c1.symbol === c2.symbol) {
        // ✅ 配对成功：把这两张牌标记为 matched（绿色显示，不再翻回）
        setCards(prev => prev.map(c =>
          c.id === id1 || c.id === id2 ? { ...c, matched: true } : c
        ));
        setSelected([]);
        setLocked(false); // 解锁
      } else {
        // ❌ 不匹配：等 FLIP_DELAY 毫秒后自动翻回去
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === id1 || c.id === id2 ? { ...c, flipped: false } : c
          ));
          setSelected([]);
          setLocked(false); // 解锁
        }, FLIP_DELAY);
      }
    }
  };

  // 检测胜利：所有牌都已配对（matched = true）
  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      alert('Congratulations!');
      recordWin(); // 通知 Dashboard 记录一次胜利
      reset();
    }
  }, [cards]);

  // ---- 渲染 ----
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      height: '100%', minHeight: '60vh', gap: 20,
    }}>
      <h2>Memory Cards</h2>

      {/* 牌面网格：COLS 列，自动换行 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, ${CARD_SIZE}px)`,
        gap: 8,
      }}>
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleClick(card.id)}
            style={{
              width: CARD_SIZE, height: CARD_SIZE,
              // 颜色：已配对=绿，已翻开=白，未翻开=蓝
              backgroundColor: card.matched ? '#4caf50' : card.flipped ? '#fff' : '#1976d2',
              border: '2px solid #ccc',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2em', fontWeight: 'bold',
              // 未翻开时文字透明（看不到图案）
              color: card.flipped || card.matched ? '#333' : 'transparent',
              cursor: card.matched ? 'default' : 'pointer',
              userSelect: 'none',
              transition: 'background-color 0.2s',
            }}
          >
            {/* 翻开或配对后显示图案，否则显示 ? */}
            {(card.flipped || card.matched) ? card.symbol : '?'}
          </div>
        ))}
      </div>

      {/* 重置按钮 */}
      <button onClick={reset} style={{ padding: '8px 32px', fontSize: '1em', cursor: 'pointer' }}>
        Reset
      </button>
    </div>
  );
}
