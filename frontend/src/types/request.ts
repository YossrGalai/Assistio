export type Request = {
  id?: string;
  title: string;
  description: string;
  category: string;
  urgency: "low" | "medium" | "high";
  latitude?: number;
  longitude?: number;
  city?: string;
  gouvernorat?: string;
  status?: "pending" | "in_progress" | "done";
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  author?: {
    id: string;
    name: string;
    rating: number;
    city: string;
    profileImageUrl: string;
  };
  image?: string;
};

export type CreateRequestDTO = {
  title: string;
  description: string;
  category: string;
  urgency: "low" | "medium" | "high";
  latitude: number;
  longitude: number;
  city?: string;
  gouvernorat?: string;
  image?: string;
  imageFile?: File | null;
};
