// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          city: "Nabeul" // adapte selon ton modèle
        })
      });

      const data = await res.json();
      console.log("Response from backend:", data);

      if (res.ok) {
        alert("Registration successful!");
        navigate("/profile");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-frame">
        <div className="auth-left">
          <div className="auth-brand">Assistio</div>
          <h2>Creer un compte</h2>
          <p className="auth-subtitle">
            Rejoignez Assistio pour lancer et suivre vos demandes d&apos;assistants.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Nom complet</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Votre nom"
              required
            />
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nom@exemple.com"
              required
            />
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choisissez un mot de passe"
              required
            />
            <button className="auth-primary" type="submit" disabled={loading}>
              {loading ? "Creation..." : "Creer le compte"}
            </button>
          </form>
          <p className="auth-switch">
            Deja un compte ?{" "}
            <span onClick={() => navigate("/login")}>Se connecter</span>
          </p>
        </div>

        <div className="auth-right">
          <div className="auth-hero">
            <div className="hero-close">x</div>
            <div className="hero-image" aria-hidden="true" />
            <div className="hero-card hero-card-top">
              <span className="hero-dot" />
              <div>
                <div className="hero-card-title">Coordination rapide</div>
                <div className="hero-card-time">09:30 - 10:00</div>
              </div>
            </div>
            <div className="hero-calendar">
              <div className="hero-calendar-title">Mars</div>
              <div className="hero-calendar-days">
                <span>Lu</span>
                <span>Ma</span>
                <span>Me</span>
                <span>Je</span>
                <span>Ve</span>
                <span>Sa</span>
                <span>Di</span>
              </div>
              <div className="hero-calendar-dates">
                <span>22</span>
                <span>23</span>
                <span className="active">24</span>
                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
              </div>
            </div>
            <div className="hero-card hero-card-bottom">
              <div>
                <div className="hero-card-title">Demande quotidienne</div>
                <div className="hero-card-time">12:00 - 13:00</div>
              </div>
              <div className="hero-avatars">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
