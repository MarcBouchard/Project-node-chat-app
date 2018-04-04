const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { PORT } = require('./config')
const Users = require('./utils/users')
const {
	isRealString,
	generateMessage,
	generateAdminMessage,
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
		socket.emit('newMessage', generateAdminMessage(welcomeText))
		socket.broadcast.to(room)
			.emit('newMessage', generateAdminMessage(newUserJoinedText))

		callback()
	}

	function socketOnCreateLocationMessage({ latitude, longitude }) {
		const user = users.getUser(socket.id)

		if (user) {
			const { name, room } = user

			io.to(room).emit(
				'newLocationMessage',
				generateLocationMessage(name,  latitude, longitude),
			)

		}
	}

	function socketOnCreateMessage({ from, text }, callback) {
		const user = users.getUser(socket.id)

		if (user && isRealString(text)) {
			const { name, room } = user

			io.to(room).emit('newMessage', generateMessage(name, text))
		}
		callback()
	}

	function socketOnDisconnect() {
		const user = users.removeUser(socket.id)

		if (user) {
			const { room, name } = user
			const message = `${name} has left the chat.`

			io.to(room).emit('updateUserList', users.getUserList(room))
			io.to(room).emit('newMessage', generateAdminMessage(message))
		}
	}
}


// *******************************************************************
function onServerListen() {
	console.log(`Server is up on port ${PORT}`)
}
