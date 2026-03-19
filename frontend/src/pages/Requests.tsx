import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RequestCard from "../components/RequestCard";
import { getRequests, type ServiceRequest } from "../api/requests";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, SlidersHorizontal, X } from "lucide-react";

const categories = [
  { id: "plomberie", label: "Plomberie" },
  { id: "électricité", label: "Électricité" },
  { id: "jardinage", label: "Jardinage" },
  { id: "peinture", label: "Peinture" },
  { id: "informatique", label: "Informatique" },
  { id: "voirie", label: "Voirie" },
  { id: "menuiserie", label: "Menuiserie" },
  { id: "maçonnerie", label: "Maçonnerie" },
  { id: "nettoyage", label: "Nettoyage" },
  { id: "déménagement", label: "Déménagement" },
];

const gouvernorats = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
  "Bizerte", "Béja", "Jendouba", "Kef", "Siliana", "Sousse",
  "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
  "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili",
];

const statusLabels: Record<string, string> = {
  ouverte: "Ouverte",
  en_cours: "En cours",
  terminée: "Terminée",
  annulée: "Annulée",
};

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

const Requests = () => {
  const [allRequests, setAllRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setError(null);
        const data = await getRequests();
        setAllRequests(data);
        console.log("✅ Demandes:", data.length);
        console.log("Catégories:", [...new Set(data.map(r => r.category))]);
        console.log("Villes:", [...new Set(data.map(r => r.city))]);
        console.log("Statuts:", [...new Set(data.map(r => r.status))]);
      } catch (err) {
        console.error("Erreur chargement demandes :", err);
        setError("Impossible de charger les demandes.");
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filtered = allRequests.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !r.title?.toLowerCase().includes(q) &&
        !r.description?.toLowerCase().includes(q)
      ) return false;
    }

    if (selectedCategory !== "all") {
      if (r.category?.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    }

    if (selectedLocation !== "all") {
      const loc = selectedLocation.toLowerCase();
      const inCity = r.city?.toLowerCase() === loc;
      const inGouv = r.gouvernorat?.toLowerCase() === loc;
      const inLocation = r.location?.toLowerCase() === loc;
      if (!inCity && !inGouv && !inLocation) return false;
    }

    if (selectedStatus !== "all") {
      if (r.status !== selectedStatus) return false;
    }

    return true;
  });

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedLocation("all");
    setSelectedStatus("all");
  };

  const hasFilters =
    search !== "" ||
    selectedCategory !== "all" ||
    selectedLocation !== "all" ||
    selectedStatus !== "all";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Toutes les demandes
          </h1>
          <p className="text-muted-foreground">
            {loading
              ? "Chargement..."
              : `${filtered.length} demande${filtered.length > 1 ? "s" : ""} trouvée${filtered.length > 1 ? "s" : ""}`
            }
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Barre de recherche */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher une demande..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres
            </Button>
            {hasFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="gap-1.5 text-destructive"
              >
                <X className="h-4 w-4" />
                Effacer
              </Button>
            )}
          </div>

          {/* Panneau filtres */}
          {showFilters && (
            <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">

              {/* Catégorie */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Gouvernorat */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Gouvernorat
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">Tous les gouvernorats</option>
                  {gouvernorats.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Statut */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Statut
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className={selectClass}
                >
                  <option value="all">Tous les statuts</option>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

            </div>
          )}
        </div>

        {/* Résultats */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-xl border border-border bg-card animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-muted-foreground">Aucune demande trouvée</p>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((req, i) => (
              <RequestCard key={req.id} request={req} index={i} />
            ))}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default Requests;