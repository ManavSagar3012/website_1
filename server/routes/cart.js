const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

// All cart routes require authentication
router.use(protect);

// @route   GET /api/cart
// @desc    Get current user's cart
router.get('/', async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name images price slug'
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/cart/add
// @desc    Add item to cart
router.post('/add', async (req, res, next) => {
  try {
    const { productId, quantity, size, color, price } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if same product with same size & color exists in cart
    const existingIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        item.size === size &&
        item.color?.hex === color?.hex
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity || 1,
        size,
        color,
        price,
      });
    }

    await cart.save();

    // Populate for response
    await cart.populate('items.product', 'name images price slug');

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/cart/update/:itemId
// @desc    Update cart item quantity
router.put('/update/:itemId', async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart.' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name images price slug');

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/cart/remove/:itemId
// @desc    Remove item from cart
router.delete('/remove/:itemId', async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found.' });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await cart.save();
    await cart.populate('items.product', 'name images price slug');

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/cart/clear
// @desc    Clear entire cart
router.delete('/clear', async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
