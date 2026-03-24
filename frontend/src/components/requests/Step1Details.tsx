/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import type { CreateRequestDTO } from "../../types/request";

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

const URGENCY_OPTIONS = [
  {
    value: "low",
    label: "Faible",
    icon: "🟢",
    accent: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.4)",
  },
  {
    value: "medium",
    label: "Moyenne",
    icon: "🟡",
    accent: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.4)",
  },
  {
    value: "high",
    label: "Élevée",
    icon: "🔴",
    accent: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.4)",
  },
];

type Props = {
  formData: CreateRequestDTO;
  setFormData: React.Dispatch<React.SetStateAction<CreateRequestDTO>>;
  nextStep: () => void;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 16px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "12px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.2s, background 0.2s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  color: "#9ca3af",
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  marginBottom: "8px",
};

export default function Step1Details({ formData, setFormData, nextStep }: Props) {
  const isValid = formData.title && formData.description && formData.category && formData.urgency;
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    if (!formData.imageFile) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(formData.imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [formData.imageFile]);

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "#f59e0b";
    e.target.style.background = "rgba(255,255,255,0.09)";
  };
  const blurStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = "rgba(255,255,255,0.12)";
    e.target.style.background = "rgba(255,255,255,0.06)";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, imageFile: file }));
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
            background: "linear-gradient(135deg, #f59e0b, #ef4444)",
            borderRadius: "10px", padding: "8px", fontSize: "18px",
            lineHeight: 1,
          }}>
            📝
          </div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.3px" }}>
            Détails de la demande
          </h2>
        </div>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "13px", paddingLeft: "52px" }}>
          Décrivez votre besoin avec précision
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Titre */}
        <div>
          <label style={labelStyle}>Titre *</label>
          <input
            type="text"
            placeholder="Ex : Fuite d'eau dans la cuisine"
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            onFocus={focusStyle}
            onBlur={blurStyle}
            style={inputStyle}
          />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description *</label>
          <textarea
            placeholder="Décrivez votre problème en détail..."
            value={formData.description}
            rows={4}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            onFocus={focusStyle as any}
            onBlur={blurStyle as any}
            style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
          />
        </div>

        {/* Photo */}
        <div>
          <label style={labelStyle}>Photo (optionnelle)</label>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={inputStyle}
            />

            {previewUrl && (
              <div style={{
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
                width: "100%",
                maxWidth: "420px",
              }}>
                <img
                  src={previewUrl}
                  alt="Aperçu"
                  style={{ display: "block", width: "100%", height: "auto" }}
                />
              </div>
            )}

          </div>
        </div>

        {/* Catégorie — chips */}
        <div>
          <label style={labelStyle}>Catégorie *</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {CATEGORIES.map((cat) => {
              const active = formData.category === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, category: cat.value }))}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: active ? 700 : 400,
                    cursor: "pointer",
                    border: active ? "1px solid #f59e0b" : "1px solid rgba(255,255,255,0.1)",
                    background: active ? "rgba(245,158,11,0.18)" : "rgba(255,255,255,0.05)",
                    color: active ? "#f59e0b" : "#9ca3af",
                    transition: "all 0.15s",
                    fontFamily: "inherit",
                    display: "flex", alignItems: "center", gap: "6px",
                  }}
                >
                  {cat.icon} {cat.value}
                </button>
              );
            })}
          </div>
        </div>

        {/* Urgence */}
        <div>
          <label style={labelStyle}>Niveau d'urgence *</label>
          <div style={{ display: "flex", gap: "10px" }}>
            {URGENCY_OPTIONS.map(({ value, label, icon, accent, bg, border }) => {
              const active = formData.urgency === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, urgency: value as CreateRequestDTO["urgency"] }))}
                  style={{
                    flex: 1, padding: "12px 8px",
                    borderRadius: "12px",
                    border: active ? `1.5px solid ${border}` : "1px solid rgba(255,255,255,0.1)",
                    background: active ? bg : "rgba(255,255,255,0.04)",
                    color: active ? accent : "#6b7280",
                    fontSize: "13px", fontWeight: active ? 700 : 500,
                    cursor: "pointer", fontFamily: "inherit",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                    transition: "all 0.15s",
                    boxShadow: active ? `0 0 16px ${bg}` : "none",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{icon}</span>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={nextStep}
          disabled={!isValid}
          style={{
            marginTop: "8px",
            width: "100%", padding: "14px",
            borderRadius: "12px", border: "none",
            fontWeight: 700, fontSize: "15px",
            fontFamily: "inherit", cursor: isValid ? "pointer" : "not-allowed",
            background: isValid
              ? "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
              : "rgba(255,255,255,0.06)",
            color: isValid ? "#fff" : "#4b5563",
            boxShadow: isValid ? "0 8px 24px rgba(245,158,11,0.3)" : "none",
            transition: "all 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          }}
          onMouseEnter={(e) => {
            if (!isValid) return;
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
