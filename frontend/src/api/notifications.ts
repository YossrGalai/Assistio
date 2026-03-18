import api from './api';

export interface AppNotification {
  id: string;
  type:
    | 'aide_proposee'
    | 'aide_acceptee'
    | 'demande_terminee'
    | 'nouveau_commentaire'
    | 'review_recue'
    | 'systeme';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedRequestId?: string;
  fromUser?: {
    name: string;
    avatar: string;
    profileImageUrl?: string;
  };
}

export const getNotifications = async (): Promise<AppNotification[]> => {
  const response = await api.get<AppNotification[]>('/notifications');
  return response.data;
};

export const markAsRead = async (id: string): Promise<{ id: string; read: boolean }> => {
  const response = await api.put<{ id: string; read: boolean }>(`/notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async (): Promise<{ message: string }> => {
  const response = await api.put<{ message: string }>('/notifications/read-all');
  return response.data;
};

export const deleteNotification = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/notifications/${id}`);
  return response.data;
};