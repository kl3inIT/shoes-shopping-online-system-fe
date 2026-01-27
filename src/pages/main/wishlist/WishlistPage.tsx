import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { WishlistGrid } from '@/features/wishlist';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { mockWishlistItems } from './data';

export function WishlistPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState(mockWishlistItems);

  const handleAddToCart = (productId: string) => {
    console.log('Add to cart from wishlist:', productId);
    // TODO: Implement add to cart logic
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleItemClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <Button variant='ghost' className='mb-2' onClick={() => navigate(-1)}>
          <ArrowLeft className='mr-2 h-4 w-4' />
          {t('common.back')}
        </Button>
        <h1 className='text-3xl font-bold'>{t('wishlist.title')}</h1>
        <p className='text-muted-foreground'>{t('wishlist.subtitle')}</p>
      </div>

      {/* Wishlist Grid */}
      <WishlistGrid
        items={items}
        onAddToCart={handleAddToCart}
        onRemove={handleRemove}
        onItemClick={handleItemClick}
        onContinueShopping={handleContinueShopping}
      />
    </div>
  );
}

export default WishlistPage;
