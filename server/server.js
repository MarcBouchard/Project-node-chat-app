const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { PORT } = require('./config')
const Users = require('./utils/users')
const {
	isRealString,
	generateMessage,
	generateLocationMessage,
} = require('./utils/message')

const publicPath = path.join(__dirname, '../public')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const users = new Users()

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
		if (!isRealString(name) || !isRealString(room))
			return callback('Name and room name are required.')


		socket.join(room)
		users.removeUser(socket.id)
		users.addUser(socket.id, name, room)

		const welcomeText = 'Welcome to the chat app!'
		const newUserJoinedText = `${name} has joined!`

		io.to(room).emit('updateUserList', users.getUserList(room))
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
		const user = users.removeUser(socket.id)

		if (user) {
			const { room, name } = user
			const message = `${name} has left the chat.`

			io.to(room).emit('updateUserList', users.getUserList(room))
			io.to(room).emit('newMessage', generateMessage('Admin', message))
		}
	}
}


// *******************************************************************
function onServerListen() {
	console.log(`Server is up on port ${PORT}`)
}
