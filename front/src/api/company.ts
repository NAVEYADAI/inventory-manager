import axiosInstance from "./axiosInstance";

export type CreateCompanyPayload = {
  name: string;
  identifier?: string;
  address?: string;
  phone?: string;
  ownerId?: number;
};

export async function createCompany(payload: CreateCompanyPayload) {
  return await axiosInstance.post("/company", payload);
}
