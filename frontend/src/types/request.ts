export type Request = {
  _id: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  gouvernorat?: string;
  status: "pending" | "in_progress" | "done";
  createdAt: string;
  updatedAt: string;
};

export type CreateRequestDTO = {
  title: string;
  description: string;
  category: string;
  urgency: string;

  latitude: number;
  longitude: number;

  city?: string;
  gouvernorat?: string;
};