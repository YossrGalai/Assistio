import api from './api';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface Volunteer {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  rating: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface RequestDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  city: string;
  gouvernorat: string;
  status: string;
  budget: string;
  type: string;
  urgent: boolean;
  urgency: string;
  image?: string;
  volunteersCount: number;
  commentsCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    city: string;
  };
  comments: Comment[];
  volunteers: Volunteer[];
}

export const getRequestDetail = async (id: string): Promise<RequestDetail> => {
  const response = await api.get<RequestDetail>(`/request-detail/${id}`);
  return response.data;
};

export const addComment = async (
  requestId: string,
  data: { text: string; userId: string; userName: string }
): Promise<Comment> => {
  const response = await api.post<Comment>(`/request-detail/${requestId}/comments`, data);
  return response.data;
};

export const acceptVolunteer = async (requestId: string, volunteerId: string): Promise<void> => {
  await api.put(`/request-detail/${requestId}/volunteers/${volunteerId}/accept`);
};

export const rejectVolunteer = async (requestId: string, volunteerId: string): Promise<void> => {
  await api.put(`/request-detail/${requestId}/volunteers/${volunteerId}/reject`);
};

export const finishRequest = async (requestId: string): Promise<void> => {
  await api.put(`/request-detail/${requestId}/finish`);
};

export const cancelRequest = async (requestId: string): Promise<void> => {
  await api.put(`/request-detail/${requestId}/cancel`);
};