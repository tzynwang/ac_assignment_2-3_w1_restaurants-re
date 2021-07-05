const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')
const fieldMap = require('../../config/fieldMap')

// only allow logged in users
const { hasLoggedIn, hasLoggedOut } = require('../../auth/auth')

router.get('/', hasLoggedIn, async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      userId: req.user._id,
      isDelete: false
    })
      .sort({ _id: -1 }).lean()
    res.render('index', { restaurants, searchCheck: true, sort: true, fieldMap })
  } catch (error) {
    console.error(error)
  }
})

router.get('/welcome', hasLoggedOut, (req, res) => {
  res.render('welcome')
})

module.exports = router
