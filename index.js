require('dotenv').config()
const express = require('express')
require('express-group-routes')
const app = express()
const port = 3000

const AuthController = require('./controllers/AuthController')

const auth = require("./middlewares/AuthMiddleware");

app.use(express.json())

app.get('/', (req, res) => {
  res.send('connected')
})
app.group('/token', (router) => {
    router.post('/get', AuthController.tokenGetter)
    router.post('/check', AuthController.tokenChecker)
})

app.get('/mid-tes', auth, (req, res) => {
    res.send('Pass')
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})