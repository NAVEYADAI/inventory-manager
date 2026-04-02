import axiosInstance from "./axiosInstance";

export type CompanyInfo = { id: number; name: string; subscriptionId: number };
export type SubscriptionRecord = {
  id: number;
  company: { id: number; name: string };
  is_active: boolean;
};

export async function listMySubscriptions() {
  return axiosInstance.get<SubscriptionRecord[]>("/subscription/user");
}

export async function activateSubscription(id: number) {
  return axiosInstance.post<{
    accessToken?: string;
    selectedCompany: CompanyInfo;
    subscriptionId: number;
    message: string;
  }>(`/subscription/${id}/activate`);
}

export async function selectSubscription(subscriptionId: number) {
  return axiosInstance.post<{
    accessToken?: string;
    selectedCompany: CompanyInfo;
    subscriptionId: number;
    message: string;
  }>("/auth/select-company", { subscriptionId });
}
