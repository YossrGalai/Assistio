import api from "./api";

export type AdminStatus = "active" | "blocked";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  rating?: number;
  status?: AdminStatus;
  avatar?: string;
  city?: string;
  phone?: string;
  bio?: string;
  reviewCount?: number;
  reputationScore?: number;
  completedHelps?: number;
  memberSince?: string;
  lastActiveAt?: string;
  isBlocked?: boolean;
}

export interface AdminVolunteer {
  id: string;
  name: string;
  avatar?: string;
  rating?: number;
  volunteeredAt?: string;
}

export interface AdminRequestLifecycleEvent {
  id: string;
  label: string;
  at: string;
  status: string;
}

export interface AdminRequest {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  images?: string[];
  volunteersCount?: number;
  volunteers?: AdminVolunteer[];
  assignedHelper?: AdminVolunteer | null;
  acceptedHelper?: AdminVolunteer | null;
  creator?: {
    id: string;
    name: string;
    avatar?: string;
    rating?: number;
  };
  lifecycle?: AdminRequestLifecycleEvent[];
}

export interface AdminReview {
  id: string;
  requestId?: string;
  requestTitle?: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
  fromUser: {
    name: string;
    avatar?: string;
    profileImageUrl?: string;
  };
}

export interface AdminStats {
  totalUsers?: number;
  totalRequests?: number;
  activeUsers?: number;
  requestsByStatus?: Record<string, number>;
  requestsCreatedOverTime?: Array<{ label: string; value: number }>;
  mostActiveCategories?: Array<{ label: string; value: number }>;
  recentActivities?: Array<{
    id: string;
    type: string;
    title: string;
    description?: string;
    createdAt: string;
  }>;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  requestCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await api.get("/users");
  return response.data;
};

export const updateAdminUser = async (
  id: string,
  payload: Partial<AdminUser>,
): Promise<AdminUser> => {
  const response = await api.put(`/users/${id}`, payload);
  return response.data;
};

export const deleteAdminUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const getAdminRequests = async (): Promise<AdminRequest[]> => {
  const response = await api.get("/requests");
  return response.data;
};

export const getAdminRequestDetail = async (id: string): Promise<AdminRequest> => {
  const response = await api.get(`/request-detail/${id}`);
  return response.data;
};

export const deleteAdminRequest = async (id: string): Promise<void> => {
  await api.delete(`/requests/${id}`);
};

export const updateAdminRequestStatus = async (
  id: string,
  status: string,
): Promise<AdminRequest> => {
  const response = await api.put(`/requests/${id}/status`, { status });
  return response.data;
};

export const getAdminReviews = async (): Promise<AdminReview[]> => {
  const response = await api.get("/reviews");
  return response.data;
};

export const getAdminStats = async (): Promise<AdminStats> => {
  const response = await api.get("/stats");
  return response.data;
};

export const getAdminCategories = async (): Promise<AdminCategory[]> => {
  const response = await api.get("/categories");
  return response.data;
};

export const createAdminCategory = async (
  payload: Pick<AdminCategory, "name" | "description" | "active">,
): Promise<AdminCategory> => {
  const response = await api.post("/categories", payload);
  return response.data;
};

export const updateAdminCategory = async (
  id: string,
  payload: Pick<AdminCategory, "name" | "description" | "active">,
): Promise<AdminCategory> => {
  const response = await api.put(`/categories/${id}`, payload);
  return response.data;
};

export const deleteAdminCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};
