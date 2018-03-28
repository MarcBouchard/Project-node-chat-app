const { newDate } = require('../../utils')

function generateMessage(from, text) {
	return {
		from,
		text,
		createdAt: newDate(),
	}
}


module.exports = {
	generateMessage,
}
