const socket = io()

socket.on('connect', function socketOnConnect() {
	console.log('Connected to server')

})

socket.on('disconnect', function socketOnDisconnect() {
	console.log('Disconnected from server')
})

socket.on('newMessage', function socketOnNewMessage(message) {
	console.log(message)
	var	li = jQuery('<li></li>')
	li.text(`${message.from}: ${message.text}`)

	jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', function submitMessageForm(e) {
	e.preventDefault()

	socket.emit('createMessage', {
		from: 'User',
		text: jQuery('[name=message]').val()
	}, function formMessageCB() { })
})
