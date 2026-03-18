import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Menu, X, UserPlus, LogIn } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "../components/NotificationBell";

const navLinks: { href: string; label: string }[] = [
  { href: "/", label: "Accueil" },
  { href: "/requests", label: "Demandes" },
  { href: "/create", label: "Publier" },
];


const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-extrabold text-primary-foreground">A</span>
          </div>
          <span className="text-xl font-bold text-foreground">Assistio</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Button
                variant={location.pathname === link.href ? "secondary" : "ghost"}
                size="sm"
                className="font-medium"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <NotificationBell />
          <Link to="/register">
            <Button size="sm" variant="hero" className="gap-1.5">
              <UserPlus className="h-4 w-4" />
              S'inscrire
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm" className="gap-1.5">
              <LogIn className="h-4 w-4" />
              Se connecter
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-card md:hidden"
          >
            <div className="flex flex-col gap-2 p-4">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)}>
                  <Button variant={location.pathname === link.href ? "secondary" : "ghost"} className="w-full justify-start">
                    {link.label}
                  </Button>
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2">
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button variant="hero" className="w-full gap-1.5">
                    <UserPlus className="h-4 w-4" />
                    S'inscrire
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full gap-1.5">
                    <LogIn className="h-4 w-4" />
                    Se connecter
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
