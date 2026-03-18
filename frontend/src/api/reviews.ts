import api from './api';

export interface Review {
  id: string;
  requestId: string;
  requestTitle?: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
  fromUser: {
    name: string;
    avatar: string;
    profileImageUrl?: string;
  };
}

export interface CreateReviewData {
  requestId: string;
  toUserId: string;
  rating: number;
  comment: string;
}

export const getUserReviews = async (userId: string): Promise<Review[]> => {
  const response = await api.get<Review[]>(`/reviews/user/${userId}`);
  return response.data;
};

export const getRequestReviews = async (requestId: string): Promise<Review[]> => {
  const response = await api.get<Review[]>(`/reviews/request/${requestId}`);
  return response.data;
};

export const createReview = async (reviewData: CreateReviewData): Promise<Review> => {
  const response = await api.post<Review>('/reviews', reviewData);
  return response.data;
};