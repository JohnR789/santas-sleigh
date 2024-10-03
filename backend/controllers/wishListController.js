const WishList = require('../models/wishListModel');

// @desc    Get wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishList = async (req, res) => {
  const wishList = await WishList.find({ user: req.user._id });
  res.json(wishList);
};

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
const addWishListItem = async (req, res) => {
  const { name, description, link } = req.body;

  const newItem = new WishList({
    user: req.user._id,
    items: [{ name, description, link }],
  });

  const createdItem = await newItem.save();
  res.status(201).json(createdItem);
};

// @desc    Delete wishlist item
// @route   DELETE /api/wishlist/:id
// @access  Private
const deleteWishListItem = async (req, res) => {
  const item = await WishList.findById(req.params.id);

  if (item) {
    await item.remove();
    res.json({ message: 'Wishlist item removed' });
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
};

module.exports = { getWishList, addWishListItem, deleteWishListItem };
