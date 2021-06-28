const express = require('express')
const router = express.Router()

const home = require('./modules/home')
const restaurant = require('./modules/restaurant')

router.use('/', home)
router.use('/restaurant', restaurant)

module.exports = router
