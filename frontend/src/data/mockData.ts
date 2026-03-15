export const gouvernorats = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
  "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
  "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili"
];

export const gouvernoratCoords: Record<string, [number, number]> = {
  "Tunis": [36.8065, 10.1815],
  "Ariana": [36.8663, 10.1645],
  "Ben Arous": [36.7533, 10.2282],
  "Manouba": [36.8101, 10.0863],
  "Nabeul": [36.4513, 10.7357],
  "Zaghouan": [36.4029, 10.1429],
  "Bizerte": [37.2744, 9.8739],
  "Béja": [36.7256, 9.1817],
  "Jendouba": [36.5013, 8.7802],
  "Le Kef": [36.1747, 8.7049],
  "Siliana": [36.0849, 9.3708],
  "Sousse": [35.8254, 10.6369],
  "Monastir": [35.7643, 10.8113],
  "Mahdia": [35.5047, 11.0622],
  "Sfax": [34.7406, 10.7603],
  "Kairouan": [35.6781, 10.0963],
  "Kasserine": [35.1676, 8.8365],
  "Sidi Bouzid": [35.0382, 9.4849],
  "Gabès": [33.8815, 10.0982],
  "Médenine": [33.3540, 10.5055],
  "Tataouine": [32.9297, 10.4517],
  "Gafsa": [34.4250, 8.7842],
  "Tozeur": [33.9197, 8.1335],
  "Kébili": [33.7044, 8.9690],
};

export const categories = [
  { id: "plomberie", label: "Plomberie", icon: "Wrench", color: "215 70% 28%" },
  { id: "jardinage", label: "Jardinage", icon: "TreePine", color: "142 70% 40%" },
  { id: "electricite", label: "Électricité", icon: "Zap", color: "35 92% 55%" },
  { id: "peinture", label: "Peinture", icon: "Paintbrush", color: "280 60% 50%" },
  { id: "menage", label: "Ménage", icon: "SprayCan", color: "200 80% 50%" },
  { id: "demenagement", label: "Déménagement", icon: "Truck", color: "25 80% 50%" },
  { id: "maconnerie", label: "Maçonnerie", icon: "Hammer", color: "30 40% 45%" },
  { id: "climatisation", label: "Climatisation", icon: "Wind", color: "190 70% 50%" },
];

export type RequestStatus = "ouverte" | "en_cours" | "terminée" | "annulée";
export type RequestType = "service" | "recherche";

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: RequestStatus;
  budget: string;
  type: RequestType;
  author: {
    name: string;
    avatar: string;
    rating: number;
  };
  createdAt: string;
  volunteersCount: number;
  commentsCount: number;
  image?: string;
  urgent: boolean;
}

export const mockRequests: ServiceRequest[] = [
  {
    id: "1",
    title: "Réparation fuite d'eau cuisine",
    description: "Besoin d'un plombier expérimenté pour réparer une fuite sous l'évier de la cuisine. Le problème persiste depuis 2 jours.",
    category: "plomberie",
    location: "Tunis",
    status: "ouverte",
    budget: "80-150 TND",
    type: "service",
    author: { name: "Ahmed Ben Ali", avatar: "AB", rating: 4.5 },
    createdAt: "2026-02-13",
    volunteersCount: 3,
    commentsCount: 5,
    urgent: true,
  },
  {
    id: "2",
    title: "Recherche jardinier expérimenté",
    description: "Je cherche un jardinier professionnel pour entretien régulier d'un grand jardin. Expérience en taille d'arbres fruitiers souhaitée.",
    category: "jardinage",
    location: "Ariana",
    status: "ouverte",
    budget: "120-200 TND",
    type: "recherche",
    author: { name: "Fatma Trabelsi", avatar: "FT", rating: 4.8 },
    createdAt: "2026-02-12",
    volunteersCount: 7,
    commentsCount: 12,
    urgent: false,
  },
  {
    id: "3",
    title: "Installation tableau électrique",
    description: "Installation d'un nouveau tableau électrique pour un appartement de 3 pièces. Certification requise.",
    category: "electricite",
    location: "Sousse",
    status: "en_cours",
    budget: "300-500 TND",
    type: "service",
    author: { name: "Mohamed Gharbi", avatar: "MG", rating: 4.2 },
    createdAt: "2026-02-10",
    volunteersCount: 2,
    commentsCount: 8,
    urgent: false,
  },
  {
    id: "4",
    title: "Recherche peintre professionnel",
    description: "Recherche un peintre qualifié pour peinture complète d'un appartement S+2 au centre ville. Devis souhaité.",
    category: "peinture",
    location: "Sfax",
    status: "ouverte",
    budget: "400-600 TND",
    type: "recherche",
    author: { name: "Sana Mejri", avatar: "SM", rating: 4.9 },
    createdAt: "2026-02-11",
    volunteersCount: 5,
    commentsCount: 3,
    urgent: false,
  },
  {
    id: "5",
    title: "Nettoyage après travaux",
    description: "Grand nettoyage d'une maison après des travaux de rénovation. Surface totale 150m².",
    category: "menage",
    location: "Ariana",
    status: "ouverte",
    budget: "100-180 TND",
    type: "service",
    author: { name: "Karim Bouazizi", avatar: "KB", rating: 4.6 },
    createdAt: "2026-02-14",
    volunteersCount: 4,
    commentsCount: 2,
    urgent: true,
  },
  {
    id: "6",
    title: "Déménagement appartement",
    description: "Déménagement complet d'un S+3 du centre ville vers la banlieue. Mobilier lourd inclus.",
    category: "demenagement",
    location: "Ben Arous",
    status: "terminée",
    budget: "250-400 TND",
    type: "service",
    author: { name: "Leila Hammami", avatar: "LH", rating: 4.3 },
    createdAt: "2026-02-08",
    volunteersCount: 6,
    commentsCount: 15,
    urgent: false,
  },
  {
    id: "7",
    title: "Recherche plombier urgence",
    description: "Besoin urgent d'un plombier pour une fuite importante dans la salle de bain. Disponibilité immédiate requise.",
    category: "plomberie",
    location: "Manouba",
    status: "ouverte",
    budget: "100-200 TND",
    type: "recherche",
    author: { name: "Nour Sassi", avatar: "NS", rating: 4.1 },
    createdAt: "2026-02-14",
    volunteersCount: 2,
    commentsCount: 4,
    urgent: true,
  },
  {
    id: "8",
    title: "Recherche électricien certifié",
    description: "Cherche un électricien certifié pour mise aux normes d'une installation électrique ancienne. Devis gratuit apprécié.",
    category: "electricite",
    location: "Nabeul",
    status: "ouverte",
    budget: "200-350 TND",
    type: "recherche",
    author: { name: "Amine Khelifi", avatar: "AK", rating: 4.7 },
    createdAt: "2026-02-13",
    volunteersCount: 3,
    commentsCount: 6,
    urgent: false,
  },
  {
    id: "9",
    title: "Peinture extérieure villa",
    description: "Peinture complète de la façade d'une villa sur 2 étages. Fourniture de peinture incluse.",
    category: "peinture",
    location: "Bizerte",
    status: "en_cours",
    budget: "800-1200 TND",
    type: "service",
    author: { name: "Rania Belhadj", avatar: "RB", rating: 4.4 },
    createdAt: "2026-02-09",
    volunteersCount: 4,
    commentsCount: 9,
    urgent: false,
  },
];

export const statusLabels: Record<RequestStatus, string> = {
  ouverte: "Ouverte",
  en_cours: "En cours",
  terminée: "Terminée",
  annulée: "Annulée",
};

export const statusColors: Record<RequestStatus, string> = {
  ouverte: "success",
  en_cours: "warning",
  terminée: "muted",
  annulée: "destructive",
};
