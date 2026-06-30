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

export async function updateEmployeeRole(companyId: number, userId: number, role: string) {
  return await axiosInstance.patch(`/company/${companyId}/employees/${userId}/role`, { role });
}

export async function removeEmployee(companyId: number, userId: number) {
  return await axiosInstance.delete(`/company/${companyId}/employees/${userId}`);
}
