const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  username: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String
  },
  isDelete: {
    type: Boolean,
    default: false,
    require: true
  }
})

module.exports = mongoose.model('User', userSchema)
