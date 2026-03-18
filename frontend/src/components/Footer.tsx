import { Link } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <span className="text-lg font-extrabold text-accent-foreground">A</span>
              </div>
              <span className="text-xl font-bold">Assistio</span>
            </div>
            <p className="text-sm text-primary-foreground/70">
              La plateforme n°1 en Tunisie pour trouver des professionnels qualifiés près de chez vous.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Navigation</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <Link to="/" className="hover:text-primary-foreground transition-colors">Accueil</Link>
              <Link to="/requests" className="hover:text-primary-foreground transition-colors">Demandes</Link>
              <Link to="/create" className="hover:text-primary-foreground transition-colors">Publier</Link>
              <Link to="/register" className="hover:text-primary-foreground transition-colors">S'inscrire</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Catégories</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <span>Plomberie</span>
              <span>Électricité</span>
              <span>Jardinage</span>
              <span>Peinture</span>
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-semibold">Contact</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Tunis, Tunisie</span>
              <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> +216 71 000 000</span>
              <span className="flex items-center gap-2"><Mail className="h-4 w-4" /> contact@assistio.tn</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-foreground/20 pt-6 text-center text-sm text-primary-foreground/50">
          © 2026 Assistio. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
