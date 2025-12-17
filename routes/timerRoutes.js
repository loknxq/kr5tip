const express = require('express')
const router = express.Router()

const timerController = require('../controllers/timerController')

router.post('/', timerController.createTimer)
router.get('/', timerController.listTimers)
router.get('/:id', timerController.getTimer)
router.delete('/:id', timerController.deleteTimer)

module.exports = router
