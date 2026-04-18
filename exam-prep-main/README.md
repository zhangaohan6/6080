# 考试模板使用说明

## 考前准备
1. 把这个文件夹里的所有 `.jsx` 和 `.css` 文件上传到自己的 GitLab / GitHub
2. 考试时克隆下来，把 `src/` 复制进 exam repo

---

## 本地预览模板（考前练习）

```bash
cd exam-prep
npm install      # 只需第一次
npm run dev      # 启动开发服务器
```

浏览器访问：
- `http://localhost:5173/`        → Dashboard
- `http://localhost:5173/game1`   → Game1
- `http://localhost:5173/2048`    → 2048 示例

想预览哪个游戏，在 `src/App.jsx` 加一行路由：
```jsx
import Game2048 from './games/Game2048';
<Route path="/2048" element={<Layout><Game2048 /></Layout>} />
```

**保存文件后浏览器自动刷新**，无需手动操作。

---

## 考试当天流程

### 第一步：克隆考试仓库 + 复制模板（约10分钟）

```bash
# 1. 克隆考试仓库（地址在考试页面）
git clone git@gitlab.cse.unsw.edu.au:z5633314/exam-xxxxx.git
cd exam-xxxxx

# 2. 克隆自己的模板仓库
git clone git@gitlab.cse.unsw.edu.au:z5633314/exam-prep.git /tmp/exam-prep

# 3. 把模板文件复制进来
cp /tmp/exam-prep/package.json .
cp /tmp/exam-prep/vite.config.js .
cp /tmp/exam-prep/index.html .
cp -r /tmp/exam-prep/src ./src

# 4. 安装依赖 + 启动
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`，确认能看到 Dashboard 即成功。

### 第二步：复制框架代码（约5分钟）
把以下文件复制进 exam repo 的 `src/`：
- `App.jsx`
- `components/Layout.jsx`
- `components/Layout.css`
- `pages/Dashboard.jsx`
- `pages/Game1.jsx`（作为起点，按题目改）
- `pages/Game2.jsx`
- `pages/Game3.jsx`

安装路由依赖（如果没有）：
```bash
npm install react-router-dom
```

### 第三步：看题，改路由和导航（约10分钟）

**改 `App.jsx`：**
- 把路径 `/game1`, `/game2`, `/game3` 改成题目要求的路径

**改 `Layout.jsx`：**
| 要改的内容 | 位置 |
|-----------|------|
| 导航链接和文字 | `NAV_LINKS` 数组 |
| 导航背景色 | `HEADER_BG` |
| Footer 背景色 | `FOOTER_BG` |
| Header 高度 | `HEADER_HEIGHT` |
| Header 位置（顶/底/侧）| 改 `header` 的 style |

**导航位置变体：**

底部 navbar（21年格式）：
```jsx
// 把 header style 里的 top:0 改为：
bottom: 0,
// 把 main 的 marginTop 改为 marginBottom
```

右侧 sidebar（22年格式）：
```jsx
// header style 改为：
position: 'fixed', right: 0, top: 0,
width: 100, height: '100vh',
flexDirection: 'column', justifyContent: 'flex-start',
// main 改为：
marginRight: 100,
```

**改 `Dashboard.jsx`：**
| 要改的内容 | 变量 |
|-----------|------|
| JSON URL  | `SCORE_URL` |
| 显示方向  | `MODE`（'won' 或 'left'） |
| 文字颜色  | `TEXT_COLOR` |
| 提示文字  | `NAV_HINT` |

### 第四步：写三个游戏（剩余时间）

按历年规律：
- **Game1**（A类 填空/数学）：改 `Game1.jsx`
- **Game2**（B类 记忆序列）：`Game2.jsx` 基本可以直接用，调整格子数和关卡数
- **Game3**（C类 动作游戏）：改 `Game3.jsx`

游戏赢了调用 `recordWin()`（已在模板里）

### 第五步：每完成一块就提交
```bash
git add src/
git commit -m "add dashboard and layout"
git push
```
**考试结束前务必 push！否则可能得 0 分**

---

## 常用代码片段

### localStorage
```js
localStorage.getItem('key')
localStorage.setItem('key', value)
localStorage.removeItem('key')
```

### setInterval（定时游戏循环）
```js
useEffect(() => {
  const id = setInterval(() => {
    // 每帧逻辑
  }, 1000);
  return () => clearInterval(id);
}, [依赖]);
```

### 键盘事件
```js
useEffect(() => {
  const fn = (e) => {
    if (e.key === 'ArrowLeft') { ... }
    if (e.key === 'ArrowRight') { ... }
    if (e.key === ' ') { e.preventDefault(); ... }
  };
  window.addEventListener('keydown', fn);
  return () => window.removeEventListener('keydown', fn);
}, []);
```

### Grid 棋盘
```jsx
<div style={{ display:'grid', gridTemplateColumns:'repeat(10, 1fr)' }}>
  {cells.map((c,i) => <div key={i} style={{ aspectRatio:'1' }} />)}
</div>
```

### fetch + 错误处理
```js
fetch(URL)
  .then(r => r.json())
  .then(data => setState(data.score))
  .catch(() => setState(5)); // 默认值
```
