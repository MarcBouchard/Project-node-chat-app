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

socket.on('newLocationMessage', socketOnNewLocationMessage)

jQuery('#message-form').on('submit', function submitMessageForm(e) {
	e.preventDefault()

	socket.emit('createMessage', {
		from: 'User',
		text: jQuery('[name=message]').val()
	}, function formMessageCB() { })
})

const locationButton = jQuery('#send-location')

locationButton.on('click', onClickLocationButton)


// **********************************************
function socketOnNewLocationMessage(message) {
	var	li = jQuery('<li></li>')
	var a = jQuery('<a target="_blank">My current location</a>')

	li.text(`${message.from}: `)
	a.attr('href', message.url)
	li.append(a)

	jQuery('#messages').append(li)

}

function onClickLocationButton(e) {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.')
	}


	navigator.geolocation
		.getCurrentPosition(getCurrentPositionCB, getCurrentPositionError)



	// ********************************************
	function getCurrentPositionCB (position) {
		console.log(position)
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		})
	}

	function getCurrentPositionError (error) {
		alert('Unable to fetch location', error)
	}

}
