import { useState, useEffect } from "react";
import {
  Bell, UserPlus, CheckCircle, CheckCheck,
  MessageSquare, Star, Info, Trash2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification as deleteNotificationAPI,
  type AppNotification,
} from "../api/notifications";

type NotificationType = AppNotification["type"];

const iconMap: Record<NotificationType, React.ElementType> = {
  aide_proposee: UserPlus,
  aide_acceptee: CheckCircle,
  demande_terminee: CheckCheck,
  nouveau_commentaire: MessageSquare,
  review_recue: Star,
  systeme: Info,
};

const iconColorMap: Record<NotificationType, string> = {
  aide_proposee: "text-primary",
  aide_acceptee: "text-[hsl(var(--success))]",
  demande_terminee: "text-[hsl(var(--success))]",
  nouveau_commentaire: "text-[hsl(var(--info))]",
  review_recue: "text-accent",
  systeme: "text-muted-foreground",
};

const notificationTypeLabels: Record<NotificationType, string> = {
  aide_proposee: "Aide proposée",
  aide_acceptee: "Aide acceptée",
  demande_terminee: "Terminée",
  nouveau_commentaire: "Commentaire",
  review_recue: "Avis reçu",
  systeme: "Système",
};

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setError(null);
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error("Erreur lors du chargement des notifications :", err);
        setError("Impossible de charger les notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadNotifs = notifications.filter((n) => !n.read);

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Erreur markAllAsRead :", error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Erreur markAsRead :", error);
    }
  };

  const handleDelete = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNotificationAPI(id);
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  const handleClearAll = async () => {
    const toDelete = [...notifications];
    setNotifications([]);
    try {
      await Promise.all(toDelete.map((n) => deleteNotificationAPI(n.id)));
    } catch (error) {
      console.error("Erreur suppression globale :", error);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("fr-TN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderNotification = (notif: AppNotification) => {
    const Icon = iconMap[notif.type] ?? Info;
    return (
      <div
        key={notif.id}
        className={`flex items-start gap-4 rounded-xl border border-border p-4 transition-colors ${
          !notif.read ? "bg-primary/5 border-primary/20" : "bg-card"
        }`}
      >
        <div
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted ${
            iconColorMap[notif.type] ?? "text-muted-foreground"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{notif.title}</span>
            <Badge variant="outline" className="text-[10px]">
              {notificationTypeLabels[notif.type]}
            </Badge>
            {!notif.read && <span className="h-2 w-2 rounded-full bg-primary" />}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{notif.message}</p>
          {notif.fromUser && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {notif.fromUser.avatar}
              </div>
              <span className="text-xs text-muted-foreground">{notif.fromUser.name}</span>
            </div>
          )}
          <span className="mt-2 block text-xs text-muted-foreground/70">
            {formatDate(notif.createdAt)}
          </span>
        </div>
        <div className="flex shrink-0 gap-1">
          {!notif.read && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleMarkAsRead(notif.id)}
              title="Marquer comme lu"
            >
              <CheckCircle className="h-4 w-4 text-primary" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handleDelete(notif.id)}
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Centre de notifications</h2>
            <p className="text-sm text-muted-foreground">
              {loading
                ? "Chargement..."
                : unreadCount > 0
                ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
                : "Tout est à jour"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              Tout marquer lu
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleClearAll}
            >
              Tout supprimer
            </Button>
          )}
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Toutes ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4 space-y-3">
          {loading ? (
            <div className="rounded-xl border border-border bg-card py-12 text-center">
              <p className="text-sm text-muted-foreground">Chargement...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-12 text-center">
              <Bell className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-3 text-sm text-muted-foreground">Aucune notification</p>
            </div>
          ) : (
            notifications.map(renderNotification)
          )}
        </TabsContent>

        <TabsContent value="unread" className="mt-4 space-y-3">
          {unreadNotifs.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-12 text-center">
              <CheckCircle className="mx-auto h-10 w-10 text-[hsl(var(--success))]/40" />
              <p className="mt-3 text-sm text-muted-foreground">Tout est lu !</p>
            </div>
          ) : (
            unreadNotifs.map(renderNotification)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;