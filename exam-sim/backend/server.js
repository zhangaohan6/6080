const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

// 模拟考试后端：返回初始分数
// 考试时这个文件已经写好，你只需要 npm start 启动
app.get('/api/score', (req, res) => {
  res.json({ lives: 8 })
})

app.listen(5001, () => {
  console.log('Backend running on http://localhost:5001')
  console.log('Try: http://localhost:5001/api/score')
})
