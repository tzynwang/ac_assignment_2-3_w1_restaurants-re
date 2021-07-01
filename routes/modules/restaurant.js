const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/new', async (req, res) => {
  try {
    const categories = await Restaurant.find().distinct('category').lean()
    res.render('new', { categories })
  } catch (error) {
    console.error(error)
  }
})

// add new restaurant
router.post('/', async (req, res) => {
  const userInput = req.body
  try {
    const categories = await Restaurant.find().distinct('category').lean()
    const newRestaurant = new Restaurant()
    for (const item in userInput) {
      switch (item) {
        case 'name':
        case 'rating':
        case 'category':
        case 'phone':
        case 'location':
        case 'description':
          if (!userInput[item]) {
            res.render('new', { categories, userInput, error: '有標註*號欄位皆為必填 😖' })
            return
          }
      }
      newRestaurant[item] = userInput[item]
    }

    if (req.files) {
      newRestaurant.image.data = req.files.image.data
      newRestaurant.image.contentType = req.files.image.mimetype
    } else {
      newRestaurant.image_url = 'https://images.pexels.com/photos/1484516/pexels-photo-1484516.jpeg'
    }

    await newRestaurant.save()
    res.redirect('/')
  } catch (error) {
    console.error(error)
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const restaurant = await Restaurant.findById(id).lean()

    const contentType = restaurant.image ? restaurant.image.contentType : null
    const base64 = restaurant.image ? restaurant.image.data.buffer.toString('base64') : null
    const image = (contentType && base64) ? `data:image${contentType};base64,${base64}` : null

    restaurant
      ? res.render('show', { restaurant, image })
      : res.render('show', { error: '沒有這間餐廳的資料 😢' })
  } catch (error) {
    console.error(error)
  }
})

router.get('/:id/edit', async (req, res) => {
  const id = req.params.id
  try {
    const restaurant = await Restaurant.findById(id).lean()
    const categories = await Restaurant.find().distinct('category').lean()

    const contentType = restaurant.image ? restaurant.image.contentType : null
    const base64 = restaurant.image ? restaurant.image.data.buffer.toString('base64') : null
    const image = (contentType && base64) ? `data:image${contentType};base64,${base64}` : null

    restaurant
      ? res.render('edit', { restaurant, categories, image })
      : res.render('show', { error: '沒有這間餐廳的資料 😢' })
  } catch (error) {
    console.error(error)
  }
})

// edit
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const update = req.body

  for (const key in update) {
    if (key !== 'google_map' && !update[key]) {
      const restaurant = await Restaurant.findById(id).lean()
      const categories = await Restaurant.find().distinct('category').lean()

      const contentType = restaurant.image ? restaurant.image.contentType : null
      const base64 = restaurant.image ? restaurant.image.data.buffer.toString('base64') : null
      const image = (contentType && base64) ? `data:image${contentType};base64,${base64}` : null
      return res.render('edit', { restaurant, categories, image, hint: '有標註*號欄位皆為必填 😖' })
    }
  }

  try {
    const restaurant = await Restaurant.findOne({ _id: id })
    for (const item in update) {
      if (update[item]) restaurant[item] = update[item]
    }

    // handle image update
    if (req.files) {
      restaurant.image.data = req.files.image.data
      restaurant.image.contentType = req.files.image.mimetype
    }

    await restaurant.save()
    res.redirect(`/restaurant/${id}`)
  } catch (error) {
    console.error(error)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  try {
    const restaurant = await Restaurant.findOne({ _id: id })
    restaurant.deleteFlag = true
    restaurant.save()
    res.redirect('/')
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
