const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  // ──── MEN'S COLLECTION ────
  {
    name: 'Classic Linen Shirt',
    description:
      'Breathable pure linen shirt perfect for summer styling. Features a relaxed fit, mother-of-pearl buttons, and a spread collar.',
    price: 2499,
    originalPrice: 3999,
    category: 'shirts',
    gender: 'men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Beige', hex: '#F5F5DC' },
    ],
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
    ],
    stock: 120,
    ratings: { average: 4.5, count: 234 },
    isFeatured: true,
    material: '100% Linen',
    tags: ['linen', 'summer', 'casual', 'breathable'],
  },
  {
    name: 'Slim Fit Chinos',
    description:
      'Modern slim-fit chinos crafted from stretch cotton twill. Versatile enough for office or weekend wear.',
    price: 1999,
    originalPrice: 2999,
    category: 'pants',
    gender: 'men',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Khaki', hex: '#C3B091' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Olive', hex: '#808000' },
    ],
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600',
    ],
    stock: 85,
    ratings: { average: 4.3, count: 189 },
    isFeatured: true,
    material: '98% Cotton, 2% Elastane',
    tags: ['chinos', 'slim-fit', 'office', 'casual'],
  },
  {
    name: 'Premium Leather Jacket',
    description:
      'Handcrafted genuine leather biker jacket with quilted lining. A timeless investment piece.',
    price: 12999,
    originalPrice: 18999,
    category: 'jackets',
    gender: 'men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#8B4513' },
    ],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
    ],
    stock: 30,
    ratings: { average: 4.8, count: 92 },
    isFeatured: true,
    material: 'Genuine Leather',
    tags: ['leather', 'biker', 'premium', 'winter'],
  },
  {
    name: 'Oversized Graphic Tee',
    description:
      'Street-style oversized tee with exclusive print. 240 GSM heavy cotton for a premium drape.',
    price: 1299,
    originalPrice: 1799,
    category: 'tshirts',
    gender: 'men',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Off White', hex: '#FAF0E6' },
    ],
    images: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
    ],
    stock: 200,
    ratings: { average: 4.2, count: 456 },
    isFeatured: false,
    material: '100% Cotton (240 GSM)',
    tags: ['graphic', 'oversized', 'streetwear', 'casual'],
  },
  {
    name: 'Tailored Wool Blazer',
    description:
      'Italian wool-blend blazer with a modern single-breasted cut. Half-canvas construction for a clean silhouette.',
    price: 7999,
    originalPrice: 11999,
    category: 'jackets',
    gender: 'men',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Navy', hex: '#000080' },
    ],
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    ],
    stock: 45,
    ratings: { average: 4.7, count: 67 },
    isFeatured: true,
    material: '80% Wool, 20% Polyester',
    tags: ['blazer', 'formal', 'wool', 'office'],
  },
  {
    name: 'Relaxed Jogger Pants',
    description:
      'Ultra-comfortable joggers with tapered leg and elastic cuffs. Tech-fleece fabric for all-day ease.',
    price: 1499,
    originalPrice: 2299,
    category: 'pants',
    gender: 'men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Grey', hex: '#808080' },
      { name: 'Navy', hex: '#000080' },
    ],
    images: [
      'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600',
    ],
    stock: 150,
    ratings: { average: 4.4, count: 312 },
    isFeatured: false,
    material: '70% Cotton, 30% Polyester',
    tags: ['joggers', 'athleisure', 'comfort', 'casual'],
  },

  // ──── WOMEN'S COLLECTION ────
  {
    name: 'Floral Wrap Dress',
    description:
      'Elegant wrap dress in a stunning floral print. True wrap construction with adjustable tie for a flattering fit.',
    price: 3499,
    originalPrice: 4999,
    category: 'dresses',
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blue Floral', hex: '#4169E1' },
      { name: 'Rose', hex: '#FF007F' },
    ],
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600',
    ],
    stock: 60,
    ratings: { average: 4.6, count: 178 },
    isFeatured: true,
    material: '100% Viscose',
    tags: ['dress', 'floral', 'wrap', 'summer'],
  },
  {
    name: 'High-Waist Wide Leg Jeans',
    description:
      'Vintage-inspired wide-leg jeans with a high rise. Non-stretch denim for an authentic retro look.',
    price: 2799,
    originalPrice: 3999,
    category: 'jeans',
    gender: 'women',
    sizes: ['24', '26', '28', '30', '32'],
    colors: [
      { name: 'Light Wash', hex: '#B0C4DE' },
      { name: 'Dark Indigo', hex: '#191970' },
    ],
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600',
    ],
    stock: 75,
    ratings: { average: 4.4, count: 145 },
    isFeatured: true,
    material: '100% Cotton Denim',
    tags: ['jeans', 'wide-leg', 'high-waist', 'vintage'],
  },
  {
    name: 'Satin Camisole Top',
    description:
      'Luxe satin camisole with delicate lace trim. Perfect for layering or wearing alone.',
    price: 1499,
    originalPrice: 2199,
    category: 'tops',
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Champagne', hex: '#F7E7CE' },
      { name: 'Black', hex: '#000000' },
      { name: 'Burgundy', hex: '#800020' },
    ],
    images: [
      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600',
    ],
    stock: 90,
    ratings: { average: 4.3, count: 205 },
    isFeatured: false,
    material: '100% Silk Satin',
    tags: ['camisole', 'satin', 'date-night', 'layering'],
  },
  {
    name: 'Cropped Puffer Jacket',
    description:
      'Trendy cropped puffer with recycled fill. Water-resistant shell and cozy stand collar.',
    price: 4999,
    originalPrice: 6999,
    category: 'jackets',
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sage Green', hex: '#9CAF88' },
      { name: 'Lilac', hex: '#C8A2C8' },
      { name: 'Black', hex: '#000000' },
    ],
    images: [
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600',
    ],
    stock: 55,
    ratings: { average: 4.5, count: 128 },
    isFeatured: true,
    material: 'Recycled Polyester, Recycled Down Fill',
    tags: ['puffer', 'cropped', 'winter', 'sustainable'],
  },
  {
    name: 'Ribbed Knit Bodycon Dress',
    description:
      'Figure-hugging ribbed knit dress with a midi length. Soft stretch fabric moves with you.',
    price: 2299,
    originalPrice: 3299,
    category: 'dresses',
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Black', hex: '#000000' },
    ],
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600',
    ],
    stock: 70,
    ratings: { average: 4.1, count: 97 },
    isFeatured: false,
    material: '60% Viscose, 40% Nylon',
    tags: ['bodycon', 'knit', 'midi', 'date-night'],
  },
  {
    name: 'Linen Palazzo Pants',
    description:
      'Flowing palazzo pants in pure linen. High waist with self-tie for effortless summer elegance.',
    price: 2199,
    originalPrice: 3199,
    category: 'pants',
    gender: 'women',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Sand', hex: '#C2B280' },
      { name: 'Terracotta', hex: '#E2725B' },
    ],
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600',
    ],
    stock: 65,
    ratings: { average: 4.6, count: 201 },
    isFeatured: true,
    material: '100% Linen',
    tags: ['palazzo', 'linen', 'summer', 'elegant'],
  },

  // ──── ACCESSORIES ────
  {
    name: 'Minimalist Leather Watch',
    description:
      'Sleek analog watch with genuine leather strap and sapphire crystal. Japanese quartz movement.',
    price: 3999,
    originalPrice: 5999,
    category: 'accessories',
    gender: 'unisex',
    sizes: ['One Size'],
    colors: [
      { name: 'Black/Gold', hex: '#000000' },
      { name: 'Brown/Silver', hex: '#8B4513' },
    ],
    images: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600',
    ],
    stock: 40,
    ratings: { average: 4.7, count: 88 },
    isFeatured: true,
    material: 'Stainless Steel, Genuine Leather',
    tags: ['watch', 'minimalist', 'leather', 'gift'],
  },
  {
    name: 'Canvas Tote Bag',
    description:
      'Spacious canvas tote with leather handles. Interior zip pocket and magnetic snap closure.',
    price: 1799,
    originalPrice: 2499,
    category: 'accessories',
    gender: 'unisex',
    sizes: ['One Size'],
    colors: [
      { name: 'Natural', hex: '#FAEBD7' },
      { name: 'Black', hex: '#000000' },
    ],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600',
    ],
    stock: 100,
    ratings: { average: 4.4, count: 165 },
    isFeatured: false,
    material: '16oz Cotton Canvas, Leather Trim',
    tags: ['tote', 'canvas', 'everyday', 'sustainable'],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('🗑  Cleared existing products');

    // Insert products
    const created = await Product.insertMany(products);
    console.log(`✨ Seeded ${created.length} products`);

    // Create admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@fabrico.in' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@fabrico.in',
        password: 'admin123',
        role: 'admin',
      });
      console.log('👤 Created admin user (admin@fabrico.in / admin123)');
    }

    // Create test user if not exists
    const testUserExists = await User.findOne({ email: 'test@fabrico.in' });
    if (!testUserExists) {
      await User.create({
        name: 'Test User',
        email: 'test@fabrico.in',
        password: 'test123',
      });
      console.log('👤 Created test user (test@fabrico.in / test123)');
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
