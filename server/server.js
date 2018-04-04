const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { PORT } = require('./config')
const {
	isRealString,
	generateMessage,
	generateLocationMessage,
} = require('./utils/message')

const publicPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static(publicPath))

io.on('connection', ioOnConnection)

server.listen(PORT, onServerListen)



// ******************************************************************
function ioOnConnection(socket) {
	console.log('New user connected.')

	socket.on('join', socketOnJoinCB)
	socket.on('createMessage', socketOnCreateMessage)
	socket.on('disconnect', socketOnDisconnect)
	socket.on('createLocationMessage', socketOnCreateLocationMessage)



	// *****************************************************************
	function socketOnJoinCB({ name, room }, callback) {
		if (!isRealString(name) || !isRealString(room)) {
			callback('Name and room name are required.')
		}
		socket.join(room)

		const welcomeText = 'Welcome to the chat app!'
		const newUserJoinedText = `${name} has joined!`

		socket.emit('newMessage', generateMessage('Admin', welcomeText))
		socket.broadcast.to(room)
			.emit('newMessage', generateMessage('Admin', newUserJoinedText))

		callback()
	}

	function socketOnCreateLocationMessage({ latitude, longitude }) {
		io.emit(
			'newLocationMessage',
			generateLocationMessage('Admin',  latitude, longitude),
		)
	}

	function socketOnCreateMessage({ from, text }, callback) {
		console.log('createMessage', { from, text })

		io.emit('newMessage', generateMessage(from, text))
		callback()
	}

	function socketOnDisconnect() {
		console.log('User was disconnected')
	}

}


// *******************************************************************
function onServerListen() {
	console.log(`Server is up on port ${PORT}`)
}
