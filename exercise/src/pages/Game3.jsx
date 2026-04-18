import { useState, useEffect } from 'react'

const SYMBOLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const FLIP_DELAY = 800

function createCards() {
  return [...SYMBOLS, ...SYMBOLS]
    .sort(() => Math.random() - 0.5)
    .map((symbol, i) => ({ id: i, symbol, flipped: false, matched: false }))
}

export default function Game3() {
  const [cards, setCards]     = useState(createCards)
  const [selected, setSelected] = useState([])
  const [locked, setLocked]   = useState(false)

  const reset = () => { setCards(createCards()); setSelected([]); setLocked(false) }

  const handleClick = (id) => {
    if (locked) return
    const card = cards.find(c => c.id === id)
    if (card.flipped || card.matched) return
    if (selected.includes(id)) return

    const newSelected = [...selected, id]
    setCards(prev => prev.map(c => c.id === id ? { ...c, flipped: true } : c))
    setSelected(newSelected)

    if (newSelected.length === 2) {
      setLocked(true)
      const [id1, id2] = newSelected
      const c1 = cards.find(c => c.id === id1)
      const c2 = cards.find(c => c.id === id2)

      if (c1.symbol === c2.symbol) {
        setCards(prev => prev.map(c =>
          c.id === id1 || c.id === id2 ? { ...c, matched: true } : c
        ))
        setSelected([])
        setLocked(false)
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === id1 || c.id === id2 ? { ...c, flipped: false } : c
          ))
          setSelected([])
          setLocked(false)
        }, FLIP_DELAY)
      }
    }
  }

  useEffect(() => {
    if (cards.length > 0 && cards.every(c => c.matched)) {
      alert('Congratulations!')
      reset()
    }
  }, [cards])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20 }}>
      <h2>Memory Cards</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 80px)', gridTemplateRows: 'repeat(4, 80px)', gap: 8 }}>
        {cards.map(card => (
          <div key={card.id} onClick={() => handleClick(card.id)} style={{
            width: 80, height: 80,
            backgroundColor: card.matched ? '#4caf50' : card.flipped ? '#fff' : '#1976d2',
            border: '2px solid #ccc', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2em', fontWeight: 'bold',
            color: card.flipped || card.matched ? '#333' : 'transparent',
            cursor: card.matched ? 'default' : 'pointer',
            userSelect: 'none',
          }}>
            {(card.flipped || card.matched) ? card.symbol : '?'}
          </div>
        ))}
      </div>
      <button onClick={reset} style={{ padding: '8px 32px', cursor: 'pointer' }}>Reset</button>
    </div>
  )
}
