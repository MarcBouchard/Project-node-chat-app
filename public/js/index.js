const socket = io()

const messageForm = jQuery('#message-form')
const locationButton = jQuery('#send-location')
const messagesElement = jQuery('#messages')

socket.on('connect', socketOnConnect)
socket.on('disconnect', socketOnDisconnect)
socket.on('newMessage', socketOnNewMessage)
socket.on('newLocationMessage', socketOnNewLocationMessage)

messageForm.on('submit', submitMessageForm)
locationButton.on('click', locationButtonOnClickCB)


// *******************************************************************
function socketOnConnect() {
	console.log('Connected to server')

}

function socketOnDisconnect() {
	console.log('Disconnected from server')
}

function socketOnNewMessage(message) {
	const formattedTime = moment(message.createdAt).format('h:mm a')

	var	li = jQuery('<li></li>')
	li.text(`${message.from} ${formattedTime}: ${message.text}`)

	messagesElement.append(li)
}

function socketOnNewLocationMessage(message) {
	const formattedTime = moment(message.createdAt).format('h:mm a')

	var	li = jQuery('<li></li>')
	var a = jQuery('<a target="_blank">My current location</a>')

	li.text(`${message.from} ${formattedTime}: `)
	a.attr('href', message.url)
	li.append(a)

	messagesElement.append(li)

}

function submitMessageForm(e) {
	const messageTextBox = jQuery('[name=message]')

	e.preventDefault()

	socket.emit('createMessage', {
		from: 'User',
		text: messageTextBox.val()
	}, formMessageCB)


	// *****************************************************************
	function formMessageCB() {
		messageTextBox.val('')


	}
}

function locationButtonOnClickCB(e) {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.')
	}

	locationButton.attr('disabled', 'disabled').text('Sending location...')

	navigator.geolocation
		.getCurrentPosition(getCurrentPositionCB, getCurrentPositionError)


	// *****************************************************************
	function getCurrentPositionCB (position) {
		locationButton.removeAttr('disabled').text('Send location')
		console.log(position)
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude,
		})
	}

	function getCurrentPositionError (error) {
		locationButton.removeAttr('disabled').text('Send location')
		alert('Unable to fetch location', error)
	}

}
