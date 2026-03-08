import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Users,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { setAdminSession } from "./AdminLoginPage";

// Admin credentials
const ADMIN_EMAIL = "railmutualconnect@gmail.com";
const ADMIN_PASSWORD = "admin@2026";

type AuthMode = "choose" | "user" | "admin";

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Admin form state
  const [mode, setMode] = useState<AuthMode>("choose");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Once authenticated and actor is ready, check profile and redirect
  // biome-ignore lint/correctness/useExhaustiveDependencies: isRedirecting intentionally omitted to prevent infinite loop
  useEffect(() => {
    if (!isAuthenticated || !actor || actorFetching || isRedirecting) return;

    const handlePostLogin = async () => {
      setIsRedirecting(true);
      setAuthError(null);

      try {
        let profile = queryClient.getQueryData<{ fullName: string }>([
          "registerOrLoginProfile",
        ]);

        if (!profile) {
          profile = await actor.registerOrLogin();
          queryClient.setQueryData(["registerOrLoginProfile"], profile);
          queryClient.setQueryData(["currentUserProfile"], profile);
        }

        if (!profile.fullName || profile.fullName.trim() === "") {
          navigate({ to: "/profile" });
        } else {
          navigate({ to: "/dashboard" });
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Auth error:", msg);
        setAuthError(
          "Failed to initialize your account. Please try logging in again.",
        );
        setIsRedirecting(false);
        await clear();
        queryClient.clear();
      }
    };

    handlePostLogin();
  }, [isAuthenticated, actor, actorFetching, navigate, clear, queryClient]);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      await login();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === "User is already authenticated") {
        await clear();
        queryClient.clear();
        setTimeout(() => login(), 300);
      } else {
        setAuthError("Login failed. Please try again.");
      }
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminLoading(true);

    await new Promise((r) => setTimeout(r, 600));

    const emailMatch =
      adminEmail.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const passwordMatch = adminPassword === ADMIN_PASSWORD;

    if (emailMatch && passwordMatch) {
      setAdminSession();
      navigate({ to: "/admin" });
    } else if (!emailMatch) {
      setAdminError("Invalid admin email. Please check and try again.");
    } else {
      setAdminError("Incorrect admin password. Please try again.");
      setAdminPassword("");
    }
    setAdminLoading(false);
  };

  const isLoading =
    isLoggingIn || (isAuthenticated && (actorFetching || isRedirecting));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center gap-3 shadow-md">
        <img
          src="/assets/generated/icon-transparent.dim_512x512.png"
          alt="RailMutual Connect"
          className="h-10 w-10 object-contain"
        />
        <img
          src="/assets/generated/logo-primary.dim_800x300.png"
          alt="RailMutual Connect"
          className="h-10 object-contain hidden sm:block"
        />
        <div className="sm:hidden">
          <h1 className="text-xl font-bold tracking-tight">
            RailMutual Connect
          </h1>
          <p className="text-xs text-primary-foreground/70">
            Indian Railways Mutual Transfer Portal
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Hero */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-2">
              <img
                src="/assets/generated/icon-transparent.dim_512x512.png"
                alt="RailMutual Connect"
                className="w-14 h-14 object-contain"
              />
            </div>
            <h2 className="text-3xl font-bold font-poppins text-foreground">
              Welcome Back
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Sign in to access your mutual transfer dashboard and connect with
              fellow railway employees.
            </p>
          </div>

          {/* Mode selector tabs */}
          {!isAuthenticated && mode === "choose" && (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                data-ocid="auth.user_login_tab"
                onClick={() => setMode("user")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Users className="w-7 h-7 text-primary" />
                <span className="font-semibold text-foreground text-sm">
                  User Login
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  For railway employees
                </span>
              </button>
              <button
                type="button"
                data-ocid="auth.admin_login_tab"
                onClick={() => setMode("admin")}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Shield className="w-7 h-7 text-primary" />
                <span className="font-semibold text-foreground text-sm">
                  Admin Login
                </span>
                <span className="text-xs text-muted-foreground text-center">
                  For administrators only
                </span>
              </button>
            </div>
          )}

          {/* Error Alert (user flow) */}
          {authError && (
            <Alert variant="destructive" data-ocid="auth.error_state">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          {/* User Login Card */}
          {(mode === "user" || isAuthenticated) && (
            <div className="bg-card border border-border rounded-2xl p-8 shadow-card space-y-6">
              {mode === "user" && !isAuthenticated && (
                <button
                  type="button"
                  data-ocid="auth.back_to_choose_button"
                  onClick={() => setMode("choose")}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Back
                </button>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Secure Authentication
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uses passkeys, Google, Apple, or Microsoft sign-in
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Users className="w-5 h-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Railway Employee Network
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Connect with employees across all zones and divisions
                    </p>
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    disabled={isLoading}
                    onClick={() => navigate({ to: "/dashboard" })}
                    data-ocid="auth.go_to_dashboard_button"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Setting up your account…
                      </>
                    ) : (
                      <>
                        Go to Dashboard
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={handleLogout}
                    disabled={isLoading}
                    data-ocid="auth.signout_button"
                  >
                    Sign out
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleLogin}
                  disabled={isLoading}
                  data-ocid="auth.signin_button"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In Securely
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Admin Login Card */}
          {mode === "admin" && !isAuthenticated && (
            <div className="bg-card border border-border rounded-2xl p-8 shadow-card space-y-5">
              <button
                type="button"
                data-ocid="auth.admin_back_button"
                onClick={() => {
                  setMode("choose");
                  setAdminError(null);
                  setAdminEmail("");
                  setAdminPassword("");
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back
              </button>

              <div className="flex items-center gap-2 pb-1">
                <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm font-semibold text-foreground">
                  Admin Access
                </p>
              </div>

              {adminError && (
                <Alert variant="destructive" data-ocid="auth.admin_error_state">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{adminError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="admin-email"
                    className="text-sm font-medium text-foreground"
                  >
                    Admin Email
                  </label>
                  <Input
                    id="admin-email"
                    data-ocid="auth.admin_email_input"
                    type="email"
                    placeholder="Enter admin email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    disabled={adminLoading}
                    autoFocus
                    autoComplete="username"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="admin-password"
                    className="text-sm font-medium text-foreground"
                  >
                    Admin Password
                  </label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      data-ocid="auth.admin_password_input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      disabled={adminLoading}
                      autoComplete="current-password"
                      className="pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  data-ocid="auth.admin_submit_button"
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={
                    adminLoading ||
                    adminEmail.trim().length === 0 ||
                    adminPassword.length === 0
                  }
                >
                  {adminLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Access Admin Portal
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to use this portal only for legitimate
            mutual transfer requests within Indian Railways.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-xs text-muted-foreground border-t border-border">
        <p>
          © {new Date().getFullYear()} RailMutual Connect — Built with{" "}
          <span className="text-destructive">♥</span> using{" "}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
