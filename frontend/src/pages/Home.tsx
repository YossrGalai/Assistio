import Header from "../components/Header";
import Footer from "../components/Footer";
import RequestsMap from "./Requests/RequestsMap";
import RequestFilters from "../components/Filters/RequestFilters";
import { useState } from "react";

export default function Home() {
  const [filters, setFilters] = useState({
    search: "",
    gouvernorat: "",
    ville: "",
    categorie: "",
    statut: "",
  });

  const handleFilter = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // Connecter au backend ici
    console.log("Filtres appliqués:", newFilters);
  };

  return (
    
    <div
      style={{
        fontFamily: "'Outfit', 'Nunito', sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(160deg, #0f0c29 0%, #1a1535 40%, #0d1117 100%)",
        color: "#fff",
      }}
    >
      {/* Ambient background blobs */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "10%", left: "5%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: "30%", right: "0%",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "10%", left: "30%",
          width: "600px", height: "300px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239,68,68,0.07) 0%, transparent 70%)",
        }} />
      </div>

      <Header />

      <main style={{ flex: 1, position: "relative", zIndex: 1 }}>

        {/* ---- Hero Banner ---- */}
        <div style={{
          padding: "48px 32px 36px",
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto",
        }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: "30px", padding: "6px 16px",
            fontSize: "12px", color: "#f59e0b", fontWeight: 600,
            marginBottom: "20px", letterSpacing: "0.5px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
            Plateforme de services en Tunisie
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 800,
            margin: "0 0 16px",
            letterSpacing: "-1px",
            lineHeight: 1.15,
            background: "linear-gradient(135deg, #fff 30%, #f59e0b 70%, #ef4444 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Trouvez le bon prestataire,<br />au bon endroit
          </h1>
          <p style={{ color: "#9ca3af", fontSize: "16px", margin: 0, lineHeight: 1.6 }}>
            Explorez les demandes de services à travers toute la Tunisie — filtrez par région, ville et catégorie.
          </p>

          {/* Stats bar */}
          <div style={{
            display: "flex", justifyContent: "center", gap: "40px",
            marginTop: "32px", flexWrap: "wrap",
          }}>
            {[
              { value: "2 400+", label: "Demandes actives" },
              { value: "24", label: "Gouvernorats" },
              { value: "15+", label: "Catégories" },
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 800, color: "#f59e0b" }}>{stat.value}</div>
                <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Main layout: Filters + Map ---- */}
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 24px 48px",
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: "24px",
          alignItems: "start",
        }}>
          {/* Filters panel — sticky */}
          <div style={{ position: "sticky", top: "24px" }}>
            <RequestFilters onFilter={handleFilter} />

            {/* Active filters summary */}
            {Object.values(filters).some(Boolean) && (
              <div style={{
                marginTop: "12px",
                padding: "14px 16px",
                background: "rgba(99,102,241,0.08)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#a5b4fc",
              }}>
                <div style={{ fontWeight: 600, marginBottom: "6px", color: "#818cf8" }}>Filtres actifs :</div>
                {Object.entries(filters).map(([key, val]) =>
                  val ? (
                    <div key={key} style={{ display: "flex", justifyContent: "space-between", padding: "2px 0" }}>
                      <span style={{ color: "#6b7280", textTransform: "capitalize" }}>{key}</span>
                      <span style={{ color: "#f59e0b", fontWeight: 600 }}>{val}</span>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>

          {/* Map */}
          <div style={{
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)",
            height: "680px",
            position: "relative",
          }}>
            {/* Map header overlay */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
              background: "linear-gradient(to bottom, rgba(15,12,41,0.85) 0%, transparent 100%)",
              padding: "16px 20px",
              pointerEvents: "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e",
                  boxShadow: "0 0 0 3px rgba(34,197,94,0.3)",
                }} />
                <span style={{ fontSize: "13px", color: "#e5e7eb", fontWeight: 500 }}>
                  Carte des demandes en direct
                </span>
              </div>
            </div>

            <RequestsMap
              search={filters.search}
              ville={filters.ville}
              gouvernorat={filters.gouvernorat}
              categorie={filters.categorie}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}