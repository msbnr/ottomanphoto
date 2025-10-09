/**
 * Seed Data Script
 * Run this after MongoDB is connected to populate initial data
 *
 * Usage: ts-node src/utils/seedData.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Product, Category } from '../models';

dotenv.config();

const categories = [
  {
    name: 'Elektronik',
    slug: 'elektronik',
    visibility: ['customer', 'dealer'],
    description: 'Bilgisayar, yazıcı ve elektronik cihazlar',
    isActive: true,
    order: 1,
  },
  {
    name: 'Ofis Malzemeleri',
    slug: 'ofis-malzemeleri',
    visibility: ['dealer'], // Sadece bayiler görebilir
    description: 'Kağıt, ribbon, toner ve ofis sarf malzemeleri',
    isActive: true,
    order: 2,
  },
  {
    name: 'Mobilya',
    slug: 'mobilya',
    visibility: ['customer', 'dealer'],
    description: 'Ofis mobilyaları ve ekipmanları',
    isActive: true,
    order: 3,
  },
];

const products = [
  {
    name: 'Premium Lazer Yazıcı HP LaserJet Pro',
    sku: 'YAZICI-001',
    description: 'Yüksek kaliteli ofis yazıcısı, A4 boyutunda baskı, 30 sayfa/dakika hız, WiFi bağlantı',
    category: 'elektronik',
    images: ['https://via.placeholder.com/500x500?text=Printer'],
    pricing: {
      retail: 5000,
      dealer_small: 4500,
      dealer_medium: 4200,
      dealer_large: 4000,
      dealer_main: 3800,
    },
    visibility: {
      customer: true,
      dealer: true,
      dealer_main: true,
    },
    stock: 50,
    isActive: true,
  },
  {
    name: 'A4 Fotokopi Kağıdı (5000 Yaprak)',
    sku: 'KAGIT-001',
    description: '80gr A4 fotokopi kağıdı, 10 paket (5000 yaprak)',
    category: 'ofis-malzemeleri',
    images: ['https://via.placeholder.com/500x500?text=Paper'],
    pricing: {
      retail: 500,
      dealer_small: 400,
      dealer_medium: 380,
      dealer_large: 350,
      dealer_main: 320,
    },
    visibility: {
      customer: false, // Son kullanıcılar göremez
      dealer: true,
      dealer_main: true,
    },
    stock: 200,
    isActive: true,
  },
  {
    name: 'HP Toner Kartuş 85A',
    sku: 'TONER-001',
    description: 'Orijinal HP toner kartuş, 1600 sayfa kapasiteli',
    category: 'ofis-malzemeleri',
    images: ['https://via.placeholder.com/500x500?text=Toner'],
    pricing: {
      retail: 800,
      dealer_small: 700,
      dealer_medium: 650,
      dealer_large: 620,
      dealer_main: 580,
    },
    visibility: {
      customer: false, // Son kullanıcılar göremez
      dealer: true,
      dealer_main: true,
    },
    stock: 100,
    isActive: true,
  },
  {
    name: 'Ergonomik Ofis Koltuğu',
    sku: 'KOLTUK-001',
    description: 'Ayarlanabilir kol ve sırt desteği, mesh kumaş, 120kg taşıma kapasitesi',
    category: 'mobilya',
    images: ['https://via.placeholder.com/500x500?text=Chair'],
    pricing: {
      retail: 3500,
      dealer_small: 3200,
      dealer_medium: 3000,
      dealer_large: 2800,
      dealer_main: 2600,
    },
    visibility: {
      customer: true,
      dealer: true,
      dealer_main: true,
    },
    stock: 30,
    isActive: true,
  },
  {
    name: 'Dell Latitude 5420 Laptop',
    sku: 'LAPTOP-001',
    description: 'Intel i5 11. nesil, 16GB RAM, 512GB SSD, 14" FHD ekran',
    category: 'elektronik',
    images: ['https://via.placeholder.com/500x500?text=Laptop'],
    pricing: {
      retail: 25000,
      dealer_small: 23000,
      dealer_medium: 22000,
      dealer_large: 21000,
      dealer_main: 20000,
    },
    visibility: {
      customer: true,
      dealer: true,
      dealer_main: true,
    },
    stock: 15,
    isActive: true,
  },
];

const users = [
  {
    email: 'admin@ottoman.com',
    password: 'admin123',
    userType: 'admin',
    profile: {
      firstName: 'Admin',
      lastName: 'User',
    },
    isActive: true,
    isVerified: true,
  },
  {
    email: 'customer@test.com',
    password: '123456',
    userType: 'customer',
    profile: {
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      phone: '+905551234567',
    },
    isActive: true,
    isVerified: true,
  },
  {
    email: 'dealer@test.com',
    password: '123456',
    userType: 'dealer',
    dealerTier: 'medium',
    profile: {
      companyName: 'ABC Ticaret Ltd.',
      taxNumber: '1234567890',
      phone: '+905559876543',
    },
    isActive: true,
    isVerified: true,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ottoman-platform';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('✅ Existing data cleared');

    // Seed categories
    console.log('📦 Seeding categories...');
    await Category.insertMany(categories);
    console.log(`✅ ${categories.length} categories created`);

    // Seed users
    console.log('👥 Seeding users...');
    for (const userData of users) {
      await User.create(userData);
    }
    console.log(`✅ ${users.length} users created`);

    // Seed products
    console.log('🛍️  Seeding products...');
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products created`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: admin@ottoman.com');
    console.log('  Password: admin123');
    console.log('\nCustomer:');
    console.log('  Email: customer@test.com');
    console.log('  Password: 123456');
    console.log('\nDealer (Medium Tier):');
    console.log('  Email: dealer@test.com');
    console.log('  Password: 123456');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed
seedDatabase();
