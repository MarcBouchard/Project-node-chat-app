const path = require('path')
const http = require('http')
const express = require('express')
const socketIO = require('socket.io')

const { PORT } = require('./config')
const {
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

	const welcomeText = 'Welcome to the chat app!'
	const newUserJoinedText = 'A new user joined the chat!'

	socket.emit('newMessage', generateMessage('Admin', welcomeText))
	socket.broadcast
		.emit('newMessage', generateMessage('Admin', newUserJoinedText))

	socket.on('createMessage', socketOnCreateMessage)
	socket.on('disconnect', socketOnDisconnect)
	socket.on('createLocationMessage', socketOnCreateLocationMessage)



	// *********************************************
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

function onServerListen() {
	console.log(`Server is up on port ${PORT}`)
}
