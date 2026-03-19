import type { Request, CreateRequestDTO } from "../types/request";

const API_URL = "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const createRequest = async (data: CreateRequestDTO): Promise<Request> => {
  const response = await fetch(`${API_URL}/requests`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("❌ Erreur backend:", err);
    throw new Error(err.message || "Erreur lors de la création");
  }

  return response.json();
};

export const getRequests = async (): Promise<Request[]> => {
  const response = await fetch(`${API_URL}/requests`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("❌ Erreur backend:", err);
    throw new Error(err.message || "Erreur lors de la récupération des demandes");
  }

  return response.json();
};