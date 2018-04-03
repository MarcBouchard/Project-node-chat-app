const moment = require('moment')

module.exports = {
	newDate: function newDateMethod() {
		return moment().valueOf()
	},

}
