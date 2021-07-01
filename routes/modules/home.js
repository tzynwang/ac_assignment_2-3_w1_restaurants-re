const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')
const fieldMap = {
  name: '餐廳名稱',
  category: '類型',
  location: '地址',
  description: '描述'
}

router.get('/', async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ deleteFlag: false }).sort({ _id: -1 }).lean()
    res.render('index', { restaurants, searchCheck: true, sort: true, fieldMap })
  } catch (error) {
    console.error(error)
  }
})

router.post('/search', async (req, res) => {
  const keyword = req.body.keyword.trim()
  const field = req.body.field

  const searchRange = {}
  searchRange[field] = new RegExp(keyword, 'i')
  try {
    const results = await Restaurant.find(searchRange).lean()
    res.render('index', { restaurants: results, noResult: !results.length, fieldMap, field: fieldMap[field], keyword, searchCheck: true, clearResult: true })
  } catch (error) {
    console.log(error)
  }
})

router.post('/sort', async (req, res) => {
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
    const restaurants = await Restaurant.find({ deleteFlag: false }).sort(sortConfig).lean()
    res.send(restaurants)
  } catch (error) {
    console.error(error)
  }
})

router.get('/welcome', (req, res) => {
  res.render('welcome')
})

module.exports = router
