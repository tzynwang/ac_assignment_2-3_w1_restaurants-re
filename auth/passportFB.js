const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcrypt')
const saltRounds = 10
const User = require('../models/user')

function loginVerifyFB (passport) {
  passport.use(
    new FacebookStrategy({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['email', 'displayName']
    }, async (accessToken, refreshToken, profile, done) => {
      const { email, name, id } = profile._json
      const user = await User.findOne({ email })
      if (user) return done(null, user)
      try {
        // add new FB user
        const hashPassword = await bcrypt.hash(id, saltRounds)
        const newUser = new User({
          username: name,
          email,
          password: hashPassword,
          type: 'Facebook'
        })
        await newUser.save()
        return done(null, newUser)
      } catch (error) {
        return done(null, false, { message: '抱歉，出了一點問題，無法透過FB帳號登入 😭' })
      }
    })
  )
}

module.exports = loginVerifyFB
