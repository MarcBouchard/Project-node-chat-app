const moment = require('moment')

const { log } = console
const date = moment()

// date.add(100, 'year').subtract(9, 'months')
// log(date.format('MMM Do, YYYY'))

const timeStamp = moment().valueOf()
log(timeStamp)
// log(date.format('h:mm a'))
