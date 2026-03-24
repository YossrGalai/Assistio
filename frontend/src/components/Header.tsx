import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Menu, X, UserPlus, LogIn, UserCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBell from "../components/NotificationBell";
import { logout, isAuthenticated } from "../api/auth";

const navLinks: { href: string; label: string }[] = [
  { href: "/", label: "Accueil" },
  { href: "/requests", label: "Demandes" },
  { href: "/create", label: "Publier" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoggedIn(isAuthenticated());
  }, [location]);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card overflow-visible">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 overflow-visible">
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
                className="font-medium text-secondary-foreground bg-secondary/90"
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Desktop */}
        <div className="hidden items-center gap-2 md:flex overflow-visible">
          {loggedIn ? (
            <>
              <NotificationBell />
              <Link to="/profile">
                <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted hover:bg-accent transition-colors">
                  <UserCircle className="h-5 w-5 text-muted-foreground" />
                </button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link to="/register">
                <Button size="sm" variant="hero" className="gap-1.5">
                  <UserPlus className="h-4 w-4" />
                  S'inscrire
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="sm" className="gap-1.5 text-secondary-foreground bg-card/90 hover:bg-accent hover:text-accent-foreground">
                  <LogIn className="h-4 w-4" />
                  Se connecter
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile */}
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
                {loggedIn ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full gap-1.5 justify-start">
                        <UserCircle className="h-4 w-4" />
                        Mon profil
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full gap-1.5 justify-start text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;