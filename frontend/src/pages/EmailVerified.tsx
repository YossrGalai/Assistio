import { useLocation, useNavigate } from "react-router-dom";
import "./Auth.css";

type StatusCopy = {
  title: string;
  description: string;
};

const STATUS_COPY: Record<string, StatusCopy> = {
  success: {
    title: "Email vérifié",
    description:
      "Votre adresse email est bien confirmée. Vous pouvez maintenant vous connecter.",
  },
  "invalid-or-expired": {
    title: "Lien invalide ou expiré",
    description:
      "Ce lien de vérification est invalide ou a expiré. Demandez un nouveau lien et réessayez.",
  },
  invalid: {
    title: "Lien invalide",
    description:
      "Ce lien de vérification n'est pas valide. Demandez un nouveau lien.",
  },
  expired: {
    title: "Lien expiré",
    description:
      "Ce lien de vérification a expiré. Demandez un nouveau lien pour continuer.",
  },
};

const getCopy = (status: string | null): StatusCopy => {
  if (!status) {
    return {
      title: "Vérification email",
      description:
        "Nous n'avons pas pu déterminer le statut. Vérifiez votre lien et réessayez.",
    };
  }
  return STATUS_COPY[status] || {
    title: "Vérification email",
    description:
      "Le statut de vérification est inconnu. Vérifiez votre lien et réessayez.",
  };
};

export default function EmailVerified() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const status = params.get("status");
  const copy = getCopy(status);
  const isError =
    status === "invalid-or-expired" || status === "invalid" || status === "expired";

  return (
    <div className="auth-container">
      <div className="auth-frame">
        <div className="auth-left">
          <div className="auth-brand">Assistio</div>
          <h2 className={isError ? "auth-status error" : "auth-status success"}>
            {copy.title}
          </h2>
          <p className="auth-subtitle">{copy.description}</p>

          <div className="auth-form">
            <button
              className="auth-primary"
              type="button"
              onClick={() => navigate("/login")}
            >
              Se connecter
            </button>

            <button
              className="auth-secondary"
              type="button"
              onClick={() => navigate("/")}
            >
              Accueil
            </button>
          </div>

          <p className="auth-switch">
            Pas de compte ?{" "}
            <span onClick={() => navigate("/register")}>Créer un compte</span>
          </p>
        </div>

        <div className="auth-right">
          <div className="auth-hero">
            <div className="hero-close">x</div>
            <div className="hero-image" aria-hidden="true" />
            <div className="hero-card hero-card-top">
              <span className="hero-dot" />
              <div>
                <div className="hero-card-title">Vérification email</div>
                <div className="hero-card-time">Assistio</div>
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
                <div className="hero-card-title">Besoin d'aide</div>
                <div className="hero-card-time">On est là</div>
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
