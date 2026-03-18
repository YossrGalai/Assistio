import type { Request, CreateRequestDTO } from "../types/request";

export const createRequest = async (
  data: CreateRequestDTO
): Promise<Request> => {
  const response = await fetch("http://localhost:5000/api/requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création");
  }

  return response.json();
};

export const getRequests = async (): Promise<Request[]> => {
  const response = await fetch("http://localhost:5000/api/requests");

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des demandes");
  }

  return response.json();
};