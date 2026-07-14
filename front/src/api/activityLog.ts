import axiosInstance from './axiosInstance';

export interface ActivityLogDto {
  id: number;
  userName: string;
  action: string;
  category: 'work_management' | 'employee_management';
  details: string;
  createdTime: string;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export async function getActivityLogs(subscriptionId: number): Promise<ActivityLogDto[]> {
  const response = await axiosInstance.get<ActivityLogDto[]>('/activity-log', {
    params: { subscriptionId },
  });
  return response.data;
}
