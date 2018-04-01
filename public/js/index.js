const socket = io()

const messageForm = jQuery('#message-form')
const locationButton = jQuery('#send-location')
const messagesElement = jQuery('#messages')

socket.on('connect', socketOnConnect)
socket.on('disconnect', socketOnDisconnect)
socket.on('newMessage', socketOnNewMessage)
socket.on('newLocationMessage', socketOnNewLocationMessage)

messageForm.on('submit', submitMessageForm)
locationButton.on('click', onClickLocationButton)


// *******************************************************************
function socketOnConnect() {
	console.log('Connected to server')

}

function socketOnDisconnect() {
	console.log('Disconnected from server')
}

function socketOnNewMessage(message) {
	console.log(message)
	var	li = jQuery('<li></li>')
	li.text(`${message.from}: ${message.text}`)

	messagesElement.append(li)
}

function socketOnNewLocationMessage(message) {
	var	li = jQuery('<li></li>')
	var a = jQuery('<a target="_blank">My current location</a>')

	li.text(`${message.from}: `)
	a.attr('href', message.url)
	li.append(a)

	messagesElement.append(li)

}

function submitMessageForm(e) {
	e.preventDefault()

	socket.emit('createMessage', {
		from: 'User',
		text: jQuery('[name=message]').val()
	}, function formMessageCB() { })
}

function onClickLocationButton(e) {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.')
	}

	navigator.geolocation
		.getCurrentPosition(getCurrentPositionCB, getCurrentPositionError)


	// *****************************************************************
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
