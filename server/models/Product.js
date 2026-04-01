const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['shirts', 't-shirts', 'hoodies', 'jackets', 'jeans', 'trousers', 'shorts', 'accessories'],
    },
    sizes: [
      {
        size: {
          type: String,
          enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        },
        stock: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    colors: [
      {
        name: String,
        hex: String,
      },
    ],
    images: [
      {
        url: { type: String, required: true },
        alt: String,
      },
    ],
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex',
    },
    tags: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Indexes for faster queries
productSchema.index({ category: 1, price: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
