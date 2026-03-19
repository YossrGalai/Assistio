import { useState } from "react";
import { Search, MapPin, Tag, ChevronDown, X, SlidersHorizontal } from "lucide-react";

// --- Données Tunisie ---
const GOUVERNORATS_VILLES: Record<string, string[]> = {
  Tunis: ["Tunis", "La Marsa", "Le Bardo", "Carthage", "El Menzah", "Ariana", "La Goulette", "Sidi Hassine"],
  Ariana: ["Ariana", "Raoued", "Kalâat el-Andalous", "Sidi Thabet", "Ettadhamen", "Mnihla"],
  Ben_Arous: ["Ben Arous", "Radès", "Mégrine", "Mohamedia", "Fouchana", "Hammam Lif", "Bou Mhel el-Bassatine"],
  Manouba: ["Manouba", "Den Den", "Oued Ellil", "Tebourba", "Djedeida", "El Battan"],
  Nabeul: ["Nabeul", "Hammamet", "Kelibia", "Grombalia", "Soliman", "Menzel Bouzelfa", "Korba"],
  Zaghouan: ["Zaghouan", "Zriba", "El Fahs", "Nadhour", "Bir Mcherga"],
  Bizerte: ["Bizerte", "Menzel Bourguiba", "Mateur", "Sejnane", "Ras Jebel", "El Alia", "Utique"],
  Béja: ["Béja", "Medjez el-Bab", "Testour", "Nefza", "Amdoun", "Goubellat"],
  Jendouba: ["Jendouba", "Tabarka", "Ain Draham", "Ghardimaou", "Bou Salem", "Fernana"],
  Kef: ["Le Kef", "Dahmani", "Tajerouine", "Sakiet Sidi Youssef", "Kalâat Khasbah"],
  Siliana: ["Siliana", "Makthar", "Rohia", "Gaâfour", "El Aroussa"],
  Sousse: ["Sousse", "Hammam Sousse", "Msaken", "Kalâa Kebira", "Akouda", "Enfidha", "Kondar"],
  Monastir: ["Monastir", "Skanes", "Ksar Hellal", "Moknine", "Jemmal", "Bembla", "Téboulba"],
  Mahdia: ["Mahdia", "Ksour Essef", "El Jem", "Chebba", "Melloulèche", "Sidi Alouane"],
  Sfax: ["Sfax", "Sakiet Ezzit", "Sakiet Eddaier", "El Ain", "Thyna", "Jebeniana", "Kerkennah"],
  Kairouan: ["Kairouan", "Sbikha", "El Alaa", "Haffouz", "Chebika", "Nasrallah"],
  Kasserine: ["Kasserine", "Sbeitla", "Thala", "Haïdra", "Foussana", "Feriana"],
  Sidi_Bouzid: ["Sidi Bouzid", "Jelma", "Cebbala", "Bir El Hafey", "Regueb", "Meknassy"],
  Gabès: ["Gabès", "Ghannouch", "El Hamma", "Matmata", "Mareth", "Metouia"],
  Médenine: ["Médenine", "Zarzis", "Ben Gardane", "Houmt Souk", "Midoun", "Ajim"],
  Tataouine: ["Tataouine", "Ghomrassen", "Remada", "Bir Lahmar", "Beni Barka"],
  Gafsa: ["Gafsa", "El Ksar", "Redeyef", "Moulares", "Metlaoui", "Om El Araies"],
  Tozeur: ["Tozeur", "Degache", "Nefta", "Tamerza", "Hazoua"],
  Kébili: ["Kébili", "Douz", "Souk Lahad", "El Faouar", "Jemna"],
};

const CATEGORIES = [
  { value: "Plomberie", icon: "🔧" },
  { value: "Électricité", icon: "⚡" },
  { value: "Maçonnerie", icon: "🧱" },
  { value: "Peinture", icon: "🎨" },
  { value: "Menuiserie", icon: "🪵" },
  { value: "Climatisation", icon: "❄️" },
  { value: "Jardinage", icon: "🌿" },
  { value: "Déménagement", icon: "📦" },
  { value: "Nettoyage", icon: "🧹" },
  { value: "Informatique", icon: "💻" },
  { value: "Sécurité", icon: "🔒" },
  { value: "Carrelage", icon: "🏠" },
  { value: "Toiture", icon: "🏗️" },
  { value: "Serrurerie", icon: "🗝️" },
  { value: "Vitrage", icon: "🪟" },
];

const STATUTS = [
  { value: "ouverte", label: "Ouverte", color: "#22c55e" },
  { value: "en_cours", label: "En cours", color: "#f59e0b" },
  { value: "terminée", label: "Terminée", color: "#6366f1" },
  { value: "annulée", label: "Annulée", color: "#ef4444" },
];

interface RequestFiltersProps {
  onFilter?: (filters: {
    search: string;
    gouvernorat: string;
    ville: string;
    categorie: string;
    statut: string;
  }) => void;
}

export default function RequestFilters({ onFilter }: RequestFiltersProps) {
  const [search, setSearch] = useState("");
  const [gouvernorat, setGouvernorat] = useState("");
  const [ville, setVille] = useState("");
  const [categorie, setCategorie] = useState("");
  const [statut, setStatut] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const gouvernoratList = Object.keys(GOUVERNORATS_VILLES);
  const villeList = gouvernorat ? GOUVERNORATS_VILLES[gouvernorat] ?? [] : [];

  const activeFiltersCount = [gouvernorat, ville, categorie, statut].filter(Boolean).length;

  const handleGouvernoratChange = (val: string) => {
    setGouvernorat(val);
    setVille("");
  };

  const handleReset = () => {
    setSearch("");
    setGouvernorat("");
    setVille("");
    setCategorie("");
    setStatut("");
  };

  const handleApply = () => {
    onFilter?.({ search, gouvernorat, ville, categorie, statut });
  };

  return (
    <div
      style={{
        fontFamily: "'Outfit', 'Nunito', sans-serif",
        background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div style={{
        position: "absolute", top: "-60px", right: "-60px",
        width: "200px", height: "200px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-40px", left: "-40px",
        width: "150px", height: "150px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            background: "linear-gradient(135deg, #f59e0b, #ef4444)",
            borderRadius: "10px", padding: "8px", display: "flex",
          }}>
            <SlidersHorizontal size={18} color="#fff" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 700, letterSpacing: "-0.3px" }}>
              Filtres de recherche
            </h2>
            {activeFiltersCount > 0 && (
              <span style={{
                fontSize: "11px", color: "#f59e0b", fontWeight: 600,
              }}>
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? "s" : ""} actif{activeFiltersCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {activeFiltersCount > 0 && (
            <button
              onClick={handleReset}
              style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px", padding: "6px 12px", color: "#ccc",
                fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
              }}
            >
              <X size={12} /> Réinitialiser
            </button>
          )}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "8px", padding: "6px 10px", color: "#aaa", cursor: "pointer",
              transition: "transform 0.3s",
              transform: filtersOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div style={{ position: "relative", marginBottom: filtersOpen ? "16px" : "0" }}>
        <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#f59e0b" }} />
        <input
          type="text"
          placeholder="Rechercher une demande..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "12px 14px 12px 42px",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "12px", color: "#fff", fontSize: "14px",
            outline: "none", transition: "border-color 0.2s, background 0.2s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#f59e0b";
            e.target.style.background = "rgba(255,255,255,0.11)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.12)";
            e.target.style.background = "rgba(255,255,255,0.07)";
          }}
        />
      </div>

      {/* Collapsible filters */}
      {filtersOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* Gouvernorat + Ville */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FilterSelect
              icon={<MapPin size={14} color="#f59e0b" />}
              label="Gouvernorat"
              value={gouvernorat}
              onChange={handleGouvernoratChange}
              options={gouvernoratList.map((g) => ({ value: g, label: g.replace("_", " ") }))}
              placeholder="Tous les gouvernorats"
            />
            <FilterSelect
              icon={<MapPin size={14} color="#a78bfa" />}
              label="Ville"
              value={ville}
              onChange={setVille}
              options={villeList.map((v) => ({ value: v, label: v }))}
              placeholder={gouvernorat ? "Toutes les villes" : "Choisir gouvernorat d'abord"}
              disabled={!gouvernorat}
            />
          </div>

          {/* Catégorie */}
          <div>
            <label style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <Tag size={12} color="#34d399" /> Catégorie
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              <button
                onClick={() => setCategorie("")}
                style={chipStyle(categorie === "")}
              >
                Toutes
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategorie(cat.value === categorie ? "" : cat.value)}
                  style={chipStyle(categorie === cat.value)}
                >
                  {cat.icon} {cat.value}
                </button>
              ))}
            </div>
          </div>

          {/* Statut */}
          <div>
            <label style={{ fontSize: "11px", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px", display: "block" }}>
              Statut
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                onClick={() => setStatut("")}
                style={statutChipStyle(statut === "", "#6366f1")}
              >
                Tous
              </button>
              {STATUTS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatut(s.value === statut ? "" : s.value)}
                  style={statutChipStyle(statut === s.value, s.color)}
                >
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: s.color, display: "inline-block" }} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            style={{
              marginTop: "4px",
              width: "100%",
              padding: "13px",
              background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
              border: "none", borderRadius: "12px",
              color: "#fff", fontWeight: 700, fontSize: "15px",
              cursor: "pointer", letterSpacing: "0.2px",
              boxShadow: "0 8px 24px rgba(245,158,11,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "opacity 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            <Search size={16} />
            Appliquer les filtres
          </button>
        </div>
      )}
    </div>
  );
}

// --- Sub-components ---

function FilterSelect({
  icon, label, value, onChange, options, placeholder, disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label style={{
        fontSize: "11px", color: "#9ca3af", textTransform: "uppercase",
        letterSpacing: "0.8px", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px",
      }}>
        {icon} {label}
      </label>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{
            width: "100%", appearance: "none",
            padding: "10px 36px 10px 12px",
            background: disabled ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "10px", color: disabled ? "#555" : "#fff",
            fontSize: "13px", cursor: disabled ? "not-allowed" : "pointer",
            outline: "none",
          }}
        >
          <option value="" style={{ background: "#302b63" }}>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "#302b63" }}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", color: "#6b7280", pointerEvents: "none" }} />
      </div>
    </div>
  );
}

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: "5px 11px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: active ? 700 : 400,
    cursor: "pointer",
    border: active ? "1px solid #f59e0b" : "1px solid rgba(255,255,255,0.12)",
    background: active ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.05)",
    color: active ? "#f59e0b" : "#ccc",
    transition: "all 0.15s",
  };
}

function statutChipStyle(active: boolean, color: string): React.CSSProperties {
  return {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: active ? 700 : 400,
    cursor: "pointer",
    border: active ? `1px solid ${color}` : "1px solid rgba(255,255,255,0.1)",
    background: active ? `${color}28` : "rgba(255,255,255,0.05)",
    color: active ? color : "#ccc",
    display: "flex", alignItems: "center", gap: "6px",
    transition: "all 0.15s",
  };
}