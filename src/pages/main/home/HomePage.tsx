import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/features/products';
import { FloatingChat } from '@/components/FloatingChat';

import {
  heroContent,
  featuredProducts,
  newArrivals,
  features,
  categories,
  brands,
} from './data';

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (id: string) => {
    console.log('Add to cart:', id);
    // TODO: Implement add to cart
  };

  const handleAddToWishlist = (id: string) => {
    console.log('Add to wishlist:', id);
    // TODO: Implement add to wishlist
  };

  return (
    <div className='-mx-4 -mt-6 space-y-12'>
      {/* Hero Section */}
      <section className='relative h-[500px] overflow-hidden bg-gradient-to-r from-primary/10 via-background to-primary/5'>
        <div className='absolute inset-0 opacity-20'>
          <img
            src={heroContent.backgroundImage}
            alt='Hero background'
            className='h-full w-full object-cover'
          />
        </div>
        <div className='relative mx-auto flex h-full max-w-6xl items-center px-4'>
          <div className='max-w-xl space-y-6'>
            <Badge variant='secondary' className='text-sm'>
              {t('home.hero.badge')}
            </Badge>
            <h1 className='text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'>
              {t('home.hero.title')}
            </h1>
            <p className='text-lg text-muted-foreground'>
              {t('home.hero.description')}
            </p>
            <div className='flex gap-4'>
              <Button size='lg' asChild>
                <Link to={heroContent.ctaLink}>
                  {t('home.hero.shopNow')}
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Link>
              </Button>
              <Button size='lg' variant='outline' asChild>
                <Link to='/about'>{t('home.hero.learnMore')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className='mx-auto max-w-6xl px-4'>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const featureKeys = [
              'freeShipping',
              'authentic',
              'easyReturns',
              'support',
            ];
            return (
              <Card key={feature.title} className='border-none shadow-sm'>
                <CardContent className='flex items-center gap-4 p-4'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
                    <Icon className='h-6 w-6 text-primary' />
                  </div>
                  <div>
                    <h3 className='font-medium'>
                      {t(`home.features.${featureKeys[index]}.title`)}
                    </h3>
                    <p className='text-xs text-muted-foreground'>
                      {t(`home.features.${featureKeys[index]}.description`)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Shop by Category */}
      <section className='mx-auto max-w-6xl px-4'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>{t('home.categories.title')}</h2>
            <p className='text-muted-foreground'>
              {t('home.categories.subtitle')}
            </p>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.link}
              className='group relative aspect-square overflow-hidden rounded-lg'
            >
              <img
                src={category.image}
                alt={category.name}
                className='h-full w-full object-cover transition-transform group-hover:scale-105'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent' />
              <div className='absolute bottom-4 left-4'>
                <h3 className='text-xl font-bold text-white'>
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className='mx-auto max-w-6xl px-4'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>{t('home.featured.title')}</h2>
            <p className='text-muted-foreground'>
              {t('home.featured.subtitle')}
            </p>
          </div>
          <Button variant='outline' asChild>
            <Link to='/products'>
              {t('home.featured.viewAll')}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className='bg-primary/5 py-16'>
        <div className='mx-auto max-w-6xl px-4 text-center'>
          <Badge className='mb-4'>{t('home.newsletter.badge')}</Badge>
          <h2 className='text-3xl font-bold sm:text-4xl'>
            {t('home.newsletter.title')}
          </h2>
          <p className='mx-auto mt-4 max-w-2xl text-muted-foreground'>
            {t('home.newsletter.description')}
          </p>
          <div className='mx-auto mt-6 flex max-w-md gap-2'>
            <input
              type='email'
              placeholder={t('home.newsletter.placeholder')}
              className='flex-1 rounded-md border bg-background px-4 py-2'
            />
            <Button>{t('home.newsletter.subscribe')}</Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className='mx-auto max-w-6xl px-4'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>
              {t('home.newArrivals.title')}
            </h2>
            <p className='text-muted-foreground'>
              {t('home.newArrivals.subtitle')}
            </p>
          </div>
          <Button variant='outline' asChild>
            <Link to='/products?sort=newest'>
              {t('home.newArrivals.viewAll')}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Link>
          </Button>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>
      </section>

      {/* Brands */}
      <section className='mx-auto max-w-6xl px-4 pb-8'>
        <div className='mb-6 text-center'>
          <h2 className='text-2xl font-bold'>{t('home.brands.title')}</h2>
          <p className='text-muted-foreground'>{t('home.brands.subtitle')}</p>
        </div>
        <div className='flex flex-wrap items-center justify-center gap-8'>
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={`/products?brand=${brand.name.toLowerCase()}`}
              className='flex flex-col items-center gap-2 transition-transform hover:scale-105'
            >
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl'>
                {brand.logo}
              </div>
              <span className='text-sm font-medium'>{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Floating Chat Widget */}
      <FloatingChat />
    </div>
  );
}
