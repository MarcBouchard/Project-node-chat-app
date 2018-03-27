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

io.on('connection', ioOnConnection)

server.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}`)
})

function ioOnConnection(socket) {

	socket.emit('newMessage', {
		from: 'John',
		text: 'See you then',
		createdAt: 12323423,
	})

	socket.on('createMessage', function socketOnCreateMessage(message) {
		console.log('createMessage', message)
	})

	socket.on('disconnect', function socketOnDisconnect() {
		console.log('User was disconnected')
	})

}

