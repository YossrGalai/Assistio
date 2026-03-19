import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Star, MapPin, Calendar, Edit, Briefcase,
  User, Lock, Bell, Shield, Save,
} from "lucide-react";
import RequestCard from "../components/RequestCard";
import {  type ServiceRequest } from "../api/requests";
import {  type Review } from "../api/reviews";
import {  type User as UserType } from "../api/auth";



const Profile = () => {
  const [editingProfile, setEditingProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [requests] = useState<ServiceRequest[]>([]);
  const [reviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formCity, setFormCity] = useState("");
  const [formBio, setFormBio] = useState("");
useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token"); 
      if (!token) return;
      const res = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: "Bearer " + token, 
        }, });
      const user = await res.json();
       console.log("Utilisateur :", user);
      setCurrentUser(user); // set logged user

      // fill the form
      setFormName(user.name || "");
      setFormPhone(user.phone || "");
      setFormEmail(user.email || "");
      setFormCity(user.city || "");
      setFormBio(user.bio || "");

      // Optional: later, you can fetch requests/reviews using user._id
    } catch (error) {
      console.error("Erreur :", error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      console.log("Sauvegarde :", { formName, formPhone, formCity, formBio });
      setCurrentUser((prev) =>
        prev ? { ...prev, name: formName, phone: formPhone, city: formCity, bio: formBio } : prev
      );
      setEditingProfile(false);
    } finally {
      setSaving(false);
    }
  };

  // Accepter les deux formats de statut (DB anglais + frontend français)
  const completedRequests = requests.filter(
    (r) => r.status === "terminée" || (r.status as string) === "done"
  );

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
            <TabsTrigger value="requests">Mes demandes</TabsTrigger>
            <TabsTrigger value="history">Accomplissements</TabsTrigger>
            <TabsTrigger value="reviews" className="gap-1.5">
              <Star className="h-4 w-4" />
              Avis
            </TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Mes demandes */}
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
            {completedRequests.length === 0 ? (
              <div className="rounded-xl border border-border bg-card py-12 text-center">
                <Star className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Aucune mission terminée pour l'instant.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {completedRequests.map((req, i) => (
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

          {/* Paramètres */}
          <TabsContent value="settings">
            <div className="space-y-6">

              {/* Informations personnelles */}
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
                    <Input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      disabled={!editingProfile}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                      Téléphone
                    </label>
                    <Input
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      disabled={!editingProfile}
                    />
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
                    <Input
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      disabled={!editingProfile}
                    />
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
                  <Button
                    variant="hero"
                    className="mt-4 gap-1.5"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
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
                    <Button variant="outline" size="sm">Changer</Button>
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
                    { label: "Nouvelles demandes", desc: "Recevoir une notification pour les nouvelles demandes dans vos catégories", enabled: true },
                    { label: "Messages", desc: "Notifications pour les nouveaux messages", enabled: true },
                    { label: "Offres reçues", desc: "Recevoir une alerte quand quelqu'un répond à votre demande", enabled: false },
                    
                  ].map((notif) => (
                    <div
                      key={notif.label}
                      className="flex items-center justify-between rounded-xl border border-border p-4"
                    >
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
                <Button variant="destructive" size="sm">
                  Supprimer mon compte
                </Button>
              </div>

            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;