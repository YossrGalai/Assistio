import type { Request, CreateRequestDTO } from "../types/request";
import api from "../api/api";

export const createRequest = async (data: CreateRequestDTO): Promise<Request> => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("urgency", data.urgency);
  formData.append("latitude", String(data.latitude ?? ""));
  formData.append("longitude", String(data.longitude ?? ""));
  if (data.city) formData.append("city", data.city);
  if (data.gouvernorat) formData.append("gouvernorat", data.gouvernorat);
  if (data.imageFile) formData.append("image", data.imageFile);

  const response = await api.post<Request>("/requests", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getRequests = async (): Promise<Request[]> => {
  const response = await api.get<Request[]>("/requests");
  return response.data;
};
