const express = require('express')
const AuthController = require('./controllers/AuthController')
const app = express()
const port = 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('connected')
})

app.post('/login', AuthController.login)

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})