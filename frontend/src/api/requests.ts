import api from './api';

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  city?: string;
  gouvernorat?: string;
  status: 'ouverte' | 'en_cours' | 'terminée' | 'annulée';
  budget: string;
  type: 'service' | 'recherche';
  urgent: boolean;
  urgency?: 'low' | 'medium' | 'high';
  image?: string;
  volunteersCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    city?: string;
    profileImageUrl?: string;
  };
}

export interface CreateRequestData {
  title: string;
  description: string;
  category: string;
  city?: string;
  gouvernorat?: string;
  budget?: string;
  type?: 'service' | 'recherche';
  urgency?: 'low' | 'medium' | 'high';
  image?: string;
}

export interface RequestFilters {
  status?: string;
  category?: string;
  city?: string;
  type?: string;
  urgent?: boolean;
}

export const getRequests = async (filters?: RequestFilters): Promise<ServiceRequest[]> => {
  const params: Record<string, string> = {};
  if (filters?.status) params.status = filters.status;
  if (filters?.category) params.category = filters.category;
  if (filters?.city) params.city = filters.city;
  if (filters?.type) params.type = filters.type;
  if (filters?.urgent) params.urgent = 'true';

  const response = await api.get<ServiceRequest[]>('/requests', { params });
  return response.data;
};

export const getRequestsByUser = async (userId: string): Promise<ServiceRequest[]> => {
  const response = await api.get<ServiceRequest[]>(`/requests/user/${userId}`);
  return response.data;
};

export const getRequest = async (id: string): Promise<ServiceRequest> => {
  const response = await api.get<ServiceRequest>(`/requests/${id}`);
  return response.data;
};

export const createRequest = async (requestData: CreateRequestData): Promise<ServiceRequest> => {
  const response = await api.post<ServiceRequest>('/requests', requestData);
  return response.data;
};

export const updateRequest = async (
  id: string,
  requestData: Partial<CreateRequestData & { status: string }>
): Promise<ServiceRequest> => {
  const response = await api.put<ServiceRequest>(`/requests/${id}`, requestData);
  return response.data;
};

export const deleteRequest = async (id: string): Promise<void> => {
  await api.delete(`/requests/${id}`);
};
export const getCompletedAsVolunteer = async (userId: string): Promise<ServiceRequest[]> => {
  const response = await api.get<ServiceRequest[]>(`/requests/completed-as-volunteer/${userId}`);
  return response.data;
};