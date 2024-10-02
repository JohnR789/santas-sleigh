const express = require('express');
const WishList = require('../models/wishListModel'); // Assume a WishList model for database operations
const { authenticate } = require('../middleware/authMiddleware'); // Custom authentication middleware
const router = express.Router();

// POST /wishlist: Add an item to the user's wish list (protected route)
router.post('/', authenticate, async (req, res) => {
  const { item } = req.body;

  if (!item) {
    return res.status(400).json({ message: 'Please provide an item' });
  }

  try {
    const wishlist = await WishList.findOne({ user: req.user.id });

    if (wishlist) {
      // Add new item to the existing wish list
      wishlist.items.push(item);
      await wishlist.save();
      return res.status(201).json({ message: 'Item added to wish list', wishlist });
    } else {
      // Create new wish list for the user
      const newWishList = new WishList({
        user: req.user.id,
        items: [item],
      });

      await newWishList.save();
      res.status(201).json({ message: 'Wish list created', wishlist: newWishList });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /wishlist: Get the user's wish list (protected route)
router.get('/', authenticate, async (req, res) => {
  try {
    const wishlist = await WishList.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wish list not found' });
    }

    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /wishlist/:itemId: Remove an item from the user's wish list (protected route)
router.delete('/:itemId', authenticate, async (req, res) => {
  const { itemId } = req.params;

  try {
    const wishlist = await WishList.findOne({ user: req.user.id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wish list not found' });
    }

    wishlist.items = wishlist.items.filter((item) => item.id !== itemId);
    await wishlist.save();

    res.status(200).json({ message: 'Item removed from wish list', wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

