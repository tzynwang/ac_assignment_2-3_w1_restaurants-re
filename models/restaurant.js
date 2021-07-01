const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  name_en: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image_url: {
    type: String,
    trim: true
  },
  image: {
    data: Buffer,
    contentType: String
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  google_map: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    require: true
  },
  description: {
    type: String,
    trim: true
  },
  isDelete: {
    type: Boolean,
    default: false,
    require: true
  }
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
