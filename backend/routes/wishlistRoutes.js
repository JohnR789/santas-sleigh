const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');  // Import the protect middleware
const {
  getWishList,
  addWishListItem,
  deleteWishListItem
} = require('../controllers/wishListController');  // Import wishlist controller functions

// Route to get the wishlist and add items (protected by auth middleware)
router.route('/')
  .get(protect, getWishList)  // Get all wishlist items for the authenticated user
  .post(protect, addWishListItem);  // Add a new wishlist item

// Route to delete a wishlist item (protected by auth middleware)
router.route('/:id')
  .delete(protect, deleteWishListItem);  // Delete a wishlist item by ID

module.exports = router;



