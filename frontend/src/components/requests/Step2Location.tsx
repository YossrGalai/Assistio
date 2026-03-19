import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { CreateRequestDTO } from "../../types/request";

type Props = {
  formData: CreateRequestDTO;
  setFormData: React.Dispatch<React.SetStateAction<CreateRequestDTO>>;
  nextStep: () => void;
  prevStep: () => void;
};

function LocationMarker({
  setFormData,
  position,
  setPosition,
}: {
  setFormData: Props["setFormData"];
  position: LatLngExpression | null;
  setPosition: (p: LatLngExpression) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    },
  });
  return position ? <Marker position={position} /> : null;
}

const navBtnBase: React.CSSProperties = {
  flex: 1, padding: "14px",
  borderRadius: "12px", border: "none",
  fontWeight: 700, fontSize: "15px",
  fontFamily: "inherit", cursor: "pointer",
  transition: "all 0.2s",
  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
};

export default function Step2Location({ formData, setFormData, nextStep, prevStep }: Props) {
  const [position, setPosition] = useState<LatLngExpression | null>(
    formData.latitude && formData.longitude ? [formData.latitude, formData.longitude] : null
  );
  const hasLocation = formData.latitude !== 0 && formData.longitude !== 0;

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
            background: "linear-gradient(135deg, #6366f1, #a78bfa)",
            borderRadius: "10px", padding: "8px", fontSize: "18px", lineHeight: 1,
          }}>
            📍
          </div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.3px" }}>
            Localisation
          </h2>
        </div>
        <p style={{ margin: 0, color: "#6b7280", fontSize: "13px", paddingLeft: "52px" }}>
          Cliquez sur la carte pour indiquer l'emplacement exact
        </p>
      </div>

      {/* Status indicator */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 16px", borderRadius: "12px", marginBottom: "20px",
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
          ? `Position sélectionnée : ${formData.latitude?.toFixed(5)}, ${formData.longitude?.toFixed(5)}`
          : "Cliquez sur la carte pour choisir un emplacement"}
      </div>

      {/* Map */}
      <div style={{
        borderRadius: "16px", overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        marginBottom: "24px",
      }}>
        <MapContainer
          center={[36.8065, 10.1815]}
          zoom={7}
          style={{ height: "380px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          <LocationMarker
            setFormData={setFormData}
            position={position}
            setPosition={setPosition}
          />
        </MapContainer>
      </div>

      {/* Nav buttons */}
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