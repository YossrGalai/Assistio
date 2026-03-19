import { useState, useEffect} from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import type { CreateRequestDTO } from "../../types/request";

// ─── Données Tunisie ──────────────────────────────────────────────────────────
const GOUVERNORATS: Record<string, { coords: [number, number]; villes: string[] }> = {
  Tunis:       { coords: [36.8065, 10.1815], villes: ["Tunis", "La Marsa", "Le Bardo", "Carthage", "La Goulette", "Sidi Bou Saïd"] },
  Ariana:      { coords: [36.8625, 10.1956], villes: ["Ariana", "Raoued", "Soukra", "Mnihla", "Ettadhamen"] },
  Manouba:     { coords: [36.8100, 10.0972], villes: ["Manouba", "Den Den", "Douar Hicher", "Oued Ellil", "Tébourba"] },
  "Ben Arous": { coords: [36.7533, 10.2282], villes: ["Ben Arous", "Hammam Lif", "Ezzahra", "Radès", "Megrine", "Mohamedia"] },
  Bizerte:     { coords: [37.2744,  9.8739], villes: ["Bizerte", "Menzel Bourguiba", "Mateur", "Tinja", "Utique"] },
  Nabeul:      { coords: [36.4510, 10.7350], villes: ["Nabeul", "Hammamet", "Kelibia", "Grombalia", "Korba", "Menzel Temime"] },
  Zaghouan:    { coords: [36.4021, 10.1429], villes: ["Zaghouan", "Zriba", "El Fahs", "Nadhour"] },
  Béja:        { coords: [36.7256,  9.1817], villes: ["Béja", "Medjez el-Bab", "Nefza", "Testour", "Amdoun"] },
  Jendouba:    { coords: [36.5011,  8.7757], villes: ["Jendouba", "Tabarka", "Aïn Draham", "Ghardimaou", "Fernana"] },
  Kef:         { coords: [36.1740,  8.7046], villes: ["Kef", "Dahmani", "Sakiet Sidi Youssef", "Tajerouine"] },
  Siliana:     { coords: [36.0849,  9.3708], villes: ["Siliana", "Bou Arada", "Gaâfour", "Makthar", "Rohia"] },
  Kairouan:    { coords: [35.6712, 10.1005], villes: ["Kairouan", "Sbikha", "Haffouz", "El Alâa", "Oueslatia"] },
  Kasserine:   { coords: [35.1676,  8.8365], villes: ["Kasserine", "Sbeitla", "Thala", "Feriana", "Foussana"] },
  "Sidi Bouzid":{ coords: [35.0382,  9.4849], villes: ["Sidi Bouzid", "Regueb", "Meknassy", "Bir El Hafey", "Jilma"] },
  Sousse:      { coords: [35.8256, 10.6370], villes: ["Sousse", "Hammam Sousse", "Akouda", "Kalâa Kebira", "Msaken", "Enfidha"] },
  Monastir:    { coords: [35.7643, 10.8113], villes: ["Monastir", "Ksar Hellal", "Moknine", "Téboulba", "Bekalta"] },
  Mahdia:      { coords: [35.5047, 11.0622], villes: ["Mahdia", "Ksour Essef", "El Jem", "Chebba", "Bou Merdes"] },
  Sfax:        { coords: [34.7406, 10.7603], villes: ["Sfax", "Sakiet Ezzit", "El Ain", "Jebeniana", "Bir Ali Ben Khalifa"] },
  Gabès:       { coords: [33.8881, 10.0975], villes: ["Gabès", "El Hamma", "Matmata", "Mareth", "Ghannouch"] },
  Médenine:    { coords: [33.3549, 10.4957], villes: ["Médenine", "Ben Gardane", "Zarzis", "Houmt Souk (Djerba)", "Midoun"] },
  Tataouine:   { coords: [32.9211, 10.4508], villes: ["Tataouine", "Ghomrassen", "Remada", "Bir Lahmar"] },
  Gafsa:       { coords: [34.4250,  8.7842], villes: ["Gafsa", "Metlaoui", "Redeyef", "Moulares", "El Ksar"] },
  Tozeur:      { coords: [33.9197,  8.1335], villes: ["Tozeur", "Degache", "Nefta", "Hazoua"] },
  Kébili:      { coords: [33.7042,  8.9690], villes: ["Kébili", "Douz", "Souk Lahad", "El Faouar"] },
};

const TUNISIA_BOUNDS = L.latLngBounds(
  [30.2307, 7.5219],
  [37.5494, 11.5986]
);

// ─── Reverse geocode approximatif ────────────────────────────────────────────
function findGouvernoratByCoords(lat: number, lng: number): { gouvernorat: string; ville: string } | null {
  let best: { gouvernorat: string; dist: number } | null = null;
  for (const [name, data] of Object.entries(GOUVERNORATS)) {
    const dist = Math.hypot(lat - data.coords[0], lng - data.coords[1]);
    if (!best || dist < best.dist) best = { gouvernorat: name, dist };
  }
  if (!best) return null;
  return { gouvernorat: best.gouvernorat, ville: "" };
}

// ─── Composant qui recentre la carte ─────────────────────────────────────────
function MapFlyTo({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 12, { duration: 1 });
  }, [center, map]);
  return null;
}

// ─── Composant clic sur carte ─────────────────────────────────────────────────
function LocationMarker({
  setFormData,
  position,
  setPosition,
  setGouvernorat,
  setVille,
}: {
  setFormData: React.Dispatch<React.SetStateAction<CreateRequestDTO>>;
  position: LatLngExpression | null;
  setPosition: (p: LatLngExpression) => void;
  setGouvernorat: (g: string) => void;
  setVille: (v: string) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      // ✅ Ignore si hors Tunisie
      if (!TUNISIA_BOUNDS.contains([lat, lng])) return;
      
      setPosition([lat, lng]);
      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));

      const found = findGouvernoratByCoords(lat, lng);
      if (found) {
        setGouvernorat(found.gouvernorat);
        setVille("");
        setFormData((prev) => ({
          ...prev,
          gouvernorat: found.gouvernorat,
          city: "",
          latitude: lat,
          longitude: lng,
        }));
      }
    },
  });
  return position ? <Marker position={position} /> : null;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const navBtnBase: React.CSSProperties = {
  flex: 1, padding: "14px",
  borderRadius: "12px", border: "none",
  fontWeight: 700, fontSize: "15px",
  fontFamily: "inherit", cursor: "pointer",
  transition: "all 0.2s",
  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(0,0,0,0.3)",
  color: "#e5e7eb",
  fontSize: "14px",
  fontFamily: "inherit",
  cursor: "pointer",
  outline: "none",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 14px center",
  paddingRight: "36px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.7px",
  marginBottom: "8px",
};

// ─── Composant principal ──────────────────────────────────────────────────────
type Props = {
  formData: CreateRequestDTO;
  setFormData: React.Dispatch<React.SetStateAction<CreateRequestDTO>>;
  nextStep: () => void;
  prevStep: () => void;
};

export default function Step2Location({ formData, setFormData, nextStep, prevStep }: Props) {
  const [position, setPosition] = useState<LatLngExpression | null>(
    formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : null
  );
  const [gouvernorat, setGouvernorat] = useState(formData.gouvernorat || "");
  const [ville, setVille] = useState(formData.city || "");
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null);

  const hasLocation = !!(formData.latitude && formData.longitude &&
    (formData.latitude !== 0 || formData.longitude !== 0));

  // Quand on sélectionne un gouvernorat via le select
  const handleGouvernoratChange = (g: string) => {
    setGouvernorat(g);
    setVille("");
    setFormData((prev) => ({ ...prev, gouvernorat: g, city: "" }));

    if (g && GOUVERNORATS[g]) {
      const coords = GOUVERNORATS[g].coords;
      setPosition(coords);
      setFlyTo(coords);
      setFormData((prev) => ({
        ...prev,
        gouvernorat: g,
        city: "",
        latitude: coords[0],
        longitude: coords[1],
      }));
    }
  };

  // Quand on sélectionne une ville via le select
  const handleVilleChange = (v: string) => {
    setVille(v);
    setFormData((prev) => ({ ...prev, city: v }));

    // Cherche les coordonnées de la ville (approximation : coords du gouvernorat)
    if (gouvernorat && GOUVERNORATS[gouvernorat]) {
      const coords = GOUVERNORATS[gouvernorat].coords;
      // Offset léger pour différencier de la capitale du gouvernorat
      const villeIndex = GOUVERNORATS[gouvernorat].villes.indexOf(v);
      const angle = villeIndex * (2 * Math.PI / 8);
      const r = 0.03;
      const lat = coords[0] + Math.cos(angle) * r;
      const lng = coords[1] + Math.sin(angle) * r;
      setPosition([lat, lng]);
      setFlyTo([lat, lng]);
      setFormData((prev) => ({ ...prev, city: v, latitude: lat, longitude: lng }));
    }
  };

  const villes = gouvernorat ? GOUVERNORATS[gouvernorat]?.villes ?? [] : [];

  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "20px",
      padding: "36px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
      backdropFilter: "blur(12px)",
    }}>

      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <div style={{
            background: "linear-gradient(135deg, #6366f1, #a78bfa)",
            borderRadius: "10px", padding: "8px", fontSize: "18px", lineHeight: 1,
          }}>📍</div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.3px" }}>
            Localisation
          </h2>
        </div>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "13px", paddingLeft: "52px" }}>
          Choisissez via les menus ou cliquez directement sur la carte
        </p>
      </div>

      {/* Selects gouvernorat + ville */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
        <div>
          <label style={labelStyle}>Gouvernorat</label>
          <select
            value={gouvernorat}
            onChange={(e) => handleGouvernoratChange(e.target.value)}
            style={selectStyle}
          >
            <option value="">— Sélectionner —</option>
            {Object.keys(GOUVERNORATS).sort().map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Ville</label>
          <select
            value={ville}
            onChange={(e) => handleVilleChange(e.target.value)}
            disabled={!gouvernorat}
            style={{
              ...selectStyle,
              opacity: gouvernorat ? 1 : 0.4,
              cursor: gouvernorat ? "pointer" : "not-allowed",
            }}
          >
            <option value="">— Sélectionner —</option>
            {villes.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Status pill */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 16px", borderRadius: "12px", marginBottom: "16px",
        background: hasLocation ? "rgba(34,197,94,0.1)" : "rgba(99,102,241,0.1)",
        border: `1px solid ${hasLocation ? "rgba(34,197,94,0.3)" : "rgba(99,102,241,0.3)"}`,
        fontSize: "13px", fontWeight: 500,
        color: hasLocation ? "#4ade80" : "#a78bfa",
        transition: "all 0.3s",
      }}>
        <span style={{
          width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
          background: hasLocation ? "#22c55e" : "#6366f1",
          boxShadow: `0 0 8px ${hasLocation ? "#22c55e" : "#6366f1"}`,
        }} />
        {hasLocation
          ? `${gouvernorat ? gouvernorat + (ville ? ` › ${ville}` : "") + " — " : ""}${formData.latitude?.toFixed(4)}, ${formData.longitude?.toFixed(4)}`
          : "Aucun emplacement sélectionné"}
      </div>

      {/* Carte */}
      <div style={{
        borderRadius: "16px", overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        marginBottom: "24px",
      }}>
        <MapContainer
          center={[33.8869, 9.5375]}
          zoom={6}
          minZoom={6}
          maxZoom={16}
          maxBounds={TUNISIA_BOUNDS}
          maxBoundsViscosity={1.0}
          style={{ height: "380px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          <MapFlyTo center={flyTo} />
          <LocationMarker
            setFormData={setFormData}
            position={position}
            setPosition={setPosition}
            setGouvernorat={(g) => { setGouvernorat(g); setFlyTo(null); }}
            setVille={setVille}
          />
        </MapContainer>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={prevStep}
          style={{
            ...navBtnBase,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#9ca3af",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
        >
          ← Précédent
        </button>
        <button
          onClick={nextStep}
          disabled={!hasLocation}
          style={{
            ...navBtnBase,
            background: hasLocation
              ? "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
              : "rgba(255,255,255,0.06)",
            color: hasLocation ? "#fff" : "#4b5563",
            boxShadow: hasLocation ? "0 8px 24px rgba(245,158,11,0.3)" : "none",
            cursor: hasLocation ? "pointer" : "not-allowed",
          }}
          onMouseEnter={(e) => {
            if (!hasLocation) return;
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}