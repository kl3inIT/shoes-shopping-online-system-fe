import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  ProductCard,
  type ProductCardProps,
  useBestSellers,
  useNewArrivals,
  useBrands,
  type ShoeResponse,
  type BrandResponse,
} from '@/features/products';
import { AddToCartDialog, type AddToCartDialogProduct } from '@/features/cart';
import {
  useAddToWishlistMutation,
  useQueryWishlist,
  useRemoveFromWishlistMutation,
} from '@/features/wishlist';
import { resolveImageUrl } from '@/lib/image';
import { FloatingChat } from '@/features/ai/component/FloatingChat';

type HomeProduct = ProductCardProps & { createdAt: string };

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400';

function mapShoe(shoe: ShoeResponse): HomeProduct {
  return {
    id: shoe.id,
    name: shoe.name,
    price: shoe.price,
    image:
      shoe.imageUrls?.length > 0
        ? (resolveImageUrl(shoe.imageUrls[0]) ?? FALLBACK_IMAGE)
        : FALLBACK_IMAGE,
    brand: shoe.brandName,
    createdAt: shoe.createdAt,
    rating: shoe.avgRating ?? 0,
    reviewCount: shoe.reviewCount ?? 0,
    isInWishlist: false,
  };
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1635855374289-b6ca7fe114ab?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvZXMlMjBzaG9wfGVufDB8fDB8fHww';

const services = [
  { icon: Truck, key: 'freeShipping' },
  { icon: Shield, key: 'authentic' },
  { icon: RefreshCw, key: 'easyReturns' },
  { icon: Headphones, key: 'support' },
] as const;

export default function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartProduct, setCartProduct] = useState<AddToCartDialogProduct | null>(
    null
  );

  const { data: bestSellersRaw = [], isLoading: loadingBestSellers } =
    useBestSellers(5);
  const { data: newArrivalsRaw = [], isLoading: loadingNewArrivals } =
    useNewArrivals(5);
  const { data: brands = [], isLoading: loadingBrands } = useBrands();
  const { data: wishlistData = [] } = useQueryWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlistMutation();

  // Base mapped products
  const rawFeatured = bestSellersRaw.map(mapShoe);
  const rawArrivals = newArrivalsRaw.map(mapShoe);

  // Mark those that are already in wishlist
  const wishlistIds = new Set(wishlistData.map((w) => w.shoeId));
  const featured = rawFeatured.map((p) => ({
    ...p,
    isInWishlist: wishlistIds.has(p.id),
  }));
  const arrivals = rawArrivals.map((p) => ({
    ...p,
    isInWishlist: wishlistIds.has(p.id),
  }));

  // All products (used for AddToCartDialog lookup)
  const allMapped = [...featured, ...arrivals];

  const handleClick = (id: string) => navigate(`/products/${id}`);

  const handleAddToCart = (id: string) => {
    const p = allMapped.find((x) => x.id === id);
    if (p) {
      setCartProduct({
        id: p.id,
        name: p.name,
        image: p.image,
        price: p.price,
      });
      setCartOpen(true);
    }
  };

  const wishlistMutation = useAddToWishlistMutation();
  const handleWishlist = (id: string) => {
    if (wishlistIds.has(id)) {
      removeFromWishlistMutation.mutate(id);
    } else {
      wishlistMutation.mutate(id);
    }
  };

  return (
    <div className='relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-6 w-screen'>
      {/* ───── Hero ───── */}
      <section className='relative flex h-[85vh] min-h-[520px] items-end overflow-hidden bg-black'>
        <img
          src={HERO_IMAGE}
          alt='Hero'
          className='absolute inset-0 h-full w-full object-cover opacity-60'
        />
        <div className='relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 lg:px-10'>
          <p className='text-xs font-medium uppercase tracking-[0.25em] text-white/70'>
            {t('home.hero.badge', 'New Collection 2026')}
          </p>
          <h1 className='mt-3 max-w-lg text-4xl font-light leading-[1.1] text-white sm:text-5xl lg:text-6xl'>
            {t('home.hero.title', 'Step Into Style')}
          </h1>
          <p className='mt-4 max-w-md text-sm leading-relaxed text-white/60'>
            {t(
              'home.hero.description',
              'From running shoes to lifestyle sneakers, find the perfect pair that matches your style.'
            )}
          </p>
          <div className='mt-8 flex gap-3'>
            <Button
              size='lg'
              className='rounded-none bg-white px-8 text-xs font-medium uppercase tracking-widest text-black hover:bg-white/90'
              asChild
            >
              <Link to='/products'>
                {t('home.hero.shopNow', 'Shop Now')}
                <ArrowRight className='ml-2 h-4 w-4' />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ───── Services strip ───── */}
      <section className='border-b border-border bg-background'>
        <div className='mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border md:grid-cols-4'>
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.key} className='flex items-center gap-3 px-6 py-5'>
                <Icon className='h-5 w-5 shrink-0 text-muted-foreground' />
                <div>
                  <p className='text-xs font-medium text-foreground'>
                    {t(`home.features.${s.key}.title`)}
                  </p>
                  <p className='text-[11px] text-muted-foreground'>
                    {t(`home.features.${s.key}.description`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ───── Brands ───── */}
      <section className='bg-background py-12'>
        <div className='mx-auto max-w-7xl px-6 lg:px-10'>
          <div className='flex items-center justify-center gap-10 overflow-x-auto md:gap-16'>
            {loadingBrands
              ? Array.from(
                  { length: 5 },
                  (_, placeholderIndex) =>
                    `brand-placeholder-${placeholderIndex + 1}`
                ).map((placeholderKey) => (
                  <div
                    key={placeholderKey}
                    className='h-5 w-20 animate-pulse rounded bg-muted'
                  />
                ))
              : brands.map((b: BrandResponse) => (
                  <Link
                    key={b.id}
                    to={`/products?brand=${b.slug}`}
                    className='shrink-0 transition-opacity hover:opacity-60'
                  >
                    {b.imageUrl ? (
                      <img
                        src={resolveImageUrl(b.imageUrl) ?? b.imageUrl}
                        alt={b.name}
                        className='h-6 w-auto object-contain dark:invert'
                      />
                    ) : (
                      <span className='text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground'>
                        {b.name}
                      </span>
                    )}
                  </Link>
                ))}
          </div>
        </div>
      </section>

      {/* ───── Featured Products ───── */}
      <section className='bg-background pb-16 pt-8'>
        <div className='mx-auto max-w-7xl px-6 lg:px-10'>
          <SectionHeader
            title={t('home.featured.title', 'Featured')}
            link='/products'
            linkText={t('home.featured.viewAll', 'View All')}
          />
          <ProductRow
            products={featured}
            loading={loadingBestSellers}
            onClick={handleClick}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleWishlist}
          />
        </div>
      </section>

      {/* ───── Full-width banner ───── */}
      <section className='relative flex h-[50vh] min-h-[340px] items-center justify-center overflow-hidden'>
        <img
          src='https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1600&q=80'
          alt='Banner'
          className='absolute inset-0 h-full w-full object-cover'
        />
        <div className='absolute inset-0 bg-black/40' />
        <div className='relative z-10 text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.3em] text-white/70'>
            {t('home.newsletter.badge', 'Limited Edition')}
          </p>
          <h2 className='mt-3 text-3xl font-light text-white sm:text-4xl'>
            {t('home.newsletter.title', 'Elevate Your Every Step')}
          </h2>
          <Button
            variant='outline'
            className='mt-6 rounded-none border-white/40 px-8 text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black'
            asChild
          >
            <Link to='/products'>{t('home.hero.shopNow', 'Shop Now')}</Link>
          </Button>
        </div>
      </section>

      {/* ───── New Arrivals ───── */}
      <section className='bg-background py-16'>
        <div className='mx-auto max-w-7xl px-6 lg:px-10'>
          <SectionHeader
            title={t('home.newArrivals.title', 'New Arrivals')}
            link='/products?sort=newest'
            linkText={t('home.newArrivals.viewAll', 'View All')}
          />
          <ProductRow
            products={arrivals}
            loading={loadingNewArrivals}
            onClick={handleClick}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleWishlist}
          />
        </div>
      </section>

      {/* ───── Newsletter ───── */}
      <section className='border-t border-border bg-muted/50 py-16'>
        <div className='mx-auto max-w-xl px-6 text-center'>
          <p className='text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground'>
            {t('home.newsletter.badge', 'Newsletter')}
          </p>
          <h2 className='mt-3 text-2xl font-light text-foreground'>
            {t('home.newsletter.title', 'Stay in the Loop')}
          </h2>
          <p className='mt-2 text-sm text-muted-foreground'>
            {t(
              'home.newsletter.description',
              'Subscribe to get updates on new arrivals, exclusive drops and more.'
            )}
          </p>
          <div className='mt-6 flex gap-0'>
            <input
              type='email'
              placeholder={t(
                'home.newsletter.placeholder',
                'Your email address'
              )}
              className='flex-1 border border-r-0 border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-foreground'
            />
            <Button className='rounded-none px-6 text-xs uppercase tracking-widest'>
              {t('home.newsletter.subscribe', 'Subscribe')}
            </Button>
          </div>
        </div>
      </section>

      {/* ───── Dialogs / extras ───── */}
      <AddToCartDialog
        open={cartOpen}
        onOpenChange={setCartOpen}
        product={cartProduct}
      />
      <FloatingChat />
    </div>
  );
}

/* ── Reusable section header ── */

function SectionHeader({
  title,
  link,
  linkText,
}: {
  title: string;
  link: string;
  linkText: string;
}) {
  return (
    <div className='mb-8 flex items-end justify-between'>
      <h2 className='text-xl font-light uppercase tracking-[0.15em] text-foreground sm:text-2xl'>
        {title}
      </h2>
      <Link
        to={link}
        className='flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground'
      >
        {linkText}
        <ArrowRight className='h-3.5 w-3.5' />
      </Link>
    </div>
  );
}

/* ── Product row with skeleton ── */

function ProductRow({
  products,
  loading,
  onClick,
  onAddToCart,
  onAddToWishlist,
}: {
  products: HomeProduct[];
  loading: boolean;
  onClick: (id: string) => void;
  onAddToCart: (id: string) => void;
  onAddToWishlist: (id: string) => void;
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {Array.from(
          { length: 5 },
          (_, placeholderIndex) => `product-placeholder-${placeholderIndex + 1}`
        ).map((placeholderKey) => (
          <div key={placeholderKey} className='animate-pulse'>
            <div className='aspect-[4/5] bg-muted' />
            <div className='mt-3 h-3 w-3/4 bg-muted' />
            <div className='mt-2 h-3 w-1/3 bg-muted' />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className='py-12 text-center text-sm text-muted-foreground'>
        {t('products.noProducts', { defaultValue: 'No products found.' })}
      </p>
    );
  }

  return (
    <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
      {products.map((p) => (
        <ProductCard
          key={p.id}
          {...p}
          onClick={onClick}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
        />
      ))}
    </div>
  );
}
