import { Link } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { MapPin, Clock, Users, MessageSquare, AlertTriangle, Star, Search, Wrench, ArrowRight } from "lucide-react";
import type { ServiceRequest } from "../data/mockData";
import { statusLabels, categories } from "../data/mockData"; 
import { motion } from "framer-motion";

interface RequestCardProps {
  request: ServiceRequest;
  index?: number;
}

const RequestCard = ({ request, index = 0 }: RequestCardProps) => {
  const cat = categories.find((c) => c.id === request.category);
  const isRecherche = request.type === "recherche";

  const statusVariant = {
    ouverte: "success" as const,
    en_cours: "warning" as const,
    terminée: "secondary" as const,
    annulée: "destructive" as const,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/request/${request.id}`} className="group block h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5">
          {/* Image for service type only */}
          {!isRecherche && request.image && (
            <div className="relative h-44 overflow-hidden">
              <img
                src={request.image}
                alt={request.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
              <div className="absolute top-3 left-3">
                <Badge variant="default" className="gap-1 bg-primary/90 backdrop-blur-sm text-[10px]">
                  <Wrench className="h-3 w-3" />
                  Service
                </Badge>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <Badge variant={statusVariant[request.status]}>
                  {statusLabels[request.status]}
                </Badge>
                {request.urgent && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Urgent
                  </Badge>
                )}
              </div>
              <span className="absolute bottom-3 right-3 rounded-lg bg-card/95 px-2.5 py-1 text-xs font-bold text-accent backdrop-blur-sm shadow-sm">
                {request.budget}
              </span>
            </div>
          )}

          {/* Header for recherche type (no image) */}
          {isRecherche && (
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 p-4 border-b border-border">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
                    <Search className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <Badge variant="warning" className="gap-1 text-[10px]">
                      <Search className="h-3 w-3" />
                      Recherche
                    </Badge>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant={statusVariant[request.status]} className="text-[10px]">
                        {statusLabels[request.status]}
                      </Badge>
                      {request.urgent && (
                        <Badge variant="destructive" className="gap-1 text-[10px]">
                          <AlertTriangle className="h-3 w-3" />
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <span className="shrink-0 rounded-lg bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">
                  {request.budget}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-1 flex-col p-4">
            <h3 className="mb-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {request.title}
            </h3>
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {request.description}
            </p>

            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {request.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {new Date(request.createdAt).toLocaleDateString("fr-TN")}
              </span>
              {cat && (
                <Badge variant="outline" className="text-xs font-normal">
                  {cat.label}
                </Badge>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                  {request.author.avatar}
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{request.author.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span className="text-[10px] text-muted-foreground">{request.author.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {request.volunteersCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {request.commentsCount}
                </span>
              </div>
            </div>

            <Button
              variant={isRecherche ? "outline" : "hero"}
              size="sm"
              className="mt-3 w-full gap-1.5 group-hover:gap-2.5 transition-all"
            >
              {isRecherche ? "Voir le profil recherché" : "Voir les détails"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RequestCard;
