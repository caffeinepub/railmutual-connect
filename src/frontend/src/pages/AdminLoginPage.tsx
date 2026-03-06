import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Loader2, Shield, Train } from "lucide-react";
import { useState } from "react";

// Admin credentials — hardcoded for client-side gate
const ADMIN_EMAIL = "railmutualconnect@gmail.com";
const ADMIN_PASSWORD = "admin@2026";
const ADMIN_SESSION_KEY = "railmutual_admin_session";

export function setAdminSession() {
  sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function hasAdminSession(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate a brief check delay
    await new Promise((r) => setTimeout(r, 600));

    const emailMatch = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const passwordMatch = password === ADMIN_PASSWORD;

    if (emailMatch && passwordMatch) {
      setAdminSession();
      navigate({ to: "/admin" });
    } else if (!emailMatch) {
      setError("Invalid admin email. Please check and try again.");
    } else {
      setError("Incorrect admin password. Please try again.");
      setPassword("");
    }
    setIsLoading(false);
  };

  const isFormValid = email.trim().length > 0 && password.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4 px-6 flex items-center gap-3 shadow-md">
        <img
          src="/assets/generated/railmutual-logo.dim_256x256.png"
          alt="RailMutual Connect"
          className="h-10 w-10 rounded-lg object-cover"
        />
        <div>
          <h1 className="text-xl font-bold tracking-tight">
            RailMutual Connect
          </h1>
          <p className="text-xs text-primary-foreground/70">
            Admin Portal Access
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Icon + title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-1">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Admin Login</h2>
            <p className="text-sm text-muted-foreground">
              Enter your admin credentials to access the portal.
            </p>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive" data-ocid="admin_login.error_state">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4"
          >
            {/* Email field */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-email"
                className="text-sm font-medium text-foreground"
              >
                Admin Email
              </label>
              <Input
                id="admin-email"
                data-ocid="admin_login.email_input"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoFocus
                autoComplete="username"
                required
              />
            </div>

            {/* Password field */}
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
                  data-ocid="admin_login.password_input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  autoComplete="current-password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
              data-ocid="admin_login.submit_button"
              type="submit"
              className="w-full"
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
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

          {/* Back link */}
          <div className="text-center">
            <button
              type="button"
              data-ocid="admin_login.back_button"
              onClick={() => navigate({ to: "/" })}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
            >
              Back to main site
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-xs text-muted-foreground border-t border-border">
        <div className="flex items-center justify-center gap-1.5">
          <Train className="w-3 h-3 text-orange-500" />
          <span>RailMutual Connect — Admin access is restricted.</span>
        </div>
      </footer>
    </div>
  );
}
