import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface ProductFilterProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  maxSearchLength?: number;
  brands?: FilterOption[];
  selectedBrands?: string[];
  onBrandsChange?: (brands: string[]) => void;
  sizes?: FilterOption[];
  selectedSizes?: string[];
  onSizesChange?: (sizes: string[]) => void;
  categories?: FilterOption[];
  selectedCategories?: string[];
  onCategoriesChange?: (categories: string[]) => void;
  genders?: FilterOption[];
  selectedGenders?: string[];
  onGendersChange?: (genders: string[]) => void;
  priceRange?: { min: number; max: number };
  selectedPriceRange?: { min: number; max: number };
  onPriceRangeChange?: (range: { min: number; max: number }) => void;
  sortOptions?: FilterOption[];
  selectedSort?: string;
  onSortChange?: (sort: string) => void;
  onClearFilters?: () => void;
}

export function ProductFilter({
  searchValue = '',
  onSearchSubmit,
  maxSearchLength = 100,
  brands = [],
  selectedBrands = [],
  onBrandsChange,
  sizes = [],
  selectedSizes = [],
  onSizesChange,
  categories = [],
  selectedCategories = [],
  onCategoriesChange,
  genders = [],
  selectedGenders = [],
  onGendersChange,
  priceRange,
  selectedPriceRange,
  onPriceRangeChange,
  sortOptions = [],
  selectedSort,
  onSortChange,
  onClearFilters,
}: ProductFilterProps) {
  const { t } = useTranslation();
  const [localSearchValue, setLocalSearchValue] = useState<string>(searchValue);

  useEffect(() => {
    setLocalSearchValue(searchValue);
  }, [searchValue]);

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    selectedCategories.length > 0 ||
    selectedGenders.length > 0 ||
    (selectedPriceRange &&
      priceRange &&
      (selectedPriceRange.min !== priceRange.min ||
        selectedPriceRange.max !== priceRange.max));

  return (
    <div className='space-y-4'>
      {/* Search */}
      <div className='space-y-2'>
        <Label className='text-sm font-medium'>
          {t('products.searchLabel')}
        </Label>
        <div className='flex gap-2'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder={t('products.search')}
              value={localSearchValue}
              onChange={(e) => {
                const nextValue = e.target.value.slice(0, maxSearchLength);
                setLocalSearchValue(nextValue);
                onSearchChange?.(nextValue);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearchSubmit?.(localSearchValue.trim());
                }
              }}
              maxLength={maxSearchLength}
              className='pl-10'
            />
          </div>
          <Button
            type='button'
            onClick={() => onSearchSubmit?.(localSearchValue.trim())}
            className='px-4'
          >
            {t('products.searchAction')}
          </Button>
        </div>
        <p className='text-xs text-muted-foreground'>
          {t('products.searchHint', { max: maxSearchLength })}
        </p>
      </div>

      {/* Sort */}
      {sortOptions.length > 0 && (
        <div className='flex items-center gap-2'>
          <Label className='text-sm'>{t('products.sortBy')}</Label>
          <Select value={selectedSort} onValueChange={onSortChange}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={t('products.sortPlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Filter Accordion */}
      <Accordion
        type='multiple'
        defaultValue={['brands', 'categories', 'sizes', 'genders']}
      >
        {/* Brands */}
        {brands.length > 0 && (
          <AccordionItem value='brands'>
            <AccordionTrigger>{t('products.filter.brands')}</AccordionTrigger>
            <AccordionContent>
              <div className='space-y-2'>
                {brands.map((brand) => (
                  <div
                    key={brand.value}
                    className='flex items-center space-x-2'
                  >
                    <Checkbox
                      id={`brand-${brand.value}`}
                      checked={selectedBrands.includes(brand.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onBrandsChange?.([...selectedBrands, brand.value]);
                        } else {
                          onBrandsChange?.(
                            selectedBrands.filter((b) => b !== brand.value)
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`brand-${brand.value}`}
                      className='text-sm font-normal'
                    >
                      {brand.label}
                      {brand.count !== undefined && (
                        <span className='ml-1 text-muted-foreground'>
                          ({brand.count})
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <AccordionItem value='categories'>
            <AccordionTrigger>
              {t('products.filter.categories')}
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-2'>
                {categories.map((category) => (
                  <div
                    key={category.value}
                    className='flex items-center space-x-2'
                  >
                    <Checkbox
                      id={`category-${category.value}`}
                      checked={selectedCategories.includes(category.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onCategoriesChange?.([
                            ...selectedCategories,
                            category.value,
                          ]);
                        } else {
                          onCategoriesChange?.(
                            selectedCategories.filter(
                              (c) => c !== category.value
                            )
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`category-${category.value}`}
                      className='text-sm font-normal'
                    >
                      {category.label}
                      {category.count !== undefined && (
                        <span className='ml-1 text-muted-foreground'>
                          ({category.count})
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <AccordionItem value='sizes'>
            <AccordionTrigger>{t('products.filter.sizes')}</AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-wrap gap-2'>
                {sizes.map((size) => (
                  <Button
                    key={size.value}
                    variant={
                      selectedSizes.includes(size.value) ? 'default' : 'outline'
                    }
                    size='sm'
                    onClick={() => {
                      if (selectedSizes.includes(size.value)) {
                        onSizesChange?.(
                          selectedSizes.filter((s) => s !== size.value)
                        );
                      } else {
                        onSizesChange?.([...selectedSizes, size.value]);
                      }
                    }}
                    disabled={size.count === 0}
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
              <p className='mt-2 text-xs text-muted-foreground'>
                {t('products.sizeHint')}
              </p>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Genders */}
        {genders.length > 0 && (
          <AccordionItem value='genders'>
            <AccordionTrigger>{t('products.filter.gender')}</AccordionTrigger>
            <AccordionContent>
              <div className='space-y-2'>
                {genders.map((gender) => (
                  <div
                    key={gender.value}
                    className='flex items-center space-x-2'
                  >
                    <Checkbox
                      id={`gender-${gender.value}`}
                      checked={selectedGenders.includes(gender.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onGendersChange?.([...selectedGenders, gender.value]);
                        } else {
                          onGendersChange?.(
                            selectedGenders.filter((g) => g !== gender.value)
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`gender-${gender.value}`}
                      className='text-sm font-normal'
                    >
                      {gender.label}
                      {gender.count !== undefined && (
                        <span className='ml-1 text-muted-foreground'>
                          ({gender.count})
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Price Range */}
        {priceRange && (
          <AccordionItem value='price'>
            <AccordionTrigger>
              {t('products.filter.priceRange')}
            </AccordionTrigger>
            <AccordionContent>
              <div className='flex items-center gap-2'>
                <Input
                  type='number'
                  placeholder='Min'
                  value={selectedPriceRange?.min ?? priceRange.min}
                  onChange={(e) =>
                    onPriceRangeChange?.({
                      min: Number(e.target.value),
                      max: selectedPriceRange?.max ?? priceRange.max,
                    })
                  }
                  className='w-24'
                />
                <span>-</span>
                <Input
                  type='number'
                  placeholder='Max'
                  value={selectedPriceRange?.max ?? priceRange.max}
                  onChange={(e) =>
                    onPriceRangeChange?.({
                      min: selectedPriceRange?.min ?? priceRange.min,
                      max: Number(e.target.value),
                    })
                  }
                  className='w-24'
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant='ghost'
          size='sm'
          onClick={onClearFilters}
          className='w-full'
        >
          <X className='mr-2 h-4 w-4' />
          Clear all filters
        </Button>
      )}
    </div>
  );
}

export default ProductFilter;
