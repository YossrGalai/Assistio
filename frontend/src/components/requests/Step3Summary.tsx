import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateRequestDTO } from "../../types/request";
import { createRequest } from "../../services/requestService";

const URGENCY_LABELS: Record<string, { label: string; accent: string; bg: string; icon: string }> = {
  low:    { label: "Faible",  accent: "#22c55e", bg: "rgba(34,197,94,0.12)",   icon: "🟢" },
  medium: { label: "Moyenne", accent: "#f59e0b", bg: "rgba(245,158,11,0.12)",  icon: "🟡" },
  high:   { label: "Élevée",  accent: "#ef4444", bg: "rgba(239,68,68,0.12)",   icon: "🔴" },
};

type Props = {
  formData: CreateRequestDTO;
  prevStep: () => void;
};

const rowStyle: React.CSSProperties = {
  display: "flex", alignItems: "flex-start",
  padding: "14px 18px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  gap: "16px",
};

const keyStyle: React.CSSProperties = {
  width: "120px", flexShrink: 0,
  fontSize: "11px", fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase", letterSpacing: "0.7px",
  paddingTop: "1px",
};

const valStyle: React.CSSProperties = {
  flex: 1, fontSize: "14px", color: "#e5e7eb",
  lineHeight: 1.5,
};

export default function Step3Summary({ formData, prevStep }: Props) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const urgency = URGENCY_LABELS[formData.urgency] ?? { label: formData.urgency, accent: "#fff", bg: "transparent", icon: "⚪" };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createRequest(formData);
      navigate("/requests");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la création ❌");
    } finally {
      setLoading(false);
    }
  };

  const navBtnBase: React.CSSProperties = {
    flex: 1, padding: "14px",
    borderRadius: "12px", border: "none",
    fontWeight: 700, fontSize: "15px",
    fontFamily: "inherit", cursor: "pointer",
    transition: "all 0.2s",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
  };

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
      <div style={{ marginBottom: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <div style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            borderRadius: "10px", padding: "8px", fontSize: "18px", lineHeight: 1,
          }}>
            ✅
          </div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.3px" }}>
            Confirmation
          </h2>
        </div>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "13px", paddingLeft: "52px" }}>
          Vérifiez les informations avant d'envoyer
        </p>
      </div>

      {/* Summary card */}
      <div style={{
        background: "rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "14px",
        overflow: "hidden",
        marginBottom: "24px",
      }}>
        <div style={rowStyle}>
          <span style={keyStyle}>Titre</span>
          <span style={{ ...valStyle, fontWeight: 600, color: "#fff" }}>{formData.title || "—"}</span>
        </div>

        <div style={rowStyle}>
          <span style={keyStyle}>Description</span>
          <span style={valStyle}>{formData.description || "—"}</span>
        </div>

        <div style={rowStyle}>
          <span style={keyStyle}>Catégorie</span>
          <span style={{
            ...valStyle,
            display: "inline-flex",
          }}>
            <span style={{
              padding: "4px 12px", borderRadius: "20px",
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.3)",
              color: "#f59e0b", fontSize: "12px", fontWeight: 600,
            }}>
              {formData.category || "—"}
            </span>
          </span>
        </div>

        <div style={rowStyle}>
          <span style={keyStyle}>Localisation</span>
          <span style={{ ...valStyle, fontFamily: "monospace", fontSize: "13px", color: "#a5b4fc" }}>
            {formData.latitude !== 0
              ? `${formData.latitude?.toFixed(5)}, ${formData.longitude?.toFixed(5)}`
              : "—"}
          </span>
        </div>

        <div style={{ ...rowStyle, borderBottom: "none" }}>
          <span style={keyStyle}>Urgence</span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 12px", borderRadius: "20px",
            background: urgency.bg,
            border: `1px solid ${urgency.accent}40`,
            color: urgency.accent, fontSize: "12px", fontWeight: 700,
          }}>
            {urgency.icon} {urgency.label}
          </span>
        </div>
      </div>

      {/* Info note */}
      <div style={{
        padding: "12px 16px", borderRadius: "12px", marginBottom: "24px",
        background: "rgba(99,102,241,0.08)",
        border: "1px solid rgba(99,102,241,0.2)",
        fontSize: "12px", color: "#a5b4fc",
        display: "flex", alignItems: "center", gap: "8px",
      }}>
        <span style={{ fontSize: "16px" }}>ℹ️</span>
        Votre demande sera publiée et visible par les prestataires disponibles dans votre zone.
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={prevStep}
          disabled={loading}
          style={{
            ...navBtnBase,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#9ca3af",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)"; }}
        >
          ← Précédent
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            ...navBtnBase,
            background: loading
              ? "rgba(255,255,255,0.06)"
              : "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            color: loading ? "#4b5563" : "#fff",
            boxShadow: loading ? "none" : "0 8px 24px rgba(34,197,94,0.3)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (loading) return;
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          {loading ? (
            <>
              <span style={{
                width: "14px", height: "14px", borderRadius: "50%",
                border: "2px solid #6b7280", borderTopColor: "#fff",
                display: "inline-block",
                animation: "spin 0.7s linear infinite",
              }} />
              Envoi en cours...
            </>
          ) : (
            <>✅ Confirmer et publier</>
          )}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}