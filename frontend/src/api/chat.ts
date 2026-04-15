import api from "./api";

export interface ChatResponse {
  answer: string;
}

export const sendChatMessage = async (question: string): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>("/chat", { question });
  return response.data;
};
