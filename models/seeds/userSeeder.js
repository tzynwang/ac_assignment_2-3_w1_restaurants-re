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
    avatar_url: 'https://avatars.dicebear.com/api/jdenticon/user1.svg?width=128&?background=%23ffffff',
    type: 'local'
  })
  await User.create({
    email: 'user2@example.com',
    password,
    avatar_url: 'https://avatars.dicebear.com/api/jdenticon/user1.svg?width=128&?background=%23ffffff',
    type: 'local'
  })
  await User.create({
    username: 'DEMO ACCOUNT',
    email: 'demo@demo.com',
    password,
    avatar_url: 'https://avatars.dicebear.com/api/jdenticon/demo.svg?width=128&?background=%23ffffff',
    type: 'DEMO'
  })
  console.log('mongodb userSeeder done')
  db.close()
})
