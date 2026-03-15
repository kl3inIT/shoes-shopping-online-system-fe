import apiClient from '@/features/apiClient';
import { PRODUCT_API_PATHS } from '@/features/products/apiPaths';
import type {
  PageResponse,
  ResponseGeneral,
  ShoeCreateRequestDto,
  ShoeResponse,
  ShoeUpdateRequestDto,
  ShoeStockSummaryResponse,
} from '@/features/products';
import type { ShoesPageQueryParams } from '@/features/products';

export async function getAdminShoes(
  params: ShoesPageQueryParams
): Promise<PageResponse<ShoeResponse>> {
  const response = await apiClient.get<
    ResponseGeneral<PageResponse<ShoeResponse>>
  >(PRODUCT_API_PATHS.shoes, {
    params,
  });

  return response.data.data;
}

export async function createShoe(
  payload: ShoeCreateRequestDto,
  shoeImages?: File[],
  variantImages?: File[][]
): Promise<ResponseGeneral<ShoeResponse>> {
  const formData = new FormData();
  formData.append(
    'request',
    new Blob([JSON.stringify(payload)], { type: 'application/json' })
  );

  formData.append(
    'request',
    new Blob([JSON.stringify(payload)], { type: 'application/json' })
  );

  shoeImages?.forEach((file) => formData.append('shoeImages', file));

  variantImages?.forEach((variantFiles, index) => {
    variantFiles?.forEach((file) => {
      formData.append(`variantImages${index}`, file);
    });
  });

  const response = await apiClient.post<ResponseGeneral<ShoeResponse>>(
    PRODUCT_API_PATHS.shoes,
    formData
  );
  return response.data;
}

export async function updateShoe(
  id: string,
  payload: ShoeUpdateRequestDto,
  shoeImages?: File[],
  variantImages?: File[][]
): Promise<ResponseGeneral<ShoeResponse>> {
  const formData = new FormData();
  formData.append(
    'request',
    new Blob([JSON.stringify(payload)], { type: 'application/json' })
  );

  shoeImages?.forEach((file) => formData.append('shoeImages', file));

  variantImages?.forEach((variantFiles, index) => {
    variantFiles?.forEach((file) => {
      formData.append(`variantImages${index}`, file);
    });
  });

  const response = await apiClient.put<ResponseGeneral<ShoeResponse>>(
    `${PRODUCT_API_PATHS.shoes}/${id}`,
    formData
  );
  return response.data;
}

export async function getAdminShoeStockSummary(
  threshold = 10
): Promise<ShoeStockSummaryResponse> {
  const response = await apiClient.get<
    ResponseGeneral<ShoeStockSummaryResponse>
  >(PRODUCT_API_PATHS.stockSummary, {
    params: {
      threshold,
    },
  });

  return response.data.data;
}
