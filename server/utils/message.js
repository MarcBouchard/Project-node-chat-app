const { newDate } = require('../../utils')

function generateMessage(from, text) {
	return {
		from,
		text,
		createdAt: newDate(),
	}
}

function generateLocationMessage(from, latitude, longitude) {
	return {
		from,
		url: `https://www.google.com/maps?q=${latitude},${longitude}`,
		createdAt: newDate(),
	}
}
module.exports = {
	generateMessage,
	generateLocationMessage,
}
