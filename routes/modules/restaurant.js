const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')
const fieldMap = require('../../config/fieldMap')

// only allow logged in users
const { hasLoggedIn } = require('../../auth/auth')
router.use(hasLoggedIn)

router.post('/search', hasLoggedIn, async (req, res) => {
  const keyword = req.body.keyword.trim()
  const field = req.body.field

  const searchRange = { userId: req.user._id }
  searchRange[field] = new RegExp(keyword, 'i')
  try {
    const results = await Restaurant.find(searchRange).lean()
    res.render('index', { restaurants: results, noResult: !results.length, fieldMap, field: fieldMap[field], keyword, searchCheck: true, clearResult: true })
  } catch (error) {
    console.log(error)
  }
})

router.post('/sort', hasLoggedIn, async (req, res) => {
  const select = req.body.select
  const sortConfig = {}
  switch (select) {
    case 'rating_asc':
      sortConfig.rating = -1
      break
    case 'rating_desc':
      sortConfig.rating = 1
      break
    case 'category':
      sortConfig.category = 1
  }
  try {
    const restaurants = await Restaurant.find({
      userId: req.user._id,
      isDelete: false
    })
      .sort(sortConfig).lean()
    res.send(restaurants)
  } catch (error) {
    console.error(error)
  }
})

router.post('/filter', async (req, res) => {
  const selected = req.body.data.selected
  // when no category selected, return all restaurants
  if (!selected.length) {
    const results = await Restaurant.find({ userId: req.user.id }).sort({ _id: -1 }).lean()
    res.send(results)
  } else {
    const results = []
    for (const select of selected) {
      const find = await Restaurant.find({ category: select, userId: req.user.id }).sort({ _id: -1 }).lean()
      results.push(...find)
    }
    res.send(results)
  }
})

router.get('/new', async (req, res) => {
  try {
    const categories = await Restaurant.find({ userId: req.user._id }).distinct('category').lean()
    res.render('new', { categories })
  } catch (error) {
    console.error(error)
  }
})

// add new restaurant
router.post('/', async (req, res) => {
  const userInput = req.body
  try {
    const categories = await Restaurant.find({ userId: req.user._id }).distinct('category').lean()
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

    newRestaurant.userId = req.user._id

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
    restaurant.isDelete = true
    restaurant.save()
    res.redirect('/')
  } catch (error) {
    console.error(error)
  }
})

module.exports = router
