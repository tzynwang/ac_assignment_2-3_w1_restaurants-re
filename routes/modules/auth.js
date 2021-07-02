const express = require('express')
const router = express.Router()

// passport
const passport = require('passport')

// request email and public_profile from FB
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// response from FB
router.get('/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true
}))

// request email and profile from Google
router.get('/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}))

// response from Google
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true
}))

// LINE
router.get('/line', passport.authenticate('line'))

// response from LINE
router.get('/line/callback', passport.authenticate('line', {
  successRedirect: '/',
  failureRedirect: '/user/login',
  failureFlash: true
}))

module.exports = router
