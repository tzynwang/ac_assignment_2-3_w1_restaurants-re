const Restaurant = require('../restaurant')
const rawData = require('./restaurant.json')
const restaurants = rawData.results
const db = require('../../config/mongoose')

db.once('open', async () => {
  console.log('mongodb connected from seeder')
  for (const r of restaurants) {
    await Restaurant.create({
      name: r.name,
      name_en: r.name_en,
      category: r.category,
      image_url: r.image,
      location: r.location,
      phone: r.phone,
      google_map: r.google_map,
      rating: r.rating,
      description: r.description
    })
  }
  console.log('mongodb seeder done')
  db.close()
})
