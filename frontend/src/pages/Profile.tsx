import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Star, MapPin, Calendar, Edit, Briefcase,
  User, Lock, Bell, Shield, Save, X,
} from "lucide-react";
import RequestCard from "../components/RequestCard";
import { getRequestsByUser, getCompletedAsVolunteer, type ServiceRequest } from "../api/requests";
import { getUserReviews, type Review } from "../api/reviews";
import { getProfile, updateProfile, getUserById, changePassword, deleteAccount, type User as UserType } from "../api/auth";
import { useToast } from "../hooks/use-toast";

const Profile = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [editingProfile, setEditingProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [completedAsVolunteer, setCompletedAsVolunteer] = useState<ServiceRequest[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Delete account state
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formBio, setFormBio] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let user: UserType;
        let own = false;

        if (id) {
          // Profil public — charger par id
          user = await getUserById(id);
          // Vérifier si c'est quand même son propre profil
          try {
            const me = await getProfile();
            own = me.id === id;
          } catch {
            own = false;
          }
        } else {
          // Propre profil
          user = await getProfile();
          own = true;
        }

        setCurrentUser(user);
        setIsOwnProfile(own);

        if (own) {
          setFormName(user.name || "");
          setFormPhone(user.phone || "");
          setFormEmail(user.email || "");
          setFormCity(user.city || "");
          setFormBio(user.bio || "");
        }

        const [userRequests, userReviews, volunteeredRequests] = await Promise.all([
          getRequestsByUser(user.id),
          getUserReviews(user.id),
          getCompletedAsVolunteer(user.id),
        ]);
        setRequests(userRequests);
        setReviews(userReviews);
        setCompletedAsVolunteer(volunteeredRequests);
      } catch (error) {
        console.error("Erreur :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updated = await updateProfile({
        name: formName,
        phone: formPhone,
        city: formCity,
        bio: formBio,
      });
      setCurrentUser(updated);
      setEditingProfile(false);
      toast({ title: "Profil mis à jour", description: "Vos informations ont été sauvegardées." });
    } catch (error) {
      console.error("Erreur mise à jour profil :", error);
      toast({ title: "Erreur", description: "Impossible de mettre à jour le profil", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "Erreur", description: "Les nouveaux mots de passe ne correspondent pas", variant: "destructive" });
      return;
    }

    if (newPassword.length < 6) {
      toast({ title: "Erreur", description: "Le mot de passe doit contenir au moins 6 caractères", variant: "destructive" });
      return;
    }

    try {
      setChangingPassword(true);
      await changePassword(oldPassword, newPassword);
      toast({ title: "Succès", description: "Votre mot de passe a été changé avec succès" });
      setShowChangePassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error("Erreur changement mot de passe :", error);
      const message = error.response?.data?.message || "Impossible de changer le mot de passe";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "SUPPRIMER") {
      toast({ title: "Erreur", description: "Vous devez écrire 'SUPPRIMER' pour confirmer", variant: "destructive" });
      return;
    }

    try {
      setDeletingAccount(true);
      await deleteAccount();
      toast({ title: "Compte supprimé", description: "Votre compte a été supprimé avec succès" });
      // Clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setTimeout(() => navigate('/'), 1500);
    } catch (error: any) {
      console.error("Erreur suppression compte :", error);
      const message = error.response?.data?.message || "Impossible de supprimer le compte";
      toast({ title: "Erreur", description: message, variant: "destructive" });
    } finally {
      setDeletingAccount(false);
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-24">
          <p className="text-muted-foreground">Utilisateur introuvable.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">

        {/* Profile header */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-card lg:p-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
              {currentUser.avatar}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
                {currentUser.role === "admin" && (
                  <Badge variant="destructive">Admin</Badge>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                {currentUser.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {currentUser.city}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Membre depuis{" "}
                  {new Date(currentUser.memberSince).toLocaleDateString("fr-TN", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                {currentUser.rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    {currentUser.rating} ({currentUser.reviewCount} avis)
                  </span>
                )}
              </div>
              {currentUser.skills && currentUser.skills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentUser.skills.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Demandes publiées", value: requests.length },
            { label: "Missions réalisées", value: currentUser.completedHelps },
            { label: "Avis reçus", value: reviews.length },
            { label: "Score réputation", value: currentUser.reputationScore },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-4 shadow-card text-center"
            >
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">
              {isOwnProfile ? "Mes demandes" : "Demandes"}
            </TabsTrigger>
            <TabsTrigger value="history">Accomplissements</TabsTrigger>
            <TabsTrigger value="reviews" className="gap-1.5">
              <Star className="h-4 w-4" />
              Avis
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            )}
          </TabsList>

          {/* Demandes */}
          <TabsContent value="requests">
            {requests.length === 0 ? (
              <div className="rounded-xl border border-border bg-card py-12 text-center">
                <Briefcase className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">Aucune demande publiée.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {requests.map((req, i) => (
                  <RequestCard key={req.id} request={req} index={i} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Accomplissements */}
          <TabsContent value="history">
            {completedAsVolunteer.length === 0 ? (
              <div className="rounded-xl border border-border bg-card py-12 text-center">
                <Star className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Aucune mission réalisée pour l'instant.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {completedAsVolunteer.map((req, i) => (
                  <RequestCard key={req.id} request={req} index={i} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Avis */}
          <TabsContent value="reviews" className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                <Star className="h-5 w-5 text-accent" />
                Avis reçus ({reviews.length})
              </h3>
              {reviews.length === 0 ? (
                <div className="py-8 text-center">
                  <Star className="mx-auto h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Aucun avis reçu pour l'instant.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-xl border border-border p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {review.fromUser.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {review.fromUser.name}
                          </p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${
                                  i < review.rating
                                    ? "fill-accent text-accent"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString("fr-TN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      {review.requestTitle && (
                        <p className="mt-2 text-xs text-muted-foreground/70">
                          Pour : {review.requestTitle}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Paramètres — uniquement propre profil */}
          {isOwnProfile && (
            <TabsContent value="settings">
              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">
                        Informations personnelles
                      </h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingProfile(!editingProfile)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {editingProfile ? "Annuler" : "Modifier"}
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                        Nom complet
                      </label>
                      <Input value={formName} onChange={(e) => setFormName(e.target.value)} disabled={!editingProfile} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                        Téléphone
                      </label>
                      <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} disabled={!editingProfile} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                        Email
                      </label>
                      <Input value={formEmail} disabled className="opacity-60" />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                        Ville
                      </label>
                      <Input value={formCity} onChange={(e) => setFormCity(e.target.value)} disabled={!editingProfile} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                        Bio
                      </label>
                      <Input
                        value={formBio}
                        onChange={(e) => setFormBio(e.target.value)}
                        disabled={!editingProfile}
                        placeholder="Parlez de vous..."
                      />
                    </div>
                  </div>
                  {editingProfile && (
                    <Button variant="hero" className="mt-4 gap-1.5" onClick={handleSaveProfile} disabled={saving}>
                      <Save className="h-4 w-4" />
                      {saving ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  )}
                </div>

                {/* Sécurité */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="mb-6 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">Sécurité</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Mot de passe</p>
                        <p className="text-sm text-muted-foreground">
                          Modifiez votre mot de passe régulièrement
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setShowChangePassword(true)}>Changer</Button>
                    </div>
                  </div>
                </div>

                {/* Notifications */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                  <div className="mb-6 flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">Notifications</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Offres reçues", desc: "Recevoir une alerte quand quelqu'un répond à votre demande", enabled: true },
                      { label: "Réponses aux candidatures", desc: "Recevoir une alerte quand le demandeur accepte ou refuse votre candidature", enabled: true },
                    ].map((notif) => (
                      <div key={notif.label} className="flex items-center justify-between rounded-xl border border-border p-4">
                        <div>
                          <p className="font-medium text-foreground">{notif.label}</p>
                          <p className="text-sm text-muted-foreground">{notif.desc}</p>
                        </div>
                        <Badge variant={notif.enabled ? "success" : "secondary"}>
                          {notif.enabled ? "Activé" : "Désactivé"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Zone dangereuse */}
                <div className="rounded-2xl border border-destructive/30 bg-card p-6 shadow-card">
                  <div className="mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-destructive" />
                    <h3 className="text-lg font-bold text-destructive">Zone dangereuse</h3>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
                  </p>
                  <Button variant="destructive" size="sm" onClick={() => setShowDeleteAccount(true)}>
                    Supprimer mon compte
                  </Button>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {/* Modal: Change Password */}
        {showChangePassword && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Changer le mot de passe</h3>
                <button
                  onClick={() => setShowChangePassword(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                    Ancien mot de passe
                  </label>
                  <Input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Entrez votre ancien mot de passe"
                    disabled={changingPassword}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                    Nouveau mot de passe
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Entrez votre nouveau mot de passe"
                    disabled={changingPassword}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                    Confirmer le mot de passe
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmez votre nouveau mot de passe"
                    disabled={changingPassword}
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowChangePassword(false)}
                  disabled={changingPassword}
                >
                  Annuler
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                >
                  {changingPassword ? "Changement..." : "Changer"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Delete Account */}
        {showDeleteAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-destructive">Supprimer le compte</h3>
                <button
                  onClick={() => setShowDeleteAccount(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Cette action est irréversible. Tous vos données, demandes, et avis seront supprimés définitivement.
                </p>
                <p className="text-sm font-semibold text-foreground">
                  Tapez <span className="font-mono">SUPPRIMER</span> pour confirmer:
                </p>
                <Input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                  placeholder="SUPPRIMER"
                  disabled={deletingAccount}
                />
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowDeleteAccount(false);
                    setDeleteConfirmText("");
                  }}
                  disabled={deletingAccount}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDeleteAccount}
                  disabled={deletingAccount || deleteConfirmText !== "SUPPRIMER"}
                >
                  {deletingAccount ? "Suppression..." : "Supprimer"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;