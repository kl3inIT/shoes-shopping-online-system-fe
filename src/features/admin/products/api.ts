import apiClient from '@/features/apiClient';
import type {
  PageResponse,
  ResponseGeneral,
  ShoeCreateRequestDto,
  ShoeResponse,
  ShoeUpdateRequestDto,
  ShoeStockSummaryResponse,
} from '@/features/products';

export async function getAdminShoes(): Promise<ShoeResponse[]> {
  const response = await apiClient.get<
    ResponseGeneral<PageResponse<ShoeResponse>>
  >('/api/v1/shoes', {
    params: {
      page: 0,
      size: 100,
      sort: 'createdAt,desc',
    },
  });

  return response.data.data.content;
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
    '/api/v1/shoes',
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
    `/api/v1/shoes/${id}`,
    formData
  );
  return response.data;
}

export async function getAdminShoeStockSummary(
  threshold = 10
): Promise<ShoeStockSummaryResponse> {
  const response = await apiClient.get<
    ResponseGeneral<ShoeStockSummaryResponse>
  >('/api/v1/shoes/stock-summary', {
    params: {
      threshold,
    },
  });

  return response.data.data;
}
