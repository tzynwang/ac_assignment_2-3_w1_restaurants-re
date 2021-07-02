const express = require('express')
const app = express()
const port = 3000

if (process.env.NODE_ENV !== 'production') require('dotenv').config()

// DB
require('./config/mongoose')

// form (image upload) handling
const fileUpload = require('express-fileupload')
app.use(fileUpload())

// for axios post request
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// for flash message and auth status keeping
const session = require('express-session')
app.use(session({
  secret: process.env.SESSION_SECRET_KEY || 'The quick brown fox jumps over the lazy dog',
  resave: true,
  saveUninitialized: true
}))

const flash = require('connect-flash')
app.use(flash())

// auth-related flash message
app.use((req, res, next) => {
  res.locals.registerSuccess = req.flash('registerSuccess')
  res.locals.loginHint = req.flash('loginHint')
  res.locals.logoutSuccess = req.flash('logoutSuccess')
  res.locals.passportLocalError = req.flash('error')
  next()
})

// passport
const passport = require('passport')
const loginVerify = require('./auth/passportLocal')
const loginVerifyFB = require('./auth/passportFB')
const loginVerifyGoogle = require('./auth/passportGoogle')
const loginVerifyLine = require('./auth/passportLine')
loginVerify(passport)
loginVerifyFB(passport)
loginVerifyGoogle(passport)
loginVerifyLine(passport)
app.use(passport.initialize())
app.use(passport.session())

// rendering template
const expressHandlebars = require('express-handlebars')
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'main',
  helpers: {
    ifEquals (category, categoryToCheck) {
      return category === categoryToCheck ? 'selected' : ''
    },
    toImage (contentType, buffer) {
      return `data:image${contentType};base64,${buffer.toString('base64')}`
    },
    userTypeLocal (userType, type) {
      return userType === type
    }
  }
}))
app.set('view engine', 'handlebars')

// method overwritten
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// navbar login or logout buttons, avatar image
const { navButtons, navAvatar, navUsername } = require('./auth/auth')
app.use(navButtons)
app.use(navAvatar)
app.use(navUsername)

// routes
const routes = require('./routes')
app.use(routes)

// scripts, styles
app.use(express.static('public'))

app.use(function (req, res) {
  res.status(404).render('404')
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
