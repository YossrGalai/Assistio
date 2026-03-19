// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Response from backend:", data);

      if (res.ok) {
        // Stocker le token pour les requêtes authentifiées
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful!");
        navigate("/profile");
      } else {
        alert(data.message || "Login failed");
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
          <h2>Aide demande d&apos;assistants</h2>
          <p className="auth-subtitle">
            Connectez-vous pour gerer vos demandes d&apos;aide en toute simplicite.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
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
              placeholder="Votre mot de passe"
              required
            />

            <button className="auth-primary" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="auth-switch">
            Pas de compte ?{" "}
            <span onClick={() => navigate("/register")}>Creer un compte</span>
          </p>
        </div>

        <div className="auth-right">
          <div className="auth-hero">
            <div className="hero-close">x</div>
            <div className="hero-image" aria-hidden="true" />
            <div className="hero-card hero-card-top">
              <span className="hero-dot" />
              <div>
                <div className="hero-card-title">Revue d&apos;equipe</div>
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
