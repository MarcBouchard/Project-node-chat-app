const socket = io()

const messageForm = jQuery('#message-form')
const usersElement = jQuery('#users')
const messageTextBox = jQuery('[name=message]')
const locationButton = jQuery('#send-location')
const messagesElement = jQuery('#messages')
const messageTemplate = jQuery('#message-template').html()
const locationMessageTemplate = jQuery('#location-message-template').html()

socket.on('connect', socketOnConnect)
socket.on('disconnect', socketOnDisconnect)
socket.on('newMessage', socketOnNewMessage)
socket.on('updateUserList', socketOnUpdateUserList)
socket.on('newLocationMessage', socketOnNewLocationMessage)

messageForm.on('submit', submitMessageForm)
locationButton.on('click', locationButtonOnClickCB)



// *******************************************************************
//------------------------------------------------ Socket Functions --
function socketOnConnect() {
	const params = jQuery.deparam(window.location.search)

	socket.emit('join', params, socketEmitJoinCB)



	// *****************************************************************
	function socketEmitJoinCB(error) {
		if (error) {
			alert(error)
			window.location.href = '/'
		} else {
			console.log('No error')
		}
	}
}

function socketOnDisconnect() {
	console.log('Disconnected from server')
}

function socketOnNewMessage(message) {
	const timeStamp = moment(message.createdAt).format('h:mm a')
	const html = Mustache.render(messageTemplate, {
		text: message.text,
		from: message.from,
		timeStamp,
	})

	messagesElement.append(html)
	scrollToBottom()

}

function socketOnUpdateUserList(users) {
	const ol = jQuery('<ol></ol>')

	users.forEach(function usersForEachCB(user) {
		ol.append(jQuery('<li></li>').text(user))
	})

	usersElement.html(ol)
}

function socketOnNewLocationMessage({ from, url, createdAt }) {
	const timeStamp = moment(createdAt).format('h:mm a')

	const template = locationMessageTemplate
	const html = Mustache.render(template, {
		from,
		url,
		timeStamp,
	})

	messagesElement.append(html)
	scrollToBottom()

}


//---------------------------------------------------- Dom Elements --
function submitMessageForm(e) {

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


//------------------------------------------------ Helper Functions --
function scrollToBottom(argument) {
	const newMessage = messagesElement.children('li:last-child')
	const clientHeight = messagesElement.prop('clientHeight')
	const scrollTop = messagesElement.prop('scrollTop')
	const scrollHeight = messagesElement.prop('scrollHeight')
	const newMessageHeight = newMessage.innerHeight()
	const lastMessageHeight = newMessage.prev().innerHeight()

	const totalHeight = clientHeight + scrollTop + newMessageHeight + lastMessageHeight

	if (totalHeight >= scrollHeight) {
		messagesElement.scrollTop(scrollHeight)
	}
}
