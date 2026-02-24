import apiClient from '@/features/apiClient';

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
