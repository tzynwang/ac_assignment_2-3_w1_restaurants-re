const express = require('express')
const router = express.Router()

const auth = require('./modules/auth')
const home = require('./modules/home')
const restaurant = require('./modules/restaurant')
const user = require('./modules/user')

router.use('/', home)
router.use('/restaurant', restaurant)
router.use('/user', user)
router.use('/auth', auth)

module.exports = router
