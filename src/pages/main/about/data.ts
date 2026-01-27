import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import type { FaqItem } from '@/features/about';
import type { AboutFeature } from '@/features/about';

export const aboutFeatures: AboutFeature[] = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description:
      'Free shipping on all orders over $100. Fast delivery within 3-5 business days.',
  },
  {
    icon: Shield,
    title: '100% Authentic',
    description:
      'All products are 100% authentic and sourced directly from brands.',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day hassle-free return policy. No questions asked.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our customer support team is available 24/7 to help you.',
  },
];

export const faqItems: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How do I track my order?',
    answer:
      'Once your order is shipped, you will receive an email with a tracking number. You can use this number to track your package on our website or the carrier\'s website. You can also view your order status in your account under "Order History".',
    category: 'orders',
  },
  {
    id: 'faq-2',
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day return policy for all unworn items in their original packaging. Simply initiate a return through your account, print the prepaid shipping label, and drop off the package at any authorized location. Refunds are processed within 5-7 business days after we receive the item.',
    category: 'returns',
  },
  {
    id: 'faq-3',
    question: 'How do I find my shoe size?',
    answer:
      "We provide a detailed size guide on each product page. You can also use our virtual fitting tool to find your perfect size. If you're between sizes, we recommend going up half a size for a more comfortable fit.",
    category: 'sizing',
  },
  {
    id: 'faq-4',
    question: 'Are all products authentic?',
    answer:
      'Yes, we guarantee 100% authenticity on all products. We source directly from brands and authorized distributors. Each item comes with original packaging, tags, and authenticity certificates where applicable.',
    category: 'products',
  },
  {
    id: 'faq-5',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and SE Pay. All transactions are secured with SSL encryption.',
    category: 'payment',
  },
  {
    id: 'faq-6',
    question: 'How long does shipping take?',
    answer:
      'Standard shipping takes 3-5 business days. Express shipping (1-2 business days) is available for an additional fee. International shipping times vary by location, typically 7-14 business days.',
    category: 'shipping',
  },
];

export const aboutContent = {
  hero: {
    title: 'About Shoes Shopping Online',
    subtitle: 'Our Story',
    description:
      'Founded in 2024, Shoes Shopping Online has become the premier destination for footwear enthusiasts. We curate the finest selection of shoes from top brands, ensuring quality, style, and comfort for every customer.',
  },
  mission: {
    title: 'Our Mission',
    description:
      'To provide customers with an exceptional shopping experience by offering high-quality footwear, outstanding customer service, and a seamless online platform that makes finding the perfect pair of shoes effortless.',
  },
  vision: {
    title: 'Our Vision',
    description:
      'To be the most trusted and loved online shoe retailer, known for our commitment to authenticity, customer satisfaction, and innovation in the footwear industry.',
  },
};
