const path = require('path')
const express = require('express')
const { PORT } = require('./config')

const publicPath = path.join(__dirname, '../public')

const app = express()

app.use(express.static(publicPath))

app.listen(PORT, () => {
	console.log(`Server is up on port ${PORT}`)
})
