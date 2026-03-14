import { ProductCard, type ProductCardProps } from './ProductCard';

export interface ProductGridProps {
  products: ProductCardProps[];
  onProductClick?: (id: string) => void;
  onAddToCart?: (id: string) => void;
  onAddToWishlist?: (id: string) => void;
}

export function ProductGrid({
  products,
  onProductClick,
  onAddToCart,
  onAddToWishlist,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className='flex h-64 items-center justify-center text-muted-foreground'>
        No products found.
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onClick={onProductClick}
          onAddToCart={onAddToCart}
          onAddToWishlist={onAddToWishlist}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
