import axiosInstance from './axiosInstance';

export interface TagDto {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface CreateTagPayload {
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  subscriptionId: number;
}

export interface UpdateTagPayload {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface RecipeSummaryItem {
  id: number;
  name: string;
  totalBatches: number;
  executionCount: number;
}

export interface RawMaterialSummaryItem {
  id: number;
  name: string;
  volume: number;
  uom: string;
}

export interface TagSummaryDto {
  tag: TagDto;
  totalExecutionsCount: number;
  recipes: RecipeSummaryItem[];
  rawMaterials: RawMaterialSummaryItem[];
}

export async function createTag(payload: CreateTagPayload): Promise<TagDto> {
  const response = await axiosInstance.post<TagDto>('/tag', payload);
  return response.data;
}

export async function getTags(subscriptionId: number): Promise<TagDto[]> {
  const response = await axiosInstance.get<TagDto[]>('/tag', {
    params: { subscriptionId },
  });
  return response.data;
}

export async function updateTag(id: number, payload: UpdateTagPayload): Promise<TagDto> {
  const response = await axiosInstance.patch<TagDto>(`/tag/${id}`, payload);
  return response.data;
}

export async function deleteTag(id: number): Promise<{ id: number; deleted: boolean }> {
  const response = await axiosInstance.delete<{ id: number; deleted: boolean }>(`/tag/${id}`);
  return response.data;
}

export async function getTagSummary(id: number): Promise<TagSummaryDto> {
  const response = await axiosInstance.get<TagSummaryDto>(`/tag/${id}/summary`);
  return response.data;
}
