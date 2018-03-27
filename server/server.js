const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { PORT } = require('./config')
const { newDate } = require('../utils')

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

	const broadcastNewMessage = {
		from: 'Admin',
		text: 'Welcome to the chat app!'
	}

	const broadcastEmitCreateMessage = {
		from: 'Admin',
		text: 'A new user joined the chat.',
		createdAt: newDate(),

	}

	socket.emit('newMessage', broadcastNewMessage)
	socket.broadcast.emit('newMessage', broadcastEmitCreateMessage )

	socket.on('createMessage', socketOnCreateMessage)
	socket.on('disconnect', socketOnDisconnect)

	function socketOnCreateMessage({ from, text }) {
		console.log('createMessage', { from, text })

		io.emit('newMessage', {
			from,
			text,
			createdAt: newDate(),
		})

//     socket.broadcast.emit('newMessage', {
//       from,
//       text,
//       createdAt: newDate(),

//     })
	}

	function socketOnDisconnect() {
		console.log('User was disconnected')
	}

}

