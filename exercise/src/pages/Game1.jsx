import { useState, useEffect } from 'react'

// ── 配置 ──
const MAX_STAGE = 5   // 总共几关
const FLASH_MS  = 500 // 每次闪烁持续毫秒

function Game1() {
  const [stage,     setStage]     = useState(1)     // 当前关卡（1~5）
  const [sequence,  setSequence]  = useState([])    // 本关要闪的序列，例如 [2, 0, 3]
  const [userInput, setUserInput] = useState([])    // 用户已按的序列
  const [active,    setActive]    = useState(null)  // 当前高亮的按钮（null / 0~3 / 'error'）
  const [disabled,  setDisabled]  = useState(true)  // 闪烁期间禁止点击

  // ── 工具：等待 ms 毫秒 ──
  const sleep = (ms) => new Promise(r => setTimeout(r, ms))

  // ── 播放序列动画 ──
  const playSequence = async (seq) => {
    setDisabled(true)           // 开始闪烁，禁止用户点击
    for (const idx of seq) {
      setActive(idx)            // 高亮第 idx 个按钮
      await sleep(FLASH_MS)     // 等 500ms
      setActive(null)           // 熄灭
      await sleep(200)          // 间隔 200ms 再闪下一个
    }
    setDisabled(false)          // 闪完了，允许用户点击
  }

  // ── 开始某一关 ──
  const startStage = async (s) => {
    // 生成长度为 s 的随机序列
    const seq = Array.from({ length: s }, () => Math.floor(Math.random() * 4))
    setSequence(seq)
    setUserInput([])            // 清空用户输入
    await playSequence(seq)     // 播放序列
  }

  // ── 第一次加载时自动开始第1关 ──
  useEffect(() => { startStage(1) }, [])

  // ── 用户点击按钮 ──
  const handleClick = async (idx) => {
    if (disabled) return        // 闪烁中，忽略点击

    const newInput = [...userInput, idx]   // 把这次点的加进去
    setUserInput(newInput)

    const pos = newInput.length - 1        // 刚才点的是第几个

    // 判断：这一步点对了吗？
    if (newInput[pos] !== sequence[pos]) {
      // ── 点错了 ──
      setDisabled(true)
      setActive('error')        // 所有按钮变红
      await sleep(FLASH_MS)
      setActive(null)
      setUserInput([])          // 清空输入
      await playSequence(sequence)  // 重新播放本关序列
      return
    }

    // ── 点对了，判断是否完成整个序列 ──
    if (newInput.length === sequence.length) {
      if (stage >= MAX_STAGE) {
        // 通关！
        alert('Congratulations! You won!')
        setStage(1)
        startStage(1)
      } else {
        // 进入下一关
        const next = stage + 1
        setStage(next)
        startStage(next)
      }
    }
  }

  // ── 每个按钮的背景色 ──
  const getBg = (i) => {
    if (active === 'error') return 'red'   // 出错：全红
    if (active === i)       return 'yellow' // 闪烁中：黄
    return 'white'                          // 默认：白
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>记忆游戏</h1>
      <p>关卡：{stage} / {MAX_STAGE}</p>

      {/* 4个游戏按钮 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: 20 }}>
        {['A', 'B', 'C', 'D'].map((label, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: getBg(i),
              cursor: disabled ? 'default' : 'pointer',
              fontSize: '1.2em',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 重置按钮 */}
      <button onClick={() => { setStage(1); startStage(1) }}>
        Reset
      </button>
    </div>
  )
}

export default Game1
