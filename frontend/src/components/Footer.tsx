import { Link } from "react-router-dom";
import { MapPin, Phone, Mail} from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-primary-foreground/10 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent">
              <span className="text-sm font-extrabold text-accent-foreground">A</span>
            </div>
            <span className="font-bold">Assistio</span>
            <span className="hidden text-primary-foreground/30 md:inline">—</span>
            <span className="hidden text-xs text-primary-foreground/50 md:inline">
              Services de proximité en Tunisie
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-5 text-xs text-primary-foreground/60">
            <Link to="/" className="transition-colors hover:text-primary-foreground">Accueil</Link>
            <Link to="/requests" className="transition-colors hover:text-primary-foreground">Demandes</Link>
            <span className="text-primary-foreground/20">|</span>
            <a href="mailto:contact@assistio.tn" className="flex items-center gap-1.5 transition-colors hover:text-primary-foreground">
              <Mail className="h-3 w-3" />
              contact@assistio.tn
            </a>
            <a href="tel:+21671000000" className="flex items-center gap-1.5 transition-colors hover:text-primary-foreground">
              <Phone className="h-3 w-3" />
              +216 71 000 000
            </a>
            <span className="flex items-center gap-1 text-primary-foreground/40">
              <MapPin className="h-3 w-3" />
              Tunis
            </span>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-4 border-t border-primary-foreground/10 pt-4 flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-primary-foreground/40">
            © 2026 Assistio. Tous droits réservés.
          </p>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;