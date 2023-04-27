const mongoose = require('mongoose');

const model = {};

const userSchema = new mongoose.Schema({
  email: String,
  pass: String
});

model.userModel = mongoose.model('users', userSchema);

const offerSchema = new mongoose.Schema({
  offer_id: {
    type: String,
    required: true
  },
  offer_title: {
    type: String,
    required: true
  },
  offer_description: {
    type: String,
    required: true
  },
  offer_image: {
    type: String,
    required: true
  },
  offer_sort_order: {
    type: Number,
    required: true
  },
  content: [
    {
      item_id: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  schedule: {
    days_of_week: {
      type: [Number],
      required: true
    },
    dates_of_month: {
      type: [Number],
      required: true
    },
    months_of_year: {
      type: [Number],
      required: true
    }
  },
  target: {
    type: String,
    required: true
  },
  pricing: [
    {
      currency: {
        type: String,
        required: true
      },
      cost: {
        type: Number,
        required: true
      }
    }
  ]
});

model.offerModel = mongoose.model('offer', offerSchema);

module.exports = model;
