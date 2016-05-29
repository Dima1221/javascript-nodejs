const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title:   {
    type:     String,
    required: true,
    trim:     true
  },
  slug:    {
    type:     String,
    lowercase: true,
    required: true,
    trim:     true,
    unique:   true
  },
  // weight for non-internal subscriptions sorting
  weight:  {
    type:     Number,
    default:  0,
    required: true
  },
  // how often? string description
  period:  {
    type: String
  },
  created: {
    type:    Date,
    default: Date.now
  }
});

var Newsletter = module.exports = mongoose.model('Newsletter', schema);
