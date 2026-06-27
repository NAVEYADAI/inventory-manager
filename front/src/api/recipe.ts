import { UOM } from '../enums';
import axiosInstance from './axiosInstance';

export interface RecipeIngredientPayload {
  rawMaterialId: number;
  volume: number;
  uom: UOM;
  customUom?: string;
}

export interface CreateRecipePayload {
  name: string;
  subscriptionId: number;
  ingredients: RecipeIngredientPayload[];
  yieldType?: 'UNITS' | 'WEIGHT';
  isIntermediate?: boolean;
}

export interface RecipeIngredientDto {
  id: number;
  volume: number;
  uom: UOM;
  customUom?: string;
  raw_material: {
    id: number;
    name: string;
    measurementType: string;
    category?: string | null;
  };
}

export interface RecipeDto {
  id: number;
  name: string;
  is_deleted: boolean;
  recipe_product: RecipeIngredientDto[];
  yieldType: 'UNITS' | 'WEIGHT';
  isIntermediate: boolean;
}

export async function createRecipe(payload: CreateRecipePayload) {
  return axiosInstance.post('/recipe', payload);
}

export async function getRecipes(subscriptionId: number) {
  const response = await axiosInstance.get<RecipeDto[]>('/recipe', {
    params: { subscriptionId },
  });
  return response.data;
}

export async function deleteRecipe(id: number) {
  return axiosInstance.delete(`/recipe/${id}`);
}

export async function updateRecipe(id: number, payload: Partial<CreateRecipePayload>) {
  return axiosInstance.patch(`/recipe/${id}`, payload);
}
