const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { protect, admin } = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// All order routes require auth
router.use(protect);

// @route   POST /api/orders/create-razorpay-order
// @desc    Create Razorpay order for payment
router.post('/create-razorpay-order', async (req, res, next) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects paise
      currency: 'INR',
      receipt: `order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/orders
// @desc    Place order after payment verification
router.post('/', async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentInfo,
      totalAmount,
      shippingCharge,
      discount,
      grandTotal,
    } = req.body;

    // Verify Razorpay signature
    const body = paymentInfo.razorpayOrderId + '|' + paymentInfo.razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== paymentInfo.razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed.',
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentInfo: {
        ...paymentInfo,
        status: 'paid',
      },
      totalAmount,
      shippingCharge,
      discount,
      grandTotal,
    });

    // Clear user's cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalAmount: 0 }
    );

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
router.get('/', async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images slug');

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('items.product', 'name images slug');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (admin)
router.put('/:id/status', admin, async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus,
        ...(orderStatus === 'delivered' ? { deliveredAt: Date.now() } : {}),
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
