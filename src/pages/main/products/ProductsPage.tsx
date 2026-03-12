import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
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
} from '@/features/products';
import { useIsMobile } from '@/hooks/useMobile';
import { resolveImageUrl } from '@/lib/image';

import { sortOptions, priceRange } from './data';

type MappedProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  brandSlug: string;
  categorySlug: string;
  gender: string;
  createdAt: string;
  rating: number;
  variants: ShoeResponse['variants'];
};

type FilterState = {
  q?: string;
  brands?: string[];
  sizes?: string[];
  categories?: string[];
  genders?: string[];
  min?: number;
  max?: number;
  sort?: string;
};

type FilterSidebarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  dynamicBrandOptions: {
    value: string;
    label: string;
    count: number;
  }[];
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  dynamicCategoryOptions: {
    value: string;
    label: string;
    count: number;
  }[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  dynamicSizeOptions: {
    value: string;
    label: string;
    count: number;
  }[];
  selectedSizes: string[];
  onSizesChange: (sizes: string[]) => void;
  dynamicGenderOptions: {
    value: string;
    label: string;
    count: number;
  }[];
  selectedGenders: string[];
  onGendersChange: (genders: string[]) => void;
  dynamicPriceRange: {
    min: number;
    max: number;
  };
  selectedPriceRange: {
    min: number;
    max: number;
  };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  sortOptions: typeof sortOptions;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
};

function FilterSidebar({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  dynamicBrandOptions,
  selectedBrands,
  onBrandsChange,
  dynamicCategoryOptions,
  selectedCategories,
  onCategoriesChange,
  dynamicSizeOptions,
  selectedSizes,
  onSizesChange,
  dynamicGenderOptions,
  selectedGenders,
  onGendersChange,
  dynamicPriceRange,
  selectedPriceRange,
  onPriceRangeChange,
  sortOptions: filterSortOptions,
  selectedSort,
  onSortChange,
  onClearFilters,
}: FilterSidebarProps) {
  return (
    <ProductFilter
      searchValue={searchValue}
      onSearchChange={onSearchChange}
      onSearchSubmit={onSearchSubmit}
      brands={dynamicBrandOptions}
      selectedBrands={selectedBrands}
      onBrandsChange={onBrandsChange}
      categories={dynamicCategoryOptions}
      selectedCategories={selectedCategories}
      onCategoriesChange={onCategoriesChange}
      sizes={dynamicSizeOptions}
      selectedSizes={selectedSizes}
      onSizesChange={onSizesChange}
      genders={dynamicGenderOptions}
      selectedGenders={selectedGenders}
      onGendersChange={onGendersChange}
      priceRange={dynamicPriceRange}
      selectedPriceRange={selectedPriceRange}
      onPriceRangeChange={onPriceRangeChange}
      sortOptions={filterSortOptions}
      selectedSort={selectedSort}
      onSortChange={onSortChange}
      onClearFilters={onClearFilters}
    />
  );
}

export default function ProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const parseListParam = (value: string | null) =>
    value ? value.split(',').filter(Boolean) : [];

  const parseNumberParam = (value: string | null) => {
    if (!value) {
      return undefined;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  };

  const parseFilterState = (): FilterState => {
    const params = new URLSearchParams(location.search);

    return {
      q: params.get('q') ?? undefined,
      brands: parseListParam(params.get('brands')),
      sizes: parseListParam(params.get('sizes')),
      categories: parseListParam(params.get('categories')),
      genders: parseListParam(params.get('genders')),
      min: parseNumberParam(params.get('min')),
      max: parseNumberParam(params.get('max')),
      sort: params.get('sort') ?? undefined,
    };
  };

  const initialFilters = parseFilterState();

  const { data: shoesData = [], isLoading, error } = useShoes();
  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  // Filter states
  const [searchValue, setSearchValue] = useState(initialFilters.q ?? '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    initialFilters.brands ?? []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    initialFilters.sizes ?? []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialFilters.categories ?? []
  );
  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    initialFilters.genders ?? []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState({
    min: initialFilters.min ?? priceRange.min,
    max: initialFilters.max ?? priceRange.max,
  });
  const [hasAdjustedPriceRange, setHasAdjustedPriceRange] = useState(
    initialFilters.min !== undefined || initialFilters.max !== undefined
  );
  const [selectedSort, setSelectedSort] = useState(
    initialFilters.sort ?? 'newest'
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Map ShoeResponse to view model for filters + ProductGrid
  const mappedProducts: MappedProduct[] = shoesData.map(
    (shoe: ShoeResponse) => ({
      id: shoe.id,
      name: shoe.name,
      price: shoe.price,
      image:
        shoe.imageUrls && shoe.imageUrls.length > 0
          ? (resolveImageUrl(shoe.imageUrls[0]) ?? '')
          : '',
      brand: shoe.brandName,
      brandSlug: shoe.brandSlug,
      rating: 0, // Backend doesn't provide rating yet
      categorySlug: shoe.categorySlug,
      gender: shoe.gender,
      createdAt: shoe.createdAt,
      variants: shoe.variants ?? [],
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

    // Size filter
    if (selectedSizes.length > 0) {
      const availableSizes = product.variants.map((variant) => variant.size);
      if (!selectedSizes.some((size) => availableSizes.includes(size))) {
        return false;
      }
    }

    // Gender filter
    if (
      selectedGenders.length > 0 &&
      !selectedGenders.includes(product.gender)
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
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / itemsPerPage)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchValue,
    selectedSort,
    selectedBrands,
    selectedSizes,
    selectedCategories,
    selectedPriceRange,
  ]);

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Dynamic filter options from backend data
  const productSizeCounts = mappedProducts.reduce((acc, product) => {
    product.variants.forEach((variant) => {
      if (!variant.size) {
        return;
      }
      acc.set(variant.size, (acc.get(variant.size) ?? 0) + variant.quantity);
    });
    return acc;
  }, new Map<string, number>());

  const dynamicSizeOptions = Array.from(productSizeCounts.entries())
    .map(([size, count]) => ({
      value: size,
      label: size,
      count,
    }))
    .sort((a, b) => Number(a.value) - Number(b.value));

  const dynamicBrandOptions = brands.map((b: BrandResponse) => {
    const count = mappedProducts.filter(
      (product) => product.brandSlug === b.slug
    ).length;

    return {
      value: b.slug,
      label: b.name,
      count,
    };
  });

  const dynamicCategoryOptions = categories.map((c: CategoryResponse) => {
    const count = mappedProducts.filter(
      (product) => product.categorySlug === c.slug
    ).length;

    return {
      value: c.slug,
      label: c.name,
      count,
    };
  });

  const dynamicGenderOptions = Array.from(
    mappedProducts.reduce((acc, product) => {
      if (!product.gender) {
        return acc;
      }
      acc.set(product.gender, (acc.get(product.gender) ?? 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([gender, count]) => ({
    value: gender,
    label: gender,
    count,
  }));

  const dynamicPriceRange = mappedProducts.reduce(
    (range, product) => ({
      min: Math.min(range.min, product.price),
      max: Math.max(range.max, product.price),
    }),
    { min: priceRange.min, max: priceRange.max }
  );

  useEffect(() => {
    if (!selectedPriceRange || hasAdjustedPriceRange) {
      return;
    }

    if (
      selectedPriceRange.min === dynamicPriceRange.min &&
      selectedPriceRange.max === dynamicPriceRange.max
    ) {
      return;
    }

    setSelectedPriceRange(dynamicPriceRange);
  }, [dynamicPriceRange, selectedPriceRange, hasAdjustedPriceRange]);

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
    setSelectedGenders([]);
    setSelectedPriceRange(dynamicPriceRange);
    setHasAdjustedPriceRange(false);
    setSelectedSort('newest');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchValue ||
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    selectedCategories.length > 0 ||
    selectedGenders.length > 0 ||
    selectedPriceRange.min !== dynamicPriceRange.min ||
    selectedPriceRange.max !== dynamicPriceRange.max;

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
                  <FilterSidebar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onSearchSubmit={(value) => setSearchValue(value)}
                    dynamicBrandOptions={dynamicBrandOptions}
                    selectedBrands={selectedBrands}
                    onBrandsChange={setSelectedBrands}
                    dynamicCategoryOptions={dynamicCategoryOptions}
                    selectedCategories={selectedCategories}
                    onCategoriesChange={setSelectedCategories}
                    dynamicSizeOptions={dynamicSizeOptions}
                    selectedSizes={selectedSizes}
                    onSizesChange={setSelectedSizes}
                    dynamicGenderOptions={dynamicGenderOptions}
                    selectedGenders={selectedGenders}
                    onGendersChange={setSelectedGenders}
                    dynamicPriceRange={dynamicPriceRange}
                    selectedPriceRange={selectedPriceRange}
                    onPriceRangeChange={(range) => {
                      setSelectedPriceRange(range);
                      setHasAdjustedPriceRange(true);
                    }}
                    sortOptions={sortOptions}
                    selectedSort={selectedSort}
                    onSortChange={setSelectedSort}
                    onClearFilters={handleClearFilters}
                  />
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
              <FilterSidebar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                onSearchSubmit={(value) => setSearchValue(value)}
                dynamicBrandOptions={dynamicBrandOptions}
                selectedBrands={selectedBrands}
                onBrandsChange={setSelectedBrands}
                dynamicCategoryOptions={dynamicCategoryOptions}
                selectedCategories={selectedCategories}
                onCategoriesChange={setSelectedCategories}
                dynamicSizeOptions={dynamicSizeOptions}
                selectedSizes={selectedSizes}
                onSizesChange={setSelectedSizes}
                dynamicGenderOptions={dynamicGenderOptions}
                selectedGenders={selectedGenders}
                onGendersChange={setSelectedGenders}
                dynamicPriceRange={dynamicPriceRange}
                selectedPriceRange={selectedPriceRange}
                onPriceRangeChange={(range) => {
                  setSelectedPriceRange(range);
                  setHasAdjustedPriceRange(true);
                }}
                sortOptions={sortOptions}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
                onClearFilters={handleClearFilters}
              />
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
