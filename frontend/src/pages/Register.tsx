// src/pages/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (values: { name: string; email: string; password: string; city: string }) => {
    const nextErrors: Record<string, string> = {};
    const trimmedName = values.name.trim();
    const trimmedEmail = values.email.trim();
    const trimmedPassword = values.password.trim();
    const trimmedCity = values.city.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) nextErrors.name = "Nom requis.";
    else if (trimmedName.length < 2) nextErrors.name = "2 caracteres minimum.";

    if (!trimmedEmail) nextErrors.email = "Email requis.";
    else if (!emailRegex.test(trimmedEmail)) nextErrors.email = "Email invalide.";

    if (!trimmedPassword) nextErrors.password = "Mot de passe requis.";
    else if (trimmedPassword.length < 6) nextErrors.password = "6 caracteres minimum.";

    if (!trimmedCity) nextErrors.city = "Ville requise.";
    else if (trimmedCity.length < 2) nextErrors.city = "2 caracteres minimum.";

    return nextErrors;
  };

  const markTouched = (field: string) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate({ name, email, password, city });
    setErrors(nextErrors);
    setTouched({ name: true, email: true, password: true, city: true });
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedCity = city.trim();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
          city: trimmedCity
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
              onChange={(e) => {
                setName(e.target.value);
                if (touched.name) {
                  setErrors(validate({ name: e.target.value, email, password, city }));
                }
              }}
              onBlur={() => markTouched("name")}
              placeholder="Votre nom"
              required
              className={`auth-input${touched.name && errors.name ? " error" : ""}`}
              aria-invalid={Boolean(touched.name && errors.name)}
              aria-describedby={touched.name && errors.name ? "name-error" : undefined}
            />
            {touched.name && errors.name && (
              <div className="auth-error" id="name-error">
                {errors.name}
              </div>
            )}
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) {
                  setErrors(validate({ name, email: e.target.value, password, city }));
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
                  setErrors(validate({ name, email, password: e.target.value, city }));
                }
              }}
              onBlur={() => markTouched("password")}
              placeholder="Choisissez un mot de passe"
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
            <label>Ville</label>
            <input
              type="text"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (touched.city) {
                  setErrors(validate({ name, email, password, city: e.target.value }));
                }
              }}
              onBlur={() => markTouched("city")}
              placeholder="Votre ville"
              required
              className={`auth-input${touched.city && errors.city ? " error" : ""}`}
              aria-invalid={Boolean(touched.city && errors.city)}
              aria-describedby={touched.city && errors.city ? "city-error" : undefined}
            />
            {touched.city && errors.city && (
              <div className="auth-error" id="city-error">
                {errors.city}
              </div>
            )}
            <button className="auth-primary" type="submit" disabled={loading}>
              {loading ? "Creation..." : "Creer le compte"}
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

