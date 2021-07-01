const express = require('express')
const router = express.Router()

// DB
const User = require('../../models/user')

// password hash
const bcrypt = require('bcrypt')
const saltRounds = 10

// passport
const passport = require('passport')

// only direct not logged in user to login or register endpoint
const { hasLoggedOut } = require('../../auth/auth')

router.get('/login', hasLoggedOut, (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true
}))

router.get('/register', hasLoggedOut, (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const { username, email, password, passwordConfirm } = req.body
  const registerErrors = []

  if (!email || !password || !passwordConfirm) registerErrors.push({ message: '標記*號為必填項目' })
  if (username && username.length > 8) registerErrors.push({ message: '顯示名稱限制最多8字' })
  const emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  if (!email.match(emailReg)) registerErrors.push({ message: '請檢查Email格式' })
  if (password.length < 6 || password.length > 24) registerErrors.push({ message: '密碼長度限制6到24個字元' })
  if (password !== passwordConfirm) registerErrors.push({ message: '密碼與確認密碼內容不同' })
  const find = await User.findOne({ email })
  if (find) registerErrors.push({ message: '此Email已經註冊過了' })
  if (registerErrors.length) return res.render('register', { registerErrors })

  const hashPassword = await bcrypt.hash(password, saltRounds)
  const newUser = new User({
    username,
    email,
    password: hashPassword,
    type: 'local'
  })
  await newUser.save()
  req.flash('registerSuccess', '註冊成功，您現在可以登入了 😊')
  res.redirect('/user/login')
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('logoutSuccess', '您已登出 👋')
  res.redirect('/welcome')
})

module.exports = router
