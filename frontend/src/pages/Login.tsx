// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (values: { email: string; password: string }) => {
    const nextErrors: Record<string, string> = {};
    const trimmedEmail = values.email.trim();
    const trimmedPassword = values.password.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) nextErrors.email = "Email requis.";
    else if (!emailRegex.test(trimmedEmail)) nextErrors.email = "Email invalide.";

    if (!trimmedPassword) nextErrors.password = "Mot de passe requis.";
    else if (trimmedPassword.length < 6) nextErrors.password = "6 caracteres minimum.";

    return nextErrors;
  };

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate({ email, password });
    setErrors(nextErrors);
    setTouched({ email: true, password: true });
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
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
          <h2>Besoin d&apos;aide ? On s&apos;en occupe</h2>
          <p className="auth-subtitle">
            Connectez-vous pour gerer vos demandes d&apos;aide en toute simplicite.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) {
                  setErrors(validate({ email: e.target.value, password }));
                }
              }}
              onBlur={() => markTouched("email")}
              placeholder="nom@exemple.com"
              required
              className={`auth-input${touched.email && errors.email ? " error" : ""}`}
              aria-invalid={Boolean(touched.email && errors.email)}
              aria-describedby={touched.email && errors.email ? "email-error" : undefined}
            />
            {touched.email && errors.email && (
              <div className="auth-error" id="email-error">
                {errors.email}
              </div>
            )}

            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) {
                  setErrors(validate({ email, password: e.target.value }));
                }
              }}
              onBlur={() => markTouched("password")}
              placeholder="Votre mot de passe"
              required
              className={`auth-input${touched.password && errors.password ? " error" : ""}`}
              aria-invalid={Boolean(touched.password && errors.password)}
              aria-describedby={touched.password && errors.password ? "password-error" : undefined}
            />
            {touched.password && errors.password && (
              <div className="auth-error" id="password-error">
                {errors.password}
              </div>
            )}

            <button className="auth-primary" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <button
            className="auth-secondary"
            type="button"
            onClick={() => navigate("/")}
          >
            Accueil
          </button>

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
                <div className="hero-card-title">Entraide facile</div>
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
