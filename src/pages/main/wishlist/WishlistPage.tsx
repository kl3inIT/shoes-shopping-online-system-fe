import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  WishlistGrid,
  useQueryWishlist,
  useRemoveFromWishlistMutation,
  mapWishlistDtoToItemProps,
} from '@/features/wishlist';
import type { WishlistFilterParams } from '@/features/wishlist';

export function WishlistPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sortByDateAsc, setSortByDateAsc] = useState(true);

  const filterParams: WishlistFilterParams = {
    sortBy: 'createdAt',
    sortOrder: sortByDateAsc ? 'desc' : 'asc',
  };

  const { data, isPending, isError, error } = useQueryWishlist(filterParams);
  const removeMutation = useRemoveFromWishlistMutation();

  const items = data?.map(mapWishlistDtoToItemProps) ?? [];

  const handleRemove = (shoeId: string) => {
    removeMutation.mutate(shoeId);
  };

  const handleItemClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  if (isPending) {
    return (
      <div className='container mx-auto flex justify-center px-4 py-16'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      </div>
    );
  }

  if (isError) {
    return (
      <div className='container mx-auto px-4 py-16 text-center'>
        <p className='text-destructive'>
          {error instanceof Error ? error.message : t('wishlist.loadError')}
        </p>
        <button
          type='button'
          className='mt-4 text-sm underline'
          onClick={() => navigate('/products')}
        >
          {t('wishlist.continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <WishlistGrid
        items={items}
        onRemove={handleRemove}
        onItemClick={handleItemClick}
        onContinueShopping={handleContinueShopping}
        sortByDateAsc={sortByDateAsc}
        onToggleSort={() => setSortByDateAsc((v) => !v)}
      />
    </div>
  );
}

export default WishlistPage;
