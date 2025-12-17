const path = require('path')
const express = require('express')

const logger = require('./middlewares/logger')
const timerRoutes = require('./routes/timerRoutes')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(logger)

app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/timer', timerRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
