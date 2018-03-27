const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { PORT } = require('./config')

const publicPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', function ioOnConnection(socket) {
	console.log('New user connected')

	socket.on('disconnect', function socketOnDisconnect() {
		console.log('User was disconnected')
	})
})

server.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}`)
})
