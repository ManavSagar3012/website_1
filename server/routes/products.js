const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products with filters, search, pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      gender,
      search,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (gender) query.gender = gender;
    if (featured === 'true') query.isFeatured = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'popular') sortOption = { 'ratings.count': -1 };
    if (sort === 'rating') sortOption = { 'ratings.average': -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .select('-__v');

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/products/:slug
// @desc    Get single product by slug
router.get('/:slug', async (req, res, next) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/products
// @desc    Create product (admin only)
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (admin only)
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (admin - soft delete)
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.json({ success: true, message: 'Product removed.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
