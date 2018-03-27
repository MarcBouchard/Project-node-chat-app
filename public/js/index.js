const socket = io()

socket.on('connect', function socketOnConnect() {
	console.log('Connected to server')

	socket.emit('createMessage', {
		from: 'Marc',
		text: 'Yup, that works for me.',
	})
})

socket.on('disconnect', function socketOnDisconnect() {
	console.log('Disconnected from server')
})

socket.on('newMessage', function socketOnNewMessage(message) {
	console.log(message)
})
