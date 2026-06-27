import { MeasurementType } from '../enums';
import axiosInstance from './axiosInstance';

export type RawMaterialRowPayload = {
  name: string;
  measurementType: MeasurementType;
  category?: string;
};

export type RawMaterialConversionDto = {
  id: number;
  uomName: string;
  conversionFactor: number;
  baseUom: string;
};

export type RawMaterialDto = {
  id: number;
  name: string;
  measurementType: MeasurementType;
  category?: string | null;
  uom?: string;
  conversions?: RawMaterialConversionDto[];
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

export async function addRawMaterialConversion(
  rawMaterialId: number,
  payload: { id?: number; uomName: string; conversionFactor: number; baseUom: string }
) {
  const response = await axiosInstance.post<RawMaterialConversionDto>(
    `/raw-material/${rawMaterialId}/conversion`,
    payload
  );
  return response.data;
}
