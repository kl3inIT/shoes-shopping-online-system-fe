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

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface ProductFilterProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  brands?: FilterOption[];
  selectedBrands?: string[];
  onBrandsChange?: (brands: string[]) => void;
  sizes?: FilterOption[];
  selectedSizes?: string[];
  onSizesChange?: (sizes: string[]) => void;
  categories?: FilterOption[];
  selectedCategories?: string[];
  onCategoriesChange?: (categories: string[]) => void;
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
  onSearchChange,
  brands = [],
  selectedBrands = [],
  onBrandsChange,
  sizes = [],
  selectedSizes = [],
  onSizesChange,
  categories = [],
  selectedCategories = [],
  onCategoriesChange,
  priceRange,
  selectedPriceRange,
  onPriceRangeChange,
  sortOptions = [],
  selectedSort,
  onSortChange,
  onClearFilters,
}: ProductFilterProps) {
  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedSizes.length > 0 ||
    selectedCategories.length > 0 ||
    (selectedPriceRange &&
      priceRange &&
      (selectedPriceRange.min !== priceRange.min ||
        selectedPriceRange.max !== priceRange.max));

  return (
    <div className='space-y-4'>
      {/* Search */}
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
        <Input
          placeholder='Search shoes...'
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Sort */}
      {sortOptions.length > 0 && (
        <div className='flex items-center gap-2'>
          <Label className='text-sm'>Sort by:</Label>
          <Select value={selectedSort} onValueChange={onSortChange}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Select' />
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
        defaultValue={['brands', 'sizes', 'categories']}
      >
        {/* Brands */}
        {brands.length > 0 && (
          <AccordionItem value='brands'>
            <AccordionTrigger>Brands</AccordionTrigger>
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

        {/* Sizes */}
        {sizes.length > 0 && (
          <AccordionItem value='sizes'>
            <AccordionTrigger>Sizes</AccordionTrigger>
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
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <AccordionItem value='categories'>
            <AccordionTrigger>Categories</AccordionTrigger>
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

        {/* Price Range */}
        {priceRange && (
          <AccordionItem value='price'>
            <AccordionTrigger>Price Range</AccordionTrigger>
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
