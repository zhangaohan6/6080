必须背过的代码（就这几行）
CSS 核心 — 背这个：


/* 1. 全局清零 — 必须有 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 2. 固定导航栏 — 必须会 */
.navbar {
  position: fixed;   /* 固定不动 */
  top: 0;            /* 顶部（改bottom:0就变底部） */
  left: 0;
  width: 100%;
  height: 80px;      /* 题目会给具体数值 */
  background-color: #eeeeee;  /* 题目会给颜色 */
  display: flex;
  align-items: center;        /* 垂直居中 */
  justify-content: space-between;  /* 两端对齐 */
}

/* 3. 响应式 — 必须会 */
.nav-links .short-text { display: none; }

@media (max-width: 1400px) {
  .nav-links .full-text  { display: none; }
  .nav-links .short-text { display: inline; }
}

@media (max-width: 800px) {
  .logo { display: none; }
  .navbar { height: 50px; }
}



JSX 核心 — 背这个：


<nav className="navbar">
  <img src="图片URL" className="logo" />
  <div className="nav-links">
    <a href="/"><span className="full-text">Home</span>
        更快 — Emmet 语法 输入这个然后按 Tab：span.full-text 自动变成：
    <span className="full-text"></span>
                <span className="short-text">H</span></a>
    <a href="/game1"><span className="full-text">Game1</span>
                     <span className="short-text">G1</span></a>
  </div>
</nav>




考试只需要改这几个地方

① 导航位置   top:0 → 改 bottom:0 就变底部导航
② 高度/宽度  80px → 题目给什么写什么
③ 背景颜色   #eeeeee → 题目给什么写什么
④ 链接文字   Home/H → 题目给什么写什么
⑤ 链接路径   /game1 → 题目给什么写什么
⑥ 断点数值   1400px/800px → 题目给什么写什么
不用背，考试能查/推导的
display: flex 的其他属性
gap、margin 的具体数值
text-decoration: none 这种小细节
一句话总结：
背住 position: fixed + display: flex + @media 三个核心，其他都是改数值和颜色。