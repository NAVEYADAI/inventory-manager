import { MeasurementType } from '../enums';
import axiosInstance from './axiosInstance';

export type RawMaterialRowPayload = {
  name: string;
  measurementType: MeasurementType;
  category?: string;
};

export type RawMaterialDto = {
  id: number;
  name: string;
  measurementType: MeasurementType;
  category?: string | null;
};

export async function createRawMaterials(subscriptionId: number, items: RawMaterialRowPayload[]) {
  return axiosInstance.post('/raw-material/bulk', { subscriptionId, items });
}

export async function getRawMaterials(subscriptionId: number) {
  const response = await axiosInstance.get<RawMaterialDto[]>('/raw-material', {
    params: { subscriptionId },
  });
  return response.data;
}

export async function deleteRawMaterial(id: number) {
  return axiosInstance.delete(`/raw-material/${id}`);
}

export async function updateRawMaterial(id: number, payload: Partial<RawMaterialRowPayload>) {
  return axiosInstance.patch(`/raw-material/${id}`, payload);
}
