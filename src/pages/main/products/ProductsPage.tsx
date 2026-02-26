import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import {
  ProductGrid,
  ProductFilter,
  useShoes,
  useBrands,
  useCategories,
  type ShoeResponse,
  type BrandResponse,
  type CategoryResponse,
} from '@/features/home/products';
import { useIsMobile } from '@/hooks/useMobile';
import { resolveImageUrl } from '@/lib/image';

import { sizeOptions, sortOptions, priceRange } from './data';

type MappedProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  brandSlug: string;
  categorySlug: string;
  createdAt: string;
  rating: number;
};

export default function ProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { data: shoesData = [], isLoading, error } = useShoes();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  // Filter states
  const [searchValue, setSearchValue] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRange);
  const [selectedSort, setSelectedSort] = useState('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Map ShoeResponse to view model for filters + ProductGrid
  const mappedProducts: MappedProduct[] = shoesData.map(
    (shoe: ShoeResponse) => ({
      id: shoe.id,
      name: shoe.name,
      price: shoe.price,
      image:
        shoe.imageUrls && shoe.imageUrls.length > 0
          ? (resolveImageUrl(shoe.imageUrls[0]) ??
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400')
          : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', // fallback
      brand: shoe.brandName,
      brandSlug: shoe.brandSlug,
      rating: 0, // Backend doesn't provide rating yet
      categorySlug: shoe.categorySlug,
      createdAt: shoe.createdAt,
    })
  );

  // Filter products based on search and filters
  const filteredProducts = mappedProducts.filter((product: MappedProduct) => {
    // Search filter
    if (
      searchValue &&
      !product.name.toLowerCase().includes(searchValue.toLowerCase()) &&
      !product.brand.toLowerCase().includes(searchValue.toLowerCase())
    ) {
      return false;
    }

    // Brand filter
    if (
      selectedBrands.length > 0 &&
      !selectedBrands.includes(product.brandSlug)
    ) {
      return false;
    }

    // Category filter
    if (
      selectedCategories.length > 0 &&
      !selectedCategories.includes(product.categorySlug)
    ) {
      return false;
    }

    // Price filter
    if (
      product.price < selectedPriceRange.min ||
      product.price > selectedPriceRange.max
    ) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort(
    (a: MappedProduct, b: MappedProduct) => {
      switch (selectedSort) {
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    }
  );

  // Client-side Paginate
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Dynamic filter options from backend data
  const dynamicBrandOptions = brands.map((b: BrandResponse) => ({
    value: b.slug,
    label: b.name,
    count: 0,
  }));

  const dynamicCategoryOptions = categories.map((c: CategoryResponse) => ({
    value: c.slug,
    label: c.name,
    count: 0,
  }));

  const handleProductClick = (id: string) => {
    navigate(`/products/${id}`);
  };

  const handleAddToCart = (id: string) => {
    console.log('Add to cart:', id);
  };

  const handleAddToWishlist = (id: string) => {
    console.log('Add to wishlist:', id);
  };

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex h-96 flex-col items-center justify-center gap-4'>
        <p className='text-destructive'>
          Error loading products. Please try again later.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const handleClearFilters = () => {
    setSearchValue('');
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedCategories([]);
    setSelectedPriceRange(priceRange);
    setSelectedSort('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchValue ||
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    selectedCategories.length > 0 ||
    selectedPriceRange.min !== priceRange.min ||
    selectedPriceRange.max !== priceRange.max;

  const FilterSidebar = () => (
    <ProductFilter
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      brands={dynamicBrandOptions}
      selectedBrands={selectedBrands}
      onBrandsChange={setSelectedBrands}
      sizes={sizeOptions}
      selectedSizes={selectedSizes}
      onSizesChange={setSelectedSizes}
      categories={dynamicCategoryOptions}
      selectedCategories={selectedCategories}
      onCategoriesChange={setSelectedCategories}
      priceRange={priceRange}
      selectedPriceRange={selectedPriceRange}
      onPriceRangeChange={setSelectedPriceRange}
      sortOptions={sortOptions}
      selectedSort={selectedSort}
      onSortChange={setSelectedSort}
      onClearFilters={handleClearFilters}
    />
  );

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{t('products.title')}</h1>
          <p className='text-muted-foreground'>
            {t('products.showing', {
              count: paginatedProducts.length,
              total: sortedProducts.length,
            })}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {/* Active Filters Count */}
          {hasActiveFilters && (
            <Badge variant='secondary' className='gap-1'>
              {t('products.filtersActive')}
              <button
                onClick={handleClearFilters}
                className='ml-1 hover:text-destructive'
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          )}

          {/* Mobile Filter Button */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' size='sm'>
                  <SlidersHorizontal className='mr-2 h-4 w-4' />
                  {t('products.filters')}
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-80 overflow-y-auto'>
                <SheetHeader>
                  <SheetTitle>{t('products.filters')}</SheetTitle>
                </SheetHeader>
                <div className='mt-6'>
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-4'>
        {/* Desktop Filter Sidebar */}
        {!isMobile && (
          <aside className='lg:col-span-1'>
            <div className='sticky top-20 rounded-lg border p-4'>
              <h2 className='mb-4 font-semibold'>{t('products.filters')}</h2>
              <FilterSidebar />
            </div>
          </aside>
        )}

        {/* Products Grid */}
        <div className={isMobile ? 'col-span-1' : 'lg:col-span-3'}>
          <ProductGrid
            products={paginatedProducts}
            onProductClick={handleProductClick}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className='mt-8'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
