const { newDate } = require('../../utils')

module.exports = {
	isRealString,
	generateMessage,
	generateAdminMessage,
	generateLocationMessage,
}


// *******************************************************************
function isRealString(str) {
	return typeof str === 'string' && str.trim().length > 0
}

function generateMessage(from, text) {
	return {
		from,
		text,
		createdAt: newDate(),
	}
}

function generateAdminMessage(text) {
	return generateMessage('Admin', text)
}

function generateLocationMessage(from, latitude, longitude) {
	return {
		from,
		url: `https://www.google.com/maps?q=${latitude},${longitude}`,
		createdAt: newDate(),
	}
}
