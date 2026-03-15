import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Star, MapPin, Calendar, Settings, Edit, Briefcase, User, Mail, Phone, Lock, Bell, Shield, Save } from "lucide-react";
import RequestCard from "../components/RequestCard";
import { mockRequests } from "../data/mockData";
import { mockReviews } from "../data/notificationData";

const Profile = () => {
  const [editingProfile, setEditingProfile] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Profile header */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-card lg:p-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
              AB
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">Ahmed Ben Ali</h1>
                <Badge variant="info">Professionnel</Badge>
              </div>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Tunis</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Membre depuis Jan 2025</span>
                <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-accent text-accent" /> 4.8 (32 avis)</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline">Plomberie</Badge>
                <Badge variant="outline">Électricité</Badge>
              </div>
            </div>
            <Button variant="outline" className="gap-1.5">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Demandes publiées", value: "12", icon: Briefcase },
            { label: "Missions réalisées", value: "28", icon: Star },
            { label: "Avis positifs", value: "32", icon: Star },
            { label: "Note moyenne", value: "4.8", icon: Star },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-4 shadow-card text-center">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">Mes demandes</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
            <TabsTrigger value="reviews" className="gap-1.5">
              <Star className="h-4 w-4" />
              Avis
            </TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockRequests.slice(0, 3).map((req, i) => (
                <RequestCard key={req.id} request={req} index={i} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockRequests.filter((r) => r.status === "terminée").map((req, i) => (
                <RequestCard key={req.id} request={req} index={i} />
              ))}
            </div>
          </TabsContent>
          {/* Reviews */}
                    <TabsContent value="reviews" className="space-y-4">
                      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                        <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                          <Star className="h-5 w-5 text-accent" />
                          Avis reçus ({mockReviews.length})
                        </h3>
                        <div className="space-y-4">
                          {mockReviews.map((review) => (
                            <div key={review.id} className="rounded-xl border border-border p-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                  {review.fromUser.avatar}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-foreground">{review.fromUser.name}</p>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3.5 w-3.5 ${i < review.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <span className="ml-auto text-xs text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString("fr-TN", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                              </div>
                              <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Personal Info */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">Informations personnelles</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setEditingProfile(!editingProfile)}>
                    <Edit className="h-4 w-4 mr-1" />
                    {editingProfile ? "Annuler" : "Modifier"}
                  </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Nom complet</label>
                    <Input defaultValue="Ahmed Ben Ali" disabled={!editingProfile} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Téléphone</label>
                    <Input defaultValue="+216 55 123 456" disabled={!editingProfile} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Email</label>
                    <Input defaultValue="ahmed@example.com" disabled={!editingProfile} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Gouvernorat</label>
                    <Input defaultValue="Tunis" disabled={!editingProfile} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-muted-foreground">Adresse</label>
                    <Input defaultValue="23 Rue de la Liberté, Tunis 1000" disabled={!editingProfile} />
                  </div>
                </div>
                {editingProfile && (
                  <Button variant="hero" className="mt-4 gap-1.5">
                    <Save className="h-4 w-4" />
                    Enregistrer
                  </Button>
                )}
              </div>

              {/* Security */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="mb-6 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Sécurité</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">Mot de passe</p>
                      <p className="text-sm text-muted-foreground">Dernière modification il y a 3 mois</p>
                    </div>
                    <Button variant="outline" size="sm">Changer</Button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div>
                      <p className="font-medium text-foreground">Authentification à deux facteurs</p>
                      <p className="text-sm text-muted-foreground">Sécurisez votre compte avec la 2FA</p>
                    </div>
                    <Badge variant="destructive">Désactivé</Badge>
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
                    { label: "Newsletter", desc: "Actualités et promotions d'Assistio", enabled: false },
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

              {/* Danger Zone */}
              <div className="rounded-2xl border border-destructive/30 bg-card p-6 shadow-card">
                <div className="mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-destructive" />
                  <h3 className="text-lg font-bold text-destructive">Zone dangereuse</h3>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
                </p>
                <Button variant="destructive" size="sm">Supprimer mon compte</Button>
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
