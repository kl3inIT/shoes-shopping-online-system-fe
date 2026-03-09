import apiClient from '@/features/apiClient';
import type { ResponseGeneral } from '@/features/products';

export async function uploadShoeImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.post('/api/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data as string;
}

export interface CreateShoePayloadVariant {
  size: string;
  color: string;
  quantity: number;
}

export interface CreateShoePayload {
  name: string;
  description: string;
  material: string;
  gender: string;
  status: string;
  categoryId: string;
  brandId: string;
  price: number;
  variants: CreateShoePayloadVariant[];
}

export async function createShoe(
  payload: CreateShoePayload,
  shoeImages?: File[],
  variantImages?: File[][]
): Promise<ResponseGeneral<unknown>> {
  const formData = new FormData();

  formData.append(
    'request',
    new Blob([JSON.stringify(payload)], { type: 'application/json' })
  );

  if (shoeImages && shoeImages.length > 0) {
    shoeImages.forEach((file) => {
      formData.append('shoeImages', file);
    });
  }

  if (variantImages && variantImages.length > 0) {
    variantImages.forEach((variantFiles, index) => {
      if (variantFiles && variantFiles.length > 0) {
        variantFiles.forEach((file) => {
          formData.append(`variantImages${index}`, file);
        });
      }
    });
  }

  const response = await apiClient.post<ResponseGeneral<unknown>>(
    '/api/shoes',
    formData
  );

  return response.data;
}
