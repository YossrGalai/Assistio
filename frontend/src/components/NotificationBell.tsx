import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, UserPlus, CheckCircle, CheckCheck, MessageSquare, Star, Info } from "lucide-react";
import { Button } from "../components/ui/button";
//import { Badge } from "../components/ui/badge";
import { mockNotifications, type NotificationType } from "../data/notificationData";
import { motion, AnimatePresence } from "framer-motion";

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

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const timeAgo = (dateStr: string) => {
    // eslint-disable-next-line react-hooks/purity
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Il y a ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-elevated sm:w-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-bold text-foreground">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-xs font-medium text-primary hover:underline">
                    Tout marquer lu
                  </button>
                )}
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <span className="text-xs font-medium text-muted-foreground hover:text-foreground">Voir tout</span>
                </Link>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Aucune notification
                </div>
              ) : (
                notifications.slice(0, 5).map((notif) => {
                  const Icon = iconMap[notif.type];
                  return (
                    <button
                      key={notif.id}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 ${
                        !notif.read ? "bg-primary/5" : ""
                      }`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted ${iconColorMap[notif.type]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{notif.title}</span>
                          {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{notif.message}</p>
                        <span className="mt-1 block text-[11px] text-muted-foreground/70">{timeAgo(notif.createdAt)}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {notifications.length > 5 && (
              <div className="border-t border-border px-4 py-2 text-center">
                <Link to="/dashboard" onClick={() => setOpen(false)}>
                  <span className="text-xs font-medium text-primary hover:underline">
                    Voir les {notifications.length - 5} autres
                  </span>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
