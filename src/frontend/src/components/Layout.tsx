import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "../hooks/useQueries";

const ADMIN_EMAIL = "railmutualconnect@gmail.com";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAdmin = userProfile?.email === ADMIN_EMAIL;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    router.navigate({ to: "/" });
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/matches", label: "Matches", icon: Users },
    { to: "/profile", label: "My Profile", icon: UserCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-primary-700 shadow-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo — icon + coded text matching primary branding */}
            <Link to="/dashboard" className="flex items-center gap-2.5 group">
              <img
                src="/assets/generated/logo-icon-only.dim_200x200.png"
                alt="RailMutual Connect icon"
                className="h-9 w-9 object-contain"
              />
              <div className="flex flex-col leading-none">
                <span className="font-display font-extrabold text-white text-base tracking-tight leading-none">
                  RailMutual&nbsp;
                  <span className="text-[#FF941C]">Connect</span>
                </span>
                <span className="text-white/55 text-[10px] font-medium tracking-wide mt-0.5 hidden sm:block">
                  Mutual Transfers Made Easy
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  activeProps={{
                    className:
                      "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-white bg-white/15 border border-white/20",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  data-ocid="nav.admin_panel_link"
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-orange-400 hover:text-orange-300 hover:bg-white/10 transition-colors border border-orange-500/30"
                  activeProps={{
                    className:
                      "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-orange-300 bg-orange-500/15 border border-orange-500/40",
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 text-white/80 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>

              {/* Mobile menu button */}
              <button
                type="button"
                className="md:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary-800 border-t border-white/10">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  activeProps={{
                    className:
                      "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-white bg-white/15",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  data-ocid="nav.admin_panel_link"
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-orange-400 hover:text-orange-300 hover:bg-white/10 transition-colors"
                  activeProps={{
                    className:
                      "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium text-orange-300 bg-orange-500/15",
                  }}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-md text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary-800 text-white/60 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/logo-icon-only.dim_200x200.png"
                alt=""
                className="w-4 h-4 object-contain opacity-80"
              />
              <span>RailMutual Connect — Mutual Transfers Made Easy</span>
            </div>
            <div className="text-center sm:text-right">
              <p>
                This platform only facilitates connections. Official transfers
                are governed by Indian Railways rules.
              </p>
              <p className="mt-1">
                © {new Date().getFullYear()} · Built with{" "}
                <span className="text-orange-400">♥</span> using{" "}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "railmutual-connect")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
