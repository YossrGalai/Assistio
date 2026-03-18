export type NotificationType = "aide_proposee" | "aide_acceptee" | "demande_terminee" | "nouveau_commentaire" | "review_recue" | "systeme";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedRequestId?: string;
  fromUser?: {
    name: string;
    avatar: string;
  };
}

export interface Review {
  id: string;
  requestId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
  fromUser: {
    name: string;
    avatar: string;
  };
}

export const notificationTypeLabels: Record<NotificationType, string> = {
  aide_proposee: "Aide proposée",
  aide_acceptee: "Aide acceptée",
  demande_terminee: "Demande terminée",
  nouveau_commentaire: "Nouveau commentaire",
  review_recue: "Avis reçu",
  systeme: "Système",
};

export const notificationTypeIcons: Record<NotificationType, string> = {
  aide_proposee: "UserPlus",
  aide_acceptee: "CheckCircle",
  demande_terminee: "CheckCheck",
  nouveau_commentaire: "MessageSquare",
  review_recue: "Star",
  systeme: "Info",
};

export const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "aide_proposee",
    title: "Nouvelle candidature",
    message: "Ali Mansouri a proposé son aide pour votre demande « Réparation fuite d'eau cuisine ».",
    read: false,
    createdAt: "2026-03-15T10:30:00",
    relatedRequestId: "1",
    fromUser: { name: "Ali Mansouri", avatar: "AM" },
  },
  {
    id: "n2",
    type: "aide_acceptee",
    title: "Aide acceptée !",
    message: "Votre candidature pour « Installation tableau électrique » a été acceptée par Mohamed Gharbi.",
    read: false,
    createdAt: "2026-03-15T09:15:00",
    relatedRequestId: "3",
    fromUser: { name: "Mohamed Gharbi", avatar: "MG" },
  },
  {
    id: "n3",
    type: "nouveau_commentaire",
    title: "Nouveau commentaire",
    message: "Nour Khelifi a commenté votre demande « Recherche jardinier expérimenté ».",
    read: true,
    createdAt: "2026-03-14T18:45:00",
    relatedRequestId: "2",
    fromUser: { name: "Nour Khelifi", avatar: "NK" },
  },
  {
    id: "n4",
    type: "demande_terminee",
    title: "Service terminé",
    message: "La demande « Déménagement appartement » a été marquée comme terminée. N'oubliez pas de laisser un avis !",
    read: true,
    createdAt: "2026-03-14T16:00:00",
    relatedRequestId: "6",
    fromUser: { name: "Leila Hammami", avatar: "LH" },
  },
  {
    id: "n5",
    type: "review_recue",
    title: "Nouvel avis",
    message: "Leila Hammami vous a donné 5 étoiles pour « Déménagement appartement ». Bravo !",
    read: true,
    createdAt: "2026-03-14T14:20:00",
    relatedRequestId: "6",
    fromUser: { name: "Leila Hammami", avatar: "LH" },
  },
  {
    id: "n6",
    type: "systeme",
    title: "Bienvenue sur Assistio",
    message: "Complétez votre profil pour augmenter votre score de réputation et recevoir plus de demandes.",
    read: true,
    createdAt: "2026-03-13T08:00:00",
  },
];

export const mockReviews: Review[] = [
  {
    id: "r1",
    requestId: "6",
    fromUserId: "u2",
    toUserId: "u1",
    rating: 5,
    comment: "Excellent travail, très professionnel et ponctuel. Je recommande vivement !",
    createdAt: "2026-03-14T14:20:00",
    fromUser: { name: "Leila Hammami", avatar: "LH" },
  },
  {
    id: "r2",
    requestId: "3",
    fromUserId: "u3",
    toUserId: "u1",
    rating: 4,
    comment: "Bon travail dans l'ensemble, installation propre. Un peu en retard le premier jour.",
    createdAt: "2026-03-10T11:00:00",
    fromUser: { name: "Mohamed Gharbi", avatar: "MG" },
  },
];
