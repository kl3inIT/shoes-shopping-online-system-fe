/** Brand from API (GET /api/brands, GET /api/brands/:id) */
export interface BrandDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

/** Body POST /api/brands, PUT /api/brands/:id */
export interface BrandRequestDto {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
  country: string;
}
