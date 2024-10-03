const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      name: { type: String, required: true },
      description: { type: String },
      link: { type: String }
    }
  ]
}, {
  timestamps: true
});

const WishList = mongoose.model('WishList', wishListSchema);

module.exports = WishList;
