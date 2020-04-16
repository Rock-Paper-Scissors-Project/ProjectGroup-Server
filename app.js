const express = require('express')
const app = express()
const http = require('http').createServer(app)
const PORT = 3000
const io = require('socket.io')(http)
const router = require('./routes/index')
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.use(router)

io.on('connection', function(socket) {
    console.log('a user connected');
  });











http.listen(PORT, () => {
    console.log(`listening to port ${PORT}`)
})
