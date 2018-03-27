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
	console.log('New user connected.')

	socket.on('createMessage', function socketOnCreateMessage(message) {
		console.log('createMessage', message)

		const { from, text } = message

		io.emit('newMessage', {
			from,
			text,
			createdAt: new Date().getTime(),
		})
	})

	socket.on('disconnect', function socketOnDisconnect() {
		console.log('User was disconnected')
	})

}

