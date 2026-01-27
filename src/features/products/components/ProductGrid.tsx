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
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
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
