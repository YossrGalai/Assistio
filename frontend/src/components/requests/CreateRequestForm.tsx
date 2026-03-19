import { useState } from "react";
import Step1Details from "./Step1Details";
import Step2Location from "./Step2Location";
import Step3Summary from "./Step3Summary";
import Header from "../Header";
import Footer from "../Footer";
import type { CreateRequestDTO } from "../../types/request";

const STEPS = [
  { label: "Détails", icon: "📝", desc: "Titre & description" },
  { label: "Localisation", icon: "📍", desc: "Position sur la carte" },
  { label: "Confirmation", icon: "✅", desc: "Vérification & envoi" },
];

export default function CreateRequestForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CreateRequestDTO>({
    title: "",
    description: "",
    category: "",
    urgency: "low",
    latitude: 0,
    longitude: 0,
    city: "",
    gouvernorat: "",
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div
      style={{
        fontFamily: "'Outfit', 'Nunito', sans-serif",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(160deg, #0f0c29 0%, #1a1535 40%, #0d1117 100%)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient blobs */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "5%", left: "0%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "-5%",
          width: "400px", height: "400px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "5%", left: "30%",
          width: "500px", height: "250px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)",
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />

        <main style={{ flex: 1, padding: "40px 32px 60px" }}>
          {/* Stepper */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "36px",
          }}>
            {STEPS.map(({ label, icon }, i) => {
              const num = i + 1;
              const active = step === num;
              const done = step > num;
              return (
                <div key={num} style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: "15px",
                      transition: "all 0.3s",
                      background: done
                        ? "linear-gradient(135deg, #22c55e, #16a34a)"
                        : active
                        ? "linear-gradient(135deg, #f59e0b, #ef4444)"
                        : "rgba(255,255,255,0.06)",
                      border: done
                        ? "2px solid #22c55e"
                        : active
                        ? "2px solid #f59e0b"
                        : "2px solid rgba(255,255,255,0.12)",
                      color: done || active ? "#fff" : "#6b7280",
                      boxShadow: active ? "0 0 20px rgba(245,158,11,0.4)" : done ? "0 0 12px rgba(34,197,94,0.3)" : "none",
                    }}>
                      {done ? "✓" : icon}
                    </div>
                    <span style={{
                      marginTop: "6px", fontSize: "11px", fontWeight: 600,
                      color: active ? "#f59e0b" : done ? "#22c55e" : "#4b5563",
                      letterSpacing: "0.3px",
                    }}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      width: "80px", height: "2px", margin: "0 8px 20px",
                      background: done
                        ? "linear-gradient(90deg, #22c55e, #16a34a)"
                        : "rgba(255,255,255,0.08)",
                      borderRadius: "2px",
                      transition: "background 0.4s",
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step content — full width */}
          <div style={{ width: "100%" }}>
            {step === 1 && <Step1Details formData={formData} setFormData={setFormData} nextStep={nextStep} />}
            {step === 2 && <Step2Location formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />}
            {step === 3 && <Step3Summary formData={formData} prevStep={prevStep} />}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}