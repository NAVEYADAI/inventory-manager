import axiosInstance from './axiosInstance';

export interface CreateProductDto {
  id: number;
  recipe: {
    id: number;
    name: string;
    yieldType: 'UNITS' | 'WEIGHT';
  };
  batche_count: number;
  actualYield?: number | null;
  created_time: string;
  updated_time: string;
}

export interface CreateProductPayload {
  recipeId: number;
  batche_count: number;
  created_time: string;
  actualYield?: number;
}

export async function createProductExecution(payload: CreateProductPayload): Promise<CreateProductDto> {
  const response = await axiosInstance.post<CreateProductDto>('/create-product', payload);
  return response.data;
}

export async function getProductExecutions(subscriptionId: number): Promise<CreateProductDto[]> {
  const response = await axiosInstance.get<CreateProductDto[]>('/create-product', {
    params: { subscriptionId },
  });
  return response.data;
}

export async function deleteProductExecution(id: number): Promise<{ id: number; deleted: boolean }> {
  const response = await axiosInstance.delete<{ id: number; deleted: boolean }>(`/create-product/${id}`);
  return response.data;
}
