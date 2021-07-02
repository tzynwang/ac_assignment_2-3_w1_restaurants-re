const Restaurant = require('../restaurant')
const rawData = require('./restaurant.json')
const restaurants = rawData.results
const db = require('../../config/mongoose')

const User = require('../user')

db.once('open', async () => {
  console.log('mongodb connected from restaurantSeeder')
  const user1 = await User.findOne({ email: 'user1@example.com' })
  const user2 = await User.findOne({ email: 'user2@example.com' })
  const demo = await User.findOne({ email: 'demo@demo.com' })
  for (const restaurant of restaurants) {
    if (restaurant.id === 1 || restaurant.id === 2 || restaurant.id === 3) {
      await Restaurant.create({
        userId: user1._id,
        name: restaurant.name,
        name_en: restaurant.name_en,
        category: restaurant.category,
        image_url: restaurant.image,
        location: restaurant.location,
        phone: restaurant.phone,
        google_map: restaurant.google_map,
        rating: restaurant.rating,
        description: restaurant.description
      })
    } else if (restaurant.id === 4 || restaurant.id === 5 || restaurant.id === 6) {
      await Restaurant.create({
        userId: user2._id,
        name: restaurant.name,
        name_en: restaurant.name_en,
        category: restaurant.category,
        image_url: restaurant.image,
        location: restaurant.location,
        phone: restaurant.phone,
        google_map: restaurant.google_map,
        rating: restaurant.rating,
        description: restaurant.description
      })
    } else {
      await Restaurant.create({
        userId: demo._id,
        name: restaurant.name,
        name_en: restaurant.name_en,
        category: restaurant.category,
        image_url: restaurant.image,
        location: restaurant.location,
        phone: restaurant.phone,
        google_map: restaurant.google_map,
        rating: restaurant.rating,
        description: restaurant.description
      })
    }
  }
  console.log('mongodb restaurantSeeder done')
  db.close()
})
