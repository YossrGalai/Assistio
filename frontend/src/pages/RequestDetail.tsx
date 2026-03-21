import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import ReviewForm from "../components/ReviewForm";
import {
  MapPin, Clock, Users, Star, MessageSquare,
  ArrowLeft, Send, User, CheckCircle, CircleCheck,
  AlertCircle, XCircle, UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  getRequestDetail, addComment, acceptVolunteer,
  rejectVolunteer, finishRequest, cancelRequest,
  type RequestDetail as RequestDetailType,
  type Volunteer,applyToRequest
} from "../api/requestDetail";
import { getProfile, type User as UserType } from "../api/auth";

const statusLabels: Record<string, string> = {
  ouverte: "Ouverte",
  en_cours: "En cours",
  terminée: "Terminée",
  annulée: "Annulée",
};

const statusVariant: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
  ouverte: "success",
  en_cours: "warning",
  terminée: "secondary",
  annulée: "destructive",
};

const RequestDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [request, setRequest] = useState<RequestDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [acceptedVolunteer, setAcceptedVolunteer] = useState<Volunteer | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  // Charger l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getProfile();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      }
    };
    fetchUser();
  }, []);

  // Charger le détail de la demande
  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        const data = await getRequestDetail(id);
        setRequest(data);
        const accepted = data.volunteers.find(v => v.status === 'accepted');
        if (accepted) setAcceptedVolunteer(accepted);
      } catch (error) {
        console.error("Erreur chargement détail :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // Vérifier si l'utilisateur a déjà postulé
  useEffect(() => {
    if (!currentUser || !request) return;
    const alreadyApplied = request.volunteers.some(v => v.userId === currentUser.id);
    setHasApplied(alreadyApplied);
  }, [currentUser, request]);

  const isAuthor = currentUser && request && request.author.id === currentUser.id;

  const handleAcceptCandidate = async (volunteer: Volunteer) => {
    if (!id) return;
    try {
      await acceptVolunteer(id, volunteer.id);
      setRequest(prev => prev ? {
        ...prev,
        status: 'en_cours',
        volunteers: prev.volunteers.map(v => ({
          ...v,
          status: v.id === volunteer.id ? 'accepted' : 'rejected'
        }))
      } : prev);
      setAcceptedVolunteer(volunteer);
      toast.success(`${volunteer.name} a été accepté(e) ! La demande est maintenant en cours.`);
    } catch {
      toast.error("Erreur lors de l'acceptation");
    }
  };

  const handleRejectCandidate = async (volunteer: Volunteer) => {
    if (!id) return;
    try {
      await rejectVolunteer(id, volunteer.id);
      setRequest(prev => prev ? {
        ...prev,
        volunteers: prev.volunteers.map(v =>
          v.id === volunteer.id ? { ...v, status: 'rejected' } : v
        )
      } : prev);
      toast(`Candidature de ${volunteer.name} refusée.`, { icon: <XCircle className="h-4 w-4" /> });
    } catch {
      toast.error("Erreur lors du refus");
    }
  };

  const handleFinish = async () => {
    if (!id) return;
    try {
      await finishRequest(id);
      setRequest(prev => prev ? { ...prev, status: 'terminée' } : prev);
      setShowReview(true);
      toast.success("Demande marquée comme terminée !");
    } catch {
      toast.error("Erreur");
    }
  };

  const handleCancel = async () => {
    if (!id) return;
    try {
      await cancelRequest(id);
      setRequest(prev => prev ? { ...prev, status: 'annulée' } : prev);
      toast("Demande annulée.", { icon: <AlertCircle className="h-4 w-4" /> });
    } catch {
      toast.error("Erreur");
    }
  };

  const handleApply = async () => {
  if (!currentUser || !request || !id) return;
  try {
    const newVolunteer = await applyToRequest(id);
    setHasApplied(true);
    setRequest(prev => prev ? {
      ...prev,
      volunteers: [...prev.volunteers, newVolunteer],
      volunteersCount: prev.volunteersCount + 1,
    } : prev);
    toast.success("Votre candidature a été envoyée !");
  } catch {
    toast.error("Erreur lors de la candidature");
  }
};

  const handleSendComment = async () => {
    if (!id || !commentText.trim() || !currentUser) return;
    try {
      setSendingComment(true);
      const newComment = await addComment(id, {
        text: commentText.trim(),
        userId: currentUser.id,
        userName: currentUser.name,
      });
      setRequest(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newComment],
        commentsCount: prev.commentsCount + 1,
      } : prev);
      setCommentText("");
      toast.success("Commentaire ajouté !");
    } catch {
      toast.error("Erreur lors de l'envoi");
    } finally {
      setSendingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-24">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground">Demande introuvable</h1>
          <Link to="/requests">
            <Button variant="outline" className="mt-4">Retour aux demandes</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const pendingVolunteers = request.volunteers.filter(v => v.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link to="/requests" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Retour aux demandes
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">

            {/* Infos principales */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant={statusVariant[request.status] ?? "secondary"}>
                  {statusLabels[request.status] ?? request.status}
                </Badge>
                {request.urgent && <Badge variant="destructive">Urgent</Badge>}
                {request.category && (
                  <Badge variant="outline">{request.category}</Badge>
                )}
              </div>
              <h1 className="mb-3 text-2xl font-bold text-foreground lg:text-3xl">
                {request.title}
              </h1>
              <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {request.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {request.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(request.createdAt).toLocaleDateString("fr-TN", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </span>
                {request.budget && (
                  <span className="font-bold text-accent">{request.budget}</span>
                )}
              </div>
              <p className="text-foreground leading-relaxed">{request.description}</p>

              {/* Bouton postuler — visible uniquement si pas l'auteur */}
              {!isAuthor && request.status === "ouverte" && !hasApplied && (
                <Button variant="hero" className="mt-6 gap-2" onClick={handleApply}>
                  <UserCheck className="h-4 w-4" />
                  Postuler comme candidat
                </Button>
              )}
              {!isAuthor && request.status === "ouverte" && hasApplied && (
                <p className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                  <CheckCircle className="h-4 w-4" />
                  Vous avez postulé à cette demande
                </p>
              )}

              {/* Barre de statut — visible uniquement pour l'auteur */}
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
                {isAuthor && request.status === "ouverte" && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    En attente — choisissez un candidat dans la liste à droite
                  </p>
                )}
                {isAuthor && request.status === "en_cours" && acceptedVolunteer && (
                  <>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <UserCheck className="h-4 w-4 text-primary" />
                      Candidat choisi : <strong>{acceptedVolunteer.name}</strong>
                    </div>
                    <div className="flex gap-2 ml-auto">
                      <Button variant="hero" onClick={handleFinish} className="gap-1.5">
                        <CircleCheck className="h-4 w-4" />
                        Marquer comme terminée
                      </Button>
                      <Button variant="destructive" size="sm" onClick={handleCancel} className="gap-1.5">
                        <AlertCircle className="h-4 w-4" />
                        Annuler
                      </Button>
                    </div>
                  </>
                )}
                {request.status === "terminée" && (
                  <p className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--success))]">
                    <CircleCheck className="h-4 w-4" />
                    Demande terminée
                    {acceptedVolunteer && (
                      <> — service assuré par <strong className="ml-1">{acceptedVolunteer.name}</strong></>
                    )}
                  </p>
                )}
                {request.status === "annulée" && (
                  <p className="flex items-center gap-2 text-sm font-medium text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    Cette demande a été annulée
                  </p>
                )}
              </div>
            </div>

            {/* Formulaire d'évaluation */}
            {showReview && acceptedVolunteer && currentUser && (
              <ReviewForm
                requestId={request.id}
                requestTitle={request.title}
                targetUserId={acceptedVolunteer.userId}
                targetUserName={acceptedVolunteer.name}
                fromUserId={currentUser.id}
                onSubmit={() => setShowReview(false)}
              />
            )}

            {/* Commentaires */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                <MessageSquare className="h-5 w-5" />
                Commentaires ({request.commentsCount})
              </h2>
              <div className="space-y-4">
                {request.comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Aucun commentaire pour l'instant.
                  </p>
                ) : (
                  request.comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg bg-muted p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {comment.avatar}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">
                            {comment.userName}
                          </span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString("fr-TN", {
                              day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                            })}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-foreground">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Zone commentaire — uniquement si connecté */}
              {currentUser ? (
                <div className="mt-4 flex gap-2">
                  <Textarea
                    placeholder="Écrire un commentaire..."
                    rows={2}
                    className="flex-1"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button
                    variant="default"
                    size="icon"
                    className="mt-auto"
                    onClick={handleSendComment}
                    disabled={sendingComment || !commentText.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Connectez-vous pour commenter
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Auteur */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Publié par
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {request.author.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{request.author.name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm text-muted-foreground">
                      {request.author.rating > 0 ? request.author.rating : "—"}
                    </span>
                  </div>
                </div>
              </div>
              <Link to={`/profile/${request.author.id}`} className="mt-4 block">
  <Button variant="outline" className="w-full gap-1.5">
    <User className="h-4 w-4" />
    Voir le profil
  </Button>
</Link>
            </div>

            {/* Candidats — uniquement visible pour l'auteur */}
            {isAuthor && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  <Users className="h-4 w-4" />
                  Candidats ({request.volunteersCount})
                </h3>

                {request.status === "ouverte" && (
                  <div className="space-y-3">
                    {pendingVolunteers.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        Aucun candidat pour l'instant.
                      </p>
                    ) : (
                      pendingVolunteers.map((v) => (
                        <div key={v.id} className="rounded-lg border border-border p-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                              {v.avatar}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{v.name}</p>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-accent text-accent" />
                                <span className="text-xs text-muted-foreground">
                                  {v.rating > 0 ? v.rating : "—"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 flex gap-2">
                            <Button
                              size="sm"
                              className="flex-1 gap-1"
                              onClick={() => handleAcceptCandidate(v)}
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                              Accepter
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 gap-1"
                              onClick={() => handleRejectCandidate(v)}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Refuser
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {request.status === "en_cours" && acceptedVolunteer && (
                  <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {acceptedVolunteer.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{acceptedVolunteer.name}</p>
                        <p className="text-xs text-primary font-medium">En cours de service</p>
                      </div>
                      <UserCheck className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                )}

                {request.status === "terminée" && acceptedVolunteer && (
                  <div className="rounded-lg border border-border bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[hsl(var(--success))]/10 text-xs font-bold text-[hsl(var(--success))]">
                        {acceptedVolunteer.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{acceptedVolunteer.name}</p>
                        <p className="text-xs text-[hsl(var(--success))] font-medium">Service terminé ✓</p>
                      </div>
                    </div>
                  </div>
                )}

                {request.status === "annulée" && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Demande annulée
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RequestDetail;