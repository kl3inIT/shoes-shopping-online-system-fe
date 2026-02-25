import type { ProductCardProps } from '@/features/products';
import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

export const heroContent = {
  title: 'Step Into Style',
  subtitle: 'Discover the latest collection of premium footwear',
  description:
    'From running shoes to lifestyle sneakers, find the perfect pair that matches your style and performance needs.',
  ctaText: 'Shop Now',
  ctaLink: '/products',
  backgroundImage:
    'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&q=80',
};

export const featuredProducts: ProductCardProps[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Nike Air Max 270',
    price: 150,
    originalPrice: 180,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    brand: 'Nike',
    isNew: true,
    isSale: true,
    rating: 4.5,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Adidas Ultraboost 22',
    price: 190,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    brand: 'Adidas',
    isNew: true,
    rating: 4.8,
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    name: 'Jordan 1 Retro High',
    price: 170,
    image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400',
    brand: 'Jordan',
    isNew: true,
    rating: 4.9,
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'New Balance 990v5',
    price: 185,
    image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400',
    brand: 'New Balance',
    rating: 4.7,
  },
];

export const newArrivals: ProductCardProps[] = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Puma RS-X',
    price: 110,
    originalPrice: 130,
    image: 'https://images.unsplash.com/photo-1608379743498-fa39e1ca79b2?w=400',
    brand: 'Puma',
    isSale: true,
    rating: 4.2,
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    name: 'Converse Chuck Taylor',
    price: 65,
    image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400',
    brand: 'Converse',
    rating: 4.4,
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    name: 'Vans Old Skool',
    price: 70,
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
    brand: 'Vans',
    rating: 4.3,
  },
  {
    id: '88888888-8888-8888-8888-888888888888',
    name: 'Reebok Classic Leather',
    price: 80,
    originalPrice: 95,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    brand: 'Reebok',
    isSale: true,
    rating: 4.1,
  },
];

export const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Free shipping on orders over $100',
  },
  {
    icon: Shield,
    title: '100% Authentic',
    description: 'All products are 100% genuine',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day hassle-free returns',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Contact us anytime',
  },
];

export const categories = [
  {
    name: 'Running',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
    link: '/products?category=running',
  },
  {
    name: 'Casual',
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400',
    link: '/products?category=casual',
  },
  {
    name: 'Basketball',
    image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=400',
    link: '/products?category=basketball',
  },
  {
    name: 'Training',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
    link: '/products?category=training',
  },
];

export const brands = [
  { name: 'Nike', logo: '🏃' },
  { name: 'Adidas', logo: '⚡' },
  { name: 'Puma', logo: '🐆' },
  { name: 'New Balance', logo: '🎯' },
  { name: 'Converse', logo: '⭐' },
  { name: 'Vans', logo: '🛹' },
];
