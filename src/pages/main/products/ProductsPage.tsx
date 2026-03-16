import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  PageEmptyState,
  PageErrorState,
  PageLoader,
  PaginationControls,
  ReloadPageButton,
} from '@/components/app';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

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
import { AddToCartDialog, type AddToCartDialogProduct } from '@/features/cart';
import {
  useAddToWishlistMutation,
  useQueryWishlist,
  useRemoveFromWishlistMutation,
} from '@/features/wishlist';
import { useIsMobile } from '@/hooks/useMobile';
import { getErrorMessage } from '@/features/apiClient';
import { resolveImageUrl } from '@/lib/image';

import { priceRange, sizeOptions } from './data';

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
  reviewCount: number;
  variants: ShoeResponse['variants'];
  isInWishlist?: boolean;
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
  page?: number;
  size?: number;
};

type FilterSidebarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  dynamicBrandOptions: {
    value: string;
    label: string;
    count?: number;
  }[];
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  dynamicCategoryOptions: {
    value: string;
    label: string;
    count?: number;
  }[];
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
  dynamicSizeOptions: {
    value: string;
    label: string;
    count?: number;
  }[];
  selectedSizes: string[];
  onSizesChange: (sizes: string[]) => void;
  dynamicGenderOptions: {
    value: string;
    label: string;
    count?: number;
  }[];
  selectedGenders: string[];
  onGendersChange: (genders: string[]) => void;
  selectedPriceRange: {
    min: number;
    max: number;
  };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  sortOptions: {
    value: string;
    label: string;
  }[];
  selectedSort: string;
  onSortChange: (sort: string) => void;
  onClearFilters: () => void;
};

const GENDER_OPTIONS = ['MEN', 'WOMEN', 'UNISEX'] as const;
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 40];

function parseListParam(value: string | null) {
  return value ? value.split(',').filter(Boolean) : [];
}

function parseNumberParam(value: string | null) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parsePageParam(value: string | null, fallback: number) {
  const parsed = parseNumberParam(value);
  return parsed !== undefined && parsed >= 0 ? parsed : fallback;
}

function parseFilterState(searchParams: URLSearchParams): FilterState {
  return {
    q: searchParams.get('q') ?? undefined,
    brands: parseListParam(searchParams.get('brands')),
    sizes: parseListParam(searchParams.get('sizes')),
    categories: parseListParam(searchParams.get('categories')),
    genders: parseListParam(searchParams.get('genders')),
    min: parseNumberParam(searchParams.get('min')),
    max: parseNumberParam(searchParams.get('max')),
    sort: searchParams.get('sort') ?? undefined,
    page: parsePageParam(searchParams.get('page'), 0),
    size: parsePageParam(searchParams.get('size'), DEFAULT_PAGE_SIZE),
  };
}

function mapSortToApiSort(sort: string) {
  switch (sort) {
    case 'price-asc':
      return 'price,asc';
    case 'price-desc':
      return 'price,desc';
    case 'rating':
      return 'rating,desc';
    case 'popular':
      return 'popular,desc';
    case 'newest':
    default:
      return 'createdAt,desc';
  }
}

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
  selectedPriceRange,
  onPriceRangeChange,
  sortOptions,
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
      priceRange={priceRange}
      selectedPriceRange={selectedPriceRange}
      onPriceRangeChange={onPriceRangeChange}
      sortOptions={sortOptions}
      selectedSort={selectedSort}
      onSortChange={onSortChange}
      onClearFilters={onClearFilters}
    />
  );
}

export default function ProductsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobile();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartProduct, setCartProduct] = useState<AddToCartDialogProduct | null>(
    null
  );
  const addToWishlistMutation = useAddToWishlistMutation();
  const { data: wishlistData = [] } = useQueryWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlistMutation();

  const initialFilters = useMemo(
    () => parseFilterState(searchParams),
    [searchParams]
  );

  const [searchDraft, setSearchDraft] = useState(initialFilters.q ?? '');
  const [searchQuery, setSearchQuery] = useState(initialFilters.q ?? '');
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
  const [selectedSort, setSelectedSort] = useState(
    initialFilters.sort ?? 'newest'
  );
  const [currentPage, setCurrentPage] = useState(initialFilters.page ?? 0);
  const [pageSize, setPageSize] = useState(
    initialFilters.size ?? DEFAULT_PAGE_SIZE
  );

  const { data: brands = [] } = useBrands();
  const { data: categories = [] } = useCategories();

  const selectedBrandIds = useMemo(
    () =>
      brands
        .filter((brand) => selectedBrands.includes(brand.slug))
        .map((brand) => brand.id),
    [brands, selectedBrands]
  );

  const selectedCategoryIds = useMemo(
    () =>
      categories
        .filter((category) => selectedCategories.includes(category.slug))
        .map((category) => category.id),
    [categories, selectedCategories]
  );

  const shoesQuery = useShoes({
    page: currentPage,
    size: pageSize,
    sort: mapSortToApiSort(selectedSort),
    search: searchQuery || undefined,
    brandIds: selectedBrandIds.length > 0 ? selectedBrandIds : undefined,
    sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
    categoryIds:
      selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
    minPrice:
      selectedPriceRange.min > priceRange.min
        ? selectedPriceRange.min
        : undefined,
    maxPrice:
      selectedPriceRange.max < priceRange.max
        ? selectedPriceRange.max
        : undefined,
    statuses: ['ACTIVE', 'OUT_OF_STOCK'],
    genders: selectedGenders.length > 0 ? selectedGenders : undefined,
  });

  const shoesPage = shoesQuery.data;
  const shoesData = shoesPage?.content ?? [];

  useEffect(() => {
    if (!shoesPage || shoesPage.totalPages === 0) {
      return;
    }

    if (currentPage > shoesPage.totalPages - 1) {
      setCurrentPage(Math.max(0, shoesPage.totalPages - 1));
    }
  }, [currentPage, shoesPage]);

  useEffect(() => {
    const nextSearchParams = new URLSearchParams();

    if (searchQuery) nextSearchParams.set('q', searchQuery);
    if (selectedBrands.length > 0) {
      nextSearchParams.set('brands', selectedBrands.join(','));
    }
    if (selectedSizes.length > 0) {
      nextSearchParams.set('sizes', selectedSizes.join(','));
    }
    if (selectedCategories.length > 0) {
      nextSearchParams.set('categories', selectedCategories.join(','));
    }
    if (selectedGenders.length > 0) {
      nextSearchParams.set('genders', selectedGenders.join(','));
    }
    if (selectedPriceRange.min > priceRange.min) {
      nextSearchParams.set('min', String(selectedPriceRange.min));
    }
    if (selectedPriceRange.max < priceRange.max) {
      nextSearchParams.set('max', String(selectedPriceRange.max));
    }
    if (selectedSort !== 'newest') {
      nextSearchParams.set('sort', selectedSort);
    }
    if (currentPage > 0) {
      nextSearchParams.set('page', String(currentPage));
    }
    if (pageSize !== DEFAULT_PAGE_SIZE) {
      nextSearchParams.set('size', String(pageSize));
    }

    if (nextSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [
    currentPage,
    pageSize,
    searchParams,
    searchQuery,
    selectedBrands,
    selectedCategories,
    selectedGenders,
    selectedPriceRange,
    selectedSizes,
    selectedSort,
    setSearchParams,
  ]);

  const mappedProducts: MappedProduct[] = useMemo(
    () =>
      shoesData.map((shoe: ShoeResponse) => ({
        id: shoe.id,
        name: shoe.name,
        price: shoe.price,
        image:
          shoe.imageUrls && shoe.imageUrls.length > 0
            ? (resolveImageUrl(shoe.imageUrls[0]) ?? '')
            : '',
        brand: shoe.brandName,
        brandSlug: shoe.brandSlug,
        rating: shoe.avgRating ?? 0,
        reviewCount: shoe.reviewCount ?? 0,
        categorySlug: shoe.categorySlug,
        gender: shoe.gender,
        createdAt: shoe.createdAt,
        variants: shoe.variants ?? [],
      })),
    [shoesData]
  );

  const wishlistIds = useMemo(
    () => new Set(wishlistData.map((wishlist) => wishlist.shoeId)),
    [wishlistData]
  );

  const products = useMemo(
    () =>
      mappedProducts.map((product) => ({
        ...product,
        isInWishlist: wishlistIds.has(product.id),
      })),
    [mappedProducts, wishlistIds]
  );

  const localizedSortOptions = useMemo(
    () => [
      { value: 'newest', label: t('products.sort.newest') },
      { value: 'price-asc', label: t('products.sort.priceAsc') },
      { value: 'price-desc', label: t('products.sort.priceDesc') },
      { value: 'rating', label: t('products.sort.rating') },
      { value: 'popular', label: t('products.sort.popular') },
    ],
    [t]
  );

  const brandOptions = useMemo(
    () =>
      brands
        .map((brand: BrandResponse) => ({
          value: brand.slug,
          label: brand.name,
        }))
        .sort((left, right) => left.label.localeCompare(right.label)),
    [brands]
  );

  const categoryOptions = useMemo(
    () =>
      categories
        .map((category: CategoryResponse) => ({
          value: category.slug,
          label: category.name,
        }))
        .sort((left, right) => left.label.localeCompare(right.label)),
    [categories]
  );

  const genderOptions = useMemo(
    () =>
      GENDER_OPTIONS.map((gender) => ({
        value: gender,
        label: t(`products.gender.${gender.toLowerCase()}`, gender),
      })),
    [t]
  );

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    selectedCategories.length > 0 ||
    selectedGenders.length > 0 ||
    selectedPriceRange.min !== priceRange.min ||
    selectedPriceRange.max !== priceRange.max ||
    selectedSort !== 'newest';

  const handleClearFilters = () => {
    setSearchDraft('');
    setSearchQuery('');
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedPriceRange(priceRange);
    setSelectedSort('newest');
    setCurrentPage(0);
  };

  const handleProductClick = (id: string) => {
    void navigate(`/products/${id}`);
  };

  const handleAddToCart = (id: string) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    setCartProduct({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
    });
    setCartOpen(true);
  };

  const handleAddToWishlist = (id: string) => {
    if (wishlistIds.has(id)) {
      removeFromWishlistMutation.mutate(id);
    } else {
      addToWishlistMutation.mutate(id);
    }
  };

  if (shoesQuery.isPending && !shoesPage) {
    return <PageLoader description='Loading product catalog and filters.' />;
  }

  if (shoesQuery.isError && !shoesPage) {
    return (
      <PageErrorState
        description={getErrorMessage(shoesQuery.error)}
        action={<ReloadPageButton />}
      />
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>{t('products.title')}</h1>
          <p className='text-muted-foreground'>
            {t('products.showing', {
              count: products.length,
              total: shoesPage?.totalElements ?? 0,
            })}
          </p>
        </div>

        <div className='flex items-center gap-2'>
          {shoesQuery.isFetching && !shoesQuery.isPending ? (
            <span className='text-sm text-muted-foreground'>
              {t('products.loadingResults', 'Updating results...')}
            </span>
          ) : null}

          {hasActiveFilters ? (
            <Badge variant='secondary' className='gap-1'>
              {t('products.filtersActive')}
              <button
                onClick={handleClearFilters}
                className='ml-1 hover:text-destructive'
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          ) : null}

          {isMobile ? (
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
                    searchValue={searchDraft}
                    onSearchChange={setSearchDraft}
                    onSearchSubmit={(value) => {
                      setSearchDraft(value);
                      setSearchQuery(value);
                      setCurrentPage(0);
                    }}
                    dynamicBrandOptions={brandOptions}
                    selectedBrands={selectedBrands}
                    onBrandsChange={(brandsValue) => {
                      setSelectedBrands(brandsValue);
                      setCurrentPage(0);
                    }}
                    dynamicCategoryOptions={categoryOptions}
                    selectedCategories={selectedCategories}
                    onCategoriesChange={(categoriesValue) => {
                      setSelectedCategories(categoriesValue);
                      setCurrentPage(0);
                    }}
                    dynamicSizeOptions={sizeOptions}
                    selectedSizes={selectedSizes}
                    onSizesChange={(sizesValue) => {
                      setSelectedSizes(sizesValue);
                      setCurrentPage(0);
                    }}
                    dynamicGenderOptions={genderOptions}
                    selectedGenders={selectedGenders}
                    onGendersChange={(gendersValue) => {
                      setSelectedGenders(gendersValue);
                      setCurrentPage(0);
                    }}
                    selectedPriceRange={selectedPriceRange}
                    onPriceRangeChange={(range) => {
                      setSelectedPriceRange(range);
                      setCurrentPage(0);
                    }}
                    sortOptions={localizedSortOptions}
                    selectedSort={selectedSort}
                    onSortChange={(sortValue) => {
                      setSelectedSort(sortValue);
                      setCurrentPage(0);
                    }}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          ) : null}
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-4'>
        {!isMobile ? (
          <aside className='lg:col-span-1'>
            <div className='sticky top-20 rounded-lg border p-4'>
              <h2 className='mb-4 font-semibold'>{t('products.filters')}</h2>
              <FilterSidebar
                searchValue={searchDraft}
                onSearchChange={setSearchDraft}
                onSearchSubmit={(value) => {
                  setSearchDraft(value);
                  setSearchQuery(value);
                  setCurrentPage(0);
                }}
                dynamicBrandOptions={brandOptions}
                selectedBrands={selectedBrands}
                onBrandsChange={(brandsValue) => {
                  setSelectedBrands(brandsValue);
                  setCurrentPage(0);
                }}
                dynamicCategoryOptions={categoryOptions}
                selectedCategories={selectedCategories}
                onCategoriesChange={(categoriesValue) => {
                  setSelectedCategories(categoriesValue);
                  setCurrentPage(0);
                }}
                dynamicSizeOptions={sizeOptions}
                selectedSizes={selectedSizes}
                onSizesChange={(sizesValue) => {
                  setSelectedSizes(sizesValue);
                  setCurrentPage(0);
                }}
                dynamicGenderOptions={genderOptions}
                selectedGenders={selectedGenders}
                onGendersChange={(gendersValue) => {
                  setSelectedGenders(gendersValue);
                  setCurrentPage(0);
                }}
                selectedPriceRange={selectedPriceRange}
                onPriceRangeChange={(range) => {
                  setSelectedPriceRange(range);
                  setCurrentPage(0);
                }}
                sortOptions={localizedSortOptions}
                selectedSort={selectedSort}
                onSortChange={(sortValue) => {
                  setSelectedSort(sortValue);
                  setCurrentPage(0);
                }}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>
        ) : null}

        <div className={isMobile ? 'col-span-1' : 'lg:col-span-3'}>
          {shoesQuery.isError && shoesPage ? (
            <div className='mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive'>
              {getErrorMessage(shoesQuery.error)}
            </div>
          ) : null}

          {products.length === 0 ? (
            <PageEmptyState
              title={t(
                'products.emptyTitle',
                'No products match these filters'
              )}
              description={t(
                'products.emptyDescription',
                'Try clearing one or more filters to broaden the catalog results.'
              )}
              action={
                <Button variant='outline' onClick={handleClearFilters}>
                  {t('products.clearFilters')}
                </Button>
              }
            />
          ) : (
            <ProductGrid
              products={products}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          )}

          {shoesPage ? (
            <div className='mt-8'>
              <PaginationControls
                page={shoesPage.pageNumber ?? shoesPage.number}
                totalPages={shoesPage.totalPages}
                totalElements={shoesPage.totalElements}
                pageSize={shoesPage.size}
                pageSizeOptions={PAGE_SIZE_OPTIONS}
                isFirst={shoesPage.first}
                isLast={shoesPage.last}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(0);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>

      <AddToCartDialog
        open={cartOpen}
        onOpenChange={setCartOpen}
        product={cartProduct}
      />
    </div>
  );
}
