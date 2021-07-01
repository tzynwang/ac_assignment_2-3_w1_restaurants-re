const User = require('../user')
const db = require('../../config/mongoose')

// password hash
const bcrypt = require('bcrypt')
const saltRounds = 10

db.once('open', async () => {
  console.log('mongodb connected from userSeeder')
  const password = await bcrypt.hash('12345678', saltRounds)
  await User.create({
    email: 'user1@example.com',
    password,
    type: 'local'
  })
  await User.create({
    email: 'user2@example.com',
    password,
    type: 'local'
  })
  console.log('mongodb userSeeder done')
  db.close()
})
